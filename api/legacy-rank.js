// 导入 Axios HTTP 客户端库，用于发送 HTTP 请求
import axios from 'axios';
// 导入 unzipper 模块，用于解压 ZIP 文件
import unzipper from 'unzipper';
// 导入 csv-parser 模块，用于解析 CSV 文件
import csv from 'csv-parser';
// 导入 Node.js 的文件系统模块，用于文件操作
import fs from 'fs';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// 以下数据源也可以使用：
// https://www.domcop.com/files/top/top10milliondomains.csv.zip
// https://tranco-list.eu/top-1m.csv.zip
// https://www.domcop.com/files/top/top10milliondomains.csv.zip
// https://radar.cloudflare.com/charts/LargerTopDomainsTable/attachment?id=525&top=1000000
// https://statvoo.com/dl/top-1million-sites.csv.zip

// Umbrella（Cisco 安全情报）提供的全球前 100 万域名列表的下载地址
const FILE_URL = 'https://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip';
// 解压后的 CSV 文件临时存储路径
const TEMP_FILE_PATH = '/tmp/top-1m.csv';

// 域名排名查询处理器函数
// 该函数查询指定域名在 Umbrella 全球前 100 万域名列表中的排名
// 参数:
//   - url: 要查询的目标 URL 地址
// 返回: Promise，解析为域名排名查询结果对象
const rankHandler = async (url) => {
  let domain = null;

  try {
    // 从 URL 中提取域名（hostname）
    // 例如: https://example.com/path -> example.com
    domain = new URL(url).hostname;
  } catch (e) {
    // 如果 URL 格式无效，抛出错误
    throw new Error('Invalid URL');
  }

// 如果缓存中不存在文件，则下载并解压
// 使用文件缓存机制避免重复下载
if (!fs.existsSync(TEMP_FILE_PATH)) {
  // 使用 Axios 发送流式 GET 请求下载 ZIP 文件
  const response = await axios({
    method: 'GET',
    url: FILE_URL,
    responseType: 'stream' // 设置响应类型为流，以便处理大文件
  });

  // 创建 Promise 以等待解压完成
  await new Promise((resolve, reject) => {
    // 将下载的数据流通过管道传递给解压器
    // 解压器将文件提取到 /tmp 目录
    response.data
      .pipe(unzipper.Extract({ path: '/tmp' }))
      // 监听 'close' 事件，表示解压完成
      .on('close', resolve)
      // 监听 'error' 事件，处理解压过程中的错误
      .on('error', reject);
  });
}

// 解析 CSV 文件并查找域名排名
return new Promise((resolve, reject) => {
  // 创建文件读取流，读取 CSV 文件
  const csvStream = fs.createReadStream(TEMP_FILE_PATH)
    // 通过管道将数据流传递给 CSV 解析器
    // 配置 CSV 列名为 'rank'（排名）和 'domain'（域名）
    .pipe(csv({
      headers: ['rank', 'domain'],
    }))
    // 监听 'data' 事件，处理每一行数据
    .on('data', (row) => {
      // 检查当前行的域名是否与目标域名匹配
      if (row.domain === domain) {
        // 如果找到匹配的域名，销毁流以停止读取
        csvStream.destroy();
        // 返回找到的排名信息
        resolve({
          domain: domain,        // 域名
          rank: row.rank,        // 排名
          isFound: true,         // 是否找到
        });
      }
    })
    // 监听 'end' 事件，表示文件读取完成但未找到匹配的域名
    .on('end', () => {
      // 返回未找到的结果
      resolve({
        skipped: `跳过，因为 ${domain} 不在 Umbrella 前 100 万域名列表中。`,
        domain: domain,        // 域名
        isFound: false,         // 是否找到
      });
    })
    // 监听 'error' 事件，处理解析过程中的错误
    .on('error', reject);
});
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回域名排名查询结果
export const handler = middleware(rankHandler);
// 默认导出处理函数
export default handler;
