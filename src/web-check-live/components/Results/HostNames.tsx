
import styled from '@emotion/styled';
import type { HostNames } from 'web-check-live/utils/result-processor';
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Heading from 'web-check-live/components/Form/Heading';

// 使用styled创建的行样式，用于显示主机名列表项
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.25rem;
  &:not(:last-child) { border-bottom: 1px solid ${colors.primaryTransparent}; }
  span:first-child { font-weight: bold; }
`;

// 主机列表区域组件，用于显示域名或主机名列表
const HostListSection = (props: { list: string[], title: string }) => {
  // 从props中解构获取列表和标题
  const { list, title } = props;
  return (
  <>
    {/* 显示区域标题 */}
    <Heading as="h4" size="small" align="left" color={colors.primary}>{title}</Heading>
    {/* 遍历并显示列表中的每个条目 */}
    { list.map((entry: string, index: number) => {
      return (
      <Row key={`${title.toLocaleLowerCase()}-${index}`}><span>{ entry }</span></Row>
      )}
    )}
  </>
);
}

// 卡片样式，设置最大高度和滚动行为
const cardStyles = `
  max-height: 50rem;
  overflow: auto;
`;

// 主机名信息卡片组件，用于显示域名和主机名列表
const HostNamesCard = (props: { data: HostNames, title: string, actionButtons: any }): JSX.Element => {
  // 从props中获取主机名数据
  const hosts = props.data;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      {/* 如果有域名数据，显示域名列表 */}
      { hosts.domains.length > 0 &&
        <HostListSection list={hosts.domains} title="域名" />
      }
      {/* 如果有主机名数据，显示主机名列表 */}
      { hosts.hostnames.length > 0 &&
        <HostListSection list={hosts.hostnames} title="主机" />
      }
    </Card>
  );
}

export default HostNamesCard;
