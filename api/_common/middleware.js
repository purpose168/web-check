// 规范化 URL 的函数
// 如果 URL 没有以 http 或 https 开头，则自动添加 https:// 前缀
// 这样可以确保所有 URL 都有完整的协议前缀
const normalizeUrl = (url) => {
  return url.startsWith('http') ? url : `https://${url}`;
};

// 如果存在环境变量 API_TIMEOUT_LIMIT，则设置较短的 API 请求超时时间
// 否则使用默认值 60000 毫秒（60 秒）
// parseInt 的第二个参数 10 表示使用十进制解析
const TIMEOUT = process.env.API_TIMEOUT_LIMIT ? parseInt(process.env.API_TIMEOUT_LIMIT, 10) : 60000;

// 如果存在环境变量 API_CORS_ORIGIN，则设置允许的 CORS 来源
// 否则允许所有来源（'*'）
// CORS（跨域资源共享）用于控制哪些域名可以访问 API
const ALLOWED_ORIGINS = process.env.API_CORS_ORIGIN || '*';

// 禁用所有功能 :( 设置此环境变量将关闭实例并显示消息
// 双重否定运算符 !! 将值转换为布尔值
// 这在需要临时关闭服务时很有用
const DISABLE_EVERYTHING = !!process.env.VITE_DISABLE_EVERYTHING;

// 设置当前使用的平台
// 默认为 NETLIFY，但会根据环境变量自动检测
let PLATFORM = 'NETLIFY';
// 如果设置了 PLATFORM 环境变量，则使用该值并转换为大写
if (process.env.PLATFORM) { PLATFORM = process.env.PLATFORM.toUpperCase(); }
// 如果检测到 VERCEL 环境变量，则平台设置为 VERCEL
else if (process.env.VERCEL) { PLATFORM = 'VERCEL'; }
// 如果检测到 WC_SERVER 环境变量，则平台设置为 NODE（自定义服务器）
else if (process.env.WC_SERVER) { PLATFORM = 'NODE'; }

// 定义每个响应要返回的 HTTP 头
const headers = {
  // 允许跨域请求的来源
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
  // 允许在请求中包含凭证（如 cookies）
  'Access-Control-Allow-Credentials': true,
  // 响应内容类型为 JSON，字符编码为 UTF-8
  'Content-Type': 'application/json;charset=UTF-8',
};

// 超时错误消息
// 当请求超时时返回给用户的友好提示
const timeoutErrorMsg = '您可以通过点击"重试"按钮重新触发此请求\n'
+ '如果您运行自己的 Web Check 实例，可以通过将 '
+ '`API_TIMEOUT_LIMIT` 环境变量设置为更高的值（以毫秒为单位）来解决这个问题，'
+ '或者如果您在 Vercel 上托管，可以在 vercel.json 中增加 maxDuration。\n\n'
+ `公共实例当前的超时时间为 ${TIMEOUT}ms，`
+ '为了保持运行成本可控，使 Web Check 能够免费提供给所有人使用。';

// 禁用错误消息
// 当服务被临时禁用时返回给用户的提示
const disabledErrorMsg = '错误 - WebCheck 临时禁用。\n\n'
+ '很抱歉，由于运行 Web Check 的成本增加，'
+ '我们不得不暂时禁用公共实例。'
+ '我们正在积极寻找负担得起的方式来保持 Web Check 运行，'
+ '同时保持对所有人免费。\n'
+ '在此期间，由于我们的代码是免费和开源的，'
+ '您可以按照我们 GitHub 仓库中的说明在自己的系统上运行 Web Check';

