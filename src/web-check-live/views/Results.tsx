import { useState, useEffect, useCallback, type ReactNode } from 'react'; // 导入React的类型和钩子
import { useParams, useLocation } from 'react-router-dom'; // 导入路由相关组件和钩子
import styled from '@emotion/styled'; // 导入样式化组件库
import { ToastContainer } from 'react-toastify'; // 导入通知容器组件
import Masonry from 'react-masonry-css' // 导入瀑布流布局组件

import colors from 'web-check-live/styles/colors'; // 导入颜色配置
import Heading from 'web-check-live/components/Form/Heading'; // 导入标题组件
import Modal from 'web-check-live/components/Form/Modal'; // 导入模态框组件
import Footer from 'web-check-live/components/misc/Footer'; // 导入页脚组件
import Nav from 'web-check-live/components/Form/Nav'; // 导入导航组件
import type { RowProps }  from 'web-check-live/components/Form/Row'; // 导入行属性类型

import Loader from 'web-check-live/components/misc/Loader'; // 导入加载器组件
import ErrorBoundary from 'web-check-live/components/misc/ErrorBoundary'; // 导入错误边界组件
import SelfScanMsg from 'web-check-live/components/misc/SelfScanMsg'; // 导入自扫描消息组件
import DocContent from 'web-check-live/components/misc/DocContent'; // 导入文档内容组件
import ProgressBar, { type LoadingJob, type LoadingState, initialJobs } from 'web-check-live/components/misc/ProgressBar'; // 导入进度条组件
import ActionButtons from 'web-check-live/components/misc/ActionButtons'; // 导入操作按钮组件
import AdditionalResources from 'web-check-live/components/misc/AdditionalResources'; // 导入附加资源组件
import ViewRaw from 'web-check-live/components/misc/ViewRaw'; // 导入查看原始数据组件

import ServerLocationCard from 'web-check-live/components/Results/ServerLocation'; // 导入服务器位置卡片组件
import ServerInfoCard from 'web-check-live/components/Results/ServerInfo'; // 导入服务器信息卡片组件
import HostNamesCard from 'web-check-live/components/Results/HostNames'; // 导入主机名卡片组件
import WhoIsCard from 'web-check-live/components/Results/WhoIs'; // 导入WhoIs卡片组件
import LighthouseCard from 'web-check-live/components/Results/Lighthouse'; // 导入Lighthouse卡片组件
import ScreenshotCard from 'web-check-live/components/Results/Screenshot'; // 导入截图卡片组件
import SslCertCard from 'web-check-live/components/Results/SslCert'; // 导入SSL证书卡片组件
import HeadersCard from 'web-check-live/components/Results/Headers'; // 导入HTTP头卡片组件
import CookiesCard from 'web-check-live/components/Results/Cookies'; // 导入Cookie卡片组件
import RobotsTxtCard from 'web-check-live/components/Results/RobotsTxt'; // 导入Robots.txt卡片组件
import DnsRecordsCard from 'web-check-live/components/Results/DnsRecords'; // 导入DNS记录卡片组件
import RedirectsCard from 'web-check-live/components/Results/Redirects'; // 导入重定向卡片组件
import TxtRecordCard from 'web-check-live/components/Results/TxtRecords'; // 导入TXT记录卡片组件
import ServerStatusCard from 'web-check-live/components/Results/ServerStatus'; // 导入服务器状态卡片组件
import OpenPortsCard from 'web-check-live/components/Results/OpenPorts'; // 导入开放端口卡片组件
import TraceRouteCard from 'web-check-live/components/Results/TraceRoute'; // 导入路由跟踪卡片组件
import CarbonFootprintCard from 'web-check-live/components/Results/CarbonFootprint'; // 导入碳足迹卡片组件
import SiteFeaturesCard from 'web-check-live/components/Results/SiteFeatures'; // 导入网站功能卡片组件
import DnsSecCard from 'web-check-live/components/Results/DnsSec'; // 导入DNSSEC卡片组件
import HstsCard from 'web-check-live/components/Results/Hsts'; // 导入HSTS卡片组件
import SitemapCard from 'web-check-live/components/Results/Sitemap'; // 导入站点地图卡片组件
import DomainLookup from 'web-check-live/components/Results/DomainLookup'; // 导入域名查询组件
import DnsServerCard from 'web-check-live/components/Results/DnsServer'; // 导入DNS服务器卡片组件
import TechStackCard from 'web-check-live/components/Results/TechStack'; // 导入技术栈卡片组件
import SecurityTxtCard from 'web-check-live/components/Results/SecurityTxt'; // 导入安全文本卡片组件
import ContentLinksCard from 'web-check-live/components/Results/ContentLinks'; // 导入内容链接卡片组件
import SocialTagsCard from 'web-check-live/components/Results/SocialTags'; // 导入社交标签卡片组件
import MailConfigCard from 'web-check-live/components/Results/MailConfig'; // 导入邮件配置卡片组件
import HttpSecurityCard from 'web-check-live/components/Results/HttpSecurity'; // 导入HTTP安全卡片组件
import FirewallCard from 'web-check-live/components/Results/Firewall'; // 导入防火墙卡片组件
import ArchivesCard from 'web-check-live/components/Results/Archives'; // 导入存档卡片组件
import RankCard from 'web-check-live/components/Results/Rank'; // 导入排名卡片组件
import BlockListsCard from 'web-check-live/components/Results/BlockLists'; // 导入黑名单卡片组件
import ThreatsCard from 'web-check-live/components/Results/Threats'; // 导入威胁卡片组件
import TlsCipherSuitesCard from 'web-check-live/components/Results/TlsCipherSuites'; // 导入TLS密码套件卡片组件
import TlsIssueAnalysisCard from 'web-check-live/components/Results/TlsIssueAnalysis'; // 导入TLS问题分析卡片组件
import TlsClientSupportCard from 'web-check-live/components/Results/TlsClientSupport'; // 导入TLS客户端支持卡片组件

