
// ==================== 导入依赖 ====================
import styled from '@emotion/styled';  // Emotion 样式库，用于创建样式化组件
import type { Whois } from 'web-check-live/utils/result-processor';  // Whois 类型定义
import colors from 'web-check-live/styles/colors';  // 颜色主题配置
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Heading from 'web-check-live/components/Form/Heading';  // 标题组件

// ==================== 数据行样式组件 ====================
// 使用 flexbox 布局，在标签和值之间创建空间
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primaryTransparent}; }  // 除最后一行外，添加底部边框
  span.lbl { font-weight: bold; }  // 标签文字加粗
  span.val {
    max-width: 200px;  // 值的最大宽度为 200px
    white-space: nowrap;  // 不换行
    overflow: hidden;  // 隐藏溢出内容
    text-overflow: ellipsis;  // 溢出时显示省略号
  }
`;

// ==================== 日期格式化函数 ====================
// 将 ISO 日期字符串转换为更友好的格式
// 输入：ISO 日期字符串（如 "2023-01-15T00:00:00.000Z"）
// 输出：格式化的日期字符串（如 "15 January 2023"）
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);  // 创建 Date 对象
  const formatter = new Intl.DateTimeFormat('en-GB', {  // 使用英国英语格式
    day: 'numeric',  // 显示日期数字
    month: 'long',  // 显示完整月份名称
    year: 'numeric'  // 显示四位年份
  });
  return formatter.format(date);  // 返回格式化后的日期字符串
}

// ==================== 数据行组件 ====================
// 显示标签-值对的数据行
// Props 说明：
// - lbl: 标签文本
// - val: 值文本
const DataRow = (props: { lbl: string, val: string }) => {
  const { lbl, val } = props;
  return (
  <Row>
    <span className="lbl">{lbl}</span>  {/* 标签 */}
    <span className="val" title={val}>{val}</span>  {/* 值，鼠标悬停时显示完整内容 */}
  </Row>
  );
};

// ==================== 列表行组件 ====================
// 显示标题和对应的列表数据
// Props 说明：
// - list: 字符串数组，要显示的数据列表
// - title: 列表标题
const ListRow = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    <Heading as="h3" size="small" align="left" color={colors.primary}>{title}</Heading>  {/* 列表标题 */}
    { list.map((entry: string, index: number) => {
      return (
      <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry }</span></Row>  {/* 列表项 */}
      )}
    )}
  </>
);
}

// ==================== Whois 信息卡片组件 ====================
// 显示域名的 Whois 注册信息
// Whois 是一个查询和响应协议，用于查询互联网资源（如域名、IP 地址）的注册信息
// Props 说明：
// - data: Whois 数据对象，包含以下字段：
//   - created: 域名创建日期
//   - updated: 域名更新日期
//   - expires: 域名过期日期
//   - nameservers: 名称服务器列表
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 域名创建日期
// 2. 域名更新日期
// 3. 域名过期日期
// 4. 名称服务器列表
const WhoIsCard = (props: { data: Whois, title: string, actionButtons: any }): JSX.Element => {
  const whois = props.data;  // 获取 Whois 数据
  const { created, updated, expires, nameservers } = whois;  // 解构数据字段
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { created && <DataRow lbl="Created" val={formatDate(created)} /> }  {/* 创建日期 */}
      { updated && <DataRow lbl="Updated" val={formatDate(updated)} /> }  {/* 更新日期 */}
      { expires && <DataRow lbl="Expires" val={formatDate(expires)} /> }  {/* 过期日期 */}
      { nameservers && <ListRow title="Name Servers" list={nameservers} /> }  {/* 名称服务器列表 */}
    </Card>
  );
}

export default WhoIsCard;
