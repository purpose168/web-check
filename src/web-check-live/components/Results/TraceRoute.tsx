// ==================== 导入依赖 ====================
import styled from '@emotion/styled';  // Emotion 样式库，用于创建样式化组件
import colors from 'web-check-live/styles/colors';  // 颜色主题配置
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件

// ==================== 路由行样式组件 ====================
// 显示单个路由节点的 IP 地址
const RouteRow = styled.div`
  text-align: center;  // 文本居中对齐
  width: fit-content;  // 宽度适应内容
  margin: 0 auto;  // 上下左右自动边距（水平居中）
  .ipName {
    font-size: 1rem;  // IP 地址字体大小为 1rem
  }
`;

// ==================== 路由时间样式组件 ====================
// 显示路由跳数和时间信息
const RouteTimings = styled.div`
p {
  margin: 0 auto;  // 上下左右自动边距（水平居中）
}
.arrow {
  font-size: 2.5rem;  // 箭头字体大小为 2.5rem
  color: ${colors.primary};  // 箭头颜色为主题色
  margin-top: -1rem;  // 上边距为 -1rem（向上偏移）
}
.times {
  font-size: 0.85rem;  // 时间字体大小为 0.85rem
  color: ${colors.textColorSecondary};  // 时间颜色为次要文本色
}
.completed {
  text-align: center;  // 完成消息居中对齐
  font-weight: bold;  // 字体加粗
}
`;

// ==================== 卡片样式 ====================
const cardStyles = ``;

// ==================== 路由追踪卡片组件 ====================
// 显示从源到目标服务器的网络路由路径
// 路由追踪（Traceroute）是一种网络诊断工具，用于确定数据包在互联网上传输的路径
// 工作原理：
// 1. 发送 TTL（Time To Live）递增的数据包
// 2. 每个路由器在转发数据包时将 TTL 减 1
// 3. 当 TTL 为 0 时，路由器返回 ICMP 超时消息
// 4. 通过分析返回消息，确定路径上的每个路由器
// Props 说明：
// - data: 路由追踪数据对象，包含：
//   - result: 路由数组，每个元素包含 IP 地址和时间信息
//   - timeTaken: 总耗时（毫秒）
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 每个路由节点的 IP 地址
// 2. 每个数据包的传输时间
// 3. 总往返时间
const TraceRouteCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  const traceRouteResponse = props.data;  // 获取路由追踪响应数据
  const routes = traceRouteResponse.result;  // 获取路由数组
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {/* 遍历并显示每个路由节点 */}
      {routes.filter((x: any) => x).map((route: any, index: number) => (
          <RouteRow key={index}>
            {/* 显示 IP 地址 */}
            <span className="ipName">{Object.keys(route)[0]}</span>
            <RouteTimings>
              {/* 显示每个数据包的传输时间 */}
              {route[Object.keys(route)[0]].map((time: any, packetIndex: number) => (
                <p className="times" key={`timing-${packetIndex}-${time}`}>
                  { route[Object.keys(route)[0]].length > 1 && (<>Packet #{packetIndex + 1}:</>) }  {/* 如果有多个数据包，显示数据包编号 */}
                  Took {time} ms  {/* 显示传输时间（毫秒） */}
                </p>
              ))}
              <p className="arrow">↓</p>  {/* 向下箭头，指示路由方向 */}
            </RouteTimings>
          </RouteRow>
        )
      )}
      <RouteTimings>
        {/* 显示总往返时间 */}
        <p className="completed">
          Round trip completed in {traceRouteResponse.timeTaken} ms
        </p>
      </RouteTimings>
    </Card>
  );
}

export default TraceRouteCard;
