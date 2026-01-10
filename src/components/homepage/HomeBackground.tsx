// 导入 React 的 useState 和 useEffect hooks
import { useState, useEffect } from 'react';
// 导入 framer-motion 的 motion 组件，用于动画效果
import { motion } from 'framer-motion';
// 导入 @emotion/styled 用于创建样式化组件
import styled from '@emotion/styled';

// ==================== 全局动画配置常量 ====================
const dotSpacing = 32; // 点之间的间距（像素）
const meteorCount = 4; // 同时显示的流星数量
const tailLength = 80; // 流星尾迹的长度（像素）
const distanceBase = 5; // 流星移动的基础距离（网格单位）
const distanceVariance = 5; // 流星移动距离的随机变化量（网格单位）
const durationBase = 1.5; // 流星移动的基础持续时间（秒）
const durationVariance = 1; // 流星移动持续时间的随机变化量（秒）
const delayBase = 500; // 流星重新生成的基础延迟（毫秒）
const delayVariance = 1500; // 流星重新生成延迟的随机变化量（毫秒）
const tailDuration = 0.25; // 流星尾迹收缩的持续时间（秒）
const headEasing = [0.8, 0.6, 1, 1]; // 流星头部的缓动函数（贝塞尔曲线）
const tailEasing = [0.5, 0.6, 0.6, 1]; // 流星尾迹的缓动函数（贝塞尔曲线）

// ==================== 样式化组件定义 ====================

// 流星容器组件：使用 motion.div 创建可动画的 div
const MeteorContainer = styled(motion.div)`
  position: absolute;  // 绝对定位
  width: 4px;          // 宽度为 4px
  height: 4px;         // 高度为 4px
  border-radius: 50%;  // 圆形（50% 圆角）
  background-color: #9fef00;  // 背景色为亮绿色
  top: 1px;            // 顶部位置为 1px
`;

// 流星尾迹组件：使用 motion.div 创建可动画的尾迹
const Tail = styled(motion.div)`
  position: absolute;  // 绝对定位
  top: -80px;         // 顶部位置为 -80px（向上偏移）
  left: 1px;          // 左侧位置为 1px
  width: 2px;          // 宽度为 2px
  height: 80px;        // 高度为 80px
  background: linear-gradient(to bottom, transparent, #9fef00);  // 从透明到亮绿色的渐变
`;

// SVG 组件：用于绘制点阵网格
const StyledSvg = styled.svg`
  pointer-events: none;  // 禁用鼠标事件（允许点击穿透）
  position: absolute;    // 绝对定位
  inset: 0;              // 上下左右都为 0（填充父容器）
  height: 100%;          // 高度为 100%
  width: 100%;           // 宽度为 100%
  fill: rgba(100, 100, 100, 0.5);  // 填充色为半透明灰色
  height: 100vh;         // 高度为视口高度的 100%
`;

// SVG 矩形组件：用于填充点阵图案
const StyledRect = styled.rect`
  width: 100%;           // 宽度为 100%
  height: 100%;          // 高度为 100%
  stroke-width: 0;       // 边框宽度为 0
`;

// 主容器组件：包含所有背景元素
const Container = styled.div`
  pointer-events: none;  // 禁用鼠标事件（允许点击穿透）
  position: absolute;    // 绝对定位
  height: 100vh;        // 高度为视口高度的 100%
  width: 100vw;          // 宽度为视口宽度的 100%
  z-index: 1;           // 层级为 1
  top: 0;                // 顶部位置为 0
  left: 0;               // 左侧位置为 0
  background: radial-gradient(circle at center top, transparent, transparent 60%, var(--background) 100%);  // 径向渐变背景
  // 从中心顶部开始，透明 -> 透明（60%） -> 背景色（100%）
`;

// ==================== 流星生成函数 ====================

// 生成单个流星对象
// @param id - 流星的唯一标识符
// @param gridSizeX - 网格的列数
// @param gridSizeY - 网格的行数
// @returns 流星对象，包含位置、持续时间、动画状态等信息
const generateMeteor = (id: number, gridSizeX: number, gridSizeY: number) => {
  // 随机选择一列（0 到 gridSizeX - 1）
  const column = Math.floor(Math.random() * gridSizeX);
  // 随机选择起始行（0 到 gridSizeY - 12，留出底部空间）
  const startRow = Math.floor(Math.random() * (gridSizeY - 12));
  // 计算移动距离：基础距离 + 随机变化量
  const travelDistance = distanceBase + Math.floor(Math.random() * distanceVariance);
  // 计算持续时间：基础持续时间 + 随机变化量
  const duration = durationBase +  Math.floor(Math.random() * durationVariance);

  // 返回流星对象
  return {
    id,                          // 流星 ID
    column,                      // 所在列
    startRow,                    // 起始行
    endRow: startRow + travelDistance,  // 结束行
    duration,                    // 移动持续时间（秒）
    tailVisible: true,           // 尾迹是否可见
    animationStage: 'traveling', // 动画阶段：traveling（移动中）、retractingTail（收缩尾迹）、resetting（重置）
    opacity: 1,                  // 透明度
  };
};

