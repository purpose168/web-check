
import { Card } from 'web-check-live/components/Form/Card';
import Heading from 'web-check-live/components/Form/Heading';
import Row from 'web-check-live/components/Form/Row';
import colors from 'web-check-live/styles/colors';

// 卡片样式，包含small元素的样式定义
const cardStyles = `
  small {
    margin-top: 1rem;
    opacity: 0.5;
    display: block;
    a { color: ${colors.primary}; }
  }
`;

// DNS服务器信息卡片组件，用于显示DNS服务器的详细信息
const DnsServerCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  // 从props中获取DNS安全数据
  const dnsSecurity = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {dnsSecurity.dns.map((dns: any, index: number) => {
        return (<div key={`dns-${index}`}>
          {/* 如果有多个DNS服务器，显示每个服务器的标题 */}
          { dnsSecurity.dns.length > 1 && <Heading as="h4" size="small" color={colors.primary}>DNS服务器 #{index+1}</Heading> }
          {/* 显示DNS服务器的IP地址 */}
          <Row lbl="IP地址" val={dns.address} key={`ip-${index}`} />
          {/* 如果有主机名，显示主机名 */}
          { dns.hostname && <Row lbl="主机名" val={dns.hostname}  key={`host-${index}`} /> }
          {/* 显示DoH（DNS over HTTPS）支持状态 */}
          <Row lbl="DoH支持" val={dns.dohDirectSupports ? '✅ 是*' : '❌ 否*'} key={`doh-${index}`} />
        </div>);
      })}
      {/* 如果有DNS服务器数据，显示DoH支持的说明 */}
      {dnsSecurity.dns.length > 0 && (<small>
        * DoH支持是通过DNS服务器对DoH查询的响应来确定的。有时这会产生误报，也有可能DNS服务器支持DoH但不响应DoH查询。如果DNS服务器不支持DoH，仍可能通过使用DoH代理来使用DoH。
      </small>)}
    </Card>
  );
}

export default DnsServerCard;
