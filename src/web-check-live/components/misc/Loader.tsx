// ==================== 导入依赖 ====================
import styled from '@emotion/styled';

// 导入样式组件和工具
import { StyledCard } from 'web-check-live/components/Form/Card';
import Heading from 'web-check-live/components/Form/Heading';
import colors from 'web-check-live/styles/colors';

// ==================== 加载器容器样式组件 ====================
// 继承卡片样式，添加加载动画的特定样式
const LoaderContainer = styled(StyledCard)`
  margin: 0 auto 1rem auto;  // 上下左右边距
  width: 95vw;  // 宽度为视口宽度的 95%
  position: relative;  // 相对定位
  transition: all 0.2s ease-in-out;  // 平滑过渡动画
  display: flex;  // 使用 Flexbox 布局
  justify-content: center;  // 水平居中
  align-items: center;  // 垂直居中
  flex-direction: column;  // 垂直排列子元素
  gap: 2rem;  // 子元素间距
  height: 50vh;  // 高度为视口高度的 50%
  transition: all 0.3s ease-in-out;  // 平滑过渡动画
  
  // 加载时间信息文本样式
  p.loadTimeInfo {
    text-align: center;  // 文本居中
    margin: 0;  // 移除默认边距
    color: ${colors.textColorSecondary};  // 使用次要文本颜色
    opacity: 0.5;  // 半透明
  }
  
  // Flex 布局状态
  &.flex {
    display: flex;  // 显示为 Flexbox
  }
  
  // 完成状态：隐藏加载器
  &.finished {
    height: 0;  // 高度为 0
    overflow: hidden;  // 隐藏溢出内容
    opacity: 0;  // 完全透明
    margin: 0;  // 移除边距
    padding: 0;  // 移除内边距
    svg { width: 0; }  // SVG 宽度为 0
    h4 { font-size: 0; }  // 标题字体大小为 0
  }
  
  // 隐藏状态：完全隐藏
  &.hide {
    display: none;  // 不显示元素
  }
`;

// ==================== SVG 动画样式组件 ====================
// 为 SVG 加载动画添加样式
const StyledSvg = styled.svg`
  width: 200px;  // SVG 宽度
  margin: 0 auto;  // 水平居中
  
  // 路径样式
  path {
    fill: ${colors.primary};  // 使用主题色填充
    
    // 第二个路径：80% 不透明度
    &:nth-of-type(2) { opacity: 0.8; }
    
    // 第三个路径：50% 不透明度
    &:nth-of-type(3) { opacity: 0.5; }
  }
`;

// ==================== 加载器组件 ====================
// 显示数据加载状态的动画指示器
const Loader = (props: { show: boolean }): JSX.Element => {
  return (
  <LoaderContainer className={props.show ? '' : 'finished'}>  {/* 根据 show 属性决定显示或隐藏 */}
    <Heading as="h4" color={colors.primary}>Crunching data...</Heading>  {/* 加载标题 */}
    
    {/* SVG 加载动画：三个旋转的圆弧路径 */}
    <StyledSvg version="1.1" id="L7" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
      
      {/* 第一个旋转路径：顺时针旋转，2 秒一圈 */}
      <path fill="#fff" d="M31.6,3.5C5.9,13.6-6.6,42.7,3.5,68.4c10.1,25.7,39.2,38.3,64.9,28.1l-3.1-7.9c-21.3,8.4-45.4-2-53.8-23.3
        c-8.4-21.3,2-45.4,23.3-53.8L31.6,3.5z">
          <animateTransform 
            attributeName="transform"  // 变换属性
            attributeType="XML"  // 属性类型
            type="rotate"  // 旋转类型
            dur="2s"  // 动画持续时间：2 秒
            from="0 50 50"  // 起始状态：围绕中心点 (50, 50) 旋转 0 度
            to="360 50 50"  // 结束状态：围绕中心点 (50, 50) 旋转 360 度
            repeatCount="indefinite" />  // 无限重复
      </path>
      
      {/* 第二个旋转路径：逆时针旋转，1 秒一圈 */}
      <path fill="#fff" d="M42.3,39.6c5.7-4.3,13.9-3.1,18.1,2.7c4.3,5.7,3.1,13.9-2.7,18.1l4.1,5.5c8.8-6.5,10.6-19,4.1-27.7
      c-6.5-8.8-19-10.6-27.7-4.1L42.3,39.6z">
          <animateTransform 
            attributeName="transform" 
            attributeType="XML" 
            type="rotate"
            dur="1s"  // 动画持续时间：1 秒
            from="0 50 50"  // 起始状态
            to="-360 50 50"  // 结束状态：逆时针旋转 360 度
            repeatCount="indefinite" />  // 无限重复
      </path>
      
      {/* 第三个旋转路径：顺时针旋转，2 秒一圈 */}
      <path fill="#fff" d="M82,35.7C74.1,18,53.4,10.1,35.7,18S10.1,46.6,18,64.3l7.6-3.4c-6-13.5,0-29.3,13.5-35.3s29.3,0,35.3,13.5
      L82,35.7z">
          <animateTransform 
            attributeName="transform" 
            attributeType="XML" 
            type="rotate"
            dur="2s"  // 动画持续时间：2 秒
            from="0 50 50"  // 起始状态
            to="360 50 50"  // 结束状态：顺时针旋转 360 度
            repeatCount="indefinite" />  // 无限重复
      </path>
    </StyledSvg>
    
    {/* 加载时间信息 */}
    <p className="loadTimeInfo">
      It may take up-to a minute for all jobs to complete<br />  {/* 所有作业可能需要最多一分钟完成 */}
      You can view preliminary results as they come in below  {/* 您可以在下方查看初步结果 */}
    </p>
  </LoaderContainer>
  );
}

export default Loader;  // 导出加载器组件



