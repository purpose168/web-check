
// 配置对象，用于存储API密钥和功能开关
const keys = {
  // Shodan API密钥，用于查询互联网设备和服务信息
  shodan: import.meta.env.REACT_APP_SHODAN_API_KEY || "default_value_if_not_set",
  // Whois API密钥，用于查询域名注册信息
  whoApi: import.meta.env.REACT_APP_WHO_API_KEY || "default_value_if_not_set",
  // 功能禁用开关，设置为true时禁用所有功能
  disableEverything: import.meta.env.VITE_DISABLE_EVERYTHING === 'true',
};
// // 备用配置方案，根据环境变量来源选择不同的配置方式
// const keys = process && process.env ? {
//   // Shodan API密钥（从process.env获取）
//   shodan: process.env.REACT_APP_SHODAN_API_KEY,
//   // Whois API密钥（从process.env获取）
//   whoApi: process.env.REACT_APP_WHO_API_KEY,
// } : {
//   // Shodan API密钥（从import.meta.env获取）
//   shodan: import.meta.env.REACT_APP_SHODAN_API_KEY || "default_value_if_not_set",
//   // Whois API密钥（从import.meta.env获取）
//   whoApi: import.meta.env.REACT_APP_WHO_API_KEY || "default_value_if_not_set",
// };

// 导出配置对象，供其他模块使用
export default keys;
