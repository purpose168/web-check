import type { ServerInfo } from 'web-check-live/utils/result-processor';
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

// 服务器信息卡片组件，用于显示服务器的详细信息
const ServerInfoCard = (props: { data: ServerInfo, title: string, actionButtons: any }): JSX.Element => {
  // 从props中解构获取服务器信息数据
  const info = props.data;
  // 从服务器信息中解构获取各个字段
  const { org, asn, isp, os, ports, ip, loc, type } = info;
  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { org && <Row lbl="组织" val={org} /> }
      { (isp && isp !== org) && <Row lbl="服务提供商" val={isp} /> }
      { os && <Row lbl="操作系统" val={os} /> }
      { asn && <Row lbl="ASN代码" val={asn} /> }
      { ports && <Row lbl="端口" val={ports} /> }
      { ip && <Row lbl="IP地址" val={ip} /> }
      { type && <Row lbl="类型" val={type} /> }
      { loc && <Row lbl="位置" val={loc} /> }
    </Card>
  );
}

export default ServerInfoCard;
