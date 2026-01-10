// ==================== 导入依赖 ====================
import { useEffect, useState } from 'react';  // React 钩子：副作用和状态管理
import styled from '@emotion/styled';  // Emotion 样式库
import { Card } from 'web-check-live/components/Form/Card';  // 卡片组件
import Row from 'web-check-live/components/Form/Row';  // 数据行组件
import colors from 'web-check-live/styles/colors';  // 颜色主题配置

// ==================== 学习更多信息样式组件 ====================
// 用于显示额外的学习资源和链接
const LearnMoreInfo = styled.p`
font-size: 0.8rem;  // 字体大小
margin-top: 0.5rem;  // 上边距
opacity: 0.75;  // 75% 不透明度
a { color: ${colors.primary}; }  // 链接使用主题色
`;

// ==================== 碳足迹卡片组件 ====================
// 显示网站的碳足迹和能源使用数据
const CarbonCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const carbons = props.data.statistics;  // 获取本地计算的碳足迹统计
  const initialUrl = props.data.scanUrl;  // 获取扫描的 URL

  // ==================== 状态管理 ====================
  // carbonData: 从外部 API 获取的碳足迹数据
  const [carbonData, setCarbonData] = useState<{c?: number, p?: number}>({});

  // ==================== 获取外部碳足迹数据 ====================
  // 使用 useEffect 在组件挂载时从 websitecarbon.com API 获取数据
  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        // 向 websitecarbon.com API 发送请求
        const response = await fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(initialUrl)}`);
        const data = await response.json();  // 解析 JSON 响应
        setCarbonData(data);  // 设置碳足迹数据
      } catch (error) {
        console.error('Error fetching carbon data:', error);  // 记录错误
      }
    };
    fetchCarbonData();  // 执行数据获取
  }, [initialUrl]);  // 依赖项：当 initialUrl 变化时重新获取

  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      
      {/* 如果本地和外部数据都不可用，显示提示信息 */}
      { (!carbons?.adjustedBytes && !carbonData.c) && <p>Unable to calculate carbon footprint for host</p>}
      
      {/* 显示本地计算的碳足迹数据 */}
      { carbons?.adjustedBytes > 0 && <>
        <Row lbl="HTML Initial Size" val={`${carbons.adjustedBytes} bytes`} />  {/* HTML 初始大小 */}
        <Row lbl="CO2 for Initial Load" val={`${(carbons.co2.grid.grams * 1000).toPrecision(4)} grams`} />  {/* 初始加载的 CO2 排放量（克） */}
        <Row lbl="Energy Usage for Load" val={`${(carbons.energy * 1000).toPrecision(4)} KWg`} />  {/* 加载能耗（千瓦时） */}
      </>}
      
      {/* 显示外部 API 获取的碳足迹数据 */}
      {carbonData.c && <Row lbl="CO2 Emitted" val={`${carbonData.c} grams`} />}  {/* CO2 排放量（克） */}
      {carbonData.p && <Row lbl="Better than average site by" val={`${carbonData.p}%`} />}  {/* 比平均网站好多少百分比 */}
      
      <br />
      
      {/* 学习更多信息的链接 */}
      <LearnMoreInfo>Learn more at <a href="https://www.websitecarbon.com/">websitecarbon.com</a></LearnMoreInfo>
    </Card>
  );
}

export default CarbonCard;  // 导出碳足迹卡片组件
