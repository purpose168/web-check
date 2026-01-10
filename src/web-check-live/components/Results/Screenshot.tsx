import { Card } from 'web-check-live/components/Form/Card';

const cardStyles = `
  overflow: auto;
  max-height: 50rem;
  grid-row: span 2;
  img {
    border-radius: 6px;
    width: 100%;
    margin 0.5rem 0;;
  }
`;

// ==================== 网站截图卡片组件 ====================
// 显示目标网站的完整页面截图
// Props 说明：
// - data: 截图数据对象
//   - image: Base64 编码的 PNG 图片数据
//   - data: 图片数据 URL（备用格式）
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// - 网站完整页面的截图（PNG 格式）
// 注意：
// 1. 优先使用 image 字段（Base64 编码）
// 2. 如果 image 不存在，则使用 data 字段（URL 格式）
const ScreenshotCard = (props: { data: { image?: string, data?: string, }, title: string, actionButtons: any }): JSX.Element => {
  const screenshot = props.data;  // 获取截图数据
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {/* 优先显示 Base64 编码的截图 */}
      { screenshot.image && <img src={`data:image/png;base64,${screenshot.image}`}  alt="Full page screenshot" /> }
      
      {/* 如果 Base64 格式不存在，则显示 URL 格式的截图 */}
      { (!screenshot.image && screenshot.data) && <img src={screenshot.data} alt="Full page screenshot" /> }
    </Card>
  );
}

export default ScreenshotCard;
