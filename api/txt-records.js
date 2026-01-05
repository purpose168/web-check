// 导入 Node.js 的 DNS 模块的 Promise API
// dns/promises 模块提供了基于 Promise 的 DNS 解析功能
// 相比回调版本的 dns 模块，Promise API 更易于使用和集成到异步代码中
// DNS（Domain Name System）是域名系统，用于将域名解析为 IP 地址
// TXT 记录是 DNS 记录的一种类型，用于存储文本信息
// 常见用途包括：
//   - SPF（Sender Policy Framework）记录，用于邮件发送验证
//   - DKIM（DomainKeys Identified Mail）记录，用于邮件签名验证
//   - DMARC（Domain-based Message Authentication, Reporting, and Conformance）记录，用于邮件认证策略
//   - 域名验证记录
//   - 其他自定义配置信息
import dns from 'dns/promises';
// 导入通用中间件模块
// 中间件用于在处理请求之前或之后执行通用逻辑，如：
//   - 请求验证
//   - 错误处理
//   - 日志记录
//   - 响应格式化
import middleware from './_common/middleware.js';

// TXT 记录查询处理函数
// 功能：查询指定域名的 DNS TXT 记录，并将其解析为易于阅读的对象格式
// 参数:
//   - url: 要查询的 URL 字符串（如 https://example.com）
//   - event: 事件对象（由 AWS Lambda 或类似平台提供）
//   - context: 上下文对象（由中间件提供，包含请求信息等）
// 返回: Promise，解析为 TXT 记录对象
//   成功格式: {
//     "key1": "value1",
//     "key2": "value2",
//     ...
//   }
//   异常: 如果查询失败或 URL 无效，抛出错误
const txtRecordHandler = async (url, event, context) => {
  try {
    // 解析 URL 字符串为 URL 对象
    // new URL() 构造函数将 URL 字符串解析为 URL 对象
    // 该对象包含多个属性，如 protocol、hostname、pathname 等
    const parsedUrl = new URL(url);
    
    // 查询指定域名的 TXT 记录
    // dns.resolveTxt() 是异步方法，返回一个 Promise
    // 参数是主机名（hostname），如 "example.com"
    // 返回的 TXT 记录是一个二维数组，格式为：
    //   [
    //     ["key1=value1", "key2=value2"],  // 第一条 TXT 记录可能包含多个字符串
    //     ["key3=value3"],                  // 第二条 TXT 记录
    //     ...
    //   ]
    // 每条 TXT 记录可能包含多个字符串，这些字符串会被 DNS 服务器连接在一起
    // 但在实际应用中，通常每条记录只包含一个字符串
    const txtRecords = await dns.resolveTxt(parsedUrl.hostname);

    // 解析和格式化 TXT 记录为单个对象
    // 使用 reduce 方法将二维数组的 TXT 记录转换为键值对对象
    // reduce 的第一个参数是累加器（acc），初始值为空对象 {}
    // reduce 的第二个参数是当前元素（recordArray），表示一条 TXT 记录
    const readableTxtRecords = txtRecords.reduce((acc, recordArray) => {
      // 对每条 TXT 记录中的字符串数组进行解析
      // recordArray 是一个字符串数组，如 ["key1=value1", "key2=value2"]
      // 使用 reduce 方法将每个字符串解析为键值对
      const recordObject = recordArray.reduce((recordAcc, recordString) => {
        // 将字符串按第一个等号（=）分割为键和值
        // split('=') 会将字符串分割为数组
        // 例如："key1=value1" -> ["key1", "value1"]
        // "key1=value1=value2" -> ["key1", "value1", "value2"]
        const splitRecord = recordString.split('=');
        
        // 键是分割后的第一个元素
        const key = splitRecord[0];
        
        // 值是分割后的剩余元素，用等号连接
        // slice(1) 获取从第二个元素开始的所有元素
        // join('=') 将这些元素用等号连接起来
        // 这样可以处理值中包含等号的情况
        const value = splitRecord.slice(1).join('=');
        
        // 将键值对添加到记录对象中
        // 使用展开运算符（...）保留之前的键值对
        return { ...recordAcc, [key]: value };
      }, {});
      
      // 将当前记录对象的键值对合并到累加器中
      // 使用展开运算符（...）保留之前的键值对
      return { ...acc, ...recordObject };
    }, {});

    // 返回格式化后的 TXT 记录对象
    return readableTxtRecords;

  } catch (error) {
    // 检查错误代码是否为无效 URL 错误
    // ERR_INVALID_URL 是 Node.js URL 模块的标准错误代码
    // 当提供的 URL 字符串格式不正确时会抛出此错误
    if (error.code === 'ERR_INVALID_URL') {
      // 抛出包含详细信息的错误
      throw new Error(`Invalid URL ${error}`);
    } else {
      // 对于其他错误，直接抛出原始错误对象
      // 这样可以保留原始错误的堆栈跟踪和详细信息
      throw error;
    }
  }
};

// 导出处理函数，并应用中间件
// middleware() 函数将 txtRecordHandler 包装在中间件中
// 中间件会在处理请求之前或之后执行通用逻辑
// 例如：验证请求、处理错误、格式化响应等
export const handler = middleware(txtRecordHandler);
// 导出默认处理函数
// 这样可以通过 import handler from './txt-records.js' 或
// import { handler } from './txt-records.js' 两种方式导入
export default handler;
