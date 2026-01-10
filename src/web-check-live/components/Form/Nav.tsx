import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { StyledCard } from 'web-check-live/components/Form/Card';
import Heading from 'web-check-live/components/Form/Heading';
import colors from 'web-check-live/styles/colors';

// ==================== 导航栏头部组件 ====================
// 基于卡片组件的导航栏头部，包含 Logo 和标题
const Header = styled(StyledCard)`
  margin: 1rem auto;  // 上下外边距 1rem，水平居中
  display: flex;  // 使用 Flexbox 布局
  flex-wrap: wrap;  // 允许内容换行
  align-items: baseline;  // 基线对齐
  justify-content: space-between;  // 两端对齐
  padding: 0.5rem 1rem;  // 内边距：上下 0.5rem，左右 1rem
  align-items: center;  // 垂直居中对齐
  width: 95vw;  // 宽度为视口宽度的 95%
`;

// ==================== 导航栏组件 ====================
// 应用程序的主导航栏，包含 Logo、标题和可选的子元素
const Nav = (props: { children?: ReactNode}) => {
  return (
    <Header as="header">
    <Heading color={colors.primary} size="large">
      <img width="64" src="/web-check.png" alt="Web Check Icon" />
      <a href="/" target="_self">Web Check</a>
    </Heading>
      {props.children && props.children}
  </Header>
  );
};

export default Nav;
