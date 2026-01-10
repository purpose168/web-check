import styled from '@emotion/styled'; // 导入样式化组件库
import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react'; // 导入React的类型和钩子
import { Link, useNavigate, useLocation, type NavigateOptions } from 'react-router-dom'; // 导入路由相关组件和钩子

import Heading from 'web-check-live/components/Form/Heading'; // 导入标题组件
import Input from 'web-check-live/components/Form/Input' // 导入输入框组件
import Button from 'web-check-live/components/Form/Button'; // 导入按钮组件
import { StyledCard } from 'web-check-live/components/Form/Card'; // 导入卡片组件
import Footer from 'web-check-live/components/misc/Footer'; // 导入页脚组件
import FancyBackground from 'web-check-live/components/misc/FancyBackground'; // 导入背景组件

import docs from 'web-check-live/utils/docs'; // 导入文档数据
import colors from 'web-check-live/styles/colors'; // 导入颜色配置
import { determineAddressType } from 'web-check-live/utils/address-type-checker'; // 导入地址类型检测工具

const HomeContainer = styled.section` // 首页容器样式
  display: flex; // 使用弹性布局
  flex-direction: column; // 垂直方向排列
  justify-content: center; // 垂直居中
  align-items: center; // 水平居中
  height: 100%; // 高度100%
  font-family: 'PTMono'; // 字体
  padding: 1.5rem 1rem 4rem 1rem; // 内边距
  footer { // 页脚样式
    z-index: 1; // 层级1
  }
`;

const UserInputMain = styled.form` // 用户输入主表单样式
  background: ${colors.backgroundLighter}; // 背景色
  box-shadow: 4px 4px 0px ${colors.bgShadowColor}; // 阴影效果
  border-radius: 8px; // 圆角8像素
  padding: 1rem; // 内边距1rem
  z-index: 5; // 层级5
  margin: 1rem; // 外边距1rem
  width: calc(100% - 2rem); // 宽度计算
  max-width: 60rem; // 最大宽度60rem
  z-index: 2; // 层级2
`;

const SponsorCard = styled.div` // 赞助卡片样式
  background: ${colors.backgroundLighter}; // 背景色
  box-shadow: 4px 4px 0px ${colors.bgShadowColor}; // 阴影效果
  border-radius: 8px; // 圆角8像素
  padding: 1rem; // 内边距1rem
  z-index: 5; // 层级5
  margin: 1rem; // 外边距1rem
  width: calc(100% - 2rem); // 宽度计算
  max-width: 60rem; // 最大宽度60rem
  z-index: 2; // 层级2
  .inner { // 内部容器样式
    display: flex; // 使用弹性布局
    justify-content: space-between; // 两端对齐
    flex-wrap: wrap; // 允许换行
    gap: 1rem; // 间距1rem
    p { // 段落样式
      margin: 0.25rem 0; // 上下边距0.25rem
    }
  }
  a { // 链接样式
    color: ${colors.textColor}; // 文本颜色
  }
  img { // 图片样式
    border-radius: 0.25rem; // 圆角0.25rem
    box-shadow: 2px 2px 0px ${colors.fgShadowColor}; // 阴影效果
    transition: box-shadow 0.2s; // 阴影过渡动画0.2秒
    margin: 0 auto; // 上下0，左右自动居中
    display: block; // 块级显示
    width: 200px; // 宽度200像素
    &:hover { // 悬停状态
      box-shadow: 4px 4px 0px ${colors.fgShadowColor}; // 阴影效果增强
    }
    &:active { // 点击状态
      box-shadow: -2px -2px 0px ${colors.fgShadowColor}; // 阴影反向
    }
  }
  .cta { // 行动号召文本样式
    font-size: 0.78rem; // 字体大小0.78rem
    a { color: ${colors.primary}; } // 链接使用主色调
  }
`;

// const FindIpButton = styled.a` // 查找IP地址按钮样式（已注释）
//   margin: 0.5rem; // 外边距0.5rem
//   cursor: pointer; // 鼠标指针
//   display: block; // 块级显示
//   text-align: center; // 文本居中
//   color: ${colors.primary}; // 使用主色调
//   text-decoration: underline; // 下划线
// `;

