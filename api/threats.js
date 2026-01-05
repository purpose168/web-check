// 导入 axios 库
// axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js
// 它提供了简洁的 API 来发起 HTTP 请求，支持请求和响应拦截、转换数据等
import axios from 'axios';

// 导入 xml2js 库
// xml2js 是一个 XML 到 JavaScript 对象的转换器
// 它可以将 XML 格式的数据解析为 JavaScript 对象，也可以将 JavaScript 对象转换为 XML
// PhishTank API 返回 XML 格式的响应，需要使用此库进行解析
import xml2js from 'xml2js';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// Google Safe Browsing API 检测函数
// 功能：使用 Google Safe Browsing API 检测 URL 是否存在安全威胁
// Google Safe Browsing 是 Google 提供的安全浏览服务，用于检测恶意网站、钓鱼网站等
// 参数:
//   - url: 要检测的 URL 字符串
// 返回: Promise，解析为检测结果对象
//   不安全格式: {
//     unsafe: true,
//     details: [
//       {
//         threatType: 'MALWARE',                    // 威胁类型
//         platformType: 'ANY_PLATFORM',              // 平台类型
//         threatEntryType: 'URL',                   // 威胁条目类型
//         threat: { url: 'https://malicious.com' } // 威胁 URL
//       },
//       ...更多匹配项
//     ]
//   }
//   安全格式: { unsafe: false }
//   错误格式: { error: '错误信息' }
const getGoogleSafeBrowsingResult = async (url) => {
  try {
    // 从环境变量中获取 Google Cloud API 密钥
    // Google Safe Browsing API 需要使用 Google Cloud API 密钥进行身份验证
    // API 密钥需要在 Google Cloud Console 中创建并配置
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    
    // 检查 API 密钥是否存在
    if (!apiKey) {
      // 如果未提供 API 密钥，返回错误信息
      // 用户需要设置 GOOGLE_CLOUD_API_KEY 环境变量才能使用此功能
      return { error: 'GOOGLE_CLOUD_API_KEY is required for the Google Safe Browsing check' };
    }
    
    // 构建 Google Safe Browsing API 端点 URL
    // v4 是当前版本的 API
    // threatMatches:find 是查找威胁匹配的端点
    // key 参数用于身份验证
    const apiEndpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    // 构建请求体
    // Google Safe Browsing API v4 使用 JSON 格式的请求体
    const requestBody = {
      // threatInfo 包含要检查的威胁信息
      threatInfo: {
        // threatTypes 指定要检测的威胁类型
        // 可选的威胁类型包括：
        //   - MALWARE: 恶意软件，包含恶意代码的网站
        //   - SOCIAL_ENGINEERING: 社会工程学，钓鱼网站、欺诈网站
        //   - UNWANTED_SOFTWARE: 不需要的软件，诱导用户安装的软件
        //   - POTENTIALLY_HARMFUL_APPLICATION: 潜在有害应用
        //   - API_ABUSE: API 滥用
        threatTypes: [
          'MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION', 'API_ABUSE'
        ],
        
        // platformTypes 指定平台类型
        // ANY_PLATFORM 表示检查所有平台（Windows、Mac、Linux、Android、iOS 等）
        platformTypes: ["ANY_PLATFORM"],
        
        // threatEntryTypes 指定威胁条目类型
        // URL 表示检查 URL 类型的威胁
        threatEntryTypes: ["URL"],
        
        // threatEntries 包含要检查的威胁条目列表
        // 可以一次检查多个 URL
        threatEntries: [{ url }]
      }
    };

    // 发起 POST 请求到 Google Safe Browsing API
    // axios.post() 发送 POST 请求并返回 Promise
    const response = await axios.post(apiEndpoint, requestBody);
    
    // 检查响应数据中是否包含威胁匹配
    // response.data.matches 是一个数组，包含所有匹配的威胁
    if (response.data && response.data.matches) {
      // 如果存在威胁匹配，返回不安全标记和详细信息
      return {
        unsafe: true,
        details: response.data.matches
      };
    } else {
      // 如果没有威胁匹配，返回安全标记
      return { unsafe: false };
    }
  } catch (error) {
    // 捕获请求过程中的错误
    // 可能的错误类型：网络错误、API 密钥无效、请求超时等
    return { error: `Request failed: ${error.message}` };
  }
};

