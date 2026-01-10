// ==================== 导入依赖 ====================
import styled from '@emotion/styled';  // Emotion 样式库
import colors from 'web-check-live/styles/colors';  // 主题颜色配置
import Card from 'web-check-live/components/Form/Card';  // 卡片组件
import Heading from 'web-check-live/components/Form/Heading';  // 标题组件
import { useState, useEffect, type ReactNode } from 'react';  // React Hooks 和类型

// ==================== 加载卡片样式组件 ====================
// 继承卡片样式，用于显示加载状态
const LoadCard = styled(Card)`
  margin: 0 auto 1rem auto;  // 上下左右边距
  width: 95vw;  // 宽度为视口宽度的 95%
  position: relative;  // 相对定位
  transition: all 0.2s ease-in-out;  // 平滑过渡动画
  
  // 隐藏状态
  &.hidden {
    height: 0;  // 高度为 0
    overflow: hidden;  // 隐藏溢出内容
    margin: 0;  // 移除边距
    padding: 0;  // 移除内边距
  }
`;

// ==================== 进度条容器样式组件 ====================
// 进度条的外层容器
const ProgressBarContainer = styled.div`
  width: 100%;  // 宽度为 100%
  height: 0.5rem;  // 高度为 0.5rem
  background: ${colors.bgShadowColor};  // 背景色：使用阴影颜色
  border-radius: 4px;  // 圆角：4px
  overflow: hidden;  // 隐藏溢出内容
`;

// ==================== 进度条段样式组件 ====================
// 单个进度条段，支持双色渐变
const ProgressBarSegment = styled.div<{ color: string, color2: string, width: number }>`
  height: 1rem;  // 高度为 1rem
  display: inline-block;  // 内联块级元素
  width: ${props => props.width}%;  // 宽度根据百分比动态设置
  background: ${props => props.color};  // 主背景色
  
  // 如果提供了第二种颜色，则使用条纹渐变效果
  background: ${props => props.color2 ?
      `repeating-linear-gradient( 315deg, ${props.color}, ${props.color} 3px, ${props.color2} 3px, ${props.color2} 6px )`  // 315 度角的重复线性渐变，创建条纹效果
      : props.color};
  transition: width 0.5s ease-in-out;  // 宽度变化的平滑过渡动画
`;

// ==================== 详情折叠面板样式组件 ====================
// 使用 HTML5 details/summary 元素实现可折叠的详情面板
const Details = styled.details`
  transition: all 0.2s ease-in-out;  // 平滑过渡动画
  
  // 摘要（标题）样式
  summary {
    margin: 0.5rem 0;  // 上下边距
    font-weight: bold;  // 粗体
    cursor: pointer;  // 鼠标指针为手型
  }
  
  // 摘要前的箭头图标
  summary:before {
    content: "►";  // 右箭头
    position: absolute;  // 绝对定位
    margin-left: -1rem;  // 向左偏移
    color: ${colors.primary};  // 使用主题色
    cursor: pointer;  // 鼠标指针为手型
  }
  
  // 展开时的箭头图标
  &[open] summary:before {
    content: "▼";  // 下箭头
  }
  
  // 列表样式
  ul {
    list-style: none;  // 移除列表样式
    padding: 0.25rem;  // 内边距
    border-radius: 4px;  // 圆角
    width: fit-content;  // 宽度适应内容
    
    // 加粗文本样式（可点击）
    li b {
      cursor: pointer;  // 鼠标指针为手型
    }
    
    // 斜体文本样式
    i {
      color: ${colors.textColorSecondary};  // 使用次要文本颜色
    }
  }
  
  // 错误信息样式
  p.error {
    margin: 0.5rem 0;  // 上下边距
    opacity: 0.75;  // 75% 不透明度
    color: ${colors.danger};  // 使用危险色（红色）
  }
`;

// ==================== 状态信息包装器样式组件 ====================
// 包装运行状态和摘要文本
const StatusInfoWrapper = styled.div`
  display: flex;  // 使用 Flexbox 布局
  justify-content: space-between;  // 两端对齐
  align-items: center;  // 垂直居中
  
  // 运行状态文本样式
  .run-status {
    color: ${colors.textColorSecondary};  // 使用次要文本颜色
    margin: 0;  // 移除默认边距
  }
`;

// ==================== 关于页面链接样式组件 ====================
// 指向关于页面的链接
const AboutPageLink = styled.a`
  color: ${colors.primary};  // 使用主题色
`;

