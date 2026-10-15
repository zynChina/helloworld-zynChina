// api/index.js —— Vercel Serverless 函数入口
// 部署到 Vercel 后，/api/time 请求会被 vercel.json 转发到这里。
// 直接复用 server.js 里的处理函数。
module.exports = require('../server');
