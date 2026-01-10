// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件，用于包装内容并提供标题和操作按钮
import Row, { ListRow }  from 'web-check-live/components/Form/Row';  // 行显示组件，用于显示标签-值对和列表数据

// ==================== 组件样式 ====================
// 定义卡片样式，使其跨越两行高度，并设置内容区域的最大高度和滚动行为
const styles = `
  grid-row: span 2;  // 卡片在网格布局中跨越两行
  .content {
    max-height: 50rem;  // 内容区域最大高度为 50rem（约 800px）
    overflow-x: hidden;  // 隐藏水平滚动条
    overflow-y: auto;  // 内容超出时显示垂直滚动条
  }
`;

// ==================== DNS 记录卡片组件 ====================
// 显示目标域名的各种 DNS 记录类型
// DNS 记录类型说明：
// - A: IPv4 地址记录，将域名映射到 IPv4 地址
// - AAAA: IPv6 地址记录，将域名映射到 IPv6 地址
// - MX: 邮件交换记录，指定处理该域名邮件的邮件服务器
// - CNAME: 别名记录，将域名指向另一个域名
// - NS: 名称服务器记录，指定该域名的权威 DNS 服务器
// - PTR: 反向 DNS 记录，将 IP 地址映射回域名
// - SOA: 授权起始记录，包含该域名的管理信息
const DnsRecordsCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const dnsRecords = props.data;  // 解构 DNS 记录数据对象
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={styles}>
      <div className="content">
        {/* A 记录：IPv4 地址 */}
        { dnsRecords.A && <Row lbl="A" val={dnsRecords.A.address} /> }
        
        {/* AAAA 记录：IPv6 地址列表 */}
        { dnsRecords.AAAA?.length > 0 && <ListRow title="AAAA" list={dnsRecords.AAAA} /> }
        
        {/* MX 记录：邮件交换服务器列表 */}
        { dnsRecords.MX?.length > 0 && <ListRow title="MX" list={dnsRecords.MX} /> }
        
        {/* CNAME 记录：别名记录列表 */}
        { dnsRecords.CNAME?.length > 0 && <ListRow title="CNAME" list={dnsRecords.CNAME} /> }
        
        {/* NS 记录：名称服务器列表 */}
        { dnsRecords.NS?.length > 0 && <ListRow title="NS" list={dnsRecords.NS} /> }
        
        {/* PTR 记录：反向 DNS 记录列表 */}
        { dnsRecords.PTR?.length > 0 && <ListRow title="PTR" list={dnsRecords.PTR} /> }
        
        {/* SOA 记录：授权起始记录列表 */}
        { dnsRecords.SOA?.length > 0 && <ListRow title="SOA" list={dnsRecords.SOA} /> }
      </div>
    </Card>
  );
}

export default DnsRecordsCard;
