
// ==================== 导入依赖 ====================
import styled from '@emotion/styled';  // Emotion 样式库
import colors from 'web-check-live/styles/colors';  // 颜色主题配置
import { StyledCard } from 'web-check-live/components/Form/Card';  // 卡片组件

// ==================== 自检消息容器样式组件 ====================
// 继承卡片样式，添加自检消息的特定样式
const StyledSelfScanMsg = styled(StyledCard)`
  margin: 0px auto 1rem;  // 上下左右边距：上0，左右自动，下1rem
  width: 95vw;  // 宽度为视口宽度的 95%
  
  // 链接样式
  a { color: ${colors.primary}; }  // 使用主题色
  
  // 粗体文本样式
  b { font-weight: extra-bold; }  // 超粗体
  
  // 普通文本和斜体文本样式
  span, i { opacity: 0.85; }  // 85% 不透明度
  
  // 图片样式
  img {
    width: 5rem;  // 图片宽度
    float: right;  // 右浮动
    border-radius: 4px;  // 圆角 4 像素
  }
`;

// ==================== 自检幽默消息列表 ====================
// 当用户尝试扫描应用本身时显示的随机幽默消息
const messages = [
  'Nice try! But scanning this app is like trying to tickle yourself. It just doesn\'t work!',  // 不错的尝试！但扫描这个应用就像试图挠自己痒痒一样。根本行不通！
  'Recursive scanning detected. The universe might implode...or it might not. But let\'s not try to find out.',  // 检测到递归扫描。宇宙可能会内爆……也可能不会。但我们还是别去尝试了。
  'Hey, stop checking us out! We\'re blushing... 😉',  // 嘿，别再检查我们了！我们脸红了…… 😉
  'Hmmm, scanning us, are you? We feel so special!',  // 嗯，你在扫描我们？我们感到很特别！
  'Alert! Mirror scanning detected. Trust us, we\'re looking good 😉',  // 警报！检测到镜像扫描。相信我们，我们看起来很不错 😉
  'We\'re flattered you\'re trying to scan us, but we can\'t tickle ourselves!',  // 你试图扫描我们，我们感到很荣幸，但我们不能挠自己痒痒！
  'Oh, inspecting the inspector, aren\'t we? Inception much?',  // 哦，在检查检查者，是吗？盗梦空间吗？
  'Just a second...wait a minute...you\'re scanning us?! Well, that\'s an interesting twist!',  // 等一下……稍等……你在扫描我们？！嗯，这真是个有趣的转折！
  'Scanning us? It\'s like asking a mirror to reflect on itself.',  // 扫描我们？这就像让镜子反思自己一样。
  'Well, this is awkward... like a dog chasing its own tail!',  // 嗯，这很尴尬……就像狗追自己的尾巴！
  'Ah, I see you\'re scanning this site... But alas, this did not cause an infinite recursive loop (this time)',  // 啊，我看到你在扫描这个站点……但是唉，这并没有导致无限递归循环（这次）
];

// ==================== 自检消息组件 ====================
// 显示随机选择的自检幽默消息，当用户尝试扫描应用本身时使用
const SelfScanMsg = () => {
  return (
    <StyledSelfScanMsg>
      {/* 显示自检图片 */}
      <img src="https://i.ibb.co/0tQbCPJ/test2.png" alt="Self-Scan" />
      
      {/* 随机选择并显示一条幽默消息 */}
      <b>{messages[Math.floor(Math.random() * messages.length)]}</b>
      <br />
      
      {/* 提示用户查看源代码 */}
      <span>
        But if you want to see how this site is built, why not check out
        the <a href='https://github.com/lissy93/web-check'>source code</a>?
      </span>
      <br />
      
      {/* 请求用户给仓库点星 */}
      <i>Do me a favour, and drop the repo a Star while you're there</i> 😉
    </StyledSelfScanMsg>
  );
};

export default SelfScanMsg;  // 导出自检消息组件
