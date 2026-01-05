// 导入 axios 库，这是一个基于 Promise 的 HTTP 客户端库，用于发送 HTTP 请求
// axios 支持 Promise API、拦截请求和响应、转换请求和响应数据等功能
import axios from 'axios';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 解析 robots.txt 文件内容的函数
// 功能：将 robots.txt 文件的文本内容解析为结构化的规则数组
// 参数:
//   - content: robots.txt 文件的文本内容
// 返回: 包含解析后的规则数组的对象
//   格式: { robots: [{ lbl: 'Allow'|'Disallow'|'User-agent', val: '值' }, ...] }
const parseRobotsTxt = (content) => {
  // 将文件内容按行分割成数组
  const lines = content.split('\n');
  
  // 初始化规则数组，用于存储解析后的规则
  const rules = [];

  // 遍历每一行内容
  lines.forEach(line => {
    // 去除行首和行尾的空白字符（空格、制表符等）
    line = line.trim();

    // 使用正则表达式匹配 Allow 或 Disallow 规则
    // 正则说明:
    //   ^ - 行首
    //   (Allow|Disallow) - 匹配 "Allow" 或 "Disallow"（不区分大小写）
    //   : - 冒号分隔符
    //   \s* - 零个或多个空白字符
    //   (\S*) - 捕获非空白字符（规则值）
    //   $ - 行尾
    //   i - 忽略大小写标志
    let match = line.match(/^(Allow|Disallow):\s*(\S*)$/i);
    if (match) {
      // 创建规则对象
      const rule = {
        lbl: match[1],  // 规则标签：'Allow' 或 'Disallow'
        val: match[2],  // 规则值：路径或用户代理字符串
      };
      
      // 将规则添加到规则数组中
      rules.push(rule);
    } else {
      // 如果不是 Allow/Disallow 规则，尝试匹配 User-agent 规则
      // 正则说明: 与上面类似，但匹配 "User-agent"
      match = line.match(/^(User-agent):\s*(\S*)$/i);
      if (match) {
        // 创建规则对象
        const rule = {
          lbl: match[1],  // 规则标签：'User-agent'
          val: match[2],  // 规则值：用户代理名称（如 '*' 表示所有爬虫）
        };
        
        // 将规则添加到规则数组中
        rules.push(rule);
      }
    }
  });
  
  // 返回包含解析后规则的对象
  return { robots: rules };
}

// robots.txt 文件处理函数
// 功能：获取并解析指定网站的 robots.txt 文件
// 参数:
//   - url: 要检查的网站 URL 字符串
// 返回: 包含解析后的 robots.txt 规则的对象，或错误信息
//   成功格式: { robots: [{ lbl: 'Allow'|'Disallow'|'User-agent', val: '值' }, ...] }
//   跳过格式: { skipped: 'No robots.txt file present, unable to continue' }
//   错误格式: { statusCode: 400/500, body: JSON 字符串 }
const robotsHandler = async function(url) {
  // 声明解析后的 URL 对象变量
  let parsedURL;
  
  try {
    // 尝试将字符串解析为 URL 对象
    // URL 构造函数会验证 URL 格式的正确性
    parsedURL = new URL(url);
  } catch (error) {
    // 如果 URL 格式无效，返回 400 错误
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid url query parameter' }),
    };
  }

  // 构建 robots.txt 文件的完整 URL
  // robots.txt 文件通常位于网站根目录下
  // 例如: https://example.com/robots.txt
  const robotsURL = `${parsedURL.protocol}//${parsedURL.hostname}/robots.txt`;

  try {
    // 使用 axios 发送 GET 请求获取 robots.txt 文件
    const response = await axios.get(robotsURL);

    // 检查 HTTP 状态码是否为 200（成功）
    if (response.status === 200) {
      // 解析 robots.txt 文件内容
      const parsedData = parseRobotsTxt(response.data);
      
      // 检查解析结果是否为空
      // 如果没有找到任何规则，说明文件为空或格式不正确
      if (!parsedData.robots || parsedData.robots.length === 0) {
        return { skipped: 'No robots.txt file present, unable to continue' };
      }
      
      // 返回解析后的规则数据
      return parsedData;
    } else {
      // 如果 HTTP 状态码不是 200，返回错误信息
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch robots.txt', statusCode: response.status }),
      };
    }
  } catch (error) {
    // 捕获请求过程中的错误
    // 可能的错误包括：网络错误、DNS 解析失败、超时、文件不存在等
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error fetching robots.txt: ${error.message}` }),
    };
  }
};

// 使用中间件包装 robots.txt 处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(robotsHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './robots-txt.js' 导入
export default handler;
