// 导入 Axios HTTP 客户端库，用于发送 HTTP 请求
import axios from 'axios';
// 导入 Cheerio 库，用于解析 HTML 文档（类似 jQuery 的 API）
import cheerio from 'cheerio';
// 导入 Node.js 的 URL 模块，用于 URL 解析和处理
import urlLib from 'url';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// 页面链接提取处理器函数
// 该函数提取指定页面上的所有内部链接和外部链接
// 参数:
//   - url: 要分析的目标 URL 地址
// 返回: Promise，解析为包含内部链接和外部链接的对象
const linkedPagesHandler = async (url) => {
  // 发送 GET 请求获取目标 URL 的 HTML 内容
  const response = await axios.get(url);
  // 提取响应体中的 HTML 内容
  const html = response.data;
  // 使用 Cheerio 加载 HTML，创建类似 jQuery 的选择器对象
  const $ = cheerio.load(html);
  
  // 创建 Map 用于存储内部链接及其出现次数
  // 内部链接：指向同一域名下的其他页面
  const internalLinksMap = new Map();
  // 创建 Map 用于存储外部链接及其出现次数
  // 外部链接：指向不同域名的页面
  const externalLinksMap = new Map();

  // 获取页面上所有的链接（所有带有 href 属性的 <a> 标签）
  $('a[href]').each((i, link) => {
    // 获取链接的 href 属性值
    const href = $(link).attr('href');
    // 将相对 URL 转换为绝对 URL
    // 例如: /about -> https://example.com/about
    const absoluteUrl = urlLib.resolve(url, href);
    
    // 检查链接是内部链接还是外部链接，并添加到相应的 Map 中或增加出现次数
    if (absoluteUrl.startsWith(url)) {
      // 如果绝对 URL 以目标 URL 开头，则为内部链接
      // 获取当前链接的出现次数，如果不存在则为 0
      const count = internalLinksMap.get(absoluteUrl) || 0;
      // 将链接和出现次数存入 Map（次数加 1）
      internalLinksMap.set(absoluteUrl, count + 1);
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      // 如果 href 以 http:// 或 https:// 开头且不是内部链接，则为外部链接
      // 获取当前链接的出现次数，如果不存在则为 0
      const count = externalLinksMap.get(absoluteUrl) || 0;
      // 将链接和出现次数存入 Map（次数加 1）
      externalLinksMap.set(absoluteUrl, count + 1);
    }
  });

  // 按出现次数降序排序，去除重复项，并转换为数组
  // 内部链接处理
  const internalLinks = [...internalLinksMap.entries()]  // 将 Map 转换为数组
    .sort((a, b) => b[1] - a[1])                        // 按出现次数降序排序
    .map(entry => entry[0]);                             // 提取 URL，去除次数
  
  // 外部链接处理
  const externalLinks = [...externalLinksMap.entries()] // 将 Map 转换为数组
    .sort((a, b) => b[1] - a[1])                        // 按出现次数降序排序
    .map(entry => entry[0]);                             // 提取 URL，去除次数

  // 如果没有找到任何链接，则标记为跳过并显示原因
  if (internalLinks.length === 0 && externalLinks.length === 0) {
    return {
      statusCode: 400,
      body: {
        skipped: '未找到内部或外部链接。'
          + '这可能是由于网站是动态渲染的，使用了客户端框架（如 React），并且未启用服务器端渲染（SSR）。'
          + '这意味着从 HTTP 请求返回的静态 HTML 不包含任何可供 Web-Check 分析的有意义内容。'
          + '您可以通过使用无头浏览器来渲染页面来解决这个问题。',
        },
    };
  }

  // 返回内部链接和外部链接数组
  return { internal: internalLinks, external: externalLinks };
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回页面链接分析结果
export const handler = middleware(linkedPagesHandler);
// 默认导出处理函数
export default handler;
