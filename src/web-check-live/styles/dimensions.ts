// 输入框尺寸类型定义
export type InputSize = 'small' | 'medium' | 'large';

// 根据输入尺寸应用相应的样式
export const applySize = (inputSize?: InputSize) => {
  // 定义不同尺寸的具体样式
  const sizeSpecificStyles = {
    // 小尺寸样式
    small: `
      font-size: 1rem;
      border-radius: 0.25rem;
      padding: 0.5rem 1rem;
      margin: 0.5rem;
    `,
    // 中等尺寸样式
    medium: `
      font-size: 1.5rem;
      border-radius: 0.25rem;
      padding: 0.75rem 1.5rem;
      margin: 0.5rem;
    `,
    // 大尺寸样式
    large: `
      font-size: 2rem;
      border-radius: 0.25rem;
      padding: 1rem 1.75rem;
      margin: 0.5rem;
    `,
  };
  // 根据输入尺寸返回对应的样式
  switch (inputSize) {
    case 'small': return sizeSpecificStyles.small;
    case 'medium': return sizeSpecificStyles.medium;
    case 'large': return sizeSpecificStyles.large;
    default: return sizeSpecificStyles.small;
  }
};
