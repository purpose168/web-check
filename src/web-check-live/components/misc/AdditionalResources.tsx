// ==================== 导入依赖 ====================
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';

// ==================== 资源列表外层容器样式组件 ====================
// 使用 Grid 布局显示外部工具资源列表
const ResourceListOuter = styled.ul`
list-style: none;  // 无列表样式
margin: 0;  // 无外边距
padding: 1rem;  // 内边距 1rem
display: grid;  // 使用 Grid 布局
gap: 0.5rem;  // 网格间距 0.5rem
grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr));  // 自适应列，最小宽度 19rem
li a.resource-wrap {
  display: flex;  // 使用 Flexbox 布局
  flex-direction: column;  // 垂直排列
  align-items: start;  // 左对齐
  gap: 0.25rem;  // 元素间距 0.25rem
  padding: 0.25rem 0.5rem;  // 内边距：上下 0.25rem，左右 0.5rem
  background: ${colors.background};  // 背景色
  border-radius: 8px;  // 圆角 8px
  text-decoration: none;  // 无下划线
  color: ${colors.textColor};  // 文本颜色
  height: 100%;  // 高度 100%

  transition: all 0.2s ease-in-out;  // 所有属性过渡动画 0.2秒
  cursor: pointer;  // 鼠标指针
  border: none;  // 无边框
  border-radius: 0.25rem;  // 圆角 0.25rem
  font-family: PTMono;  // 使用 PTMono 字体
  box-sizing: border-box;  // 盒模型包含边框和内边距
  width: -moz-available;  // Firefox 可用宽度
  box-shadow: 3px 3px 0px ${colors.backgroundDarker};  // 右下阴影
  &:hover {
    box-shadow: 5px 5px 0px ${colors.backgroundDarker};  // 悬停时阴影增大
    a { opacity: 1; }  // 悬停时链接不透明度 100%
  }
  &:active {
    box-shadow: -3px -3px 0px ${colors.fgShadowColor};  // 点击时阴影反向
  }
}
img {
  width: 2.5rem;  // 图片宽度 2.5rem
  border-radius: 4px;  // 圆角 4px
  margin: 0.25rem 0.1rem 0.1rem 0.1rem;  // 外边距
}
p, a {
  margin: 0;  // 无外边距
}
.resource-link {
  color: ${colors.primary};  // 主色调
  opacity: 0.75;  // 透明度 75%
  font-size: 0.9rem;  // 字体大小 0.9rem
  transition: all 0.2s ease-in-out;  // 所有属性过渡动画 0.2秒
  text-decoration: underline;  // 下划线
  cursor: pointer;  // 鼠标指针
}
.resource-title {
  font-weight: bold;  // 粗体
}
.resource-lower {
  display: flex;  // 使用 Flexbox 布局
  align-items: center;  // 垂直居中对齐
  gap: 0.5rem;  // 元素间距 0.5rem
}
.resource-details {
  max-width: 20rem;  // 最大宽度 20rem
  display: flex;  // 使用 Flexbox 布局
  flex-direction: column;  // 垂直排列
  gap: 0.1rem;  // 元素间距 0.1rem
  .resource-description {
    color: ${colors.textColorSecondary};  // 次要文本颜色
    font-size: 0.9rem;  // 字体大小 0.9rem
  }
}
`;

// ==================== 提示文本样式组件 ====================
// 显示免责声明和提示信息
const Note = styled.small`
  margin-top: 1rem;  // 上外边距 1rem
  opacity: 0.5;  // 透明度 50%
  display: block;  // 块级元素
  a { color: ${colors.primary}; }  // 链接颜色为主色调
`;

// ==================== 卡片样式字符串 ====================
// 定义资源卡片的通用样式
const CardStyles = `
  margin: 0 auto 1rem auto;  // 上下外边距：上 0，下 1rem，水平居中
  width: 95vw;  // 宽度为视口宽度的 95%
  position: relative;  // 相对定位
  transition: all 0.2s ease-in-out;  // 所有属性过渡动画 0.2秒
`;

