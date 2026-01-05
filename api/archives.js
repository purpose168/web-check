// 引入 axios 库，用于发送 HTTP 请求
import axios from 'axios';
// 引入中间件函数，用于跨平台适配和请求处理
import middleware from './_common/middleware.js';

// 将 Wayback Machine 的时间戳转换为 JavaScript Date 对象
// Wayback Machine 使用 14 位数字的时间戳格式：YYYYMMDDHHMMSS
// 例如：20230115120000 表示 2023 年 1 月 15 日 12:00:00
const convertTimestampToDate = (timestamp) => {
  // 从时间戳中提取各个时间部分
  const [year, month, day, hour, minute, second] = [
    timestamp.slice(0, 4),      // 提取年份（前 4 位）
    timestamp.slice(4, 6) - 1,  // 提取月份（第 5-6 位），减 1 是因为 JavaScript 的月份从 0 开始（0-11）
    timestamp.slice(6, 8),      // 提取日期（第 7-8 位）
    timestamp.slice(8, 10),     // 提取小时（第 9-10 位）
    timestamp.slice(10, 12),    // 提取分钟（第 11-12 位）
    timestamp.slice(12, 14),    // 提取秒（第 13-14 位）
  ].map(num => parseInt(num, 10)); // 将所有字符串转换为数字

  // 创建并返回 Date 对象
  return new Date(year, month, day, hour, minute, second);
}

// 计算页面变更次数
// 通过比较每次扫描的摘要（digest）来判断页面是否发生了变化
// digest 是页面内容的哈希值，如果相同则表示页面内容未变
const countPageChanges = (results) => {
  let prevDigest = null; // 存储上一次扫描的摘要
  // 使用 reduce 遍历所有扫描结果
  return results.reduce((acc, curr) => {
    // curr[2] 是当前扫描的摘要
    // 如果当前摘要与上一次不同，说明页面发生了变化
    if (curr[2] !== prevDigest) {
      prevDigest = curr[2]; // 更新上一次的摘要
      return acc + 1; // 变更计数加 1
    }
    return acc; // 页面未变化，返回当前计数
  }, -1); // 初始值为 -1，因为第一次扫描不算变更
}

// 计算平均页面大小
// scans 是扫描结果数组，每个元素的索引 3 是页面大小（字节）
const getAveragePageSize = (scans) => {
    // 将所有扫描的页面大小相加
    const totalSize = scans.map(scan => parseInt(scan[3], 10)).reduce((sum, size) => sum + size, 0);
    // 计算平均值并四舍五入为整数
    return Math.round(totalSize / scans.length);
};

// 计算扫描频率指标
// 参数：
//   firstScan: 第一次扫描的 Date 对象
//   lastScan: 最后一次扫描的 Date 对象
//   totalScans: 总扫描次数
//   changeCount: 页面变更次数
const getScanFrequency = (firstScan, lastScan, totalScans, changeCount) => {
  // 将数字格式化为保留两位小数
  const formatToTwoDecimal = num => parseFloat(num.toFixed(2));

  // 计算第一次和最后一次扫描之间的天数
  // (lastScan - firstScan) 得到毫秒差，除以 (1000 * 60 * 60 * 24) 转换为天数
  const dayFactor = (lastScan - firstScan) / (1000 * 60 * 60 * 24);  
  // 平均每次扫描间隔的天数
  const daysBetweenScans = formatToTwoDecimal(dayFactor / totalScans);
  // 平均每次变更间隔的天数
  const daysBetweenChanges = formatToTwoDecimal(dayFactor / changeCount);
  // 每天平均扫描次数（减 1 是因为扫描次数比间隔数多 1）
  const scansPerDay = formatToTwoDecimal((totalScans - 1) / dayFactor);
  // 每天平均变更次数
  const changesPerDay = formatToTwoDecimal(changeCount / dayFactor);
  
  // 返回所有频率指标
  return {
    daysBetweenScans,      // 扫描间隔天数
    daysBetweenChanges,    // 变更间隔天数
    scansPerDay,           // 每天扫描次数
    changesPerDay,         // 每天变更次数
  };
};

// Wayback Machine 处理函数
// 查询 Wayback Machine 的 CDX API 获取网站的存档历史
const wayBackHandler = async (url) => {
  // 构建 CDX API 请求 URL
  // url: 要查询的网站地址
  // output=json: 返回 JSON 格式
  // fl=timestamp,statuscode,digest,length,offset: 指定返回的字段
  //   timestamp: 时间戳
  //   statuscode: HTTP 状态码
  //   digest: 页面内容摘要（哈希值）
  //   length: 页面大小（字节）
  //   offset: 偏移量
  const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${url}&output=json&fl=timestamp,statuscode,digest,length,offset`;

  try {
    // 发送 GET 请求获取数据
    const { data } = await axios.get(cdxUrl);
    
    // 检查是否有数据
    // data 是一个数组，第一行是字段名，后续行是数据
    if (!data || !Array.isArray(data) || data.length <= 1) {
      return { skipped: 'Site has never before been archived via the Wayback Machine' };
    }

    // 移除表头行（第一行）
    data.shift();

    // 处理并返回结果
    // 第一次扫描的时间
    const firstScan = convertTimestampToDate(data[0][0]);
    // 最后一次扫描的时间
    const lastScan = convertTimestampToDate(data[data.length - 1][0]);
    // 总扫描次数
    const totalScans = data.length;
    // 页面变更次数
    const changeCount = countPageChanges(data);
    
    // 返回完整的分析结果
    return {
      firstScan,                          // 第一次扫描时间
      lastScan,                           // 最后一次扫描时间
      totalScans,                         // 总扫描次数
      changeCount,                        // 页面变更次数
      averagePageSize: getAveragePageSize(data),  // 平均页面大小
      scanFrequency: getScanFrequency(firstScan, lastScan, totalScans, changeCount),  // 扫描频率指标
      scans: data,                        // 所有扫描记录的原始数据
      scanUrl: url,                       // 查询的 URL
    };
  } catch (err) {
    // 错误处理：返回错误信息
    return { error: `Error fetching Wayback data: ${err.message}` };
  }
};

// 使用中间件包装处理函数，实现跨平台适配
// 中间件会处理超时、错误、URL 规范化等通用逻辑
export const handler = middleware(wayBackHandler);
// 默认导出处理函数
export default handler;
