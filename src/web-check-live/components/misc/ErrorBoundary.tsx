// ==================== 导入依赖模块 ====================
import React, { Component, type ErrorInfo, type ReactNode } from "react";  // React 核心模块和类型定义
import styled from '@emotion/styled';  // Emotion 样式库
import Card from 'web-check-live/components/Form/Card';  // 导入卡片组件
import Heading from 'web-check-live/components/Form/Heading';  // 导入标题组件
import colors from 'web-check-live/styles/colors';  // 导入颜色主题配置

// ==================== 错误边界组件属性接口 ====================
// 定义错误边界组件的可配置属性
interface Props {
  children: ReactNode;  // 子组件
  title?: string;  // 可选的标题
  key?: string;  // 可选的键值
}

// ==================== 错误边界组件状态接口 ====================
// 定义错误边界组件的状态
interface State {
  hasError: boolean;  // 是否发生错误
  errorMessage: string | null;  // 错误消息
}

// ==================== 错误文本样式组件 ====================
// 设置错误文本的颜色为危险色
const ErrorText = styled.p`
  color: ${colors.danger};
`;

// ==================== 错误边界组件 ====================
// 捕获子组件树中的 JavaScript 错误并显示回退 UI
class ErrorBoundary extends Component<Props, State> {
  // ==================== 初始化状态 ====================
  // 设置初始状态为无错误
  public state: State = {
    hasError: false,
    errorMessage: null
  };

  // ==================== 捕获错误并更新状态 ====================
  // 当子组件抛出错误时，更新状态以显示错误 UI
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  // ==================== 记录错误信息 ====================
  // 在控制台输出错误详情，便于调试
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // ==================== 渲染组件 ====================
  // 根据错误状态决定渲染错误 UI 或子组件
  public render() {
    if (this.state.hasError) {
      // ==================== 错误状态 UI ====================
      // 显示错误信息和可能的错误详情
      return (
        <Card>
          {/* 如果提供了标题，显示标题 */}
          { this.props.title && <Heading color={colors.primary}>{this.props.title}</Heading> }
          
          {/* 显示主要错误消息 */}
          <ErrorText>This component errored unexpectedly</ErrorText>
          
          {/* 显示错误说明和建议 */}
          <p>
            Usually this happens if the result from the server was not what was expected.
            Check the logs for more info. If you continue to experience this issue, please raise a ticket on the repository.
          </p>
          
          {/* 如果有错误消息，显示可折叠的错误详情 */}
          {
            this.state.errorMessage &&
            <details>
              <summary>Error Details</summary>
              <div>{this.state.errorMessage}</div>
            </details>
          }
        </Card>
      );
    }

    // ==================== 正常状态 UI ====================
    // 如果没有错误，渲染子组件
    return this.props.children;
  }
}

export default ErrorBoundary;
