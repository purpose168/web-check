// 导入 puppeteer-core 库，这是一个无头浏览器控制库
// puppeteer-core 是 Puppeteer 的轻量版本，不包含 Chromium，需要手动指定浏览器路径
import puppeteer from 'puppeteer-core';

// 导入 chrome-aws-lambda 库，用于在 AWS Lambda 环境中运行 Chromium
// 该库提供了预编译的 Chromium 二进制文件和启动参数
import chromium from 'chrome-aws-lambda';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 导入 child_process 模块的 execFile 函数
// execFile 用于执行外部程序，这里用于直接调用 Chromium 浏览器
import { execFile } from 'child_process';

// 导入 fs 模块的 promises API
// 用于异步文件操作，如读取和删除截图文件
import { promises as fs } from 'fs';

// 导入 path 模块，用于处理文件路径
// 提供跨平台的路径操作功能
import path from 'path';

// 导入 uuid 库，用于生成唯一的文件名
// v4 方法生成基于随机数的 UUID（通用唯一识别码）
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;

// 直接使用 Chromium 浏览器进行截图的辅助函数（作为备用方案）
// 功能：通过命令行直接调用 Chromium 浏览器进行网页截图
// 参数:
//   - url: 要截图的网页 URL
// 返回: Promise，解析为截图的 Base64 编码字符串
// 异常: 如果截图失败，拒绝 Promise 并返回错误对象
const directChromiumScreenshot = async (url) => {
  // 输出日志：开始直接截图流程
  console.log(`[DIRECT-SCREENSHOT] Starting direct screenshot process for URL: ${url}`);
  
  // 创建临时文件名
  // 使用 UUID 确保文件名唯一，避免文件名冲突
  const tmpDir = '/tmp';
  const uuid = uuidv4();
  const screenshotPath = path.join(tmpDir, `screenshot-${uuid}.png`);
  
  // 输出日志：截图保存路径
  console.log(`[DIRECT-SCREENSHOT] Will save screenshot to: ${screenshotPath}`);
  
  // 返回 Promise 对象，用于异步处理截图流程
  return new Promise((resolve, reject) => {
    // 获取 Chromium 浏览器路径
    // 优先使用环境变量 CHROME_PATH，否则使用默认路径 /usr/bin/chromium
    const chromePath = process.env.CHROME_PATH || '/usr/bin/chromium';
    
    // 构建 Chromium 启动参数
    const args = [
      '--headless',              // 无头模式，不显示浏览器界面
      '--disable-gpu',            // 禁用 GPU 加速（在无头环境中通常需要）
      '--no-sandbox',             // 禁用沙箱模式（在某些环境中需要）
      `--screenshot=${screenshotPath}`,  // 指定截图保存路径
      url                        // 要访问的 URL
    ];

    // 输出日志：即将执行的命令
    console.log(`[DIRECT-SCREENSHOT] Executing: ${chromePath} ${args.join(' ')}`);
    
    // 使用 execFile 执行 Chromium 浏览器
    // execFile 比 exec 更安全，因为它不会调用 shell
    execFile(chromePath, args, async (error, stdout, stderr) => {
      // 如果执行出错，拒绝 Promise
      if (error) {
        console.error(`[DIRECT-SCREENSHOT] Chromium error: ${error.message}`);
        return reject(error);
      }
  
      try {
        // 读取截图文件
        const screenshotData = await fs.readFile(screenshotPath);
        console.log(`[DIRECT-SCREENSHOT] Screenshot read successfully`);
        
        // 将截图数据转换为 Base64 编码
        // Base64 编码可以将二进制数据转换为文本，便于在 JSON 中传输
        const base64Data = screenshotData.toString('base64');
  
        // 删除临时截图文件
        // 使用 .catch() 防止删除失败影响主流程
        await fs.unlink(screenshotPath).catch(err =>
          console.warn(`[DIRECT-SCREENSHOT] Failed to delete temp file: ${err.message}`)
        );
  
        // 解析 Promise，返回 Base64 编码的截图数据
        resolve(base64Data);
      } catch (readError) {
        // 如果读取文件失败，拒绝 Promise
        console.error(`[DIRECT-SCREENSHOT] Failed reading screenshot: ${readError.message}`);
        reject(readError);
      }
    });
  });
};

