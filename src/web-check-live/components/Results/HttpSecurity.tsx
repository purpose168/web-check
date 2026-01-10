// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Row from 'web-check-live/components/Form/Row';  // 行显示组件

// ==================== HTTP 安全头信息卡片组件 ====================
// 显示网站的 HTTP 安全相关头配置状态
// HTTP 安全头说明：
// - Content Security Policy (CSP): 内容安全策略，防止跨站脚本攻击（XSS）和数据注入攻击
// - Strict Transport Policy (HSTS): HTTP 严格传输安全，强制使用 HTTPS 连接
// - X-Content-Type-Options: 防止 MIME 类型嗅探攻击，值为 'nosniff'
// - X-Frame-Options: 防止点击劫持攻击，控制页面是否可以在 iframe 中显示
// - X-XSS-Protection: 浏览器 XSS 过滤器，用于检测和阻止跨站脚本攻击
const HttpSecurityCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const data = props.data;  // HTTP 安全头数据对象
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      
      {/* 内容安全策略（CSP）- 防止 XSS 和数据注入攻击 */}
      <Row lbl="内容安全策略（CSP）" val={data.contentSecurityPolicy ? '✅ Yes' : '❌ No' } />
      
      {/* HTTP 严格传输安全（HSTS）- 强制使用 HTTPS */}
      <Row lbl="HTTP 严格传输安全（HSTS）" val={data.strictTransportPolicy ? '✅ Yes' : '❌ No' } />
      
      {/* X-Content-Type-Options - 防止 MIME 类型嗅探 */}
      <Row lbl="X-Content-Type-Options" val={data.xContentTypeOptions ? '✅ Yes' : '❌ No' } />
      
      {/* X-Frame-Options - 防止点击劫持 */}
      <Row lbl="X-Frame-Options" val={data.xFrameOptions ? '✅ Yes' : '❌ No' } />
      
      {/* X-XSS-Protection - 浏览器 XSS 过滤器 */}
      <Row lbl="X-XSS-Protection" val={data.xXSSProtection ? '✅ Yes' : '❌ No' } />
    </Card>
  );
}

export default HttpSecurityCard;
