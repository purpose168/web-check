// 导入 Node.js 内置的 tls 模块
// tls 模块提供了 TLS（Transport Layer Security）和 SSL（Secure Sockets Layer）协议的实现
// TLS/SSL 是用于在网络通信中提供加密和数据完整性的安全协议
import tls from 'tls';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// SSL/TLS 证书处理函数
// 功能：获取并解析指定网站的 SSL/TLS 证书信息
// SSL/TLS 证书用于验证网站身份并建立加密连接
// 参数:
//   - urlString: 要检查的网站 URL 字符串（必须包含协议，如 https://example.com）
// 返回: Promise，解析为证书信息对象
//   成功格式: {
//     subject: { CN: 'example.com', ... },      // 证书主题信息
//     issuer: { CN: 'Let's Encrypt', ... },     // 证书颁发者信息
//     valid_from: 'Jan 1 00:00:00 2024 GMT',    // 证书生效时间
//     valid_to: 'Dec 31 23:59:59 2024 GMT',    // 证书过期时间
//     ...其他证书字段
//   }
//   异常: 如果获取证书失败，抛出错误
const sslHandler = async (urlString) => {
  try {
    // 使用 URL API 解析输入的 URL 字符串
    // URL 对象提供了方便的属性来访问 URL 的各个组成部分
    const parsedUrl = new URL(urlString);
    
    // 创建 TLS 连接选项对象
    // 这些选项用于配置与服务器建立 TLS 连接时的参数
    const options = {
      // 主机名：从 URL 中提取的主机名（域名或 IP 地址）
      host: parsedUrl.hostname,
      
      // 端口号：使用 URL 中指定的端口，如果未指定则使用默认的 443 端口
      // 443 是 HTTPS 协议的标准端口
      port: parsedUrl.port || 443,
      
      // 服务器名称：用于 SNI（Server Name Indication，服务器名称指示）
      // SNI 允许服务器在同一个 IP 地址上托管多个 SSL 证书
      // 服务器可以根据客户端发送的 servername 返回正确的证书
      servername: parsedUrl.hostname,
      
      // 是否拒绝未授权的证书
      // 设置为 false 表示不验证证书的有效性（自签名证书、过期证书等也会被接受）
      // 这样可以获取证书信息而不受证书验证失败的影响
      rejectUnauthorized: false,
    };

    // 返回一个 Promise 对象，用于异步处理 TLS 连接和证书获取
    return new Promise((resolve, reject) => {
      // 创建 TLS 连接
      // tls.connect() 方法创建一个与指定主机的 TLS 连接
      // 连接建立后会触发回调函数
      const socket = tls.connect(options, () => {
        // 检查连接是否已授权（证书是否有效）
        // socket.authorized 为 true 表示证书验证通过
        if (!socket.authorized) {
          // 如果未授权，拒绝 Promise 并返回授权错误信息
          return reject(new Error(`SSL handshake not authorized. Reason: ${socket.authorizationError}`));
        }

        // 获取对等方（服务器）的证书
        // getPeerCertificate() 方法返回服务器提供的 SSL/TLS 证书对象
        const cert = socket.getPeerCertificate();
        
        // 检查是否成功获取到证书
        if (!cert || Object.keys(cert).length === 0) {
          // 如果没有证书，拒绝 Promise 并返回错误信息
          // 可能的原因：
          // 1. 服务器未使用 SNI（服务器名称指示）来标识自己
          // 2. 连接到主机名别名的 IP 地址
          // 3. SSL 证书无效
          // 4. 在读取证书时 SSL 握手未完成
          return reject(new Error(`
          No certificate presented by the server.\n
          The server is possibly not using SNI (Server Name Indication) to identify itself, and you are connecting to a hostname-aliased IP address.
          Or it may be due to an invalid SSL certificate, or an incomplete SSL handshake at the time the cert is being read.`));
        }

        // 使用对象解构从证书对象中提取字段
        // raw: 证书的原始 DER 编码数据（二进制格式）
        // issuerCertificate: 颁发者证书对象（包含证书链信息）
        // certWithoutRaw: 去除 raw 和 issuerCertificate 字段后的证书信息
        const { raw, issuerCertificate, ...certWithoutRaw } = cert;
        
        // 解析 Promise，返回处理后的证书信息
        // 移除 raw 和 issuerCertificate 字段，因为这些字段可能包含大量二进制数据
        resolve(certWithoutRaw);
        
        // 关闭 TLS 连接
        // socket.end() 方法优雅地关闭连接，发送 FIN 数据包
        socket.end();
      });

      // 监听 socket 的错误事件
      // 如果在连接或通信过程中发生错误，会触发 'error' 事件
      socket.on('error', (error) => {
        // 拒绝 Promise 并返回错误信息
        reject(new Error(`Error fetching site certificate: ${error.message}`));
      });
    });

  } catch (error) {
    // 捕获 URL 解析或其他同步操作中的错误
    // 抛出新的错误，包含原始错误消息
    throw new Error(error.message);
  }
};

// 使用中间件包装 SSL 处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(sslHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './ssl.js' 导入
export default handler;
