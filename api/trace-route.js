// 导入 Node.js 内置的 url 模块
// url 模块提供了 URL 解析和处理的实用工具
// 它可以将 URL 字符串解析为对象，也可以将对象转换为 URL 字符串
// 注意：在较新的 Node.js 版本中，推荐使用全局的 URL API（new URL()）
// 但这里使用的是传统的 url 模块，可能是为了兼容性或特定需求
import url from 'url';

// 导入 traceroute 库
// traceroute 是一个用于执行网络路由追踪（Traceroute）的 Node.js 库
// Traceroute 是一个网络诊断工具，用于确定数据包从源主机到目标主机所经过的路径
// 它通过发送具有递增 TTL（Time To Live，生存时间）值的数据包来实现
// 当 TTL 值减到 0 时，路由器会返回 ICMP Time Exceeded 消息
// 这样就可以识别出路径上的每一个路由器（跳，hop）
// Traceroute 的用途包括：
//   - 诊断网络连接问题
//   - 识别网络瓶颈和延迟
//   - 了解网络拓扑结构
//   - 定位网络故障点
import traceroute from 'traceroute';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 网络路由追踪处理函数
// 功能：执行网络路由追踪（Traceroute），确定从本地到目标主机的网络路径
// 参数:
//   - urlString: 要追踪的 URL 字符串（如 https://example.com）
//   - context: 上下文对象（由中间件提供，包含请求信息等）
// 返回: Promise，解析为路由追踪结果对象
//   成功格式: {
//     message: "Traceroute completed!",
//     result: [
//       {
//         hop: 1,                    // 跳数（第几跳）
//         ip: '192.168.1.1',         // 路由器 IP 地址
//         rtt1: 1.234,              // 第一次往返时间（毫秒）
//         rtt2: 1.567,              // 第二次往返时间（毫秒）
//         rtt3: 1.890,              // 第三次往返时间（毫秒）
//       },
//       {
//         hop: 2,
//         ip: '10.0.0.1',
//         rtt1: 5.123,
//         rtt2: 5.456,
//         rtt3: 5.789,
//       },
//       ...更多跳数
//     ]
//   }
//   异常: 如果追踪失败，抛出错误
const traceRouteHandler = async (urlString, context) => {
  // 解析 URL 字符串并获取主机名（hostname）
  // url.parse() 将 URL 字符串解析为 URL 对象
  // URL 对象包含以下属性：
  //   - protocol: 协议（如 'https:'）
  //   - hostname: 主机名（如 'example.com'）
  //   - port: 端口号
  //   - pathname: 路径
  //   - query: 查询字符串
  //   - hash: 哈希值
  //   - 等等
  const urlObject = url.parse(urlString);
  
  // 从 URL 对象中提取主机名
  // hostname 是域名或 IP 地址
  // 例如：https://example.com/path -> 'example.com'
  const host = urlObject.hostname;

  // 验证主机名是否存在
  // 如果没有主机名，说明提供的 URL 无效
  if (!host) {
    // 抛出错误，说明 URL 无效
    throw new Error('Invalid URL provided');
  }

  // 执行路由追踪（Traceroute）
  // 使用 Promise 包装异步的 traceroute.trace() 方法
  // traceroute.trace() 是一个异步操作，使用回调函数返回结果
  // 我们将其包装为 Promise，以便使用 async/await 语法
  const result = await new Promise((resolve, reject) => {
    // 调用 traceroute.trace() 方法开始路由追踪
    // 参数:
    //   - host: 要追踪的目标主机名或 IP 地址
    //   - callback: 回调函数，接收两个参数：
    //     - err: 错误对象（如果发生错误）
    //     - hops: 路由跳数数组（如果成功）
    traceroute.trace(host, (err, hops) => {
      // 检查是否发生错误或没有返回跳数
      if (err || !hops) {
        // 如果发生错误或没有跳数，拒绝 Promise
        // err 可能是网络错误、权限错误、超时等
        // !hops 表示没有返回任何路由跳数
        reject(err || new Error('No hops found'));
      } else {
        // 如果成功，解析 Promise 并返回跳数数组
        // hops 是一个数组，包含路径上的每一个路由器信息
        // 每个元素代表一跳（hop），包含：
        //   - hop: 跳数（从 1 开始）
        //   - ip: 路由器的 IP 地址
        //   - rtt1/rtt2/rtt3: 三次往返时间（毫秒）
        resolve(hops);
      }
    });
  });

  // 返回路由追踪结果
  // message: 状态消息
  // result: 路由跳数数组
  return {
    message: "Traceroute completed!",
    result,
  };
};

// 使用中间件包装路由追踪处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(traceRouteHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './trace-route.js' 导入
export default handler;
