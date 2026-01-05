// 引入 Node.js 内置的 https 模块，用于发送 HTTPS 请求
import https from 'https';
// 引入中间件函数，用于跨平台适配和请求处理
import middleware from './_common/middleware.js';

// DNSSEC 安全扩展查询处理函数
// 查询域名的 DNSSEC 相关记录（DNSKEY、DS、RRSIG）
// DNSSEC 是 DNS 安全扩展，用于验证 DNS 响应的真实性和完整性
// 参数：domain - 要查询的域名
// 返回：包含各种 DNSSEC 记录的对象
const dnsSecHandler = async (domain) => {
  // 定义要查询的 DNSSEC 记录类型
  // DNSKEY: DNS 公钥记录，用于验证 DNSSEC 签名
  // DS: 委托签名者记录，用于建立 DNSSEC 信任链
  // RRSIG: 资源记录签名，包含对 DNS 记录的数字签名
  const dnsTypes = ['DNSKEY', 'DS', 'RRSIG'];
  const records = {};

  // 遍历每种 DNSSEC 记录类型
  for (const type of dnsTypes) {
    // 构建 DNS-over-HTTPS (DoH) 请求选项
    // 使用 Google 的公共 DoH 服务：dns.google
    const options = {
      hostname: 'dns.google',
      // 查询路径：指定域名和记录类型
      path: `/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
      method: 'GET',
      headers: {
        // 接受 JSON 格式的响应
        'Accept': 'application/dns-json'
      }
    };

    try {
      // 发送 HTTPS 请求到 Google DoH 服务
      const dnsResponse = await new Promise((resolve, reject) => {
        const req = https.request(options, res => {
          let data = '';
          
          // 接收数据块
          res.on('data', chunk => {
            data += chunk;
          });

          // 数据接收完成
          res.on('end', () => {
            try {
              // 解析 JSON 响应
              resolve(JSON.parse(data));
            } catch (error) {
              // JSON 解析失败
              reject(new Error('Invalid JSON response'));
            }
          });

          // 响应错误处理
          res.on('error', error => {
            reject(error);
          });
        });

        // 结束请求
        req.end();
      });

      // 检查响应中是否包含 Answer 字段（DNS 答案）
      if (dnsResponse.Answer) {
        // 找到记录，标记为已找到并返回答案
        records[type] = { isFound: true, answer: dnsResponse.Answer, response: dnsResponse.Answer };
      } else {
        // 未找到记录，标记为未找到并返回完整响应
        records[type] = { isFound: false, answer: null, response: dnsResponse };
      }
    } catch (error) {
      // 错误处理：抛出错误信息
      // 这个错误会被 commonMiddleware 捕获并处理
      throw new Error(`Error fetching ${type} record: ${error.message}`);
    }
  }

  // 返回所有 DNSSEC 记录的查询结果
  return records;
};

// 使用中间件包装处理函数，实现跨平台适配
// 中间件会处理超时、错误、URL 规范化等通用逻辑
export const handler = middleware(dnsSecHandler);
// 默认导出处理函数
export default handler;
