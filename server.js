// server.js —— Node.js 服务器入口
// 作用：① 本地运行 node server.js 时启动 Web 服务器；
//       ② 部署到 Vercel 时，导出 handler 作为 Serverless 函数入口。
// 同时显示页面内容和当前服务器时间。

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

/**
 * 根据文件扩展名返回对应的 MIME 类型
 */
function getContentType(filePath) {
  const ext = path.extname(filePath);
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css':  return 'text/css; charset=utf-8';
    case '.js':   return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png':  return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    default:      return 'application/octet-stream';
  }
}

/**
 * 核心请求处理函数（req, res），
 * 本地服务器和 Vercel Serverless 都会调用它。
 */
function handler(req, res) {
  const urlPath = (req.url || '/').split('?')[0];

  // ===== API：返回当前服务器时间 =====
  if (urlPath === '/api/time') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    const now = new Date();
    res.end(JSON.stringify({
      serverTime: now.toString(),
      time: now.toLocaleString('zh-CN', { hour12: false })
    }));
    return;
  }

  // ===== 静态文件 =====
  let filePath;
  if (urlPath === '/') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  } else {
    // 防止路径穿越：去掉 .. 等不安全片段
    const safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    filePath = path.join(PUBLIC_DIR, safePath);
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found：页面不存在');
      return;
    }
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
}

// 本地直接运行（node server.js）时才真正启动监听端口
if (require.main === module) {
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`✅ HelloWorld 网站已启动！`);
    console.log(`   请在浏览器中访问：http://localhost:${PORT}`);
  });
}

// 导出处理函数，供 Vercel 的 api/index.js 使用
module.exports = handler;