// URLHaus API 检测函数
// 功能：使用 URLHaus API 检测域名是否被标记为恶意
// URLHaus 是一个恶意 URL 和恶意软件分发网站数据库
// 它收集和分析恶意软件分发 URL，提供查询接口
// 参数:
//   - url: 要检测的 URL 字符串
// 返回: Promise，解析为检测结果对象
//   成功格式: {
//     query_status: 'ok',
//     host: 'example.com',
//     firstseen: '2024-01-01',
//     lastseen: '2024-01-15',
//     url_count: 10,
//     ...其他字段
//   }
//   未找到格式: { query_status: 'no_results' }
//   错误格式: { error: '错误信息' }
const getUrlHausResult = async (url) => {
  // 从 URL 中提取域名（hostname）
  // URLHaus API 按域名进行查询，而不是完整的 URL
  // 例如：https://example.com/path -> example.com
  let domain = new URL(url).hostname;
  
  // 使用 axios 发起 POST 请求到 URLHaus API
  // axios() 方法提供了更灵活的请求配置
  return await axios({
    // 请求方法：POST
    method: 'post',
    
    // API 端点 URL
    // /v1/host/ 是按域名查询的端点
    url: 'https://urlhaus-api.abuse.ch/v1/host/',
    
    // 请求头
    headers: {
      // Content-Type 指定请求体的格式
      // application/x-www-form-urlencoded 是表单编码格式
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    
    // 请求体数据
    // 使用表单编码格式，参数为 host=域名
    data: `host=${domain}`
  })
  // 请求成功后，提取响应数据
  .then((x) => x.data)
  // 请求失败后，返回错误信息
  .catch((e) => ({ error: `Request to URLHaus failed, ${e.message}` }));
};


// PhishTank API 检测函数
// 功能：使用 PhishTank API 检测 URL 是否为钓鱼网站
// PhishTank 是一个社区驱动的钓鱼网站数据库
// 用户可以提交和验证钓鱼网站，提供 API 查询接口
// 参数:
//   - url: 要检测的 URL 字符串
// 返回: Promise，解析为检测结果对象
//   钓鱼网站格式: {
//   in_database: true,
//   verified: true,
//   valid: true,
//   phish_detail_url: 'https://phishtank.com/phish_detail.php?phish_id=12345'
// }
//   安全网站格式: { in_database: false }
//   错误格式: { error: '错误信息' }
const getPhishTankResult = async (url) => {
  try {
    // 将 URL 编码为 Base64 格式
    // PhishTank API 要求 URL 参数使用 Base64 编码
    // Buffer.from(url).toString('base64') 将字符串转换为 Base64
    // 这样可以避免 URL 中的特殊字符导致的问题
    const encodedUrl = Buffer.from(url).toString('base64');
    
    // 构建 PhishTank API 端点 URL
    // checkurl 端点用于检查 URL 是否为钓鱼网站
    // url 参数是 Base64 编码后的 URL
    const endpoint = `https://checkurl.phishtank.com/checkurl/?url=${encodedUrl}`;
    
    // 设置请求头
    const headers = {
      // User-Agent 标识请求来源
      // PhishTank 要求设置 User-Agent 头
      'User-Agent': 'phishtank/web-check',
    };
    
    // 发起 POST 请求到 PhishTank API
    // 设置超时时间为 3000 毫秒（3 秒）
    // 请求体为 null，因为参数已经在 URL 中
    const response = await axios.post(endpoint, null, { headers, timeout: 3000 });
    
    // 解析 XML 响应数据
    // PhishTank API 返回 XML 格式的响应
    // xml2js.parseStringPromise() 将 XML 解析为 JavaScript 对象
    // explicitArray: false 表示如果元素只有一个子元素，不包装成数组
    const parsed = await xml2js.parseStringPromise(response.data, { explicitArray: false });
    
    // 返回解析后的结果
    // parsed.response.results 包含检测结果
    return parsed.response.results;
  } catch (error) {
    // 捕获请求或解析过程中的错误
    return { error: `Request to PhishTank failed: ${error.message}` };
  }
}

// Cloudmersive API 检测函数
// 功能：使用 Cloudmersive Virus Scan API 检测 URL 是否包含恶意软件
// Cloudmersive 提供多种安全 API，包括病毒扫描、内容过滤等
// 参数:
//   - url: 要检测的 URL 字符串
// 返回: Promise，解析为检测结果对象
//   成功格式: {
//     CleanResult: true,
//     FoundViruses: [],
//     ...其他字段
//   }
//   发现病毒格式: {
//     CleanResult: false,
//     FoundViruses: [
//       {
//         FileName: 'malware.exe',
//         VirusName: 'Trojan.Generic'
//       }
//     ]
//   }
//   错误格式: { error: '错误信息' }
const getCloudmersiveResult = async (url) => {
  // 从环境变量中获取 Cloudmersive API 密钥
  // Cloudmersive API 需要使用 API 密钥进行身份验证
  // API 密钥需要在 Cloudmersive 网站上注册获取
  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  
  // 检查 API 密钥是否存在
  if (!apiKey) {
    // 如果未提供 API 密钥，返回错误信息
    // 用户需要设置 CLOUDMERSIVE_API_KEY 环境变量才能使用此功能
    return { error: 'CLOUDMERSIVE_API_KEY is required for the Cloudmersive check' };
  }
  
  try {
    // 构建 Cloudmersive API 端点 URL
    // /virus/scan/website 是网站病毒扫描端点
    const endpoint = 'https://api.cloudmersive.com/virus/scan/website';
    
    // 设置请求头
    const headers = {
      // Content-Type 指定请求体的格式
      'Content-Type': 'application/x-www-form-urlencoded',
      
      // Apikey 用于身份验证
      // Cloudmersive 要求在请求头中提供 API 密钥
      'Apikey': apiKey,
    };
    
    // 构建请求数据
    // 使用表单编码格式
    // encodeURIComponent() 对 URL 进行编码，确保特殊字符正确传输
    const data = `Url=${encodeURIComponent(url)}`;
    
    // 发起 POST 请求到 Cloudmersive API
    const response = await axios.post(endpoint, data, { headers });
    
    // 返回响应数据
    return response.data;
  } catch (error) {
    // 捕获请求过程中的错误
    return { error: `Request to Cloudmersive failed: ${error.message}` };
  }
};

// 威胁检测主处理函数
// 功能：使用多个安全服务同时检测 URL 的安全威胁
// 综合使用 Google Safe Browsing、URLHaus、PhishTank 和 Cloudmersive 四个服务
// 参数:
//   - url: 要检测的 URL 字符串
// 返回: Promise，解析为综合检测结果对象
//   成功格式: JSON 字符串，包含四个服务的检测结果
//   {
//     urlHaus: { ... },           // URLHaus 检测结果
//     phishTank: { ... },         // PhishTank 检测结果
//     cloudmersive: { ... },      // Cloudmersive 检测结果
//     safeBrowsing: { ... }       // Google Safe Browsing 检测结果
//   }
//   异常: 如果所有请求都失败，抛出错误
const threatsHandler = async (url) => {
  try {
    // 并行发起四个安全服务的检测请求
    // 使用 Promise.all() 可以同时发起多个异步请求
    // 这样可以大大减少总等待时间，因为所有请求是并行执行的
    
    // 调用 URLHaus API 检测域名威胁
    const urlHaus = await getUrlHausResult(url);
    
    // 调用 PhishTank API 检测钓鱼网站
    const phishTank = await getPhishTankResult(url);
    
    // 调用 Cloudmersive API 检测恶意软件
    const cloudmersive = await getCloudmersiveResult(url);
    
    // 调用 Google Safe Browsing API 检测多种威胁
    const safeBrowsing = await getGoogleSafeBrowsingResult(url);
    
    // 检查所有请求是否都失败
    // 如果四个服务的检测结果都包含 error 字段，说明所有请求都失败了
    if (urlHaus.error && phishTank.error && cloudmersive.error && safeBrowsing.error) {
      // 如果所有请求都失败，抛出错误
      // 错误信息包含所有服务的错误消息
      throw new Error(`All requests failed - ${urlHaus.error} ${phishTank.error} ${cloudmersive.error} ${safeBrowsing.error}`);
    }
    
    // 将四个服务的检测结果合并为一个对象
    // 使用 JSON.stringify() 将对象转换为 JSON 字符串
    // 这样可以确保返回的数据格式一致
    return JSON.stringify({ urlHaus, phishTank, cloudmersive, safeBrowsing });
    
  } catch (error) {
    // 捕获检测过程中的错误
    // 重新抛出错误，让上层处理
    throw new Error(error.message);
  }
};

// 使用中间件包装威胁检测处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(threatsHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './threats.js' 导入
export default handler;
