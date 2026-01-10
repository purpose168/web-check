// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import { ExpandableRow } from 'web-check-live/components/Form/Row';  // 可展开行组件

// ==================== Lighthouse 相关说明 ====================
// Lighthouse 是 Google 开发的自动化工具，用于改进网页质量
// 它可以检查网页的性能、可访问性、最佳实践和 SEO
// 主要类别包括：
// - Performance (性能): 页面加载速度和响应性能
// - Accessibility (可访问性): 网页对残障用户的友好程度
// - Best Practices (最佳实践): 遵循 Web 开发最佳实践的程度
// - SEO (搜索引擎优化): 网页在搜索引擎中的表现

// ==================== 处理分数显示 ====================
// 将小数分数转换为百分比字符串
// 输入：0.95
// 输出："95%"
const processScore = (percentile: number) => {
  return `${Math.round(percentile * 100)}%`;
}

// ==================== 审计项目接口定义 ====================
// 定义 Lighthouse 审计项目的数据结构
interface Audit {
  id: string,  // 审计项目唯一标识符
  score?: number | string,  // 审计分数（0-1 或字符串）
  scoreDisplayMode?: string,  // 分数显示模式（binary、numeric、informative）
  title?: string,  // 审计项目标题
  description?: string,  // 审计项目详细描述
  displayValue?: string,  // 自定义显示值
};

// ==================== 生成审计值 ====================
// 根据审计项目的属性生成合适的显示值
// 优先级：displayValue > scoreDisplayMode > score
const makeValue = (audit: Audit) => {
  let score = audit.score;
  
  // 如果有自定义显示值，使用自定义值
  if (audit.displayValue) {
    score = audit.displayValue;
  } 
  // 如果有分数显示模式，根据模式生成显示值
  else if (audit.scoreDisplayMode) {
    // binary 模式：1 表示通过，0 表示失败
    score = audit.score === 1 ? '✅ Pass' : '❌ Fail'; 
  }
  
  return score;
};

// ==================== Lighthouse 卡片组件 ====================
// 显示 Lighthouse 性能分析结果，包括各类别分数和详细审计项目
const LighthouseCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const lighthouse = props.data;  // Lighthouse 分析结果数据
  const categories = lighthouse?.categories || {};  // 类别数据（性能、可访问性等）
  const audits = lighthouse?.audits || [];  // 审计项目数据

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { 
        // 遍历所有类别
        Object.keys(categories).map((title: string, index: number) => {
          // 获取该类别下所有审计项目的 ID
          const scoreIds = categories[title].auditRefs.map((ref: { id: string }) => ref.id);
          
          // 为每个审计项目生成显示数据
          const scoreList = scoreIds.map((id: string) => {
            return { 
              lbl: audits[id].title,  // 审计项目标题
              val: makeValue(audits[id]),  // 审计结果值
              title: audits[id].description,  // 审计项目描述（作为工具提示）
              key: id  // 唯一键值
            }
          })
          
          return (
            <ExpandableRow
              key={`lighthouse-${index}`}  // 唯一键值
              lbl={title}  // 类别名称
              val={processScore(categories[title].score)}  // 类别分数（百分比）
              rowList={scoreList}  // 该类别下的审计项目列表
            />
          );
        }) 
      }
    </Card>
  );
}

export default LighthouseCard;
