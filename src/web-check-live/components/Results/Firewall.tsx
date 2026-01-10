import styled from '@emotion/styled';
import { Card } from 'web-check-live/components/Form/Card';
import Row from 'web-check-live/components/Form/Row';

// 使用styled创建的small元素样式，用于显示提示信息
const Note = styled.small`
opacity: 0.5;
display: block;
margin-top: 0.5rem;
`;

// 防火墙信息卡片组件，用于显示网站的WAF（Web应用防火墙）状态
const FirewallCard = (props: { data: any, title: string, actionButtons: any }): JSX.Element => {
  // 从props中获取防火墙数据
  const data = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {/* 显示防火墙状态 */}
      <Row lbl="防火墙" val={data.hasWaf ? '✅ 是' : '❌ 否*' } />
      {/* 如果检测到WAF，显示WAF名称 */}
      { data.waf && <Row lbl="WAF" val={data.waf} /> }
      {/* 如果没有检测到WAF，显示说明 */}
      { !data.hasWaf && (<Note>
        *该域名可能受到专有或自定义WAF的保护，我们无法自动识别
      </Note>) }
    </Card>
  );
}

export default FirewallCard;
