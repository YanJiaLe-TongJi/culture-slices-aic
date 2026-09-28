import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const hardware=process.argv.includes('--hardware');
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true,args:hardware?['--enable-webgl']:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
await mkdir('artifacts',{recursive:true});
async function sample(action=async()=>{},duration=4000){
 await page.evaluate(duration=>{window.__performanceSample=new Promise(resolve=>{let last=performance.now(),start=last;const ms=[];function tick(now){ms.push(now-last);last=now;if(now-start<duration)requestAnimationFrame(tick);else{ms.sort((a,b)=>a-b);resolve({durationMs:Math.round(now-start),averageFps:Math.round(ms.length*1000/(now-start)),p95FrameMs:Math.round(ms[Math.floor(ms.length*.95)]*10)/10,p99FrameMs:Math.round(ms[Math.floor(ms.length*.99)]*10)/10,over33ms:ms.filter(t=>t>1000/30).length,frames:ms.length});}}requestAnimationFrame(tick);});},duration);
 await action();return page.evaluate(()=>window.__performanceSample);
}
async function zone(name){await page.getByRole('button',{name:'返回全景',exact:true}).click();await page.locator('.zone-switcher').getByRole('button',{name:new RegExp(name)}).click();}
try{
 await page.goto('http://127.0.0.1:5173/#/scene/peiligang-grain',{waitUntil:'networkidle'});await page.getByRole('button',{name:'开始探索',exact:true}).click();await page.waitForTimeout(2500);
 const overview=await sample();
 const placement=await sample(async()=>{await zone('屋前磨粮');await page.getByRole('button',{name:'将谷物放上磨盘',exact:true}).click();await page.getByRole('button',{name:'动手加工',exact:true}).waitFor();});
 const grinding=await sample(async()=>{await page.getByRole('button',{name:'▷ 观看演示',exact:true}).click();});
 await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'关闭探索回顾',exact:true}).click();
 const cooking=await sample(async()=>{await zone('灶边炊煮');await page.getByRole('button',{name:'点亮薪火，观察三足',exact:true}).click();});
 const pottery=await sample(async()=>{await zone('制陶角');await page.getByRole('button',{name:'观看泥条成形',exact:true}).click();});
 const dwelling=await sample(async()=>{await zone('屋内器用');await page.locator('.object-switcher').getByRole('button',{name:/红陶双耳壶/}).click();});
 const result={date:new Date().toISOString(),browser:browser.version(),headless:true,renderer:await page.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2');const ext=gl?.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable';}),requestedMode:hardware?'hardware-default':'forced-software',viewport:'1440x1000',deviceScaleFactor:1,method:'requestAnimationFrame intervals during six 4-second interaction samples, adaptive resolution enabled; not a universal device guarantee',overview,placement,grinding,cooking,pottery,dwelling};
 console.log(JSON.stringify(result,null,2));await writeFile(`artifacts/v03-performance-${hardware?'hardware':'software'}.json`,JSON.stringify(result,null,2));
}finally{await browser.close();}
