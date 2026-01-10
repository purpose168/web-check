import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import { TextSizes } from 'web-check-live/styles/typography';
import type { ReactNode } from 'react';

// ==================== 标题组件属性接口 ====================
// 定义标题组件的可配置属性
interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';  // 渲染的 HTML 元素类型（默认 h1）
  align?: 'left' | 'center' | 'right';  // 文本对齐方式
  color?: string;  // 自定义文本颜色
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';  // 字体大小
  inline?: boolean;  // 是否为行内元素
  children: ReactNode;  // 子元素（标题内容）
  id?: string;  // 元素 ID
  className?: string;  // 自定义 CSS 类名
};

// ==================== 样式化标题组件 ====================
// 使用 Emotion 的 styled 组件创建可配置的标题样式
const StyledHeading = styled.h1<HeadingProps>`
  margin: 0.5rem 0;  // 上下外边距 0.5rem
  text-shadow: 2px 2px 0px ${colors.bgShadowColor};  // 文本阴影效果（右下偏移）
  display: flex;  // 使用 Flexbox 布局
  flex-wrap: wrap;  // 允许内容换行
  gap: 1rem;  // 子元素间距 1rem
  align-items: center;  // 垂直居中对齐
  font-size: ${TextSizes.medium};  // 默认字体大小为中等
  img { // 标题中可能包含图标
    width: 2.5rem;  // 图标宽度 2.5rem
    border-radius: 4px;  // 圆角 4px
  }
  a { // 如果标题是链接，保持标题样式
    color: inherit;  // 继承父元素颜色
    text-decoration: none;  // 移除下划线
    display: flex;  // 使用 Flexbox 布局
  }
  // 根据尺寸属性设置字体大小
  ${props => {
    switch (props.size) {
      case 'xSmall': return `font-size: ${TextSizes.xSmall};`;  // 极小字体
      case 'small': return `font-size: ${TextSizes.small};`;  // 小字体
      case 'medium': return `font-size: ${TextSizes.large};`;  // 中等字体（实际使用大号尺寸）
      case 'large': return `font-size: ${TextSizes.xLarge};`;  // 大字体（实际使用超大号尺寸）
      case 'xLarge': return `font-size: ${TextSizes.xLarge};`;  // 超大字体
    }
  }};
  // 根据对齐属性设置文本对齐方式
  ${props => {
    switch (props.align) {
      case 'left': return 'text-align: left;';  // 左对齐
      case 'right': return 'text-align: right;';  // 右对齐
      case 'center': return 'text-align: center; justify-content: center;';  // 居中对齐（水平和垂直）
    }
  }};
  // 设置自定义颜色
  ${props => props.color ? `color: ${props.color};` : '' }
  // 设置为行内元素
  ${props => props.inline ? 'display: inline;' : '' }
`;

// ==================== 生成锚点 ID 的辅助函数 ====================
// 将标题文本转换为适合作为 URL 锚点的 ID
// 例如："Hello World" → "hello-world"
const makeAnchor = (title: string): string => {
  return title.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-");
};

// ==================== 标题组件 ====================
// 可配置的标题组件，支持多种 HTML 元素类型、对齐方式和尺寸
const Heading = (props: HeadingProps): JSX.Element => {
  const { children, as, size, align, color, inline, id, className } = props;
  return (
    <StyledHeading as={as} size={size} align={align} color={color} inline={inline} className={className} id={id || makeAnchor((children || '')?.toString())}>
      {children}
    </StyledHeading>
  );
}

export default Heading;
