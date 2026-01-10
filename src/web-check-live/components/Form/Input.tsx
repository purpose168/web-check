import { type InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import { type InputSize, applySize } from 'web-check-live/styles/dimensions';

// ==================== 方向类型定义 ====================
// 定义输入框和标签的排列方向
type Orientation = 'horizontal' | 'vertical';

// ==================== 输入框组件属性接口 ====================
// 定义输入框组件的可配置属性
interface Props {
  id: string,  // 输入框的唯一标识符
  value: string,  // 输入框的当前值
  name?: string,  // 输入框的名称（用于表单提交）
  label?: string,  // 输入框的标签文本
  placeholder?: string,  // 占位符文本
  disabled?: boolean,  // 是否禁用输入框
  size?: InputSize,  // 输入框尺寸
  orientation?: Orientation;  // 输入框和标签的排列方向
  handleChange: (nweVal: React.ChangeEvent<HTMLInputElement>) => void,  // 值变化时的回调函数
  handleKeyDown?: (keyEvent: React.KeyboardEvent<HTMLInputElement>) => void,  // 按键按下时的回调函数
};

// ==================== 支持的 HTML 元素类型 ====================
// 定义样式化组件支持的 HTML 元素类型
type SupportedElements = HTMLInputElement | HTMLLabelElement | HTMLDivElement;

// ==================== 样式化输入框组件属性接口 ====================
// 扩展 React 的 InputHTMLAttributes 以支持自定义属性
interface StyledInputTypes extends InputHTMLAttributes<SupportedElements> {
  inputSize?: InputSize;  // 输入框尺寸
  orientation?: Orientation;  // 排列方向
};

// ==================== 输入框容器组件 ====================
// 使用 Flexbox 布局，根据方向属性调整标签和输入框的排列方式
const InputContainer = styled.div<StyledInputTypes>`
  display: flex;  // 使用 Flexbox 布局
  ${props => props.orientation === 'vertical' ? 'flex-direction: column;' : ''};  // 垂直方向时改为列布局
`;

// ==================== 样式化输入框组件 ====================
// 自定义样式的输入框，支持主题颜色和尺寸
const StyledInput = styled.input<StyledInputTypes>`
  background: ${colors.background};  // 背景色使用主题背景色
  color: ${colors.textColor};  // 文字颜色使用主题文字色
  border: none;  // 无边框
  border-radius: 0.25rem;  // 圆角 0.25rem
  font-family: PTMono;  // 使用 PTMono 等宽字体
  box-shadow: 3px 3px 0px ${colors.backgroundDarker};  // 右下阴影效果
  &:focus {  // 聚焦状态样式
    outline: 1px solid ${colors.primary}  // 显示主色调边框
  }

  ${props => applySize(props.inputSize)};  // 应用尺寸样式
`;

// ==================== 样式化标签组件 ====================
// 输入框的标签文本样式
const StyledLabel = styled.label<StyledInputTypes>`
  color: ${colors.textColor};  // 文字颜色使用主题文字色
  ${props => applySize(props.inputSize)};  // 应用尺寸样式
  padding: 0;  // 无内边距
  font-size: 1.6rem;  // 字体大小 1.6rem
`;

// ==================== 输入框组件 ====================
// 可配置的输入框组件，支持标签、占位符、禁用状态等功能
const Input = (inputProps: Props): JSX.Element => {

  const { id, value, label, placeholder, name, disabled, size, orientation, handleChange, handleKeyDown } = inputProps;

  return (
  <InputContainer orientation={orientation}>
    { label && <StyledLabel htmlFor={id} inputSize={size}>{ label }</StyledLabel> }
    <StyledInput
      id={id}
      value={value}
      placeholder={placeholder}
      name={name}
      disabled={disabled}
      onChange={handleChange}
      inputSize={size}
      onKeyDown={handleKeyDown || (() => {})}
    />
  </InputContainer>
  );
};

export default Input;
