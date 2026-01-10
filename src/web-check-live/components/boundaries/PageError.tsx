// 导入 React 核心库
import React from 'react';
// 导入 Emotion 的 styled 组件，用于创建样式化组件
import styled from '@emotion/styled';

// 导入颜色配置
import colors from 'web-check-live/styles/colors';
// 导入标题组件
import Heading from 'web-check-live/components/Form/Heading';
// 导入页脚组件
import Footer from 'web-check-live/components/misc/Footer';
// 导入导航组件
import Nav from 'web-check-live/components/Form/Nav';
// 导入按钮组件
import Button from 'web-check-live/components/Form/Button';
// 导入卡片组件的样式化组件
import { StyledCard } from 'web-check-live/components/Form/Card';
// 导入 React Router 的 Link 组件，用于路由导航
import { Link } from 'react-router-dom';

// ==================== 错误边界状态接口 ====================
interface ErrorBoundaryState {
  hasError: boolean;  // 是否发生错误
  errorCount: number;  // 错误计数
  errorMessage: string | null;  // 错误消息
}

// ==================== 错误边界属性接口 ====================
interface ErrorBoundaryProps {
  children: React.ReactNode;  // 子组件
}

// ==================== 样式化组件定义 ====================

// 错误页面容器样式
const ErrorPageContainer = styled.div`
width: 95vw;  // 宽度为视口宽度的 95%
max-width: 1000px;  // 最大宽度
margin: 2rem auto;  // 上下外边距 2rem，水平居中
padding-bottom: 1rem;  // 底部内边距
header {
  margin 1rem 0;  // header 的外边距
  width: auto;  // 宽度自适应
}
section {
  width: auto;  // 宽度自适应
  .inner-heading { display: none; }  // 隐藏内部标题
}
`;

// 头部链接容器样式
const HeaderLinkContainer = styled.nav`
  display: flex;  // 使用 Flexbox 布局
  flex-wrap: wrap;  // 允许换行
  gap: 1rem;  // 链接之间的间距
  a {
    text-decoration: none;  // 移除下划线
  }
`;

// 错误内部容器样式
const ErrorInner = styled(StyledCard)`
  display: flex;  // 使用 Flexbox 布局
  flex-direction: column;  // 垂直方向排列
  align-items: center;  // 水平居中
  gap: 0.5rem;  // 元素之间的间距
  h3 { font-size: 6rem; }  // h3 标题的字体大小
`;

// 错误详情容器样式
const ErrorDetails = styled.div`
  background: ${colors.primaryTransparent};  // 背景色（半透明主色）
  padding: 1rem;  // 内边距
  border-radius: 0.5rem;  // 圆角
`;

// 错误消息文本样式
const ErrorMessageText = styled.p`
  color: ${colors.danger};  // 文字颜色（危险色）
`;

// ==================== 错误边界组件 ====================
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // 构造函数
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // 初始化状态
    this.state = { hasError: false, errorCount: 0, errorMessage: null };
  }

  // 静态方法：从错误派生状态
  // 在渲染阶段调用，用于更新状态
  static getDerivedStateFromError(err: Error): ErrorBoundaryState {
    return { hasError: true, errorCount: 0, errorMessage: err.message };
  }
  

  // 组件捕获错误时调用
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 在控制台输出未捕获的错误
    console.error("Uncaught error:", error, errorInfo);
    
    // 在控制台输出格式化的错误信息
    console.error(
      `%cCritical Error%c\n\nRoute or component failed to mount%c:%c\n`
      +`${this.state.errorCount < 1? 'Will attempt a page reload' : ''}. `
      + `Error Details:\n${error}\n\n${JSON.stringify(errorInfo || {})}`,
      `background: ${colors.danger}; color:${colors.background}; padding: 4px 8px; font-size: 16px;`,  // 第一个 %c 的样式（红色背景）
      `font-weight: bold; color: ${colors.danger};`,  // 第二个 %c 的样式（粗体红色）
      `color: ${colors.danger};`,  // 第三个 %c 的样式（红色）
      `color: ${colors.warning};`,  // 第四个 %c 的样式（警告色）
    );
    
    // 如果错误计数小于 1，则尝试重新加载页面
    if (this.state.errorCount < 1) {
      this.setState(prevState => ({ errorCount: prevState.errorCount + 1 }));
      window.location.reload();
    }
  }

  // 渲染方法
  render() {
    // 如果发生错误，则渲染错误页面
    if (this.state.hasError) {
      return (
        <ErrorPageContainer>
          {/* 导航栏 */}
          <Nav>
            <HeaderLinkContainer>
              {/* 返回首页按钮 */}
              <Link to="/"><Button>Go back Home</Button></Link>
              {/* 查看 GitHub 按钮 */}
              <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check"><Button>View on GitHub</Button></a>
            </HeaderLinkContainer>
          </Nav>
          
          {/* 错误信息容器 */}
          <ErrorInner>
            {/* 主标题 */}
            <Heading as="h1" size="medium" color={colors.primary}>Something's gone wrong</Heading>
            {/* 副标题 */}
            <Heading as="h2" size="small" color={colors.textColor}>An unexpected error occurred.</Heading>
            {/* 错误图标 */}
            <Heading as="h3" size="large" color={colors.textColor}>🤯</Heading>
            
            {/* 错误详情 */}
            <ErrorDetails>
              <p>
                We're sorry this happened.
                Usually reloading the page will resolve this, but if it doesn't, please raise a bug report.
              </p>
              
              {/* 如果有错误消息，则显示 */}
              {this.state.errorMessage && (
              <p>
                Below is the error message we received:<br /><br />
                <ErrorMessageText>{this.state.errorMessage}</ErrorMessageText>
              </p>
              )}
            </ErrorDetails>
            
            {/* 重新加载页面按钮 */}
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
            {/* 报告问题链接 */}
            <a target="_blank" rel="noreferrer" href="github.com/lissy93/web-check/issues/choose">
              Report Issue
            </a>
          </ErrorInner>
          
          {/* 固定页脚 */}
          <Footer isFixed={true} />
        </ErrorPageContainer>
      );
    }

    // 如果没有错误，则渲染子组件
    return this.props.children;
  }
}

// 导出错误边界组件
export default ErrorBoundary;
