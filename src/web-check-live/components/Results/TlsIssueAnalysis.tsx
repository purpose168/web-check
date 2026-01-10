
// ==================== 导入依赖 ====================
import { useState, useEffect } from 'react';  // React Hooks：状态管理和副作用处理
import styled from '@emotion/styled';  // Emotion 样式库，用于创建样式化组件
import colors from 'web-check-live/styles/colors';  // 颜色主题配置
import { Card } from 'web-check-live/components/Form/Card';  // 卡片容器组件
import Button from 'web-check-live/components/Form/Button';  // 按钮组件
import Row, { ExpandableRow } from 'web-check-live/components/Form/Row';  // 行显示组件和可展开行组件

// ==================== 可展开详情样式组件 ====================
// 用于显示可折叠的详细信息
const Expandable = styled.details`
margin-top: 0.5rem;  // 上边距为 0.5rem
cursor: pointer;  // 鼠标悬停时显示指针
summary::marker {
  color: ${colors.primary};  // 标记颜色为主题色
}
`;

// ==================== 准备可展开数据 ====================
// 将 TLS 分析结果转换为可展开行的数据格式
// 输入：TLS 分析结果对象
// 输出：可展开行数据数组
// 数据结构：
// - title: 分析器名称
// - value: 分析结果（✅ 成功，❌ 失败）
// - fields: 详细字段数组 [{lbl, val}, ...]
const makeExpandableData = (results: any) => {
  if (!results || !results.analysis || results.analysis.length === 0) {
    return [];  // 如果没有分析结果，返回空数组
  }
  return results.analysis.map((analysis: any) => {
    // 将分析结果转换为字段数组
    const fields = Object.keys(analysis.result).map((label) => {
      const lbl = isNaN(parseInt(label, 10)) ? label : '';  // 如果标签是数字，则不显示
      const val = analysis.result[label] || 'None';  // 获取值，如果不存在则显示 'None'
      if (typeof val !== 'object') {
        return { lbl, val };  // 如果值不是对象，直接返回
      }
      return { lbl, val: '', plaintext: JSON.stringify(analysis.result[label])};  // 如果值是对象，转换为 JSON 字符串
    });
    return {
      title: analysis.analyzer,  // 分析器名称
      value: analysis.success ? '✅' : '❌',  // 成功或失败标记
      fields,  // 详细字段
    };
  });
};

// ==================== 准备结果数据 ====================
// 从 TLS 分析结果中提取关键信息并格式化
// 输入：TLS 分析结果对象
// 输出：格式化的结果行数组
// 提取的信息包括：
// - CA 授权状态
// - Mozilla 评级
// - Symantec 证书信任状态
// - 证书排名
// - Mozilla 评估级别
// - 安全问题列表
const makeResults = (results: any) => {
  const rows: { lbl: string; val?: any; plaintext?: string; list?: string[] }[] = [];
  if (!results || !results.analysis || results.analysis.length === 0) {
    return rows;  // 如果没有分析结果，返回空数组
  }
  
  // ==================== CA 授权分析 ====================
  const caaWorker = results.analysis.find((a: any) => a.analyzer === 'caaWorker');
  if (caaWorker.result.host) rows.push({ lbl: 'Host', val: caaWorker.result.host });  // 主机名
  if (typeof caaWorker.result.has_caa === 'boolean') rows.push({ lbl: 'CA Authorization', val: caaWorker.result.has_caa });  // CA 授权状态
  if (caaWorker.result.issue) rows.push({ lbl: 'CAAs allowed to Issue Certs', plaintext: caaWorker.result.issue.join('\n') });  // 允许颁发证书的 CA 列表

  // ==================== Mozilla 评级分析 ====================
  const mozillaGradingWorker = (results.analysis.find((a: any) => a.analyzer === 'mozillaGradingWorker')).result;
  if (mozillaGradingWorker.grade) rows.push({ lbl: 'Mozilla Grading', val: mozillaGradingWorker.grade });  // Mozilla 评级
  if (mozillaGradingWorker.gradeTrust) rows.push({ lbl: 'Mozilla Trust', val: mozillaGradingWorker.gradeTrust });  // Mozilla 信任级别

  // ==================== Symantec 证书信任分析 ====================
  const symantecDistrust = (results.analysis.find((a: any) => a.analyzer === 'symantecDistrust')).result;
  if (typeof symantecDistrust.isDistrusted === 'boolean') rows.push({ lbl: 'No distrusted symantec SSL?', val: !symantecDistrust.isDistrusted });  // 是否没有不受信任的 Symantec SSL
  if (symantecDistrust.reasons) rows.push({ lbl: 'Symantec Distrust', plaintext: symantecDistrust.reasons.join('\n') });  // Symantec 不受信任的原因

  // ==================== 证书排名分析 ====================
  const top1m = (results.analysis.find((a: any) => a.analyzer === 'top1m')).result;
  if (top1m.certificate.rank) rows.push({ lbl: 'Certificate Rank', val: top1m.certificate.rank.toLocaleString() });  // 证书排名

  // ==================== Mozilla 评估分析 ====================
  const mozillaEvaluationWorker = (results.analysis.find((a: any) => a.analyzer === 'mozillaEvaluationWorker')).result;
  if (mozillaEvaluationWorker.level) rows.push({ lbl: 'Mozilla Evaluation Level', val: mozillaEvaluationWorker.level });  // Mozilla 评估级别
  if (mozillaEvaluationWorker.failures) {
    // 提取各种类型的问题
    const { bad, old, intermediate, modern } = mozillaEvaluationWorker.failures;
    if (bad) rows.push({ lbl: `Critical Security Issues (${bad.length})`, list: bad });  // 严重安全问题
    if (old) rows.push({ lbl: `Compatibility Config Issues (${old.length})`, list: old });  // 兼容性配置问题
    if (intermediate) rows.push({ lbl: `Intermediate Issues (${intermediate.length})`, list: intermediate });  // 中级问题
    if (modern) rows.push({ lbl: `Modern Issues (${modern.length})`, list: modern });  // 现代化问题
  }
  return rows;
};

