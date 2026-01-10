
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

// 卡片样式，定义值元素的颜色样式
const cardStyles = `
span.val {
  &.up { color: ${colors.success}; }
  &.down { color: ${colors.danger}; }
}
`;

// 域名查询信息卡片组件，用于显示域名的注册信息
const DomainLookupCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  // 从props中获取Internic域名数据
  const domain = props.data.internicData || {};
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {/* 显示注册域名 */}
      { domain.Domain_Name && <Row lbl="注册域名" val={domain.Domain_Name} /> }
      {/* 显示创建日期 */}
      { domain.Creation_Date && <Row lbl="创建日期" val={domain.Creation_Date} /> }
      {/* 显示更新日期 */}
      { domain.Updated_Date && <Row lbl="更新日期" val={domain.Updated_Date} /> }
      {/* 显示注册过期日期 */}
      { domain.Registry_Expiry_Date && <Row lbl="注册过期日期" val={domain.Registry_Expiry_Date} /> }
      {/* 显示注册域名ID */}
      { domain.Registry_Domain_ID && <Row lbl="注册域名ID" val={domain.Registry_Domain_ID} /> }
      {/* 显示注册商WHOIS服务器 */}
      { domain.Registrar_WHOIS_Server && <Row lbl="注册商WHOIS服务器" val={domain.Registrar_WHOIS_Server} /> }
      {/* 显示注册商信息（带链接） */}
      { domain.Registrar && <Row lbl="" val="">
        <span className="lbl">注册商</span>
        <span className="val"><a href={domain.Registrar_URL || '#'}>{domain.Registrar}</a></span>
      </Row> }
      {/* 显示注册商IANA ID */}
      { domain.Registrar_IANA_ID && <Row lbl="注册商IANA ID" val={domain.Registrar_IANA_ID} /> }
    </Card>
  );
}

export default DomainLookupCard;
