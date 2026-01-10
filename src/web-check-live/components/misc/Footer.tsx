// ==================== 导入依赖模块 ====================
import styled from '@emotion/styled';  // Emotion 样式库
import { Link } from 'react-router-dom';  // React Router 路由链接
import colors from 'web-check-live/styles/colors';  // 导入颜色主题配置

// ==================== 页脚样式组件 ====================
// 定义页脚的样式，包括布局、颜色和交互效果
const StyledFooter = styled.footer`
  bottom: 0;  // 固定在底部
  width: 100%;  // 宽度占满容器
  text-align: center;  // 文本居中
  padding: 0.5rem 0;  // 内边距
  background: ${colors.backgroundDarker};  // 背景色
  display: flex;  // 使用 Flexbox 布局
  justify-content: space-around;  // 水平间距均匀分布
  align-items: center;  // 垂直居中
  align-content: center;  // 内容垂直居中
  flex-wrap: wrap;  // 允许换行
  opacity: 0.75;  // 默认透明度
  transition: all 0.2s ease-in-out;  // 过渡动画
  @media (min-width: 1024px) {  // 大屏幕断点
    justify-content: space-between;  // 两端对齐
  }
  &:hover {  // 鼠标悬停效果
    opacity: 1;  // 完全不透明
  }
  span {
    margin: 0 0.5rem;  // 间距
    text-align: center;  // 文本居中
  }
`;

// ==================== 外部链接样式组件 ====================
// 定义外部链接的样式，包括颜色和悬停效果
const ALink = styled.a`
  color: ${colors.primary};  // 使用主题色
  font-weight: bold;  // 粗体
  border-radius: 4px;  // 圆角
  padding: 0.1rem;  // 内边距
  transition: all 0.2s ease-in-out;  // 过渡动画
  &:hover {  // 鼠标悬停效果
    background: ${colors.primary};  // 背景色为主题色
    color: ${colors.backgroundDarker};  // 文字颜色为深色背景
    text-decoration: none;  // 去掉下划线
  }
`;

// ==================== 页脚组件 ====================
// 应用程序页脚，包含版权信息和链接
const Footer = (props: { isFixed?: boolean }): JSX.Element => {
  const licenseUrl = 'https://github.com/lissy93/web-check/blob/master/LICENSE';  // 许可证 URL
  const authorUrl = 'https://aliciasykes.com';  // 作者 URL
  const githubUrl = 'https://github.com/lissy93/web-check';  // GitHub 仓库 URL
  
  // ==================== 渲染页脚 ====================
  return (
  <StyledFooter style={props.isFixed ? {position: 'fixed'} : {}}>  {/* 根据 isFixed 属性决定是否固定定位 */}
    <span>
      View source at <ALink href={githubUrl}>github.com/lissy93/web-check</ALink>
    </span>
    <span>
      <Link to="/about">Web-Check</Link> is
      licensed under <ALink href={licenseUrl}>MIT</ALink> -
      © <ALink href={authorUrl}>Alicia Sykes</ALink> 2023
    </span>
  </StyledFooter>
  );
}

export default Footer;
