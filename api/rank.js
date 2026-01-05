// 导入 Axios HTTP 客户端库，用于发送 HTTP 请求
import axios from 'axios';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// 域名排名查询处理器函数
// 该函数查询指定域名在 Tranco 排名列表中的位置
// Tranco 是一个基于多个数据源的网站排名列表
// 参数:
//   - url: 要查询的目标 URL 地址
// 返回: Promise，解析为域名排名查询结果对象
const rankHandler = async (url) => { 
  // 从 URL 中提取域名（hostname）
  // 例如: https://example.com/path -> example.com
  const domain = url ? new URL(url).hostname : null;
  
  // 检查域名是否有效
  if (!domain) throw new Error('Invalid URL');

  try {
    // 构建 Tranco API 认证配置
    // 认证是可选的，如果设置了环境变量则使用认证
    const auth = process.env.TRANCO_API_KEY ? // 认证是可选的
      { auth: { username: process.env.TRANCO_USERNAME, password: process.env.TRANCO_API_KEY } }
      : {};
    
    // 发送 GET 请求到 Tranco API 查询域名排名
    // API 端点: https://tranco-list.eu/api/ranks/domain/{domain}
    // 参数:
    //   - domain: 要查询的域名
    //   - timeout: 请求超时时间设置为 5000 毫秒（5 秒）
    //   - auth: 认证信息（如果设置了环境变量）
    const response = await axios.get(
      `https://tranco-list.eu/api/ranks/domain/${domain}`, { timeout: 5000 }, auth,
      );
    
    // 检查响应数据是否有效
    // 如果响应数据不存在、ranks 字段不存在或 ranks 数组为空
    if (!response.data || !response.data.ranks || response.data.ranks.length === 0) {
      // 返回跳过信息：域名尚未进入前 1 亿网站排名
      return { skipped: `跳过，因为 ${domain} 尚未进入前 1 亿网站排名。`};
    }
    
    // 返回排名数据
    // 响应数据结构:
    //   - ranks: 排名列表数组，包含不同列表中的排名
    //   - date: 排名日期
    //   - list: 列表标识符
    return response.data;
  } catch (error) {
    // 如果请求失败，返回错误信息
    return { error: `无法获取排名，${error.message}` };
  }
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回域名排名查询结果
export const handler = middleware(rankHandler);
// 默认导出处理函数
export default handler;

