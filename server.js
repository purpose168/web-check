
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import historyApiFallback from 'connect-history-api-fallback';

// 从 .env 文件加载环境变量
dotenv.config();

// 创建 Express 应用实例
const app = express();

// 获取当前文件的绝对路径和所在目录
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// 服务器运行端口，默认为 3000
const port = process.env.PORT || 3000;
// API 目录名称，包含所有的 Lambda 函数（API 端点）
const API_DIR = '/api';
// Lambda 函数目录的完整路径
const dirPath = path.join(__dirname, API_DIR);
// GUI 构建产物的路径
const guiPath = path.join(__dirname, 'dist', 'client');
// 占位符页面文件路径（用于错误提示）
const placeholderFilePath = path.join(__dirname, 'public', 'placeholder.html');
// 存储所有 API 端点的处理函数
const handlers = {};
// 设置环境变量，告知中间件以非 Lambda 模式运行
process.env.WC_SERVER = 'true';

// 启用 CORS（跨域资源共享），允许来自指定源的请求
app.use(cors({
  // 如果未设置 API_CORS_ORIGIN 环境变量，则允许所有来源的请求
  origin: process.env.API_CORS_ORIGIN || '*',
}));

// 定义不同时间窗口内的最大请求次数限制
const limits = [
  // 10 分钟内最多 100 次请求
  { timeFrame: 10 * 60, max: 100, messageTime: '10 minutes' },
  // 1 小时内最多 250 次请求
  { timeFrame: 60 * 60, max: 250, messageTime: '1 hour' },
  // 12 小时内最多 500 次请求
  { timeFrame: 12 * 60 * 60, max: 500, messageTime: '12 hours' },
];

// 构造当用户被限流时返回的错误消息
const makeLimiterResponseMsg = (retryAfter) => {
  const why = '此限制确保服务能够为所有用户平稳运行。'
  + '您可以通过运行自己的 Web Check 实例来绕过这些限制。';
  return `您已被限流，请在 ${retryAfter} 秒后重试。\n${why}`;
};

// 为每个时间窗口创建速率限制器
const limiters = limits.map(limit => rateLimit({
  windowMs: limit.timeFrame * 1000, // 时间窗口（毫秒）
  max: limit.max, // 该时间窗口内的最大请求次数
  standardHeaders: true, // 在响应头中返回标准化的速率限制信息
  legacyHeaders: false, // 不使用旧版响应头
  message: { error: makeLimiterResponseMsg(limit.messageTime) } // 超出限制时的错误消息
}));

// 如果启用了速率限制功能，则将限制器应用到 /api 端点
if (process.env.API_ENABLE_RATE_LIMIT === 'true') {
  app.use(API_DIR, limiters);
}

// 读取并注册每个 API 函数为 Express 路由
fs.readdirSync(dirPath, { withFileTypes: true })
  .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js')) // 只处理 .js 文件
  .forEach(async dirent => {
    const routeName = dirent.name.split('.')[0]; // 从文件名提取路由名称（去掉 .js 扩展名）
    const route = `${API_DIR}/${routeName}`; // 构造完整的路由路径

    // 动态导入 API 处理模块
    const handlerModule = await import(path.join(dirPath, dirent.name));
    const handler = handlerModule.default || handlerModule; // 获取默认导出或模块本身
    handlers[route] = handler; // 将处理函数存储到 handlers 对象中

    // 为每个路由创建 GET 端点
    app.get(route, async (req, res) => {
      try {
        await handler(req, res); // 执行处理函数
      } catch (err) {
        res.status(500).json({ error: err.message }); // 捕获错误并返回 500 状态码
      }
    });
  });

// 渲染占位符页面（用于显示错误或状态信息）
const renderPlaceholderPage = async (res, msgId, logs) => {
  const errorMessages = {
    // GUI 应用尚未编译的错误消息
    notCompiled: 'GUI 应用尚未编译。<br />'
    + '请运行 <code>yarn build</code> 进行编译，然后重启服务器。',
    // 服务端渲染（SSR）处理器未找到的错误消息
    notCompiledSsrHandler: '服务端渲染启动失败，因为未找到 SSR 处理器。<br />'
    + '可以通过运行 <code>yarn build</code> 来修复此问题，然后重启服务器。<br />',
    // GUI 被禁用时的消息
    disabledGui:  'Web-Check API 已启动并运行！<br />请访问 '
    + `<a href="${API_DIR}"><code>${API_DIR}</code></a> 获取 API 端点`,
  };
  // 如果有日志输出，则将其添加到错误消息中
  const logOutput = logs ? `<div class="logs"><code>${logs}</code></div>` : '';
  // 获取对应的错误消息，如果没有则使用默认消息
  const errorMessage = (errorMessages[msgId] || '发生未知错误。') + logOutput;
  // 读取占位符页面模板
  const placeholderContent = await fs.promises.readFile(placeholderFilePath, 'utf-8');
  // 将错误消息插入到模板中
  const htmlContent = placeholderContent.replace('<!-- CONTENT -->', errorMessage );
  // 返回 500 状态码和渲染后的 HTML
  res.status(500).send(htmlContent);
};

