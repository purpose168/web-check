import { Card } from 'web-check-live/components/Form/Card';
import colors from 'web-check-live/styles/colors';
import Row from 'web-check-live/components/Form/Row';
import Heading  from 'web-check-live/components/Form/Heading';

// 样式定义，设置内容区域的最大高度和滚动条，以及扫描日期的样式
const styles = `
  .content {
    max-height: 50rem;
    overflow-y: auto;
  }

  .scan-date {
    font-size: 0.8rem;
    margin-top: 0.5rem;
    opacity: 0.75;
  }
`;

// 格式化日期函数，将时间戳转换为可读的日期字符串
const formatDate = (timestamp: number): string => {
  // 如果时间戳无效或小于等于0，返回"无日期"
  if (isNaN(timestamp) || timestamp <= 0) return '无日期';

  // 将时间戳转换为日期对象（时间戳为秒，需要乘以1000转换为毫秒）
  const date = new Date(timestamp * 1000);

  // 如果日期无效，返回"未知"
  if (isNaN(date.getTime())) return '未知';

  // 使用国际化日期格式化器格式化日期
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return formatter.format(date);
}



// 网站功能卡片组件，用于显示网站的功能特性信息
const SiteFeaturesCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  // 从props中解构获取功能特性数据
  const features = props.data;
  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title} actionButtons={props.actionButtons} styles={styles}>
      <div className="content">
        { (features?.groups || []).filter((group: any) => group.categories.length > 0).map((group: any, index: number) => (
          <div key={`${group.name}-${index}`}>
          <Heading as="h4" size="small" color={colors.primary}>{group.name}</Heading>
          { group.categories.map((category: any, subIndex: number) => (
            // <Row lbl={category.name} val={category.live} />
            <Row lbl="" val="" key={`${category.name}-${subIndex}`}>
              <span className="lbl">{category.name}</span>
              <span className="val">{category.live} 活跃 {category.dead ? `(${category.dead} 失效)` : ''}</span>
            </Row>
          ))
          }
          </div>
        ))
        }
      </div>
      <p className="scan-date">最后扫描于 {formatDate(features.last)}</p>
    </Card>
  );
}

export default SiteFeaturesCard;
