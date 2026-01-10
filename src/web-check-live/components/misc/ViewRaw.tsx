// ==================== 导入依赖 ====================
import React, { useState } from 'react';  // React 核心库和状态钩子
import styled from '@emotion/styled';  // Emotion 样式库
import colors from 'web-check-live/styles/colors';  // 颜色主题配置
import { Card } from 'web-check-live/components/Form/Card';  // 卡片组件
import Button from 'web-check-live/components/Form/Button';  // 按钮组件

// ==================== 卡片样式字符串 ====================
// 定义卡片组件的样式配置
const CardStyles = `
margin: 0 auto 1rem auto;  // 上下左右边距：上0，左右自动，下1rem
width: 95vw;  // 宽度为视口宽度的 95%
position: relative;  // 相对定位
transition: all 0.2s ease-in-out;  // 平滑过渡动画
display: flex;  // 使用 Flexbox 布局
flex-direction: column;  // 垂直排列子元素

// 链接样式
a {
  color: ${colors.primary};  // 使用主题色
}

// 控制按钮区域样式
.controls {
  display: flex;  // 使用 Flexbox 布局
  flex-wrap: wrap;  // 允许换行
  button {
    max-width: 300px;  // 按钮最大宽度
  }
}

// 小字文本样式
small {
  margin-top: 0.5rem;  // 上边距
  font-size: 0.8rem;  // 字体大小
  opacity: 0.5;  // 50% 不透明度
}
`;

// ==================== 内嵌框架样式组件 ====================
// 用于显示 JSON Hero 在线查看器的 iframe 样式
const StyledIframe = styled.iframe`
  width: calc(100% - 2rem);  // 宽度为父容器宽度减去 2rem（左右各 1rem 边距）
  outline: none;  // 无轮廓
  border: none;  // 无边框
  border-radius: 4px;  // 圆角 4 像素
  min-height: 50vh;  // 最小高度为视口高度的 50%
  height: 100%;  // 高度占满父容器
  margin: 1rem;  // 外边距
  background: ${colors.background};  // 背景色
`;

// ==================== 原始数据查看组件 ====================
// 提供查看和下载原始扫描结果的功能
const ViewRaw = (props: { everything: { id: string, result: any}[] }) => {
  
  // ==================== 状态管理 ====================
  // resultUrl: JSON Hero 在线查看器的 URL
  // error: 错误信息（如果有）
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ==================== 生成结果数据 ====================
  // 将所有扫描结果整理为以作业 ID 为键的对象
  const makeResults = () => {
    const result: {[key: string]: any} = {};  // 创建结果对象
    props.everything.forEach((item: {id: string, result: any}) => {
      result[item.id] = item.result;  // 将每个作业的结果按 ID 存储
    });
    return result;  // 返回整理后的结果对象
  };

  // ==================== 获取在线查看链接 ====================
  // 通过 JSON Hero API 创建在线查看链接
  const fetchResultsUrl = async () => {
    const resultContent = makeResults();  // 获取结果内容
    
    // 向 JSON Hero API 发送 POST 请求
    const response = await fetch('https://jsonhero.io/api/create.json', {
      method: 'POST',  // POST 方法
      headers: { 'Content-Type': 'application/json' },  // JSON 内容类型
      body: JSON.stringify({
        title: 'web-check results',  // 结果标题
        content: resultContent,  // 结果内容
        readOnly: true,  // 只读模式
        ttl: 3600,  // 结果保留时间：3600 秒（1 小时）
      })
    });
    
    // 检查响应状态
    if (!response.ok) {
      setError(`HTTP error! status: ${response.status}`);  // 设置错误信息
    } else {
      setError(null);  // 清除错误信息
    }
    
    // 解析响应并设置结果 URL
    await response.json().then(
      (data) => setResultUrl(data.location)  // 从响应中获取 location 字段作为 URL
    )
  };

  // ==================== 下载结果数据 ====================
  // 将结果保存为 JSON 文件下载
  const handleDownload = () => {
    // 创建 Blob 对象，包含格式化的 JSON 数据
    const blob = new Blob([JSON.stringify(makeResults(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);  // 创建临时 URL
    const link = document.createElement('a');  // 创建链接元素
    link.href = url;  // 设置链接地址
    link.download = 'web-check-results.json';  // 设置下载文件名
    link.click();  // 触发点击事件，开始下载
    URL.revokeObjectURL(url);  // 释放临时 URL 对象
  }
  
  // ==================== 渲染组件 ====================
  return (
    <Card heading="View / Download Raw Data" styles={CardStyles}>
      
      {/* 控制按钮区域 */}
      <div className="controls">
        {/* 下载结果按钮 */}
        <Button onClick={handleDownload}>Download Results</Button>
        
        {/* 查看/更新结果按钮 */}
        <Button onClick={fetchResultsUrl}>{resultUrl ? 'Update Results' : 'View Results'}</Button>
        
        {/* 隐藏结果按钮（仅在显示结果时出现） */}
        { resultUrl && <Button onClick={() => setResultUrl('') }>Hide Results</Button> }
      </div>
      
      {/* 显示在线查看器（仅在成功获取 URL 且无错误时） */}
      { resultUrl && !error &&
      <>
        {/* 使用 iframe 嵌入 JSON Hero 查看器 */}
        <StyledIframe title="Results, via JSON Hero" src={resultUrl} />
        
        {/* 显示结果链接 */}
        <small>Your results are available to view <a href={resultUrl}>here</a>.</small>
      </>
      }
      
      {/* 显示错误信息（如果有） */}
      { error && <p className="error">{error}</p> }
      
      {/* 说明文本 */}
      <small>
        These are the raw results generated from your URL, and in JSON format.
        You can import these into your own program, for further analysis.
      </small>
    </Card>
  );
};

export default ViewRaw;  // 导出原始数据查看组件
