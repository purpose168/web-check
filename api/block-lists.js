// 引入 Node.js 内置的 dns 模块，用于 DNS 查询
import dns from 'dns';
// 引入 URL 模块，用于解析 URL 并提取域名
import { URL } from 'url';
// 引入中间件函数，用于跨平台适配和请求处理
import middleware from './_common/middleware.js';

// DNS 服务器列表配置
// 这些是提供拦截/过滤功能的公共 DNS 服务器
// 可以用于检查域名是否被这些服务器的拦截列表阻止
const DNS_SERVERS = [
  { name: 'AdGuard', ip: '176.103.130.130' },           // AdGuard DNS（拦截广告和跟踪器）
  { name: 'AdGuard Family', ip: '176.103.130.132' },    // AdGuard Family DNS（家庭安全过滤）
  { name: 'CleanBrowsing Adult', ip: '185.228.168.10' }, // CleanBrowsing Adult（成人内容拦截）
  { name: 'CleanBrowsing Family', ip: '185.228.168.168' }, // CleanBrowsing Family（家庭安全过滤）
  { name: 'CleanBrowsing Security', ip: '185.228.168.9' }, // CleanBrowsing Security（安全过滤）
  { name: 'CloudFlare', ip: '1.1.1.1' },                // Cloudflare DNS（标准 DNS）
  { name: 'CloudFlare Family', ip: '1.1.1.3' },         // Cloudflare Family（家庭安全 DNS）
  { name: 'Comodo Secure', ip: '8.26.56.26' },          // Comodo Secure DNS（安全 DNS）
  { name: 'Google DNS', ip: '8.8.8.8' },                // Google DNS（标准 DNS）
  { name: 'Neustar Family', ip: '156.154.70.3' },       // Neustar Family（家庭安全 DNS）
  { name: 'Neustar Protection', ip: '156.154.70.2' },   // Neustar Protection（恶意软件防护）
  { name: 'Norton Family', ip: '199.85.126.20' },        // Norton Family（家庭安全 DNS）
  { name: 'OpenDNS', ip: '208.67.222.222' },            // OpenDNS（标准 DNS）
  { name: 'OpenDNS Family', ip: '208.67.222.123' },     // OpenDNS FamilyShield（家庭安全 DNS）
  { name: 'Quad9', ip: '9.9.9.9' },                     // Quad9（安全 DNS，拦截恶意域名）
  { name: 'Yandex Family', ip: '77.88.8.7' },           // Yandex Family（家庭安全 DNS）
  { name: 'Yandex Safe', ip: '77.88.8.88' },            // Yandex Safe（安全 DNS）
];

// 已知的拦截 IP 地址列表
// 当 DNS 服务器拦截一个域名时，通常会返回这些特殊的 IP 地址
// 包含 IPv4 和 IPv6 地址
const knownBlockIPs = [
  '146.112.61.106',           // OpenDNS 拦截 IP
  '185.228.168.10',           // CleanBrowsing 拦截 IP
  '8.26.56.26',               // Comodo 拦截 IP
  '9.9.9.9',                  // Quad9 拦截 IP
  '208.69.38.170',            // OpenDNS 拦截 IP
  '208.69.39.170',            // OpenDNS 拦截 IP
  '208.67.222.222',           // OpenDNS 拦截 IP
  '208.67.222.123',           // OpenDNS FamilyShield 拦截 IP
  '199.85.126.10',            // Norton 拦截 IP
  '199.85.126.20',            // Norton Family 拦截 IP
  '156.154.70.22',            // Neustar 拦截 IP
  '77.88.8.7',                // Yandex 拦截 IP
  '77.88.8.8',                // Yandex 拦截 IP
  '::1',                      // 本地回环 IPv6 地址（localhost）
  '2a02:6b8::feed:0ff',       // Yandex DNS IPv6
  '2a02:6b8::feed:bad',       // Yandex Safe IPv6
  '2a02:6b8::feed:a11',       // Yandex Family IPv6
  '2620:119:35::35',          // OpenDNS IPv6
  '2620:119:53::53',          // OpenDNS FamilyShield IPv6
  '2606:4700:4700::1111',     // Cloudflare IPv6
  '2606:4700:4700::1001',     // Cloudflare IPv6
  '2001:4860:4860::8888',     // Google DNS IPv6
  '2a0d:2a00:1::',            // AdGuard IPv6
  '2a0d:2a00:2::'             // AdGuard Family IPv6
];

