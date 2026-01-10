
// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Row from 'web-check-live/components/Form/Row';  // 行显示组件，用于显示标签-值对

// ==================== 组件样式 ====================
// 定义卡片样式，使其跨越两列宽度
const cardStyles = `
grid-column: span 2;  // 卡片在网格布局中跨越两列
span.val { max-width: 32rem !important; }  // 值的最大宽度为 32rem（约 512px）
span { overflow: hidden; }  // 超出时隐藏内容
`;

// ==================== TXT 记录卡片组件 ====================
// 显示目标域名的 DNS TXT 记录
// DNS TXT 记录用于存储文本信息，常用于：
// - SPF (Sender Policy Framework): 防止邮件欺诈
// - DKIM (DomainKeys Identified Mail): 邮件身份验证
// - DMARC (Domain-based Message Authentication, Reporting, and Conformance): 邮件认证策略
// - 验证域名所有权（如 Google Search Console）
// - 其他自定义文本信息
// Props 说明：
// - data: TXT 记录数据对象，键为记录名称，值为记录内容
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// - 所有 TXT 记录的名称和内容
// - 如果没有记录，显示 "No TXT Records" 消息
const TxtRecordCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const records = props.data;  // 获取 TXT 记录数据
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      { !records && <Row lbl="" val="No TXT Records" />}  {/* 如果没有记录，显示提示消息 */}
      {Object.keys(records).map((recordName: any, index: number) => {
        return (
          <Row lbl={recordName} val={records[recordName]} key={`${recordName}-${index}`} />  {/* 显示每条记录 */}
        );
      })}
    </Card>
  );
}

export default TxtRecordCard;