// ==================== TLS 问题分析卡片组件 ====================
// 显示 TLS/SSL 配置的安全问题和分析结果
// TLS (Transport Layer Security) 是一种安全协议，用于在互联网上提供通信安全
// 分析内容包括：
// - CA 授权配置
// - Mozilla 评级和信任级别
// - Symantec 证书信任状态
// - 证书排名
// - Mozilla 评估级别
// - 各种安全问题（严重、兼容性、中级、现代化）
// Props 说明：
// - data: TLS 分析数据对象，包含：
//   - id: 扫描 ID，用于重新获取报告
//   - analysis: 分析结果数组
// - title: 卡片标题
// - actionButtons: 操作按钮组件
// 显示内容：
// 1. 关键安全指标（CA 授权、Mozilla 评级等）
// 2. 可展开的完整分析结果
// 3. 重新获取报告按钮（如果报告未完成）
const TlsCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {

  // ==================== 状态管理 ====================
  const [tlsRowData, setTlsRowWata] = useState(makeExpandableData(props.data));  // 可展开行数据
  const [tlsResults, setTlsResults] = useState(makeResults(props.data));  // 结果数据
  const [loadState, setLoadState] = useState<undefined | 'loading' | 'success' | 'error'>(undefined);  // 加载状态

  // ==================== 副作用：数据更新 ====================
  // 当 props.data 变化时，更新状态
  useEffect(() => {
    setTlsRowWata(makeExpandableData(props.data));
    setTlsResults(makeResults(props.data));
  }, [props.data]);

  // ==================== 重新获取报告 ====================
  // 从 Mozilla TLS Observatory API 重新获取分析报告
  // 参数：id - 扫描 ID
  // 流程：
  // 1. 清空当前数据
  // 2. 设置加载状态为 'loading'
  // 3. 发送 HTTP 请求到 Mozilla TLS Observatory API
  // 4. 解析响应并更新数据
  // 5. 设置加载状态为 'success' 或 'error'
  const updateData = (id: number) => {
    setTlsRowWata([]);  // 清空可展开行数据
    setLoadState('loading');  // 设置加载状态
    const fetchUrl = `https://tls-observatory.services.mozilla.com/api/v1/results?id=${id}`;  // Mozilla TLS Observatory API URL
    fetch(fetchUrl)
      .then((response) => response.json())  // 解析 JSON 响应
      .then((data) => {
        setTlsRowWata(makeExpandableData(data));  // 更新可展开行数据
        setTlsResults(makeResults(data));  // 更新结果数据
        setLoadState('success');  // 设置加载状态为成功
    }).catch(() => {
      setLoadState('error');  // 设置加载状态为错误
    });
  };
  
  const scanId = props.data?.id;  // 获取扫描 ID
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {/* 显示关键安全指标 */}
      { tlsResults.length > 0 && tlsResults.map((row: any, index: number) => {
        return (
          <Row
            lbl={row.lbl}
            val={row.val}
            plaintext={row.plaintext}
            listResults={row.list}
            key={`tls-issues-${index}`}
          />
        );
      })}
      {/* 可展开的完整分析结果 */}
      <Expandable>
        <summary>完整分析结果</summary>
        { tlsRowData.length > 0 && tlsRowData.map((cipherSuite: any, index: number) => {
          return (
            <ExpandableRow lbl={cipherSuite.title} val={cipherSuite.value || '?'} rowList={cipherSuite.fields} />
          );
        })}
      </Expandable>
      {/* 如果没有数据，显示重新获取按钮 */}
      { !tlsRowData.length && (
        <div>
          <p>没有可用的分析条目。<br />
            这通常发生在报告未能及时生成完成的情况下，您可以尝试重新请求报告。
          </p>
          <Button loadState={loadState} onClick={() => updateData(scanId)}>重新获取报告</Button>
        </div>
      )}
    </Card>
  );
}

export default TlsCard;