// 生成初始流星数组
// @param gridSizeX - 网格的列数
// @param gridSizeY - 网格的行数
// @returns 流星数组，确保每个流星在不同的列
const generateInitialMeteors = (gridSizeX: number, gridSizeY: number) => {
  // 使用 Set 记录已使用的列，避免流星在同一列
  const seen = new Set();
  // 生成流星数组，过滤掉重复列的流星
  return Array.from({ length: meteorCount }, (_, index) => generateMeteor(index, gridSizeX, gridSizeY))
    .filter(item => !seen.has(item.column) && seen.add(item.column));
};

// ==================== 主组件 ====================

// WebCheck 主页背景组件
// 功能：显示点阵网格背景和动画流星效果
const WebCheckHomeBackground = () => {
  // 状态：网格的列数（根据窗口宽度计算）
  const [gridSizeX, setGridSizeX] = useState(Math.floor(window.innerWidth / dotSpacing));
  // 状态：网格的行数（根据窗口高度计算）
  const [gridSizeY, setGridSizeY] = useState(Math.floor(window.innerHeight / dotSpacing));
  // 状态：流星数组（使用函数式初始化，避免重复计算）
  const [meteors, setMeteors] = useState(() => generateInitialMeteors(gridSizeX, gridSizeY));

  // 处理动画完成事件
  // @param id - 完成动画的流星 ID
  const handleAnimationComplete = (id: number) => {
    setMeteors(current =>
      current.map(meteor => {
        // 找到对应的流星
        if (meteor.id === id) {
          // 如果当前是移动阶段，切换到收缩尾迹阶段
          if (meteor.animationStage === 'traveling') {
            // Transition to retracting tail
            return { ...meteor, tailVisible: false, animationStage: 'retractingTail' };
          } 
          // 如果当前是收缩尾迹阶段，切换到重置阶段
          else if (meteor.animationStage === 'retractingTail') {
            // Set to resetting and make invisible
            return { ...meteor, animationStage: 'resetting', opacity: 0 };
          } 
          // 如果当前是重置阶段，重新生成流星
          else if (meteor.animationStage === 'resetting') {
            // Respawn the meteor after a delay
            setTimeout(() => {
              setMeteors(current =>
                current.map(m => m.id === id ? generateMeteor(id, gridSizeX, gridSizeY) : m)
              );
            }, delayBase + Math.random() * delayVariance);
          }
        }
        return meteor;
      })
    );
  };

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 重新计算网格尺寸
      setGridSizeX(Math.floor(window.innerWidth / dotSpacing));
      setGridSizeY(Math.floor(window.innerHeight / dotSpacing));
    };
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 清理函数：移除监听器
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ==================== 渲染部分 ====================

  return (
    <>

      <Container />
      

      <StyledSvg>
        <defs>
          {/* 定义点阵图案 */}
          <pattern id="dot-pattern" width={dotSpacing} height={dotSpacing} patternUnits="userSpaceOnUse">
            {/* 每个点是一个圆形，半径为 2px */}
            <circle cx={1} cy={1} r={2} />
          </pattern>
        </defs>
        {/* 填充点阵图案 */}
        <StyledRect fill="url(#dot-pattern)" />
      </StyledSvg>

      {/* 渲染所有流星 */}
      {meteors.map(({ id, column, startRow, endRow, duration, tailVisible, animationStage, opacity }) => {
        return (
        <MeteorContainer
          key={id}
          // 初始状态：起始位置
          initial={{
            x: column * dotSpacing,          // X 坐标：列号 × 点间距
            y: startRow * dotSpacing,        // Y 坐标：起始行 × 点间距
            opacity: 1,                      // 初始透明度为 1
          }}
          // 动画状态：根据动画阶段设置目标状态
          animate={{
            opacity: tailVisible ? 1 : 0,    // 尾迹可见时透明度为 1，否则为 0
            y: animationStage === 'resetting' ? startRow * dotSpacing : endRow * dotSpacing,  // Y 坐标：重置时回到起点，否则移动到终点
          }}
          // 动画过渡配置
          transition={{
            duration: animationStage === 'resetting' ? 0 : duration,  // 重置时立即完成（0 秒），否则使用计算出的持续时间
            ease: headEasing,  // 使用头部缓动函数
          }}
          // 动画完成时的回调
          onAnimationComplete={() => handleAnimationComplete(id)}
        >
          {/* 流星尾迹 */}
          <Tail
            // 初始状态：尾迹向上延伸
            initial={{ top: `-${tailLength}px`, height: `${tailLength}px` }}
            // 动画状态：根据尾迹可见性设置
            animate={{ top: tailVisible ? `-${tailLength}px` : 0, height: tailVisible ? `${tailLength}px` : 0 }}
            // 动画过渡配置
            transition={{
              duration: tailDuration,  // 使用尾迹收缩持续时间
              ease: tailEasing,        // 使用尾迹缓动函数
            }}
          />
        </MeteorContainer>
        );
      })}
    </>
  );
};

export default WebCheckHomeBackground;
