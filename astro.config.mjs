// 从 Astro 配置模块中导入 defineConfig 函数
import { defineConfig } from 'astro/config';

// 集成插件（Integrations）
// 导入 Svelte 集成，用于在 Astro 中使用 Svelte 组件
import svelte from '@astrojs/svelte';
// 导入 React 集成，用于在 Astro 中使用 React 组件
import react from "@astrojs/react";
// 导入 Partytown 集成，用于将第三方脚本移到 Web Worker 中执行以提升性能
import partytown from '@astrojs/partytown';
// 导入 Sitemap 集成，用于自动生成站点地图
import sitemap from '@astrojs/sitemap';

// 适配器（Adapters）
// 导入 Vercel 适配器，用于部署到 Vercel 平台的无服务器环境
import vercelAdapter from '@astrojs/vercel/serverless';
// 导入 Netlify 适配器，用于部署到 Netlify 平台
import netlifyAdapter from '@astrojs/netlify';
// 导入 Node.js 适配器，用于部署到 Node.js 服务器
import nodeAdapter from '@astrojs/node';
// 导入 Cloudflare 适配器，用于部署到 Cloudflare Workers 平台
import cloudflareAdapter from '@astrojs/cloudflare';

// 辅助函数：解包 Vite 和 Node.js 环境变量
// varName: 环境变量名称
// fallbackValue: 默认值，当环境变量不存在时使用
const unwrapEnvVar = (varName, fallbackValue) => {
  // 尝试从 Node.js 进程环境变量中获取
  const classicEnvVar = process?.env && process.env[varName];
  // 尝试从 Vite 环境变量中获取
  const viteEnvVar = import.meta.env[varName];
  // 返回第一个找到的值，否则返回默认值
  return classicEnvVar || viteEnvVar || fallbackValue;
}

// 确定部署目标（vercel、netlify、cloudflare、node）
// 默认为 node，从 PLATFORM 环境变量读取
const deployTarget = unwrapEnvVar('PLATFORM', 'node').toLowerCase();

// 确定输出模式（server、hybrid 或 static）
// server: 服务器端渲染模式
// hybrid: 混合模式，部分页面静态，部分动态
// static: 静态站点生成模式
// 默认为 hybrid，从 OUTPUT 环境变量读取
const output = unwrapEnvVar('OUTPUT', 'hybrid');

// 站点的完全限定域名（FQDN），用于站点地图和规范 URL
// 默认为 https://web-check.xyz，从 SITE_URL 环境变量读取
const site = unwrapEnvVar('SITE_URL', 'https://web-check.xyz');

// 站点的基础 URL（如果从子目录提供服务）
// 默认为根目录 /，从 BASE_URL 环境变量读取
const base = unwrapEnvVar('BASE_URL', '/');

// 是否以 Boss 模式运行应用（需要额外配置）
// Boss 模式通常指完整功能模式，包括营销主页等
// 默认为 false，从 BOSS_SERVER 环境变量读取
const isBossServer = unwrapEnvVar('BOSS_SERVER', false);

// 初始化 Astro 集成插件
const integrations = [svelte(), react(), partytown(), sitemap()];

// 根据部署目标设置适当的适配器
// target: 部署目标平台名称
function getAdapter(target) {
  switch(target) {
    // Vercel 平台：使用 Vercel 无服务器适配器
    case 'vercel':
      return vercelAdapter();
    // Netlify 平台：使用 Netlify 适配器
    case 'netlify':
      return netlifyAdapter();
    // Cloudflare 平台：使用 Cloudflare Workers 适配器
    case 'cloudflare':
      return cloudflareAdapter();
    // Node.js 服务器：使用 Node.js 适配器，中间件模式
    case 'node':
      return nodeAdapter({ mode: 'middleware' });
    // 不支持的部署目标：抛出错误
    default:
      throw new Error(`Unsupported deploy target: ${target}`);
  }
}
// 获取适配器实例
const adapter = getAdapter(deployTarget);

// 在控制台打印构建信息
console.log(
  `\n\x1b[1m\x1b[35m 准备开始构建 Web Check.... \x1b[0m\n`,
  `\x1b[35m\x1b[2m正在为 "${deployTarget}" 平台使用 "${output}" 模式编译，`
  + `将部署到 "${site}" 的 "${base}" 路径\x1b[0m\n`,
  `\x1b[2m\x1b[36m🛟 如需文档和支持，请访问 GitHub 仓库：` +
  `https://github.com/lissy93/web-check \n`,
  `💖 觉得 Web-Check 有用吗？考虑在 GitHub 上赞助我们，` +
  `以帮助资助维护和开发。\x1b[0m\n`,
);

// 重定向规则配置
const redirects = {
  // 将 /about 重定向到 /check/about
  '/about': '/check/about',
};

// 为自托管用户跳过营销主页
// 如果不是 Boss 模式，将根路径重定向到 /check
if (!isBossServer && isBossServer !== true) {
  redirects['/'] = '/check';
}

// 导出 Astro 配置
export default defineConfig({ output, base, integrations, site, adapter, redirects });

