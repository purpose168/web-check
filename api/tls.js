// 导入 axios 库
// axios 是一个基于 Promise 的 HTTP 客户端，用于浏览器和 Node.js
// 它提供了简洁的 API 来发起 HTTP 请求，支持请求和响应拦截、转换数据等
import axios from 'axios';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// Mozilla TLS Observatory API 端点 URL
// Mozilla TLS Observatory 是 Mozilla 基金会提供的 TLS 配置分析服务
// 它可以分析网站的 TLS/SSL 配置，评估安全性，并提供改进建议
// 该服务检查的内容包括：
//   - TLS 协议版本（TLS 1.2、TLS 1.3 等）
//   - 加密套件（Cipher Suites）配置
//   - 证书链有效性
//   - 证书签名算法
//   - 前向保密（Forward Secrecy）支持
//   - HSTS（HTTP Strict Transport Security）配置
//   - OCSP（Online Certificate Status Protocol）装订
//   - 其他安全配置项
// API 版本：v1
const MOZILLA_TLS_OBSERVATORY_API = 'https://tls-observatory.services.mozilla.com/api/v1';

// TLS 配置分析处理函数
// 功能：使用 Mozilla TLS Observatory API 分析指定网站的 TLS/SSL 配置
// TLS（Transport Layer Security）是用于在网络通信中提供加密和数据完整性的安全协议
// 它是 SSL（Secure Sockets Layer）的继任者
// 参数:
//   - url: 要分析的网站 URL 字符串（必须包含协议，如 https://example.com）
// 返回: Promise，解析为 TLS 分析结果对象
//   成功格式: {
//     statusCode: 200,
//     body: {
//       id: 12345,                    // 扫描 ID
//       antecedents: [],              // 前置扫描 ID
//       completion_percentage: 100,   // 完成百分比
//       configuration: { ... },       // TLS 配置详情
//       hosts: ['example.com'],       // 分析的主机列表
//       start_time: '2024-01-01T00:00:00Z',  // 扫描开始时间
//       end_time: '2024-01-01T00:00:05Z',    // 扫描结束时间
//       duration: 5,                  // 扫描持续时间（秒）
//       tests: { ... },               // 测试结果
//       grade: 'A+',                  // 安全等级（A+ 到 F）
//       ...其他字段
//     }
//   }
//   错误格式: { error: '错误信息' }
//   API 错误格式: {
//     statusCode: 500,
//     body: { error: 'Failed to get scan_id from TLS Observatory' }
//   }
const tlsHandler = async (url) => {
  try {
    // 从 URL 中提取域名（hostname）
    // Mozilla TLS Observatory API 按域名进行分析，而不是完整的 URL
    // 例如：https://example.com/path -> example.com
    // new URL(url).hostname 返回 URL 的主机名部分
    const domain = new URL(url).hostname;
    
    // 发起 TLS 扫描请求到 Mozilla TLS Observatory API
    // 使用 POST 方法发起扫描请求
    // /scan 端点用于创建新的扫描任务
    // target 参数指定要扫描的域名
    // 这是一个异步操作，API 会返回一个 scan_id，后续可以通过这个 ID 获取扫描结果
    const scanResponse = await axios.post(`${MOZILLA_TLS_OBSERVATORY_API}/scan?target=${domain}`);
    
    // 从扫描响应中提取 scan_id
    // scan_id 是一个数字，用于标识这次扫描任务
    // 后续可以使用这个 ID 来查询扫描结果
    const scanId = scanResponse.data.scan_id;

    // 验证 scan_id 是否为有效的数字
    // typeof scanId !== 'number' 检查 scan_id 的类型
    // 如果 scan_id 不是数字，说明 API 返回了错误或异常情况
    if (typeof scanId !== 'number') {
      // 如果 scan_id 无效，返回错误响应
      // statusCode: 500 表示服务器内部错误
      // error: 'Failed to get scan_id from TLS Observatory' 说明无法获取扫描 ID
      return {
        statusCode: 500,
        body: { error: 'Failed to get scan_id from TLS Observatory' },
      };
    }
    
    // 使用 scan_id 获取扫描结果
    // 使用 GET 方法查询扫描结果
    // /results 端点用于获取扫描任务的详细结果
    // id 参数指定要查询的扫描 ID
    // 扫描可能需要一些时间才能完成，API 会返回当前的扫描状态
    // 如果扫描未完成，completion_percentage 会小于 100
    const resultResponse = await axios.get(`${MOZILLA_TLS_OBSERVATORY_API}/results?id=${scanId}`);
    
    // 返回成功的响应
    // statusCode: 200 表示请求成功
    // body: resultResponse.data 包含完整的 TLS 分析结果
    return {
      statusCode: 200,
      body: resultResponse.data,
    };
    
  } catch (error) {
    // 捕获请求过程中的错误
    // 可能的错误类型：
    //   - 网络错误：无法连接到 Mozilla TLS Observatory API
    //   - 超时错误：请求或扫描时间过长
    //   - API 错误：API 返回错误响应
    //   - 解析错误：响应数据格式不正确
    // 返回错误信息
    return { error: error.message };
  }
};

// 使用中间件包装 TLS 配置分析处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(tlsHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './tls.js' 导入
export default handler;
