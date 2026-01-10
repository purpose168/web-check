import { Global, css } from '@emotion/react';

// 全局样式组件，定义应用程序的全局CSS样式
const GlobalStyles = () => (
  <Global
    styles={css`
    // 定义自定义字体PTMono
    @font-face {
      font-family: PTMono;
      font-style: normal;
      font-weight: 400;
      src: url('/fonts/PTMono.ttf') format('ttf');
    }
    // 为所有文本元素设置字体和颜色
    body, div, a, p, span, ul, li, small, h1, h2, h3, h4, button, section {
      font-family: PTMono;
      color: #fff;
    }
    // 为背景装饰区域中的文本设置透明颜色
    #fancy-background p span {
      color: transparent;
    }
    `}
  />
);

export default GlobalStyles;
