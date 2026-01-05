import https from 'https';
import middleware from './_common/middleware.js';

const featuresHandler = async (url) => {
  const apiKey = process.env.BUILT_WITH_API_KEY;

  if (!url) {
    throw new Error('需要URL查询参数');
  }

  if (!apiKey) {
    throw new Error('环境变量中缺少BuiltWith API密钥');
  }

  const apiUrl = `https://api.builtwith.com/free1/api.json?KEY=${apiKey}&LOOKUP=${encodeURIComponent(url)}`;

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.get(apiUrl, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve(data);
          } else {
            reject(new Error(`请求失败，状态码：${res.statusCode}`));
          }
        });
      });

      req.on('error', error => {
        reject(error);
      });

      req.end();
    });

    return response;
  } catch (error) {
    throw new Error(`请求错误：${error.message}`);
  }
};

export const handler = middleware(featuresHandler);
export default handler;
