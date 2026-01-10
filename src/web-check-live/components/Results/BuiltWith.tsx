
// ==================== 导入依赖 ====================
import styled from '@emotion/styled';  // Emotion 样式库
import type { TechnologyGroup, Technology } from 'web-check-live/utils/result-processor';  // 技术类型定义
import colors from 'web-check-live/styles/colors';  // 颜色主题配置
import Card from 'web-check-live/components/Form/Card';  // 卡片组件
import Heading from 'web-check-live/components/Form/Heading';  // 标题组件

// ==================== 外层容器样式组件 ====================
// 继承卡片样式，设置跨越两行
const Outer = styled(Card)`
  grid-row: span 2  // 在网格布局中跨越两行
`;

// ==================== 数据行样式组件 ====================
// 用于显示技术列表中的每一项
const Row = styled.div`
  display: flex;  // 使用 Flexbox 布局
  justify-content: space-between;  // 两端对齐
  padding: 0.25rem;  // 内边距
  &:not(:last-child) { border-bottom: 1px solid ${colors.primaryTransparent}; }  // 非最后一项添加底边框
  span.lbl { font-weight: bold; }  // 标签文本加粗
  span.val {
    max-width: 200px;  // 最大宽度 200 像素
    white-space: nowrap;  // 不换行
    overflow: hidden;  // 隐藏溢出内容
    text-overflow: ellipsis;  // 溢出显示省略号
  }
`;

// ==================== 列表行组件 ====================
// 显示一个技术类别的所有技术项
const ListRow = (props: { list: Technology[], title: string }) => {
  const { list, title } = props;  // 解构属性：技术列表和标题
  
  return (
    <>
      {/* 显示类别标题 */}
      <Heading as="h3" align="left" color={colors.primary}>{title}</Heading>
      
      {/* 遍历技术列表，显示每个技术项 */}
      { list.map((entry: Technology, index: number) => {
        return (
        <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry.Name }</span></Row>
        )}
      )}
    </>
  );
}

// ==================== 技术栈卡片组件 ====================
// 显示网站使用的技术栈，按类别分组
const BuiltWithCard = (props: { data: TechnologyGroup[]}): JSX.Element => {
  // const { created, updated, expires, nameservers } = whois;  // 注释掉的代码（可能是用于 WHOIS 数据）
  
  return (
    <Outer>
      {/* 主标题 */}
      <Heading as="h3" align="left" color={colors.primary}>Technologies</Heading>
      
      {/* 遍历所有技术类别，显示每个类别的技术列表 */}
      { props.data.map((group: TechnologyGroup) => {
        return (
          <ListRow key={group.tag} title={group.tag} list={group.technologies} />
        );
      })}
      
      {/* 注释掉的代码（可能是用于显示 WHOIS 数据） */}
      {/* { created && <DataRow lbl="Created" val={formatDate(created)} /> }
      { updated && <DataRow lbl="Updated" val={formatDate(updated)} /> }
      { expires && <DataRow lbl="Expires" val={formatDate(expires)} /> }
      { nameservers && <ListRow title="Name Servers" list={nameservers} /> } */}
    </Outer>
  );
}

export default BuiltWithCard;  // 导出技术栈卡片组件
