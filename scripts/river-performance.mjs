import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true}),samples=[];
try{
 for(const edition of ['expanded','detailed']){
  const p=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await p.goto(`http://127.0.0.1:5173/?river=${edition}#/scene/song-yuan-making`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.waitForTimeout(1500);
  await p.evaluate(()=>{window.__sample=new Promise(resolve=>{const start=performance.now(),times=[];let last=start;const tick=now=>{times.push(now-last);last=now;if(now-start<4000)requestAnimationFrame(tick);else{times.sort((a,b)=>a-b);resolve({averageFps:Math.round(times.length*1000/(now-start)),p95FrameMs:times[Math.floor(times.length*.95)],over33ms:times.filter(t=>t>1000/30).length});}};requestAnimationFrame(tick);});});
  await p.getByRole('button',{name:'移开桥面，看交错木拱',exact:true}).click();
  const result=await p.evaluate(()=>window.__sample);
  const renderer=await p.locator('canvas').evaluate(c=>{const g=c.getContext('webgl2'),e=g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'unavailable';});
  samples.push({edition,renderer,...result});await p.close();
 }
 const result={browser:browser.version(),viewport:'1440x1000',dpr:1,headless:true,method:'Four-second rAF sample during structure animation; not GPU render time or other-device guarantee',samples};await writeFile('artifacts/river-performance.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await browser.close();}