// ==================== 摘要容器样式组件 ====================
// 显示加载状态的摘要信息
const SummaryContainer = styled.div`
  margin: 0.5rem 0;  // 上下边距
  
  // 加粗文本样式
  b {
    margin: 0;  // 移除默认边距
    font-weight: bold;  // 粗体
  }
  
  // 普通文本样式
  p {
    margin: 0;  // 移除默认边距
    opacity: 0.75;  // 75% 不透明度
  }
  
  // 错误信息样式
  &.error-info {
    color: ${colors.danger};  // 使用危险色
  }
  
  // 成功信息样式
  &.success-info {
    color: ${colors.success};  // 使用成功色
  }
  
  // 加载信息样式
  &.loading-info {
    color: ${colors.info};  // 使用信息色
  }
  
  // 跳过的作业样式
  .skipped {
    margin-left: 0.75rem;  // 左边距
    color: ${colors.warning};  // 使用警告色
  }
  
  // 成功的作业样式
  .success {
    margin-left: 0.75rem;  // 左边距
    color: ${colors.success};  // 使用成功色
  }
`;

// ==================== 重新显示容器样式组件 ====================
// 用于显示"重新显示加载状态"按钮
const ReShowContainer = styled.div`
  position: relative;  // 相对定位
  
  // 隐藏状态
  &.hidden {
    height: 0;  // 高度为 0
    overflow: hidden;  // 隐藏溢出内容
    margin: 0;  // 移除边距
    padding: 0;  // 移除内边距
  }
  
  // 按钮样式
  button { background: none;}  // 无背景色
`;

// ==================== 关闭按钮样式组件 ====================
// 用于关闭加载状态显示
const DismissButton = styled.button`
  width: fit-content;  // 宽度适应内容
  position: absolute;  // 绝对定位
  right: 1rem;  // 距离右侧 1rem
  bottom: 1rem;  // 距离底部 1rem
  background: ${colors.background};  // 使用背景色
  color: ${colors.textColorSecondary};  // 使用次要文本颜色
  border: none;  // 无边框
  padding: 0.25rem 0.5rem;  // 内边距
  border-radius: 4px;  // 圆角
  font-family: PTMono;  // 使用等宽字体
  cursor: pointer;  // 鼠标指针为手型
  
  // 悬停效果
  &:hover {
    color: ${colors.primary};  // 悬停时使用主题色
  }
`;

// ==================== 失败作业操作按钮样式组件 ====================
// 用于重试失败的作业
const FailedJobActionButton = styled.button`
  margin: 0.1rem 0.1rem 0.1rem 0.5rem;  // 边距
  background: ${colors.background};  // 使用背景色
  color: ${colors.textColorSecondary};  // 使用次要文本颜色
  border: none;  // 无边框
  padding: 0.25rem 0.5rem;  // 内边距
  border-radius: 4px;  // 圆角
  font-family: PTMono;  // 使用等宽字体
  cursor: pointer;  // 鼠标指针为手型
  border: 1px solid ${colors.textColorSecondary};  // 边框
  transition: all 0.2s ease-in-out;  // 平滑过渡动画
  
  // 悬停效果
  &:hover {
    color: ${colors.primary};  // 悬停时使用主题色
    border: 1px solid ${colors.primary};  // 悬停时边框使用主题色
  } 
`;

// ==================== 错误模态框内容样式组件 ====================
// 错误模态框的内容样式
const ErrorModalContent = styled.div`
  // 段落样式
  p {
    margin: 0;  // 移除默认边距
  }
  
  // 预格式化文本样式
  pre {
    color: ${colors.danger};  // 使用危险色
    
    // 信息样式
    &.info {
      color: ${colors.warning};  // 使用警告色
    }
  }
`;

// ==================== 加载状态类型定义 ====================
// 定义可能的作业状态
export type LoadingState = 'success' | 'loading' | 'skipped' | 'error' | 'timed-out';

// ==================== 加载作业接口 ====================
// 定义单个加载作业的属性
export interface LoadingJob {
  name: string,  // 作业名称
  state: LoadingState,  // 作业状态
  error?: string,  // 错误信息（如果有）
  timeTaken?: number,  // 作业耗时（毫秒）
  retry?: () => void,  // 重试函数（如果支持重试）
}

