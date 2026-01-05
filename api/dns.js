// 引入 Node.js 内置的 dns 模块，用于 DNS 查询
import dns from 'dns';
// 引入 util 模块，用于工具函数
import util from 'util';
// 引入中间件函数，用于跨平台适配和请求处理
import middleware from './_common/middleware.js';

// DNS 记录查询处理函数
// 查询域名的各种 DNS 记录类型
// 参数：url - 要查询的域名或 URL
// 返回：包含各种 DNS 记录的对象
const dnsHandler = async (url) => {
  let hostname = url;

  // 处理 URL：如果是完整的 URL，提取主机名部分
  if (hostname.startsWith('http://') || hostname.startsWith('https://')) {
    hostname = new URL(hostname).hostname;
  }

  try {
    // 将回调风格的 DNS 函数转换为 Promise 风格
    const lookupPromise = util.promisify(dns.lookup);           // 基础 DNS 查询
    const resolve4Promise = util.promisify(dns.resolve4);       // A 记录（IPv4 地址）
    const resolve6Promise = util.promisify(dns.resolve6);       // AAAA 记录（IPv6 地址）
    const resolveMxPromise = util.promisify(dns.resolveMx);     // MX 记录（邮件交换）
    const resolveTxtPromise = util.promisify(dns.resolveTxt);   // TXT 记录（文本记录）
    const resolveNsPromise = util.promisify(dns.resolveNs);     // NS 记录（名称服务器）
    const resolveCnamePromise = util.promisify(dns.resolveCname); // CNAME 记录（别名）
    const resolveSoaPromise = util.promisify(dns.resolveSoa);   // SOA 记录（授权起始）
    const resolveSrvPromise = util.promisify(dns.resolveSrv);   // SRV 记录（服务记录）
    const resolvePtrPromise = util.promisify(dns.resolvePtr);   // PTR 记录（反向 DNS）

    // 并行查询所有类型的 DNS 记录
    // 使用 .catch(() => []) 确保即使某个查询失败，也不会影响其他查询
    const [a, aaaa, mx, txt, ns, cname, soa, srv, ptr] = await Promise.all([
      lookupPromise(hostname),                                   // 基础查询
      resolve4Promise(hostname).catch(() => []),                // A 记录
      resolve6Promise(hostname).catch(() => []),                 // AAAA 记录
      resolveMxPromise(hostname).catch(() => []),                // MX 记录
      resolveTxtPromise(hostname).catch(() => []),               // TXT 记录
      resolveNsPromise(hostname).catch(() => []),                // NS 记录
      resolveCnamePromise(hostname).catch(() => []),            // CNAME 记录
      resolveSoaPromise(hostname).catch(() => []),              // SOA 记录
      resolveSrvPromise(hostname).catch(() => []),               // SRV 记录
      resolvePtrPromise(hostname).catch(() => [])                // PTR 记录
    ]);

    // 返回所有 DNS 记录
    return {
      A: a,        // 基础查询结果
      AAAA: aaaa,  // IPv6 地址
      MX: mx,      // 邮件交换记录
      TXT: txt,    // 文本记录
      NS: ns,      // 名称服务器
      CNAME: cname, // 别名记录
      SOA: soa,    // 授权起始记录
      SRV: srv,    // 服务记录
      PTR: ptr     // 反向 DNS 记录
    };
  } catch (error) {
    // 错误处理：抛出错误信息
    throw new Error(error.message);
  }
};

// 使用中间件包装处理函数，实现跨平台适配
// 中间件会处理超时、错误、URL 规范化等通用逻辑
export const handler = middleware(dnsHandler);
// 默认导出处理函数
export default handler;
