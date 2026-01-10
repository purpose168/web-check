// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片组件
import Row from 'web-check-live/components/Form/Row';  // 数据行组件
import Heading from 'web-check-live/components/Form/Heading';  // 标题组件
import colors from 'web-check-live/styles/colors';  // 颜色主题配置

// ==================== 卡片样式字符串 ====================
// 定义卡片组件的自定义样式
const cardStyles = `
  small { margin-top: 1rem; opacity: 0.5; }  // 小字文本样式：上边距和透明度
  a {
    color: ${colors.textColor};  // 链接使用文本颜色
  }
  details {
    // display: inline;  // 注释掉的代码
    display: flex;  // 使用 Flexbox 布局
    transition: all 0.2s ease-in-out;  // 平滑过渡动画
    h3 {
      display: inline;  // 标题内联显示
    }
    summary {
      padding: 0;  // 无内边距
      margin: 1rem 0 0 0;  // 上边距 1rem，其他 0
      cursor: pointer;  // 鼠标指针为手型
    }
    summary:before {
      content: "►";  // 折叠状态显示右箭头
      position: absolute;  // 绝对定位
      margin-left: -1rem;  // 左边距 -1rem
      color: ${colors.primary};  // 使用主题色
      cursor: pointer;  // 鼠标指针为手型
    }
    &[open] summary:before {
      content: "▼";  // 展开状态显示下箭头
    }
  }
`;

// ==================== 获取路径名称函数 ====================
// 从完整 URL 中提取路径部分
const getPathName = (link: string) => {
  try {
    const url = new URL(link);  // 创建 URL 对象
    return url.pathname;  // 返回路径部分
  } catch(e) {
    return link;  // 如果解析失败，返回原始链接
  }
};

// ==================== 内容链接卡片组件 ====================
// 显示页面的内部链接和外部链接
const ContentLinksCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const internal = props.data.internal || [];  // 获取内部链接列表（如果不存在则为空数组）
  const external = props.data.external || [];  // 获取外部链接列表（如果不存在则为空数组）
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      
      {/* 摘要部分 */}
      <Heading as="h3" size="small" color={colors.primary}>Summary</Heading>
      <Row lbl="Internal Link Count" val={internal.length} />  {/* 内部链接数量 */}
      <Row lbl="External Link Count" val={external.length} />  {/* 外部链接数量 */}
      
      {/* 内部链接列表（如果有） */}
      { internal && internal.length > 0 && (
        <details>
          <summary><Heading as="h3" size="small" color={colors.primary}>Internal Links</Heading></summary>
          {internal.map((link: string) => (
          <Row key={link} lbl="" val="">
            <a href={link} target="_blank" rel="noreferrer">{getPathName(link)}</a>  {/* 显示路径名称 */}
          </Row>
        ))}
        </details>
      )}
      
      {/* 外部链接列表（如果有） */}
      { external && external.length > 0 && (
        <details>
          <summary><Heading as="h3" size="small" color={colors.primary}>External Links</Heading></summary>
          {external.map((link: string) => (
          <Row key={link} lbl="" val="">
            <a href={link} target="_blank" rel="noreferrer">{link}</a>  {/* 显示完整链接 */}
          </Row>
        ))}
        </details>
      )}
    </Card>
  );
}

export default ContentLinksCard;  // 导出内容链接卡片组件
