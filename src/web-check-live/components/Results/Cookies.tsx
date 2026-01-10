import { Card } from 'web-check-live/components/Form/Card';
import { ExpandableRow } from 'web-check-live/components/Form/Row';
import type { Cookie } from 'web-check-live/utils/result-processor';

// 解析HTTP头中的cookie字符串，将其转换为结构化的cookie对象数组
export const parseHeaderCookies = (cookiesHeader: string[]): Cookie[] => {
  // 如果没有cookie头或为空数组，返回空数组
  if (!cookiesHeader || !cookiesHeader.length) return [];
  // 使用flatMap处理所有cookie头，然后使用split分割每个cookie
  const cookies = cookiesHeader.flatMap(cookieHeader => {
    // 使用正则表达式分割cookie字符串，确保正确处理多个cookie
    return cookieHeader.split(/,(?=\s[A-Za-z0-9]+=)/).map(cookieString => {
      // 分割cookie字符串为名称值对和属性对
      const [nameValuePair, ...attributePairs] = cookieString.split('; ').map(part => part.trim());
      // 分割名称值对
      const [name, value] = nameValuePair.split('=');
      // 创建属性对象
      const attributes: Record<string, string> = {};
      // 遍历属性对，填充属性对象
      attributePairs.forEach(pair => {
        const [attributeName, attributeValue = ''] = pair.split('=');
        attributes[attributeName] = attributeValue;
      });
      // 返回结构化的cookie对象
      return { name, value, attributes };
    });
  });
  return cookies;
};

// Cookie信息卡片组件，用于显示HTTP头中的cookie和客户端cookie
const CookiesCard = (props: { data: any, title: string, actionButtons: any}): JSX.Element => {
  // 解析HTTP头中的cookie
  const headerCookies = parseHeaderCookies(props.data.headerCookies) || [];
  // 获取客户端cookie
  const clientCookies = props.data.clientCookies || [];
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {
        // 遍历并显示HTTP头中的cookie
        headerCookies.map((cookie: any, index: number) => {
          // 将cookie属性转换为可显示的键值对数组
          const attributes = Object.keys(cookie.attributes).map((key: string) => {
            return { lbl: key, val: cookie.attributes[key] }
          });
          return (
            <ExpandableRow key={`cookie-${index}`} lbl={cookie.name} val={cookie.value} rowList={attributes} />
          )
        })
      }
      {
        // 遍历并显示客户端cookie
        clientCookies.map((cookie: any) => {
          // 将cookie对象的所有属性转换为可显示的键值对数组
          const nameValPairs = Object.keys(cookie).map((key: string) => { return { lbl: key, val: cookie[key] }});
          return (
            <ExpandableRow key={`cookie-${cookie.name}`} lbl={cookie.name} val="" rowList={nameValPairs} />
          );
        })
      }
    </Card>
  );
}

export default CookiesCard;
