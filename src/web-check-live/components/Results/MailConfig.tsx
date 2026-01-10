
// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Row from 'web-check-live/components/Form/Row';  // 行显示组件
import Heading from 'web-check-live/components/Form/Heading';  // 标题组件
import colors from 'web-check-live/styles/colors';  // 颜色主题配置

// ==================== 邮件安全相关说明 ====================
// 邮件安全协议说明：
// - SPF (Sender Policy Framework): 发送者策略框架，防止邮件伪造
//   通过 DNS TXT 记录指定哪些邮件服务器可以代表该域名发送邮件
// - DKIM (DomainKeys Identified Mail): 域名密钥识别邮件，确保邮件完整性
//   使用数字签名验证邮件是否在传输过程中被篡改
// - DMARC (Domain-based Message Authentication, Reporting, and Conformance): 
//   基于域名的消息认证、报告和一致性，结合 SPF 和 DKIM 提供邮件认证
// - BIMI (Brand Indicators for Message Identification): 品牌指示符消息识别
//   允许企业在邮件中显示品牌徽标，增强品牌识别度

const cardStyles = ``;

// ==================== 邮件配置卡片组件 ====================
// 显示域名的邮件服务器配置和安全设置
const MailConfigCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {
  const mailServer = props.data;  // 邮件服务器配置数据
  // 将所有 TXT 记录合并为字符串并转换为小写，用于检查是否包含特定的邮件安全协议
  const txtRecords = (mailServer.txtRecords || []).join('').toLowerCase() || '';
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      
      {/* 邮件安全检查清单 */}
      <Heading as="h3" color={colors.primary} size="small">Mail Security Checklist</Heading>
      
      {/* 检查是否配置了 SPF 记录 */}
      <Row lbl="SPF" val={txtRecords.includes('spf')} />
      
      {/* 检查是否配置了 DKIM 记录 */}
      <Row lbl="DKIM" val={txtRecords.includes('dkim')} />
      
      {/* 检查是否配置了 DMARC 记录 */}
      <Row lbl="DMARC" val={txtRecords.includes('dmarc')} />
      
      {/* 检查是否配置了 BIMI 记录 */}
      <Row lbl="BIMI" val={txtRecords.includes('bimi')} />

      {/* MX 记录（邮件交换记录）- 指定处理该域名邮件的邮件服务器 */}
      { mailServer.mxRecords && <Heading as="h3" color={colors.primary} size="small">MX Records</Heading>}
      { mailServer.mxRecords && mailServer.mxRecords.map((record: any, index: number) => (
          <Row lbl="" val="" key={index}>
            <span>{record.exchange}</span>  {/* 邮件服务器地址 */}
            <span>{record.priority ? `Priority: ${record.priority}` : ''}</span>  {/* 优先级（数字越小优先级越高） */}
          </Row>
        ))
      }
      
      {/* 外部邮件服务 - 如 Gmail、Outlook 等第三方邮件服务 */}
      { mailServer.mailServices.length > 0 && <Heading as="h3" color={colors.primary} size="small">External Mail Services</Heading>}
      { mailServer.mailServices && mailServer.mailServices.map((service: any, index: number) => (
        <Row lbl={service.provider} title={service.value} val="" key={index} />
        ))
      }

      {/* 邮件相关的 TXT 记录 - 包含 SPF、DKIM、DMARC 等配置 */}
      { mailServer.txtRecords && <Heading as="h3" color={colors.primary} size="small">Mail-related TXT Records</Heading>}
      { mailServer.txtRecords && mailServer.txtRecords.map((record: any, index: number) => (
          <Row lbl="" val="" key={index}>
            <span>{record}</span>  {/* TXT 记录内容 */}
          </Row>
        ))
      }
    </Card>
  );
}

export default MailConfigCard;