import keys from 'web-check-live/utils/get-keys'; // 导入密钥获取工具
import { determineAddressType, type AddressType } from 'web-check-live/utils/address-type-checker'; // 导入地址类型检测工具
import useMotherHook from 'web-check-live/hooks/motherOfAllHooks'; // 导入主钩子
import {
  getLocation, type ServerLocation, // 导入位置获取工具和类型
  type Cookie, // 导入Cookie类型
  applyWhoIsResults, type Whois, // 导入WhoIs结果应用工具和类型
  parseShodanResults, type ShodanResults // 导入Shodan结果解析工具和类型
} from 'web-check-live/utils/result-processor';

const ResultsOuter = styled.div` // 结果外层容器样式
  display: flex; // 使用弹性布局
  flex-direction: column; // 垂直方向排列
  .masonry-grid { // 瀑布流网格样式
    display: flex; // 使用弹性布局
    width: auto; // 宽度自动
  }
  .masonry-grid-col section { margin: 1rem 0.5rem; } // 瀑布流网格列章节样式
`;

const ResultsContent = styled.section` // 结果内容区域样式
  width: 95vw; // 宽度为视口宽度的95%
  display: grid; // 使用网格布局
  grid-auto-flow: dense; // 密集填充
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); // 自适应列
  gap: 1rem; // 间距1rem
  margin: auto; // 自动居中
  width: calc(100% - 2rem); // 宽度计算
  padding-bottom: 1rem; // 底部内边距1rem
`;

const FilterButtons = styled.div` // 过滤按钮容器样式
  width: 95vw; // 宽度为视口宽度的95%
  margin: auto; // 自动居中
  display: flex; // 使用弹性布局
  flex-wrap: wrap; // 允许换行
  justify-content: space-between; // 两端对齐
  gap: 1rem; // 间距1rem
  .one-half { // 一半容器样式
    display: flex; // 使用弹性布局
    flex-wrap: wrap; // 允许换行
    gap: 1rem; // 间距1rem
    align-items: center; // 垂直居中
  }
  button, input, .toggle-filters { // 按钮、输入框和切换过滤器样式
    background: ${colors.backgroundLighter}; // 背景色
    color: ${colors.textColor}; // 文本颜色
    border: none; // 无边框
    border-radius: 4px; // 圆角4像素
    font-family: 'PTMono'; // 字体
    padding: 0.25rem 0.5rem; // 内边距
    border: 1px solid transparent; // 透明边框
    transition: all 0.2s ease-in-out; // 过渡动画0.2秒
  }
  button, .toggle-filters { // 按钮和切换过滤器样式
    cursor: pointer; // 鼠标指针
    text-transform: capitalize; // 首字母大写
    box-shadow: 2px 2px 0px ${colors.bgShadowColor}; // 阴影效果
    transition: all 0.2s ease-in-out; // 过渡动画0.2秒
    &:hover { // 悬停状态
      box-shadow: 4px 4px 0px ${colors.bgShadowColor}; // 阴影效果增强
      color: ${colors.primary}; // 使用主色调
    }
    &.selected { // 选中状态
      border: 1px solid ${colors.primary}; // 主色调边框
      color: ${colors.primary}; // 使用主色调
    }
  }
  input:focus { // 输入框聚焦状态
    border: 1px solid ${colors.primary}; // 主色调边框
    outline: none; // 无轮廓
  }
  .clear { // 清除按钮样式
    color: ${colors.textColor}; // 文本颜色
    text-decoration: underline; // 下划线
    cursor: pointer; // 鼠标指针
    font-size: 0.8rem; // 字体大小0.8rem
    opacity: 0.8; // 透明度0.8
  }
  .toggle-filters  { // 切换过滤器样式
    font-size: 0.8rem; // 字体大小0.8rem
  }
  .control-options { // 控制选项样式
    display: flex; // 使用弹性布局
    flex-wrap: wrap; // 允许换行
    gap: 1rem; // 间距1rem
    align-items: center; // 垂直居中
    a { // 链接样式
      text-decoration: none; // 无下划线
    }
  }
`;

