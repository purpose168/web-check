
// ==================== 导入依赖 ====================
import { Card } from 'web-check-live/components/Form/Card';  // 卡片组件
import Row from 'web-check-live/components/Form/Row';  // 数据行组件

// ==================== 封锁列表卡片组件 ====================
// 显示目标网站在各个封锁列表中的状态
const BlockListsCard = (props: {data: any, title: string, actionButtons: any}): JSX.Element => {
  const blockLists = props.data.blocklists;  // 获取封锁列表数据
  
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {/* 遍历所有封锁列表，显示每个服务器的封锁状态 */}
      { blockLists.map((blocklist: any, blockIndex: number) => (
        <Row
          title={blocklist.serverIp}  // 服务器 IP 地址（作为工具提示）
          lbl={blocklist.server}  // 服务器名称
          val={blocklist.isBlocked ? '❌ Blocked' : '✅ Not Blocked'}  // 封锁状态：被封锁或未被封锁
          key={`blocklist-${blockIndex}-${blocklist.serverIp}`}  // 唯一键值
        />
      ))}
    </Card>
  );
}

export default BlockListsCard;  // 导出封锁列表卡片组件
