// 导入 Wappalyzer 库
// Wappalyzer 是一个强大的网站技术栈检测工具
// 它可以识别网站使用的各种技术，包括：
//   - 前端框架（如 React、Vue、Angular）
//   - 后端框架（如 Express、Django、Rails）
//   - 数据库（如 MySQL、PostgreSQL、MongoDB）
//   - 服务器软件（如 Nginx、Apache）
//   - 分析工具（如 Google Analytics）
//   - 其他 Web 技术
// Wappalyzer 通过分析网站的 HTML、JavaScript、CSS、HTTP 头部等信息来识别技术
import Wappalyzer from 'wappalyzer';

// 导入公共中间件模块
// 该模块提供通用的请求处理、错误处理和响应格式化功能
import middleware from './_common/middleware.js';

// 技术栈检测处理函数
// 功能：检测并分析指定网站使用的技术栈
// 使用 Wappalyzer 库自动识别网站的前端、后端、数据库、服务器等技术
// 参数:
//   - url: 要分析的网站 URL 字符串（必须包含协议，如 https://example.com）
// 返回: Promise，解析为技术栈分析结果对象
//   成功格式: {
//     technologies: [
//       {
//         name: 'React',           // 技术名称
//         confidence: 100,         // 置信度（0-100）
//         version: '18.2.0',       // 版本号（如果可检测）
//         icon: 'React.svg',       // 技术图标
//         website: 'https://reactjs.org',  // 技术官网
//         categories: [            // 技术分类
//           { id: 12, name: 'JavaScript Frameworks', slug: 'javascript-frameworks' }
//         ]
//       },
//       ...更多技术
//     ],
//     url: 'https://example.com',  // 分析的网站 URL
//     meta: { ... }                // 元数据信息
//   }
//   异常: 如果检测失败或未找到任何技术，抛出错误
const techStackHandler = async (url) => {
  // 创建 Wappalyzer 配置选项对象
  // options 参数用于自定义 Wappalyzer 的行为
  // 当前使用空对象，表示使用默认配置
  // 可配置选项包括：
  //   - hostname: 自定义主机名
  //   - debug: 启用调试模式
  //   - maxDepth: 最大爬取深度
  //   - maxUrls: 最大分析 URL 数量
  //   - maxWait: 最大等待时间（毫秒）
  //   - recursive: 是否递归分析
  //   - userAgent: 自定义用户代理字符串
  const options = {};

  // 创建 Wappalyzer 实例
  // Wappalyzer 类提供了网站技术栈分析的核心功能
  // 实例化后需要调用 init() 方法进行初始化
  const wappalyzer = new Wappalyzer(options);

  try {
    // 初始化 Wappalyzer 实例
    // init() 方法会设置必要的内部状态和资源
    // 这包括：
    //   - 初始化浏览器实例（如果需要）
    //   - 加载技术识别规则库
    //   - 准备分析环境
    // 这是一个异步操作，必须等待完成才能继续
    await wappalyzer.init();
    
    // 创建 HTTP 请求头对象
    // headers 用于在请求网站时发送自定义 HTTP 头
    // 当前使用空对象，表示使用默认请求头
    // 可以添加的常见头包括：
    //   - User-Agent: 自定义用户代理
    //   - Accept: 接受的内容类型
    //   - Accept-Language: 接受的语言
    //   - Cookie: 请求携带的 Cookie
    const headers = {};
    
    // 创建存储对象
    // storage 用于在分析过程中存储数据
    // 包含两个存储空间：
    //   - local: 本地存储（持久化存储）
    //   - session: 会话存储（临时存储）
    // 这些存储空间可以用于：
    //   - 保存分析过程中的中间结果
    //   - 存储网站设置的 Cookie
    //   - 缓存分析数据
    const storage = {
      local: {},      // 本地存储空间
      session: {},    // 会话存储空间
    };
    
    // 打开并分析指定网站
    // wappalyzer.open() 方法会：
    //   1. 发起 HTTP 请求获取网站内容
    //   2. 解析 HTML、CSS、JavaScript 等资源
    //   3. 提取 HTTP 头部信息
    //   4. 准备技术识别所需的数据
    // 参数:
    //   - url: 要分析的网站 URL
    //   - headers: 请求时使用的 HTTP 头
    //   - storage: 存储对象，用于保存分析过程中的数据
    // 返回: Site 对象，代表要分析的网站
    const site = await wappalyzer.open(url, headers, storage);
    
    // 分析网站技术栈
    // site.analyze() 方法会：
    //   1. 使用内置的技术识别规则库
    //   2. 匹配网站的 HTML、CSS、JavaScript 代码
    //   3. 检查 HTTP 头部和元数据
    //   4. 识别已知的 JavaScript 库和框架
    //   5. 检测服务器软件和版本
    //   6. 计算每个技术的置信度（confidence）
    // 返回: 包含检测到的所有技术的结果对象
    const results = await site.analyze();

    // 验证是否检测到任何技术
    // results.technologies 是一个数组，包含检测到的所有技术
    // 如果数组为空或不存在，说明未能识别出任何技术
    if (!results.technologies || results.technologies.length === 0) {
      // 如果未检测到任何技术，抛出错误
      // 可能的原因：
      //   - 网站使用了非常冷门的技术
      //   - 网站内容被动态加载，Wappalyzer 未能捕获
      //   - 网站使用了混淆或加密的代码
      //   - 网站访问受限（需要登录、验证码等）
      throw new Error('Unable to find any technologies for site');
    }
    
    // 返回技术栈分析结果
    // results 对象包含：
    //   - technologies: 检测到的技术数组
    //   - url: 分析的网站 URL
    //   - meta: 分析的元数据（如分析时间、分析深度等）
    return results;
    
  } catch (error) {
    // 捕获分析过程中的错误
    // 可能的错误类型：
    //   - 网络错误：无法连接到网站
    //   - 超时错误：分析时间过长
    //   - 解析错误：网站内容格式不正确
    //   - Wappalyzer 内部错误
    // 抛出包含错误消息的新错误对象
    throw new Error(error.message);
  } finally {
    // 清理 Wappalyzer 实例
    // finally 块确保无论是否发生错误都会执行清理
    // wappalyzer.destroy() 方法会：
    //   1. 关闭浏览器实例（如果已打开）
    //   2. 释放内存和系统资源
    //   3. 清理临时文件和缓存
    //   4. 终止所有正在进行的分析任务
    // 这对于避免内存泄漏和资源占用非常重要
    await wappalyzer.destroy();
  }
};

// 使用中间件包装技术栈检测处理函数并导出
// 中间件会添加通用的错误处理、日志记录、请求验证等功能
export const handler = middleware(techStackHandler);

// 导出默认 handler
// 允许其他模块通过 import handler from './tech-stack.js' 导入
export default handler;
