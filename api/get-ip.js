// 导入 Node.js 的 DNS（域名系统）模块，用于域名解析
import dns from 'dns';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// 异步 DNS 查询函数
// 参数: address - 需要查询的域名或 IP 地址
// 返回: Promise，解析为包含 IP 地址和地址族的对象 { ip, family }
const lookupAsync = (address) => {
  return new Promise((resolve, reject) => {
    // 使用 dns.lookup 方法进行 DNS 查询
    // 参数说明:
    //   - address: 要查询的域名或 IP 地址
    //   - 回调函数: (err, ip, family)
    //     - err: 错误对象，如果查询失败则包含错误信息
    //     - ip: 解析得到的 IP 地址
    //     - family: IP 地址族（4 表示 IPv4，6 表示 IPv6）
    dns.lookup(address, (err, ip, family) => {
      if (err) {
        // 如果查询失败，拒绝 Promise 并传递错误
        reject(err);
      } else {
        // 如果查询成功，解析 Promise 并返回 IP 地址和地址族
        resolve({ ip, family });
      }
    });
  });
};

// IP 地址处理器函数
// 参数: url - 完整的 URL 地址（包含协议前缀）
// 返回: Promise，解析为包含 IP 地址和地址族的对象
const ipHandler = async (url) => {
  // 移除 URL 中的协议前缀（https:// 和 http://），只保留域名部分
  // 例如: https://example.com/path -> example.com/path
  const address = url.replaceAll('https://', '').replaceAll('http://', '');
  // 执行异步 DNS 查询并返回结果
  return await lookupAsync(address);
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回 IP 地址信息
export const handler = middleware(ipHandler);
// 默认导出处理函数
export default handler;
