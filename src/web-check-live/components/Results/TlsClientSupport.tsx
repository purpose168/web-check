
import { useState, useEffect } from 'react';
import { Card } from 'web-check-live/components/Form/Card';
import Button from 'web-check-live/components/Form/Button';
import { ExpandableRow } from 'web-check-live/components/Form/Row';

// 构建客户端支持函数，从结果数据中提取并格式化客户端支持信息
const makeClientSupport = (results: any) => {
  // 如果结果数据无效或分析结果为空，返回空数组
  if (!results?.analysis || results.analysis.length <1) return [];
  // 获取目标主机
  const target = results.target;
  // 从分析结果中查找SSL Labs客户端支持数据
  const sslLabsClientSupport = (
      results.analysis.find((a: any) => a.analyzer === 'sslLabsClientSupport')
    ).result;

  // 映射客户端支持数据，返回格式化的对象数组
  return sslLabsClientSupport.map((sup: any) => {
    return {
      title: `${sup.name} ${sup.platform ?  `(在 ${sup.platform} 上)`: sup.version}`,
      value: sup.is_supported ? '✅' : '❌',
      fields: sup.is_supported ? [
        sup.curve ? { lbl: '曲线', val: sup.curve } : {},
        { lbl: '协议', val: sup.protocol },
        { lbl: '密码套件', val: sup.ciphersuite },
        { lbl: '协议代码', val: sup.protocol_code },
        { lbl: '密码套件代码', val: sup.ciphersuite_code },
        { lbl: '曲线代码', val: sup.curve_code },
      ] : [
        { lbl: '', val: '',
        plaintext: `主机 ${target} 不支持 ${sup.name} `
          +`${sup.version ?  `版本 ${sup.version} `: ''} `
          + `${sup.platform ?  `在 ${sup.platform} 上 `: ''}`}
      ],
    };
  });
  
};

// TLS卡片组件，用于显示TLS客户端支持信息
const TlsCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {

  // 状态管理：客户端支持数据和加载状态
  const [clientSupport, setClientSupport] = useState(makeClientSupport(props.data));
  const [loadState, setLoadState] = useState<undefined | 'loading' | 'success' | 'error'>(undefined);

  // 当数据变化时更新客户端支持信息
  useEffect(() => {
    setClientSupport(makeClientSupport(props.data));
  }, [props.data]);

  // 更新数据函数，从Mozilla TLS Observatory获取最新的客户端支持信息
  const updateData = (id: number) => {
    setClientSupport([]);
    setLoadState('loading');
    const fetchUrl = `https://tls-observatory.services.mozilla.com/api/v1/results?id=${id}`;
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setClientSupport(makeClientSupport(data));
        setLoadState('success');
    }).catch(() => {
      setLoadState('error');
    });
  };
  
  // 获取扫描ID
  const scanId = props.data?.id;
  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {clientSupport.map((support: any, index: number) => {
        return (
        <ExpandableRow
          key={`tls-client-${index}`}
          lbl={support.title}
          val={support.value || '?'}
          rowList={support.fields}
        />
      )
      })}
      { !clientSupport.length && (
        <div>
          <p>没有可分析的条目。<br />
            这有时是因为报告未及时生成完成，您可以尝试重新请求。
          </p>
          <Button loadState={loadState} onClick={() => updateData(scanId)}>重新获取报告</Button>
        </div>
      )}
    </Card>
  );
}

export default TlsCard;
