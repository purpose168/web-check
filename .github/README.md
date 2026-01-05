<h1 align="center">Web-Check</h1>


<p align="center">
<img src="https://i.ibb.co/q1gZN2p/web-check-logo.png" width="96" /><br />
<b><i>针对任何网站的综合性按需开源情报工具</i></b>
<br />
<b>🌐 <a href="https://web-check.xyz/">web-check.xyz</a></b><br />

</p>

---
<p align="center">
  <sup>由以下机构支持：</sup><br>
<a href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh">
  <img src="https://i.ibb.co/8jrrcZ0/IMG-7210.jpg" width="300" alt="Terminal Trove">
  <br>
  <strong>终端工具的 $HOME。</strong>
</a>
<br>
<a href="https://terminaltrove.com/newsletter?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh">
  <sub>在 Terminal Trove 找到你的下一个 CLI / TUI 工具和更多内容，</sub>
  <br>
  <sup>通过我们的新闻通讯获取新工具的更新。</sup>
</a>
</p>

---

#### 目录

- **[关于](#about)**
  - [截图](#screenshot)
  - [在线演示](#live-demo)
  - [镜像](#mirror)
  - [功能特性](#features)
- **[使用方法](#usage)**
  - [部署](#deployment)
    - [选项 1：Netlify](#deploying---option-1-netlify)
    - [选项 2：Vercel](#deploying---option-2-vercel)
    - [选项 3：Docker](#deploying---option-3-docker)
    - [选项 4：源代码](#deploying---option-4-from-source)
  - [配置选项](#configuring)
  - [开发者设置](#developing)
- **[社区](#community)**
  - [贡献](#contributing)
  - [错误报告](#reporting-bugs)
  - [支持](#supporting)
- **[许可证](#license)**

---

## 关于
深入了解给定网站的内部运作机制：发现潜在的攻击向量、分析服务器架构、查看安全配置，并了解网站使用了哪些技术。

目前仪表板将显示：IP 信息、SSL 证书链、DNS 记录、Cookie、HTTP 头、域名信息、搜索引擎爬取规则、页面地图、服务器位置、重定向记录、开放端口、路由追踪、DNS 安全扩展、网站性能、跟踪器、关联主机名、碳足迹。敬请期待，我很快会添加更多功能！

目标是帮助您轻松理解、优化和保护您的网站。

### 截图

<details>
      <summary>展开截图</summary>

[![Screenshot](https://raw.githubusercontent.com/Lissy93/web-check/master/.github/screenshots/web-check-screenshot1.png)](https://web-check.as93.net/)
      
</details>

[![Screenshot](https://i.ibb.co/r0jXN6s/web-check.png)](https://github.com/Lissy93/web-check/tree/master/.github/screenshots)

### 在线演示
托管版本可访问：**[web-check.as93.net](https://web-check.as93.net)**

### 镜像
此仓库的源代码已镜像到 CodeBerg，可访问：**[codeberg.org/alicia/web-check](https://codeberg.org/alicia/web-check)**

### 状态


构建与部署：[![Netlify Status](https://api.netlify.com/api/v1/badges/c43453c1-5333-4df7-889b-c1d2b52183c0/deploy-status)](https://app.netlify.com/sites/web-check/deploys)
[![Vercel Status](https://therealsujitk-vercel-badge.vercel.app/?app=web-check-ten)](https://vercel.com/as93/web-check/)
[![🐳 Build + Publish Docker Image](https://github.com/Lissy93/web-check/actions/workflows/docker.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/docker.yml)
[![🚀 Deploy to AWS](https://github.com/Lissy93/web-check/actions/workflows/deploy-aws.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/deploy-aws.yml)
<br />
仓库管理与其他：[![🪞 Mirror to Codeberg](https://github.com/Lissy93/web-check/actions/workflows/mirror.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/mirror.yml)
[![💓 Inserts Contributors & Sponsors](https://github.com/Lissy93/web-check/actions/workflows/credits.yml/badge.svg)](https://github.com/Lissy93/web-check/actions/workflows/credits.yml)


### 功能特性

<details open>
<summary><b>点击展开 / 折叠部分</b></summary>

<sup>**注意** _此列表需要更新，自添加以来已经添加了更多任务..._</sup>

以下部分概述了核心功能，并简要解释了为什么这些数据对您有用，以及提供了进一步学习的资源链接。

<details>
<summary><b>IP 信息</b></summary>

###### 描述
IP 地址（Internet Protocol address，互联网协议地址）是分配给连接到网络/互联网的每个设备的数字标签。与给定域名关联的 IP 可以通过查询域名系统的 A（地址）记录来找到。

###### 使用场景
找到给定服务器的 IP 是进行进一步调查的第一步，因为它允许我们探测服务器以获取更多信息。包括创建目标网络基础设施的详细地图、精确定位服务器的物理位置、识别托管服务，甚至发现托管在同一 IP 地址上的其他域名。

###### 有用链接
- [理解 IP 地址](https://www.digitalocean.com/community/tutorials/understanding-ip-addresses-subnets-and-cidr-notation-for-networking)
- [IP 地址 - 维基百科](https://en.wikipedia.org/wiki/IP_address)
- [RFC-791 互联网协议](https://tools.ietf.org/html/rfc791)
- [whatismyipaddress.com](https://whatismyipaddress.com/)

</details>
<details>
<summary><b>SSL 证书链</b></summary>

<img width="300" src="https://i.ibb.co/kB7LsV1/wc-ssl.png" align="right" />

###### 描述
SSL 证书是用于验证网站或服务器身份、启用安全加密通信（HTTPS）并在客户端和服务器之间建立信任的数字证书。网站要能够使用 HTTPS 协议并加密传输中的用户 + 站点数据，需要有效的 SSL 证书。SSL 证书由证书颁发机构（CAs）颁发，这些是验证证书持有者身份和合法性的可信第三方。

###### 使用场景
SSL 证书不仅提供与网站数据传输安全的保证，还提供有价值的 OSINT（开源情报）数据。来自 SSL 证书的信息可以包括颁发机构、域名、其有效期，有时甚至包括组织详细信息。这对于验证网站的真实性、了解其安全设置，甚至发现关联的子域名或其他服务非常有用。

###### 有用链接
- [TLS - 维基百科](https://en.wikipedia.org/wiki/Transport_Layer_Security)
- [什么是 SSL（通过 Cloudflare 学习）](https://www.cloudflare.com/learning/ssl/what-is-ssl/)
- [RFC-8446 - TLS](https://tools.ietf.org/html/rfc8446)
- [SSL 检查器](https://www.sslshopper.com/ssl-checker.html)

</details>
<details>
<summary><b>DNS 记录</b></summary>

<img width="300" src="https://i.ibb.co/7Q1kMwM/wc-dns.png" align="right" />

###### 描述
此任务涉及查找与特定域名关联的 DNS 记录。DNS 是一个将人类可读的域名转换为计算机用于通信的 IP 地址的系统。存在多种类型的 DNS 记录，包括 A（地址）、MX（邮件交换）、NS（名称服务器）、CNAME（规范名称）和 TXT（文本）等。

###### 使用场景
提取 DNS 记录可以在 OSINT 调查中提供大量信息。例如，A 和 AAAA 记录可以披露与域名关联的 IP 地址，可能揭示服务器的位置。MX 记录可以提供关于域名电子邮件提供商的线索。TXT 记录通常用于各种管理目的，有时可能会意外泄露内部信息。了解域名的 DNS 设置对于理解其在线基础设施的构建和管理也很有用。

###### 有用链接
- [什么是 DNS 记录？（通过 Cloudflare 学习）](https://www.cloudflare.com/learning/dns/dns-records/)
- [DNS 记录类型](https://en.wikipedia.org/wiki/List_of_DNS_record_types)
- [RFC-1035 - DNS](https://tools.ietf.org/html/rfc1035)
- [DNS 查找（通过 MxToolbox）](https://mxtoolbox.com/DNSLookup.aspx)

</details>
<details>
<summary><b>Cookie</b></summary>

<img width="300" src="https://i.ibb.co/TTQ6DtP/wc-cookies.png" align="right" />

###### 描述
Cookie 任务涉及检查目标网站设置的 HTTP Cookie。Cookie 是 Web 浏览器在浏览网站时存储在用户计算机上的小数据片段。它们保存特定客户端和网站的少量数据，例如网站首选项、用户会话的状态或跟踪信息。

###### 使用场景
Cookie 可以披露有关网站如何跟踪和与其用户交互的信息。例如，会话 Cookie 可以揭示用户会话的管理方式，跟踪 Cookie 可以暗示正在使用哪种跟踪或分析框架。此外，检查 Cookie 策略和实践可以提供对网站安全设置和隐私法规合规性的见解。

###### 有用链接
- [HTTP Cookie 文档（Mozilla）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [什么是 Cookie（通过 Cloudflare 学习）](https://www.cloudflare.com/learning/privacy/what-are-cookies/)
- [测试 Cookie 属性（OWASP）](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes)
- [RFC-6265 - Cookie](https://tools.ietf.org/html/rfc6265)

</details>
<details>
<summary><b>爬取规则</b></summary>

<img width="300" src="https://i.ibb.co/KwQCjPf/wc-robots.png" align="right" />

###### 描述
Robots.txt 是一个（通常）在域名根目录找到的文件，用于实现机器人排除协议（REP），以指示哪些爬虫和机器人应该忽略哪些页面。避免搜索引擎爬虫使您的站点过载是一个好习惯，但不应该用于将页面排除在搜索结果之外（应使用 noindex 元标记或头）。

###### 使用场景
在调查期间检查 robots.txt 文件通常很有用，因为它有时可以披露站点所有者不希望被索引的目录和页面，可能是因为它们包含敏感信息，或者揭示其他隐藏或未链接目录的存在。此外，了解爬取规则可能会提供对网站 SEO 策略的见解。

###### 有用链接
- [Google 搜索文档 - Robots.txt](https://developers.google.com/search/docs/advanced/robots/intro)
- [了解 robots.txt（通过 Moz.com）](https://moz.com/learn/seo/robotstxt)
- [RFC-9309 - 机器人排除协议](https://datatracker.ietf.org/doc/rfc9309/)
- [Robots.txt - 维基百科](https://en.wikipedia.org/wiki/Robots_exclusion_standard)

</details>
<details>
<summary><b>HTTP 头</b></summary>

<img width="300" src="https://i.ibb.co/t3xcwP1/wc-headers.png" align="right" />

###### 描述
Headers 任务涉及提取和解释目标网站在请求-响应周期期间发送的 HTTP 头。HTTP 头是在 HTTP 响应开始时或在实际数据之前发送的键值对。头包含有关如何处理正在传输的数据的重要指令，包括缓存策略、内容类型、编码、服务器信息、安全策略等。

###### 使用场景
分析 HTTP 头可以在 OSINT 调查中提供重要见解。头可以揭示特定的服务器配置、选择的技术、缓存指令和各种安全设置。此信息可以帮助确定网站的基础技术堆栈、服务器端安全措施、潜在漏洞和一般操作实践。

###### 有用链接
- [HTTP 头 - 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [RFC-7231 第 7 节 - 头](https://datatracker.ietf.org/doc/html/rfc7231#section-7)
- [头响应字段列表](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)
- [OWASP 安全头项目](https://owasp.org/www-project-secure-headers/)

</details>
<details>
<summary><b>质量指标</b></summary>

<img width="300" src="https://i.ibb.co/Kqg8rx7/wc-quality.png" align="right" />

###### 描述
使用 Lighthouse，质量指标任务测量目标网站的性能、可访问性、最佳实践和 SEO。这返回一个简单的 100 个核心指标清单，以及每个类别的分数，以评估给定站点的整体质量。

###### 使用场景
用于评估站点的技术健康状况、SEO 问题、识别漏洞，并确保符合标准。

###### 有用链接
- [Lighthouse 文档](https://developer.chrome.com/docs/lighthouse/)
- [Google 页面速度工具](https://developers.google.com/speed)
- [W3 可访问性工具](https://www.w3.org/WAI/test-evaluate/)
- [Google 搜索控制台](https://search.google.com/search-console)
- [SEO 检查器](https://www.seobility.net/en/seocheck/)
- [PWA 构建器](https://www.pwabuilder.com/)

</details>
<details>
<summary><b>服务器位置</b></summary>

<img width="300" src="https://i.ibb.co/cXH2hfR/wc-location.png" align="right" />

###### 描述
服务器位置任务根据 IP 地址确定托管给定网站的服务器的物理位置。这是通过在位置数据库中查找 IP 来完成的，该数据库将 IP 映射到已知数据中心和 ISP 的经纬度。从纬度和经度，可以显示额外的上下文信息，如地图上的图钉、地址、旗帜、时区、货币等。

###### 使用场景
了解服务器位置是更好地理解网站的良好第一步。对于站点所有者，这有助于优化内容交付，确保符合数据驻留要求，并识别可能影响特定地理区域用户体验的潜在延迟问题。对于安全研究人员，评估特定地区或司法管辖区关于网络威胁和法规的风险。

###### 有用链接
- [IP 定位器](https://geobytes.com/iplocator/)
- [互联网地理定位 - 维基百科](https://en.wikipedia.org/wiki/Internet_geolocation)

</details>
<details>
<summary><b>关联主机</b></summary>

<img width="300" src="https://i.ibb.co/25j1sT7/wc-hosts.png" align="right" />

###### 描述
此任务涉及识别和列出与网站主域名关联的所有域名和子域名（主机名）。此过程通常涉及 DNS 枚举以发现任何链接的域名和主机名，以及查看已知的 DNS 记录。

###### 使用场景
在调查期间，了解目标的 Web 存在的完整范围至关重要。关联域名可能导致发现相关项目、备份站点、开发/测试站点或与主站点链接的服务。这些有时可以提供额外信息或潜在的安全漏洞。关联域名和主机名的综合列表还可以提供组织结构和在线足迹的概览。

###### 有用链接
- [DNS 枚举 - 维基百科](https://en.wikipedia.org/wiki/DNS_enumeration)
- [OWASP - 枚举 Web 服务器上的应用程序](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/04-Enumerate_Applications_on_Webserver)
- [DNS 枚举 - DNS Dumpster](https://dnsdumpster.com/)
- [子域名查找器](https://subdomainfinder.c99.nl/)

</details>
<details>
<summary><b>重定向链</b></summary>

<img width="300" src="https://i.ibb.co/hVVrmwh/wc-redirects.png" align="right" />

###### 描述
此任务跟踪从原始 URL 到最终目标 URL 发生的 HTTP 重定向序列。HTTP 重定向是建议客户端转到另一个 URL 的状态码响应。重定向可能由于多种原因发生，例如 URL 规范化（定向到站点的 www 版本）、强制 HTTPS、URL 缩短器或将用户转发到新的站点位置。

###### 使用场景
了解重定向链对于几个原因很有用。从安全角度来看，长或复杂的重定向链可能是潜在安全风险的迹象，例如链中的未加密重定向。此外，重定向可能会影响网站性能和 SEO，因为每个重定向都会引入额外的往返时间（RTT）。对于 OSINT，了解重定向链可以帮助识别不同域名之间的关系或揭示某些技术或托管提供商的使用。

###### 有用链接
- [HTTP 重定向 - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
- [URL 重定向 - 维基百科](https://en.wikipedia.org/wiki/URL_redirection)
- [301 重定向解释](https://ahrefs.com/blog/301-redirects/)

</details>
<details>
<summary><b>TXT 记录</b></summary>

<img width="300" src="https://i.ibb.co/wyt21QN/wc-txt-records.png" align="right" />

###### 描述
TXT 记录是一种 DNS 记录，向域外的源提供文本信息。它们可用于各种目的，例如验证域名所有权、确保电子邮件安全，甚至防止对您网站的未经授权的更改。

###### 使用场景
TXT 记录通常揭示与给定域名一起使用的外部服务和技术。它们可能披露有关域名电子邮件配置的详细信息、使用特定服务（如 Google Workspace 或 Microsoft 365），或安全措施（如 SPF 和 DKIM）。了解这些细节可以提供对组织使用的技术、其电子邮件安全实践和潜在漏洞的见解。

###### 有用链接
- [TXT 记录（通过 Cloudflare 学习）](https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/)
- [TXT 记录 - 维基百科](https://en.wikipedia.org/wiki/TXT_record)
- [RFC-1464 - TXT 记录](https://datatracker.ietf.org/doc/html/rfc1464)
- [TXT 记录查找（通过 MxToolbox）](https://mxtoolbox.com/TXTLookup.aspx)

</details>
<details>
<summary><b>服务器状态</b></summary>

<img width="300" src="https://i.ibb.co/V9CNLBK/wc-status.png" align="right" />

###### 描述
检查服务器是否在线并响应请求。

###### 使用场景


###### 有用链接

</details>
<details>
<summary><b>开放端口</b></summary>

<img width="300" src="https://i.ibb.co/F8D1hmf/wc-ports.png" align="right" />

###### 描述
服务器上的开放端口是可用于与客户端建立连接的通信端点。每个端口对应于特定的服务或协议，例如 HTTP（端口 80）、HTTPS（端口 443）、FTP（端口 21）等。服务器上的开放端口可以使用端口扫描等技术确定。

###### 使用场景
了解服务器上哪些端口是开放的可以提供有关在该服务器上运行的服务的有用信息，这对于理解系统的潜在漏洞或了解服务器提供的服务的性质很有用。

###### 有用链接
- [TCP 和 UDP 端口号列表](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers)
- [NMAP - 端口扫描基础](https://nmap.org/book/man-port-scanning-basics.html)

</details>
<details>
<summary><b>路由追踪</b></summary>

<img width="300" src="https://i.ibb.co/M59qgxP/wc-trace-route.png" align="right" />

###### 描述
Traceroute（路由追踪）是一种网络诊断工具，用于实时跟踪信息包从一个系统到另一个系统所采用的路径。它记录路由上的每个跃点，提供有关路由器的 IP 和每个点的延迟的详细信息。

###### 使用场景
在 OSINT 调查中，traceroute 可以提供有关支持网站或服务的网络基础设施的路由路径和地理的见解。这可以帮助识别网络瓶颈、潜在的网络流量审查或操纵，并提供网络结构和效率的整体感。此外，在 traceroute 期间收集的 IP 地址可能会为进一步的 OSINT 调查提供额外的调查点。

###### 有用链接
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })

</details>
<details>
<summary><b>碳足迹</b></summary>

<img width="300" src="https://i.ibb.co/5v6fSyw/Screenshot-from-2023-07-29-19-07-50.png" align="right" />

###### 描述
此任务计算网站的预估碳足迹。它基于传输和处理的数据量，以及托管和交付网站的服务器能耗。网站越大、功能越复杂，其碳足迹可能就越高。

###### 使用场景
从 OSINT（开源网络情报）的角度来看，了解网站的碳足迹并不能直接提供关于其内部运作或背后组织的洞察。然而，在更广泛的分析中，特别是在考虑环境影响的情况下，它仍然是有价值的数据。例如，对于对数字基础设施可持续性感兴趣的活动家、研究人员或道德黑客来说，它非常有用，他们希望让组织对其环境影响负责。

###### 有用链接
- [WebsiteCarbon - 碳足迹计算器](https://www.websitecarbon.com/)
- [绿色网络基金会](https://www.thegreenwebfoundation.org/)
- [环保网络联盟](https://ecofriendlyweb.org/)
- [Reset.org](https://en.reset.org/)
- [您的网站正在毁灭地球 - Wired 文章](https://www.wired.co.uk/article/internet-carbon-footprint)

</details>
<details>
<summary><b>服务器信息</b></summary>

<img width="300" src="https://i.ibb.co/Mk1jx32/wc-server.png" align="right" />

###### 描述
此任务检索托管目标网站的服务器的各种信息。这可能包括服务器类型（例如 Apache、Nginx）、托管提供商、自治系统号（ASN）等。这些信息通常通过 IP 地址查询和 HTTP 响应头分析相结合的方式获得。

###### 使用场景
在 OSINT 上下文中，服务器信息可以提供关于网站背后组织的有价值的线索。例如，托管提供商的选择可能暗示组织运营的地理区域，而服务器类型可能暗示组织使用的技术。ASN 也可以用来查找同一组织托管的其他域名。

###### 有用链接
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })

</details>
<details>
<summary><b>Whois 查询</b></summary>

<img width="300" src="https://i.ibb.co/89WLp14/wc-domain.png" align="right" />

###### 描述
此任务检索目标域名的 Whois 记录。Whois 记录是丰富的信息来源，包括域名注册人的姓名和联系信息、域名的创建和过期日期、域名的名称服务器等。这些信息通常通过查询 Whois 数据库服务器获得。

###### 使用场景
在 OSINT 上下文中，Whois 记录可以提供关于网站背后实体的有价值的线索。它们可以显示域名首次注册的时间和即将过期的时间，这可能提供实体运营时间线的洞察。联系信息虽然经常被编辑或匿名化，但有时可以导致额外的调查途径。名称服务器也可以用来链接同一实体拥有的多个域名。

###### 有用链接
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })

</details>
<details>
<summary><b>域名信息</b></summary>

<img width="300" src="https://i.ibb.co/89WLp14/wc-domain.png" align="right" />

###### 描述
此任务检索目标域名的 Whois 记录。Whois 记录是丰富的信息来源，包括域名注册人的姓名和联系信息、域名的创建和过期日期、域名的名称服务器等。这些信息通常通过查询 Whois 数据库服务器获得。

###### 使用场景
在 OSINT 上下文中，Whois 记录可以提供关于网站背后实体的有价值的线索。它们可以显示域名首次注册的时间和即将过期的时间，这可能提供实体运营时间线的洞察。联系信息虽然经常被编辑或匿名化，但有时可以导致额外的调查途径。名称服务器也可以用来链接同一实体拥有的多个域名。

###### 有用链接
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })

</details>
<details>
<summary><b>DNS 安全扩展</b></summary>

<img width="300" src="https://i.ibb.co/J54zVmQ/wc-dnssec.png" align="right" />

###### 描述
没有 DNSSEC，MITM（中间人）攻击者可能伪造记录并将用户引导至钓鱼网站。这是因为 DNS 系统没有内置方法来验证对请求的响应是否被伪造，或者过程的任何其他部分是否被攻击者中断。DNS 安全扩展（DNSSEC）通过使用公钥对 DNS 记录进行签名来保护 DNS 查询，以便浏览器可以检测响应是否被篡改。解决此问题的另一个方案是 DoH（DNS over HTTPS，通过 HTTPS 的 DNS）和 DoT（DNS over TLD，通过 TLD 的 DNS）。

###### 使用场景
DNSSEC 信息提供了关于组织网络安全成熟度和潜在漏洞的洞察，特别是围绕 DNS 欺骗和缓存投毒。如果没有实施 DNS 安全（DNSSEC、DoH、DoT 等），这可能会为攻击者提供入口点。

###### 有用链接
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })

</details>
<details>
<summary><b>网站功能</b></summary>

<img width="300" src="https://i.ibb.co/gP4P6kp/wc-features.png" align="right" />

###### 描述
检查网站上存在哪些核心功能。如果某个功能被标记为"已失效"，则表示它在加载时未被主动使用。

###### 使用场景
这有助于了解网站能够做什么，以及需要寻找哪些技术。

###### 有用链接

</details>
<details>
<summary><b>HTTP 严格传输安全</b></summary>

<img width="300" src="https://i.ibb.co/k253fq4/Screenshot-from-2023-07-17-20-10-52.png" align="right" />

###### 描述
HTTP 严格传输安全（HSTS）是一种 Web 安全策略机制，有助于保护网站免受协议降级攻击和 Cookie 劫持。网站可以通过符合一组要求然后将自己提交到列表中来包含在 HSTS 预加载列表中。

###### 使用场景
网站启用 HSTS 有以下几个重要原因：
      1. 用户收藏或手动输入 http://example.com 并受到中间人攻击
        HSTS 自动将目标域的 HTTP 请求重定向到 HTTPS
      2. 本应仅使用 HTTPS 的 Web 应用程序意外包含 HTTP 链接或通过 HTTP 提供内容
        HSTS 自动将目标域的 HTTP 请求重定向到 HTTPS
      3. 中间人攻击者尝试使用无效证书拦截受害用户的流量，并希望用户接受错误的证书
        HSTS 不允许用户覆盖无效证书消息
        

###### 有用链接
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })
- [undefined](function link() { [native code] })

</details>
<details>
<summary><b>DNS 服务器</b></summary>

<img width="300" src="https://i.ibb.co/tKpL8F9/Screenshot-from-2023-08-12-15-43-12.png" align="right" />

###### 描述
此检查确定请求的 URL / IP 解析到的 DNS 服务器。还会启动一个基本检查，以查看 DNS 服务器是否支持 DoH，以及是否容易受到 DNS 缓存投毒攻击。

###### 使用场景


###### 有用链接

</details>
<details>
<summary><b>技术栈</b></summary>

<img width="300" src="https://i.ibb.co/bBQSQNz/Screenshot-from-2023-08-12-15-43-46.png" align="right" />

###### 描述
检查网站使用的技术构建。这是通过获取和解析网站，然后将其与 Wappalyzer 维护的正则表达式列表进行比较，以识别不同技术留下的独特指纹来完成的。

###### 使用场景
识别网站的技术栈有助于通过暴露潜在漏洞来评估其安全性，为竞争分析和开发决策提供信息，并可以指导定制的营销策略。道德地应用这些知识对于避免数据盗窃或未经授权的入侵等有害活动至关重要。

###### 有用链接
- [Wappalyzer 指纹](https://github.com/wappalyzer/wappalyzer/tree/master/src/technologies)
- [BuiltWith - 检查网站使用的技术](https://builtwith.com/)

</details>
<details>
<summary><b>已列出的页面</b></summary>

<img width="300" src="https://i.ibb.co/GtrCQYq/Screenshot-from-2023-07-21-12-28-38.png" align="right" />

###### 描述
此作业查找并解析网站的列出的站点地图（sitemap）。此文件列出了网站上希望被搜索引擎抓取的公共子页面。站点地图有助于 SEO（搜索引擎优化），但也有助于一目了然地查看网站的所有公共内容。

###### 使用场景
了解网站面向公众的内容结构，对于网站所有者，检查您的网站站点地图是否可访问、可解析并包含您希望包含的所有内容。

###### 有用链接
- [了解站点地图](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Sitemap XML 规范](https://www.sitemaps.org/protocol.html)
- [Sitemap 教程](https://www.conductor.com/academy/xml-sitemap/)

</details>
<details>
<summary><b>Security.txt</b></summary>

<img width="300" src="https://i.ibb.co/tq1FT5r/Screenshot-from-2023-07-24-20-31-21.png" align="right" />

###### 描述
security.txt 文件告诉研究人员他们如何负责任地披露在您的网站上发现的任何安全问题。该标准在 RFC 9116 中提出，并指定此文件应包括联系点（电子邮件地址），以及可选的其他信息，如安全披露策略链接、PGP 密钥、首选语言、策略到期时间等。该文件应位于您的域的根目录，位于 /security.txt 或 /.well-known/security.txt。

###### 使用场景
这很重要，因为没有定义的联系点，安全研究人员可能无法报告关键的安全问题，或者可能使用不安全或可能公开的渠道来报告。从 OSINT 的角度来看，您还可以收集有关网站的信息，包括他们对安全的立场、他们的 CSAF 提供商以及 PGP 公钥中的元数据。

###### 有用链接
- [securitytxt.org](https://securitytxt.org/)
- [RFC-9116 提案](https://datatracker.ietf.org/doc/html/rfc9116)
- [RFC-9116 历史](https://datatracker.ietf.org/doc/rfc9116/)
- [Security.txt (维基百科)](https://en.wikipedia.org/wiki/Security.txt)
- [示例 security.txt (Cloudflare)](https://www.cloudflare.com/.well-known/security.txt)
- [创建 security.txt 的教程 (Pieter Bakker)](https://pieterbakker.com/implementing-security-txt/)

</details>
<details>
<summary><b>链接页面</b></summary>

<img width="300" src="https://i.ibb.co/LtK14XR/Screenshot-from-2023-07-29-11-16-44.png" align="right" />

###### 描述
显示在网站上找到的所有内部和外部链接，这些链接由附加到锚元素的 href 属性标识。

###### 使用场景
对于网站所有者，这有助于诊断 SEO 问题、改进网站结构、了解内容如何相互连接。外部链接可以显示合作伙伴关系、依赖关系和潜在的声誉风险。从安全角度来看，出站链接可以帮助识别网站无意中链接到的任何潜在恶意或受损的网站。分析内部链接有助于了解网站的结构，并可能发现不应公开的隐藏或易受攻击的页面。对于 OSINT 调查人员，它有助于建立对目标的全面了解，发现相关实体、资源，甚至网站的潜在隐藏部分。

###### 有用链接
- [W3C 链接检查器](https://validator.w3.org/checklink)

</details>
<details>
<summary><b>社交标签</b></summary>

<img width="300" src="https://i.ibb.co/4srTT1w/Screenshot-from-2023-07-29-11-15-27.png" align="right" />

###### 描述
网站可以包含某些元标签，告诉搜索引擎和社交媒体平台要显示什么信息。这通常包括标题、描述、缩略图、关键词、作者、社交帐户等。

###### 使用场景
将此数据添加到您的网站将提升 SEO，作为 OSINT 研究人员，它有助于了解给定的 Web 应用程序如何描述自己。

###### 有用链接
- [SocialSharePreview.com](https://socialsharepreview.com/)
- [社交元标签指南](https://css-tricks.com/essential-meta-tags-social-media/)
- [Web.dev 元数据标签](https://web.dev/learn/html/metadata/)
- [Open Graph 协议](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Open Graph](https://developers.facebook.com/docs/sharing/webmasters)

</details>
<details>
<summary><b>电子邮件配置</b></summary>

<img width="300" src="https://i.ibb.co/yqhwx5G/Screenshot-from-2023-07-29-18-22-20.png" align="right" />

###### 描述
DMARC（基于域的消息身份验证、报告和一致性）：DMARC 是一种电子邮件身份验证协议，与 SPF 和 DKIM 一起工作，以防止电子邮件欺骗和网络钓鱼。它允许域所有者通过在 DNS 中发布的策略指定如何处理未经身份验证的邮件，并为接收邮件服务器提供一种向发送者发送有关电子邮件合规性反馈的方法。BIMI（消息识别的品牌指示器）：BIMI 是一种新兴的电子邮件标准，使组织能够在其客户的电子邮件客户端中自动显示徽标。BIMI 将徽标与域的 DMARC 记录绑定，为收件人提供另一层视觉保证，即电子邮件是合法的。DKIM（DomainKeys 识别邮件）：DKIM 是一种电子邮件安全标准，旨在确保邮件在发送和接收服务器之间传输时未被更改。它使用链接到发送者域的数字签名来验证发送者并确保邮件完整性。SPF（发送者策略框架）：SPF 是一种旨在防止电子邮件欺骗的电子邮件身份验证方法。它通过创建 DNS 记录来指定哪些邮件服务器被授权代表域发送电子邮件。这有助于防止垃圾邮件，为接收邮件服务器提供一种检查来自域的传入邮件是否来自该域管理员授权的主机的方法。

###### 使用场景
此信息对研究人员很有帮助，因为它有助于评估域的电子邮件安全状况、发现潜在漏洞，并验证电子邮件的合法性以进行网络钓鱼检测。这些详细信息还可以提供有关托管环境、潜在服务提供商和目标组织的配置模式的洞察，协助调查工作。

###### 有用链接
- [DMARC、DKIM 和 SPF 介绍 (via Cloudflare)](https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/)
- [EasyDMARC 域扫描器](https://easydmarc.com/tools/domain-scanner)
- [MX Toolbox](https://mxtoolbox.com/)
- [RFC-7208 - SPF](https://datatracker.ietf.org/doc/html/rfc7208)
- [RFC-6376 - DKIM](https://datatracker.ietf.org/doc/html/rfc6376)
- [RFC-7489 - DMARC](https://datatracker.ietf.org/doc/html/rfc7489)
- [BIMI Group](https://bimigroup.org/)

</details>
<details>
<summary><b>防火墙检测</b></summary>

<img width="300" src="https://i.ibb.co/MfcxQt2/Screenshot-from-2023-08-12-15-40-52.png" align="right" />

###### 描述
WAF 或 Web 应用程序防火墙通过过滤和监视 Web 应用程序与 Internet 之间的 HTTP 流量来帮助保护 Web 应用程序。它通常保护 Web 应用程序免受跨站伪造、跨站脚本（XSS）、文件包含和 SQL 注入等攻击。

###### 使用场景
了解网站是否使用 WAF 以及使用哪种防火墙软件/服务很有用，因为这提供了对网站针对多种攻击向量的保护洞察，但也可能揭示防火墙本身的漏洞。

###### 有用链接
- [什么是 WAF (via Cloudflare Learning)](https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/)
- [OWASP - Web 应用程序防火墙](https://owasp.org/www-community/Web_Application_Firewall)
- [Web 应用程序防火墙最佳实践](https://owasp.org/www-pdf-archive/Best_Practices_Guide_WAF_v104.en.pdf)
- [WAF - 维基百科](https://en.wikipedia.org/wiki/Web_application_firewall)

</details>
<details>
<summary><b>HTTP 安全功能</b></summary>

<img width="300" src="https://i.ibb.co/LP05HMV/Screenshot-from-2023-08-12-15-40-28.png" align="right" />

###### 描述
正确配置的安全 HTTP 标头为您的网站增加了一层针对常见攻击的保护。需要注意的主要标头是：HTTP 严格传输安全（HSTS）：强制使用 HTTPS，缓解中间人攻击和协议降级尝试。内容安全策略（CSP）：限制网页资源以防止跨站脚本和数据注入攻击。X-Content-Type-Options：防止浏览器从声明的内容类型 MIME 嗅探响应，抑制 MIME 类型混淆攻击。X-Frame-Options：通过控制浏览器是否应该在 `<frame>`、`<iframe>`、`<embed>` 或 `<object>` 中呈现页面来保护用户免受点击劫持攻击。

###### 使用场景
审查安全标头很重要，因为它提供了对网站防御态势和潜在漏洞的洞察，能够主动缓解并确保符合安全最佳实践。

###### 有用链接
- [OWASP 安全标头项目](https://owasp.org/www-project-secure-headers/)
- [HTTP 标头速查表](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [content-security-policy.com](https://content-security-policy.com/)
- [resourcepolicy.fyi](https://resourcepolicy.fyi/)
- [HTTP 安全标头](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [CSP 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HSTS 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [X-Content-Type-Options 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)
- [X-Frame-Options 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [X-XSS-Protection 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)

</details>
<details>
<summary><b>存档历史</b></summary>

<img width="300" src="https://i.ibb.co/nB9szT1/Screenshot-from-2023-08-14-22-31-16.png" align="right" />

###### 描述
从 Wayback Machine 获取完整的存档历史记录。

###### 使用场景
这有助于了解网站的历史，以及它如何随时间变化。它还可以用于查找网站的旧版本，或查找已被删除的内容。

###### 有用链接
- [Wayback Machine](https://archive.org/web/)

</details>
<details>
<summary><b>全球排名</b></summary>

<img width="300" src="https://i.ibb.co/nkbczgb/Screenshot-from-2023-08-14-22-02-40.png" align="right" />

###### 描述
此检查显示请求网站的全球排名。这仅对前 1 亿列表中的网站准确。我们使用来自 Tranco 项目的数据（见下文），该项目从 Umbrella、Majestic、Quantcast、Chrome 用户体验报告和 Cloudflare Radar 收集了 Web 上的顶级网站。

###### 使用场景
了解网站的整体全球排名有助于了解网站的规模，并将其与其他网站进行比较。它还有助于了解网站的相对受欢迎程度，并识别潜在趋势。

###### 有用链接
- [Tranco 列表](https://tranco-list.eu/)
- [Tranco 研究论文](https://tranco-list.eu/assets/tranco-ndss19.pdf)

</details>
<details>
<summary><b>阻止检测</b></summary>

<img width="300" src="https://i.ibb.co/M5JSXbW/Screenshot-from-2023-08-26-12-12-43.png" align="right" />

###### 描述
使用 10 多个最流行的隐私、恶意软件和家长控制阻止 DNS 服务器检查对 URL 的访问。

###### 使用场景


###### 有用链接
- [ThreatJammer 列表](https://threatjammer.com/osint-lists)

</details>
<details>
<summary><b>恶意软件和网络钓鱼检测</b></summary>

<img width="300" src="https://i.ibb.co/hYgy621/Screenshot-from-2023-08-26-12-07-47.png" align="right" />

###### 描述
检查网站是否出现在多个常见的恶意软件和网络钓鱼列表中，以确定其威胁级别。

###### 使用场景
了解网站是否被这些服务中的任何一个列为威胁有助于了解网站的声誉，并识别潜在趋势。

###### 有用链接
- [URLHaus](https://urlhaus-api.abuse.ch/)
- [PhishTank](https://www.phishtank.com/)

</details>
<details>
<summary><b>TLS 加密套件</b></summary>

<img width="300" src="https://i.ibb.co/6ydtH5R/Screenshot-from-2023-08-26-12-09-58.png" align="right" />

###### 描述
这些是服务器用于建立安全连接的加密算法组合。它包括密钥交换算法、批量加密算法、MAC 算法和 PRF（伪随机函数）。

###### 使用场景
从安全角度来看，测试这些信息很重要。因为加密套件的安全性取决于它所包含的算法。如果加密套件中的加密或身份验证算法版本存在已知漏洞，那么加密套件和 TLS 连接可能会受到降级或其他攻击的影响。

###### 有用链接
- [sslscan2 CLI](https://github.com/rbsec/sslscan)
- [ssl-enum-ciphers (NPMAP 脚本)](https://nmap.org/nsedoc/scripts/ssl-enum-ciphers.html)

</details>
<details>
<summary><b>TLS 安全配置</b></summary>

<img width="300" src="https://i.ibb.co/FmksZJt/Screenshot-from-2023-08-26-12-12-09.png" align="right" />

###### 描述
这使用 Mozilla TLS Observatory 的指南来检查 TLS 配置的安全性。它检查可能导致网站容易受到攻击的错误配置，并提供有关如何修复的建议。它还将提供有关过时和现代 TLS 配置的建议。

###### 使用场景
了解网站 TLS 配置的问题将帮助您解决潜在漏洞，并确保网站使用最新和最安全的 TLS 配置。

###### 有用链接

</details>
<details>
<summary><b>TLS 握手模拟</b></summary>

<img width="300" src="https://i.ibb.co/F7qRZkh/Screenshot-from-2023-08-26-12-11-28.png" align="right" />

###### 描述
这模拟不同的客户端（浏览器、操作系统）如何与服务器执行 TLS 握手。它有助于识别兼容性问题和安全配置。

###### 使用场景


###### 有用链接
- [TLS 握手 (via Cloudflare Learning)](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)
- [SSL 测试 (via SSL Labs)](https://www.ssllabs.com/ssltest/)

</details>
<details>
<summary><b>屏幕截图</b></summary>

<img width="300" src="https://i.ibb.co/2F0x8kP/Screenshot-from-2023-07-29-18-34-48.png" align="right" />

###### 描述
此检查截取请求的 URL / IP 解析到的网页的屏幕截图，并显示它。

###### 使用场景
这有助于查看给定网站的外观，不受浏览器、IP 或位置的限制。


</details>

</details>

在此处阅读更多信息：**[web-check.xyz/about](https://web-check.xyz/about)**

---

## 使用方法

### 部署

### 部署 - 选项 #1：Netlify

点击下面的按钮，部署到 Netlify 👇

[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-%2330c8c9?style=for-the-badge&logo=netlify&labelColor=1e0e41 'Deploy Web-Check to Netlify, via 1-Click Script')](https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check)

### 部署 - 选项 #2：Vercel

点击下面的按钮，部署到 Vercel 👇

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-%23ffffff?style=for-the-badge&logo=vercel&labelColor=1e0e41)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flissy93%2Fweb-check&project-name=web-check&repository-name=web-check-fork&demo-title=Web-Check%20Demo&demo-description=Check%20out%20web-check.xyz%20to%20see%20a%20live%20demo%20of%20this%20application%20running.&demo-url=https%3A%2F%2Fweb-check.xyz&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FLissy93%2Fweb-check%2Fmaster%2F.github%2Fscreenshots%2Fweb-check-screenshot10.png)

### 部署 - 选项 #3：Docker

运行 `docker run -p 3000:3000 lissy93/web-check`，然后打开 [`localhost:3000`](http://localhost:3000)

<details>
<summary>Docker 选项</summary>

您可以从以下位置获取 Docker 镜像：
- DockerHub: [`lissy93/web-check`](https://hub.docker.com/r/lissy93/web-check)
- GHCR: [`ghcr.io/lissy93/web-check`](https://github.com/Lissy93/web-check/pkgs/container/web-check)
- 或者通过克隆仓库并运行 `docker build -t web-check .` 自己构建镜像

</details>

### 部署 - 选项 #4：从源代码部署

安装 [开发](#developing) 部分中列出的先决条件，然后运行：

```bash
git clone https://github.com/Lissy93/web-check.git  # 从 GitHub 下载代码
cd web-check                                        # 进入项目目录
yarn install                                        # 安装 NPM 依赖
yarn build                                          # 构建生产版本应用
yarn serve                                          # 启动应用（API 和 GUI）
```

---

### 配置

默认情况下，不需要配置。

但是您可以设置一些可选的环境变量，以便访问一些额外的检查，或者为使用外部 API 的某些检查增加速率限制。

**API 密钥和凭据**：

密钥 | 值
---|---
`GOOGLE_CLOUD_API_KEY` | Google API 密钥（[在此获取](https://cloud.google.com/api-gateway/docs/authenticate-api-keys)）。这可用于返回网站的质量指标
`REACT_APP_SHODAN_API_KEY` | Shodan API 密钥（[在此获取](https://account.shodan.io/)）。这将显示给定域的关联主机名
`REACT_APP_WHO_API_KEY` | WhoAPI 密钥（[在此获取](https://whoapi.com/)）。这将显示比默认任务更全面的 WhoIs 记录

<details>
  <summary><small>完整/即将推出的值</small></summary>
  
- `GOOGLE_CLOUD_API_KEY` - Google API 密钥（[在此获取](https://cloud.google.com/api-gateway/docs/authenticate-api-keys)）。这可用于返回网站的质量指标
- `REACT_APP_SHODAN_API_KEY` - Shodan API 密钥（[在此获取](https://account.shodan.io/)）。这将显示给定域的关联主机名
- `REACT_APP_WHO_API_KEY` - WhoAPI 密钥（[在此获取](https://whoapi.com/)）。这将显示比默认任务更全面的 WhoIs 记录
- `SECURITY_TRAILS_API_KEY` - Security Trails API 密钥（[在此获取](https://securitytrails.com/corp/api)）。这将显示与 IP 关联的组织信息
- `CLOUDMERSIVE_API_KEY` - Cloudmersive 的 API 密钥（[在此获取](https://account.cloudmersive.com/)）。这将显示与 IP 关联的已知威胁
- `TRANCO_USERNAME` - Tranco 邮箱（[在此获取](https://tranco-list.eu/)）。这将根据流量显示网站的排名
- `TRANCO_API_KEY` - Tranco API 密钥（[在此获取](https://tranco-list.eu/)）。这将根据流量显示网站的排名
- `URL_SCAN_API_KEY` - URLScan API 密钥（[在此获取](https://urlscan.io/)）。这将获取有关网站的各种信息
- `BUILT_WITH_API_KEY` - BuiltWith API 密钥（[在此获取](https://api.builtwith.com/)）。这将显示网站的主要功能
- `TORRENT_IP_API_KEY` - Torrent API 密钥（[在此获取](https://iknowwhatyoudownload.com/en/api/)）。这将显示 IP 下载的 torrent 文件
  
</details>

**配置设置**：

密钥 | 值
---|---
`PORT` | 运行 server.js 时提供 API 的端口（例如 `3000`）
`API_ENABLE_RATE_LIMIT` | 为 /api 端点启用速率限制（例如 `true`）
`API_TIMEOUT_LIMIT` | API 请求的超时限制，以毫秒为单位（例如 `10000`）
`API_CORS_ORIGIN` | 通过在此处设置允许的主机名来启用 CORS（例如 `example.com`）
`CHROME_PATH` | Chromium 可执行文件的路径（例如 `/usr/bin/chromium`）
`DISABLE_GUI` | 禁用 GUI，仅提供 API（例如 `false`）
`REACT_APP_API_ENDPOINT` | API 的端点，可以是本地或远程（例如 `/api`）

所有值都是可选的。

您可以将这些作为环境变量添加。可以直接将它们放入项目根目录的 `.env` 文件中，或者通过 Netlify / Vercel UI，或者使用 --env 标志传递给 Docker 容器，或者使用您自己的环境变量管理系统

请注意，以 `REACT_APP_` 为前缀的密钥在客户端使用，因此必须使用最小权限正确设置范围，因为在拦截浏览器 <-> 服务器网络请求时可能会可见

---

### 开发

1. 克隆仓库，`git clone git@github.com:Lissy93/web-check.git`
2. 进入目录，`cd web-check`
3. 安装依赖：`yarn`
4. 使用 `yarn dev` 启动开发服务器

您需要安装 [Node.js](https://nodejs.org/en)（V 18.16.1 或更高版本），以及 [yarn](https://yarnpkg.com/getting-started/install) 和 [git](https://git-scm.com/)。
某些检查还需要在您的环境中安装 `chromium`、`traceroute` 和 `dns`。如果这些包不存在，这些任务将被跳过。


---

## 社区

### 贡献

非常欢迎任何形式的贡献，我们将不胜感激。
关于行为准则，请参阅 [Contributor Convent](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)。

要开始，请 fork 仓库，进行更改，添加、提交和推送代码，然后回到这里打开拉取请求。如果您是 GitHub 或开源的新手，[本指南](https://www.freecodecamp.org/news/how-to-make-your-first-pull-request-on-github-3#let-s-make-our-first-pull-request-)或 [git 文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)可能会帮助您入门，但如果您需要任何支持，请随时联系我们。

[![提交 PR](https://img.shields.io/badge/Submit_a_PR-GitHub-%23060606?style=for-the-badge&logo=github&logoColor=fff)](https://github.com/Lissy93/web-check/compare)


### 报告错误

如果您发现某些功能无法正常工作，或者想建议新功能，请继续在 GitHub 上提出工单。
对于错误，请概述重现所需的步骤，并包括相关信息，如系统信息和生成的日志。

[![提出问题](https://img.shields.io/badge/Raise_an_Issue-GitHub-%23060606?style=for-the-badge&logo=github&logoColor=fff)](https://github.com/Lissy93/web-check/issues/new/choose)

### 支持

该应用将保持 100% 免费和开源。
但由于托管实例获得的流量很大，lambda 函数的使用成本约为每月 25 美元。
通过 GitHub 赞助帮助分担成本将不胜感激。
感谢社区的支持，这个项目才能免费供所有人使用 :)

[![在 GitHub 上赞助 Lissy93](https://img.shields.io/badge/Sponsor_on_GitHub-Lissy93-%23ff4dda?style=for-the-badge&logo=githubsponsors&logoColor=ff4dda)](https://github.com/sponsors/Lissy93)


### 贡献者

感谢以下用户为 Web-Check 做出的贡献

<!-- readme: contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/Lissy93">
                    <img src="https://avatars.githubusercontent.com/u/1862727?v=4" width="80;" alt="Lissy93"/>
                    <br />
                    <sub><b>Alicia Sykes</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/liss-bot">
                    <img src="https://avatars.githubusercontent.com/u/87835202?v=4" width="80;" alt="liss-bot"/>
                    <br />
                    <sub><b>Alicia Bot</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/n0a">
                    <img src="https://avatars.githubusercontent.com/u/14150948?v=4" width="80;" alt="n0a"/>
                    <br />
                    <sub><b>Denis Simonov</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/muni106">
                    <img src="https://avatars.githubusercontent.com/u/65845442?v=4" width="80;" alt="muni106"/>
                    <br />
                    <sub><b>Mounir Samite</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ChrisCarini">
                    <img src="https://avatars.githubusercontent.com/u/6374067?v=4" width="80;" alt="ChrisCarini"/>
                    <br />
                    <sub><b>Chris Carini</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/bolens">
                    <img src="https://avatars.githubusercontent.com/u/1218380?v=4" width="80;" alt="bolens"/>
                    <br />
                    <sub><b>Michael Bolens</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/HeroGamers">
                    <img src="https://avatars.githubusercontent.com/u/15278940?v=4" width="80;" alt="HeroGamers"/>
                    <br />
                    <sub><b>Marcus Sand</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/jinnabaalu">
                    <img src="https://avatars.githubusercontent.com/u/11784253?v=4" width="80;" alt="jinnabaalu"/>
                    <br />
                    <sub><b>Jinna Baalu</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/GreyXor">
                    <img src="https://avatars.githubusercontent.com/u/79602273?v=4" width="80;" alt="GreyXor"/>
                    <br />
                    <sub><b>GreyXor</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/brianteeman">
                    <img src="https://avatars.githubusercontent.com/u/1296369?v=4" width="80;" alt="brianteeman"/>
                    <br />
                    <sub><b>Brian Teeman</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/vitalykarasik">
                    <img src="https://avatars.githubusercontent.com/u/7628795?v=4" width="80;" alt="vitalykarasik"/>
                    <br />
                    <sub><b>Vitaly Karasik</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Its-Just-Nans">
                    <img src="https://avatars.githubusercontent.com/u/56606507?v=4" width="80;" alt="Its-Just-Nans"/>
                    <br />
                    <sub><b>n4n5</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/robinson">
                    <img src="https://avatars.githubusercontent.com/u/237874?v=4" width="80;" alt="robinson"/>
                    <br />
                    <sub><b>Lth</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/abhishekMuge">
                    <img src="https://avatars.githubusercontent.com/u/49590582?v=4" width="80;" alt="abhishekMuge"/>
                    <br />
                    <sub><b>Abhishek Muge</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/UlisesGascon">
                    <img src="https://avatars.githubusercontent.com/u/5110813?v=4" width="80;" alt="UlisesGascon"/>
                    <br />
                    <sub><b>Ulises Gascón</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/PhiRequiem">
                    <img src="https://avatars.githubusercontent.com/u/1323576?v=4" width="80;" alt="PhiRequiem"/>
                    <br />
                    <sub><b>PhiRequiem</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/ntaiko">
                    <img src="https://avatars.githubusercontent.com/u/108784453?v=4" width="80;" alt="ntaiko"/>
                    <br />
                    <sub><b>Nikolaos G. Ntaiko</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Myzel394">
                    <img src="https://avatars.githubusercontent.com/u/50424412?v=4" width="80;" alt="Myzel394"/>
                    <br />
                    <sub><b>Myzel394</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/murrple-1">
                    <img src="https://avatars.githubusercontent.com/u/5559656?v=4" width="80;" alt="murrple-1"/>
                    <br />
                    <sub><b>Murray Christopherson</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/t3chn0m4g3">
                    <img src="https://avatars.githubusercontent.com/u/4318452?v=4" width="80;" alt="t3chn0m4g3"/>
                    <br />
                    <sub><b>Marco Ochse</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/treatmesubj">
                    <img src="https://avatars.githubusercontent.com/u/39680353?v=4" width="80;" alt="treatmesubj"/>
                    <br />
                    <sub><b>John Hupperts</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/eltociear">
                    <img src="https://avatars.githubusercontent.com/u/22633385?v=4" width="80;" alt="eltociear"/>
                    <br />
                    <sub><b>Ikko Eltociear Ashimine</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/Gertje823">
                    <img src="https://avatars.githubusercontent.com/u/36937387?v=4" width="80;" alt="Gertje823"/>
                    <br />
                    <sub><b>Gertje823</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/epreston">
                    <img src="https://avatars.githubusercontent.com/u/347224?v=4" width="80;" alt="epreston"/>
                    <br />
                    <sub><b>Ed Preston</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/dimitri-kandassamy">
                    <img src="https://avatars.githubusercontent.com/u/21193806?v=4" width="80;" alt="dimitri-kandassamy"/>
                    <br />
                    <sub><b>Dimitri Kandassamy</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/0xflotus">
                    <img src="https://avatars.githubusercontent.com/u/26602940?v=4" width="80;" alt="0xflotus"/>
                    <br />
                    <sub><b>0xflotus</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: contributors -end -->

### 赞助者

非常感谢这些在 GitHub 上赞助我的优秀人士，他们的支持有助于支付保持 Web-Check 和我的其他项目免费供所有人使用所需的费用。如果您有能力，请考虑通过[在 GitHub 上赞助我](https://github.com/sponsors/Lissy93)加入他们的行列。

<!-- readme: sponsors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/vincentkoc">
                    <img src="https://avatars.githubusercontent.com/u/25068?v=4" width="80;" alt="vincentkoc"/>
                    <br />
                    <sub><b>Vincent Koc</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/AnandChowdhary">
                    <img src="https://avatars.githubusercontent.com/u/2841780?u=747e554b3a7f12eb20b7910e1c87d817844f714f&v=4" width="80;" alt="AnandChowdhary"/>
                    <br />
                    <sub><b>Anand Chowdhary</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/shrippen">
                    <img src="https://avatars.githubusercontent.com/u/2873570?v=4" width="80;" alt="shrippen"/>
                    <br />
                    <sub><b>Shrippen</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/bile0026">
                    <img src="https://avatars.githubusercontent.com/u/5022496?u=aec96ad173c0ea9baaba93807efa8a848af6595c&v=4" width="80;" alt="bile0026"/>
                    <br />
                    <sub><b>Zach Biles</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/UlisesGascon">
                    <img src="https://avatars.githubusercontent.com/u/5110813?u=3c41facd8aa26154b9451de237c34b0f78d672a5&v=4" width="80;" alt="UlisesGascon"/>
                    <br />
                    <sub><b>Ulises Gascón</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/digitalarche">
                    <img src="https://avatars.githubusercontent.com/u/6546135?u=564756d7f44ab2206819eb3148f6d822673f5066&v=4" width="80;" alt="digitalarche"/>
                    <br />
                    <sub><b>Digital Archeology</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/InDieTasten">
                    <img src="https://avatars.githubusercontent.com/u/7047377?u=8d8f8017628b38bc46dcbf3620e194b01d3fb2d1&v=4" width="80;" alt="InDieTasten"/>
                    <br />
                    <sub><b>InDieTasten</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/araguaci">
                    <img src="https://avatars.githubusercontent.com/u/7318668?v=4" width="80;" alt="araguaci"/>
                    <br />
                    <sub><b>Araguaci</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/bmcgonag">
                    <img src="https://avatars.githubusercontent.com/u/7346620?u=2a0f9284f3e12ac1cc15288c254d1ec68a5081e8&v=4" width="80;" alt="bmcgonag"/>
                    <br />
                    <sub><b>Brian McGonagill</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/arcestia">
                    <img src="https://avatars.githubusercontent.com/u/7936962?v=4" width="80;" alt="arcestia"/>
                    <br />
                    <sub><b>Laurensius Jeffrey</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/vlad-tim">
                    <img src="https://avatars.githubusercontent.com/u/11474041?u=eee43705b54d2ec9f51fc4fcce5ad18dd17c87e4&v=4" width="80;" alt="vlad-tim"/>
                    <br />
                    <sub><b>Vlad</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/helixzz">
                    <img src="https://avatars.githubusercontent.com/u/12218889?u=d06d0c103dfbdb99450623064f7da3c5a3675fb6&v=4" width="80;" alt="helixzz"/>
                    <br />
                    <sub><b>HeliXZz</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/mryesiller">
                    <img src="https://avatars.githubusercontent.com/u/24632172?u=0d20f2d615158f87cd60a3398d3efb026c32f291&v=4" width="80;" alt="mryesiller"/>
                    <br />
                    <sub><b>Göksel Yeşiller</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/sushibait">
                    <img src="https://avatars.githubusercontent.com/u/26634535?v=4" width="80;" alt="sushibait"/>
                    <br />
                    <sub><b>Shiverme Timbers</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/getumbrel">
                    <img src="https://avatars.githubusercontent.com/u/59408891?v=4" width="80;" alt="getumbrel"/>
                    <br />
                    <sub><b>Umbrel</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/OlliVHH">
                    <img src="https://avatars.githubusercontent.com/u/84959562?v=4" width="80;" alt="OlliVHH"/>
                    <br />
                    <sub><b>HamburgerJung</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/frankdez93">
                    <img src="https://avatars.githubusercontent.com/u/87549420?v=4" width="80;" alt="frankdez93"/>
                    <br />
                    <sub><b>Frankdez93</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/terminaltrove">
                    <img src="https://avatars.githubusercontent.com/u/121595180?v=4" width="80;" alt="terminaltrove"/>
                    <br />
                    <sub><b>Terminal Trove</b></sub>
                </a>
            </td>
		</tr>
		<tr>
            <td align="center">
                <a href="https://github.com/st617">
                    <img src="https://avatars.githubusercontent.com/u/128325650?v=4" width="80;" alt="st617"/>
                    <br />
                    <sub><b>st617</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/hudsonrock-partnerships">
                    <img src="https://avatars.githubusercontent.com/u/163282900?u=5f2667f7fe5d284ac7a2da6b0800ea8970b0fcbf&v=4" width="80;" alt="hudsonrock-partnerships"/>
                    <br />
                    <sub><b>hudsonrock-partnerships</b></sub>
                </a>
            </td>
            <td align="center">
                <a href="https://github.com/CarterPerez-dev">
                    <img src="https://avatars.githubusercontent.com/u/188120068?v=4" width="80;" alt="CarterPerez-dev"/>
                    <br />
                    <sub><b>Carter Perez</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: sponsors -end -->

---

## 许可证

> _**[Lissy93/Web-Check](https://github.com/Lissy93/web-check)** 采用 [MIT](https://github.com/Lissy93/web-check/blob/HEAD/LICENSE) 许可证 © [Alicia Sykes](https://aliciasykes.com) 2023._<br>
> <sup align="right">有关信息，请参阅 <a href="https://tldrlegal.com/license/mit-license">TLDR Legal > MIT</a></sup>

<details>
<summary>展开许可证</summary>

```
MIT 许可证（MIT）
版权所有 (c) Alicia Sykes <alicia@omg.com>

特此免费授予任何获得本软件及相关文档文件（"软件"）副本的人不受限制地处理本软件的权利，包括但不限于使用、复制、修改、合并、发布、分发、再许可和/或销售软件副本的权利，并允许获得软件的人员这样做，但须符合以下条件：

上述版权声明和本许可声明应包含在软件的所有副本或实质性部分中。

本软件按"原样"提供，不提供任何形式的明示或暗示保证，包括但不限于对适销性、特定用途适用性和非侵权性的保证。在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任负责，无论是合同、侵权或其他方式的诉讼，由软件或软件的使用或其他交易引起、产生或与之相关。

```

[![在 FOSSA 上查看依赖许可证和 SBOM](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLissy93%2Fweb-check.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FLissy93%2Fweb-check?ref=badge_large&issueType=license)

</details>


<!-- 许可证 + 版权 -->
<p  align="center">
  <i>© <a href="https://aliciasykes.com">Alicia Sykes</a> 2023</i><br>
  <i>根据 <a href="https://gist.github.com/Lissy93/143d2ee01ccc5c052a17">MIT</a> 许可</i><br>
  <a href="https://github.com/lissy93"><img src="https://i.ibb.co/4KtpYxb/octocat-clean-mini.png" /></a><br>
  <sup>感谢访问 :)</sup>
</p>

<!-- Dinosaurs are Awesome -->
<!-- 
                        . - ~ ~ ~ - .
      ..     _      .-~               ~-.
     //|     \ `..~                      `.
    || |      }  }              /       \  \
(\   \\ \~^..'                 |         }  \
 \`.-~  o      /       }       |        /    \
 (__          |       /        |       /      `.
  `- - ~ ~ -._|      /_ - ~ ~ ^|      /- _      `.
              |     /          |     /     ~-.     ~- _
              |_____|          |_____|         ~ - . _ _~_-_
-->

