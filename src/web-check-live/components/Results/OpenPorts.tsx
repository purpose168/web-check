// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Row from 'web-check-live/components/Form/Row';  // 行显示组件

// ==================== 端口扫描相关说明 ====================
// 端口扫描用于检测目标服务器上哪些网络端口是开放的
// 常见端口说明：
// - 20/21: FTP（文件传输协议）
// - 22: SSH（安全外壳协议）
// - 23: Telnet（远程登录）
// - 25: SMTP（简单邮件传输协议）
// - 53: DNS（域名系统）
// - 80: HTTP（超文本传输协议）
// - 110: POP3（邮局协议）
// - 143: IMAP（互联网消息访问协议）
// - 443: HTTPS（安全 HTTP）
// - 3306: MySQL 数据库
// - 3389: RDP（远程桌面协议）
// - 5432: PostgreSQL 数据库
// - 8080: HTTP 代理/备用 HTTP 端口
// 开放过多的端口可能增加安全风险，建议关闭不必要的端口

const cardStyles = `
  small { margin-top: 1rem; opacity: 0.5; }
`;

// ==================== 开放端口卡片组件 ====================
// 显示目标服务器上开放的端口列表以及无法连接的端口
const OpenPortsCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const portData = props.data;  // 端口扫描结果数据
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      
      {/* 显示所有开放的端口 */}
      {portData.openPorts.map((port: any) => (
          <Row key={port} lbl="" val="">
            <span>{port}</span>  {/* 端口号 */}
          </Row>
        )
      )}
      
      <br />
      
      {/* 显示无法建立连接的端口 */}
      <small>
        Unable to establish connections to:<br />
        {portData.failedPorts.join(', ')}  {/* 无法连接的端口列表 */}
      </small>
    </Card>
  );
}

export default OpenPortsCard;
