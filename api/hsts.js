// 导入 Node.js 的 HTTPS 模块，用于发送 HTTPS 请求
import https from 'https';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// HSTS（HTTP 严格传输安全）处理器函数
// HSTS 是一种安全机制，强制浏览器使用 HTTPS 协议与网站通信
// 参数:
//   - url: 要检查的目标 URL 地址
//   - event: 请求事件对象（由中间件传递）
//   - context: 请求上下文对象（由中间件传递）
// 返回: Promise，解析为 HSTS 兼容性检查结果
const hstsHandler = async (url, event, context) => {
  // 错误响应构造函数
  // 参数:
  //   - message: 错误消息
  //   - statusCode: HTTP 状态码，默认为 500
  // 返回: 包含状态码和错误信息的对象
  const errorResponse = (message, statusCode = 500) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify({ error: message }),
    };
  };

  // HSTS 兼容性结果构造函数
  // 参数:
  //   - message: 结果消息
  //   - compatible: 是否与 HSTS 预加载列表兼容，默认为 false
  //   - hstsHeader: HSTS 标头内容，默认为 null
  // 返回: 包含检查结果的对象
  const hstsIncompatible = (message, compatible = false, hstsHeader = null ) => {
    return { message, compatible, hstsHeader };
  };


  // 返回 Promise 以处理异步 HTTPS 请求
  return new Promise((resolve, reject) => {
    // 发起 HTTPS 请求
    // 参数:
    //   - url: 目标 URL
    //   - 回调函数: 接收响应对象 res
    const req = https.request(url, res => {
      // 获取响应头对象
      const headers = res.headers;
      // 提取 Strict-Transport-Security（HSTS）标头
      // 该标头告诉浏览器只使用 HTTPS 与该网站通信
      const hstsHeader = headers['strict-transport-security'];

      // 如果没有 HSTS 标头
      if (!hstsHeader) {
        // 返回不兼容结果：网站不提供任何 HSTS 标头
        resolve(hstsIncompatible(`网站不提供任何HSTS标头。`));
      } else {
        // 解析 HSTS 标头内容
        // 提取 max-age 值（指定 HSTS 策略的有效期，单位为秒）
        const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
        // 检查是否包含 includeSubDomains 指令（将 HSTS 策略应用于所有子域）
        const includesSubDomains = hstsHeader.includes('includeSubDomains');
        // 检查是否包含 preload 指令（允许网站被加入浏览器的 HSTS 预加载列表）
        const preload = hstsHeader.includes('preload');

        // 验证 HSTS 标头是否符合预加载列表要求
        // 要求 1: max-age 必须存在且至少为 10886400 秒（约 126 天）
        if (!maxAgeMatch || parseInt(maxAgeMatch[1]) < 10886400) {
          // 返回不兼容结果：max-age 值太小
          resolve(hstsIncompatible(`HSTS max-age小于10886400。`));
        }
        // 要求 2: 必须包含 includeSubDomains 指令
        else if (!includesSubDomains) {
          // 返回不兼容结果：缺少 includeSubDomains 指令
          resolve(hstsIncompatible(`HSTS标头不包含所有子域。`));
        }
        // 要求 3: 必须包含 preload 指令
        else if (!preload) {
          // 返回不兼容结果：缺少 preload 指令
          resolve(hstsIncompatible(`HSTS标头不包含preload指令。`));
        }
        // 所有要求都满足
        else {
          // 返回兼容结果：网站与 HSTS 预加载列表兼容
          resolve(hstsIncompatible(`网站与HSTS预加载列表兼容！`, true, hstsHeader));
        }
      }
    });

    // 监听请求错误事件
    // 如果请求过程中发生错误（如 DNS 解析失败、连接超时等）
    req.on('error', (error) => {
      // 返回错误响应
      resolve(errorResponse(`发出请求时出错：${error.message}`));
    });

    // 结束请求，发送数据
    req.end();
  });
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回 HSTS 兼容性检查结果
export const handler = middleware(hstsHandler);
// 默认导出处理函数
export default handler;
