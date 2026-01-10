
// ==================== 导入依赖 ====================
// AreaChart, Area: 面积图组件，用于显示排名趋势
// Tooltip: 图表提示框，显示鼠标悬停时的详细信息
// CartesianGrid: 笛卡尔坐标系网格线
// ResponsiveContainer: 响应式容器，使图表自适应容器大小
import { AreaChart, Area, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

// ==================== 卡片样式定义 ====================
// 使用 Emotion 的 CSS-in-JS 语法定义组件样式
const cardStyles = `
span.val {
  &.up { color: ${colors.success}; }  // 排名上升显示绿色
  &.down { color: ${colors.danger}; }  // 排名下降显示红色
}
.rank-average {
  text-align: center;  // 文本居中对齐
  font-size: 1.8rem;   // 大字体显示当前排名
  font-weight: bold;    // 加粗字体
}
.chart-container {
  margin-top: 1rem;  // 图表容器上边距
}
`;

const makeRankStats = (data: {date: string, rank: number }[]) => {
  const average = Math.round(data.reduce((acc, cur) => acc + cur.rank, 0) / data.length);
  const today = data[0].rank;
  const yesterday = data[1].rank;
  const percentageChange = ((today - yesterday) / yesterday) * 100;
  return {
    average,
    percentageChange
  };
};

const makeChartData = (data: {date: string, rank: number }[]) => {
  return data.map((d) => {
    return {
      date: d.date,
      uv: d.rank
    };
  });
};

// ==================== 排名趋势图表组件 ====================
// 使用面积图显示网站排名的历史变化趋势
// 参数说明：
// - chartData: 图表数据数组，包含日期和排名值
// - data: 原始数据数组，用于 Tooltip 显示完整日期
// 图表特性：
// - 使用线性渐变填充区域
// - 显示网格线辅助阅读
// - 鼠标悬停显示详细日期和排名
// - 自适应容器大小
function Chart(chartData: { date: string; uv: number; }[], data: any) {
  return <ResponsiveContainer width="100%" height={100}>
    <AreaChart width={400} height={100} data={chartData}>
      <defs>
        {/* 定义线性渐变，用于面积图的填充效果 */}
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="20%" stopColor="#0f1620" stopOpacity={0.8} />  // 顶部不透明度 0.8
          <stop offset="80%" stopColor="#0f1620" stopOpacity={0} />     // 底部完全透明
        </linearGradient>
      </defs>
      {/* 笛卡尔坐标系网格线 */}
      <CartesianGrid strokeDasharray="4" strokeWidth={0.25} verticalPoints={[50, 100, 150, 200, 250, 300, 350]} horizontalPoints={[25, 50, 75]} />
      {/* 提示框，显示日期和排名 */}
      <Tooltip contentStyle={{ background: colors.background, color: colors.textColor, borderRadius: 4 }}
        labelFormatter={(value) => ['Date : ', data[value].date]} />
      {/* 面积图区域，使用 monotone 曲线平滑连接 */}
      <Area type="monotone" dataKey="uv" stroke="#9fef00" fillOpacity={1} name="Rank" fill={`${colors.backgroundDarker}a1`} />
    </AreaChart>
  </ResponsiveContainer>;
}

const RankCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const data = props.data.ranks || [];
  const { average, percentageChange } = makeRankStats(data);
  const chartData = makeChartData(data);
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <div className="rank-average">{data[0].rank.toLocaleString()}</div>
      <Row lbl="与昨日排名变化" val={`${percentageChange > 0 ? '+':''} ${percentageChange.toFixed(2)}%`} />
      <Row lbl="历史平均排名" val={average.toLocaleString()} />
      <div className="chart-container">
        {Chart(chartData, data)}
      </div>
    </Card>
  );
}

export default RankCard;


