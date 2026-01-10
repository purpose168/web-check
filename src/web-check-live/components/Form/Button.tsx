// 导入 React 类型定义
import { type ReactNode, type MouseEventHandler } from 'react';

// 导入 Emotion 的 styled 组件，用于创建样式化组件
import styled from '@emotion/styled';
// 导入 Emotion 的 keyframes 函数，用于创建动画
import { keyframes } from '@emotion/react';
// 导入颜色配置
import colors from 'web-check-live/styles/colors';
// 导入尺寸相关的类型和工具函数
import { type InputSize, applySize } from 'web-check-live/styles/dimensions';

// ==================== 类型定义 ====================

// 加载状态类型
type LoadState = 'loading' | 'success' | 'error';

// 按钮属性接口
interface ButtonProps {
  children: ReactNode;  // 按钮内容
  onClick?: MouseEventHandler<HTMLButtonElement>;  // 点击事件处理函数
  size?: InputSize,  // 按钮尺寸
  bgColor?: string,  // 背景色
  fgColor?: string,  // 前景色（文字颜色）
  styles?: string,  // 自定义样式
  title?: string,  // 标题（用于 tooltip）
  type?: 'button' | 'submit' | 'reset' | undefined,  // 按钮类型
  loadState?: LoadState,  // 加载状态
};

// ==================== 样式化组件定义 ====================

// 按钮样式化组件
const StyledButton = styled.button<ButtonProps>`
  cursor: pointer;  // 鼠标指针为手型
  border: none;  // 无边框
  border-radius: 0.25rem;  // 圆角
  font-family: PTMono;  // 字体为 PTMono（等宽字体）
  box-sizing: border-box;  // 盒模型为 border-box
  width: -moz-available;  // 宽度自适应（Firefox）
  display: flex;  // 使用 Flexbox 布局
  justify-content: center;  // 水平居中
  gap: 1rem;  // 元素之间的间距
  box-shadow: 3px 3px 0px ${colors.fgShadowColor};  // 阴影效果
  
  // 鼠标悬停状态：阴影变大
  &:hover {
    box-shadow: 5px 5px 0px ${colors.fgShadowColor};
  }
  
  // 鼠标按下状态：阴影反向
  &:active {
    box-shadow: -3px -3px 0px ${colors.fgShadowColor};
  }
  
  // 应用尺寸样式
  ${props => applySize(props.size)};
  
  // 背景色：如果有自定义背景色则使用，否则使用主色
  ${(props) => props.bgColor ?
    `background: ${props.bgColor};` : `background: ${colors.primary};`
  }
  
  // 前景色：如果有自定义前景色则使用，否则使用背景色
  ${(props) => props.fgColor ?
    `color: ${props.fgColor};` : `color: ${colors.background};`
  }
  
  // 应用自定义样式
  ${props => props.styles}
`;

// ==================== 动画定义 ====================

// 旋转动画关键帧
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }  // 起始：0 度
  100% { transform: rotate(360deg); }  // 结束：360 度
`;

// 简单加载器样式化组件
const SimpleLoader = styled.div`
  border: 4px solid rgba(255,255,255, 0.3);  // 边框（半透明白色）
  border-radius: 50%;  // 圆形
  border-top: 4px solid ${colors.background};  // 顶部边框（背景色）
  width: 1rem;  // 宽度
  height: 1rem;  // 高度
  animation: ${spinAnimation} 1s linear infinite;  // 旋转动画（1 秒线性无限循环）
`;

// ==================== 加载器组件 ====================
const Loader = (props: { loadState: LoadState }) => {
  // 根据加载状态渲染不同的图标
  if (props.loadState === 'loading') return <SimpleLoader />  // 加载中：显示旋转动画
  if (props.loadState === 'success') return <span>✔</span>  // 成功：显示勾选符号
  if (props.loadState === 'error') return <span>✗</span>  // 错误：显示叉号
  return <span></span>;  // 默认：空元素
};

// ==================== 按钮组件 ====================
const Button = (props: ButtonProps): JSX.Element => {
  // 解构属性
  const { children, size, bgColor, fgColor, onClick, styles, title, loadState, type } = props;
  
  return (
    <StyledButton
      onClick={onClick || (() => null) }  // 点击事件处理函数（默认为空函数）
      size={size}  // 尺寸
      bgColor={bgColor}  // 背景色
      fgColor={fgColor}  // 前景色
      styles={styles}  // 自定义样式
      title={title?.toString()}  // 标题（转换为字符串）
      type={type || 'button'}  // 按钮类型（默认为 button）
      >
      {/* 如果有加载状态，则渲染加载器 */}
      { loadState && <Loader loadState={loadState} /> }
      {/* 渲染按钮内容 */}
      {children}
    </StyledButton>
  );
};

// 导出按钮组件
export default Button;
