// 导入 Node.js 内置的 URL 模块
// URL 类用于解析和构建 URL 字符串
import { URL } from 'url';

// 导入 follow-redirects 库
// 该库提供了自动跟随重定向的 HTTP/HTTPS 客户端
// 与标准 http/https 模块不同，它会自动处理 3xx 重定向响应
import followRedirects from 'follow-redirects';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 从 follow-redirects 中解构出 https 对象
// 这个 https 对象与 Node.js 原生 https 模块 API 相同，但支持自动重定向
const { https } = followRedirects;

// security.txt 文件的常见路径列表
// security.txt 是一个标准化的安全策略文件，用于提供安全联系信息
// 根据 RFC 9116 标准，security.txt 文件应位于以下路径之一：
//   1. 网站根目录：/security.txt
//   2. .well-known 目录：/.well-known/security.txt（推荐路径）
const SECURITY_TXT_PATHS = [
  '/security.txt',              // 网站根目录下的 security.txt
  '/.well-known/security.txt', // .well-known 目录下的 security.txt（标准推荐路径）
];

// 解析 security.txt 文件内容的函数
// 功能：将 security.txt 文件的文本内容解析为结构化的键值对对象
// 参数:
//   - result: security.txt 文件的文本内容
// 返回: 包含解析后字段的对象
//   格式: { 字段名: 字段值, 字段名2: 字段值2, ... }
//   如果有重复的字段名，会在字段名后添加数字后缀（如: Contact, Contact2, Contact3）
const parseResult = (result) => {
  // 初始化输出对象，用于存储解析后的字段
  let output = {};
  
  // 初始化计数器对象，用于跟踪重复字段的出现次数
  let counts = {};
  
  // 将文件内容按行分割成数组
  const lines = result.split('\n');
  
  // 正则表达式，用于匹配键值对行
  // 正则说明:
  //   ^ - 行首
  //   ([^:]+) - 捕获组1：匹配一个或多个非冒号字符（字段名）
  //   : - 冒号分隔符
  //   \s* - 零个或多个空白字符
  //   (.+) - 捕获组2：匹配一个或多个任意字符（字段值）
  //   $ - 行尾
  const regex = /^([^:]+):\s*(.+)$/;
  
  // 遍历每一行内容
  for (const line of lines) {
    // 跳过注释行（以 # 开头）
    // 跳过 PGP 签名标记行（以 ----- 开头）
    // 跳过空行
    if (!line.startsWith("#") && !line.startsWith("-----") && line.trim() !== '') {
      // 使用正则表达式匹配键值对
      const match = line.match(regex);
      
      // 如果匹配成功且至少有 3 个元素（完整匹配 + 2 个捕获组）
      if (match && match.length > 2) {
        // 提取并去除字段名和字段值的空白字符
        let key = match[1].trim();
        const value = match[2].trim();
        
        // 检查字段名是否已存在（处理重复字段）
        if (output.hasOwnProperty(key)) {
          // 更新计数器，如果计数器不存在则初始化为 1，否则加 1
          counts[key] = counts[key] ? counts[key] + 1 : 1;
          
          // 在字段名后添加数字后缀，使其唯一
          // 例如：Contact -> Contact2 -> Contact3
          key += counts[key];
        }
        
        // 将字段名和字段值添加到输出对象中
        output[key] = value;
      }
    }
  }
  
  // 返回解析后的字段对象
  return output;
};

// 检查 security.txt 文件是否经过 PGP 签名的函数
// 功能：通过检查文件内容是否包含 PGP 签名标记来判断是否已签名
// 参数:
//   - result: security.txt 文件的文本内容
// 返回: 布尔值，true 表示已签名，false 表示未签名
const isPgpSigned = (result) => {
  // 检查文件内容是否包含 PGP 签名消息的开始标记
  // PGP 签名消息的标准格式以 "-----BEGIN PGP SIGNED MESSAGE-----" 开头
  if (result.includes('-----BEGIN PGP SIGNED MESSAGE-----')) {
    return true;
  }
  
  // 如果不包含签名标记，返回 false
  return false;
};

