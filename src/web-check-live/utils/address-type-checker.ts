/** 
 * 辅助函数，用于确定字符串是否是有效的Web地址，
 * 以及它是什么类型的地址：URL、IPv4、IPv6或其他。
 */

export type AddressType = 'ipV4' | 'ipV6' | 'url' | 'err' | 'empt';

/* 检查给定字符串是否看起来像URL */
const isUrl = (value: string):boolean => {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // 验证协议
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // 验证域名
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // 验证或IP（v4）地址
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // 验证端口和路径
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // 验证查询字符串
    '(\\#[-a-z\\d_]*)?$','i'); // 验证片段定位符
  return urlPattern.test(value);
};

// /* 检查给定字符串是否看起来像URL */
// const isUrl = (value: string):boolean => {
//   const urlRegex= new RegExp(''
//     // + /(?:(?:(https?|ftp):)?\/\/)/.source
//     + /(?:([^:\n\r]+):([^@\n\r]+)@)?/.source
//     + /(?:(?:www\.)?([^/\n\r]+))/.source
//     + /(\/[^?\n\r]+)?/.source
//     + /(\?[^#\n\r]*)?/.source
//     + /(#?[^\n\r]*)?/.source
//   );
//   return urlRegex.test(value);
// };

/* 检查给定字符串是否看起来像IP版本4地址 */
const isIpV4 = (value: string): boolean => {
  const ipPart = '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  const ipV4Regex = new RegExp(`^${ipPart}.${ipPart}.${ipPart}.${ipPart}$`);
  return ipV4Regex.test(value);
};

/* 检查给定字符串是否看起来像IP版本6地址 */
const isIPv6 = (value: string): boolean => {
  const components = value.split(':');
  
  if ((components.length < 2 || components.length > 8) ||
    ((components[0] !== '' || components[1] !== '')
      && !components[0].match(/^[\da-f]{1,4}/i))
  ) return false;

  let numberOfZeroCompressions = 0;
  for (let i = 1; i < components.length; ++i) {
    if (components[i] === '') {
      ++numberOfZeroCompressions;
      if (numberOfZeroCompressions > 1) return false;
      continue;
    }
    if (!components[i].match(/^[\da-f]{1,4}/i)) return false;
  }
  return true;
};

/* 检查给定字符串是否为短字符串 */
const isShort = (value: string): boolean => {
  return (!value || value.length <=3);
};

/* 返回给定地址的地址类型 */
export const determineAddressType = (address: string | undefined): AddressType => {
  if (!address) return 'err';
  if (isShort(address)) return 'empt';
  if (isUrl(address)) return 'url';
  if (isIpV4(address)) return 'ipV4';
  if (isIPv6(address)) return 'ipV6';
  return 'err';
};
