// 文档接口定义
export interface Doc {
  id: string;
  title: string;
  description: string;
  use: string;
  resources: string[] | { title: string, link: string}[];
  screenshot?: string;
}

const docs: Doc[] = [
  {
    id: "get-ip",
    title: "IP信息",
    description:
      "IP地址（Internet Protocol address）是分配给连接到网络/互联网的每个设备的数字标签。通过查询域名系统（DNS）的域名A（地址）记录，可以找到与给定域名关联的IP。",
    use: "查找给定服务器的IP是进行进一步调查的第一步，因为它允许我们探测服务器以获取更多信息。包括创建目标网络基础设施的详细地图、精确定位服务器的物理位置、识别托管服务，甚至发现在同一IP地址上托管的其他域名。",
    resources: [
      { title: '理解IP地址', link: 'https://www.digitalocean.com/community/tutorials/understanding-ip-addresses-subnets-and-cidr-notation-for-networking'},
      { title: 'IP地址 - 维基百科', link: 'https://en.wikipedia.org/wiki/IP_address'},
      { title: 'RFC-791 Internet协议', link: 'https://tools.ietf.org/html/rfc791'},
      { title: 'whatismyipaddress.com', link: 'https://whatismyipaddress.com/'},
    ],
  },
  {
    id: "ssl",
    title: "SSL证书链",
    description:
    "SSL证书是用于验证网站或服务器身份的数字证书，可启用安全加密通信（HTTPS），并在客户端和服务器之间建立信任。网站要能够使用HTTPS协议并加密传输中的用户+站点数据，需要有效的SSL证书。SSL证书由证书颁发机构（CA）颁发，CA是验证证书持有者身份和合法性的可信第三方。",
    use: "SSL证书不仅提供确保往返网站的数据传输安全的保证，而且还提供有价值的开源情报（OSINT）数据。SSL证书中的信息可以包括颁发机构、域名、其有效期，有时甚至包括组织详细信息。这对于验证网站的真实性、了解其安全设置，甚至发现关联的子域名或其他服务很有用。",
    resources: [
      { title: 'TLS - 维基百科', link: 'https://en.wikipedia.org/wiki/Transport_Layer_Security'},
      { title: '什么是SSL（通过Cloudflare学习）', link: 'https://www.cloudflare.com/learning/ssl/what-is-ssl/'},
      { title: 'RFC-8446 - TLS', link: 'https://tools.ietf.org/html/rfc8446'},
      { title: 'SSL检查器', link: 'https://www.sslshopper.com/ssl-checker.html'},
    ],
    screenshot: 'https://i.ibb.co/kB7LsV1/wc-ssl.png',
  },
  {
    id: "dns",
    title: "DNS记录",
    description:
      "此任务涉及查找与特定域名关联的DNS记录。DNS是一个将人类可读的域名转换为计算机用于通信的IP地址的系统。存在多种类型的DNS记录，包括A（地址）、MX（邮件交换）、NS（名称服务器）、CNAME（规范名称）和TXT（文本）等。",
    use: "在OSINT调查中，提取DNS记录可以提供大量信息。例如，A和AAAA记录可以披露与域名关联的IP地址，从而可能揭示服务器的位置。MX记录可以提供有关域名电子邮件提供商的线索。TXT记录通常用于各种管理目的，有时可能会无意中泄露内部信息。了解域名的DNS设置也有助于了解其在线基础设施的构建和管理方式。",
    resources: [
      { title: '什么是DNS记录？（通过Cloudflare学习）', link: 'https://www.cloudflare.com/learning/dns/dns-records/'},
      { title: 'DNS记录类型', link: 'https://en.wikipedia.org/wiki/List_of_DNS_record_types'},
      { title: 'RFC-1035 - DNS', link: 'https://tools.ietf.org/html/rfc1035'},
      { title: 'DNS查询（通过MxToolbox）', link: 'https://mxtoolbox.com/DNSLookup.aspx'},
    ],
    screenshot: 'https://i.ibb.co/7Q1kMwM/wc-dns.png',
  },
  {
    id: "cookies",
    title: "Cookies",
    description:
      "Cookies任务涉及检查目标网站设置的HTTP cookies。Cookies是Web浏览器在浏览网站时存储在用户计算机上的小数据片段。它们保存特定于特定客户端和网站的少量数据，例如网站首选项、用户会话的状态或跟踪信息。",
    use: "Cookies可以披露有关网站如何跟踪和与其用户交互的信息。例如，会话cookies可以揭示如何管理用户会话，跟踪cookies可以提示正在使用哪种跟踪或分析框架。此外，检查cookie策略和实践可以提供有关网站安全设置和隐私法规合规性的见解。",
    resources: [
      { title: 'HTTP Cookie文档（Mozilla）', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies' },
      { title: '什么是Cookies（通过Cloudflare学习）', link: 'https://www.cloudflare.com/learning/privacy/what-are-cookies/' },
      { title: '测试Cookie属性（OWASP）', link: 'https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes' },
      { title: 'RFC-6265 - Cookies', link: 'https://tools.ietf.org/html/rfc6265' },
    ],
    screenshot: 'https://i.ibb.co/TTQ6DtP/wc-cookies.png',
  },
  {
    id: "robots-txt",
    title: "爬虫规则",
    description:
      "Robots.txt是一个（通常）在域名根目录中找到的文件，用于实现机器人排除协议（REP），以指示哪些爬虫和机器人应忽略哪些页面。避免搜索引擎爬虫使您的站点过载是一种好习惯，但不应用于将页面排除在搜索结果之外（请改用noindex元标记或标头）。",
    use: "在调查期间检查robots.txt文件通常很有用，因为它有时可以披露站点所有者不希望被索引的目录和页面，可能是因为它们包含敏感信息，或者揭示其他隐藏或未链接的目录的存在。此外，了解爬虫规则可以提供有关网站SEO策略的见解。",
    resources: [
      { title: 'Google搜索文档 - Robots.txt', link: 'https://developers.google.com/search/docs/advanced/robots/intro' },
      { title: '了解robots.txt（通过Moz.com）', link: 'https://moz.com/learn/seo/robotstxt' },
      { title: 'RFC-9309 - 机器人排除协议', link: 'https://datatracker.ietf.org/doc/rfc9309/' },
      { title: 'Robots.txt - 维基百科', link: 'https://en.wikipedia.org/wiki/Robots_exclusion_standard' },
    ],
    screenshot: 'https://i.ibb.co/KwQCjPf/wc-robots.png',
  },
  {
    id: "headers",
    title: "HTTP标头",
    description:
      "标头任务涉及提取和解释目标网站在请求-响应周期期间发送的HTTP标头。HTTP标头是在HTTP响应开始时或在实际数据之前发送的键值对。标头包含有关如何处理正在传输的数据的重要指令，包括缓存策略、内容类型、编码、服务器信息、安全策略等。",
    use: "分析HTTP标头可以在OSINT调查中提供重要见解。标头可以揭示特定的服务器配置、选择的技术、缓存指令和各种安全设置。此信息可以帮助确定网站的基础技术栈、服务器端安全措施、潜在漏洞和一般操作实践。",
    resources: [
      { title: 'HTTP标头 - 文档', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers' },
      { title: 'RFC-7231第7节 - 标头', link: 'https://datatracker.ietf.org/doc/html/rfc7231#section-7' },
      { title: '标头响应字段列表', link: 'https://en.wikipedia.org/wiki/List_of_HTTP_header_fields' },
      { title: 'OWASP安全标头项目', link: 'https://owasp.org/www-project-secure-headers/' },
    ],
    screenshot: 'https://i.ibb.co/t3xcwP1/wc-headers.png',
  },
  {
    id: "quality",
    title: "质量指标",
    description:
      "使用Lighthouse，质量指标任务测量目标网站的性能、可访问性、最佳实践和SEO。这返回一个简单的100个核心指标清单，以及每个类别的分数，以评估给定站点的整体质量。",
    use: "对于评估站点的技术健康状况、SEO问题、识别漏洞和确保符合标准很有用。",
    resources: [
      { title: 'Lighthouse文档', link: 'https://developer.chrome.com/docs/lighthouse/' },
      { title: 'Google页面速度工具', link: 'https://developers.google.com/speed' },
      { title: 'W3可访问性工具', link: 'https://www.w3.org/WAI/test-evaluate/' },
      { title: 'Google搜索控制台', link: 'https://search.google.com/search-console' },
      { title: 'SEO检查器', link: 'https://www.seobility.net/en/seocheck/' },
      { title: 'PWA构建器', link: 'https://www.pwabuilder.com/' },
    ],
    screenshot: 'https://i.ibb.co/Kqg8rx7/wc-quality.png',
  },
  {
    id: "location",
    title: "服务器位置",
    description:
      "服务器位置任务根据IP地址确定托管给定网站的服务器的物理位置。这是通过在位置数据库中查找IP来完成的，该数据库将IP映射到已知数据中心和ISP的纬度和经度。从纬度和经度，可以显示其他上下文信息，例如地图上的图钉，以及地址、标志、时区、货币等。",
    use: "了解服务器位置是更好地了解网站的良好第一步。对于站点所有者，这有助于优化内容交付、确保符合数据驻留要求，以及识别可能影响特定地理区域用户体验的潜在延迟问题。对于安全研究人员，评估特定区域或司法管辖区对网络威胁和法规构成的风险。",
    resources: [
      { title: 'IP定位器', link: 'https://geobytes.com/iplocator/' },
      { title: '互联网地理定位 - 维基百科', link: 'https://en.wikipedia.org/wiki/Internet_geolocation' },
    ],
    screenshot: 'https://i.ibb.co/cXH2hfR/wc-location.png',
  },
  {
    id: "hosts",
    title: "关联主机",
    description:
      "此任务涉及识别和列出与网站主域名关联的所有域名和子域名（主机名）。此过程通常涉及DNS枚举以发现任何关联的域名和主机名，以及查看已知的DNS记录。",
    use: "在调查期间，了解目标网络存在的完整范围至关重要。关联域名可能导致发现相关项目、备份站点、开发/测试站点或与主站点链接的服务。这些有时可以提供额外信息或潜在的安全漏洞。关联域名和主机名的综合列表还可以提供组织结构和在线足迹的概述。",
    resources: [
      { title: 'DNS枚举 - 维基百科', link: 'https://en.wikipedia.org/wiki/DNS_enumeration' },
      { title: 'OWASP - 枚举Web服务器上的应用程序', link: 'https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/01-Information_Gathering/04-Enumerate_Applications_on_Webserver' },
      { title: 'DNS枚举 - DNS Dumpster', link: 'https://dnsdumpster.com/' },
      { title: '子域名查找器', link: 'https://subdomainfinder.c99.nl/' },
    ],
    screenshot: 'https://i.ibb.co/25j1sT7/wc-hosts.png',
  },
  {
    id: "redirects",
    title: "重定向链",
    description:
      "此任务跟踪从原始URL到目标URL发生的HTTP重定向序列。HTTP重定向是建议客户端转到另一个URL的状态码响应。重定向可能由于多种原因而发生，例如URL规范化（指向站点的www版本）、强制HTTPS、URL缩短器或将用户转发到新站点位置。",
    use: "了解重定向链可能出于多种原因很有用。从安全角度来看，长或复杂的重定向链可能是潜在安全风险的迹象，例如链中未加密的重定向。此外，重定向可能会影响网站性能和SEO，因为每个重定向都会引入额外的往返时间（RTT）。对于OSINT，了解重定向链可以帮助识别不同域名之间的关系或揭示某些技术或托管提供商的使用。",
    resources: [
      { title: 'HTTP重定向 - MDN', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections' },
      { title: 'URL重定向 - 维基百科', link: 'https://en.wikipedia.org/wiki/URL_redirection' },
      { title: '301重定向解释', link: 'https://ahrefs.com/blog/301-redirects/' },
    ],
    screenshot: 'https://i.ibb.co/hVVrmwh/wc-redirects.png',
  },
  {
    id: "txt-records",
    title: "TXT记录",
    description:
      "TXT记录是一种DNS记录类型，向域名外部的源提供文本信息。它们可用于多种目的，例如验证域名所有权、确保电子邮件安全，甚至防止对网站的未经授权的更改。",
    use: "TXT记录通常揭示与给定域名一起使用的外部服务和技术。它们可能披露有关域名电子邮件配置的详细信息、使用特定服务（如Google Workspace或Microsoft 365），或到位的安全措施（如SPF和DKIM）。了解这些详细信息可以提供有关组织使用的技术、其电子邮件安全实践和潜在漏洞的见解。",
    resources: [
      { title: 'TXT记录（通过Cloudflare学习）', link: 'https://www.cloudflare.com/learning/dns/dns-records/dns-txt-record/' },
      { title: 'TXT记录 - 维基百科', link: 'https://en.wikipedia.org/wiki/TXT_record' },
      { title: 'RFC-1464 - TXT记录', link: 'https://datatracker.ietf.org/doc/html/rfc1464' },
      { title: 'TXT记录查询（通过MxToolbox）', link: 'https://mxtoolbox.com/TXTLookup.aspx' },
    ],
    screenshot: 'https://i.ibb.co/wyt21QN/wc-txt-records.png',
  },
  {
    id: "status",
    title: "服务器状态",
    description: "检查服务器是否在线并响应请求。",
    use: "",
    resources: [
    ],
    screenshot: 'https://i.ibb.co/V9CNLBK/wc-status.png',
  },
  {
    id: "ports",
    title: "开放端口",
    description:
      "服务器上的开放端口是可用于与客户端建立连接的通信端点。每个端口对应于特定的服务或协议，例如HTTP（端口80）、HTTPS（端口443）、FTP（端口21）等。可以使用端口扫描等技术确定服务器上的开放端口。",
    use: "了解服务器上哪些端口是开放的可以提供有关在该服务器上运行的服务的有用信息，这对于了解系统的潜在漏洞或了解服务器提供的服务的性质很有用。",
    resources: [
      { title: 'TCP和UDP端口号列表', link: 'https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers' },
      { title: 'NMAP - 端口扫描基础', link: 'https://nmap.org/book/man-port-scanning-basics.html' },
    ],
    screenshot: 'https://i.ibb.co/F8D1hmf/wc-ports.png',
  },
  {
    id: "trace-route",
    title: "路由跟踪",
    description:
      "路由跟踪是一种网络诊断工具，用于实时跟踪信息包从一个系统到另一个系统所采用的路径。它记录路径上的每个跃点，提供有关路由器IP和每个点延迟的详细信息。",
    use: "在OSINT调查中，路由跟踪可以提供有关支持网站或服务的网络基础设施的路由路径和地理的见解。这可以帮助识别网络瓶颈、潜在的网络流量审查或操纵，并全面了解网络的结构和效率。此外，在路由跟踪期间收集的IP地址可以为进一步的OSINT调查提供额外的调查点。",
    resources: [
      "https://www.cloudflare.com/learning/network-layer/what-is-traceroute/",
      "https://tools.ietf.org/html/rfc1393",
      "https://en.wikipedia.org/wiki/Traceroute",
      "https://www.ripe.net/publications/docs/ripe-611",
    ],
    screenshot: 'https://i.ibb.co/M59qgxP/wc-trace-route.png',
  },
  {
    id: "carbon",
    title: "碳足迹",
    description:
      "此任务计算网站的估计碳足迹。它基于传输和处理的数据量，以及托管和交付网站的服务器的能源使用量。网站越大，其功能越复杂，其碳足迹可能就越高。",
    use: "从OSINT角度来看，了解网站的碳足迹并不能直接提供有关其内部工作或背后组织的见解。但是，在更广泛的分析中，它仍然可能是有价值的数据，特别是在环境影响是一个考虑因素的情况下。例如，它可能对对数字基础设施的可持续性感兴趣并希望让组织对其环境影响负责的活动家、研究人员或道德黑客有用。",
    resources: [
      { title: 'WebsiteCarbon - 碳计算器', link: 'https://www.websitecarbon.com/' },
      { title: '绿色网络基金会', link: 'https://www.thegreenwebfoundation.org/' },
      { title: '环保网络联盟', link: 'https://ecofriendlyweb.org/' },
      { title: 'Reset.org', link: 'https://en.reset.org/' },
      { title: '您的网站正在毁灭地球 - 通过Wired', link: 'https://www.wired.co.uk/article/internet-carbon-footprint' },
    ],
    screenshot: 'https://i.ibb.co/5v6fSyw/Screenshot-from-2023-07-29-19-07-50.png',
  },
  {
    id: "server-info",
    title: "服务器信息",
    description:
      "此任务检索有关托管目标网站的服务器的各种信息。这可能包括服务器类型（例如，Apache、Nginx）、托管提供商、自治系统号（ASN）等。该信息通常通过IP地址查找和HTTP响应标头分析的组合获得。",
    use: "在OSINT上下文中，服务器信息可以提供有关网站背后组织的有价值线索。例如，托管提供商的选择可能暗示组织运营的地理区域，而服务器类型可能提示组织使用的技术。ASN也可以用于查找同一组织托管的其他域名。",
    resources: [
      "https://en.wikipedia.org/wiki/List_of_HTTP_header_fields",
      "https://en.wikipedia.org/wiki/Autonomous_system_(Internet)",
      "https://tools.ietf.org/html/rfc7231#section-7.4.2",
      "https://builtwith.com/",
    ],
    screenshot: 'https://i.ibb.co/Mk1jx32/wc-server.png',
  },
  {
    id: "domain",
    title: "Whois查询",
    description:
      "此任务检索目标域名的Whois记录。Whois记录是丰富的信息来源，包括域名注册人的姓名和联系信息、域名的创建和到期日期、域名的名称服务器等。该信息通常通过对Whois数据库服务器的查询获得。",
    use: "在OSINT上下文中，Whois记录可以提供有关网站背后实体的有价值线索。它们可以显示域名首次注册的时间及其到期时间，这可以提供有关实体运营时间表的见解。联系信息虽然经常被编辑或匿名化，但有时可能导致额外的调查途径。名称服务器也可以用于链接同一实体拥有的多个域名。",
    resources: [
      "https://en.wikipedia.org/wiki/WHOIS",
      "https://www.icann.org/resources/pages/whois-2018-01-17-en",
      "https://whois.domaintools.com/",
    ],
    screenshot: 'https://i.ibb.co/89WLp14/wc-domain.png',
  },
  {
    id: "whois",
    title: "域名信息",
    description:
      "此任务检索目标域名的Whois记录。Whois记录是丰富的信息来源，包括域名注册人的姓名和联系信息、域名的创建和到期日期、域名的名称服务器等。该信息通常通过对Whois数据库服务器的查询获得。",
    use: "在OSINT上下文中，Whois记录可以提供有关网站背后实体的有价值线索。它们可以显示域名首次注册的时间及其到期时间，这可以提供有关实体运营时间表的见解。联系信息虽然经常被编辑或匿名化，但有时可能导致额外的调查途径。名称服务器也可以用于链接同一实体拥有的多个域名。",
    resources: [
      "https://en.wikipedia.org/wiki/WHOIS",
      "https://www.icann.org/resources/pages/whois-2018-01-17-en",
      "https://whois.domaintools.com/",
    ],
    screenshot: 'https://i.ibb.co/89WLp14/wc-domain.png',
  },
  {
    id: "dnssec",
    title: "DNS安全扩展",
    description:
      "如果没有DNSSEC，MITM攻击者可能会欺骗记录并将用户引导到钓鱼网站。这是因为DNS系统没有内置方法来验证对请求的响应是否被伪造，或者过程的任何其他部分是否被攻击者中断。DNS安全扩展（DNSSEC）通过使用公钥对DNS记录进行签名来保护DNS查找，以便浏览器可以检测响应是否被篡改。此问题的另一个解决方案是DoH（通过HTTPS的DNS）和DoT（通过TLD的DNS）。",
    use: "DNSSEC信息提供了有关组织网络安全成熟度和潜在漏洞的见解，特别是围绕DNS欺骗和缓存中毒。如果未实施DNS安全（DNSSEC、DoH、DoT等），这可能会为攻击者提供入口点。",
    resources: [
      "https://dnssec-analyzer.verisignlabs.com/",
      "https://www.cloudflare.com/dns/dnssec/how-dnssec-works/",
      "https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions",
      "https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en",
      "https://support.google.com/domains/answer/6147083",
      "https://www.internetsociety.org/resources/deploy360/2013/dnssec-test-sites/",
    ],
    screenshot: 'https://i.ibb.co/J54zVmQ/wc-dnssec.png',
  },
  {
    id: "features",
    title: "网站功能",
    description: "检查站点上存在哪些核心功能。如果功能被标记为已失效，这意味着它在加载时未被主动使用",
    use: "这对于了解站点能够做什么以及要查找哪些技术很有用",
    resources: [],
    screenshot: 'https://i.ibb.co/gP4P6kp/wc-features.png',
  },
  {
    id: "hsts",
    title: "HTTP严格传输安全",
    description: 'HTTP严格传输安全（HSTS）是一种Web安全策略机制，'
    +'有助于保护网站免受协议降级攻击和cookie劫持。网站可以通过符合一组要求然后将自己提交到列表中来包含在HSTS预加载列表中。',
    use: `站点启用HSTS有几个重要原因：
  1. 用户书签或手动输入http://example.com并受到中间人攻击者的攻击
    HSTS自动将目标域名的HTTP请求重定向到HTTPS
  2. 旨在纯HTTPS的Web应用程序意外地包含HTTP链接或通过HTTP提供内容
    HSTS自动将目标域名的HTTP请求重定向到HTTPS
  3. 中间人攻击者尝试使用无效证书拦截受害者用户的流量，并希望用户接受错误证书
    HSTS不允许用户覆盖无效证书消息
    `,
    resources: [
      'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
      'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html',
      'https://hstspreload.org/'
    ],
    screenshot: 'https://i.ibb.co/k253fq4/Screenshot-from-2023-07-17-20-10-52.png',
  },
  {
    id: 'dns-server',
    title: 'DNS服务器',
    description: '此检查确定请求的URL/IP解析到的DNS服务器。还会触发基本检查，以查看DNS服务器是否支持DoH，以及是否容易受到DNS缓存中毒的影响。',
    use: '',
    resources: [],
    screenshot: 'https://i.ibb.co/tKpL8F9/Screenshot-from-2023-08-12-15-43-12.png',
  },
  {
    id: 'tech-stack',
    title: '技术栈',
    description: '检查站点使用的技术构建。'
    + '这是通过获取和解析站点，然后将其与Wappalyzer维护的大量正则表达式列表进行比较，以识别不同技术留下的独特指纹来完成的。',
    use: '识别网站的技术栈有助于通过暴露潜在漏洞来评估其安全性，'
    + '为竞争性分析和开发决策提供信息，并可以指导有针对性的营销策略。'
    + '道德应用此知识对于避免数据盗窃或未经授权入侵等有害活动至关重要。',
    resources: [
      { title: 'Wappalyzer指纹', link: 'https://github.com/wappalyzer/wappalyzer/tree/master/src/technologies'},
      { title: 'BuiltWith - 检查站点使用的技术', link: 'https://builtwith.com/'},
    ],
    screenshot: 'https://i.ibb.co/bBQSQNz/Screenshot-from-2023-08-12-15-43-46.png',
  },
  {
    id: 'sitemap',
    title: '列出页面',
    description: '此作业查找并解析站点的列出站点地图。此文件列出了站点上作者希望搜索引擎抓取的公共子页面。站点地图有助于SEO，但也有助于快速查看站点的所有公共内容。',
    use: '了解站点面向公众的内容的结构，对于站点所有者，检查您的站点地图可访问、可解析并包含您希望它包含的所有内容。',
    resources: [
      { title: '了解站点地图', link: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview'},
      { title: '站点地图XML规范', link: 'https://www.sitemaps.org/protocol.html'},
      { title: '站点地图教程', link: 'https://www.conductor.com/academy/xml-sitemap/'},
    ],
    screenshot: 'https://i.ibb.co/GtrCQYq/Screenshot-from-2023-07-21-12-28-38.png',
  },
  {
    id: 'security-txt',
    title: 'Security.txt',
    description: "security.txt文件告诉研究人员他们如何负责任地披露在您的站点上发现的任何安全问题。"
    + "该标准在RFC 9116中提出，并指定此文件应包括联系点（电子邮件地址），"
    + "以及可选的其他信息，例如安全披露策略的链接、PGP密钥、首选语言、策略到期时间等。"
    + "该文件应位于您的域名的根目录，位于/security.txt或/.well-known/security.txt。",
    use: "这很重要，因为没有定义的联系点，安全研究人员可能无法报告关键的安全问题，"
    + "或者可能会使用不安全或可能是公共的渠道来这样做。从OSINT角度来看，您还可以收集有关站点的信息，包括"
    + "他们对安全的态度、其CSAF提供商以及PGP公钥的元数据。",
    resources: [
      { title: 'securitytxt.org', link: 'https://securitytxt.org/'},
      { title: 'RFC-9116提案', link: 'https://datatracker.ietf.org/doc/html/rfc9116'},
      { title: 'RFC-9116历史', link: 'https://datatracker.ietf.org/doc/rfc9116/'},
      { title: 'Security.txt（维基百科）', link: 'https://en.wikipedia.org/wiki/Security.txt'},
      { title: '示例security.txt（Cloudflare）', link: 'https://www.cloudflare.com/.well-known/security.txt'},
      { title: '创建security.txt的教程（Pieter Bakker）', link: 'https://pieterbakker.com/implementing-security-txt/'},
    ],
    screenshot: 'https://i.ibb.co/tq1FT5r/Screenshot-from-2023-07-24-20-31-21.png',
  },
  {
    id: 'linked-pages',
    title: '链接页面',
    description: '显示在站点上找到的所有内部和外部链接，通过附加到锚元素的href属性标识。',
    use: "对于站点所有者，这对于诊断SEO问题、改进站点结构、了解内容如何相互连接很有用。外部链接可以显示合作伙伴关系、依赖关系和潜在声誉风险。"
    + "从安全角度来看，出站链接可以帮助识别网站无意中链接到的任何潜在恶意或受损站点。分析内部链接可以帮助了解站点结构，并可能发现不打算公开的隐藏或易受攻击的页面。"
    + "对于OSINT调查员，它可以帮助全面了解目标，发现相关实体、资源，甚至站点的潜在隐藏部分。",
    resources: [
      { title: 'W3C链接检查器', link: 'https://validator.w3.org/checklink'},
    ],
    screenshot: 'https://i.ibb.co/LtK14XR/Screenshot-from-2023-07-29-11-16-44.png',
  },
  {
    id: 'social-tags',
    title: '社交标签',
    description: '网站可以包含某些元标签，告诉搜索引擎和社交媒体平台显示什么信息。这通常包括标题、描述、缩略图、关键字、作者、社交帐户等。',
    use: '将此数据添加到您的站点将提高SEO，作为OSINT研究人员，了解给定的Web应用程序如何描述自己很有用',
    resources: [
      { title: 'SocialSharePreview.com', link: 'https://socialsharepreview.com/'},
      { title: '社交元标签指南', link: 'https://css-tricks.com/essential-meta-tags-social-media/'},
      { title: 'Web.dev元数据标签', link: 'https://web.dev/learn/html/metadata/'},
      { title: '开放图协议', link: 'https://ogp.me/'},
      { title: 'Twitter卡片', link: 'https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards'},
      { title: 'Facebook开放图', link: 'https://developers.facebook.com/docs/sharing/webmasters'},
    ],
    screenshot: 'https://i.ibb.co/4srTT1w/Screenshot-from-2023-07-29-11-15-27.png',
  },
  {
    id: 'mail-config',
    title: '电子邮件配置',
    description: "DMARC（基于域名的消息身份验证、报告和一致性）：DMARC是一种电子邮件身份验证协议，与SPF和DKIM一起工作，以防止电子邮件欺骗和网络钓鱼。它允许域名所有者通过在DNS中发布的策略指定如何处理未经身份验证的邮件，并为接收邮件服务器提供一种向发送者发送有关电子邮件合规性反馈的方法。"
    + "BIMI（消息识别的品牌指示器）：BIMI是一种新兴的电子邮件标准，使组织能够在其客户的电子邮件客户端中自动显示徽标。BIMI将徽标链接到域名的DMARC记录，为收件人提供另一层视觉保证，确保电子邮件是合法的。"
    + "DKIM（域名密钥识别邮件）：DKIM是一种电子邮件安全标准，旨在确保消息在发送和接收服务器之间的传输中未被更改。它使用链接到发送者域名的数字签名来验证发送者并确保消息完整性。"
    + "SPF（发件人策略框架）：SPF是一种电子邮件身份验证方法，旨在防止电子邮件欺骗。它通过创建DNS记录来指定哪些邮件服务器被授权代表域名发送电子邮件。这有助于通过为接收邮件服务器提供一种检查来自域名的传入邮件是否来自该域名管理员授权的主机的方法来防止垃圾邮件。",
    use: "此信息对研究人员很有帮助，因为它有助于评估域名的电子邮件安全状况、发现潜在漏洞，并验证电子邮件的合法性以进行网络钓鱼检测。这些详细信息还可以提供有关托管环境、潜在服务提供商和目标组织配置模式的见解，有助于调查工作。",
    resources: [
      { title: 'DMARC、DKIM和SPF介绍（通过Cloudflare）', link: 'https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/' },
      { title: 'EasyDMARC域名扫描器', link: 'https://easydmarc.com/tools/domain-scanner' },
      { title: 'MX工具箱', link: 'https://mxtoolbox.com/' },
      { title: 'RFC-7208 - SPF', link: 'https://datatracker.ietf.org/doc/html/rfc7208' },
      { title: 'RFC-6376 - DKIM', link: 'https://datatracker.ietf.org/doc/html/rfc6376' },
      { title: 'RFC-7489 - DMARC', link: 'https://datatracker.ietf.org/doc/html/rfc7489' },
      { title: 'BIMI组', link: 'https://bimigroup.org/' },
    ],
    screenshot: 'https://i.ibb.co/yqhwx5G/Screenshot-from-2023-07-29-18-22-20.png',
  },
  {
    id: 'firewall',
    title: '防火墙检测',
    description: 'WAF或Web应用防火墙通过过滤和监视Web应用程序与Internet之间的HTTP流量来帮助保护Web应用程序。它通常保护Web应用程序免受跨站伪造、跨站脚本（XSS）、文件包含和SQL注入等攻击。',
    use: '了解站点是否使用WAF以及它使用哪种防火墙软件/服务很有用，因为这提供了有关站点对多种攻击向量的保护的见解，但也可能揭示防火墙本身的漏洞。',
    resources: [
      { title: '什么是WAF（通过Cloudflare学习）', link: 'https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/' },
      { title: 'OWASP - Web应用防火墙', link: 'https://owasp.org/www-community/Web_Application_Firewall' },
      { title: 'Web应用防火墙最佳实践', link: 'https://owasp.org/www-pdf-archive/Best_Practices_Guide_WAF_v104.en.pdf' },
      { title: 'WAF - 维基百科', link: 'https://en.wikipedia.org/wiki/Web_application_firewall' },
    ],
    screenshot: 'https://i.ibb.co/MfcxQt2/Screenshot-from-2023-08-12-15-40-52.png',
  },
  {
    id: 'http-security',
    title: 'HTTP安全功能',
    description: '正确配置的安全HTTP标头为站点添加了一层保护，以防止常见攻击。需要注意的主要标头是：'
    + 'HTTP严格传输安全（HSTS）：强制使用HTTPS，减轻中间人攻击和协议降级尝试。'
    + '内容安全策略（CSP）：限制网页资源以防止跨站脚本和数据注入攻击。'
    + 'X-Content-Type-Options：防止浏览器MIME嗅探响应偏离声明的内容类型，遏制MIME类型混淆攻击。'
    + 'X-Frame-Options：通过控制浏览器是否应在<frame>、<iframe>、<embed>或<object>中呈现页面来保护用户免受点击劫持攻击。',
    use: '审查安全标头很重要，因为它提供了有关站点防御态势和潜在漏洞的见解，从而能够主动缓解并确保符合安全最佳实践。',
    resources: [
      { title: 'OWASP安全标头项目', link: 'https://owasp.org/www-project-secure-headers/'},
      { title: 'HTTP标头备忘单', link: 'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html' },
      { title: 'content-security-policy.com', link: 'https://content-security-policy.com/' },
      { title: 'resourcepolicy.fyi', link: 'https://resourcepolicy.fyi/' },
      { title: 'HTTP安全标头', link: 'https://securityheaders.com/' },
      { title: 'Mozilla观测站', link: 'https://observatory.mozilla.org/' },
      { title: 'CSP文档', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
      { title: 'HSTS文档', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security' },
      { title: 'X-Content-Type-Options文档', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options' },
      { title: 'X-Frame-Options文档', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options' },
      { title: 'X-XSS-Protection文档', link: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection' },
    ],
    screenshot: 'https://i.ibb.co/LP05HMV/Screenshot-from-2023-08-12-15-40-28.png',
  },
  {
    id: 'archives',
    title: '存档历史',
    description: '从Wayback机器获取完整的存档历史',
    use: '这对于了解站点的历史以及它如何随时间变化很有用。它对于查找站点的旧版本或查找已删除的内容也很有用。',
    resources: [
      { title: 'Wayback机器', link: 'https://archive.org/web/'},
    ],
    screenshot: 'https://i.ibb.co/nB9szT1/Screenshot-from-2023-08-14-22-31-16.png',
  },
  {
    id: 'rank',
    title: '全球排名',
    description: '此检查显示请求站点的全球排名。这仅对排名前1亿的网站准确。我们使用来自Tranco项目的数据（见下文），该项目从Umbrella、Majestic、Quantcast、Chrome用户体验报告和Cloudflare Radar整理网络上的顶级站点。',
    use: '了解网站的整体全球排名对于了解站点的规模以及将其与其他站点进行比较很有用。它对于了解站点的相对流行度以及识别潜在趋势也很有用。',
    resources: [
      { title: 'Tranco列表', link: 'https://tranco-list.eu/' },
      { title: 'Tranco研究论文', link: 'https://tranco-list.eu/assets/tranco-ndss19.pdf'},
    ],
    screenshot: 'https://i.ibb.co/nkbczgb/Screenshot-from-2023-08-14-22-02-40.png',
  },
  {
    id: 'block-lists',
    title: '阻止检测',
    description: '使用10多个最流行的隐私、恶意软件和家长控制阻止DNS服务器检查对URL的访问。',
    use: '',
    resources: [
      { title: 'ThreatJammer列表', link: 'https://threatjammer.com/osint-lists'},
    ],
    screenshot: 'https://i.ibb.co/M5JSXbW/Screenshot-from-2023-08-26-12-12-43.png',
  },
  {
    id: 'threats',
    title: '恶意软件和网络钓鱼检测',
    description: '检查站点是否出现在多个常见的恶意软件和网络钓鱼列表中，以确定其威胁级别。',
    use: '了解站点是否被这些服务中的任何一个列为威胁对于了解站点的声誉和识别潜在趋势很有用。',
    resources: [
      { title: 'URLHaus', link: 'https://urlhaus-api.abuse.ch/'},
      { title: 'PhishTank', link: 'https://www.phishtank.com/'},
    ],
    screenshot: 'https://i.ibb.co/hYgy621/Screenshot-from-2023-08-26-12-07-47.png',
  },
  {
    id: 'tls-cipher-suites',
    title: 'TLS密码套件',
    description: '这些是服务器用于建立安全连接的加密算法组合。它包括密钥交换算法、批量加密算法、MAC算法和PRF（伪随机函数）。',
    use: '从安全角度来看，这是测试的重要信息。因为密码套件的安全性仅取决于它包含的算法。如果密码套件中的加密或身份验证算法版本具有已知漏洞，则密码套件和TLS连接可能容易受到降级或其他攻击',
    resources: [
      { title: 'sslscan2 CLI', link: 'https://github.com/rbsec/sslscan' },
      { title: 'ssl-enum-ciphers（NMAP脚本）', link: 'https://nmap.org/nsedoc/scripts/ssl-enum-ciphers.html' }
    ],
    screenshot: 'https://i.ibb.co/6ydtH5R/Screenshot-from-2023-08-26-12-09-58.png',
  },
  {
    id: 'tls-security-config',
    title: 'TLS安全配置',
    description: '这使用Mozilla TLS观测站的指南来检查TLS配置的安全性。它检查可能使站点容易受到攻击的错误配置，以及有关如何修复的建议。它还将提供有关过时和现代TLS配置的建议',
    use: '了解站点TLS配置的问题将帮助您解决潜在漏洞，并确保站点使用最新和最安全的TLS配置。',
    resources: [],
    screenshot: 'https://i.ibb.co/FmksZJt/Screenshot-from-2023-08-26-12-12-09.png',
  },
  {
    id: 'tls-client-support',
    title: 'TLS握手模拟',
    description: '这模拟不同客户端（浏览器、操作系统）如何与服务器执行TLS握手。它有助于识别兼容性问题和安全配置。',
    use: '',
    resources: [
      { title: 'TLS握手（通过Cloudflare学习）', link: 'https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/' },
      { title: 'SSL测试（通过SSL实验室）', link: 'https://www.ssllabs.com/ssltest/' },
    ],
    screenshot: 'https://i.ibb.co/F7qRZkh/Screenshot-from-2023-08-26-12-11-28.png',
  },
  {
    id: 'screenshot',
    title: '屏幕截图',
    description: '此检查截取请求的URL/IP解析到的网页的屏幕截图并显示它。',
    use: '这对于查看给定网站的样子很有用，不受浏览器、IP或位置的约束。',
    resources: [],
    screenshot: 'https://i.ibb.co/2F0x8kP/Screenshot-from-2023-07-29-18-34-48.png',
  },
];

// 功能介绍
export const featureIntro = [
  '在对给定网站或主机进行OSINT调查时，有几个关键领域需要查看。每个领域都在下面记录，以及可用于收集相关信息的工具和技术链接。',
  'Web-Check可以自动化收集此数据的过程，但解释结果和得出结论取决于您。',
];

// 关于
export const about = [
`Web-Check是一个功能强大的全能工具，用于发现有关网站/主机的信息。
核心理念很简单：向Web-Check提供URL，让它为您收集、整理和呈现广泛的开放数据供您深入研究。`,

`该报告突出了潜在的攻击向量、现有的安全措施，
以及站点架构内的连接网络。
结果还可以帮助优化服务器响应、配置重定向、
管理cookie或为您的站点微调DNS记录。`,

`因此，无论您是开发人员、系统管理员、安全研究员、渗透
测试人员，还是只是对发现给定站点的基础技术感兴趣
- 我相信您会发现这是您工具箱的有用补充。`,
];

// 许可证
export const license = `MIT许可证（MIT）
版权所有（c）Alicia Sykes <alicia@omg.com> 

特此免费授予任何获得本软件及其相关文档文件（"软件"）副本的人
不受限制地处理本软件的权利，包括但不限于使用、复制、修改、合并、发布、
分发、再许可和/或销售本软件副本的权利，并允许获得本软件的人员这样做，
但须遵守以下条件：

上述版权声明和本许可声明应包含在本软件的所有副本或
实质性部分中。

本软件按"原样"提供，不提供任何形式的明示或暗示保证，
包括但不限于对适销性、特定用途适用性和非侵权性的保证。
在任何情况下，作者或版权持有人均不对任何索赔、损害或其他责任负责，
无论是合同、侵权或其他方式的诉讼，由软件或软件的使用或其他
交易引起、产生或与之相关。`;

// 支持我们
export const supportUs = [
  "Web-Check可免费使用，不受限制。",
  "所有代码都是开源的，因此您也可以自由部署自己的实例，以及在私有和商业环境中分叉、修改和分发代码。",
  "运行web-check每个月确实需要花费我少量资金，因此如果您发现该应用程序有用，并且有能力，请考虑<a href='https://github.com/sponsors/Lissy93'>在GitHub上赞助我</a>。即使每月只有1美元或2美元，也将对支持正在进行的项目运行成本有很大帮助。",
  "否则，您还可以通过其他方式提供帮助，例如向<a href='https://github.com/Lissy93/web-check'>GitHub存储库</a>提交或审查拉取请求，在<a href='https://www.producthunt.com/posts/web-check'>Product Hunt</a>上为我们投票，或与您的网络分享。",
  "但不要觉得有义务做任何事情，因为此应用程序（以及我的所有其他项目）将始终保持100%免费和开源，我将尽最大努力确保托管实例尽可能长时间保持可用和可用：）",
];

// 公平使用
export const fairUse = [
  '请负责任地使用此工具。不要将其用于您没有权限扫描的主机。不要将其作为攻击或中断服务计划的一部分。',
  '请求可能会受到速率限制，以防止滥用。如果您需要更多带宽，请部署自己的实例。',
  '不保证正常运行时间或可用性。如果您需要确保服务可用，请部署自己的实例。',
  '请公平使用，因为过度使用会很快耗尽lambda函数积分，使服务对其他人不可用（和/或耗尽我的银行账户！）。',
];

export default docs;
