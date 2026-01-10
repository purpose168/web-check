
import { Card } from 'web-check-live/components/Form/Card';
import Row, { Details } from 'web-check-live/components/Form/Row';
import colors from 'web-check-live/styles/colors';

const cardStyles = `
small {
  margin-top: 1rem;
  opacity: 0.5;
  display: block;
  a { color: ${colors.primary}; }
}
summary {
  padding: 0.5rem 0 0 0.5rem !important;
  cursor: pointer;
  font-weight: bold;
}
pre {
  background: ${colors.background};
  padding: 0.5rem 0.25rem;
  border-radius: 4px;
  overflow: auto;
}
`;

const getPagePath = (url: string): string => {
  try {
    return new URL(url).pathname;
  } catch (error) {
    return url;
  }
}

// ==================== Security.txt 安全策略卡片组件 ====================
// 显示网站的 security.txt 文件内容
// security.txt 是一个标准化的安全策略文件，用于指导安全研究人员报告漏洞
// Props 说明：
// - data: security.txt 数据对象
//   - isPresent: 是否存在 security.txt 文件
//   - foundIn: 文件位置（URL 路径）
//   - isPgpSigned: 是否使用 PGP 签名
//   - fields: 文件中的字段键值对
//   - content: 文件完整内容
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 文件是否存在
// 2. 文件位置
// 3. PGP 签名状态
// 4. 所有字段内容
// 5. 完整文件内容（可展开查看）
const SecurityTxtCard = (props: {data: any, title: string, actionButtons: any }): JSX.Element => {
  const securityTxt = props.data;  // 获取 security.txt 数据
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {/* 显示文件是否存在 */}
      <Row lbl="Present" val={securityTxt.isPresent ? '✅ Yes' : '❌ No'} />
      
      {/* 如果文件存在，显示详细信息 */}
      { securityTxt.isPresent && (
        <>
        {/* 文件位置 */}
        <Row lbl="File Location" val={securityTxt.foundIn} />
        
        {/* PGP 签名状态 */}
        <Row lbl="PGP Signed" val={securityTxt.isPgpSigned ? '✅ Yes' : '❌ No'} />
        
        {/* 遍历并显示所有字段 */}
        {securityTxt.fields && Object.keys(securityTxt.fields).map((field: string, index: number) => {
          // 如果字段值包含 URL，显示为可点击链接
          if (securityTxt.fields[field].includes('http')) return (
            <Row lbl="" val="" key={`policy-url-row-${index}`}>
              <span className="lbl">{field}</span>
              <span className="val"><a href={securityTxt.fields[field]}>{getPagePath(securityTxt.fields[field])}</a></span>
            </Row>
          );
          // 否则显示为普通文本
          return (
            <Row lbl={field} val={securityTxt.fields[field]} key={`policy-row-${index}`} />
          );
        })}
        
        {/* 可展开的完整内容查看器 */}
        <Details>
          <summary>View Full Policy</summary>
          <pre>{securityTxt.content}</pre>
        </Details>
        </>
      )}
      
      {/* 如果文件不存在，显示提示信息 */}
      {!securityTxt.isPresent && (<small>
        Having a security.txt ensures security researchers know how and where to safely report vulnerabilities.
      </small>)}
    </Card>
  );
}

export default SecurityTxtCard;
