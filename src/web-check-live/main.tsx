import { BrowserRouter } from "react-router-dom"; // 导入浏览器路由组件
import { StaticRouter } from "react-router-dom/server"; // 导入静态路由组件（用于服务端渲染）
import App from "./App.tsx"; // 导入App组件

export default ({ pathname }: { pathname: string }) => ( // 默认导出函数，接收路径名参数
    import.meta.env.SSR // 检查是否启用服务端渲染（SSR）
        ? <StaticRouter location={pathname}><App/></StaticRouter> // 如果是SSR模式，使用静态路由
        : <BrowserRouter><App/></BrowserRouter> // 否则使用浏览器路由
)
