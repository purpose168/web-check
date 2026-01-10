
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

// 卡片样式定义，设置在线和离线状态的颜色
const cardStyles = `
span.val {
  &.up { color: ${colors.success}; }
  &.down { color: ${colors.danger}; }
}
`;

// 服务器状态卡片组件，用于显示服务器的在线状态和响应信息
const ServerStatusCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  // 从props中解构获取服务器状态数据
  const serverStatus = props.data;
  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title.toString()} actionButtons={props.actionButtons} styles={cardStyles}>
      <Row lbl="" val="">
        <span className="lbl">是否在线？</span>
        { serverStatus.isUp ? <span className="val up">✅ 在线</span> : <span className="val down">❌ 离线</span>}
      </Row>
      <Row lbl="状态码" val={serverStatus.responseCode} />
      { serverStatus.responseTime && <Row lbl="响应时间" val={`${Math.round(serverStatus.responseTime)}ms`} /> }
    </Card>
  );
}

export default ServerStatusCard;
