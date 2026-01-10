import React from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import Button from 'web-check-live/components/Form/Button';

// ==================== 模态框组件属性接口 ====================
// 定义模态框组件的可配置属性
interface ModalProps {
  children: ReactNode;  // 模态框内容（子元素）
  isOpen: boolean;  // 模态框是否打开
  closeModal: () => void;  // 关闭模态框的回调函数
}

// ==================== 遮罩层组件 ====================
// 半透明黑色背景，覆盖整个视口，用于聚焦模态框内容
const Overlay = styled.div`
  position: fixed;  // 固定定位，相对于视口
  top: 0;  // 顶部对齐
  bottom: 0;  // 底部对齐
  left: 0;  // 左侧对齐
  right: 0;  // 右侧对齐
  display: flex;  // 使用 Flexbox 布局
  justify-content: center;  // 水平居中
  align-items: center;  // 垂直居中
  background-color: rgba(0, 0, 0, 0.5);  // 半透明黑色背景（50% 不透明度）
  animation: fadeIn 0.5s;  // 淡入动画（0.5 秒）
  
  @keyframes fadeIn {  // 淡入动画关键帧
    0% {opacity: 0;}  // 初始状态：完全透明
    100% {opacity: 1;}  // 结束状态：完全不透明
  }
`;

// ==================== 模态框窗口组件 ====================
// 模态框的主要内容区域，包含标题、内容和关闭按钮
const ModalWindow = styled.div`
  width: 80%;  // 宽度为视口的 80%
  max-width: 500px;  // 最大宽度 500px
  background: ${colors.backgroundLighter};  // 背景色使用较浅的主题背景色
  padding: 2rem;  // 内边距 2rem
  border-radius: 12px;  // 圆角 12px
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  // 柔和阴影效果
  position: relative;  // 相对定位
  animation: appear 0.5s;  // 出现动画（0.5 秒）
  color: ${colors.textColor};  // 文字颜色使用主题文字色
  box-shadow: 4px 4px 0px ${colors.bgShadowColor};  // 右下阴影效果
  max-height: 80%;  // 最大高度为视口的 80%
  overflow-y: auto;  // 内容溢出时显示垂直滚动条
  @keyframes appear {  // 出现动画关键帧
    0% {opacity: 0; transform: scale(0.9);}  // 初始状态：透明且缩小到 90%
    100% {opacity: 1; transform: scale(1);}  // 结束状态：完全不透明且正常大小
  }
  pre {  // 预格式化文本样式
    white-space: break-spaces;  // 保留空白符，允许换行
  }
`;

// ==================== 模态框组件 ====================
// 可复用的模态框组件，支持遮罩层点击关闭和 ESC 键关闭
const Modal: React.FC<ModalProps> = ({ children, isOpen, closeModal }) => {
  // 处理遮罩层点击事件
  // 只有点击遮罩层本身（而非模态框窗口）时才关闭模态框
  const handleOverlayClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // 使用 useEffect 监听 ESC 键按下事件
  React.useEffect(() => {
    const handleEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {  // 按下 ESC 键时关闭模态框
        closeModal();
      }
    };

    if (isOpen) {  // 仅在模态框打开时添加事件监听器
      window.addEventListener('keydown', handleEscPress);
    }

    // 清理函数：移除事件监听器
    return () => {
      window.removeEventListener('keydown', handleEscPress);
    };
  }, [isOpen, closeModal]);  // 依赖项：isOpen 和 closeModal

  // 模态框关闭时不渲染任何内容
  if (!isOpen) {
    return null;
  }

  // 使用 ReactDOM.createPortal 将模态框渲染到 document.body
  // 这样可以避免 CSS 层级问题，确保模态框始终在最上层
  return ReactDOM.createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ModalWindow>
        {children}
        <Button onClick={closeModal} styles="width: fit-content;float: right;">Close</Button>
      </ModalWindow>
    </Overlay>,
    document.body,
  );
};

export default Modal;
