import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { answerChat, ChatError, parseInput } from './chat';
import {resolveAIConfig,publicAIStatus} from './config';
// Small local .env loader: never expose environment values to the browser.
if(existsSync('.env'))for(const line of readFileSync('.env','utf8').split(/\r?\n/)){
  const match=line.match(/^([A-Z_]+)\s*=\s*(.*)$/);if(match&&!process.env[match[1]])process.env[match[1]]=match[2].replace(/^['"]|['"]$/g,'');
}
const config=resolveAIConfig(process.env);
const production=process.argv.includes('--production');
const vite=production?null:await (await import('vite')).createServer({server:{middlewareMode:true},appType:'spa'});
const json=(res:ServerResponse,status:number,value:unknown)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
async function body(req:IncomingMessage){let size=0;const chunks:Buffer[]=[];for await(const chunk of req){size+=chunk.length;if(size>20000)throw new ChatError(413,'请求内容过长。');chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new ChatError(400,'请求不是有效JSON。');}}
const server=createServer(async(req,res)=>{
  try{
    const pathname=new URL(req.url||'/','http://localhost').pathname;
    if(pathname==='/api/status'&&req.method==='GET')return json(res,200,publicAIStatus(config));
    if(pathname==='/api/chat'){
      if(req.method!=='POST')return json(res,405,{error:'请使用POST请求。'});
      const origin=req.headers.origin;
      if(origin&&new URL(origin).host!==req.headers.host)return json(res,403,{error:'请求来源不匹配。'});
      const result=await answerChat(parseInput(await body(req)),config);return json(res,200,result);
    }
    if(pathname.startsWith('/api/'))return json(res,404,{error:'接口不存在。'});
    if(vite)return vite.middlewares(req,res);
    if(!['GET','HEAD'].includes(req.method||''))return json(res,405,{error:'请求方法不支持。'});
    const root=resolve('dist');const file=resolve(root,'.'+decodeURIComponent(pathname));
    if(file!==root&&!file.startsWith(root+sep))return json(res,403,{error:'路径不可访问。'});
    const target=pathname==='/'?resolve(root,'index.html'):file;
    let content:Buffer;
    try{content=await readFile(target);}catch{return json(res,404,{error:'文件不存在。'});}
    const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.json':'application/json'};
    res.writeHead(200,{'Content-Type':mime[extname(target)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:content);
  }catch(error){if(!res.headersSent)json(res,error instanceof ChatError?error.status:500,{error:error instanceof ChatError?error.message:'服务暂时出现问题，请稍后重试。'});}
});
const port=Number(process.env.PORT||5173);
server.listen(port,'127.0.0.1',()=>console.log(`Culture Slice ready: http://127.0.0.1:${port} (${production?'production':'development'})`));
server.on('error',error=>{console.error(error.message);process.exitCode=1;void vite?.close();});
