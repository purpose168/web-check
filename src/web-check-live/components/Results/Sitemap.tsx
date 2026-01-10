
import { Card } from 'web-check-live/components/Form/Card';
import Row, { ExpandableRow } from 'web-check-live/components/Form/Row';
import colors from 'web-check-live/styles/colors';

const cardStyles = `
  max-height: 50rem;
  overflow-y: auto;
  a {
    color: ${colors.primary};
  }
  small {
    margin-top: 1rem;
    opacity: 0.5;
    display: block;
    a { color: ${colors.primary}; }
  }
`;

// ==================== 网站地图卡片组件 ====================
//显示网站的 sitemap.xml 文件内容
// sitemap.xml 是搜索引擎优化（SEO）的重要文件，列出网站的所有页面
// Props 说明：
// - data: sitemap 数据对象
//   - url: 普通网站地图的 URL 列表
//   - urlset.url: 网站地图 URL 集合
//   - sitemapindex.sitemap: 网站地图索引（包含多个 sitemap 文件）
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 普通网站地图：所有页面 URL 及其元数据（可展开）
// 2. 网站地图索引：所有子 sitemap 文件的链接
const SitemapCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  // 获取普通网站地图数据
  const normalSiteMap = props.data.url ||  props.data.urlset?.url || null;
  // 获取网站地图索引数据
  const siteMapIndex = props.data.sitemapindex?.sitemap || null;

  // ==================== 准备可展开行的数据 ====================
  // 从网站地图条目中提取元数据信息
  // 输入：单个网站地图条目对象
  // 输出：包含元数据的数组 [{lbl, val}, ...]
  const makeExpandableRowData = (site: any) => {
    const results = [];
    if (site.lastmod) { results.push({lbl: 'Last Modified', val: site.lastmod[0]}); }  // 最后修改时间
    if (site.changefreq) { results.push({lbl: 'Change Frequency', val: site.changefreq[0]}); }  // 更新频率
    if (site.priority) { results.push({lbl: 'Priority', val: site.priority[0]}); }  // 优先级
    return results;
  };

  // ==================== 从 URL 提取路径 ====================
  // 输入：完整的 URL 字符串
  // 输出：URL 的路径部分（不包含域名和协议）
  // 示例：
  // 输入："https://example.com/page/about"
  // 输出："/page/about"
  const getPathFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;  // 提取路径部分
    } catch (e) {
      return url;  // 如果 URL 格式无效，返回原始字符串
    }    
  };

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {/* 显示普通网站地图 */}
      {
        normalSiteMap && normalSiteMap.map((subpage: any, index: number) => {
          return (<ExpandableRow lbl={getPathFromUrl(subpage.loc[0])} key={index} val="" rowList={makeExpandableRowData(subpage)}></ExpandableRow>)
        })
      }
      
      {/* 如果是网站地图索引，显示提示信息 */}
      { siteMapIndex && <p>
        This site returns a sitemap index, which is a list of sitemaps.  
      </p>}
      
      {/* 显示网站地图索引中的所有子 sitemap 文件 */}
      {
        siteMapIndex && siteMapIndex.map((subpage: any, index: number) => {
          return (<Row lbl="" val="" key={index}><a href={subpage.loc[0]}>{getPathFromUrl(subpage.loc[0])}</a></Row>);
        })
      }
    </Card>
  );
}

export default SitemapCard;