// ==================== 作业名称列表 ====================
// 定义所有需要执行的作业名称
const jobNames = [
  'get-ip',  // 获取 IP 地址
  'location',  // 地理位置
  'ssl',  // SSL 证书
  'domain',  // 域名信息
  'quality',  // 网站质量
  'tech-stack',  // 技术栈
  'server-info',  // 服务器信息
  'cookies',  // Cookie
  'headers',  // HTTP 头
  'dns',  // DNS 记录
  'hosts',  // 主机信息
  'http-security',  // HTTP 安全
  'social-tags',  // 社交标签
  'trace-route',  // 路由追踪
  'security-txt',  // 安全文本文件
  'dns-server',  // DNS 服务器
  'firewall',  // 防火墙
  'dnssec',  // DNSSEC
  'hsts',  // HSTS
  'threats',  // 威胁检测
  'mail-config',  // 邮件配置
  'archives',  // 存档
  'rank',  // 排名
  'screenshot',  // 截图
  'tls-cipher-suites',  // TLS 密码套件
  'tls-security-config',  // TLS 安全配置
  'tls-client-support',  // TLS 客户端支持
  'redirects',  // 重定向
  'linked-pages',  // 链接页面
  'robots-txt',  // robots.txt
  'status',  // 状态
  'ports',  // 端口
  // 'whois',  // WHOIS（已注释）
  'txt-records',  // TXT 记录
  'block-lists',  // 黑名单
  'features',  // 功能
  'sitemap',  // 站点地图
  'carbon',  // 碳足迹
] as const;

// ==================== 作业列表项属性接口 ====================
// 定义作业列表项组件的属性
interface JobListItemProps {
  job: LoadingJob;  // 作业对象
  showJobDocs: (name: string) => void;  // 显示作业文档的函数
  showErrorModal: (name: string, state: LoadingState, timeTaken: number | undefined, error: string, isInfo?: boolean) => void;  // 显示错误模态框的函数
  barColors: Record<LoadingState, [string, string]>;  // 进度条颜色配置
}

// ==================== 获取状态表情符号 ====================
// 根据状态返回对应的表情符号
const getStatusEmoji = (state: LoadingState): string => {
  switch (state) {
    case 'success':
      return '✅';  // 成功：绿色勾选
    case 'loading':
      return '🔄';  // 加载中：旋转箭头
    case 'error':
      return '❌';  // 错误：红色叉号
    case 'timed-out':
      return '⏸️';  // 超时：暂停符号
    case 'skipped':
      return '⏭️';  // 跳过：快进符号
    default:
      return '❓';  // 未知：问号
  }
};

// ==================== 作业列表项组件 ====================
// 显示单个作业的状态和操作按钮
const JobListItem: React.FC<JobListItemProps> = ({ job, showJobDocs, showErrorModal, barColors }) => {
  const { name, state, timeTaken, retry, error } = job;
  
  // 如果作业失败或超时且支持重试，显示重试按钮
  const actionButton = retry && state !== 'success' && state !== 'loading' ? 
    <FailedJobActionButton onClick={retry}>↻ Retry</FailedJobActionButton> : null;
    
  // 如果作业有错误信息且状态为错误、超时或跳过，显示错误详情按钮
  const showModalButton = error && ['error', 'timed-out', 'skipped'].includes(state) &&
    <FailedJobActionButton onClick={() => showErrorModal(name, state, timeTaken, error, state === 'skipped')}> 
      {state === 'timed-out' ? '■ Show Timeout Reason' : '■ Show Error'}  {/* 根据状态显示不同的按钮文本 */}
    </FailedJobActionButton>;

  return (
    <li key={name}>
      {/* 作业名称：点击可查看文档 */}
      <b onClick={() => showJobDocs(name)}>{getStatusEmoji(state)} {name}</b>
      {/* 作业状态文本 */}
      <span style={{color: barColors[state][0]}}> ({state})</span>.
      {/* 耗时信息 */}
      <i>{timeTaken && state !== 'loading' ? ` Took ${timeTaken} ms` : ''}</i>
      {/* 重试按钮 */}
      {actionButton}
      {/* 错误详情按钮 */}
      {showModalButton}
    </li>
  );
};

// ==================== 初始作业列表 ====================
// 创建初始的作业列表，所有作业状态为 loading
export const initialJobs = jobNames.map((job: string) => {
  return {
    name: job,
    state: 'loading' as LoadingState,
    retry: () => {}  // 空的重试函数
  }
});

