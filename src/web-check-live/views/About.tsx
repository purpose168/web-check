import styled from '@emotion/styled'; // 导入样式化组件库
import { useEffect } from 'react'; // 导入React的副作用钩子
import { useLocation } from 'react-router-dom'; // 导入路由位置钩子

import colors from 'web-check-live/styles/colors'; // 导入颜色配置
import Heading from 'web-check-live/components/Form/Heading'; // 导入标题组件
import Footer from 'web-check-live/components/misc/Footer'; // 导入页脚组件
import Nav from 'web-check-live/components/Form/Nav'; // 导入导航组件
import Button from 'web-check-live/components/Form/Button'; // 导入按钮组件
import AdditionalResources from 'web-check-live/components/misc/AdditionalResources'; // 导入附加资源组件
import { StyledCard } from 'web-check-live/components/Form/Card'; // 导入卡片组件
import docs, { about, featureIntro, license, fairUse, supportUs } from 'web-check-live/utils/docs'; // 导入文档内容

const AboutContainer = styled.div` // 关于页面的容器样式
width: 95vw; // 宽度为视口宽度的95%
max-width: 1000px; // 最大宽度为1000像素
margin: 2rem auto; // 上下边距2rem，左右自动居中
padding-bottom: 1rem; // 底部内边距1rem
header { // 头部样式
  margin 1rem 0; // 上下边距1rem，左右0
  width: auto; // 宽度自动
}
section { // 章节样式
  width: auto; // 宽度自动
  .inner-heading { display: none; } // 内部标题隐藏
}
`;

const HeaderLinkContainer = styled.nav` // 头部链接容器样式
  display: flex; // 使用弹性布局
  flex-wrap: wrap; // 允许换行
  gap: 1rem; // 间距1rem
  a { // 链接样式
    text-decoration: none; // 无下划线
  }
`;

const Section = styled(StyledCard)` // 章节卡片样式
  margin-bottom: 2rem; // 底部外边距2rem
  overflow: clip; // 溢出裁剪
  max-height: 100%; // 最大高度100%
  section { // 章节样式
    clear: both; // 清除浮动
  }
  h3 { // 三级标题样式
    font-size: 1.5rem; // 字体大小1.5rem
  }
  hr { // 分割线样式
    border: none; // 无边框
    border-top: 1px dashed ${colors.primary}; // 顶部1像素虚线，使用主色调
    margin: 1.5rem auto; // 上下边距1.5rem，左右自动居中
  }
  ul { // 无序列表样式
    padding: 0 0 0 1rem; // 左内边距1rem
    list-style: circle; // 圆形列表标记
  }
  a { // 链接样式
    color: ${colors.primary}; // 使用主色调
    &:visited { opacity: 0.8; } // 访问过的链接透明度0.8
  }
  pre { // 预格式化文本样式
    background: ${colors.background}; // 背景色
    border-radius: 4px; // 圆角4像素
    padding: 0.5rem; // 内边距0.5rem
    width: fit-content; // 宽度适应内容
  }
  small { opacity: 0.7; } // 小号文字透明度0.7
  .contents { // 目录样式
    ul { // 无序列表样式
      list-style: none; // 无列表标记
      li { // 列表项样式
        a { // 链接样式
          // color: ${colors.textColor}; // 文本颜色
          &:visited { opacity: 0.8; } // 访问过的链接透明度0.8
        }
        b { // 粗体样式
          opacity: 0.75; // 透明度0.75
          display: inline-block; // 行内块显示
          width: 1.5rem; // 宽度1.5rem
        }
      }
    }
  }
  .example-screenshot { // 示例截图样式
    float: right; // 右浮动
    display: inline-flex; // 行内弹性布局
    flex-direction: column; // 垂直方向排列
    clear: both; // 清除浮动
    max-width: 300px; // 最大宽度300像素
    img { // 图片样式
      float: right; // 右浮动
      break-inside: avoid; // 避免分页断开
      max-width: 300px; // 最大宽度300像素
      // max-height: 30rem; // 最大高度30rem
      border-radius: 6px; // 圆角6像素
      clear: both; // 清除浮动
    }
    figcaption { // 图片标题样式
      font-size: 0.8rem; // 字体大小0.8rem
      text-align: center; // 文本居中
      opacity: 0.7; // 透明度0.7
    }
  }
`;

const SponsorshipContainer = styled.div` // 赞助容器样式
  display: flex; // 使用弹性布局
  justify-content: space-between; // 两端对齐
  gap: 1rem; // 间距1rem
  flex-wrap: wrap; // 允许换行
  align-items: center; // 垂直居中
  line-height: 1.5rem; // 行高1.5rem
  img { // 图片样式
    border-radius: 4px; // 圆角4像素
  }
`;

const makeAnchor = (title: string): string => { // 创建锚点函数
  return title.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "-"); // 将标题转换为小写并替换特殊字符为连字符
};

