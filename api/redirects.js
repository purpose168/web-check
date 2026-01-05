// 导入 got 库，这是一个功能强大的 HTTP 客户端库，用于发送 HTTP 请求
// got 库支持自动重定向、超时控制、请求拦截等高级功能
import got from 'got';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 重定向处理函数
// 功能：跟踪并返回指定 URL 的所有重定向路径
// 参数:
//   - url: 要检查的 URL 字符串
// 返回: 包含重定向路径数组的对象
//   格式: { redirects: [原始URL, 重定向URL1, 重定向URL2, ...] }
// 异常: 如果请求过程中发生错误，抛出包含错误信息的 Error 对象
const redirectsHandler = async (url) => {
  // 初始化重定向数组，包含原始 URL
  // 这个数组将记录从原始 URL 到最终 URL 的所有重定向步骤
  const redirects = [url];
  
  try {
    // 使用 got 库发送 HTTP 请求
    await got(url, {
      // followRedirect: true - 自动跟随重定向
      // 当服务器返回 3xx 状态码时，自动向新的 URL 发送请求
      followRedirect: true,
      
      // maxRedirects: 12 - 最大重定向次数限制
      // 防止无限重定向循环，最多跟随 12 次重定向
      maxRedirects: 12,
      
      // hooks: 钩子函数，用于在请求生命周期的特定阶段执行自定义逻辑
      hooks: {
        // beforeRedirect: 重定向前的钩子函数数组
        // 在每次重定向之前执行，可以捕获重定向信息
        beforeRedirect: [
          // 重定向钩子函数
          // 参数:
          //   - options: 请求选项对象，包含即将发送的请求配置
          //   - response: 响应对象，包含服务器返回的响应信息
          (options, response) => {
            // 将重定向目标 URL 添加到重定向数组中
            // response.headers.location 包含重定向目标 URL
            redirects.push(response.headers.location);
          },
        ],
      },
    });

    // 返回包含完整重定向路径的对象
    return {
      redirects: redirects,
    };
  } catch (error) {
    // 捕获请求过程中的错误
    // 可能的错误包括：网络错误、DNS 解析失败、超时、无效 URL 等
    throw new Error(`Error: ${error.message}`);
  }
};

// 使用中间件包装重定向处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(redirectsHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './redirects.js' 导入
export default handler;