const ErrorMessage = styled.p` // 错误消息样式
  color: ${colors.danger}; // 使用危险色
  margin: 0.5rem; // 外边距0.5rem
`;

const SiteFeaturesWrapper = styled(StyledCard)` // 网站功能包装器样式
  margin: 1rem; // 外边距1rem
  width: calc(100% - 2rem); // 宽度计算
  max-width: 60rem; // 最大宽度60rem
  z-index: 2; // 层级2
  .links { // 链接容器样式
    display: flex; // 使用弹性布局
    justify-content: center; // 水平居中
    gap: 0.5rem; // 间距0.5rem
    a { // 链接样式
      width: 100%; // 宽度100%
      button { // 按钮样式
        width: calc(100% - 2rem); // 宽度计算
      }
    }
    @media(max-width: 600px) { // 响应式媒体查询
      flex-wrap: wrap; // 允许换行
    }
  }
  ul { // 无序列表样式
    -webkit-column-width: 150px; // WebKit列宽150像素
    -moz-column-width: 150px; // Mozilla列宽150像素
    column-width: 150px; // 列宽150像素
    list-style: none; // 无列表标记
    padding: 0 1rem; // 左右内边距1rem
    font-size: 0.9rem; // 字体大小0.9rem
    color: ${colors.textColor}; // 文本颜色
    li { // 列表项样式
      margin: 0.1rem 0; // 上下边距0.1rem
      text-indent: -1.2rem; // 首行缩进-1.2rem
      break-inside: avoid-column; // 避免列内断开
    }
    li:before { // 列表项前缀样式
      content: '✓'; // 勾号
      color: ${colors.primary}; // 使用主色调
      margin-right: 0.5rem; // 右边距0.5rem
    }
  }
  a { // 链接样式
    color: ${colors.primary}; // 使用主色调
  }
`;

