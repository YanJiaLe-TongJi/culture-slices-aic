import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const base='http://127.0.0.1:5174',env={...process.env,PORT:'5174',BASE_URL:base};
const server=spawn(process.execPath,['--import','tsx','server/index.ts','--production'],{env,stdio:['ignore','pipe','pipe'],windowsHide:true});
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Production server startup timed out')),10000);server.once('error',reject);server.once('exit',code=>{clearTimeout(timer);reject(new Error(`Server exited ${code}`));});server.stdout.on('data',buffer=>{if(String(buffer).includes('Culture Slice ready')){clearTimeout(timer);resolve();}});});
 const root=await fetch(base);assert.equal(root.status,200);
 const cover=await fetch(base+'/images/peiligang-village.png');assert.equal(cover.status,200);assert.match(cover.headers.get('content-type'),/image\/png/);
 const invalid=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(invalid.status,400);
 for(const script of ['browser-v03.mjs','browser-eras.mjs']){const child=spawn(process.execPath,['--import','tsx',`scripts/${script}`,process.argv[2]||'playwright'],{env,stdio:'inherit',windowsHide:true});const [code]=await once(child,'exit');assert.equal(code,0,script);}
 const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+e.name;if(e.isDirectory())await walk(path);else{const data=await readFile(path);files.push({path,bytes:data.length,gzipBytes:gzipSync(data).length});}}}await walk('dist');
 const result={checks:['production HTML','PNG content type','invalid API input','timeline and original village regression','all registered exhibits complete on production build'],files,totalGzipBytes:files.reduce((n,f)=>n+f.gzipBytes,0)};
 await mkdir('artifacts',{recursive:true});await writeFile('artifacts/v04-production-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{server.kill();await once(server,'exit').catch(()=>{});}
