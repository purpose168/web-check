// 导入 Node.js 的 DNS（域名系统）模块，用于 DNS 查询
import dns from 'dns';
// 导入 url-parse 库，用于 URL 解析
import URL from 'url-parse';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// TODO: 需要修复某些问题

// 邮件配置检查处理器函数
// 该函数检查域名的邮件服务器配置，包括 MX 记录、TXT 记录和邮件服务提供商
// 参数:
//   - url: 要检查的目标 URL 地址
//   - event: 请求事件对象（由中间件传递）
//   - context: 请求上下文对象（由中间件传递）
// 返回: Promise，解析为邮件配置检查结果对象
const mailConfigHandler = async (url, event, context) => {
  try {
    // 从 URL 中提取域名
    // 优先使用 hostname，如果不存在则使用 pathname
    const domain = new URL(url).hostname || new URL(url).pathname;

    // 获取 MX（邮件交换）记录
    // MX 记录指定了接收该域名电子邮件的邮件服务器
    const mxRecords = await dns.resolveMx(domain);

    // 获取 TXT 记录
    // TXT 记录用于存储文本信息，常用于 SPF、DKIM、DMARC 等邮件安全配置
    const txtRecords = await dns.resolveTxt(domain);

    // 过滤出仅与邮件相关的 TXT 记录
    // 包括：SPF（发件人策略框架）、DKIM（域名密钥识别邮件）、DMARC（基于域名的消息认证、报告和一致性）
    // 以及某些邮件服务提供商的验证记录
    const emailTxtRecords = txtRecords.filter(record => {
      // 将记录数组连接为字符串
      const recordString = record.join('');
      // 检查记录是否以以下邮件相关标识开头或包含特定内容
      return (
        recordString.startsWith('v=spf1') ||           // SPF 记录
        recordString.startsWith('v=DKIM1') ||         // DKIM 记录
        recordString.startsWith('v=DMARC1') ||        // DMARC 记录
        recordString.startsWith('protonmail-verification=') ||  // ProtonMail 验证
        recordString.startsWith('google-site-verification=') || // Google Workspace 验证
        recordString.startsWith('MS=') ||             // Microsoft 365 验证
        recordString.startsWith('zoho-verification=') ||        // Zoho 验证
        recordString.startsWith('titan-verification=') ||       // Titan 验证
        recordString.includes('bluehost.com')        // BlueHost 验证
      );
    });

    // 识别特定的邮件服务提供商
    const mailServices = emailTxtRecords.map(record => {
      // 将记录数组连接为字符串
      const recordString = record.join('');
      // 检查记录并识别对应的邮件服务提供商
      if (recordString.startsWith('protonmail-verification=')) {
        // ProtonMail 邮件服务
        return { provider: 'ProtonMail', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('google-site-verification=')) {
        // Google Workspace（原 G Suite）邮件服务
        return { provider: 'Google Workspace', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('MS=')) {
        // Microsoft 365（原 Office 365）邮件服务
        return { provider: 'Microsoft 365', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('zoho-verification=')) {
        // Zoho 邮件服务
        return { provider: 'Zoho', value: recordString.split('=')[1] };
      } else if (recordString.startsWith('titan-verification=')) {
        // Titan 邮件服务
        return { provider: 'Titan', value: recordString.split('=')[1] };
      } else if (recordString.includes('bluehost.com')) {
        // BlueHost 邮件服务
        return { provider: 'BlueHost', value: recordString };
      } else {
        // 未识别的邮件服务
        return null;
      }
    }).filter(record => record !== null); // 过滤掉 null 值

    // 检查 MX 记录中是否包含 Yahoo 邮件服务
    const yahooMx = mxRecords.filter(record => record.exchange.includes('yahoodns.net'));
    if (yahooMx.length > 0) {
      // 如果找到 Yahoo 的 MX 记录，添加到邮件服务列表
      mailServices.push({ provider: 'Yahoo', value: yahooMx[0].exchange });
    }
    
    // 检查 MX 记录中是否包含 Mimecast 邮件安全服务
    const mimecastMx = mxRecords.filter(record => record.exchange.includes('mimecast.com'));
    if (mimecastMx.length > 0) {
      // 如果找到 Mimecast 的 MX 记录，添加到邮件服务列表
      mailServices.push({ provider: 'Mimecast', value: mimecastMx[0].exchange });
    }

    // 返回邮件配置检查结果
    return {
        mxRecords,              // MX 记录列表
        txtRecords: emailTxtRecords,  // 邮件相关的 TXT 记录列表
        mailServices,           // 识别的邮件服务提供商列表
      };
  } catch (error) {
    // 处理 DNS 查询错误
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      // 如果域名不存在或没有 DNS 记录，返回跳过信息
      return { skipped: '该域名未使用邮件服务器' };
    } else {
      // 其他错误，返回错误信息
      return {
        statusCode: 500,
        body: { error: error.message },
      };
    }
  }
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回邮件配置检查结果
export const handler = middleware(mailConfigHandler);
// 默认导出处理函数
export default handler;