const Home = (): JSX.Element => { // 首页组件
  const defaultPlaceholder = 'e.g. https://duck.com/'; // 默认占位符文本
  const [userInput, setUserInput] = useState(''); // 用户输入状态
  const [errorMsg, setErrMsg] = useState(''); // 错误消息状态
  const [placeholder] = useState(defaultPlaceholder); // 占位符状态
  const [inputDisabled] = useState(false); // 输入框禁用状态
  const navigate = useNavigate(); // 导航函数

  const location = useLocation(); // 获取当前路由位置

  /* 如果 somehow 我们到达 /check?url=[]，则直接重定向到结果页 */
  useEffect(() => {
    const query = new URLSearchParams(location.search); // 解析URL查询参数
    const urlFromQuery = query.get('url'); // 获取url参数
    if (urlFromQuery) { // 如果存在url参数
      navigate(`/check/${encodeURIComponent(urlFromQuery)}`, { replace: true }); // 重定向到检查页面
    }
  }, [navigate, location.search]); // 依赖navigate和location.search

  /* 检查是否为有效地址，要么显示错误要么重定向到结果页 */
  const submit = () => {
    let address = userInput.endsWith("/") ? userInput.slice(0, -1) : userInput; // 移除末尾斜杠
    const addressType = determineAddressType(address); // 确定地址类型
  
    if (addressType === 'empt') { // 如果为空
      setErrMsg('字段不能为空'); // 设置错误消息
    } else if (addressType === 'err') { // 如果格式错误
      setErrMsg('必须是有效的URL、IPv4或IPv6地址'); // 设置错误消息
    } else { // 如果地址有效
      // 如果地址类型是'url'且地址不以'http://'或'https://'开头，则添加'https://'
      if (addressType === 'url' && !/^https?:\/\//i.test(address)) {
        address = 'https://' + address; // 添加https协议
      }
      const resultRouteParams: NavigateOptions = { state: { address, addressType } }; // 导航参数
      navigate(`/check/${encodeURIComponent(address)}`, resultRouteParams); // 导航到检查页面
    }
  };
  

  /* 更新用户输入状态，如果字段有效则隐藏错误消息 */
  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value); // 更新用户输入状态
    const isError = ['err', 'empt'].includes(determineAddressType(event.target.value)); // 检查是否为错误
    if (!isError) setErrMsg(''); // 如果没有错误，清除错误消息
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => { // 处理键盘按键事件
    if (event.key === 'Enter') { // 如果按下回车键
      event.preventDefault(); // 阻止默认行为
      submit(); // 提交表单
    }
  };

  const formSubmitEvent = (event: FormEvent<HTMLFormElement>) => { // 处理表单提交事件
    event.preventDefault(); // 阻止默认行为
    submit(); // 提交表单
  }

  // const findIpAddress = () => { // 查找IP地址函数（已注释）
  //   setUserInput(''); // 清空用户输入
  //   setPlaceholder('正在查找您的IP...'); // 设置占位符
  //   setInputDisabled(true); // 禁用输入框
  //   fetch('https://ipapi.co/json/') // 获取IP地址
  //     .then(function(response) { // 处理响应
  //       response.json().then(jsonData => { // 解析JSON数据
  //         setUserInput(jsonData.ip); // 设置用户输入为IP地址
  //         setPlaceholder(defaultPlaceholder); // 恢复默认占位符
  //         setInputDisabled(true); // 禁用输入框
  //       });
  //     })
  //     .catch(function(error) { // 处理错误
  //       console.log('获取IP地址失败 :\'(', error) // 输出错误信息
  //     });
  // };


  return (
    <HomeContainer>
      <FancyBackground /> // 背景组件
      <UserInputMain onSubmit={formSubmitEvent}>
        <a href="/">
          <Heading as="h1" size="xLarge" align="center" color={colors.primary}>
            <img width="64" src="/web-check.png" alt="Web Check Icon" />
            Web Check
          </Heading>
        </a>
        <Input
          id="user-input"
          value={userInput}
          label="输入URL"
          size="large"
          orientation="vertical"
          name="url"
          placeholder={placeholder}
          disabled={inputDisabled}
          handleChange={inputChange}
          handleKeyDown={handleKeyPress}
        />
        {/* <FindIpButton onClick={findIpAddress}>或者，查找我的IP</FindIpButton> */}
        { errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        <Button type="submit" styles="width: calc(100% - 1rem);" size="large" onClick={submit}>分析！</Button>
      </UserInputMain>
      <SponsorCard>
        <Heading as="h2" size="small" color={colors.primary}>赞助商</Heading>
        <div className="inner">
          <p>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh"
            >
              Terminal Trove
            </a> - 终端领域的一切之家。
            <br />
            <span className="cta">
              通过
              <a
                target="_blank"
                rel="noreferrer"
                className="cta"
                href="https://terminaltrove.com/newsletter?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh"
                >
                Terminal Trove新闻通讯
              </a>
              获取最新的CLI/TUI工具更新
            </span>
            
          </p>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://terminaltrove.com/?utm_campaign=github&utm_medium=referral&utm_content=web-check&utm_source=wcgh">
            <img width="120" alt="Terminal Trove" src="https://i.ibb.co/NKtYjJ1/terminal-trove-web-check.png" />
          </a>
        </div>

      </SponsorCard>
      <SiteFeaturesWrapper>
        <div className="features">
          <Heading as="h2" size="small" color={colors.primary}>支持的检查</Heading>
          <ul>
            {docs.map((doc, index) => (<li key={index}>{doc.title}</li>))}
            <li><Link to="/check/about">+ 更多！</Link></li>
          </ul>
        </div>
        <div className="links">
          <a target="_blank" rel="noreferrer" href="https://github.com/lissy93/web-check" title="在GitHub上查看源代码和文档，获取支持或贡献代码">
            <Button>在GitHub上查看</Button>
          </a>
          <a target="_blank" rel="noreferrer" href="https://app.netlify.com/start/deploy?repository=https://github.com/lissy93/web-check" title="将您自己的私有或公共Web-Check实例部署到Netlify">
            <Button>部署您自己的</Button>
          </a>
          <Link to="/check/about#api-documentation" title="查看API文档，以编程方式使用Web-Check">
            <Button>API文档</Button>
          </Link>
        </div>
      </SiteFeaturesWrapper>
      <Footer isFixed={true} />
    </HomeContainer>
  );
}

export default Home; // 导出默认组件
