
import { Card } from 'web-check-live/components/Form/Card';
import Row, { type RowProps }  from 'web-check-live/components/Form/Row';

const cardStyles = `
  grid-row: span 2;
  .content {
    max-height: 50rem;
    overflow-y: auto;
  }
`;

// ==================== Robots.txt 爬虫规则卡片组件 ====================
// 显示网站的 robots.txt 文件内容
// robots.txt 是搜索引擎爬虫的访问控制文件
// Props 说明：
// - data: 包含 robots 数组的数据对象
//   - robots: 爬虫规则数组，每个元素包含 lbl（规则名称）和 val（规则值）
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 所有爬虫规则（User-agent, Allow, Disallow, Crawl-delay 等）
// 2. 如果没有找到规则，显示提示消息
const RobotsTxtCard = ( props: { data: { robots: RowProps[]}, title: string, actionButtons: any}): JSX.Element => {
  const { data } = props;
  const robots = data?.robots || [];  // 获取爬虫规则数组，如果不存在则使用空数组

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <div className="content">
      {/* 如果没有爬虫规则，显示提示消息 */}
      {
        robots.length === 0 && <p>未找到爬虫规则。</p>
      }
      {/* 遍历并显示每条爬虫规则 */}
      {
        robots.map((row: RowProps, index: number) => {
          return (
            <Row key={`${row.lbl}-${index}`} lbl={row.lbl} val={row.val} />
          )
        })
      }
      </div>
    </Card>
  );
}

export default RobotsTxtCard;
