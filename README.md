# Web-Check

<div align="center">

![Web-Check Logo](public/web-check.png)

**全面的按需开源网站情报分析工具**

[![Live Demo](https://img.shields.io/badge/在线演示-web-check.xyz-blue)](https://web-check.xyz)
[![License](https://img.shields.io/badge/许可证-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/版本-2.0.2-orange.svg)](package.json)

</div>

---

## 目录

- [项目概述](#项目概述)
- [主要功能](#主要功能)
- [技术栈](#技术栈)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [部署方式](#部署方式)
- [配置说明](#配置说明)
- [使用指南](#使用指南)
- [目录结构](#目录结构)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目概述

Web-Check 是一个功能强大的网站分析工具，提供全面的按需开源情报（OSINT）功能。它可以深入了解任何网站的内部工作机制，发现潜在的安全漏洞，分析服务器架构，查看安全配置，并了解网站使用的技术栈。

该工具旨在帮助网站所有者轻松理解、优化和保护他们的网站，同时也为安全研究人员和 OSINT 分析师提供有价值的信息。

### 核心特性

- **全面的网站分析**：提供 30+ 种不同的检查类型
- **实时数据获取**：直接从目标网站获取最新信息
- **安全评估**：识别潜在的安全漏洞和配置问题
- **技术栈识别**：自动检测网站使用的技术和框架
- **性能分析**：评估网站的性能和质量指标
- **易于部署**：支持多种部署方式（Docker、Vercel、Netlify 等）
- **开源免费**：100% 开源，可自由使用和修改

---

## 主要功能

### 基础信息
- **IP 信息**：获取网站的 IP 地址、地理位置、ISP 等信息
- **DNS 记录**：查询 A、AAAA、MX、NS、CNAME、TXT 等 DNS 记录
- **Whois 查询**：获取域名注册信息、注册商、到期日期等
- **服务器位置**：显示服务器的物理位置和地图标记

### 安全分析
- **SSL/TLS 证书**：检查 SSL 证书链、有效期、颁发机构
- **TLS 配置**：分析 TLS 密码套件、握手模拟、安全配置
- **HTTP 安全头**：检查安全相关的 HTTP 头（HSTS、CSP、X-Frame-Options 等）
- **HSTS 检测**：验证 HTTP 严格传输安全配置
- **防火墙检测**：识别网站使用的 Web 应用防火墙
- **威胁检测**：检查网站是否在恶意软件和钓鱼网站列表中
- **DNSSEC**：验证 DNS 安全扩展配置

### 技术分析
- **技术栈**：识别网站使用的前端和后端技术
- **服务器信息**：获取服务器类型、托管提供商、ASN 信息
- **Cookies 分析**：检查网站设置的 Cookie 和安全属性
- **HTTP 头**：分析响应头中的所有信息
- **网站功能**：检测网站启用的核心功能

### 性能与质量
- **质量指标**：使用 Lighthouse 评估性能、可访问性、最佳实践和 SEO
- **碳足迹**：估算网站的碳排放量
- **全局排名**：显示网站在全球的排名（基于流量数据）

### 网络分析
- **开放端口**：扫描服务器开放的端口和服务
- **路由追踪**：追踪数据包从源到目的地的路径
- **DNS 服务器**：确定使用的 DNS 服务器及其特性
- **重定向链**：跟踪 HTTP 重定向的完整路径

### 内容分析
- **网站截图**：获取网站的实时截图
- **链接页面**：列出所有内部和外部链接
- **站点地图**：解析网站的 XML 站点地图
- **Social Tags**：提取社交媒体元标签
- **Robots.txt**：查看爬虫规则和排除协议
- **Security.txt**：检查安全披露政策

### 其他功能
- **关联主机**：发现与域名关联的其他主机名
- **邮件配置**：检查 DMARC、DKIM、SPF、BIMI 配置
- **拦截检测**：检查网站是否被各种拦截服务阻止
- **存档历史**：从 Wayback Machine 获取历史存档

---

## 技术栈

### 前端技术
- **框架**：Astro 4.7.1 - 现代化的静态站点生成器
- **UI 组件**：React 18.3.1 + Svelte 4.2.17
- **样式**：SCSS + Emotion
- **动画**：Framer Motion
- **图表**：Recharts
- **图标**：Font Awesome
- **路由**：React Router DOM

### 后端技术
- **运行时**：Node.js (要求 18.16.1+)
- **框架**：Express 4.19.2
- **HTTP 客户端**：Axios、Got
- **HTML 解析**：Cheerio
- **浏览器自动化**：Puppeteer 22.8.0
- **技术栈识别**：Wappalyzer 6.10.65

### 构建工具
- **包管理器**：Yarn
- **构建工具**：Vite
- **TypeScript**：5.4.5
- **开发工具**：Nodemon、Concurrently

### 部署支持
- **云平台**：Vercel、Netlify、Cloudflare
- **容器化**：Docker
- **服务器**：Node.js 适配器

---

## 环境要求

### 必需环境
- **Node.js**：18.16.1 或更高版本
- **Yarn**：最新版本
- **Git**：用于克隆代码仓库

### 可选依赖
以下工具用于特定功能，如果未安装，相应功能将被跳过：
- **Chromium**：用于网站截图功能
- **Traceroute**：用于路由追踪功能
- **DNS 工具**：用于 DNS 相关功能

### 操作系统
- Linux（推荐）
- macOS
- Windows（需要 WSL）

---

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Lissy93/web-check.git
cd web-check
```

### 2. 安装依赖

```bash
yarn install
```

### 3. 配置环境变量（可选）

复制 `.env` 文件并根据需要配置：

```bash
cp .env.example .env
# 编辑 .env 文件添加 API 密钥等配置
```

### 4. 构建项目

```bash
yarn build
```

### 5. 启动服务

```bash
yarn start
```

服务将在 `http://localhost:3000` 启动。

### 开发模式

如果需要进行开发，可以使用开发模式：

```bash
yarn dev
```

这将同时启动后端 API（端口 3001）和前端开发服务器。

---

## 部署方式

### 方式 1：Docker 部署（推荐）

#### 使用预构建镜像

```bash
docker run -p 3000:3000 lissy93/web-check
```

访问 `http://localhost:3000` 即可使用。

#### 自定义构建

```bash
# 克隆仓库
git clone https://github.com/Lissy93/web-check.git
cd web-check

# 构建镜像
docker build -t web-check .

# 运行容器
docker run -p 3000:3000 web-check
```

#### 使用 Docker Compose

```bash
docker-compose up -d
```

### 方式 2：Netlify 部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check)

1. 点击上方按钮
2. 连接 GitHub 账户
3. 选择仓库并配置环境变量
4. 点击部署

### 方式 3：Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flissy93%2Fweb-check)

1. 点击上方按钮
2. 导入项目到 Vercel
3. 配置环境变量
4. 部署

### 方式 4：从源代码部署

```bash
# 克隆仓库
git clone https://github.com/Lissy93/web-check.git
cd web-check

# 安装依赖
yarn install

# 构建生产版本
yarn build

# 启动服务
yarn start
```

### 方式 5：使用 PM2（生产环境）

```bash
# 安装 PM2
npm install -g pm2

# 启动服务（使用所有 CPU 核心）
yarn start-pm

# 或者手动启动
pm2 start server.js -i max --name web-check

# 查看状态
pm2 status

# 查看日志
pm2 logs web-check
```

---

## 配置说明

### 环境变量配置

所有配置都是可选的，但某些功能需要特定的 API 密钥才能正常工作。

#### API 密钥配置

| 环境变量 | 说明 | 获取地址 |
|---------|------|---------|
| `GOOGLE_CLOUD_API_KEY` | Google Cloud API 密钥，用于网站质量指标 | [Google Cloud Console](https://cloud.google.com/api-gateway/docs/authenticate-api-keys) |
| `REACT_APP_SHODAN_API_KEY` | Shodan API 密钥，用于显示关联主机名 | [Shodan](https://account.shodan.io/) |
| `REACT_APP_WHO_API_KEY` | WhoAPI 密钥，用于更全面的 Whois 记录 | [WhoAPI](https://whoapi.com/) |
| `SECURITY_TRAILS_API_KEY` | Security Trails API 密钥，用于显示组织信息 | [Security Trails](https://securitytrails.com/corp/api) |
| `CLOUDMERSIVE_API_KEY` | Cloudmersive API 密钥，用于威胁检测 | [Cloudmersive](https://account.cloudmersive.com/) |
| `TRANCO_USERNAME` | Tranco 用户名，用于网站排名 | [Tranco List](https://tranco-list.eu/) |
| `TRANCO_API_KEY` | Tranco API 密钥 | [Tranco List](https://tranco-list.eu/) |
| `URL_SCAN_API_KEY` | URLScan API 密钥，用于获取网站信息 | [URLScan](https://urlscan.io/) |
| `BUILT_WITH_API_KEY` | BuiltWith API 密钥，用于显示网站主要功能 | [BuiltWith](https://api.builtwith.com/) |
| `TORRENT_IP_API_KEY` | Torrent API 密钥，用于显示 IP 下载记录 | [IKnowWhatYouDownload](https://iknowwhatyoudownload.com/en/api/) |

#### 配置设置

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| `PORT` | API 服务端口 | `3000` |
| `API_ENABLE_RATE_LIMIT` | 是否启用 API 速率限制 | `true` |
| `API_TIMEOUT_LIMIT` | API 请求超时时间（毫秒） | `10000` |
| `API_CORS_ORIGIN` | CORS 允许的源 | `*` |
| `CHROME_PATH` | Chromium 可执行文件路径 | `/usr/bin/chromium` |
| `DISABLE_GUI` | 是否禁用 GUI，仅提供 API | `false` |
| `REACT_APP_API_ENDPOINT` | API 端点地址 | `/api` |
| `ENABLE_ANALYTICS` | 是否启用分析统计 | `false` |
| `BOSS_SERVER` | 是否启用完整服务器模式 | `false` |
| `PLATFORM` | 部署平台（vercel/netlify/cloudflare/node） | `node` |
| `OUTPUT` | 输出模式（server/hybrid/static） | `hybrid` |
| `SITE_URL` | 网站 URL（用于站点地图和规范链接） | `https://web-check.xyz` |
| `BASE_URL` | 基础 URL（如果从子目录提供服务） | `/` |

### 配置文件

#### `.env` 文件

在项目根目录创建 `.env` 文件：

```bash
# API 密钥
GOOGLE_CLOUD_API_KEY='your-google-api-key'
REACT_APP_SHODAN_API_KEY='your-shodan-api-key'
REACT_APP_WHO_API_KEY='your-whoapi-key'

# 配置设置
PORT=3000
API_ENABLE_RATE_LIMIT=true
API_TIMEOUT_LIMIT=10000
API_CORS_ORIGIN='*'
DISABLE_GUI=false
REACT_APP_API_ENDPOINT='/api'
```

### 端口占用处理

如果启动服务时端口被占用，可以按照以下步骤处理：

1. **检查端口占用情况**

```bash
# Linux/macOS
lsof -i :3000

# 或者使用 netstat
netstat -tuln | grep 3000

# Windows
netstat -ano | findstr :3000
```

2. **终止占用端口的进程**

```bash
# Linux/macOS
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

3. **重新启动服务**

```bash
yarn start
```

或者，您可以更改 `.env` 文件中的 `PORT` 配置，使用其他端口。

---

## 使用指南

### 基本使用

1. **访问 Web 界面**

   打开浏览器访问 `http://localhost:3000`

2. **输入目标 URL**

   在主页的输入框中输入要分析的网站 URL（例如：`example.com`）

3. **查看分析结果**

   系统将自动执行所有检查并在仪表板中显示结果

### API 使用

除了 Web 界面，Web-Check 还提供了 RESTful API：

#### 获取所有检查结果

```bash
curl "http://localhost:3000/api?url=example.com"
```

#### 获取特定检查结果

```bash
# DNS 记录
curl "http://localhost:3000/api/dns?url=example.com"

# SSL 证书
curl "http://localhost:3000/api/ssl?url=example.com"

# Whois 信息
curl "http://localhost:3000/api/whois?url=example.com"

# 技术栈
curl "http://localhost:3000/api/tech-stack?url=example.com"
```

#### API 端点列表

- `/api/dns` - DNS 记录
- `/api/ssl` - SSL 证书
- `/api/whois` - Whois 信息
- `/api/headers` - HTTP 头
- `/api/cookies` - Cookies
- `/api/tech-stack` - 技术栈
- `/api/quality` - 质量指标
- `/api/screenshot` - 网站截图
- `/api/trace-route` - 路由追踪
- `/api/ports` - 开放端口
- `/api/firewall` - 防火墙检测
- `/api/threats` - 威胁检测
- `/api/mail-config` - 邮件配置
- `/api/hsts` - HSTS 检测
- `/api/http-security` - HTTP 安全头
- `/api/tls` - TLS 配置
- `/api/dnssec` - DNSSEC
- `/api/sitemap` - 站点地图
- `/api/robots-txt` - Robots.txt
- `/api/security-txt` - Security.txt
- `/api/social-tags` - Social Tags
- `/api/linked-pages` - 链接页面
- `/api/redirects` - 重定向链
- `/api/get-ip` - IP 信息
- `/api/dns-server` - DNS 服务器
- `/api/features` - 网站功能
- `/api/block-lists` - 拦截检测
- `/api/archives` - 存档历史
- `/api/rank` - 全局排名
- `/api/carbon` - 碳足迹
- `/api/status` - 服务器状态
- `/api/txt-records` - TXT 记录

### 高级用法

#### 自定义检查

您可以通过组合多个 API 端点来创建自定义检查流程：

```javascript
const urls = ['example.com', 'test.com'];

for (const url of urls) {
  const dns = await fetch(`http://localhost:3000/api/dns?url=${url}`).then(r => r.json());
  const ssl = await fetch(`http://localhost:3000/api/ssl?url=${url}`).then(r => r.json());
  const tech = await fetch(`http://localhost:3000/api/tech-stack?url=${url}`).then(r => r.json());

  console.log(`${url} - DNS: ${dns.length} records, SSL: ${ssl.valid}, Tech: ${tech.length} technologies`);
}
```

#### 批量分析

使用脚本批量分析多个网站：

```bash
#!/bin/bash

while read url; do
  echo "Analyzing $url..."
  curl "http://localhost:3000/api?url=$url" -o "results/${url}.json"
  sleep 2  # 避免速率限制
done < urls.txt
```

---

## 目录结构

```
web-check/
├── api/                          # API 端点
│   ├── _common/                  # 公共中间件和配置
│   │   ├── middleware.js         # API 中间件
│   │   └── aws-webpack.config.js # AWS Webpack 配置
│   ├── archives.js               # 存档历史
│   ├── block-lists.js            # 拦截检测
│   ├── carbon.js                 # 碳足迹
│   ├── cookies.js                # Cookies 分析
│   ├── dns.js                    # DNS 记录
│   ├── dns-server.js             # DNS 服务器
│   ├── dnssec.js                # DNSSEC
│   ├── features.js               # 网站功能
│   ├── firewall.js               # 防火墙检测
│   ├── get-ip.js                # IP 信息
│   ├── headers.js                # HTTP 头
│   ├── hsts.js                  # HSTS 检测
│   ├── http-security.js          # HTTP 安全头
│   ├── legacy-rank.js           # 旧版排名
│   ├── linked-pages.js           # 链接页面
│   ├── mail-config.js           # 邮件配置
│   ├── ports.js                  # 开放端口
│   ├── quality.js                # 质量指标
│   ├── rank.js                   # 全局排名
│   ├── redirects.js              # 重定向链
│   ├── robots-txt.js            # Robots.txt
│   ├── screenshot.js             # 网站截图
│   ├── security-txt.js          # Security.txt
│   ├── sitemap.js               # 站点地图
│   ├── social-tags.js            # Social Tags
│   ├── ssl.js                    # SSL 证书
│   ├── status.js                 # 服务器状态
│   ├── tech-stack.js             # 技术栈
│   ├── threats.js                # 威胁检测
│   ├── tls.js                    # TLS 配置
│   ├── trace-route.js            # 路由追踪
│   ├── txt-records.js            # TXT 记录
│   └── whois.js                 # Whois 信息
├── public/                       # 静态资源
│   ├── android-chrome-*.png     # Android 图标
│   ├── apple-touch-icon.png     # Apple 图标
│   ├── banner.png               # 横幅图片
│   ├── error.html               # 错误页面
│   ├── favicon.*                # 网站图标
│   ├── fonts/                   # 字体文件
│   │   ├── Hubot-Sans/         # Hubot Sans 字体
│   │   └── Inter-*.ttf        # Inter 字体
│   ├── index.html               # 首页
│   ├── manifest.json            # PWA 清单
│   ├── placeholder.html          # 占位页面
│   ├── resources/               # 资源文件
│   │   └── openapi-spec.yml    # OpenAPI 规范
│   ├── robots.txt               # Robots 文件
│   ├── security.txt             # 安全策略
│   └── web-check.png            # Logo
├── src/                         # 源代码
│   ├── components/              # 组件
│   │   ├── homepage/           # 首页组件
│   │   ├── molecules/          # 分子组件
│   │   └── scafold/            # 脚手架组件
│   ├── layouts/                # 布局
│   │   ├── Base.astro         # 基础布局
│   │   └── MetaTags.astro     # Meta 标签
│   ├── pages/                  # 页面
│   │   ├── check/             # 检查页面
│   │   ├── index.astro        # 首页
│   │   └── self-hosted-setup.astro # 自托管设置
│   ├── styles/                 # 样式
│   │   ├── colors.scss        # 颜色变量
│   │   ├── global.scss        # 全局样式
│   │   ├── media-queries.scss # 媒体查询
│   │   └── typography.scss    # 排版
│   └── web-check-live/        # 实时检查
│       └── typings/           # 类型定义
├── .github/                    # GitHub 配置
│   ├── workflows/              # GitHub Actions
│   │   ├── credits.yml        # 贡献者更新
│   │   ├── deploy-aws.yml     # AWS 部署
│   │   ├── docker.yml         # Docker 构建
│   │   └── mirror.yml         # 镜像同步
│   ├── screenshots/            # 截图
│   │   ├── README.md
│   │   ├── tiles/            # 功能截图
│   │   └── web-check-screenshot*.png
│   ├── FUNDING.yml           # 赞助配置
│   ├── README.md             # GitHub README
│   └── web-check-logo.png    # Logo
├── .env                       # 环境变量（不提交）
├── .env.example              # 环境变量示例
├── .gitignore               # Git 忽略文件
├── astro.config.mjs         # Astro 配置
├── docker-compose.yml       # Docker Compose 配置
├── Dockerfile              # Docker 镜像构建文件
├── fly.toml               # Fly.io 配置
├── LICENSE                # MIT 许可证
├── netlify.toml           # Netlify 配置
├── package.json           # 项目配置和依赖
├── server.js              # Express 服务器
├── svelte.config.js       # Svelte 配置
├── tsconfig.json          # TypeScript 配置
├── vercel.json            # Vercel 配置
├── vite.config.js         # Vite 配置
└── yarn.lock              # Yarn 锁定文件
```

---

## 贡献指南

我们欢迎任何形式的贡献！

### 如何贡献

1. **Fork 仓库**

   点击 GitHub 页面右上角的 "Fork" 按钮

2. **克隆您的 Fork**

   ```bash
   git clone https://github.com/your-username/web-check.git
   cd web-check
   ```

3. **创建功能分支**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **进行更改**

   - 编写代码
   - 添加测试（如果适用）
   - 更新文档（如果需要）

5. **提交更改**

   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

6. **推送到 Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**

   - 访问原始仓库
   - 点击 "New Pull Request"
   - 选择您的功能分支
   - 填写 PR 描述并提交

### 代码规范

- 遵循现有的代码风格
- 添加适当的注释
- 确保代码通过 lint 检查
- 测试您的更改

### 报告问题

如果您发现了 bug 或有功能建议，请在 GitHub 上创建 Issue：

- [提交 Bug](https://github.com/Lissy93/web-check/issues/new?template=bug_report.md)
- [功能请求](https://github.com/Lissy93/web-check/issues/new?template=feature_request.md)

### 行为准则

请遵循 [贡献者公约](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)。

---

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

```
MIT License

Copyright (c) 2023 Alicia Sykes <https://github.com/lissy93>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 支持与联系

- **官方网站**：[https://web-check.xyz](https://web-check.xyz)
- **GitHub 仓库**：[https://github.com/Lissy93/web-check](https://github.com/Lissy93/web-check)
- **问题反馈**：[GitHub Issues](https://github.com/Lissy93/web-check/issues)
- **作者**：[Alicia Sykes](https://aliciasykes.com)

## 致谢

感谢所有为 Web-Check 做出贡献的开发者和赞助者！

---

<div align="center">

**如果这个项目对您有帮助，请考虑给我们一个 ⭐️**

Made with ❤️ by [Alicia Sykes](https://github.com/Lissy93)

</div>
