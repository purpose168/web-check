// 导入 Axios HTTP 客户端库，用于发送 HTTP 请求
import axios from 'axios';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// HTTP 响应头处理器函数
// 参数:
//   - url: 要请求的目标 URL 地址
//   - event: 请求事件对象（由中间件传递）
//   - context: 请求上下文对象（由中间件传递）
// 返回: Promise，解析为 HTTP 响应头对象
const headersHandler = async (url, event, context) => {
  try {
    // 使用 Axios 发送 GET 请求获取指定 URL 的响应
    const response = await axios.get(url, {
      // 自定义状态码验证函数
      // 参数: status - HTTP 状态码
      // 返回: true 表示接受该状态码，false 表示拒绝
      // 默认情况下，Axios 只接受 2xx 状态码
      // 这里设置为接受 200-599 范围内的所有状态码
      validateStatus: function (status) {
        return status >= 200 && status < 600; // 仅当状态码小于 600 时解析（接受 200-599 范围内的所有状态码）
      },
    });

    // 返回 HTTP 响应头对象
    // 响应头包含如: content-type、content-length、server 等信息
    return response.headers;
  } catch (error) {
    // 如果请求过程中发生错误，抛出错误信息
    throw new Error(error.message);
  }
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回 HTTP 响应头信息
export const handler = middleware(headersHandler);
// 默认导出处理函数
export default handler;
