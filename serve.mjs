import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.webp':'image/webp', '.jpg':'image/jpeg', '.mp4':'video/mp4', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
http.createServer(async(req,res) => {
  try {
    const url = new URL(req.url,'http://localhost');
    const relative = decodeURIComponent(url.pathname) === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const file = path.resolve(root,relative);
    if(!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    const {size}=await fs.stat(file);
    const headers={'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
      const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
      const end=match[1]&&match[2]?Math.min(Number(match[2]),size-1):size-1;
      if(start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
      createReadStream(file,{start,end}).pipe(res);
    }else{res.writeHead(200,{...headers,'Content-Length':size});createReadStream(file).pipe(res);}
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',() => console.log('Local: http://127.0.0.1:4173'));
