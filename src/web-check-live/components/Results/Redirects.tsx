import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

const cardStyles = `
  div {
    justify-content: flex-start;
    align-items: baseline; 
  }
  .arrow-thing {
    color: ${colors.primary};
    font-size: 1.8rem;
    font-weight: bold;
    margin-right: 0.5rem;
  }
  .redirect-count {
    color: ${colors.textColorSecondary};
    margin: 0;
  }
`;

// ==================== URL 重定向卡片组件 ====================
// 显示目标网站的所有重定向链
// Props 说明：
// - data: 重定向数据对象，包含 redirects 数组
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 重定向总数统计
// 2. 每个重定向的 URL（带箭头指示）
// 注意：如果没有重定向，显示 "No redirects" 消息
const RedirectsCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const redirects = props.data;  // 获取重定向数据
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {/* 如果没有重定向，显示提示消息 */}
      { !redirects?.redirects.length && <Row lbl="" val="No redirects" />}
      
      {/* 显示重定向计数，根据数量使用单复数形式 */}
      <p className="redirect-count">
        Followed {redirects.redirects.length}{' '}
        redirect{redirects.redirects.length === 1 ? '' : 's'} when contacting host
      </p>
      
      {/* 遍历并显示每个重定向 URL */}
      {redirects.redirects.map((redirect: any, index: number) => {
        return (
          <Row lbl="" val="" key={index}>
          <span className="arrow-thing">↳</span> {redirect}  {/* 箭头符号 + 重定向 URL */}
          </Row>
        );
      })}
    </Card>
  );
}

export default RedirectsCard;