// ==================== 外部工具资源列表 ====================
// 包含25个用于进一步研究的在线工具
const resources = [
  {
    title: 'Hudson Rock',  // Hudson Rock - 识别信息窃取感染数据
    link: 'https://hudsonrock.com/free-tools/?=webcheck',
    icon: 'https://i.ibb.co/0rF3rZh/logo-1-967abb2c.png',
    description: 'Identify Infostealer infection data related to domains and emails',
  },
  {
    title: 'SSL Labs Test',  // SSL Labs 测试 - 分析 SSL 配置并评分
    link: 'https://ssllabs.com/ssltest/analyze.html',
    icon: 'https://i.ibb.co/6bVL8JK/Qualys-ssl-labs.png',
    description: 'Analyzes the SSL configuration of a server and grades it',
    searchLink: 'https://www.ssllabs.com/ssltest/analyze.html?d={URL}',
  },
  {
    title: 'Virus Total',  // Virus Total - 多引擎病毒扫描
    link: 'https://virustotal.com',
    icon: 'https://i.ibb.co/dWFz0RC/Virustotal.png',
    description: 'Checks a URL against multiple antivirus engines',
    searchLink: 'https://www.virustotal.com/gui/search/{URL_ENCODED}',
  },
  {
    title: 'Shodan',  // Shodan - 互联网连接设备搜索引擎
    link: 'https://shodan.io/',
    icon: 'https://i.ibb.co/SBZ8WG4/shodan.png',
    description: 'Search engine for Internet-connected devices',
    searchLink: 'https://www.shodan.io/search/report?query={URL}',
  },
  {
    title: 'Archive',  // Archive - 互联网档案馆
    link: 'https://archive.org/',
    icon: 'https://i.ibb.co/nfKMvCm/Archive-org.png',
    description: 'View previous versions of a site via the Internet Archive',
    searchLink: 'https://web.archive.org/web/*/{URL}',
  },
  {
    title: 'URLScan',  // URLScan - URL 扫描和分析
    link: 'https://urlscan.io/',
    icon: 'https://i.ibb.co/cYXt8SH/Url-scan.png',
    description: 'Scans a URL and provides information about the page',
    searchLink: 'https://urlscan.io/search/#{URL}',
  },
  {
    title: 'Sucuri SiteCheck',  // Sucuri 网站检查 - 黑名单和威胁检测
    link: 'https://sitecheck.sucuri.net/',
    icon: 'https://i.ibb.co/K5pTP1K/Sucuri-site-check.png',
    description: 'Checks a URL against blacklists and known threats',
    searchLink: 'https://www.ssllabs.com/ssltest/analyze.html?d={URL}',
  },
  {
    title: 'Domain Tools',  // Domain Tools - WhoIs 查询
    link: 'https://whois.domaintools.com/',
    icon: 'https://i.ibb.co/zJfCKjM/Domain-tools.png',
    description: 'Run a WhoIs lookup on a domain',
    searchLink: 'https://whois.domaintools.com/{DOMAIN}',
  },
  {
    title: 'NS Lookup',  // NS Lookup - DNS 记录查询
    link: 'https://nslookup.io/',
    icon: 'https://i.ibb.co/BLSWvBv/Ns-lookup.png',
    description: 'View DNS records for a domain',
    searchLink: 'https://www.nslookup.io/domains/{DOMAIN}/dns-records/',
  },
  {
    title: 'DNS Checker',  // DNS Checker - 全球 DNS 传播检查
    link: 'https://dnschecker.org/',
    icon: 'https://i.ibb.co/gyKtgZ1/Dns-checker.webp',
    description: 'Check global DNS propagation across multiple servers',
    searchLink: 'https://dnschecker.org/#A/{DOMAIN}',
  },
  {
    title: 'Censys',  // Censys - 主机查找
    link: 'https://search.censys.io/',
    icon: 'https://i.ibb.co/j3ZtXzM/censys.png',
    description: 'Lookup hosts associated with a domain',
    searchLink: 'https://search.censys.io/search?resource=hosts&q={URL}',
  },
  {
    title: 'Page Speed Insights',  // Page Speed Insights - 页面性能分析
    link: 'https://developers.google.com/speed/pagespeed/insights/',
    icon: 'https://i.ibb.co/k68t9bb/Page-speed-insights.png',
    description: 'Checks the performance, accessibility and SEO of a page on mobile + desktop',
    searchLink: 'https://developers.google.com/speed/pagespeed/insights/?url={URL}',
  },
  {
    title: 'Built With',  // Built With - 技术栈识别
    link: 'https://builtwith.com/',
    icon: 'https://i.ibb.co/5LXBDfD/Built-with.png',
    description: 'View the tech stack of a website',
    searchLink: 'https://builtwith.com/{URL}',
  },
  {
    title: 'DNS Dumpster',  // DNS Dumpster - DNS 侦察工具
    link: 'https://dnsdumpster.com/',
    icon: 'https://i.ibb.co/DtQ2QXP/Trash-can-regular.png',
    description: 'DNS recon tool, to map out a domain from it\'s DNS records',
  },
  {
    title: 'BGP Tools',  // BGP Tools - 实时 BGP 数据
    link: 'https://bgp.tools/',
    icon: 'https://i.ibb.co/zhcSnmh/Bgp-tools.png',
    description: 'View realtime BGP data for any ASN, Prefix or DNS',
    searchLink: 'https://bgp.tools/dns/{URL}',
  },
  {
    title: 'Similar Web',  // Similar Web - 流量和参与度统计
    link: 'https://similarweb.com/',
    icon: 'https://i.ibb.co/9YX8x3c/Similar-web.png',
    description: 'View approx traffic and engagement stats for a website',
    searchLink: 'https://similarweb.com/website/{URL}',
  },
  {
    title: 'Blacklist Checker',  // Blacklist Checker - 黑名单检查
    link: 'https://blacklistchecker.com/',
    icon: 'https://i.ibb.co/7ygCyz3/black-list-checker.png',
    description: 'Check if a domain, IP or email is present on the top blacklists',
    searchLink: 'https://blacklistchecker.com/check?input={URL}',
  },
  {
    title: 'Cloudflare Radar',  // Cloudflare Radar - 流量来源位置
    link: 'https://radar.cloudflare.com/',
    icon: 'https://i.ibb.co/DGZXRgh/Cloudflare.png',
    description: 'View traffic source locations for a domain through Cloudflare',
    searchLink: 'https://radar.cloudflare.com/domains/domain/{URL}',
  },
  {
    title: 'Mozilla HTTP Observatory',  // Mozilla HTTP Observatory - 网站安全评估
    link: 'https://developer.mozilla.org/en-US/observatory',
    icon: 'https://i.ibb.co/hBWh9cj/logo-mozm-5e95c457fdd1.png',
    description: 'Assesses website security posture by analyzing various security headers and practices',
    searchLink: 'https://developer.mozilla.org/en-US/observatory/analyze?host={URL}',
  },
  {
    title: 'AbuseIPDB',  // AbuseIPDB - IP 滥用检查
    link: 'https://abuseipdb.com/',
    icon: 'https://i.ibb.co/KLZncxw/abuseipdb.png',
    description: 'Checks a website against Zscaler\'s dynamic risk scoring engine',
    searchLink: 'https://www.abuseipdb.com/check?query={DOMAIN}',
  },
  {
    title: 'IBM X-Force Exchange',  // IBM X-Force Exchange - 威胁情报
    link: 'https://exchange.xforce.ibmcloud.com/',
    icon: 'https://i.ibb.co/tsTsCV5/x-force.png',
    description: 'View shared human and machine generated threat intelligence',
    searchLink: 'https://exchange.xforce.ibmcloud.com/url/{URL_ENCODED}',
  },
  {
    title: 'URLVoid',  // URLVoid - 网站声誉检查
    link: 'https://urlvoid.com/',
    icon: 'https://i.ibb.co/0ZDjCDz/urlvoid-icon.png',
    description: 'Checks a website across 30+ blocklist engines and website reputation services',
    searchLink: 'https://urlvoid.com/scan/{DOMAIN}',
  },
  {
    title: 'URLhaus',  // URLhaus - 恶意 URL 数据库
    link: 'https://urlhaus.abuse.ch/',
    icon: 'https://i.ibb.co/j3QwrT8/urlhaus-logo.png',
    description: 'Checks if the site is in URLhaus\'s malware URL exchange',
    searchLink: 'https://urlhaus.abuse.ch/browse.php?search={URL_ENCODED}',
  },
  {
    title: 'ANY.RUN',  // ANY.RUN - 交互式恶意软件沙箱
    link: 'https://any.run/',
    icon: 'https://i.ibb.co/6nLw2MC/anyrun-icon.png',
    description: 'An interactive malware and web sandbox',
  },
];

