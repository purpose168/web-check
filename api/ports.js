// 导入 Node.js 的 net（网络）模块，用于创建 TCP 套接字和进行网络连接
import net from 'net';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// 常用端口列表
// 包含常见的网络服务端口，如 FTP、SSH、HTTP、HTTPS、MySQL 等
const DEFAULT_PORTS_TO_CHECK = [
  20,    // FTP 数据端口
  21,    // FTP 控制端口
  22,    // SSH（安全外壳协议）
  23,    // Telnet（远程登录）
  25,    // SMTP（简单邮件传输协议）
  53,    // DNS（域名系统）
  80,    // HTTP（超文本传输协议）
  67,    // DHCP 服务器
  68,    // DHCP 客户端
  69,    // TFTP（简单文件传输协议）
  110,   // POP3（邮局协议第 3 版）
  119,   // NNTP（网络新闻传输协议）
  123,   // NTP（网络时间协议）
  143,   // IMAP（互联网消息访问协议）
  156,   // SQL 服务器
  161,   // SNMP（简单网络管理协议）
  162,   // SNMP 陷阱
  179,   // BGP（边界网关协议）
  194,   // IRC（互联网中继聊天）
  389,   // LDAP（轻量级目录访问协议）
  443,   // HTTPS（安全 HTTP）
  587,   // SMTP 提交端口
  993,   // IMAPS（安全 IMAP）
  995,   // POP3S（安全 POP3）
  3000,  // 常见的开发服务器端口
  3306,  // MySQL 数据库
  3389,  // RDP（远程桌面协议）
  5060,  // SIP（会话发起协议）
  5900,  // VNC（虚拟网络计算）
  8000,  // 常见的开发服务器端口
  8080,  // 常见的 HTTP 代理端口
  8888   // 常见的开发服务器端口
];

/*
 * 检查环境变量 PORTS_TO_CHECK 是否已设置
 * 如果已设置，则通过 "," 分割字符串以获取要检查的端口数组
 * 如果未设置环境变量，则返回默认的常用端口列表
 */
const PORTS = process.env.PORTS_TO_CHECK ? process.env.PORTS_TO_CHECK.split(",") : DEFAULT_PORTS_TO_CHECK

// 检查指定端口是否开放的异步函数
// 参数:
//   - port: 要检查的端口号
//   - domain: 目标域名或 IP 地址
// 返回: Promise，如果端口开放则解析为端口号，否则拒绝
async function checkPort(port, domain) {
    return new Promise((resolve, reject) => {
        // 创建一个新的 TCP 套接字
        const socket = new net.Socket();

        // 设置连接超时时间为 1500 毫秒（1.5 秒）
        socket.setTimeout(1500);

        // 监听 'connect' 事件（连接成功时触发）
        socket.once('connect', () => {
            // 连接成功，销毁套接字以释放资源
            socket.destroy();
            // 解析 Promise，返回开放的端口号
            resolve(port);
        });

        // 监听 'timeout' 事件（连接超时时触发）
        socket.once('timeout', () => {
          // 连接超时，销毁套接字以释放资源
          socket.destroy();
          // 拒绝 Promise，返回超时错误
          reject(new Error(`端口超时：${port}`));
        });

        // 监听 'error' 事件（连接错误时触发）
        socket.once('error', (e) => {
            // 连接错误，销毁套接字以释放资源
            socket.destroy();
            // 拒绝 Promise，返回错误对象
            reject(e);
        });
        
        // 尝试连接到指定域名和端口
        socket.connect(port, domain);
    });
}

// 端口扫描处理器函数
// 该函数扫描目标域名的常用端口，检查哪些端口是开放的
// 参数:
//   - url: 要扫描的目标 URL 地址
//   - event: 请求事件对象（由中间件传递）
//   - context: 请求上下文对象（由中间件传递）
// 返回: Promise，解析为端口扫描结果对象
const portsHandler = async (url, event, context) => {
  // 从 URL 中提取域名（移除协议前缀）
  // 例如: https://example.com -> example.com
  const domain = url.replace(/(^\w+:|^)\/\//, '');
  
  // 创建延迟函数，用于实现超时控制
  const delay = ms => new Promise(res => setTimeout(res, ms));
  // 设置总体超时时间为 9000 毫秒（9 秒）
  const timeout = delay(9000);

  // 存储开放的端口号
  const openPorts = [];
  // 存储关闭或无法连接的端口号
  const failedPorts = [];

  // 为每个端口创建检查 Promise
  const promises = PORTS.map(port => checkPort(port, domain)
    .then(() => {
      // 端口开放，添加到 openPorts 数组
      openPorts.push(port);
      return { status: 'fulfilled', port };
    })
    .catch(() => {
      // 端口关闭或连接失败，添加到 failedPorts 数组
      failedPorts.push(port);
      return { status: 'rejected', port };
    }));

  // 标记是否达到超时
  let timeoutReached = false;

  // 遍历所有 Promise，使用 Promise.race 实现超时控制
  for (const promise of promises) {
    // 等待端口检查完成或超时
    const result = await Promise.race([promise, timeout.then(() => ({ status: 'timeout', timeout: true }))]);
    
    // 检查是否超时
    if (result.status === 'timeout') {
      timeoutReached = true;
      if (result.timeout) {
        // 将未检查的端口添加到 failedPorts 数组
        const checkedPorts = [...openPorts, ...failedPorts];
        const portsNotChecked = PORTS.filter(port => !checkedPorts.includes(port));
        failedPorts.push(...portsNotChecked);
      }
      // 超时后跳出循环
      break;
    }
  }

  // 如果达到超时，返回错误响应
  if(timeoutReached){
    return errorResponse('函数在完成之前超时。');
  }
  
  // 在返回之前对 openPorts 和 failedPorts 进行排序（升序）
  openPorts.sort((a, b) => a - b);
  failedPorts.sort((a, b) => a - b);
  
  // 返回端口扫描结果
  return { openPorts, failedPorts };
};

// 错误响应构造函数
// 参数:
//   - message: 错误消息
//   - statusCode: HTTP 状态码，默认为 444（连接关闭无响应）
// 返回: 包含错误信息的对象
const errorResponse = (message, statusCode = 444) => {
  return { error: message };
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回端口扫描结果
export const handler = middleware(portsHandler);
// 默认导出处理函数
export default handler;
