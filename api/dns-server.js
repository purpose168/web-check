// 引入 Node.js 内置的 dns 模块
// promises: 使用 Promise 风格的 DNS API
// lookup: 传统回调风格的 DNS 查询函数
import { promises as dnsPromises, lookup } from 'dns';
// 引入 axios 库，用于发送 HTTP 请求
import axios from 'axios';
// 引入中间件函数，用于跨平台适配和请求处理
import middleware from './_common/middleware.js';

// DNS 服务器信息查询处理函数
// 查询域名的 DNS 记录，并检查是否支持 DNS-over-HTTPS (DoH)
// 参数：url - 要查询的域名或 URL
// 返回：包含 DNS 记录和 DoH 支持信息的对象
const dnsHandler = async (url) => {
  try {
    // 从 URL 中提取域名（移除 http:// 或 https:// 前缀）
    const domain = url.replace(/^(?:https?:\/\/)?/i, "");
    // 解析域名的 IPv4 地址（A 记录）
    const addresses = await dnsPromises.resolve4(domain);
    // 对每个 IP 地址进行详细查询
    const results = await Promise.all(addresses.map(async (address) => {
      // 反向 DNS 查询，获取 IP 地址对应的主机名
      const hostname = await dnsPromises.reverse(address).catch(() => null);
      // 检查是否支持直接的 DNS-over-HTTPS
      let dohDirectSupports = false;
      try {
        // 尝试通过 HTTPS 直接访问 DNS 查询端点
        await axios.get(`https://${address}/dns-query`);
        dohDirectSupports = true;  // 如果成功，说明支持 DoH
      } catch (error) {
        dohDirectSupports = false;  // 如果失败，说明不支持 DoH
      }
      // 返回该 IP 地址的详细信息
      return {
        address,              // IP 地址
        hostname,            // 主机名（反向查询结果）
        dohDirectSupports,    // 是否支持 DoH
      };
    }));

    // Mozilla DoH 支持检查（已注释）
    // let dohMozillaSupport = false;
    // try {
    //   // 获取 Mozilla 的 DoH 提供商列表
    //   const mozillaList = await axios.get('https://firefox.settings.services.mozilla.com/v1/buckets/security-state/collections/onecrl/records');
    //   // 检查查询结果的主机名是否在 Mozilla 的 DoH 列表中
    //   dohMozillaSupport = results.some(({ hostname }) => mozillaList.data.data.some(({ id }) => id.includes(hostname)));
    // } catch (error) {
    //   console.error(error);
    // }

    // 返回查询结果
    return {
      domain,  // 查询的域名
      dns: results,  // DNS 记录数组
      // dohMozillaSupport,  // Mozilla DoH 支持（已注释）
    };
  } catch (error) {
    // 错误处理：抛出错误信息
    // 这个错误会被 commonMiddleware 捕获并处理
    throw new Error(`An error occurred while resolving DNS. ${error.message}`);
  }
};


// 使用中间件包装处理函数，实现跨平台适配
// 中间件会处理超时、错误、URL 规范化等通用逻辑
export const handler = middleware(dnsHandler);
// 默认导出处理函数
export default handler;

