// 引入 path 模块，用于处理文件路径
const path = require('path');
// 引入 webpack-node-externals 插件，用于排除 node_modules 中的依赖
// 这样可以减小打包体积，因为 AWS Lambda 运行环境中已经包含了 node_modules
const nodeExternals = require('webpack-node-externals');

// 导出 webpack 配置对象
module.exports = {
    // 目标环境设置为 'node'，表示打包后的代码将在 Node.js 环境中运行
    // 这对于 AWS Lambda 函数是必需的
    target: 'node',
    // 构建模式设置为 'production'，启用生产环境优化
    // 包括代码压缩、去除死代码等优化措施
    mode: 'production',
    // 入口点配置：定义需要打包的各个 Lambda 函数
    // 每个键值对代表一个独立的 Lambda 函数入口
    entry: {
        // 碳足迹分析 API 入口
        'carbon': './api/carbon.js',
        // Cookie 分析 API 入口
        'cookies': './api/cookies.js',
        // DNS 服务器信息查询 API 入口
        'dns-server': './api/dns-server.js',
        // DNS 记录查询 API 入口
        'dns': './api/dns.js',
        // DNSSEC 安全扩展查询 API 入口
        'dnssec': './api/dnssec.js',
        // 网站功能特性检测 API 入口
        'features': './api/features.js',
        // IP 地址信息查询 API 入口
        'get-ip': './api/get-ip.js',
        // HTTP 响应头分析 API 入口
        'headers': './api/headers.js',
        // HSTS (HTTP Strict Transport Security) 配置检查 API 入口
        'hsts': './api/hsts.js',
        // 链接页面分析 API 入口
        'linked-pages': './api/linked-pages.js',
        // 邮件配置 (SPF/DKIM/DMARC) 检查 API 入口
        'mail-config': './api/mail-config.js',
        // 开放端口扫描 API 入口
        'ports': './api/ports.js',
        // 网站质量指标分析 API 入口
        'quality': './api/quality.js',
        // URL 重定向链分析 API 入口
        'redirects': './api/redirects.js',
        // robots.txt 文件检查 API 入口
        'robots-txt': './api/robots-txt.js',
        // 网页截图生成 API 入口
        'screenshot': './api/screenshot.js',
        // security.txt 文件检查 API 入口
        'security-txt': './api/security-txt.js',
        // 网站地图 (sitemap) 分析 API 入口
        'sitemap': './api/sitemap.js',
        // 社交媒体标签 (Open Graph/Twitter Cards) 分析 API 入口
        'social-tags': './api/social-tags.js',
        // SSL/TLS 证书分析 API 入口
        'ssl': './api/ssl.js',
        // HTTP 状态码检查 API 入口
        'status': './api/status.js',
        // 技术栈识别 API 入口
        'tech-stack': './api/tech-stack.js',
        // 路由追踪 (traceroute) API 入口
        'trace-route': './api/trace-route.js',
        // TXT 记录查询 API 入口
        'txt-records': './api/txt-records.js',
        // WHOIS 域名信息查询 API 入口
        'whois': './api/whois.js',
    },
    // 外部依赖配置：使用 nodeExternals() 排除 node_modules
    // 这样可以避免将 node_modules 打包进最终的输出文件
    // 因为 AWS Lambda 运行时已经包含了这些依赖，可以显著减小部署包大小
    externals: [nodeExternals()],
    // 输出配置：定义打包后的文件如何输出
    output: {
        // 输出文件名模板，[name] 会被替换为 entry 中定义的键名
        // 例如：carbon.js, dns.js 等
        filename: '[name].js',
        // 输出目录路径，使用 path.resolve 解析为绝对路径
        // __dirname 表示当前文件所在目录，输出到 .webpack 子目录
        path: path.resolve(__dirname, '.webpack'),
        // 模块输出格式设置为 'commonjs2'
        // 这是 AWS Lambda 函数所需的模块格式
        // CommonJS2 允许使用 module.exports 导出
        libraryTarget: 'commonjs2'
    },
    // 模块配置：定义如何处理项目中的不同类型的模块
    module: {
        // 规则数组：定义模块转换规则
        rules: [
            {
                // 匹配规则：使用正则表达式匹配所有 .js 文件
                test: /\.js$/,
                // 使用 babel-loader 处理匹配到的文件
                // babel-loader 可以将 ES6+ 代码转换为 ES5，提高兼容性
                use: {
                    loader: 'babel-loader'
                },
                // 排除规则：不处理 node_modules 目录下的文件
                // 因为 node_modules 中的代码已经是编译好的，不需要再次转换
                exclude: /node_modules/,
            }
        ]
    }
};
