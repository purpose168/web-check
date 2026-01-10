// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Row, { ExpandableRow, type RowProps } from 'web-check-live/components/Form/Row';  // 行显示组件，包括可展开行
import Heading from 'web-check-live/components/Form/Heading';  // 标题组件
import colors from 'web-check-live/styles/colors';  // 颜色主题配置

// ==================== DNSSEC 相关类型说明 ====================
// DNSSEC (DNS Security Extensions) 是 DNS 的安全扩展，用于验证 DNS 数据的真实性和完整性
// 主要记录类型：
// - DNSKEY: DNS 公钥记录，存储用于签名 DNS 记录的公钥
// - DS (Delegation Signer): 委派签名者记录，用于建立 DNSSEC 链
// - RRSIG (Resource Record Signature): 资源记录签名，用于验证 DNS 记录的签名

// ==================== 解析 DNSKEY 数据 ====================
// DNSKEY 记录格式：flags protocol algorithm public-key
// 示例：257 3 8 AwEAAagAI...
const parseDNSKeyData = (data: string) => {
  const dnsKey = data.split(' ');  // 按空格分割 DNSKEY 数据

  const flags = parseInt(dnsKey[0]);  // 标志位（256=ZSK, 257=KSK）
  const protocol = parseInt(dnsKey[1]);  // 协议版本（3=DNSSEC）
  const algorithm = parseInt(dnsKey[2]);  // 加密算法编号

  let flagMeaning = '';
  let protocolMeaning = '';
  let algorithmMeaning = '';

  // ==================== 解析标志位 ====================
  // ZSK (Zone Signing Key): 区域签名密钥，用于签名区域内的记录
  // KSK (Key Signing Key): 密钥签名密钥，用于签名 ZSK
  if (flags === 256) {
    flagMeaning = 'Zone Signing Key (ZSK)';
  } else if (flags === 257) {
    flagMeaning = 'Key Signing Key (KSK)';
  } else {
    flagMeaning = 'Unknown';
  }

  // ==================== 解析协议 ====================
  protocolMeaning = protocol === 3 ? 'DNSSEC' : 'Unknown';

  // ==================== 解析加密算法 ====================
  switch (algorithm) {
    case 5: 
      algorithmMeaning = 'RSA/SHA-1';
      break;
    case 7: 
      algorithmMeaning = 'RSASHA1-NSEC3-SHA1';
      break;
    case 8: 
      algorithmMeaning = 'RSA/SHA-256';
      break;
    case 10: 
      algorithmMeaning = 'RSA/SHA-512';
      break;
    case 13: 
      algorithmMeaning = 'ECDSA Curve P-256 with SHA-256';
      break;
    case 14: 
      algorithmMeaning = 'ECDSA Curve P-384 with SHA-384';
      break;
    case 15: 
      algorithmMeaning = 'Ed25519';
      break;
    case 16: 
      algorithmMeaning = 'Ed448';
      break;
    default: 
      algorithmMeaning = 'Unknown';
      break;
  }

  return {
    flags: flagMeaning,
    protocol: protocolMeaning,
    algorithm: algorithmMeaning,
    publicKey: dnsKey[3]  // 公钥数据
  };
}

// ==================== 获取 DNS 记录类型名称 ====================
// 将 DNS 记录类型代码转换为可读的名称
const getRecordTypeName = (typeCode: number): string => {
  switch(typeCode) {
      case 1: return 'A';  // IPv4 地址记录
      case 2: return 'NS';  // 名称服务器记录
      case 5: return 'CNAME';  // 别名记录
      case 6: return 'SOA';  // 授权起始记录
      case 12: return 'PTR';  // 反向 DNS 记录
      case 13: return 'HINFO';  // 主机信息记录
      case 15: return 'MX';  // 邮件交换记录
      case 16: return 'TXT';  // 文本记录
      case 28: return 'AAAA';  // IPv6 地址记录
      case 33: return 'SRV';  // 服务记录
      case 35: return 'NAPTR';  // 命名权威指针记录
      case 39: return 'DNAME';  // 域名别名记录
      case 41: return 'OPT';  // 伪记录，用于 EDNS0
      case 43: return 'DS';  // 委派签名者记录
      case 46: return 'RRSIG';  // 资源记录签名
      case 47: return 'NSEC';  // 下一个安全记录
      case 48: return 'DNSKEY';  // DNS 公钥记录
      case 50: return 'NSEC3';  // NSEC3 记录
      case 51: return 'NSEC3PARAM';  // NSEC3 参数记录
      case 52: return 'TLSA';  // TLSA 记录
      case 53: return 'SMIMEA';  // SMIMEA 记录
      case 55: return 'HIP';  // 主机身份协议记录
      case 56: return 'NINFO';  // 节点信息记录
      case 57: return 'RKEY';  // 资源密钥记录
      case 58: return 'TALINK';  // 信任锚链接记录
      case 59: return 'CDS';  // 子委派签名者记录
      case 60: return 'CDNSKEY';  // 子 DNSKEY 记录
      case 61: return 'OPENPGPKEY';  // OpenPGP 公钥记录
      case 62: return 'CSYNC';  // 子区域同步记录
      case 63: return 'ZONEMD';  // 区域摘要记录
      default: return 'Unknown';
  }
}

// ==================== 解析 DS (Delegation Signer) 数据 ====================
// DS 记录格式：key-tag algorithm digest-type digest
// 用于建立 DNSSEC 验证链
const parseDSData = (dsData: string) => {
  const parts = dsData.split(' ');
  
  const keyTag = parts[0];  // 密钥标签，标识对应的 DNSKEY
  const algorithm = getAlgorithmName(parseInt(parts[1], 10));  // 算法名称
  const digestType = getDigestTypeName(parseInt(parts[2], 10));  // 摘要类型名称
  const digest = parts[3];  // 摘要值

  return {
      keyTag,
      algorithm,
      digestType,
      digest
  };
}

