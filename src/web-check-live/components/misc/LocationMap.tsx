// ==================== 导入依赖 ====================
// 从 react-simple-maps 导入地图组件
import {
  ComposableMap,  // 可组合地图容器组件
  Geographies,  // 地理数据容器组件
  Geography,  // 单个地理区域组件
  Annotation,  // 地图标注组件
} from 'react-simple-maps';

// 导入样式和地图数据
import colors from 'web-check-live/styles/colors';
import MapFeatures from 'web-check-live/assets/data/map-features.json';

// ==================== 地图组件属性接口 ====================
// 定义地图组件的可配置属性
interface Props {
  lat: number,  // 纬度坐标（-90 到 90）
  lon: number,  // 经度坐标（-180 到 180）
  label?: string,  // 位置标签文本（可选，默认为 "Server"）
};

// ==================== 地图组件 ====================
// 显示地理位置的交互式地图组件，使用方位等面积投影
const MapChart = (location: Props) => {
  // 解构属性：纬度、经度和标签
  const { lat, lon, label } = location;

  return (
    <ComposableMap
      projection="geoAzimuthalEqualArea"  // 使用方位等面积投影（适合显示特定区域）
      projectionConfig={{
        rotate: [0, 0, 0],  // 旋转角度：[经度, 纬度, 倾斜]，保持默认不旋转
        center: [lon + 5, lat - 25],  // 地图中心点：将目标位置略微偏移到右下方
        scale: 200  // 缩放比例：200（值越大地图越详细）
      }}
    >
      {/* ==================== 地理区域渲染 ==================== */}
      {/* 渲染世界地图的所有地理区域 */}
      <Geographies
        geography={MapFeatures}  // 地理数据源：包含世界地图的 GeoJSON 数据
        fill={colors.backgroundDarker}  // 区域填充颜色：使用深色背景
        stroke={colors.primary}  // 区域边框颜色：使用主题色
        strokeWidth={0.5}  // 边框宽度：0.5 像素
      >
        {/* 遍历所有地理区域并渲染 */}
        {({ geographies }: any) =>
          geographies.map((geo: any) => (
            <Geography key={geo.rsmKey} geography={geo} />  // 每个地理区域使用其 rsmKey 作为唯一标识
          ))
        }
      </Geographies>

      {/* ==================== 位置标注 ==================== */}
      {/* 在目标位置添加标注和标签 */}
      <Annotation
        subject={[lon, lat]}  // 标注位置：目标经纬度坐标
        dx={-80}  // 标注线 X 轴偏移：向左偏移 80 像素
        dy={-80}  // 标注线 Y 轴偏移：向上偏移 80 像素
        connectorProps={{
          stroke: colors.textColor,  // 标注线颜色：使用文本颜色
          strokeWidth: 3,  // 标注线宽度：3 像素
          strokeLinecap: "round"  // 线条端点样式：圆形
        }}
      >
        {/* 标注文本 */}
        <text x="-8" textAnchor="end" fill={colors.textColor} fontSize={25}>
          {label || "Server"}  {/* 显示标签文本，如果没有提供则显示 "Server" */}
        </text>
      </Annotation>
    </ComposableMap>
  );
};

export default MapChart;  // 导出地图组件
