
// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Row, { type RowProps } from 'web-check-live/components/Form/Row';  // 行显示组件

// ==================== HSTS 相关说明 ====================
// HSTS (HTTP Strict Transport Security, HTTP 严格传输安全) 是一个安全功能
// 用于告诉浏览器只能通过 HTTPS 与网站通信，不能使用 HTTP
// HSTS 头格式：Strict-Transport-Security: max-age=expireTime [; includeSubDomains] [; preload]
// 参数说明：
// - max-age: 必需参数，指定浏览器应该记住 HSTS 策略的时间（秒）
// - includeSubDomains: 可选参数，表示策略适用于所有子域
// - preload: 可选参数，表示域名已加入 HSTS 预加载列表

const cardStyles = '';

// ==================== 解析 HSTS 头信息 ====================
// 将 HSTS 头字符串解析为键值对数组
// 输入示例："max-age=31536000; includeSubDomains; preload"
// 输出示例：[{ lbl: 'max-age', val: '31536000' }, { lbl: 'includeSubDomains', val: 'true' }, ...]
const parseHeader = (headerString: string): RowProps[] => {
  return headerString.split(';').map((part) => {
    const trimmedPart = part.trim();  // 去除首尾空格
    const equalsIndex = trimmedPart.indexOf('=');  // 查找等号位置

    if (equalsIndex >= 0) {
      // 如果包含等号，分割为键值对
      return {
        lbl: trimmedPart.substring(0, equalsIndex).trim(),  // 键名
        val: trimmedPart.substring(equalsIndex + 1).trim(),  // 键值
      };
    } else {
      // 如果不包含等号，视为布尔标志，值为 'true'
      return { lbl: trimmedPart, val: 'true' };
    }
  });
};

// ==================== HSTS 卡片组件 ====================
// 显示网站的 HSTS 配置状态和详细信息
const HstsCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {
  const hstsResults = props.data;  // HSTS 检测结果数据
  const hstsHeaders = hstsResults?.hstsHeader ? parseHeader(hstsResults.hstsHeader) : [];  // 解析 HSTS 头信息
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      
      {/* 显示 HSTS 是否启用 */}
      {typeof hstsResults.compatible === 'boolean' && (
        <Row lbl="HSTS Enabled?" val={hstsResults.compatible ? '✅ Yes' : '❌ No'} />
      )}
      
      {/* 显示 HSTS 头的各个参数 */}
      {hstsHeaders.length > 0 && hstsHeaders.map((header: RowProps, index: number) => {
        return (
          <Row lbl={header.lbl} val={header.val} key={`hsts-${index}`} />
        );
      })
      }
      
      {/* 显示附加消息（如果有） */}
      {hstsResults.message && (<p>{hstsResults.message}</p>)}
    </Card>
  );
}

export default HstsCard;
