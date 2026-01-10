import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import Heading from 'web-check-live/components/Form/Heading';

// ==================== 行组件属性接口 ====================
// 定义行组件的可配置属性
export interface RowProps {
  lbl: string,  // 标签文本（左侧显示）
  val: string,  // 值文本（右侧显示）
  key?: string | number,  // 唯一标识符
  children?: ReactNode,  // 子元素（自定义内容）
  rowList?: RowProps[],  // 子行列表（用于可展开行）
  title?: string,  // 工具提示文本
  open?: boolean,  // 是否默认展开（用于可展开行）
  plaintext?: string,  // 纯文本内容（用于显示多行文本）
  listResults?: string[],  // 列表结果（用于显示列表项）
}

// ==================== 样式化行组件 ====================
// 基础行组件，用于显示标签和值的对齐布局
export const StyledRow = styled.div`
  display: flex;  // 使用 Flexbox 布局
  justify-content: space-between;  // 两端对齐（标签在左，值在右）
  flex-wrap: wrap;  // 允许内容换行
  padding: 0.25rem;  // 内边距 0.25rem
  &li { border-bottom: 1px dashed ${colors.primaryTransparent} !important; }  // 列表项使用虚线边框
  &:not(:last-child) { border-bottom: 1px solid ${colors.primaryTransparent}; }  // 非最后一行使用实线边框
  span.lbl { font-weight: bold; }  // 标签文本加粗
  span.val {
    max-width: 16rem;  // 值文本最大宽度 16rem
    white-space: nowrap;  // 不换行
    overflow: hidden;  // 隐藏溢出内容
    text-overflow: ellipsis;  // 溢出时显示省略号
    a {
      color: ${colors.primary};  // 链接使用主色调
    }
  }  
`;

// ==================== 可展开详情组件 ====================
// 使用 HTML <details> 元素实现可展开/折叠的内容区域
export const Details = styled.details`
  transition: all 0.2s ease-in-out;  // 平滑过渡动画（0.2 秒）
  summary {
    padding-left: 1rem;  // 左侧内边距 1rem
    cursor: pointer;  // 鼠标指针为手型
  }
  summary:before {  // 在摘要前添加箭头图标
    content: "►";  // 未展开时显示右箭头
    position: absolute;  // 绝对定位
    margin-left: -1rem;  // 左偏移 -1rem
    color: ${colors.primary};  // 箭头颜色使用主色调
    cursor: pointer;  // 鼠标指针为手型
  }
  &[open] summary:before {  // 展开状态下的箭头
    content: "▼";  // 显示下箭头
  }
`;

// ==================== 子行列表组件 ====================
// 用于显示可展开行中的子行列表
const SubRowList = styled.ul`
  margin: 0;  // 无外边距
  padding: 0.25rem;  // 内边距 0.25rem
  background: ${colors.primaryTransparent};  // 背景色使用半透明主色调
`;

// ==================== 纯文本组件 ====================
// 用于显示预格式化的纯文本内容（如代码、配置文件等）
const PlainText = styled.pre`
  background: ${colors.background};  // 背景色使用主题背景色
  width: 95%;  // 宽度为父元素的 95%
  white-space: pre-wrap;  // 保留空白符，允许换行
  word-wrap: break-word;  // 允许在单词内换行
  border-radius: 4px;  // 圆角 4px
  padding: 0.25rem;  // 内边距 0.25rem
`;

// ==================== 列表组件 ====================
// 用于显示项目符号列表
const List = styled.ul`
  // background: ${colors.background};
  width: 95%;  // 宽度为父元素的 95%
  white-space: pre-wrap;  // 保留空白符，允许换行
  word-wrap: break-word;  // 允许在单词内换行
  border-radius: 4px;  // 圆角 4px
  margin: 0;  // 无外边距
  padding: 0.25rem 0.25rem 0.25rem 1rem;  // 内边距：上下 0.25rem，左右 0.25rem，左侧 1rem
  li {
    // white-space: nowrap;
    // overflow: hidden;
    text-overflow: ellipsis;  // 溢出时显示省略号
    list-style: circle;  // 使用圆形项目符号
    &:first-letter{  // 首字母大写
      text-transform: capitalize
    }
    &::marker {  // 项目符号样式
      color: ${colors.primary};  // 项目符号颜色使用主色调
    }
  }
`;

