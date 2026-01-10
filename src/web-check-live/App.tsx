import { Routes, Route, Outlet } from 'react-router-dom'; // 导入路由相关组件

import Home from 'web-check-live/views/Home.tsx'; // 导入首页组件
import Results from 'web-check-live/views/Results.tsx'; // 导入结果页面组件
import About from 'web-check-live/views/About.tsx'; // 导入关于页面组件
import NotFound from 'web-check-live/views/NotFound.tsx'; // 导入未找到页面组件

import ErrorBoundary from 'web-check-live/components/boundaries/PageError.tsx'; // 导入页面错误边界组件
import GlobalStyles from './styles/globals.tsx'; // 导入全局样式组件

const Layout = () => { // 布局组件
  return ( // 返回JSX元素
  <>
    <GlobalStyles /> {/* 全局样式 */}
    <Outlet /> {/* 子路由出口 */}
  </>
  );
}

export default function App() { // 默认导出App组件
  return ( // 返回JSX元素
    <ErrorBoundary> {/* 错误边界 */}
      <Routes> {/* 路由配置 */}
        <Route path="/check" element={<Layout />}> {/* 主路由 */}
          <Route index element={<Home />} /> {/* 首页路由 */}
          <Route path="home" element={<Home />} /> {/* 首页路由 */}
          <Route path="about" element={<About />} /> {/* 关于页面路由 */}
          <Route path=":urlToScan" element={<Results />} /> {/* 结果页面路由 */}
          <Route path="*" element={<NotFound />} /> {/* 未找到页面路由 */}
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