const Results = (props: { address?: string } ): JSX.Element => { // 结果页面组件
  const startTime = new Date().getTime(); // 获取开始时间

  const address = props.address || useParams().urlToScan || ''; // 获取地址

  const [ addressType, setAddressType ] = useState<AddressType>('empt'); // 地址类型状态

  const [loadingJobs, setLoadingJobs] = useState<LoadingJob[]>(initialJobs); // 加载任务状态
  const [modalOpen, setModalOpen] = useState(false); // 模态框打开状态
  const [modalContent, setModalContent] = useState<ReactNode>(<></>); // 模态框内容状态
  const [showFilters, setShowFilters] = useState(false); // 显示过滤器状态
  const [searchTerm, setSearchTerm] = useState<string>(''); // 搜索词状态
  const [tags, setTags] = useState<string[]>([]); // 标签状态

  const clearFilters = () => { // 清除过滤器函数
    setTags([]); // 清空标签
    setSearchTerm(''); // 清空搜索词
  };
  const updateTags = (tag: string) => { // 更新标签函数
    // 如果标签存在则移除，否则添加
    // setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
    setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [tag]); // 单选模式
  };

  const updateLoadingJobs = useCallback((jobs: string | string[], newState: LoadingState, error?: string, retry?: () => void, data?: any) => { // 更新加载任务函数
    (typeof jobs === 'string' ? [jobs] : jobs).forEach((job: string) => { // 遍历任务
    const now = new Date(); // 获取当前时间
    const timeTaken = now.getTime() - startTime; // 计算耗时
    setLoadingJobs((prevJobs) => { // 更新加载任务状态
      const newJobs = prevJobs.map((loadingJob: LoadingJob) => { // 映射任务
        if (job.includes(loadingJob.name)) { // 如果任务名称匹配
          return { ...loadingJob, error, state: newState, timeTaken, retry }; // 更新任务状态
        }
        return loadingJob; // 返回原任务
      });

      const timeString = `[${now.getHours().toString().padStart(2, '0')}:` // 时间字符串
        +`${now.getMinutes().toString().padStart(2, '0')}:`
        + `${now.getSeconds().toString().padStart(2, '0')}]`;


      if (newState === 'success') { // 如果成功
        console.log( // 输出成功日志
          `%c获取成功 - ${job}%c\n\n${timeString}%c ${job} 任务在 ${timeTaken}ms 内成功完成`
          + `\n%c运行 %cwindow.webCheck['${job}']%c 以检查原始结果`,
          `background:${colors.success};color:${colors.background};padding: 4px 8px;font-size:16px;`,
          `font-weight: bold; color: ${colors.success};`,
          `color: ${colors.success};`,
          `color: #1d8242;`,`color: #1d8242;text-decoration:underline;`,`color: #1d8242;`,
        );
        if (!(window as any).webCheck) (window as any).webCheck = {}; // 初始化全局对象
        if (data) (window as any).webCheck[job] = data; // 保存数据到全局对象
      }
  
      if (newState === 'error') { // 如果错误
        console.log( // 输出错误日志
          `%c获取错误 - ${job}%c\n\n${timeString}%c ${job} 任务失败 `
          +`在 ${timeTaken}ms 后，出现以下错误:%c\n${error}`,
          `background: ${colors.danger}; color:${colors.background}; padding: 4px 8px; font-size: 16px;`,
          `font-weight: bold; color: ${colors.danger};`,
          `color: ${colors.danger};`,
          `color: ${colors.warning};`,
        );
      }

      if (newState === 'timed-out') { // 如果超时
        console.log( // 输出超时日志
          `%c获取超时 - ${job}%c\n\n${timeString}%c ${job} 任务超时 `
          +`在 ${timeTaken}ms 后，出现以下错误:%c\n${error}`,
          `background: ${colors.info}; color:${colors.background}; padding: 4px 8px; font-size: 16px;`,
          `font-weight: bold; color: ${colors.info};`,
          `color: ${colors.info};`,
          `color: ${colors.warning};`,
        );
      }

      return newJobs; // 返回新任务列表
    });
  });
  }, [startTime]); // 依赖startTime

  const parseJson = (response: Response): Promise<any> => { // 解析JSON函数
    return new Promise((resolve) => { // 返回Promise
        response.json() // 解析JSON
          .then(data => resolve(data)) // 解析成功
          .catch(error => resolve( // 解析失败
            { error: `获取有效响应失败 😢\n`
            + '这可能是由于目标未暴露所需数据，'
            + '或运行此Web Check实例的基础设施施加的限制。\n\n'
            + `错误信息:\n${error}`}
          ));
    });
  };

  const urlTypeOnly = ['url'] as AddressType[]; // 仅URL类型，许多任务只使用这些地址类型

  const api = import.meta.env.PUBLIC_API_ENDPOINT || '/api'; // API托管位置
  
  // 获取并解析给定URL的IP地址
  const [ipAddress, setIpAddress] = useMotherHook({
    jobId: 'get-ip', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/get-ip?url=${address}`) // 获取请求
    .then(res => parseJson(res)) // 解析JSON
    .then(res => res.ip), // 提取IP地址
  });

  useEffect(() => { // 副作用钩子
    if (!addressType || addressType === 'empt') { // 如果地址类型为空
      setAddressType(determineAddressType(address || '')); // 确定地址类型
    }
    if (addressType === 'ipV4' && address) { // 如果是IPv4地址
      setIpAddress(address); // 设置IP地址
    }
  }, [address, addressType, setIpAddress]); // 依赖项

  // 获取IP地址位置信息
  const [locationResults, updateLocationResults] = useMotherHook<ServerLocation>({
    jobId: 'location', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address: ipAddress, addressType: 'ipV4', expectedAddressTypes: ['ipV4', 'ipV6'] }, // 地址信息
    fetchRequest: () => fetch(`https://ipapi.co/${ipAddress}/json/`) // 获取请求
      .then(res => parseJson(res)) // 解析JSON
      .then(res => getLocation(res)), // 获取位置信息
  });

  // 获取并解析SSL证书信息
  const [sslResults, updateSslResults] = useMotherHook({
    jobId: 'ssl', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/ssl?url=${address}`).then((res) => parseJson(res)), // 获取请求
  });

  // 对域名执行手动whois查询
  const [domainLookupResults, updateDomainLookupResults] = useMotherHook({
    jobId: 'domain', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/whois?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取并解析Lighthouse性能数据
  const [lighthouseResults, updateLighthouseResults] = useMotherHook({
    jobId: 'quality', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/quality?url=${address}`) // 获取请求
      .then(res => parseJson(res)) // 解析JSON
      .then(res => res?.lighthouseResult || { error: res.error || '无数据' }), // 提取Lighthouse结果
  });

  // 使用Wappalyzer获取构建网站所使用的技术
  const [techStackResults, updateTechStackResults] = useMotherHook({
    jobId: 'tech-stack', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/tech-stack?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从Shodan获取主机名和关联域名
  const [shoadnResults, updateShodanResults] = useMotherHook<ShodanResults>({
    jobId: ['hosts', 'server-info'], // 任务ID列表
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address: ipAddress, addressType: 'ipV4', expectedAddressTypes: ['ipV4', 'ipV6'] }, // 地址信息
    fetchRequest: () => fetch(`https://api.shodan.io/shodan/host/${ipAddress}?key=${keys.shodan}`) // 获取请求
      .then(res => parseJson(res)) // 解析JSON
      .then(res => parseShodanResults(res)), // 解析Shodan结果
  });

  // 获取并解析Cookie信息
  const [cookieResults, updateCookieResults] = useMotherHook<{cookies: Cookie[]}>({
    jobId: 'cookies', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/cookies?url=${address}`) // 获取请求
      .then(res => parseJson(res)), // 解析JSON
  });

  // 获取并解析响应头
  const [headersResults, updateHeadersResults] = useMotherHook({
    jobId: 'headers', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/headers?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取并解析DNS记录
  const [dnsResults, updateDnsResults] = useMotherHook({
    jobId: 'dns', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/dns?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取HTTP安全信息
  const [httpSecurityResults, updateHttpSecurityResults] = useMotherHook({
    jobId: 'http-security', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/http-security?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从网站社交元标签获取社交媒体预览
  const [socialTagResults, updateSocialTagResults] = useMotherHook({
    jobId: 'social-tags', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/social-tags?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取给定主机名的路由追踪
  const [traceRouteResults, updateTraceRouteResults] = useMotherHook({
    jobId: 'trace-route', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/trace-route?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从站点地图获取网站列出的页面
  const [securityTxtResults, updateSecurityTxtResults] = useMotherHook({
    jobId: 'security-txt', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/security-txt?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取域名的DNS服务器并测试DoH/DoT支持
  const [dnsServerResults, updateDnsServerResults] = useMotherHook({
    jobId: 'dns-server', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/dns-server?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取网站的WAF和防火墙信息
  const [firewallResults, updateFirewallResults] = useMotherHook({
    jobId: 'firewall', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/firewall?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取DNSSEC信息
  const [dnsSecResults, updateDnsSecResults] = useMotherHook({
    jobId: 'dnssec', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/dnssec?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 检查网站是否在HSTS预加载列表中
  const [hstsResults, updateHstsResults] = useMotherHook({
    jobId: 'hsts', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/hsts?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 检查主机是否在URLHaus恶意软件列表中
  const [threatResults, updateThreatResults] = useMotherHook({
    jobId: 'threats', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/threats?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 基于DNS记录获取服务器邮件配置
  const [mailConfigResults, updateMailConfigResults] = useMotherHook({
    jobId: 'mail-config', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/mail-config?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从Wayback Machine获取存档列表
  const [archivesResults, updateArchivesResults] = useMotherHook({
    jobId: 'archives', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/archives?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从Tranco获取网站全球排名
  const [rankResults, updateRankResults] = useMotherHook({
    jobId: 'rank', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/rank?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 截取网站截图
  const [screenshotResult, updateScreenshotResult] = useMotherHook({
    jobId: 'screenshot', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/screenshot?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从Mozilla Observatory获取TLS安全信息
  const [tlsResults, updateTlsResults] = useMotherHook({
    jobId: ['tls-cipher-suites', 'tls-security-config', 'tls-client-support'], // 任务ID列表
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/tls?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取URL重定向
  const [redirectResults, updateRedirectResults] = useMotherHook({
    jobId: 'redirects', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/redirects?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取页面内容中包含的链接列表
  const [linkedPagesResults, updateLinkedPagesResults] = useMotherHook({
    jobId: 'linked-pages', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/linked-pages?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从robots.txt获取并解析爬取规则
  const [robotsTxtResults, updateRobotsTxtResults] = useMotherHook<{robots: RowProps[]}>({
    jobId: 'robots-txt', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/robots-txt?url=${address}`) // 获取请求
      .then(res => parseJson(res)), // 解析JSON
  });

  // 获取服务器当前状态和响应时间
  const [serverStatusResults, updateServerStatusResults] = useMotherHook({
    jobId: 'status', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/status?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 检查开放端口
  const [portsResults, updatePortsResults] = useMotherHook({
    jobId: 'ports', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address: ipAddress, addressType: 'ipV4', expectedAddressTypes: ['ipV4', 'ipV6'] }, // 地址信息
    fetchRequest: () => fetch(`${api}/ports?url=${ipAddress}`) // 获取请求
      .then(res => parseJson(res)), // 解析JSON
  });

  // 获取并解析域名whois结果
  const [whoIsResults, updateWhoIsResults] = useMotherHook<Whois | { error: string }>({
    jobId: 'whois', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`https://api.whoapi.com/?domain=${address}&r=whois&apikey=${keys.whoApi}`) // 获取请求
      .then(res => parseJson(res)) // 解析JSON
      .then(res => applyWhoIsResults(res)), // 应用whois结果
  });

  // 获取DNS TXT记录
  const [txtRecordResults, updateTxtRecordResults] = useMotherHook({
    jobId: 'txt-records', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/txt-records?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 对照DNS黑名单检查网站
  const [blockListsResults, updateBlockListsResults] = useMotherHook({
    jobId: 'block-lists', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/block-lists?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从站点地图获取网站列出的页面
  const [sitemapResults, updateSitemapResults] = useMotherHook({
    jobId: 'sitemap', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/sitemap?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 获取给定站点的碳足迹数据
  const [carbonResults, updateCarbonResults] = useMotherHook({
    jobId: 'carbon', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/carbon?url=${address}`).then(res => parseJson(res)), // 获取请求
  });

  // 从BuiltWith获取网站功能
  const [siteFeaturesResults, updateSiteFeaturesResults] = useMotherHook({
    jobId: 'features', // 任务ID
    updateLoadingJobs, // 更新加载任务函数
    addressInfo: { address, addressType, expectedAddressTypes: urlTypeOnly }, // 地址信息
    fetchRequest: () => fetch(`${api}/features?url=${address}`) // 获取请求
    .then(res => parseJson(res)) // 解析JSON
    .then(res => {
      if (res.Errors && res.Errors.length > 0) { // 如果有错误
        return { error: `未返回数据，因为 ${res.Errors[0].Message || 'API查询失败'}` }; // 返回错误信息
      }
      return res; // 返回结果
    }),
  });

  /* 10秒超时后取消剩余任务 */
  useEffect(() => { // 副作用钩子
    const checkJobs = () => { // 检查任务函数
      loadingJobs.forEach(job => { // 遍历任务
        if (job.state === 'loading') { // 如果任务正在加载
          updateLoadingJobs(job.name, 'timed-out'); // 更新任务状态为超时
        }
      });
    };
    const timeoutId = setTimeout(checkJobs, 10000); // 设置10秒超时
    return () => { // 清理函数
      clearTimeout(timeoutId); // 清除超时
    };
  }, [loadingJobs, updateLoadingJobs]); // 依赖项

  const makeSiteName = (address: string): string => { // 生成网站名称函数
    try {
      return new URL(address).hostname.replace('www.', ''); // 返回主机名并移除www.
    } catch (error) {
      return address; // 返回原始地址
    }
  }

  // 每个卡片的状态数据、对应组件和标题列表
  const resultCardData = [
    {
      id: 'location', // 卡片ID
      title: '服务器位置', // 标题
      result: locationResults, // 结果
      Component: ServerLocationCard, // 组件
      refresh: updateLocationResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'ssl', // 卡片ID
      title: 'SSL证书', // 标题
      result: sslResults, // 结果
      Component: SslCertCard, // 组件
      refresh: updateSslResults, // 刷新函数
      tags: ['server', 'security'], // 标签
    }, {
      id: 'domain', // 卡片ID
      title: '域名Whois', // 标题
      result: domainLookupResults, // 结果
      Component: DomainLookup, // 组件
      refresh: updateDomainLookupResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'quality', // 卡片ID
      title: '质量摘要', // 标题
      result: lighthouseResults, // 结果
      Component: LighthouseCard, // 组件
      refresh: updateLighthouseResults, // 刷新函数
      tags: ['client'], // 标签
    }, {
      id: 'tech-stack', // 卡片ID
      title: '技术栈', // 标题
      result: techStackResults, // 结果
      Component: TechStackCard, // 组件
      refresh: updateTechStackResults, // 刷新函数
      tags: ['client', 'meta'], // 标签
    }, {
      id: 'server-info', // 卡片ID
      title: '服务器信息', // 标题
      result: shoadnResults?.serverInfo, // 结果
      Component: ServerInfoCard, // 组件
      refresh: updateShodanResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'cookies', // 卡片ID
      title: 'Cookies', // 标题
      result: cookieResults, // 结果
      Component: CookiesCard, // 组件
      refresh: updateCookieResults, // 刷新函数
      tags: ['client', 'security'], // 标签
    }, {
      id: 'headers', // 卡片ID
      title: '响应头', // 标题
      result: headersResults, // 结果
      Component: HeadersCard, // 组件
      refresh: updateHeadersResults, // 刷新函数
      tags: ['client', 'security'], // 标签
    }, {
      id: 'dns', // 卡片ID
      title: 'DNS记录', // 标题
      result: dnsResults, // 结果
      Component: DnsRecordsCard, // 组件
      refresh: updateDnsResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'hosts', // 卡片ID
      title: '主机名', // 标题
      result: shoadnResults?.hostnames, // 结果
      Component: HostNamesCard, // 组件
      refresh: updateShodanResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'http-security', // 卡片ID
      title: 'HTTP安全', // 标题
      result: httpSecurityResults, // 结果
      Component: HttpSecurityCard, // 组件
      refresh: updateHttpSecurityResults, // 刷新函数
      tags: ['security'], // 标签
    }, {
      id: 'social-tags', // 卡片ID
      title: '社交标签', // 标题
      result: socialTagResults, // 结果
      Component: SocialTagsCard, // 组件
      refresh: updateSocialTagResults, // 刷新函数
      tags: ['client', 'meta'], // 标签
    }, {
      id: 'trace-route', // 卡片ID
      title: '路由追踪', // 标题
      result: traceRouteResults, // 结果
      Component: TraceRouteCard, // 组件
      refresh: updateTraceRouteResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'security-txt', // 卡片ID
      title: '安全声明', // 标题
      result: securityTxtResults, // 结果
      Component: SecurityTxtCard, // 组件
      refresh: updateSecurityTxtResults, // 刷新函数
      tags: ['security'], // 标签
    }, {
      id: 'dns-server', // 卡片ID
      title: 'DNS服务器', // 标题
      result: dnsServerResults, // 结果
      Component: DnsServerCard, // 组件
      refresh: updateDnsServerResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'firewall', // 卡片ID
      title: '防火墙', // 标题
      result: firewallResults, // 结果
      Component: FirewallCard, // 组件
      refresh: updateFirewallResults, // 刷新函数
      tags: ['server', 'security'], // 标签
    }, {
      id: 'dnssec', // 卡片ID
      title: 'DNSSEC', // 标题
      result: dnsSecResults, // 结果
      Component: DnsSecCard, // 组件
      refresh: updateDnsSecResults, // 刷新函数
      tags: ['security'], // 标签
    }, {
      id: 'hsts', // 卡片ID
      title: 'HSTS检查', // 标题
      result: hstsResults, // 结果
      Component: HstsCard, // 组件
      refresh: updateHstsResults, // 刷新函数
      tags: ['security'], // 标签
    }, {
      id: 'threats', // 卡片ID
      title: '威胁', // 标题
      result: threatResults, // 结果
      Component: ThreatsCard, // 组件
      refresh: updateThreatResults, // 刷新函数
      tags: ['security'], // 标签
    }, {
      id: 'mail-config', // 卡片ID
      title: '邮件配置', // 标题
      result: mailConfigResults, // 结果
      Component: MailConfigCard, // 组件
      refresh: updateMailConfigResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'archives', // 卡片ID
      title: '存档历史', // 标题
      result: archivesResults, // 结果
      Component: ArchivesCard, // 组件
      refresh: updateArchivesResults, // 刷新函数
      tags: ['meta'], // 标签
    }, {
      id: 'rank', // 卡片ID
      title: '全球排名', // 标题
      result: rankResults, // 结果
      Component: RankCard, // 组件
      refresh: updateRankResults, // 刷新函数
      tags: ['meta'], // 标签
    }, {
      id: 'screenshot', // 卡片ID
      title: '截图', // 标题
      result: screenshotResult || lighthouseResults?.fullPageScreenshot?.screenshot, // 结果
      Component: ScreenshotCard, // 组件
      refresh: updateScreenshotResult, // 刷新函数
      tags: ['client', 'meta'], // 标签
    }, {
      id: 'tls-cipher-suites', // 卡片ID
      title: 'TLS密码套件', // 标题
      result: tlsResults, // 结果
      Component: TlsCipherSuitesCard, // 组件
      refresh: updateTlsResults, // 刷新函数
      tags: ['server', 'security'], // 标签
    }, {
      id: 'tls-security-config', // 卡片ID
      title: 'TLS安全问题', // 标题
      result: tlsResults, // 结果
      Component: TlsIssueAnalysisCard, // 组件
      refresh: updateTlsResults, // 刷新函数
      tags: ['security'], // 标签
    }, {
      id: 'tls-client-support', // 卡片ID
      title: 'TLS握手模拟', // 标题
      result: tlsResults, // 结果
      Component: TlsClientSupportCard, // 组件
      refresh: updateTlsResults, // 刷新函数
      tags: ['security'], // 标签
    }, {
      id: 'redirects', // 卡片ID
      title: '重定向', // 标题
      result: redirectResults, // 结果
      Component: RedirectsCard, // 组件
      refresh: updateRedirectResults, // 刷新函数
      tags: ['meta'], // 标签
    }, {
      id: 'linked-pages', // 卡片ID
      title: '链接页面', // 标题
      result: linkedPagesResults, // 结果
      Component: ContentLinksCard, // 组件
      refresh: updateLinkedPagesResults, // 刷新函数
      tags: ['client', 'meta'], // 标签
    }, {
      id: 'robots-txt', // 卡片ID
      title: '爬取规则', // 标题
      result: robotsTxtResults, // 结果
      Component: RobotsTxtCard, // 组件
      refresh: updateRobotsTxtResults, // 刷新函数
      tags: ['meta'], // 标签
    }, {
      id: 'status', // 卡片ID
      title: '服务器状态', // 标题
      result: serverStatusResults, // 结果
      Component: ServerStatusCard, // 组件
      refresh: updateServerStatusResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'ports', // 卡片ID
      title: '开放端口', // 标题
      result: portsResults, // 结果
      Component: OpenPortsCard, // 组件
      refresh: updatePortsResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'whois', // 卡片ID
      title: '域名信息', // 标题
      result: whoIsResults, // 结果
      Component: WhoIsCard, // 组件
      refresh: updateWhoIsResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'txt-records', // 卡片ID
      title: 'TXT记录', // 标题
      result: txtRecordResults, // 结果
      Component: TxtRecordCard, // 组件
      refresh: updateTxtRecordResults, // 刷新函数
      tags: ['server'], // 标签
    }, {
      id: 'block-lists', // 卡片ID
      title: '阻止列表', // 标题
      result: blockListsResults, // 结果
      Component: BlockListsCard, // 组件
      refresh: updateBlockListsResults, // 刷新函数
      tags: ['security', 'meta'], // 标签
    }, {
      id: 'features', // 卡片ID
      title: '网站功能', // 标题
      result: siteFeaturesResults, // 结果
      Component: SiteFeaturesCard, // 组件
      refresh: updateSiteFeaturesResults, // 刷新函数
      tags: ['meta'], // 标签
    }, {
      id: 'sitemap', // 卡片ID
      title: '页面', // 标题
      result: sitemapResults, // 结果
      Component: SitemapCard, // 组件
      refresh: updateSitemapResults, // 刷新函数
      tags: ['meta'], // 标签
    }, {
      id: 'carbon', // 卡片ID
      title: '碳足迹', // 标题
      result: carbonResults, // 结果
      Component: CarbonFootprintCard, // 组件
      refresh: updateCarbonResults, // 刷新函数
      tags: ['meta'], // 标签
    },
  ];

  const makeActionButtons = (title: string, refresh: () => void, showInfo: (id: string) => void): ReactNode => { // 生成操作按钮函数
    const actions = [ // 操作列表
      { label: `关于 ${title} 的信息`, onClick: showInfo, icon: 'ⓘ'}, // 信息按钮
      { label: `重新获取 ${title} 数据`, onClick: refresh, icon: '↻'}, // 刷新按钮
    ];
    return (
      <ActionButtons actions={actions} /> // 操作按钮组件
    );
  };

  const showInfo = (id: string) => { // 显示信息函数
    setModalContent(DocContent(id)); // 设置模态框内容
    setModalOpen(true); // 打开模态框
  };

  const showErrorModal = (content: ReactNode) => { // 显示错误模态框函数
    setModalContent(content); // 设置模态框内容
    setModalOpen(true); // 打开模态框
  };
  
  return (
    <ResultsOuter>
      <Nav>
      { address && // 如果有地址
        <Heading color={colors.textColor} size="medium">
          { addressType === 'url' && <a target="_blank" rel="noreferrer" href={address}><img width="32px" src={`https://icon.horse/icon/${makeSiteName(address)}`} alt="" /></a> }
          {makeSiteName(address)}
        </Heading>
        }
      </Nav>
      <ProgressBar loadStatus={loadingJobs} showModal={showErrorModal} showJobDocs={showInfo} /> // 进度条
      {/* { address?.includes(window?.location?.hostname || 'web-check.xyz') && <SelfScanMsg />} */}
      <Loader show={loadingJobs.filter((job: LoadingJob) => job.state !== 'loading').length < 5} /> // 加载器
      <FilterButtons>{ showFilters ? <> // 过滤按钮
        <div className="one-half">
        <span className="group-label">按以下方式过滤</span>
        {['server', 'client', 'meta'].map((tag: string) => ( // 映射标签
          <button
            key={tag}
            className={tags.includes(tag) ? 'selected' : ''} // 如果标签已选中则添加selected类
            onClick={() => updateTags(tag)}> // 更新标签
              {tag}
          </button>
        ))}
        {(tags.length > 0 || searchTerm.length > 0) && <span onClick={clearFilters} className="clear">清除过滤器</span> }
        </div>
        <div className="one-half">
        <span className="group-label">搜索</span>
        <input 
          type="text" 
          placeholder="过滤结果" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} // 设置搜索词
        />
        <span className="toggle-filters" onClick={() => setShowFilters(false)}>隐藏</span>
        </div>
        </> : (
          <div className="control-options">
            <span className="toggle-filters" onClick={() => setShowFilters(true)}>显示过滤器</span>
            <a href="#view-download-raw-data"><span className="toggle-filters">导出数据</span></a>
            <a href="/about"><span className="toggle-filters">了解结果</span></a>
            <a href="/about#additional-resources"><span className="toggle-filters">更多工具</span></a>
            <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check"><span className="toggle-filters">查看GitHub</span></a>
          </div>
      ) }
      </FilterButtons>
      <ResultsContent>
        <Masonry
          breakpointCols={{ 10000: 12, 4000: 9, 3600: 8, 3200: 7, 2800: 6, 2400: 5, 2000: 4, 1600: 3, 1200: 2, 800: 1 }} // 断点列数
          className="masonry-grid"
          columnClassName="masonry-grid-col">
          {
            resultCardData
            .map(({ id, title, result, tags, refresh, Component }, index: number) => { // 映射卡片数据
              const show = (tags.length === 0 || tags.some(tag => tags.includes(tag))) // 显示条件
              && title.toLowerCase().includes(searchTerm.toLowerCase()) // 包含搜索词
              && (result && !result.error); // 有结果且无错误
              return show ? ( // 如果显示
                <ErrorBoundary title={title} key={`eb-${index}`}> // 错误边界
                  <Component
                    key={`${title}-${index}`}
                    data={{...result}} // 传递数据
                    title={title}
                    actionButtons={refresh ? makeActionButtons(title, refresh, () => showInfo(id)) : undefined} // 操作按钮
                  />
                </ErrorBoundary>
            ) : null}) // 否则返回null
          }
          </Masonry>
      </ResultsContent>
      <ViewRaw everything={resultCardData} /> // 查看原始数据
      <AdditionalResources url={address} /> // 附加资源
      <Footer /> // 页脚
      <Modal isOpen={modalOpen} closeModal={()=> setModalOpen(false)}>{modalContent}</Modal> // 模态框
      <ToastContainer limit={3} draggablePercent={60} autoClose={2500} theme="dark" position="bottom-right" /> // 通知容器
    </ResultsOuter>
  );
}

export default Results;