// ==================== 日期验证函数 ====================
// 检查输入是否为有效的日期（在合理范围内）
const isValidDate = (date: any): boolean => {
  // 检查日期是否在合理范围内（1995年1月1日至2030年12月31日）
  const isInRange = (date: Date): boolean => {
    return date >= new Date('1995-01-01') && date <= new Date('2030-12-31');
  };

  // 检查输入是否为时间戳（数字类型）
  if (typeof date === 'number') {
    const timestampDate = new Date(date);
    return !isNaN(timestampDate.getTime()) && isInRange(timestampDate);
  }

  // 检查输入是否为日期字符串
  if (typeof date === 'string') {
    const dateStringDate = new Date(date);
    return !isNaN(dateStringDate.getTime()) && isInRange(dateStringDate);
  }

  // 检查输入是否为 Date 对象
  if (date instanceof Date) {
    return !isNaN(date.getTime()) && isInRange(date);
  }

  return false;
};


// ==================== 日期格式化函数 ====================
// 将日期字符串格式化为英国英语格式（日 月 年）
const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(dateString));
}

// ==================== 值格式化函数 ====================
// 根据值的类型进行格式化（日期、布尔值或原始值）
const formatValue = (value: any): string => {
  if (isValidDate(new Date(value))) return formatDate(value);  // 格式化日期
  if (typeof value === 'boolean') return value ? '✅' : '❌';  // 布尔值显示为表情符号
  return value;  // 返回原始值
};


// ==================== 复制到剪贴板函数 ====================
// 将文本复制到系统剪贴板
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}

// ==================== 文本截断函数 ====================
// 将长文本截断为指定长度，末尾添加省略号
const snip = (text: string, length: number = 80) => {
  if (text.length < length) return text;  // 文本长度小于限制，直接返回
  return `${text.substring(0, length)}...`;  // 截断并添加省略号
};

// ==================== 可展开行组件 ====================
// 支持展开/折叠的行组件，可包含子行列表
export const ExpandableRow = (props: RowProps) => {
  const { lbl, val, title, rowList, open } = props;
  return (
    <Details open={open}>
      <StyledRow as="summary" key={`${lbl}-${val}`}>
        <span className="lbl" title={title?.toString()}>{lbl}</span>
        <span className="val" title={val?.toString()}>{val.toString()}</span>
      </StyledRow>
      { rowList &&
        <SubRowList>
          { rowList?.map((row: RowProps, index: number) => {
            return (
              <StyledRow as="li" key={`${row.lbl}-${index}`}>
                <span className="lbl" title={row.title?.toString()}>{row.lbl}</span>
                <span className="val" title={row.val?.toString()} onClick={() => copyToClipboard(row.val)}>
                  {formatValue(row.val)}
                </span>
                { row.plaintext && <PlainText>{row.plaintext}</PlainText> }
                { row.listResults && (<List>
                  {row.listResults.map((listItem: string, listIndex: number) => (
                    <li key={listItem}>{snip(listItem)}</li>
                  ))}
                </List>)}
              </StyledRow>
            )
          })}
        </SubRowList>
      }
    </Details>
  );
};

// ==================== 列表行组件 ====================
// 用于显示标题和对应的列表项
export const ListRow = (props: { list: string[], title: string }) => {
  const { list, title } = props;
  return (
  <>
    <Heading as="h4" size="small" align="left" color={colors.primary}>{title}</Heading>
    { list.map((entry: string, index: number) => {
      return (
      <Row lbl="" val="" key={`${entry}-${title.toLocaleLowerCase()}-${index}`}>
        <span>{ entry }</span>
      </Row>
      )}
    )}
  </>
);
}

// ==================== 行组件（默认导出） ====================
// 基础行组件，用于显示标签和值，支持纯文本和列表内容
const Row = (props: RowProps) => {
  const { lbl, val, title, plaintext, listResults, children } = props;
  if (children) return <StyledRow key={`${lbl}-${val}`}>{children}</StyledRow>;
  return (
  <StyledRow key={`${lbl}-${val}`}>
    { lbl && <span className="lbl" title={title?.toString()}>{lbl}</span> }
    <span className="val" title={val} onClick={() => copyToClipboard(val)}>
      {formatValue(val)}
    </span>
    { plaintext && <PlainText>{plaintext}</PlainText> }
    { listResults && (<List>
      {listResults.map((listItem: string, listIndex: number) => (
        <li key={listIndex} title={listItem}>{snip(listItem)}</li>
      ))}
    </List>)}
  </StyledRow>
  );
};

export default Row;
