
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Heading from 'web-check-live/components/Form/Heading';

// 行样式组件，用于显示键值对数据
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primaryTransparent}; }
  span.lbl { font-weight: bold; }
  span.val {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// 格式化日期函数，将日期字符串转换为可读的日期格式
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return formatter.format(date);
}

// 数据行组件，用于显示标签和值
const DataRow = (props: { lbl: string, val: string }) => {
  const { lbl, val } = props;
  return (
  <Row>
    <span className="lbl">{lbl}</span>
    <span className="val" title={val}>{val}</span>
  </Row>
  );
};

// 获取扩展密钥用途函数，将OID映射为可读的用途描述
function getExtendedKeyUsage(oids: string[]) {
  const oidMap: { [key: string]: string } = {
    "1.3.6.1.5.5.7.3.1": "TLS Web Server Authentication",
    "1.3.6.1.5.5.7.3.2": "TLS Web Client Authentication",
    "1.3.6.1.5.5.7.3.3": "Code Signing",
    "1.3.6.1.5.5.7.3.4": "Email Protection (SMIME)",
    "1.3.6.1.5.5.7.3.8": "Time Stamping",
    "1.3.6.1.5.5.7.3.9": "OCSP Signing",
    "1.3.6.1.5.5.7.3.5": "IPSec End System",
    "1.3.6.1.5.5.7.3.6": "IPSec Tunnel",
    "1.3.6.1.5.5.7.3.7": "IPSec User",
    "1.3.6.1.5.5.8.2.2": "IKE Intermediate",
    "2.16.840.1.113730.4.1": "Netscape Server Gated Crypto",
    "1.3.6.1.4.1.311.10.3.3": "Microsoft Server Gated Crypto",
    "1.3.6.1.4.1.311.10.3.4": "Microsoft Encrypted File System",
    "1.3.6.1.4.1.311.20.2.2": "Microsoft Smartcard Logon",
    "1.3.6.1.4.1.311.10.3.12": "Microsoft Document Signing",
    "0.9.2342.19200300.100.1.3": "Email Address (in Subject Alternative Name)",
  };
  const results = oids.map(oid => oidMap[oid] || oid);
  return results.filter((item, index) => results.indexOf(item) === index);
}


// ==================== 列表行组件 ====================
// 显示标题和多个列表项的组件
// Props 说明：
// - list: 字符串数组，包含要显示的列表项
// - title: 列表标题
// 用途：用于显示扩展密钥用途等数组类型的数据
const ListRow = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    {/* 显示列表标题 */}
    <Heading as="h3" size="small" align="left" color={colors.primary}>{title}</Heading>
    {/* 遍历并显示每个列表项 */}
    { list.map((entry: string, index: number) => {
      return (
      <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry }</span></Row>
      )}
    )}
  </>
);
}

// ==================== SSL/TLS 证书卡片组件 ====================
// 显示网站的 SSL/TLS 证书详细信息
// SSL/TLS 证书用于加密网站与浏览器之间的通信，确保数据安全
// Props 说明：
// - data: SSL 证书数据对象
//   - subject: 证书主题信息（包含 CN - 通用名称）
//   - issuer: 证书颁发者信息（包含 O - 组织名称）
//   - fingerprint: 证书指纹（用于唯一标识证书）
//   - serialNumber: 证书序列号
//   - asn1Curve: ASN.1 曲线名称（如 "prime256v1"）
//   - nistCurve: NIST 曲线名称（如 "P-256"）
//   - valid_to: 证书过期日期
//   - valid_from: 证书生效日期
//   - ext_key_usage: 扩展密钥用途 OID 数组
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 证书主题（域名）
// 2. 证书颁发者（CA）
// 3. 加密曲线类型
// 4. 有效期信息
// 5. 序列号和指纹
// 6. 扩展密钥用途列表
const SslCertCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const sslCert = props.data;  // 获取 SSL 证书数据
  // 解构证书字段
  const { subject, issuer, fingerprint, serialNumber, asn1Curve, nistCurve, valid_to, valid_from, ext_key_usage } = sslCert;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {/* 显示证书主题（域名） */}
      { subject && <DataRow lbl="主题" val={subject?.CN} /> }
      
      {/* 显示证书颁发者（CA 组织名称） */}
      { issuer?.O && <DataRow lbl="颁发者" val={issuer.O} /> }
      
      {/* 显示 ASN.1 曲线名称 */}
      { asn1Curve && <DataRow lbl="ASN1曲线" val={asn1Curve} /> }
      
      {/* 显示 NIST 曲线名称 */}
      { nistCurve && <DataRow lbl="NIST曲线" val={nistCurve} /> }
      
      {/* 显示证书过期日期 */}
      { valid_to && <DataRow lbl="过期时间" val={formatDate(valid_to)} /> }
      
      {/* 显示证书生效日期（续期日期） */}
      { valid_from && <DataRow lbl="续期时间" val={formatDate(valid_from)} /> }
      
      {/* 显示证书序列号 */}
      { serialNumber && <DataRow lbl="序列号" val={serialNumber} /> }
      
      {/* 显示证书指纹 */}
      { fingerprint && <DataRow lbl="指纹" val={fingerprint} /> }
      
      {/* 显示扩展密钥用途列表 */}
      { ext_key_usage && <ListRow title="扩展密钥用途" list={getExtendedKeyUsage(ext_key_usage)} /> }
      
    </Card>
  );
}

export default SslCertCard;
