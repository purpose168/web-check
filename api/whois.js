// 导入 Node.js 的 net 模块
// net 模块提供了用于创建基于流（TCP）或数据报（UDP）的服务器和客户端的网络功能
// 在本文件中，用于创建 TCP 客户端连接到 WHOIS 服务器
import net from 'net';
// 导入 psl（Public Suffix List）模块
// psl 是一个用于解析域名的公共后缀列表库
// 公共后缀列表（Public Suffix List）是 Mozilla 维护的域名后缀列表
// 它可以帮助识别有效的顶级域名（TLD）和二级域名
// 例如：对于 "example.co.uk"，psl 可以识别出 "co.uk" 是公共后缀
import psl from 'psl';
// 导入 axios HTTP 客户端库
// axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js
// 它支持请求和响应拦截器、转换 JSON 数据、客户端防御 XSRF 等
// 在本文件中，用于调用外部 WHOIS API
import axios from 'axios';
// 导入通用中间件模块
// 中间件用于在处理请求之前或之后执行通用逻辑，如：
//   - 请求验证
//   - 错误处理
//   - 日志记录
//   - 响应格式化
import middleware from './_common/middleware.js';

// 获取基础域名的辅助函数
// 功能：从完整的 URL 中提取基础域名（包括协议）
// 基础域名是指去掉子域名后的域名，例如：
//   - "https://www.example.com/path" -> "https://example.com"
//   - "http://blog.example.co.uk" -> "http://example.co.uk"
// 参数:
//   - url: 完整的 URL 字符串
// 返回: 包含协议的基础域名字符串
const getBaseDomain = (url) => {
  // 初始化协议变量
  let protocol = '';
  
  // 检查 URL 是否以 http:// 开头
  if (url.startsWith('http://')) {
      protocol = 'http://';
  } 
  // 检查 URL 是否以 https:// 开头
  else if (url.startsWith('https://')) {
      protocol = 'https://';
  }
  
  // 从 URL 中移除协议部分
  // replace() 方法将协议字符串替换为空字符串
  let noProtocolUrl = url.replace(protocol, '');
  
  // 使用 psl 库解析域名
  // psl.parse() 方法返回一个对象，包含以下属性：
  //   - domain: 基础域名（去掉子域名）
  //   - subdomain: 子域名
  //   - sld: 二级域名
  //   - tld: 顶级域名
  //   - listed: 是否在公共后缀列表中
  const parsed = psl.parse(noProtocolUrl);
  
  // 返回包含协议的基础域名
  return protocol + parsed.domain;
};

// 解析 WHOIS 数据的辅助函数
// 功能：将 WHOIS 服务器返回的原始文本数据解析为结构化的键值对对象
// WHOIS 数据格式通常是键值对形式，每行一个字段，用冒号分隔
// 例如：
//   Domain Name: EXAMPLE.COM
//   Registrar: EXAMPLE REGISTRAR
//   Created Date: 1995-08-13T04:00:00Z
// 参数:
//   - data: WHOIS 服务器返回的原始文本数据
// 返回: 解析后的键值对对象
//   如果域名不存在，返回 { error: 'No matches found for domain in internic database' }
const parseWhoisData = (data) => {
  // 检查数据是否包含 "No match for" 字符串
  // 这表示在 Internic 数据库中找不到该域名
  if (data.includes('No match for')) {
    return { error: 'No matches found for domain in internic database'};
  }
  
  // 将数据按换行符分割为行数组
  // \r\n 是 Windows 风格的换行符
  const lines = data.split('\r\n');
  
  // 初始化解析后的数据对象
  const parsedData = {};

  // 记录上一个键，用于处理多行值的情况
  // 有些 WHOIS 记录的值可能跨越多行
  let lastKey = '';

  // 遍历每一行
  for (const line of lines) {
    // 查找冒号的位置，冒号用于分隔键和值
    const index = line.indexOf(':');
    
    // 如果没有找到冒号，说明这一行是上一行的延续
    if (index === -1) {
      // 如果有上一个键，将这一行追加到该键的值中
      if (lastKey !== '') {
        parsedData[lastKey] += ' ' + line.trim();
      }
      // 继续处理下一行
      continue;
    }
    
    // 提取键（冒号之前的部分），并去除首尾空格
    let key = line.slice(0, index).trim();
    
    // 提取值（冒号之后的部分），并去除首尾空格
    const value = line.slice(index + 1).trim();
    
    // 如果值为空，跳过这一行
    if (value.length === 0) continue;
    
    // 将键中的非字母数字字符替换为下划线
    // \W 匹配任何非单词字符（等价于 [^a-zA-Z0-9_]）
    // + 表示匹配一个或多个
    // 这样可以将键名规范化，例如 "Domain Name" -> "Domain_Name"
    key = key.replace(/\W+/g, '_');
    
    // 记录当前键，用于可能的多行值
    lastKey = key;

    // 将键值对添加到解析后的数据对象中
    parsedData[key] = value;
  }

  // 返回解析后的数据对象
  return parsedData;
};

