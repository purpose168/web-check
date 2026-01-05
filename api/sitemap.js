// 导入 axios 库，这是一个基于 Promise 的 HTTP 客户端库，用于发送 HTTP 请求
// axios 支持 Promise API、拦截请求和响应、转换请求和响应数据等功能
import axios from 'axios';

// 导入 xml2js 库，用于将 XML 数据转换为 JavaScript 对象
// 该库提供了 XML 解析和构建功能，支持流式处理和 Promise API
import xml2js from 'xml2js';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 网站地图（Sitemap）处理函数
// 功能：获取并解析指定网站的 sitemap.xml 文件
// sitemap.xml 是一个 XML 文件，用于告诉搜索引擎网站上有哪些页面可以抓取
// 参数:
//   - url: 要检查的网站 URL 字符串（不包含路径）
// 返回: 包含解析后的 sitemap 数据的对象，或错误/跳过信息
//   成功格式: 解析后的 XML 对象（结构取决于 sitemap.xml 的内容）
//   跳过格式: { skipped: 'No sitemap found' }
//   错误格式: { error: '错误信息' }
const sitemapHandler = async (url) => {
  // 构建 sitemap.xml 文件的默认 URL
  // 通常 sitemap.xml 位于网站根目录下
  // 例如: https://example.com/sitemap.xml
  let sitemapUrl = `${url}/sitemap.xml`;

  // 设置硬性超时时间为 5000 毫秒（5 秒）
  // 如果请求超过这个时间仍未完成，将中止请求
  const hardTimeOut = 5000;

  try {
    // 声明 sitemap 响应变量
    let sitemapRes;
    
    try {
      // 尝试直接获取 sitemap.xml 文件
      // 使用 axios 发送 GET 请求，设置超时时间
      sitemapRes = await axios.get(sitemapUrl, { timeout: hardTimeOut });
    } catch (error) {
      // 如果直接获取失败，检查错误类型
      if (error.response && error.response.status === 404) {
        // 如果返回 404 错误（文件未找到），尝试从 robots.txt 中查找 sitemap 位置
        // robots.txt 文件可能包含 sitemap 的位置信息
        const robotsRes = await axios.get(`${url}/robots.txt`, { timeout: hardTimeOut });
        
        // 将 robots.txt 内容按行分割成数组
        const robotsTxt = robotsRes.data.split('\n');

        // 遍历 robots.txt 的每一行
        for (let line of robotsTxt) {
          // 检查是否是 sitemap 声明行（不区分大小写）
          // sitemap 声明格式: Sitemap: https://example.com/sitemap.xml
          if (line.toLowerCase().startsWith('sitemap:')) {
            // 提取 sitemap URL（按空格分割，取第二部分并去除空白字符）
            sitemapUrl = line.split(' ')[1].trim();
            
            // 找到 sitemap URL 后，跳出循环
            break;
          }
        }

        // 如果在 robots.txt 中没有找到 sitemap 声明
        if (!sitemapUrl) {
          // 返回跳过信息，表示未找到 sitemap
          return { skipped: 'No sitemap found' };
        }

        // 使用从 robots.txt 中找到的 URL 获取 sitemap 文件
        sitemapRes = await axios.get(sitemapUrl, { timeout: hardTimeOut });
      } else {
        // 如果是其他类型的错误（如网络错误、超时等），直接抛出错误
        throw error;
      }
    }

    // 创建 XML 解析器对象
    // xml2js.Parser 用于将 XML 字符串转换为 JavaScript 对象
    const parser = new xml2js.Parser();
    
    // 解析 sitemap XML 数据
    // parseStringPromise 方法返回一个 Promise，解析完成后得到 JavaScript 对象
    const sitemap = await parser.parseStringPromise(sitemapRes.data);

    // 返回解析后的 sitemap 数据
    // 数据结构取决于 sitemap.xml 的内容，通常包含 urlset 或 sitemapindex 等元素
    return sitemap;
  } catch (error) {
    // 捕获请求过程中的错误
    if (error.code === 'ECONNABORTED') {
      // 如果错误代码是 ECONNABORTED，表示请求超时
      // 返回超时错误信息
      return { error: `Request timed-out after ${hardTimeOut}ms` };
    } else {
      // 其他类型的错误，返回错误消息
      return { error: error.message };
    }
  }
};

// 使用中间件包装 sitemap 处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(sitemapHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './sitemap.js' 导入
export default handler;