// 检查域名是否被指定的 DNS 服务器拦截
// 参数：
//   domain: 要检查的域名
//   serverIP: DNS 服务器的 IP 地址
// 返回：Promise<boolean> - true 表示被拦截，false 表示未被拦截
const isDomainBlocked = async (domain, serverIP) => {
  return new Promise((resolve) => {
    // 首先尝试解析 IPv4 地址（A 记录）
    // 使用指定的 DNS 服务器进行查询
    dns.resolve4(domain, { server: serverIP }, (err, addresses) => {
      if (!err) {
        // 如果查询成功，检查返回的 IP 地址是否在已知拦截 IP 列表中
        if (addresses.some(addr => knownBlockIPs.includes(addr))) {
          resolve(true);  // 返回的 IP 是拦截 IP，域名被拦截
          return;
        }
        resolve(false); // 返回的 IP 不是拦截 IP，域名未被拦截
        return;
      }

      // 如果 IPv4 查询失败，尝试解析 IPv6 地址（AAAA 记录）
      dns.resolve6(domain, { server: serverIP }, (err6, addresses6) => {
        if (!err6) {
          // 如果查询成功，检查返回的 IPv6 地址是否在已知拦截 IP 列表中
          if (addresses6.some(addr => knownBlockIPs.includes(addr))) {
            resolve(true);  // 返回的 IPv6 是拦截 IP，域名被拦截
            return;
          }
          resolve(false); // 返回的 IPv6 不是拦截 IP，域名未被拦截
          return;
        }
        // 如果 IPv6 查询也失败，检查错误代码
        // ENOTFOUND: 域名不存在，SERVFAIL: DNS 服务器失败
        // 这两种情况通常表示域名被拦截
        if (err6.code === 'ENOTFOUND' || err6.code === 'SERVFAIL') {
          resolve(true);  // 域名被拦截
        } else {
          resolve(false); // 其他错误，认为域名未被拦截
        }
      });
    });
  });
};

// 检查域名在所有配置的 DNS 服务器上的拦截状态
// 参数：
//   domain: 要检查的域名
// 返回：Promise<Array> - 包含每个 DNS 服务器检查结果的数组
const checkDomainAgainstDnsServers = async (domain) => {
  let results = [];

  // 遍历所有配置的 DNS 服务器
  for (let server of DNS_SERVERS) {
    // 检查域名是否被当前 DNS 服务器拦截
    const isBlocked = await isDomainBlocked(domain, server.ip);
    // 将检查结果添加到结果数组中
    results.push({
      server: server.name,    // DNS 服务器名称
      serverIp: server.ip,    // DNS 服务器 IP
      isBlocked,              // 是否被拦截
    });
  }

  return results;
};

// 拦截列表检查处理函数
// 检查指定 URL 的域名在各个 DNS 服务器上的拦截状态
// 参数：
//   url: 要检查的完整 URL
// 返回：包含所有 DNS 服务器检查结果的对象
export const blockListHandler = async (url) => {
  // 从 URL 中提取域名（hostname）
  const domain = new URL(url).hostname;
  // 检查域名在所有 DNS 服务器上的拦截状态
  const results = await checkDomainAgainstDnsServers(domain);
  // 返回检查结果
  return { blocklists: results };
};

// 使用中间件包装处理函数，实现跨平台适配
// 中间件会处理超时、错误、URL 规范化等通用逻辑
export const handler = middleware(blockListHandler);
// 默认导出处理函数
export default handler;