// 从 Internic WHOIS 服务器获取数据的函数
// 功能：通过 TCP 连接到 Internic WHOIS 服务器查询域名信息
// Internic（Internet Network Information Center）是互联网域名注册管理机构
// WHOIS 是一个用于查询域名注册信息的协议
// 参数:
//   - hostname: 要查询的主机名（域名）
// 返回: Promise，解析为解析后的 WHOIS 数据对象
const fetchFromInternic = async (hostname) => {
  // 返回一个 Promise，用于异步操作
  return new Promise((resolve, reject) => {
    // 创建 TCP 客户端连接到 WHOIS 服务器
    // WHOIS 协议通常使用 TCP 端口 43
    // whois.internic.net 是 Internic 的 WHOIS 服务器
    const client = net.createConnection({ port: 43, host: 'whois.internic.net' }, () => {
      // 连接建立后的回调函数
      // 向服务器发送查询请求
      // WHOIS 协议的请求格式很简单，只需发送域名加上换行符
      // \r\n 是标准的网络换行符
      client.write(hostname + '\r\n');
    });

    // 初始化数据缓冲区
    let data = '';
    
    // 监听 'data' 事件，接收服务器返回的数据
    // 数据可能会分多次到达，每次触发 'data' 事件
    client.on('data', (chunk) => {
      // 将接收到的数据块追加到缓冲区
      data += chunk;
    });

    // 监听 'end' 事件，表示服务器关闭了连接
    client.on('end', () => {
      try {
        // 解析接收到的 WHOIS 数据
        const parsedData = parseWhoisData(data);
        // 解析成功，解析 Promise
        resolve(parsedData);
      } catch (error) {
        // 解析失败，拒绝 Promise
        reject(error);
      }
    });

    // 监听 'error' 事件，处理连接错误
    client.on('error', (err) => {
      // 发生错误，拒绝 Promise
      reject(err);
    });
  });
};

// 从自定义 WHOIS API 获取数据的函数
// 功能：调用外部 WHOIS API 获取域名信息
// 参数:
//   - hostname: 要查询的主机名（域名）
// 返回: Promise，解析为 API 返回的数据
//   如果请求失败，返回 null
const fetchFromMyAPI = async (hostname) => {
  try {
    // 使用 axios 发送 POST 请求到 WHOIS API
    // API 端点：https://whois-api-zeta.vercel.app/
    // 请求体：包含域名信息
    const response = await axios.post('https://whois-api-zeta.vercel.app/', {
      domain: hostname
    });
    
    // 返回 API 响应的数据
    return response.data;
  } catch (error) {
    // 捕获请求错误
    // 打印错误信息到控制台
    console.error('Error fetching data from your API:', error.message);
    // 返回 null 表示请求失败
    return null;
  }
};

// WHOIS 查询主处理函数
// 功能：查询指定域名的 WHOIS 信息，从多个数据源获取数据
// WHOIS 是一个用于查询域名注册信息的协议和数据库
// 它包含域名的注册者信息、注册商信息、创建日期、过期日期等
// 参数:
//   - url: 要查询的 URL 或域名
// 返回: Promise，解析为包含多个数据源 WHOIS 信息的对象
//   格式: {
//     internicData: { ... },  // 从 Internic 获取的数据
//     whoisData: { ... }       // 从自定义 API 获取的数据
//   }
const whoisHandler = async (url) => {
  // 检查 URL 是否包含协议
  // 如果没有协议，默认添加 http://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }

  // 初始化主机名变量
  let hostname;
  
  try {
    // 解析 URL 并获取基础域名
    // new URL() 构造函数将 URL 字符串解析为 URL 对象
    // .hostname 属性返回主机名（域名）
    // getBaseDomain() 函数从主机名中提取基础域名
    hostname = getBaseDomain(new URL(url).hostname);
  } catch (error) {
    // 如果 URL 解析失败，抛出错误
    throw new Error(`Unable to parse URL: ${error}`);
  }

  // 并行发起两个 WHOIS 查询请求
  // 使用 Promise.all() 可以同时发起多个异步请求
  // 这样可以大大减少总等待时间，因为所有请求是并行执行的
  const [internicData, whoisData] = await Promise.all([
    // 从 Internic WHOIS 服务器查询
    fetchFromInternic(hostname),
    // 从自定义 WHOIS API 查询
    fetchFromMyAPI(hostname)
  ]);

  // 返回包含两个数据源结果的对象
  return {
    internicData,
    whoisData
  };
};

// 导出处理函数，并应用中间件
// middleware() 函数将 whoisHandler 包装在中间件中
// 中间件会在处理请求之前或之后执行通用逻辑
// 例如：验证请求、处理错误、格式化响应等
export const handler = middleware(whoisHandler);
// 导出默认处理函数
// 这样可以通过 import handler from './whois.js' 或
// import { handler } from './whois.js' 两种方式导入
export default handler;