// ==================== 计算加载状态百分比 ====================
// 根据所有作业状态计算各状态的百分比
export const calculateLoadingStatePercentages = (loadingJobs: LoadingJob[]): Record<LoadingState | string, number> => {
  const totalJobs = loadingJobs.length;

  // 初始化计数对象
  const stateCount: Record<LoadingState, number> = {
    'success': 0,
    'loading': 0,
    'timed-out': 0,
    'error': 0,
    'skipped': 0,
  };

  // 计算每种状态的数量
  loadingJobs.forEach((job) => {
    stateCount[job.state] += 1;
  });

  // 将数量转换为百分比
  const statePercentage: Record<LoadingState, number> = {
    'success': (stateCount['success'] / totalJobs) * 100,
    'loading': (stateCount['loading'] / totalJobs) * 100,
    'timed-out': (stateCount['timed-out'] / totalJobs) * 100,
    'error': (stateCount['error'] / totalJobs) * 100,
    'skipped': (stateCount['skipped'] / totalJobs) * 100,
  };

  return statePercentage;
};

// ==================== 毫秒计数器组件 ====================
// 显示从组件挂载到完成的毫秒数
const MillisecondCounter = (props: {isDone: boolean}) => {
  const { isDone } = props;
  const [milliseconds, setMilliseconds] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // 组件挂载后立即启动计时器
    if (!isDone) {
      timer = setInterval(() => {
        setMilliseconds(milliseconds => milliseconds + 100);  // 每 100 毫秒增加 100
      }, 100);
    }
    // 组件卸载时清除定时器
    return () => {
      clearInterval(timer);
    };
  }, [isDone]); // 如果 isDone 属性变化，effect 会重新运行

  return <span>{milliseconds} ms</span>;
};

// ==================== 运行文本组件 ====================
// 显示当前运行的作业数量和耗时
const RunningText = (props: { state: LoadingJob[], count: number }): JSX.Element => {
  const loadingTasksCount = jobNames.length - props.state.filter((val: LoadingJob) => val.state === 'loading').length;
  const isDone = loadingTasksCount >= jobNames.length;
  return (
    <p className="run-status">
    { isDone ? 'Finished in ' : `Running ${loadingTasksCount} of ${jobNames.length} jobs - ` }  {/* 根据是否完成显示不同文本 */}
    <MillisecondCounter isDone={isDone} />  {/* 毫秒计数器 */}
    </p>
  );
};

// ==================== 摘要文本组件 ====================
// 显示加载状态的摘要信息
const SummaryText = (props: { state: LoadingJob[], count: number }): JSX.Element => {
  const totalJobs = jobNames.length;
  let failedTasksCount = props.state.filter((val: LoadingJob) => val.state === 'error').length;
  let loadingTasksCount = props.state.filter((val: LoadingJob) => val.state === 'loading').length;
  let skippedTasksCount = props.state.filter((val: LoadingJob) => val.state === 'skipped').length;
  let successTasksCount = props.state.filter((val: LoadingJob) => val.state === 'success').length;

  // 格式化作业数量文本
  const jobz = (jobCount: number) => `${jobCount} ${jobCount === 1 ? 'job' : 'jobs'}`;

  // 根据数量生成信息文本
  const skippedInfo = skippedTasksCount > 0 ? (<span className="skipped">{jobz(skippedTasksCount)} skipped </span>) : null;
  const successInfo = successTasksCount > 0 ? (<span className="success">{jobz(successTasksCount)} successful </span>) : null;
  const failedInfo = failedTasksCount > 0 ? (<span className="error">{jobz(failedTasksCount)} failed </span>) : null;

  // 如果还有加载中的作业，显示加载信息
  if (loadingTasksCount > 0) {
    return (
      <SummaryContainer className="loading-info">
        <b>Loading {totalJobs - loadingTasksCount} / {totalJobs} Jobs</b>
        {skippedInfo}
      </SummaryContainer>
    );
  }

  // 如果没有失败的作业，显示成功信息
  if (failedTasksCount === 0) {
    return (
      <SummaryContainer className="success-info">
        <b>{successTasksCount} Jobs Completed Successfully</b>
        {skippedInfo}
      </SummaryContainer>
    );
  }

  // 否则显示混合信息
  return (
    <SummaryContainer className="error-info">
      {successInfo}
      {skippedInfo}
      {failedInfo}
    </SummaryContainer>
  );
};

