import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const base='http://127.0.0.1:5174',server=spawn(process.execPath,['--import','tsx','server/index.ts','--production'],{env:{...process.env,PORT:'5174'},stdio:['ignore','pipe','pipe'],windowsHide:true}),ended=once(server,'exit');let browser;
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Startup timeout')),10000);server.once('error',reject);server.once('exit',()=>{clearTimeout(timer);reject(Error('Server exited'));});server.stdout.on('data',b=>{if(String(b).includes('Culture Slice ready')){clearTimeout(timer);resolve();}});});
 browser=await chromium.launch({channel:'msedge',headless:true});const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const era of ['prehistory','pre-qin','qin-han','wei-jin','sui-tang','song-yuan','ming-qing','modern','new-era']){await p.goto(`${base}/#/era/${era}`,{waitUntil:'networkidle'});const photos=p.locator('.slice-grid img');assert.equal(await photos.count(),3);for(const img of await photos.all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}assert.equal(await photos.evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true);assert.equal(await p.locator('canvas').count(),0);}
 await p.goto(`${base}/#/scene/new-era-making`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.locator('.object-switcher').getByRole('button',{name:/实验机柜/}).click();await p.getByRole('heading',{name:'实验机柜',exact:true}).waitFor();assert.equal(await p.locator('canvas').count(),1);await p.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await p.locator('canvas').count(),0);
 await p.goto(`${base}/#/scene/song-yuan-making`,{waitUntil:'networkidle'});assert.equal(await p.locator('.world').getAttribute('data-river-edition'),'expanded');assert.deepEqual(errors,[]);
 const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const name=dir+'/'+e.name;if(e.isDirectory())await walk(name);else files.push({name,gzipBytes:gzipSync(await readFile(name)).length});}}await walk('dist');const totalGzipBytes=files.reduce((n,f)=>n+f.gzipBytes,0);assert.ok(totalGzipBytes<10*1024*1024);
 const result={checks:['nine era covers','timeline loads no Canvas','production 3D lazy chunk','new region card','scene cleanup','river defaults expanded','all compressed resources below 10 MiB'],totalGzipBytes,errors};await writeFile('artifacts/new-era/production.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{if(browser)await browser.close();if(server.exitCode===null)server.kill();await ended;}
