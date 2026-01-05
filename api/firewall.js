// 导入axios用于发送HTTP请求
import axios from 'axios';
// 导入中间件处理函数
import middleware from './_common/middleware.js';

/**
 * 返回包含WAF信息的对象
 * @param {string} waf - WAF名称
 * @returns {Object} 包含hasWaf标志和WAF名称的对象
 */
const hasWaf = (waf) => {
  return {
    hasWaf: true, waf,
  }
};

/**
 * 防火墙检测处理器
 * 通过分析HTTP响应头检测目标网站是否使用了WAF
 * @param {string} url - 要检测的URL
 * @returns {Object} 包含WAF检测结果的响应对象
 */
const firewallHandler = async (url) => {
  // 如果URL不以http开头，则添加http://前缀
  const fullUrl = url.startsWith('http') ? url : `http://${url}`;
  
  try {
    // 发送GET请求获取目标URL的响应
    const response = await axios.get(fullUrl);

    // 获取响应头
    const headers = response.headers;

    // 检测Cloudflare WAF
    if (headers['server'] && headers['server'].includes('cloudflare')) {
      return hasWaf('Cloudflare');
    }

    // 检测AWS WAF
    if (headers['x-powered-by'] && headers['x-powered-by'].includes('AWS Lambda')) {
      return hasWaf('AWS WAF');
    }

    // 检测Akamai WAF
    if (headers['server'] && headers['server'].includes('AkamaiGHost')) {
      return hasWaf('Akamai');
    }

    // 检测Sucuri WAF
    if (headers['server'] && headers['server'].includes('Sucuri')) {
      return hasWaf('Sucuri');
    }

    // 检测Barracuda WAF
    if (headers['server'] && headers['server'].includes('BarracudaWAF')) {
      return hasWaf('Barracuda WAF');
    }

    // 检测F5 BIG-IP WAF
    if (headers['server'] && (headers['server'].includes('F5 BIG-IP') || headers['server'].includes('BIG-IP'))) {
      return hasWaf('F5 BIG-IP');
    }

    // 检测Sucuri CloudProxy WAF
    if (headers['x-sucuri-id'] || headers['x-sucuri-cache']) {
      return hasWaf('Sucuri CloudProxy WAF');
    }

    // 检测Fortinet FortiWeb WAF
    if (headers['server'] && headers['server'].includes('FortiWeb')) {
      return hasWaf('Fortinet FortiWeb WAF');
    }

    // 检测Imperva SecureSphere WAF
    if (headers['server'] && headers['server'].includes('Imperva')) {
      return hasWaf('Imperva SecureSphere WAF');
    }

    // 检测Sqreen WAF
    if (headers['x-protected-by'] && headers['x-protected-by'].includes('Sqreen')) {
      return hasWaf('Sqreen');
    }

    // 检测Reblaze WAF
    if (headers['x-waf-event-info']) {
      return hasWaf('Reblaze WAF');
    }

    // 检测Citrix NetScaler WAF
    if (headers['set-cookie'] && headers['set-cookie'].includes('_citrix_ns_id')) {
      return hasWaf('Citrix NetScaler');
    }

    // 检测WangZhanBao WAF
    if (headers['x-denied-reason'] || headers['x-wzws-requested-method']) {
      return hasWaf('WangZhanBao WAF');
    }

    // 检测Webcoment Firewall
    if (headers['x-webcoment']) {
      return hasWaf('Webcoment Firewall');
    }

    // 检测Yundun WAF (通过server头)
    if (headers['server'] && headers['server'].includes('Yundun')) {
      return hasWaf('Yundun WAF');
    }

    // 检测Yundun WAF (通过自定义头)
    if (headers['x-yd-waf-info'] || headers['x-yd-info']) {
      return hasWaf('Yundun WAF');
    }

    // 检测Safe3 Web Application Firewall
    if (headers['server'] && headers['server'].includes('Safe3WAF')) {
      return hasWaf('Safe3 Web Application Firewall');
    }

    // 检测NAXSI WAF
    if (headers['server'] && headers['server'].includes('NAXSI')) {
      return hasWaf('NAXSI WAF');
    }

    // 检测IBM WebSphere DataPower
    if (headers['x-datapower-transactionid']) {
      return hasWaf('IBM WebSphere DataPower');
    }

    // 检测QRATOR WAF
    if (headers['server'] && headers['server'].includes('QRATOR')) {
      return hasWaf('QRATOR WAF');
    }

    // 检测DDoS-Guard WAF
    if (headers['server'] && headers['server'].includes('ddos-guard')) {
      return hasWaf('DDoS-Guard WAF');
    }

    // 未检测到WAF
    return {
      hasWaf: false,
    }
  } catch (error) {
    // 错误处理
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// 导出经过中间件包装的处理器
export const handler = middleware(firewallHandler);
export default handler;