// 一个由所有平台上所有 API 路由使用的中间件函数
// 该函数接收一个处理函数（handler）作为参数，返回一个适配当前平台的处理函数
const commonMiddleware = (handler) => {

  // 创建超时 Promise，如果请求耗时过长则抛出错误
  // Promise.race 用于在处理函数和超时 Promise 之间竞争
  // 哪个先完成就使用哪个的结果
  const createTimeoutPromise = (timeoutMs) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        // 超时后拒绝 Promise，抛出错误
        reject(new Error(`Request timed-out after ${timeoutMs} ms`));
      }, timeoutMs);
    });
  };

  // Vercel 平台的处理函数
  // Vercel 使用 Express 风格的请求/响应对象
  const vercelHandler = async (request, response) => {

    // 如果服务被禁用，返回 503 服务不可用状态
    if (DISABLE_EVERYTHING) {
      response.status(503).json({ error: disabledErrorMsg });
    }

    // 从请求中获取查询参数
    const queryParams = request.query || {};
    // 获取原始 URL 参数
    const rawUrl = queryParams.url;

    // 如果没有提供 URL，返回 500 错误
    if (!rawUrl) {
      return response.status(500).json({ error: 'No URL specified' });
    }

    // 规范化 URL（确保有协议前缀）
    const url = normalizeUrl(rawUrl);

    try {
      // 使用 Promise.race 在处理函数和超时 Promise 之间竞争
      // 如果处理函数先完成，返回结果；如果超时先触发，抛出错误
      const handlerResponse = await Promise.race([
        handler(url, request),
        createTimeoutPromise(TIMEOUT)
      ]);

      // 如果响应包含 body 和 statusCode 字段，直接返回
      if (handlerResponse.body && handlerResponse.statusCode) {
        response.status(handlerResponse.statusCode).json(handlerResponse.body);
      } else {
        // 否则，将响应转换为 JSON 格式并返回
        response.status(200).json(
          typeof handlerResponse === 'object' ? handlerResponse : JSON.parse(handlerResponse)
        );
      }
    } catch (error) {
      // 错误处理
      let errorCode = 500;
      // 如果错误消息包含"timed-out"或响应状态码为 504，则返回 408 请求超时
      if (error.message.includes('timed-out') || response.statusCode === 504) {
        errorCode = 408;
        // 在错误消息后添加超时提示信息
        error.message = `${error.message}\n\n${timeoutErrorMsg}`;
      }
      // 返回错误响应
      response.status(errorCode).json({ error: error.message });
    }
  };

  // Netlify 平台的处理函数
  // Netlify 使用事件、上下文和回调函数的模式
  const netlifyHandler = async (event, context, callback) => {
    // 从事件中获取查询参数
    const queryParams = event.queryStringParameters || event.query || {};
    // 获取原始 URL 参数
    const rawUrl = queryParams.url;

    // 如果服务被禁用，返回 503 服务不可用状态
    if (DISABLE_EVERYTHING) {
      callback(null, {
        statusCode: 503,
        body: JSON.stringify({ error: 'Web-Check is temporarily disabled. Please try again later.' }),
        headers,
      });
      return;
    }

    // 如果没有提供 URL，返回 500 错误
    if (!rawUrl) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: 'No URL specified' }),
        headers,
      });
      return;
    }

    // 规范化 URL（确保有协议前缀）
    const url = normalizeUrl(rawUrl);

    try {
      // 使用 Promise.race 在处理函数和超时 Promise 之间竞争
      const handlerResponse = await Promise.race([
        handler(url, event, context),
        createTimeoutPromise(TIMEOUT)
      ]);

      // 如果响应包含 body 和 statusCode 字段，直接返回
      if (handlerResponse.body && handlerResponse.statusCode) {
        callback(null, handlerResponse);
      } else {
        // 否则，将响应转换为 JSON 格式并返回
        callback(null, {
          statusCode: 200,
          body: typeof handlerResponse === 'object' ? JSON.stringify(handlerResponse) : handlerResponse,
          headers,
        });
      }
    } catch (error) {
      // 错误处理，返回 500 错误
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
        headers,
      });
    }
  };

  // 处理函数的格式在不同平台之间有所不同
  // Vercel 和 Node 使用 Express 风格（请求/响应对象）
  // Netlify 使用事件/上下文/回调模式
  const nativeMode = (['VERCEL', 'NODE'].includes(PLATFORM));
  // 根据平台返回相应的处理函数
  return nativeMode ? vercelHandler : netlifyHandler;
};

// 如果平台是 NETLIFY，使用 CommonJS 模块导出
if (PLATFORM === 'NETLIFY') {
  module.exports = commonMiddleware;
}

// 默认使用 ES6 模块导出
export default commonMiddleware;
