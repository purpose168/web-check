// ==================== 导入依赖模块 ====================
import styled from '@emotion/styled';  // Emotion 样式库，用于创建 styled components
import docs, { type Doc } from 'web-check-live/utils/docs';  // 导入文档数据和文档类型定义
import colors from 'web-check-live/styles/colors';  // 导入颜色主题配置
import Heading from 'web-check-live/components/Form/Heading';  // 导入标题组件

// ==================== 文档容器样式组件 ====================
// 定义文档内容的容器样式，包含段落、列表和标题的样式
const JobDocsContainer = styled.div`
p.doc-desc, p.doc-uses, ul {
  margin: 0.25rem auto 1.5rem auto;  // 设置段落和列表的外边距
}
ul {
  padding: 0 0.5rem 0 1rem;  // 设置列表的内边距
}
ul li a {
  color: ${colors.primary};  // 列表链接使用主题色
}
summary { color: ${colors.primary};}  // 折叠详情的摘要使用主题色
h4 {
  border-top: 1px solid ${colors.primary};  // h4 标题顶部添加主题色边框
  color: ${colors.primary};  // h4 标题使用主题色
  opacity: 0.75;  // 设置透明度
  padding: 0.5rem 0;  // 设置内边距
}
`;

// ==================== 文档内容组件 ====================
// 根据文档 ID 显示相应的组件文档，包括标题、描述、使用场景、链接和示例截图
const DocContent = (id: string) => {
  // ==================== 查找文档 ====================
  // 根据 ID 从文档列表中查找对应的文档
  const doc = docs.filter((doc: Doc) => doc.id === id)[0] || null;
  
  // ==================== 渲染文档内容 ====================
  // 如果找到文档，显示完整的文档信息；否则显示提示信息
  return (
    doc? (<JobDocsContainer>
      {/* 显示文档标题 */}
      <Heading as="h3" size="medium" color={colors.primary}>{doc.title}</Heading>
      
      {/* 显示关于部分 */}
      <Heading as="h4" size="small">About</Heading>
      <p className="doc-desc">{doc.description}</p>
      
      {/* 显示使用场景 */}
      <Heading as="h4" size="small">Use Cases</Heading>
      <p className="doc-uses">{doc.use}</p>
      
      {/* 显示相关链接 */}
      <Heading as="h4" size="small">Links</Heading>
      <ul>
        {/* 遍历资源列表，支持字符串和对象两种格式 */}
        {doc.resources.map((resource: string | { title: string, link: string } , index: number) => (
          typeof resource === 'string' ? (
            // 字符串格式：直接显示链接
            <li id={`link-${index}`}><a target="_blank" rel="noreferrer" href={resource}>{resource}</a></li>
          ) : (
            // 对象格式：显示标题和链接
            <li id={`link-${index}`}><a target="_blank" rel="noreferrer" href={resource.link}>{resource.title}</a></li>
          )
        ))}
      </ul>
      
      {/* 显示示例截图（可折叠） */}
      <details>
        <summary><Heading as="h4" size="small">Example</Heading></summary>
        <img width="300" src={doc.screenshot} alt="Screenshot" />
      </details>
    </JobDocsContainer>)
  : (
    // 未找到文档时显示的提示信息
    <JobDocsContainer>
      <p>No Docs provided for this widget yet</p>
    </JobDocsContainer>
    ));
};

export default DocContent;
