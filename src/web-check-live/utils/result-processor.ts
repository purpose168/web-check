// 导入RowProps类型，用于表单行组件的属性定义
import type { RowProps }  from 'web-check-live/components/Form/Row';

// 服务器位置信息接口
export interface ServerLocation {
  // 城市名称
  city: string,
  // 地区/州名称
  region: string,
  // 国家名称
  country: string,
  // 邮政编码
  postCode: string,
  // 地区/州代码
  regionCode: string,
  // 国家代码
  countryCode: string,
  // 地理坐标
  coords: {
    // 纬度
    latitude: number,
    // 经度
    longitude: number,
  },
  // 互联网服务提供商
  isp: string,
  // 时区
  timezone: string,
  // 语言
  languages: string,
  // 货币名称
  currency: string,
  // 货币代码
  currencyCode: string,
  // 国家顶级域名
  countryDomain: string,
  // 国家面积
  countryAreaSize: number,
  // 国家人口
  countryPopulation: number,
};

// Whois域名信息接口
export interface Whois {
  // 域名创建日期
  created: string,
  // 域名过期日期
  expires: string,
  // 域名更新日期
  updated: string,
  // 域名服务器列表
  nameservers: string[],
}

// 从API响应中提取服务器位置信息
export const getLocation = (response: any): ServerLocation => {
  return {
    city: response.city,
    region: response.region,
    country: response.country_name,
    postCode: response.postal,
    regionCode: response.region_code,
    countryCode: response.country_code,
    coords: {
      latitude: response.latitude,
      longitude: response.longitude,
    },
    isp: response.org,
    timezone: response.timezone,
    languages: response.languages,
    currencyCode: response.currency,
    currency: response.currency_name,
    countryDomain: response.country_tld,
    countryAreaSize: response.country_area,
    countryPopulation: response.country_population,
  };
};


// 服务器信息接口
export interface ServerInfo {
  // 组织名称
  org: string,
  // 自治系统号
  asn: string,
  // 互联网服务提供商
  isp: string,
  // 操作系统（可选）
  os?: string,
  // IP地址（可选）
  ip?: string,
  // 开放端口（可选）
  ports?: string,
  // 位置（可选）
  loc?: string,
  // 服务器类型/标签（可选）
  type?: string,
};

// 从API响应中提取服务器信息
export const getServerInfo = (response: any): ServerInfo => {
  return {
    org: response.org,
    asn: response.asn,
    isp: response.isp,
    os: response.os,
    ip: response.ip_str,
    ports: response?.ports?.toString(),
    loc: response.city ? `${response.city}, ${response.country_name}` : '',
    type: response.tags ? response.tags.toString() : '',
  };
};

// 主机名信息接口
export interface HostNames {
  // 域名列表
  domains: string[],
  // 主机名列表
  hostnames: string[],
};

// 从API响应中提取主机名信息
export const getHostNames = (response: any): HostNames | null => {
  const { hostnames, domains } = response;
  // 如果域名和主机名都为空，返回null
  if ((!domains || domains.length < 1) && (!hostnames || hostnames.length < 1)) {
    return null;
  }
  const results: HostNames = {
    domains: domains || [],
    hostnames: hostnames || [],
  };
  return results;
};

// Shodan查询结果接口
export interface ShodanResults {
  // 主机名信息
  hostnames: HostNames | null,
  // 服务器信息
  serverInfo: ServerInfo,
}

// 解析Shodan API响应
export const parseShodanResults = (response: any): ShodanResults => {
  return {
    hostnames: getHostNames(response),
    serverInfo: getServerInfo(response),
  };
}

// 技术栈信息接口
export interface Technology {
  // 技术分类
  Categories?: string[];
  // 父级技术
  Parent?: string;
  // 技术名称
  Name: string;
  // 技术描述
  Description: string;
  // 技术链接
  Link: string;
  // 技术标签
  Tag: string;
  // 首次检测时间
  FirstDetected: number;
  // 最后检测时间
  LastDetected: number;
  // 是否为高级功能
  IsPremium: string;
}

// 技术组接口
export interface TechnologyGroup {
  // 技术标签
  tag: string;
  // 技术列表
  technologies: Technology[];
}

// 构建技术栈分组
export const makeTechnologies = (response: any): TechnologyGroup[] => {
  // 将扁平化的技术数组按标签分组
  let flatArray = response.Results[0].Result.Paths
    .reduce((accumulator: any, obj: any) => accumulator.concat(obj.Technologies), []);
  // 按技术标签分组
  let technologies = flatArray.reduce((groups: any, item: any) => {
    let tag = item.Tag;
    if (!groups[tag]) groups[tag] = [];
    groups[tag].push(item);
    return groups;
  }, {});
  return technologies;
};

// Cookie信息类型
export type Cookie = {
  // Cookie名称
  name: string;
  // Cookie值
  value: string;
  // Cookie属性
  attributes: Record<string, string>;
};

// 解析robots.txt文件内容
export const parseRobotsTxt = (content: string): { robots: RowProps[] } => {
  // 按行分割内容
  const lines = content.split('\n');
  const rules: RowProps[] = [];

  // 遍历每一行
  lines.forEach(line => {
    // 去除首尾空白字符
    line = line.trim();

    // 匹配Allow或Disallow规则
    let match = line.match(/^(Allow|Disallow):\s*(\S*)$/i);
    if (match) {
      const rule: RowProps = {
        lbl: match[1],
        val: match[2],
      };

      rules.push(rule);
    } else {
      // 匹配User-agent规则
      match = line.match(/^(User-agent):\s*(\S*)$/i);
      if (match) {
        const rule: RowProps = {
          lbl: match[1],
          val: match[2],
        };

        rules.push(rule);
      }
    }
  });

  return { robots: rules };
}

// 应用Whois查询结果
export const applyWhoIsResults = (response: any) => {
  // 如果查询失败，返回错误信息
  if (response.status !== '0') {
    return {
      error: response.status_desc,
    }
  }
  // 提取Whois信息
  const whoIsResults: Whois = {
    created: response.date_created,
    expires: response.date_expires,
    updated: response.date_updated,
    nameservers: response.nameservers,
  };
  return whoIsResults;
}

