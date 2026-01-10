
import { useState, useEffect } from 'react';
import { Card } from 'web-check-live/components/Form/Card';
import Button from 'web-check-live/components/Form/Button';
import { ExpandableRow } from 'web-check-live/components/Form/Row';

// 构建密码套件函数，从结果数据中提取并格式化密码套件信息
const makeCipherSuites = (results: any) => {
  // 如果结果数据无效或密码套件为空，返回空数组
  if (!results || !results.connection_info || (results.connection_info.ciphersuite || [])?.length === 0) {
    return [];
  }
  // 映射密码套件数据，返回格式化的对象数组
  return results.connection_info.ciphersuite.map((ciphersuite: any) => {
    return {
      title: ciphersuite.cipher,
      fields: [
      { lbl: '代码', val: ciphersuite.code },
      { lbl: '协议', val: ciphersuite.protocols.join(', ') },
      { lbl: '公钥', val: ciphersuite.pubkey },
      { lbl: '签名算法', val: ciphersuite.sigalg },
      { lbl: '票据提示', val: ciphersuite.ticket_hint },
      { lbl: 'OCSP装订', val: ciphersuite.ocsp_stapling ? '✅ 已启用' : '❌ 已禁用' },
      { lbl: '前向保密', val: ciphersuite.pfs },
      ciphersuite.curves ? { lbl: '曲线', val: ciphersuite.curves.join(', ') } : {},
    ]};
  });
};

// TLS卡片组件，用于显示TLS密码套件信息
const TlsCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {

  // 状态管理：密码套件数据和加载状态
  const [cipherSuites, setCipherSuites] = useState(makeCipherSuites(props.data));
  const [loadState, setLoadState] = useState<undefined | 'loading' | 'success' | 'error'>(undefined);

  // 当数据变化时更新密码套件
  useEffect(() => { // Update cipher suites when data changes
    setCipherSuites(makeCipherSuites(props.data));
  }, [props.data]);

  // 更新数据函数，从Mozilla TLS Observatory获取最新的密码套件信息
  const updateData = (id: number) => {
    setCipherSuites([]);
    setLoadState('loading');
    const fetchUrl = `https://tls-observatory.services.mozilla.com/api/v1/results?id=${id}`;
    fetch(fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        setCipherSuites(makeCipherSuites(data));
        setLoadState('success');
    }).catch((error) => {
      setLoadState('error');
    });
  };
  
  // 获取扫描ID
  const scanId = props.data?.id;
  return (
    // 使用Card组件作为容器，显示标题和操作按钮
    <Card heading={props.title} actionButtons={props.actionButtons}>
      { cipherSuites.length && cipherSuites.map((cipherSuite: any, index: number) => {
        return (
          <ExpandableRow key={`tls-cipher-${index}`} lbl={cipherSuite.title} val="" rowList={cipherSuite.fields} />
        );
      })}
      { !cipherSuites.length && (
        <div>
          <p>未找到密码套件。<br />
            这有时是因为报告未及时生成完成，您可以尝试重新请求。
          </p>
          <Button loadState={loadState} onClick={() => updateData(scanId)}>重新获取报告</Button>
        </div>
      )}
    </Card>
  );
}

export default TlsCard;
