
// 文本尺寸常量定义
export const TextSizes = {
  // 超小号文本
  xSmall: '0.75rem',
  // 小号文本
  small: '1rem',
  // 中号文本
  medium: '1.5rem',
  // 大号文本
  large: '2rem',
  // 超大号文本
  xLarge: '3rem',
  // 特大号文本
  xxLarge: '4rem',
};

// 文本样式重置，用于统一文本的默认样式
export const TextReset = `
  font-size: ${TextSizes.small};
  font-family: PTMono, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.38px;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;
