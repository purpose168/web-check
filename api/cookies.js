// 引入 axios 库，用于发送 HTTP 请求
import axios from 'axios';
// 引入 Puppeteer 库，用于无头浏览器自动化
import puppeteer from 'puppeteer';
// 引入中间件函数，用于跨平台适配和请求处理
import middleware from './_common/middleware.js';

// 使用 Puppeteer 获取客户端 Cookie
// 通过启动无头浏览器访问网站，获取浏览器端设置的 Cookie
// 参数：url - 要访问的网站 URL
// 返回：Promise<Array> - Cookie 对象数组
const getPuppeteerCookies = async (url) => {
  // 启动无头浏览器
  const browser = await puppeteer.launch({
    headless: 'new',  // 使用新的无头模式
    args: ['--no-sandbox', '--disable-setuid-sandbox'],  // 禁用沙箱（在服务器环境中必需）
  });

  try {
    // 创建新的浏览器页面
    const page = await browser.newPage();
    // 导航到目标 URL，等待网络空闲（2秒内没有网络活动）
    const navigationPromise = page.goto(url, { waitUntil: 'networkidle2' });
    // 设置超时 Promise，3秒后超时
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Puppeteer took too long!')), 3000)
    );
    // 使用 Promise.race 在导航和超时之间竞争，先完成的生效
    await Promise.race([navigationPromise, timeoutPromise]);
    // 返回页面上的所有 Cookie
    return await page.cookies();
  } finally {
    // 无论成功或失败，都关闭浏览器
    await browser.close();
  }
};

// Cookie 分析处理函数
// 获取网站的 HTTP 响应头 Cookie 和客户端 Cookie
// 参数：url - 要分析的网站 URL
// 返回：包含两种 Cookie 的对象
const cookieHandler = async (url) => {
  let headerCookies = null;   // HTTP 响应头中的 Cookie
  let clientCookies = null;   // 客户端（浏览器）Cookie

  try {
    // 使用 axios 发送 HTTP GET 请求，获取 HTTP 响应头 Cookie
    const response = await axios.get(url, {
      withCredentials: true,  // 发送凭证（如 Cookie）
      maxRedirects: 5,       // 最多跟随 5 次重定向
    });
    // 从响应头中获取 Set-Cookie 字段
    headerCookies = response.headers['set-cookie'];
  } catch (error) {
    // 错误处理
    if (error.response) {
      // 服务器响应了，但状态码不在 2xx 范围内
      return { error: `Request failed with status ${error.response.status}: ${error.message}` };
    } else if (error.request) {
      // 请求已发送，但没有收到响应
      return { error: `No response received: ${error.message}` };
    } else {
      // 请求设置时出错
      return { error: `Error setting up request: ${error.message}` };
    }
  }

  try {
    // 使用 Puppeteer 获取客户端 Cookie
    clientCookies = await getPuppeteerCookies(url);
  } catch (_) {
    // 如果 Puppeteer 获取失败，设置为 null
    clientCookies = null;
  }

  // 如果两种 Cookie 都不存在，返回跳过信息
  if (!headerCookies && (!clientCookies || clientCookies.length === 0)) {
    return { skipped: 'No cookies' };
  }

  // 返回两种 Cookie
  return { headerCookies, clientCookies };
};

// 使用中间件包装处理函数，实现跨平台适配
// 中间件会处理超时、错误、URL 规范化等通用逻辑
export const handler = middleware(cookieHandler);
// 默认导出处理函数
export default handler;
