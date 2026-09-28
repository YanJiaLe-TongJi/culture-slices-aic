import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import {exhibits} from '../src/exhibits.ts';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const samples=[];
try{
 for(const s of exhibits.filter(s=>!process.env.SCENE_ID||s.id===process.env.SCENE_ID)){
  await page.goto(`${process.env.BASE_URL||'http://127.0.0.1:5173'}/#/scene/${s.id}`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'开始探索',exact:true}).click();await page.waitForTimeout(1300);
  await page.evaluate(()=>{window.__sample=new Promise(resolve=>{const start=performance.now(),ms=[];let last=start;function tick(now){ms.push(now-last);last=now;if(now-start<4000)requestAnimationFrame(tick);else{ms.sort((a,b)=>a-b);resolve({averageFps:Math.round(ms.length*1000/(now-start)),p95FrameMs:Math.round(ms[Math.floor(ms.length*.95)]*10)/10,over33ms:ms.filter(n=>n>1000/30).length,frames:ms.length});}}requestAnimationFrame(tick);});});
  await page.getByRole('button',{name:s.steps[0].label,exact:true}).click();
  samples.push({scene:s.id,action:s.steps[0].id,...await page.evaluate(()=>window.__sample)});
 }
 const result={date:new Date().toISOString(),browser:browser.version(),headless:true,viewport:'1440x1000',deviceScaleFactor:1,renderer:await page.locator('canvas').evaluate(c=>{const g=c.getContext('webgl2'),e=g?.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'unavailable';}),method:'Four-second rAF samples spanning the first animated action and camera focus in each scene; hardware default; not GPU frame timing or a universal device guarantee',samples};
 await mkdir('artifacts',{recursive:true});await writeFile(process.env.SCENE_ID?`artifacts/${process.env.SCENE_ID}-performance-hardware.json`:'artifacts/v04-performance-hardware.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
