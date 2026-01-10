// ==================== 导入依赖 ====================
import styled from '@emotion/styled';
import Button from 'web-check-live/components/Form/Button';
import colors from 'web-check-live/styles/colors';

// ==================== 操作按钮容器样式组件 ====================
// 绝对定位的按钮容器，位于父元素的右上角
const ActionButtonContainer = styled.div`
  position: absolute;  // 绝对定位
  top: 0.25rem;  // 距离顶部 0.25rem
  right: 0.25rem;  // 距离右侧 0.25rem
  opacity: 0.75;  // 默认透明度 75%
  display: flex;  // 使用 Flexbox 布局
  gap: 0.125rem;  // 按钮间距 0.125rem
  align-items: baseline;  // 基线对齐
`;

// ==================== 操作按钮接口 ====================
// 定义单个操作按钮的属性
interface Action {
    label: string;  // 按钮标签（用于工具提示）
    icon: string;  // 按钮图标（emoji 或 SVG）
    onClick: () => void;  // 点击事件处理函数
};

// ==================== 操作按钮样式字符串 ====================
// 定义操作按钮的通用样式
const actionButtonStyles = `
  padding: 0 0.25rem;  // 左右内边距 0.25rem
  font-size: 1.25rem;  // 字体大小 1.25rem
  text-align: center;  // 文本居中对齐
  width: 1.5rem;  // 宽度 1.5rem
  height: 1.5rem;  // 高度 1.5rem
  color: ${colors.textColor};  // 文本颜色
  background: none;  // 无背景色
  box-shadow: none;  // 无阴影
  transition: all 0.2s ease-in-out;  // 所有属性过渡动画 0.2秒
  margin: 0;  // 无外边距
  display: flex;  // 使用 Flexbox 布局
  align-items: center;  // 垂直居中对齐
  &:hover {
    color: ${colors.primary};  // 悬停时显示主色调
    background: ${colors.backgroundDarker};  // 悬停时背景变暗
    box-shadow: none;  // 无阴影
  }
`;

// ==================== 操作按钮组件 ====================
// 渲染一组操作按钮，支持自定义图标和点击事件
const ActionButtons = (props: { actions: any }): JSX.Element => {
  const actions = props.actions;
  if (!actions) return (<></>);  // 如果没有操作，返回空元素
  return (
    <ActionButtonContainer>
      { actions.map((action: Action, index: number) => 
        <Button
          key={`action-${index}`}
          styles={actionButtonStyles}
          onClick={action.onClick}
          title={action.label}>
            {action.icon}
        </Button>
      )}
    </ActionButtonContainer>
  );
};

export default ActionButtons;
