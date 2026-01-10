// 导入 Emotion 的 styled 组件，用于创建样式化组件
import styled from '@emotion/styled';

// 导入 React 类型定义
import { type ReactNode } from 'react';
// 导入错误边界组件
import ErrorBoundary from 'web-check-live/components/misc/ErrorBoundary';
// 导入标题组件
import Heading from 'web-check-live/components/Form/Heading';
// 导入颜色配置
import colors from 'web-check-live/styles/colors';

// ==================== 样式化组件定义 ====================

// 卡片样式化组件
export const StyledCard = styled.section<{ styles?: string}>`
  background: ${colors.backgroundLighter};  // 背景色（较浅的背景色）
  color: ${colors.textColor};  // 文字颜色
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};  // 阴影效果
  border-radius: 8px;  // 圆角
  padding: 1rem;  // 内边距
  position: relative;  // 相对定位
  margin 0.5rem;  // 外边距
  max-height: 64rem;  // 最大高度
  overflow: auto;  // 内容溢出时显示滚动条
  ${props => props.styles}  // 应用自定义样式
`;

// ==================== 类型定义 ====================

// 卡片属性接口
interface CardProps {
  children: ReactNode;  // 卡片内容
  heading?: string,  // 卡片标题
  styles?: string;  // 自定义样式
  actionButtons?: ReactNode | undefined;  // 操作按钮
};

// ==================== 卡片组件 ====================
export const Card = (props: CardProps): JSX.Element => {
  // 解构属性
  const { children, heading, styles, actionButtons } = props;
  
  return (
    <ErrorBoundary title={heading}>
      <StyledCard styles={styles}>
        {/* 如果有操作按钮，则渲染 */}
        { actionButtons && actionButtons }
        
        {/* 如果有标题，则渲染 */}
        { heading && <Heading className="inner-heading" as="h3" align="left" color={colors.primary}>{heading}</Heading> }
        
        {/* 渲染卡片内容 */}
        {children}
      </StyledCard>
    </ErrorBoundary>
  );
}

// 导出样式化卡片组件
export default StyledCard;