// security.txt 文件处理函数
// 功能：获取并解析指定网站的 security.txt 文件
// 参数:
//   - urlParam: 要检查的网站 URL 字符串（可以包含或不包含协议）
// 返回: 包含 security.txt 信息的对象，或表示文件不存在的对象
//   成功格式: {
//     isPresent: true,
//     foundIn: '/.well-known/security.txt',
//     content: '文件内容',
//     isPgpSigned: true/false,
//     fields: { 字段名: 字段值, ... }
//   }
//   不存在格式: { isPresent: false }
// 异常: 如果 URL 格式无效或请求失败，抛出包含错误信息的 Error 对象
const securityTxtHandler = async (urlParam) => {

  // 声明 URL 对象变量
  let url;
  
  try {
    // 尝试将字符串解析为 URL 对象
    // 如果 URL 参数不包含协议（://），则默认添加 https://
    url = new URL(urlParam.includes('://') ? urlParam : 'https://' + urlParam);
  } catch (error) {
    // 如果 URL 格式无效，抛出错误
    throw new Error('Invalid URL format');
  }
  
  // 清除 URL 的路径部分，只保留协议、主机名和端口
  // 这样可以确保从网站根目录开始查找 security.txt 文件
  url.pathname = '';
  
  // 遍历所有可能的 security.txt 文件路径
  // 按照优先级顺序尝试：先尝试根目录，再尝试 .well-known 目录
  for (let path of SECURITY_TXT_PATHS) {
    try {
      // 尝试获取指定路径的 security.txt 文件内容
      const result = await fetchSecurityTxt(url, path);
      
      // 如果返回结果包含 HTML 标签，说明返回的是网页而不是 security.txt 文件
      // 这通常意味着文件不存在，返回 isPresent: false
      if (result && result.includes('<html')) return { isPresent: false };
      
      // 如果成功获取到文件内容
      if (result) {
        // 返回包含完整信息的对象
        return {
          isPresent: true,              // 文件存在
          foundIn: path,                // 文件所在的路径
          content: result,             // 文件的原始内容
          isPgpSigned: isPgpSigned(result),  // 是否经过 PGP 签名
          fields: parseResult(result),  // 解析后的字段对象
        };
      }
    } catch (error) {
      // 如果请求过程中发生错误，抛出错误
      throw new Error(error.message);
    }
  }
  
  // 如果所有路径都尝试过仍未找到文件，返回 isPresent: false
  return { isPresent: false };
};

// 获取 security.txt 文件内容的辅助函数
// 功能：发送 HTTPS GET 请求获取指定路径的文件内容
// 参数:
//   - baseURL: 基础 URL 对象（包含协议、主机名、端口）
//   - path: security.txt 文件的路径
// 返回: Promise，解析为文件内容字符串，如果文件不存在则解析为 null
// 异常: 如果请求失败，拒绝 Promise 并返回错误对象
async function fetchSecurityTxt(baseURL, path) {
  // 返回 Promise 对象，用于异步处理请求
  return new Promise((resolve, reject) => {
    // 构建完整的 URL 对象
    // new URL(path, baseURL) 会将相对路径与基础 URL 合并
    const url = new URL(path, baseURL);
    
    // 使用 follow-redirects 的 https 模块发送 GET 请求
    // 该模块会自动跟随重定向（3xx 状态码）
    https.get(url.toString(), (res) => {
      // 检查 HTTP 状态码是否为 200（成功）
      if (res.statusCode === 200) {
        // 初始化数据缓冲区，用于存储响应数据
        let data = '';
        
        // 监听 'data' 事件，接收数据块
        // 响应数据可能分多次传输，每次接收到一个数据块时触发
        res.on('data', (chunk) => {
          // 将数据块追加到缓冲区
          data += chunk;
        });
        
        // 监听 'end' 事件，响应接收完成时触发
        res.on('end', () => {
          // 解析 Promise，返回完整的响应数据
          resolve(data);
        });
      } else {
        // 如果状态码不是 200，解析为 null（文件不存在）
        resolve(null);
      }
    }).on('error', (err) => {
      // 监听 'error' 事件，请求失败时触发
      // 拒绝 Promise，返回错误对象
      reject(err);
    });
  });
}

// 使用中间件包装 security.txt 处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(securityTxtHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './security-txt.js' 导入
export default handler;
