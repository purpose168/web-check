// 导入 Axios HTTP 客户端库，用于发送 HTTP 请求
import axios from 'axios';
// 导入公共中间件模块，用于处理请求
import middleware from './_common/middleware.js';

// 网页质量检查处理器函数
// 该函数使用 Google PageSpeed Insights API 检查网页的性能、可访问性、最佳实践、SEO 和 PWA 等质量指标
// 参数:
//   - url: 要检查的目标 URL 地址
//   - event: 请求事件对象（由中间件传递）
//   - context: 请求上下文对象（由中间件传递）
// 返回: Promise，解析为 PageSpeed Insights API 的响应数据
const qualityHandler = async (url, event, context) => {
  // 从环境变量中获取 Google Cloud API 密钥
  // 该密钥用于访问 Google PageSpeed Insights API
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

  // 检查 API 密钥是否存在
  if (!apiKey) {
    // 如果未设置 API 密钥，抛出错误
    throw new Error(
      '缺少 Google API。您需要设置 `GOOGLE_CLOUD_API_KEY` 环境变量'
    );
  }

  // 构建 Google PageSpeed Insights API 请求端点
  // API 版本: v5
  // 参数说明:
  //   - url: 要分析的网页 URL（需要进行 URL 编码）
  //   - category=PERFORMANCE: 性能类别（加载速度、交互响应等）
  //   - category=ACCESSIBILITY: 可访问性类别（屏幕阅读器支持、键盘导航等）
  //   - category=BEST_PRACTICES: 最佳实践类别（安全性、现代 Web 标准）
  //   - category=SEO: 搜索引擎优化类别（元数据、结构化数据等）
  //   - category=PWA: 渐进式 Web 应用类别（离线支持、可安装性等）
  //   - strategy=mobile: 使用移动设备策略进行分析
  //   - key: Google Cloud API 密钥
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?`
  + `url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY`
  + `&category=BEST_PRACTICES&category=SEO&category=PWA&strategy=mobile`
  + `&key=${apiKey}`;

  // 发送 GET 请求到 PageSpeed Insights API 并返回响应数据
  // 响应数据包含:
  //   - lighthouseResult: Lighthouse 审计结果（包含各类别得分和建议）
  //   - loadingExperience: 实际用户体验数据（FCP、FID 等指标）
  //   - originLoadingExperience: 域名级别的用户体验数据
  return (await axios.get(endpoint)).data;
};

// 导出处理函数，使用中间件包装
// 该函数作为 API 端点的入口，接收请求并返回网页质量检查结果
export const handler = middleware(qualityHandler);
// 默认导出处理函数
export default handler;
