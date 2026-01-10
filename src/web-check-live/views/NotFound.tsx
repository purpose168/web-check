import styled from '@emotion/styled'; // 导入样式化组件库

import colors from 'web-check-live/styles/colors'; // 导入颜色配置
import Heading from 'web-check-live/components/Form/Heading'; // 导入标题组件
import Footer from 'web-check-live/components/misc/Footer'; // 导入页脚组件
import Nav from 'web-check-live/components/Form/Nav'; // 导入导航组件
import Button from 'web-check-live/components/Form/Button'; // 导入按钮组件
import { StyledCard } from 'web-check-live/components/Form/Card'; // 导入卡片组件

const AboutContainer = styled.div` // 关于页面容器样式
  width: 95vw; // 宽度为视口宽度的95%
  max-width: 1000px; // 最大宽度为1000像素
  margin: 2rem auto; // 上下边距2rem，左右自动居中
  padding-bottom: 1rem; // 底部内边距1rem
  header { // 头部样式
    margin 1rem 0; // 上下边距1rem，左右0
  }
  a { // 链接样式
    color: ${colors.primary}; // 使用主色调
  }
  .im-drink { font-size: 6rem; } // 醉酒表情字体大小6rem
  header { // 头部样式
    width: auto; // 宽度自动
    margin: 1rem; // 外边距1rem
  }
`;

const HeaderLinkContainer = styled.nav` // 头部链接容器样式
  display: flex; // 使用弹性布局
  flex-wrap: wrap; // 允许换行
  gap: 1rem; // 间距1rem
  a { // 链接样式
    text-decoration: none; // 无下划线
  }
`;

const NotFoundInner = styled(StyledCard)` // 未找到页面内部样式
  display: flex; // 使用弹性布局
  flex-direction: column; // 垂直方向排列
  align-items: center; // 水平居中
  margin: 1rem; // 外边距1rem
  gap: 0.5rem; // 间距0.5rem
  h2 { font-size: 8rem; } // 二级标题字体大小8rem
`;


const NotFound = (): JSX.Element => { // 未找到页面组件
  return (
    <>
    <AboutContainer>
    <Nav />
    <NotFoundInner>
      <Heading as="h2" size="large" color={colors.primary}>404</Heading>
      <span className="im-drink">🥴</span>
      <Heading as="h3" size="large" color={colors.primary}>未找到</Heading>
      <HeaderLinkContainer>
        <a href="/"><Button>返回首页</Button></a>
      </HeaderLinkContainer>
      <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">报告问题</a>
    </NotFoundInner>
    </AboutContainer>
    <Footer isFixed={true} />
    </>
  );
};

export default NotFound; // 导出默认组件
