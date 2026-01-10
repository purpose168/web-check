
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import { Card } from 'web-check-live/components/Form/Card';
import Row, { ExpandableRow } from 'web-check-live/components/Form/Row';

// 可展开详情组件，用于显示可折叠的详细信息
const Expandable = styled.details`
margin-top: 0.5rem;
cursor: pointer;
summary::marker {
  color: ${colors.primary};
}
`;

// 获取可展开标题函数，从URL对象中提取路径名和ID
const getExpandableTitle = (urlObj: any) => {
  let pathName = '';
  try {
    pathName = new URL(urlObj.url).pathname;
  } catch(e) {}
  return `${pathName} (${urlObj.id})`;
}

// 转换为日期函数，将日期字符串转换为日期对象并格式化
const convertToDate = (dateString: string): string => {
  const [date, time] = dateString.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);
  const dateObject = new Date(year, month - 1, day, hour, minute, second);
  if (isNaN(dateObject.getTime())) {
    return dateString;
  }
  return dateObject.toString();
}

// 恶意软件卡片组件，用于显示网站的安全威胁信息
const MalwareCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {
  // 从props中解构获取各种威胁检测数据
  const urlHaus = props.data.urlHaus || {};
  const phishTank = props.data.phishTank || {};
  const cloudmersive = props.data.cloudmersive || {};
  const safeBrowsing = props.data.safeBrowsing || {};
  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { safeBrowsing && !safeBrowsing.error && (
        <Row lbl="Google安全浏览" val={safeBrowsing.unsafe ? '❌ 不安全' : '✅ 安全'} />
      )}
      { ((cloudmersive && !cloudmersive.error) || safeBrowsing?.details) && (
        <Row lbl="威胁类型" val={safeBrowsing?.details?.threatType || cloudmersive.WebsiteThreatType || '无 :)'} />
      )}
      { phishTank && !phishTank.error && (
        <Row lbl="钓鱼状态" val={phishTank?.url0?.in_database !== 'false' ? '❌ 发现钓鱼网站' : '✅ 未发现钓鱼网站'} />
      )}
      { phishTank.url0 && phishTank.url0.phish_detail_page && (
        <Row lbl="" val="">
          <span className="lbl">钓鱼信息</span>
          <span className="val"><a href={phishTank.url0.phish_detail_page}>{phishTank.url0.phish_id}</a></span>  
        </Row>
      )}
      { urlHaus.query_status === 'no_results' && <Row lbl="恶意软件状态" val="✅ 未发现恶意软件" />}
      { urlHaus.query_status === 'ok' && (
        <>
        <Row lbl="状态" val="❌ 发现恶意软件" />
        <Row lbl="首次发现" val={convertToDate(urlHaus.firstseen)} />
        <Row lbl="恶意URL数量" val={urlHaus.url_count} />
        </>
      )}
      {urlHaus.urls && (
        <Expandable>
          <summary>展开结果</summary>
          { urlHaus.urls.map((urlResult: any, index: number) => {
          const rows = [
            { lbl: 'ID', val: urlResult.id },
            { lbl: '状态', val: urlResult.url_status },
            { lbl: '添加日期', val: convertToDate(urlResult.date_added) },
            { lbl: '威胁类型', val: urlResult.threat },
            { lbl: '报告者', val: urlResult.reporter },
            { lbl: '下架时间', val: urlResult.takedown_time_seconds },
            { lbl: '已警告', val: urlResult.larted },
            { lbl: '标签', val: (urlResult.tags || []).join(', ') },
            { lbl: '参考', val: urlResult.urlhaus_reference },      
            { lbl: '文件路径', val: urlResult.url },      
          ];
          return (<ExpandableRow lbl={getExpandableTitle(urlResult)} val="" rowList={rows} />)
        })}
        </Expandable>
      )}
    </Card>
  );
}

export default MalwareCard;
