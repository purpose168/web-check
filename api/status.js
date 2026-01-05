// 导入 Node.js 内置的 https 模块
// https 模块提供了 HTTPS（HTTP Secure）协议的实现
// HTTPS 是 HTTP 协议的安全版本，通过 TLS/SSL 加密保护数据传输
import https from 'https';

// 导入 Node.js 内置的 perf_hooks 模块中的 performance 和 PerformanceObserver
// perf_hooks 模块提供了性能测量和监控功能
// performance: 提供高精度的时间测量 API
// PerformanceObserver: 用于观察和收集性能指标
import { performance, PerformanceObserver } from 'perf_hooks';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 网站状态检查处理函数
// 功能：检查指定网站的可用性，并测量 DNS 查询时间、响应时间和 HTTP 状态码
// 参数:
//   - url: 要检查的网站 URL 字符串（必须包含协议，如 https://example.com）
// 返回: Promise，解析为状态信息对象
//   成功格式: {
//     isUp: true,                    // 网站是否可访问
//     dnsLookupTime: 123.45,         // DNS 查询时间（毫秒）
//     responseTime: 456.78,          // HTTP 响应时间（毫秒）
//     responseCode: 200              // HTTP 状态码
//   }
//   异常: 如果检查失败，抛出错误
const statusHandler = async (url) => {
  // 验证 URL 参数是否存在
  if (!url) {
    // 如果未提供 URL，抛出错误
    throw new Error('You must provide a URL query parameter!');
  }

  // 声明变量用于存储性能指标
  let dnsLookupTime;    // DNS 查询时间（毫秒）
  let responseCode;     // HTTP 响应状态码
  let startTime;        // 请求开始时间戳

  // 创建性能观察器（PerformanceObserver）
  // PerformanceObserver 用于监听和收集性能指标
  // 它可以测量特定操作（如 DNS 查询）的执行时间
  const obs = new PerformanceObserver((items) => {
    // 从性能条目中获取第一个条目的持续时间
    // items.getEntries() 返回所有性能条目的数组
    // [0] 获取第一个条目，duration 获取持续时间（毫秒）
    dnsLookupTime = items.getEntries()[0].duration;
    
    // 清除所有性能标记
    // performance.clearMarks() 清除之前创建的所有性能标记点
    // 这有助于避免内存泄漏和性能指标污染
    performance.clearMarks();
  });

  // 配置性能观察器监听 'measure' 类型的性能条目
  // 'measure' 类型是通过 performance.measure() 创建的测量条目
  // 这些条目记录两个标记点之间的时间差
  obs.observe({ entryTypes: ['measure'] });

  // 创建性能标记 'A'，标记请求开始时间点
  // performance.mark() 创建一个命名的性能标记点
  // 标记点用于后续测量两个时间点之间的持续时间
  performance.mark('A');

  try {
    // 记录请求开始的高精度时间戳
    // performance.now() 返回自进程启动以来的高精度时间（毫秒）
    // 这个时间比 Date.now() 更精确，适合测量短时间间隔
    startTime = performance.now();
    
    // 发起 HTTPS 请求并等待响应
    // 使用 Promise 包装异步的 https.get() 方法
    const response = await new Promise((resolve, reject) => {
      // 使用 https.get() 发起 HTTPS GET 请求
      // https.get() 是 Node.js 内置的发起 HTTPS GET 请求的便捷方法
      const req = https.get(url, res => {
        // 初始化数据缓冲区
        let data = '';
        
        // 保存 HTTP 响应状态码
        // res.statusCode 是服务器返回的 HTTP 状态码
        // 常见状态码：
        //   200 OK - 请求成功
        //   301/302 - 重定向
        //   404 Not Found - 资源未找到
        //   500 Internal Server Error - 服务器内部错误
        responseCode = res.statusCode;
        
        // 监听 'data' 事件，接收响应数据块
        // res.on('data', ...) 在接收到数据块时触发
        // chunk 是接收到的数据块（Buffer 对象）
        res.on('data', chunk => {
          // 将数据块追加到数据缓冲区
          // chunk.toString() 将 Buffer 转换为字符串
          data += chunk;
        });
        
        // 监听 'end' 事件，表示响应数据接收完毕
        // res.on('end', ...) 在所有数据接收完成后触发
        res.on('end', () => {
          // 解析 Promise，返回响应对象
          resolve(res);
        });
      });

      // 监听请求的 'error' 事件
      // req.on('error', ...) 在请求过程中发生错误时触发
      // 常见错误：DNS 解析失败、连接超时、网络错误等
      req.on('error', reject);
      
      // 结束请求
      // req.end() 完成请求的发送
      // 对于 GET 请求，调用 end() 表示请求体发送完毕
      req.end();
    });

    // 验证 HTTP 响应状态码是否在成功范围内
    // HTTP 状态码分类：
    //   2xx (200-299): 成功 - 请求已成功接收、理解并接受
    //   3xx (300-399): 重定向 - 需要进一步操作以完成请求
    //   4xx (400-499): 客户端错误 - 请求包含错误或无法完成
    //   5xx (500-599): 服务器错误 - 服务器无法完成有效请求
    if (responseCode < 200 || responseCode >= 400) {
      // 如果状态码不在成功范围内，抛出错误
      throw new Error(`Received non-success response code: ${responseCode}`);
    }

    // 创建性能标记 'B'，标记请求结束时间点
    // 这个标记点与标记 'A' 一起用于测量 DNS 查询时间
    performance.mark('B');
    
    // 测量标记 'A' 到标记 'B' 之间的时间差
    // performance.measure() 创建一个测量条目，记录两个标记点之间的持续时间
    // 这个持续时间大致对应 DNS 查询时间
    performance.measure('A to B', 'A', 'B');
    
    // 计算总响应时间
    // performance.now() 获取当前时间，减去 startTime 得到总响应时间
    // 这个时间包括 DNS 查询、TCP 连接、TLS 握手、HTTP 请求和响应的完整时间
    let responseTime = performance.now() - startTime;
    
    // 断开性能观察器
    // obs.disconnect() 停止观察性能条目，释放资源
    // 避免内存泄漏和不必要的性能开销
    obs.disconnect();

    // 返回状态信息对象
    // isUp: true 表示网站可访问
    // dnsLookupTime: DNS 查询时间（毫秒）
    // responseTime: 总响应时间（毫秒）
    // responseCode: HTTP 状态码
    return { isUp: true, dnsLookupTime, responseTime, responseCode };

  } catch (error) {
    // 捕获请求过程中的错误
    // 断开性能观察器，释放资源
    obs.disconnect();
    
    // 重新抛出错误，让上层处理
    throw error;
  }
};

// 使用中间件包装状态检查处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(statusHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './status.js' 导入
export default handler;
