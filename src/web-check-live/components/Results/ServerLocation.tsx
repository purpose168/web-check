
import styled from '@emotion/styled';
import type { ServerLocation } from 'web-check-live/utils/result-processor';
import { Card } from 'web-check-live/components/Form/Card';
import LocationMap from 'web-check-live/components/misc/LocationMap';
import Flag from 'web-check-live/components/misc/Flag';
import { TextSizes } from 'web-check-live/styles/typography';
import Row, { StyledRow } from 'web-check-live/components/Form/Row';

// 卡片样式定义
const cardStyles = '';

// 小号文本样式组件，用于显示辅助信息
const SmallText = styled.span`
  opacity: 0.5;
  font-size: ${TextSizes.xSmall};
  text-align: right;
  display: block;
`;

// 地图行样式组件，用于垂直布局的地图显示
const MapRow = styled(StyledRow)`
  padding-top: 1rem;
  flex-direction: column;
`;

// 国家值样式组件，用于显示国家名称和国旗
const CountryValue = styled.span`
  display: flex;
  gap: 0.5rem;
`;

// 服务器位置卡片组件，用于显示服务器的地理位置信息
const ServerLocationCard = (props: { data: ServerLocation, title: string, actionButtons: any }): JSX.Element => {
  // 从props中解构获取服务器位置数据
  const location = props.data;
  // 从位置数据中解构获取各个字段
  const {
    city, region, country,
    postCode, countryCode, coords,
    isp, timezone, languages, currency, currencyCode,
  } = location;

  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <Row lbl="城市" val={`${postCode}, ${city}, ${region}`} />
      <Row lbl="" val="">
        <b>国家</b>
        <CountryValue>
          {country}
          { countryCode && <Flag countryCode={countryCode} width={28} /> }
        </CountryValue>
      </Row>
      <Row lbl="时区" val={timezone} />
      <Row lbl="语言" val={languages} />
      <Row lbl="货币" val={`${currency} (${currencyCode})`} />
      <MapRow>
        <LocationMap lat={coords.latitude} lon={coords.longitude} label={`服务器 (${isp})`} />
        <SmallText>纬度: {coords.latitude}, 经度: {coords.longitude} </SmallText>
      </MapRow>
    </Card>
  );
}

export default ServerLocationCard;
