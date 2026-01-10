// ==================== 导入依赖 ====================
import styled from '@emotion/styled';  // Emotion 样式库
import colors from 'web-check-live/styles/colors';  // 颜色主题配置
import { Card } from 'web-check-live/components/Form/Card';  // 卡片组件
import Row from 'web-check-live/components/Form/Row';  // 数据行组件

// ==================== 说明文本样式组件 ====================
// 用于显示额外的说明信息和链接
const Note = styled.small`
opacity: 0.5;  // 50% 不透明度
display: block;  // 块级显示
margin-top: 0.5rem;  // 上边距
a {
  color: ${colors.primary};  // 链接使用主题色
}
`;

// ==================== 存档卡片组件 ====================
// 显示页面的历史扫描信息和存档数据
const ArchivesCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const data = props.data;  // 解构数据对象
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {/* 首次扫描时间 */}
      <Row lbl="First Scan" val={data.firstScan} />
      
      {/* 最后扫描时间 */}
      <Row lbl="Last Scan" val={data.lastScan} />
      
      {/* 总扫描次数 */}
      <Row lbl="Total Scans" val={data.totalScans} />
      
      {/* 变更次数 */}
      <Row lbl="Change Count" val={data.changeCount} />
      
      {/* 平均页面大小（字节） */}
      <Row lbl="Avg Size" val={`${data.averagePageSize} bytes`} />
      
      {/* 扫描频率：根据每天扫描次数或扫描间隔天数显示 */}
      { data.scanFrequency?.scansPerDay > 1 ?
        <Row lbl="Avg Scans Per Day" val={data.scanFrequency.scansPerDay} /> :  // 平均每天扫描次数
        <Row lbl="Avg Days between Scans" val={data.scanFrequency.daysBetweenScans} />  // 平均扫描间隔天数
      }

      {/* 说明文本：提供查看历史版本的链接 */}
      <Note>
        View historical versions of this page <a rel="noreferrer" target="_blank" href={`https://web.archive.org/web/*/${data.scanUrl}`}>here</a>,
        via the Internet Archive's Wayback Machine.
      </Note>
    </Card>
  );
}

export default ArchivesCard;  // 导出存档卡片组件