// ==================== 获取算法名称 ====================
// 将算法代码转换为可读的名称
const getAlgorithmName = (code: number) => {
  switch(code) {
      case 1: return 'RSA/MD5';
      case 2: return 'Diffie-Hellman';
      case 3: return 'DSA/SHA1';
      case 5: return 'RSA/SHA1';
      case 6: return 'DSA/NSEC3/SHA1';
      case 7: return 'RSASHA1/NSEC3/SHA1';
      case 8: return 'RSA/SHA256';
      case 10: return 'RSA/SHA512';
      case 12: return 'ECC/GOST';
      case 13: return 'ECDSA/CurveP256/SHA256';
      case 14: return 'ECDSA/CurveP384/SHA384';
      case 15: return 'Ed25519';
      case 16: return 'Ed448';
      default: return 'Unknown';
  }
}

// ==================== 获取摘要类型名称 ====================
// 将摘要类型代码转换为可读的名称
const getDigestTypeName = (code: number) => {
  switch(code) {
      case 1: return 'SHA1';
      case 2: return 'SHA256';
      case 3: return 'GOST R 34.11-94';
      case 4: return 'SHA384';
      default: return 'Unknown';
  }
}

// ==================== 生成响应信息列表 ====================
// 从 DNS 响应中提取标志位信息
const makeResponseList = (response: any): RowProps[] => {
  const result = [] as RowProps[];
  if (!response) return result;
  
  // RD (Recursion Desired): 递归期望标志，表示查询者希望服务器递归查询
  if (typeof response.RD === 'boolean') result.push({ lbl: 'Recursion Desired (RD)', val: response.RD });
  
  // RA (Recursion Available): 递归可用标志，表示服务器支持递归查询
  if (typeof response.RA === 'boolean') result.push({ lbl: 'Recursion Available (RA)', val: response.RA });
  
  // TC (TrunCation): 截断标志，表示响应因大小限制被截断
  if (typeof response.TC === 'boolean') result.push({ lbl: 'TrunCation (TC)', val: response.TC });
  
  // AD (Authentic Data): 认证数据标志，表示响应已通过 DNSSEC 验证
  if (typeof response.AD === 'boolean') result.push({ lbl: 'Authentic Data (AD)', val: response.AD });
  
  // CD (Checking Disabled): 检查禁用标志，表示客户端希望服务器不进行 DNSSEC 验证
  if (typeof response.CD === 'boolean') result.push({ lbl: 'Checking Disabled (CD)', val: response.CD });
  
  return result;
};

// ==================== 生成答案信息列表 ====================
// 从 DNS 记录数据中提取详细信息
const makeAnswerList = (recordData: any): RowProps[] => {
  return [
    { lbl: 'Domain', val: recordData.name },  // 域名
    { lbl: 'Type', val: `${getRecordTypeName(recordData.type)} (${recordData.type})` },  // 记录类型
    { lbl: 'TTL', val: recordData.TTL },  // 生存时间（Time To Live）
    { lbl: 'Algorithm', val: recordData.algorithm },  // 加密算法
    { lbl: 'Flags', val: recordData.flags },  // 标志位
    { lbl: 'Protocol', val: recordData.protocol },  // 协议版本
    { lbl: 'Public Key', val: recordData.publicKey },  // 公钥
    { lbl: 'Key Tag', val: recordData.keyTag },  // 密钥标签
    { lbl: 'Digest Type', val: recordData.digestType },  // 摘要类型
    { lbl: 'Digest', val: recordData.digest },  // 摘要值
  ].filter((rowData) => rowData.val && rowData.val !== 'Unknown');  // 过滤掉未知值
};

// ==================== DNSSEC 卡片组件 ====================
// 显示 DNSSEC 相关的安全记录，包括 DNSKEY、DS 和 RRSIG
const DnsSecCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const dnsSec = props.data;  // DNSSEC 数据对象
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {
        // 遍历三种 DNSSEC 记录类型：DNSKEY、DS、RRSIG
        ['DNSKEY', 'DS', 'RRSIG'].map((key: string, index: number) => {
          const record = dnsSec[key];  // 获取当前类型的记录数据
          return (<div key={`${key}-${index}`}>
          
         
          <Heading as="h3" size="small" color={colors.primary}>{key}</Heading>
          
         
          {(record.isFound && record.answer) && (<>
              
              <Row lbl={`${key} - Present?`} val="✅ Yes" />
              
              
              {
                record.answer.map((answer: any, index: number) => {
                  const keyData = parseDNSKeyData(answer.data);  // 解析 DNSKEY 数据
                  const dsData = parseDSData(answer.data);  // 解析 DS 数据
                  // 使用标志位作为标签（如果已知），否则使用记录类型名称
                  const label = (keyData.flags && keyData.flags !== 'Unknown') ? keyData.flags : key;
                  return (
                  <ExpandableRow lbl={`Record #${index+1}`} val={label} rowList={makeAnswerList({ ...answer, ...keyData, ...dsData })} open />
                );
                })
            }
          </>)}

            {/* 如果记录不存在但有响应数据，显示响应信息 */}
            {(!record.isFound && record.response) && (
              <ExpandableRow lbl={`${key} - Present?`} val={record.isFound ? '✅ Yes' : '❌ No'} rowList={makeResponseList(record.response)} />
            )}
          </div>)
        })
      }
    </Card>
  );
}

export default DnsSecCard;