// ==================== 生成链接函数 ====================
// 根据资源配置和扫描 URL 生成最终链接
// 支持三种占位符：{URL}、{URL_ENCODED}、{DOMAIN}
const makeLink = (resource: any, scanUrl: string | undefined): string => {
  return (scanUrl && resource.searchLink) ? 
    resource.searchLink
      .replaceAll('{URL}', scanUrl.replace(/(https?:\/\/)?/i, ''))  // 移除协议前缀
      .replaceAll('{URL_ENCODED}', encodeURIComponent(scanUrl.replace(/(https?:\/\/)?/i, '')).replace(/['\.*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`))  // URL 编码
      .replaceAll('{DOMAIN}', scanUrl.replace(/(https?:\/\/)?(www.)?/i, '').replace(/(\/.*)/i, ''))  // 提取域名
    : resource.link;  // 如果没有搜索链接，返回默认链接
};

// ==================== 附加资源组件 ====================
// 显示外部工具资源列表，支持 URL 搜索
const AdditionalResources = (props: { url?: string }): JSX.Element => {
  return (<Card heading="External Tools for Further Research" styles={CardStyles}>
    <ResourceListOuter>
      {
        resources.map((resource, index) => {
          return (
            <li key={index}>
              <a className="resource-wrap" target="_blank" rel="noreferrer" href={makeLink(resource, props.url)}>
                <p className="resource-title">{resource.title}</p>
                <span className="resource-link" onClick={()=> window.open(resource.link, '_blank')} title={`Open: ${resource.link}`}>
                  {new URL(resource.link).hostname}
                </span>
                <div className="resource-lower">
                  <img src={resource.icon} alt="" />
                  <div className="resource-details">
                    <p className="resource-description">{resource.description}</p>
                  </div>
                </div>
              </a>
            </li>
          );
        })
      }
    </ResourceListOuter>
    <Note>
      These tools are not affiliated with Web-Check. Please use them at your own risk.<br />
      At the time of listing, all of the above were available and free to use
      - if this changes, please report it via GitHub (<a href="https://github.com/lissy93/web-check">lissy93/web-check</a>).
    </Note>
  </Card>);
}

export default AdditionalResources;