const About = (): JSX.Element => { // 关于页面组件
  const location = useLocation(); // 获取当前路由位置

  useEffect(() => { // 副作用钩子
    // 如果存在哈希片段，则滚动到该位置
    if (location.hash) {
      // 添加一个小延迟以确保页面已完全渲染
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1)); // 获取目标元素
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 平滑滚动到元素
        }
      }, 100);
    }
  }, [location]); // 依赖location

  return (
    <div>
    <AboutContainer>
      <Nav>
        <HeaderLinkContainer>
          <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check"><Button>在GitHub上查看</Button></a>
        </HeaderLinkContainer>
      </Nav>

      <Heading as="h2" size="medium" color={colors.primary}>简介</Heading>
      <Section>
        {about.map((para, index: number) => (
          <p key={index}>{para}</p>
        ))}
        <hr />
        <SponsorshipContainer>
          <p>
            Web-Check由 <a target="_blank" rel="noreferrer" href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh">
              Terminal Trove
            </a> 慷慨赞助
            <br />
            终端领域的一切之家。
            <br />
            <small>
              <a target="_blank" rel="noreferrer" href="https://terminaltrove.com/newsletter?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh">
                发现您的下一个CLI / TUI工具，并获取更新到您的收件箱
              </a>
            </small>
          </p>
          <a target="_blank" rel="noreferrer" href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh">
            <img width="300" alt="Terminal Trove" src="https://i.ibb.co/T1KzVmR/terminal-trove-green.png" />
          </a>
        </SponsorshipContainer>
        <hr />
        <p>
          Web-Check由 <a target="_blank" rel="noreferrer" href="https://aliciasykes.com">Alicia Sykes</a> 开发和维护。
          它采用 <a target="_blank" rel="noreferrer" href="https://github.com/Lissy93/web-check/blob/master/LICENSE">MIT许可证</a> 授权，
          在个人和商业环境中完全免费使用、修改和分发。<br />
          源代码和自托管文档可在 <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">GitHub</a> 上获取。
          如果您发现此服务有用，请考虑从每月1美元起<a target="_blank" rel="noreferrer" href="https://github.com/sponsors/Lissy93">赞助我</a>，
          以帮助支付持续的主机和开发成本。
        </p>
      </Section>
      
      <Heading as="h2" size="medium" color={colors.primary}>功能</Heading>
      <Section>
        {featureIntro.map((fi: string, i: number) => (<p key={i}>{fi}</p>))}
        <div className="contents">
        <Heading as="h3" size="small" id="#feature-contents" color={colors.primary}>目录</Heading>
          <ul>
            {docs.map((section, index: number) => (
              <li key={index}>
                <b>{index + 1}</b>
                <a href={`#${makeAnchor(section.title)}`}>{section.title}</a></li>
            ))}
          </ul>
          <hr />
        </div>
        {docs.map((section, sectionIndex: number) => (
          <section key={section.title}>
            { sectionIndex > 0 && <hr /> }
            <Heading as="h3" size="small" id={makeAnchor(section.title)} color={colors.primary}>{section.title}</Heading>
            {section.screenshot &&
              <figure className="example-screenshot">
                <img className="screenshot" src={section.screenshot} alt={`示例截图 ${section.title}`} />
                <figcaption>图.{sectionIndex + 1} - {section.title}的示例</figcaption>
              </figure> 
            }
            {section.description && <>
              <Heading as="h4" size="small">描述</Heading>
              <p>{section.description}</p>
            </>}
            { section.use && <>
              <Heading as="h4" size="small">使用场景</Heading>
              <p>{section.use}</p>
            </>}
            {section.resources && section.resources.length > 0 && <>
              <Heading as="h4" size="small">有用链接</Heading>
              <ul>
                {section.resources.map((link: string | { title: string, link: string }, linkIndx: number) => (
                  typeof link === 'string' ? (
                    <li key={`link-${linkIndx}`} id={`link-${linkIndx}`}><a target="_blank" rel="noreferrer" href={link}>{link}</a></li>
                  ) : (
                    <li key={`link-${linkIndx}`} id={`link-${linkIndx}`}><a target="_blank" rel="noreferrer" href={link.link}>{link.title}</a></li>
                  )
                ))}
              </ul>
            </>}
          </section>
        ))}
      </Section>

      <Heading as="h2" size="medium" color={colors.primary}>部署您自己的实例</Heading>
      <Section>
        <p>Web-Check设计为易于自托管。</p>
        <Heading as="h3" size="small" color={colors.primary}>选项 #1 - Netlify</Heading>
        <p>点击下面的按钮部署到Netlify</p>
        <a target="_blank" rel="noreferrer" href="https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check">
          <img src="https://www.netlify.com/img/deploy/button.svg" alt="部署到Netlify" />
        </a>

        <Heading as="h3" size="small" color={colors.primary}>选项 #2 - Vercel</Heading>
        <p>点击下面的按钮部署到Vercel</p>
        <a target="_blank" rel="noreferrer" href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flissy93%2Fweb-check&project-name=web-check&repository-name=web-check-fork&demo-title=Web-Check%20Demo&demo-description=Check%20out%20web-check.xyz%20to%20see%20a%20live%20demo%20of%20this%20application%20running.&demo-url=https%3A%2F%2Fweb-check.xyz&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FLissy93%2Fweb-check%2Fmaster%2F.github%2Fscreenshots%2Fweb-check-screenshot10.png">
          <img src="https://vercel.com/button" alt="使用Vercel部署" />
        </a>

        <Heading as="h3" size="small" color={colors.primary}>选项 #3 - Docker</Heading>
        <p>
        Docker容器已发布到 <a target="_blank" rel="noreferrer" href="https://hub.docker.com/r/lissy93/web-check">DockerHub</a>
        <br />
        运行此命令，然后打开 <code>localhost:3000</code>
        <pre>docker run -p 3000:3000 lissy93/web-check</pre>
        </p>

        <Heading as="h3" size="small" color={colors.primary}>选项 #4 - 手动</Heading>
        <pre>
        git clone https://github.com/Lissy93/web-check.git<br />
        cd web-check # 进入项目目录<br />
        yarn install # 安装依赖<br />
        yarn build # 构建生产环境应用<br />
        yarn serve # 启动应用（API和GUI）<br />
        </pre>

        <Heading as="h3" size="small" color={colors.primary}>更多文档</Heading>
        <p>
          更详细的安装和设置说明可以在
          GitHub仓库中找到 - <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check#readme">github.com/lissy93/web-check</a>
        </p>

        <Heading as="h3" size="small" color={colors.primary}>配置</Heading>
        <p>
          您可以指定一些可选的环境变量来访问一些额外的Web-Checks。
          完整选项列表请参阅README。
        </p>

        <ul>
          <li>
            <code>GOOGLE_CLOUD_API_KEY</code>
            : <a target="_blank" rel="noreferrer" href="https://cloud.google.com/api-gateway/docs/authenticate-api-keys">Google API密钥</a>
            <i> 用于返回网站的质量指标</i>
          </li>
          <li>
            <code>REACT_APP_SHODAN_API_KEY</code>
            : <a target="_blank" rel="noreferrer" href="https://account.shodan.io/">Shodan API密钥</a>
            <i> 显示域名的关联主机</i>
          </li>
          <li>
            <code>REACT_APP_WHO_API_KEY</code>
            : <a target="_blank" rel="noreferrer" href="https://whoapi.com/">WhoAPI密钥</a>
            <i> 允许更全面的WhoIs记录</i>
          </li>
        </ul>

      </Section>

      <Heading as="h2" size="medium" color={colors.primary}>API文档</Heading>
      <Section>
        {/* eslint-disable-next-line*/}
        <p>// 即将推出...</p>
      </Section>

      <Heading as="h2" size="medium" color={colors.primary}>附加资源</Heading>
      <AdditionalResources />

      <Heading as="h2" size="medium" color={colors.primary}>支持我们</Heading>
      <Section>
        {supportUs.map((para, index: number) => (<p dangerouslySetInnerHTML={{__html: para}} />))}
      </Section>

      <Heading as="h2" size="medium" color={colors.primary}>条款和信息</Heading>
      <Section>
      <Heading as="h3" size="small" color={colors.primary}>许可证</Heading>
        <b>
          <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check">Web-Check</a> 采用MIT许可证分发，
          © <a target="_blank" rel="noreferrer" href="https://aliciasykes.com">Alicia Sykes</a> { new Date().getFullYear()}
        </b>
        <br />
        <small>更多信息，请参阅 <a target="_blank" rel="noreferrer" href="https://tldrlegal.com/license/mit-license">TLDR Legal → MIT</a></small>
        <pre>{license}</pre>
        <hr />
        <Heading as="h3" size="small" color={colors.primary}>合理使用</Heading>
        <ul>
          {fairUse.map((para, index: number) => (<li>{para}</li>))}
        </ul>
        <hr />
        <Heading as="h3" size="small" color={colors.primary}>隐私</Heading>
        <p>
        演示实例使用分析功能（通过自托管的Plausible实例），这仅记录您访问的URL，但不记录任何个人数据。
        还有一些基本的错误日志记录（通过自托管的GlitchTip实例），这仅用于帮助我修复错误。
        <br />
        <br />
        您的IP地址、浏览器/操作系统/硬件信息或任何其他数据都不会被收集或记录。
        （您可以自己验证这一点，通过检查源代码或使用开发者工具）
        </p>
      </Section>
    </AboutContainer>
    <Footer />
    </div>
  );
}

export default About; // 导出默认组件
