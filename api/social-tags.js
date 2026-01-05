// 导入 axios 库，这是一个基于 Promise 的 HTTP 客户端库，用于发送 HTTP 请求
// axios 支持 Promise API、拦截请求和响应、转换请求和响应数据等功能
import axios from 'axios';

// 导入 cheerio 库，这是一个类似于 jQuery 的 HTML 解析库
// cheerio 可以在服务器端使用 jQuery 语法来解析和操作 HTML 文档
import cheerio from 'cheerio';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 社交标签（Social Tags）处理函数
// 功能：提取网页的各种元数据标签，包括基本 meta 标签、OpenGraph 协议标签、Twitter Cards 标签等
// 这些标签用于在社交媒体平台上展示网页的预览信息
// 参数:
//   - url: 要检查的网页 URL 字符串（可以包含或不包含协议）
// 返回: 包含提取的元数据的对象，或错误信息
//   成功格式: {
//     title: '页面标题',
//     description: '页面描述',
//     ogTitle: 'OpenGraph 标题',
//     twitterCard: 'Twitter 卡片类型',
//     ...其他元数据字段
//   }
//   跳过格式: { skipped: 'No metadata found' }
//   错误格式: { statusCode: 500, body: JSON 字符串 }
const socialTagsHandler = async (url) => {
  
  // 检查 URL 是否包含协议前缀
  // 如果不包含 http:// 或 https://，则默认添加 http://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  
  try {
    // 使用 axios 发送 GET 请求获取网页 HTML 内容
    const response = await axios.get(url);
    
    // 从响应中提取 HTML 数据
    const html = response.data;
    
    // 使用 cheerio 加载 HTML，创建一个类似 jQuery 的选择器对象
    // $ 符号是 cheerio 的常用选择器，可以像使用 jQuery 一样操作 DOM
    const $ = cheerio.load(html);
    
    // 创建元数据对象，用于存储提取的各种标签信息
    const metadata = {
      // 基本的 meta 标签
      // 这些标签提供网页的基本信息，用于搜索引擎优化（SEO）
      
      // 页面标题（<title> 标签）
      title: $('head title').text(),
      
      // 页面描述（<meta name="description">）
      // 通常用于搜索引擎结果页面的摘要
      description: $('meta[name="description"]').attr('content'),
      
      // 页面关键词（<meta name="keywords">）
      // 用于告诉搜索引擎页面的主要关键词
      keywords: $('meta[name="keywords"]').attr('content'),
      
      // 规范 URL（<link rel="canonical">）
      // 用于指定页面的规范 URL，避免重复内容问题
      canonicalUrl: $('link[rel="canonical"]').attr('href'),

      // OpenGraph 协议标签
      // OpenGraph 是 Facebook 提出的一种协议，用于在社交媒体上展示网页的富媒体预览
      // 这些标签以 "og:" 开头
      
      // OpenGraph 标题（<meta property="og:title">）
      // 在社交媒体上显示的标题
      ogTitle: $('meta[property="og:title"]').attr('content'),
      
      // OpenGraph 类型（<meta property="og:type">）
      // 指定页面的类型，如 "website"、"article"、"video" 等
      ogType: $('meta[property="og:type"]').attr('content'),
      
      // OpenGraph 图片（<meta property="og:image">）
      // 在社交媒体上显示的预览图片
      ogImage: $('meta[property="og:image"]').attr('content'),
      
      // OpenGraph URL（<meta property="og:url">）
      // 页面的规范 URL
      ogUrl: $('meta[property="og:url"]').attr('content'),
      
      // OpenGraph 描述（<meta property="og:description">）
      // 在社交媒体上显示的描述
      ogDescription: $('meta[property="og:description"]').attr('content'),
      
      // OpenGraph 站点名称（<meta property="og:site_name">）
      // 网站的名称
      ogSiteName: $('meta[property="og:site_name"]').attr('content'),
      
      // Twitter Cards 标签
      // Twitter Cards 是 Twitter 提供的一种协议，用于在 Twitter 上展示网页的富媒体预览
      // 这些标签以 "twitter:" 开头
      
      // Twitter 卡片类型（<meta name="twitter:card">）
      // 指定卡片的类型，如 "summary"、"summary_large_image"、"player" 等
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      
      // Twitter 站点（<meta name="twitter:site">）
      // 网站的 Twitter 账号（@username）
      twitterSite: $('meta[name="twitter:site"]').attr('content'),
      
      // Twitter 创建者（<meta name="twitter:creator">）
      // 内容创建者的 Twitter 账号（@username）
      twitterCreator: $('meta[name="twitter:creator"]').attr('content'),
      
      // Twitter 标题（<meta name="twitter:title">）
      // 在 Twitter 上显示的标题
      twitterTitle: $('meta[name="twitter:title"]').attr('content'),
      
      // Twitter 描述（<meta name="twitter:description">）
      // 在 Twitter 上显示的描述
      twitterDescription: $('meta[name="twitter:description"]').attr('content'),
      
      // Twitter 图片（<meta name="twitter:image">）
      // 在 Twitter 上显示的预览图片
      twitterImage: $('meta[name="twitter:image"]').attr('content'),

      // 其他杂项标签
      
      // 主题颜色（<meta name="theme-color">）
      // 用于移动浏览器地址栏的主题颜色
      themeColor: $('meta[name="theme-color"]').attr('content'),
      
      // 机器人指令（<meta name="robots">）
      // 告诉搜索引擎爬虫如何处理页面（如 "index, follow"、"noindex, nofollow"）
      robots: $('meta[name="robots"]').attr('content'),
      
      // Googlebot 指令（<meta name="googlebot">）
      // 专门告诉 Google 爬虫如何处理页面
      googlebot: $('meta[name="googlebot"]').attr('content'),
      
      // 生成器（<meta name="generator">）
      // 用于生成页面的软件或工具（如 CMS 名称）
      generator: $('meta[name="generator"]').attr('content'),
      
      // 视口设置（<meta name="viewport">）
      // 用于控制页面在移动设备上的显示方式
      viewport: $('meta[name="viewport"]').attr('content'),
      
      // 作者（<meta name="author">）
      // 页面作者的名字
      author: $('meta[name="author"]').attr('content'),
      
      // 发布者（<link rel="publisher">）
      // 页面发布者的链接（通常是 Google+ 或其他社交平台）
      publisher: $('link[rel="publisher"]').attr('href'),
      
      // 网站图标（<link rel="icon">）
      // 网站的 favicon 图标 URL
      favicon: $('link[rel="icon"]').attr('href')
    };

    // 检查是否提取到任何元数据
    // 如果元数据对象为空（没有找到任何标签），返回跳过信息
    if (Object.keys(metadata).length === 0) {
      return { skipped: 'No metadata found' };
    }
    
    // 返回提取的元数据对象
    return metadata;
  } catch (error) {
    // 捕获请求过程中的错误
    // 返回 500 错误状态码和错误信息
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed fetching data' }),
    };
  }
};

// 使用中间件包装社交标签处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(socialTagsHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './social-tags.js' 导入
export default handler;
