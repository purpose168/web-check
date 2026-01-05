// 引入 Node.js 内置的 https 模块，用于发送 HTTPS 请求
import https from 'https';
// 引入中间件函数，用于跨平台适配和请求处理
import middleware from './_common/middleware.js';

// 碳足迹分析处理函数
// 通过计算网站 HTML 大小来估算访问该网站产生的碳排放量
// 使用 websitecarbon.com API 进行计算
const carbonHandler = async (url) => {

  // 获取网站 HTML 大小的函数
  // 参数：url - 要分析的网站 URL
  // 返回：Promise<number> - HTML 内容的字节数
  const getHtmlSize = (url) => new Promise((resolve, reject) => {
    // 发送 HTTPS GET 请求获取网页内容
    https.get(url, res => {
      let data = '';
      // 接收数据块
      res.on('data', chunk => {
        data += chunk;
      });
      // 数据接收完成
      res.on('end', () => {
        // 计算数据的字节长度（UTF-8 编码）
        const sizeInBytes = Buffer.byteLength(data, 'utf8');
        resolve(sizeInBytes);
      });
    }).on('error', reject);
  });

  try {
    // 获取网站 HTML 的大小（字节数）
    const sizeInBytes = await getHtmlSize(url);
    // 构建 websitecarbon.com API 请求 URL
    // bytes: HTML 字节数
    // green=0: 不使用绿色能源计算（更保守的估算）
    const apiUrl = `https://api.websitecarbon.com/data?bytes=${sizeInBytes}&green=0`;

    // 使用 HTML 大小获取碳足迹数据
    const carbonData = await new Promise((resolve, reject) => {
      // 发送 HTTPS GET 请求到 carbon API
      https.get(apiUrl, res => {
        let data = '';
        // 接收数据块
        res.on('data', chunk => {
          data += chunk;
        });
        // 数据接收完成
        res.on('end', () => {
          // 解析 JSON 响应
          resolve(JSON.parse(data));
        });
      }).on('error', reject);
    });

    // 检查返回的数据是否有效
    // 如果调整后的字节数和能耗都为 0，说明无法计算碳足迹
    if (!carbonData.statistics || (carbonData.statistics.adjustedBytes === 0 && carbonData.statistics.energy === 0)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ skipped: 'Not enough info to get carbon data' }),
      };
    }

    // 将扫描的 URL 添加到返回数据中
    carbonData.scanUrl = url;
    // 返回完整的碳足迹数据
    return carbonData;
  } catch (error) {
    // 错误处理：抛出错误信息
    throw new Error(`Error: ${error.message}`);
  }
};

// 使用中间件包装处理函数，实现跨平台适配
// 中间件会处理超时、错误、URL 规范化等通用逻辑
export const handler = middleware(carbonHandler);
// 默认导出处理函数
export default handler;
