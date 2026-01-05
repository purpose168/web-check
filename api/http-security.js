// 导入 Axios HTTP 客户端库，用于发送 HTTP 请求
import axios from 'axios';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// HTTP 安全头检查处理器函数
// 该函数检查目标网站的 HTTP 安全响应头配置情况
// 参数:
//   - url: 要检查的目标 URL 地址
// 返回: Promise，解析为 HTTP 安全头检查结果对象
const httpsSecHandler = async (url) => {
  // 构建完整的 URL
  // 如果 URL 已经包含 http:// 或 https:// 前缀，则直接使用
  // 否则，添加 http:// 前缀
  const fullUrl = url.startsWith('http') ? url : `http://${url}`;
  
  try {
    // 发送 GET 请求获取目标 URL 的响应
    const response = await axios.get(fullUrl);
    // 提取响应头对象
    const headers = response.headers;
    
    // 返回 HTTP 安全头检查结果
    // 每个字段表示一个安全头的存在情况（true 表示存在，false 表示不存在）
    return {
      // Strict-Transport-Security（HSTS）标头
      // 作用: 强制浏览器只使用 HTTPS 与网站通信，防止协议降级攻击
      strictTransportPolicy: headers['strict-transport-security'] ? true : false,
      
      // X-Frame-Options 标头
      // 作用: 控制页面是否可以在 <frame>、<iframe>、<embed> 或 <object> 中显示
      //       防止点击劫持（Clickjacking）攻击
      xFrameOptions: headers['x-frame-options'] ? true : false,
      
      // X-Content-Type-Options 标头
      // 作用: 禁用浏览器的 MIME 类型嗅探功能
      //       防止浏览器将文件解释为非声明的内容类型，提高安全性
      xContentTypeOptions: headers['x-content-type-options'] ? true : false,
      
      // X-XSS-Protection 标头
      // 作用: 启用浏览器的跨站脚本（XSS）过滤器
      //       帮助检测和阻止某些类型的 XSS 攻击
      xXSSProtection: headers['x-xss-protection'] ? true : false,
      
      // Content-Security-Policy（CSP）标头
      // 作用: 定义页面可以加载哪些资源（脚本、样式、图片等）
      //       防止跨站脚本攻击（XSS）、数据注入攻击等
      contentSecurityPolicy: headers['content-security-policy'] ? true : false,
    }
  } catch (error) {
    // 如果请求过程中发生错误，返回错误响应
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回 HTTP 安全头检查结果
export const handler = middleware(httpsSecHandler);
// 默认导出处理函数
export default handler;