// 截图处理函数
// 功能：为指定 URL 生成网页截图
// 参数:
//   - targetUrl: 要截图的网页 URL 字符串
// 返回: 包含截图数据的对象
//   格式: { image: 'base64编码的截图数据' }
// 异常: 如果截图失败，抛出包含错误信息的 Error 对象
const screenshotHandler = async (targetUrl) => {
  // 输出日志：收到截图请求
  console.log(`[SCREENSHOT] Request received for URL: ${targetUrl}`);
  
  // 检查 URL 参数是否存在
  if (!targetUrl) {
    console.error('[SCREENSHOT] URL is missing from queryStringParameters');
    throw new Error('URL is missing from queryStringParameters');
  }
  
  // 如果 URL 缺少协议前缀，默认添加 http://
  // 许多用户可能只输入域名（如 example.com），需要补全协议
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'http://' + targetUrl;
  }
  
  // 验证 URL 格式是否有效
  // URL 构造函数会抛出异常如果格式不正确
  try {
    new URL(targetUrl);
  } catch (error) {
    console.error(`[SCREENSHOT] URL provided is invalid: ${targetUrl}`);
    throw new Error('URL provided is invalid');
  }

  // 首先尝试使用直接 Chromium 方法截图
  // 这种方法更简单、更快速，适合大多数场景
  try {
    console.log(`[SCREENSHOT] Using direct Chromium method for URL: ${targetUrl}`);
    const base64Screenshot = await directChromiumScreenshot(targetUrl);
    console.log(`[SCREENSHOT] Direct screenshot successful`);
    return { image: base64Screenshot };
  } catch (directError) {
    // 如果直接方法失败，记录错误并尝试 Puppeteer 方法
    console.error(`[SCREENSHOT] Direct screenshot method failed: ${directError.message}`);
    console.log(`[SCREENSHOT] Falling back to puppeteer method...`);
  }
  
  // 备用方案：使用 Puppeteer 库进行截图
  // Puppeteer 提供更精细的控制，但启动较慢
  let browser = null;
  try {
    // 输出日志：启动 Puppeteer 浏览器
    console.log(`[SCREENSHOT] Launching puppeteer browser`);
    
    // 启动无头浏览器
    browser = await puppeteer.launch({
      // 合并 Chromium 的默认参数，并添加 --no-sandbox 标志
      args: [...chromium.args, '--no-sandbox'],
      
      // 设置默认视口大小（浏览器窗口大小）
      // 宽度 800 像素，高度 600 像素
      defaultViewport: { width: 800, height: 600 },
      
      // 指定 Chromium 可执行文件路径
      // 优先使用环境变量 CHROME_PATH，否则使用默认路径
      executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
      
      // 启用无头模式（不显示浏览器界面）
      headless: true,
      
      // 忽略 HTTPS 证书错误
      // 在测试环境中，自签名证书可能会导致截图失败
      ignoreHTTPSErrors: true,
      
      // 忽略默认参数中的 --disable-extensions
      // 某些扩展可能会影响截图
      ignoreDefaultArgs: ['--disable-extensions'],
    });
    
    // 输出日志：创建新页面
    console.log(`[SCREENSHOT] Creating new page`);
    let page = await browser.newPage();
    
    // 输出日志：设置页面偏好
    console.log(`[SCREENSHOT] Setting page preferences`);
    
    // 模拟媒体特性：设置为深色模式
    // 这会影响网页的颜色显示，使其在深色主题下渲染
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    
    // 设置页面导航超时时间为 8000 毫秒（8 秒）
    // 如果页面加载超过 8 秒，将抛出超时错误
    page.setDefaultNavigationTimeout(8000);
    
    // 输出日志：导航到目标 URL
    console.log(`[SCREENSHOT] Navigating to URL: ${targetUrl}`);
    
    // 导航到目标 URL
    // waitUntil: 'domcontentloaded' 表示等待 DOM 内容加载完成
    // 这比 'load' 更快，因为不需要等待所有资源（如图片）加载完成
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    
    // 输出日志：检查 body 元素是否存在
    console.log(`[SCREENSHOT] Checking if body element exists`);
    
    // 在页面上下文中执行 JavaScript 代码
    // 检查 body 元素是否存在，确保页面已正确渲染
    await page.evaluate(() => {
      const selector = 'body';
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (!element) {
          reject(new Error(`Error: No element found with selector: ${selector}`));
        }
        resolve();
      });
    });
    
    // 输出日志：开始截图
    console.log(`[SCREENSHOT] Taking screenshot`);
    
    // 对当前页面进行截图
    // 返回 Buffer 对象，包含截图的二进制数据
    const screenshotBuffer = await page.screenshot();
    
    // 输出日志：转换截图数据为 Base64
    console.log(`[SCREENSHOT] Converting screenshot to base64`);
    
    // 将截图 Buffer 转换为 Base64 编码字符串
    const base64Screenshot = screenshotBuffer.toString('base64');
    
    // 输出日志：截图完成，返回图片数据
    console.log(`[SCREENSHOT] Screenshot complete, returning image`);
    
    // 返回包含截图数据的对象
    return { image: base64Screenshot };
  } catch (error) {
    // 捕获 Puppeteer 截图过程中的错误
    console.error(`[SCREENSHOT] Puppeteer screenshot failed: ${error.message}`);
    throw error;
  } finally {
    // 无论成功或失败，都关闭浏览器
    // 释放系统资源
    if (browser !== null) {
      console.log(`[SCREENSHOT] Closing browser`);
      await browser.close();
    }
  }
};

// 使用中间件包装截图处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(screenshotHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './screenshot.js' 导入
export default handler;