// 创建一个单一的 API 端点，用于执行所有 lambda 函数
app.get(API_DIR, async (req, res) => {
  const results = {}; // 存储所有 API 端点的执行结果
  const { url } = req.query; // 从查询参数中获取目标 URL
  const maxExecutionTime = process.env.API_TIMEOUT_LIMIT || 20000; // 最大执行时间（毫秒），默认 20 秒

  // 执行单个处理函数并返回结果
  const executeHandler = async (handler, req) => {
    return new Promise(async (resolve, reject) => {
      try {
        // 创建模拟的响应对象，用于捕获处理函数的输出
        const mockRes = {
          status: () => mockRes,
          json: (body) => resolve({ body }),
        };
        await handler({ ...req, query: { url } }, mockRes);
      } catch (err) {
        reject(err);
      }
    });
  };

  // 创建超时 Promise，用于防止处理函数执行时间过长
  const timeout = (ms, jobName = null) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(
          `在 ${ms/1000} 秒后超时${jobName ? `，执行任务：${jobName}` : ''}`
        ));
      }, ms);
    });
  };

  // 并行执行所有处理函数，每个函数都有超时限制
  const handlerPromises = Object.entries(handlers).map(async ([route, handler]) => {
    const routeName = route.replace(`${API_DIR}/`, ''); // 提取路由名称

    try {
      // 使用 Promise.race 在执行结果和超时之间竞争
      const result = await Promise.race([
        executeHandler(handler, req, res),
        timeout(maxExecutionTime, routeName)
      ]);
      results[routeName] = result.body; // 存储执行结果
    } catch (err) {
      results[routeName] = { error: err.message }; // 存储错误信息
    }
  });

  // 等待所有处理函数执行完成
  await Promise.all(handlerPromises);
  res.json(results); // 返回所有结果
});

// 为自托管用户跳过营销主页，直接跳转到检查页面
app.use((req, res, next) => {
  if (req.path === '/' && process.env.BOSS_SERVER !== 'true' && !process.env.DISABLE_GUI) {
    req.url = '/check';
  }
  next();
});

// 提供 GUI 服务 - 如果构建目录存在且启用了 GUI 功能
if (process.env.DISABLE_GUI && process.env.DISABLE_GUI !== 'false') {
  // 如果 GUI 被禁用，则显示占位符页面
  app.get('/', async (req, res) => {
    renderPlaceholderPage(res, 'disabledGui');
  });
} else if (!fs.existsSync(guiPath)) {
  // 如果构建目录不存在，则显示未编译的错误页面
  app.get('/', async (req, res) => {
    renderPlaceholderPage(res, 'notCompiled');
  });
} else { // GUI 已启用且构建文件存在，开始服务！
  // 提供静态文件服务
  app.use(express.static('dist/client/'));
  // 处理服务端渲染（SSR）
  app.use(async (req, res, next) => {
    const ssrHandlerPath = path.join(__dirname, 'dist', 'server', 'entry.mjs');
    import(ssrHandlerPath).then(({ handler: ssrHandler }) => {
      ssrHandler(req, res, next); // 执行 SSR 处理器
    }).catch(async err => {
      renderPlaceholderPage(res, 'notCompiledSsrHandler', err.message); // SSR 失败时显示错误页面
    });
  });
}

// Handle SPA routing
app.use(historyApiFallback({
  rewrites: [
    { from: new RegExp(`^${API_DIR}/.*$`), to: (context) => context.parsedUrl.path },
    { from: /^.*$/, to: '/index.html' }
  ]
}));

// 处理所有未处理的请求（非 API 端点），返回 404 错误页面
app.use((req, res, next) => {
  if (!req.path.startsWith(`${API_DIR}/`)) {
    res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
  } else {
    next();
  }
});

// 向用户打印欢迎消息
const printMessage = () => {
  console.log(
    `\x1b[36m\n` +
    '    __      __   _         ___ _           _   \n' +
    '    \\ \\    / /__| |__ ___ / __| |_  ___ __| |__\n' +
    '     \\ \\/\\/ / -_) \'_ \\___| (__| \' \\/ -_) _| / /\n' +
    '      \\_/\\_/\\___|_.__/    \\___|_||_\\___\\__|_\\_\\\n' +
    `\x1b[0m\n`,
    `\x1b[1m\x1b[32m🚀 Web-Check 已启动并运行在 http://localhost:${port} \x1b[0m\n\n`,
    `\x1b[2m\x1b[36m🛟 如需文档和支持，请访问 GitHub 仓库：` +
    `https://github.com/lissy93/web-check \n`,
    `💖 觉得 Web-Check 有用吗？考虑在 GitHub 上赞助我们，` +
    `以帮助资助维护和开发工作。\x1b[0m`
  );
};

// 创建服务器并监听指定端口
app.listen(port, () => {
  printMessage(); // 打印欢迎消息
});

