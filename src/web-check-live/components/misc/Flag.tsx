// ==================== 国旗组件属性接口 ====================
// 定义国旗组件的可配置属性
interface Props {
  countryCode: string,  // 国家代码（ISO 3166-1 alpha-2）
  width: number,  // 国旗宽度（高度会自动计算为宽度的 0.75 倍）
};

// ==================== 国旗组件 ====================
// 根据国家代码显示对应的国旗图片
const Flag = ({ countryCode, width }: Props): JSX.Element => {

  // ==================== 生成国旗图片 URL ====================
  // 使用 flagcdn.com 提供的国旗图片服务
  const getFlagUrl = (code: string, w: number = 64) => {
    const protocol = 'https';  // 协议
    const cdn = 'flagcdn.com';  // CDN 域名
    const dimensions = `${width}x${width * 0.75}`;  // 尺寸（国旗标准比例为 4:3）
    const country = countryCode.toLowerCase();  // 国家代码转为小写
    const ext = 'png';  // 图片格式
    return `${protocol}://${cdn}/${dimensions}/${country}.${ext}`;
  };

  // ==================== 渲染国旗图片 ====================
  return (<img src={getFlagUrl(countryCode, width)} alt={countryCode} />);
}

export default Flag;
