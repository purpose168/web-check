// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件，用于包装内容并提供标题和操作按钮
import Row from 'web-check-live/components/Form/Row';  // 行显示组件，用于显示标签-值对
import type { ReactNode } from 'react';  // React 节点类型定义

// ==================== HTTP 头信息卡片组件 ====================
// 显示目标网站返回的所有 HTTP 响应头
// HTTP 头信息包含：
// - 内容类型（Content-Type）
// - 服务器信息（Server）
// - 缓存策略（Cache-Control）
// - 安全相关头（X-Frame-Options, X-XSS-Protection 等）
// - 日期和过期时间（Date, Expires 等）
// - 其他元数据
const HeadersCard = (props: { data: any, title: string, actionButtons: ReactNode }): JSX.Element => {
  const headers = props.data;  // 解构 HTTP 头数据对象
  
  return (
    <Card 
      heading={props.title}  // 卡片标题
      styles="grid-row: span 2;"  // 样式：在网格布局中跨越两行高度
      actionButtons={props.actionButtons}  // 操作按钮
    >
      {
        // 遍历所有 HTTP 头，逐行显示
        Object.keys(headers).map((header: string, index: number) => {
          return (
            <Row 
              key={`header-${index}`}  // 唯一键值，使用索引确保唯一性
              lbl={header}  // 头名称（标签）
              val={headers[header]}  // 头值
            />
          )
        })
      }      
    </Card>
  );
}

export default HeadersCard;
