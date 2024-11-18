import http from 'http';
import url from 'url';
import crypto from 'crypto';
import { LOGGER } from "../../../index";

const port = 3987;

export class LilyShortLink {
  public static server: http.Server | null = null;
  public static readonly urlDatabase: { [key: string]: string } = {};

  public static createShortUrl(originalUrl: string): string {
    if (this.server === null) this.start(); // 如果服务器没有启动，则启动它
    const hash = crypto.createHash('sha256').update(originalUrl).digest('hex');
    return hash.slice(0, 6);
  }

  public static start(): void {
    if (this.server !== null) return;

    this.server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url || '', true);
      const pathname = parsedUrl.pathname;

      if (pathname === '/shorten' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const { url: originalUrl } = JSON.parse(body);
            if (!originalUrl) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: '缺少 URL 参数' }));
            }

            // 生成短链接
            const shortUrl = this.createShortUrl(originalUrl);
            this.urlDatabase[shortUrl] = originalUrl;  // 保存映射关系

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ shortUrl: `http://localhost:${port}/${shortUrl}` }));
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '服务器内部错误' }));
          }
        });
      } else if (pathname && pathname.length === 7) {
        const shortUrl = pathname.slice(1);
        const originalUrl = this.urlDatabase[shortUrl];

        if (originalUrl) {
          res.writeHead(302, { 'Location': originalUrl });
          res.end();
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '短链接不存在' }));
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '未找到请求的资源' }));
      }
    });

    try {
      this.server.listen(port, () => {
        LOGGER.info("Loading LilyWhite Search Server...");
      }).on('error',(err: NodeJS.ErrnoException) => {
      });
    } catch (ignored) {}
  }
}