// ==================== 进度加载器主组件 ====================
// 显示所有作业的加载进度和状态
const ProgressLoader = (props: { loadStatus: LoadingJob[], showModal: (err: ReactNode) => void, showJobDocs: (job: string) => void }): JSX.Element => {
  const [ hideLoader, setHideLoader ] = useState<boolean>(false);
  const loadStatus = props.loadStatus;
  const percentages = calculateLoadingStatePercentages(loadStatus);

  const loadingTasksCount = jobNames.length - loadStatus.filter((val: LoadingJob) => val.state === 'loading').length;
  const isDone = loadingTasksCount >= jobNames.length;

  // ==================== 生成进度条颜色 ====================
  // 根据颜色代码生成双色渐变（主色和稍深的颜色）
  const makeBarColor = (colorCode: string): [string, string] => {
    const amount = 10;  // 颜色变暗的程度
    const darkerColorCode = '#' + colorCode.replace(/^#/, '').replace(
      /../g,
      colorCode => ('0' + Math.min(255, Math.max(0, parseInt(colorCode, 16) - amount)).toString(16)).slice(-2),  // 将每个颜色分量减去 amount
    );
    return [colorCode, darkerColorCode];  // 返回主色和深色
  };

  // ==================== 进度条颜色配置 ====================
  // 为每种状态定义颜色
  const barColors: Record<LoadingState | string, [string, string]> = {
    'success': isDone ? makeBarColor(colors.primary) : makeBarColor(colors.success),  // 完成时使用主题色，否则使用成功色
    'loading': makeBarColor(colors.info),  // 加载中：使用信息色
    'error': makeBarColor(colors.danger),  // 错误：使用危险色
    'timed-out': makeBarColor(colors.warning),  // 超时：使用警告色
    'skipped': makeBarColor(colors.neutral),  // 跳过：使用中性色
  };

  // ==================== 显示错误模态框 ====================
  // 显示作业错误的详细信息
  const showErrorModal = (name: string, state: LoadingState, timeTaken: number | undefined, error: string, isInfo?: boolean) => {
    const errorContent = (
      <ErrorModalContent>
        <Heading as="h3">Error Details for {name}</Heading>
        <p>
          The {name} job failed with an {state} state after {timeTaken} ms.
          The server responded with the following error:
        </p>
        { /* 如果 isInfo == true，则添加 .info className 到 pre */}
        <pre className={isInfo ? 'info' : 'error'}>{error}</pre>
      </ErrorModalContent>
    );
    props.showModal(errorContent);
  };

  return (
  <>
  {/* 重新显示按钮（当加载器被隐藏时显示） */}
  <ReShowContainer className={!hideLoader ? 'hidden' : ''}>
    <DismissButton onClick={() => setHideLoader(false)}>Show Load State</DismissButton>
  </ReShowContainer>
  
  {/* 加载状态卡片 */}
  <LoadCard className={hideLoader ? 'hidden' : ''}>
    {/* 进度条 */}
    <ProgressBarContainer>
      {Object.keys(percentages).map((state: string | LoadingState) =>
        <ProgressBarSegment 
          color={barColors[state][0]}  // 主色
          color2={barColors[state][1]}  // 深色（用于条纹效果）
          title={`${state} (${Math.round(percentages[state])}%)`}  // 工具提示
          width={percentages[state]}  // 宽度百分比
          key={`progress-bar-${state}`}  // 唯一标识
        />
      )}
    </ProgressBarContainer>
    
    {/* 状态信息 */}
    <StatusInfoWrapper>
      <SummaryText state={loadStatus} count={loadStatus.length} />
      <RunningText state={loadStatus} count={loadStatus.length} />
    </StatusInfoWrapper>

    {/* 详情折叠面板 */}
    <Details>
      <summary>Show Details</summary>
      <ul>
        {/* 作业列表 */}
        {loadStatus.map((job: LoadingJob) => (
          <JobListItem key={job.name} job={job} showJobDocs={props.showJobDocs} showErrorModal={showErrorModal} barColors={barColors} />
        ))}
      </ul>
      
      {/* 如果有失败的作业，显示提示信息 */}
      { loadStatus.filter((val: LoadingJob) => val.state === 'error').length > 0 &&
        <p className="error">
          <b>Check the browser console for logs and more info</b><br />
          It's normal for some jobs to fail, either because the host doesn't return the required info,
          or restrictions in the lambda function, or hitting an API limit.
        </p>}
        
      {/* 关于页面链接 */}
      <AboutPageLink href="/check/about" target="_blank" rel="noreferer" >Learn More about Web-Check</AboutPageLink>
    </Details>
    
    {/* 关闭按钮 */}
    <DismissButton onClick={() => setHideLoader(true)}>Dismiss</DismissButton>
  </LoadCard>
  </>
  );
}

export default ProgressLoader;  // 导出进度加载器组件
