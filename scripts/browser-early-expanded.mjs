import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
import {exhibits} from '../src/exhibits.ts';
import {earlyLayouts} from '../src/early-layouts.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[],checks=[],base='http://127.0.0.1:5173';await mkdir('artifacts/early-expanded',{recursive:true});
const roofPoints={pottery:[7.65,1,-5.9],flute:[1.35,1.45,-5.8],feast:[0,3.45,-10.95],casting:[-3.15,2.55,-5.15],bells:[-.45,6.8,-5.8],lamp:[-.35,4.65,-.6],loom:[0,3.97,-.5],slips:[-.45,3.33,.1]};
const roofIds={pottery:'firing',flute:'wetland',feast:'rear-court',casting:'mould-yard',bells:'high-terrace',lamp:'room',loom:'workshop',slips:'office'};
async function projected(page,point,layout){const r=await page.locator('canvas').boundingBox(),cam=new T.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,80);cam.position.set(layout.center[0]+8,layout.center[1]+9,layout.center[2]+12);cam.lookAt(...layout.center);cam.zoom=Math.min(62,r.width/(18.5*layout.scale),r.height/(14.5*layout.scale));cam.updateProjectionMatrix();cam.updateMatrixWorld();const p=new T.Vector3(...point).project(cam);return {x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2};}
async function sample(page){await page.evaluate(()=>{window.__sample=new Promise(resolve=>{const start=performance.now(),times=[];let last=start;function tick(now){times.push(now-last);last=now;if(now-start<3500)requestAnimationFrame(tick);else {times.sort((a,b)=>a-b);resolve({fps:Math.round(times.length*1000/(now-start)),p95Ms:Math.round(times[Math.floor(times.length*.95)]*10)/10});}}requestAnimationFrame(tick);});});}
try{for(const s of exhibits.filter(s=>['prehistory','pre-qin','qin-han'].includes(s.eraId)&&(!process.env.SCENE_ID||process.env.SCENE_ID===s.id))){
 const p=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});p.setDefaultTimeout(10000);p.on('pageerror',e=>errors.push(`${s.id}: ${e.message}`));
 await p.addInitScript(()=>{window.__audio=[];const A=window.AudioContext;window.AudioContext=class extends A{constructor(...a){super(...a);window.__audio.push(this);}}});
 const state=()=>p.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)),s.id);
 try{
 await p.goto(`${base}/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.mouse.move(10,10);await p.waitForTimeout(1400);assert.equal(await p.getByRole('tooltip').count(),0);
 // Real 3D pointer selection of the new building, not only the button fallback.
 const pt=await projected(p,roofPoints[s.kind],earlyLayouts[s.kind]),o=s.objects.find(o=>o.id===roofIds[s.kind]);await p.mouse.move(pt.x,pt.y);await p.getByRole('tooltip',{name:o.name,exact:true}).waitFor();await p.mouse.click(pt.x,pt.y);await p.getByRole('heading',{name:o.name,exact:true}).waitFor();await p.mouse.move(10,10);
 for(const o of s.objects.slice(-2)){const button=p.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)});await button.focus();await p.keyboard.press('Enter');await p.getByRole('heading',{name:o.name,exact:true}).waitFor();await p.getByRole('button',{name:'资料',exact:true}).click();for(const id of o.sourceIds){const source=s.sources.find(x=>x.id===id);assert.ok(await p.locator(`a[href="${source.url}"]`).count());}await p.getByRole('button',{name:'器物',exact:true}).click();}
 await p.getByRole('button',{name:s.steps[0].label,exact:true}).click();await p.waitForTimeout(180);await p.getByRole('button',{name:'取消操作',exact:true}).click();assert.equal((await state()).actions.length,0);
 await sample(p);
 let performance;
 for(const [i,step] of s.steps.entries()){
  if(s.kind==='slips'&&i===1){await p.getByRole('button',{name:'45',exact:true}).click();assert.equal(await p.getByRole('button',{name:step.label,exact:true}).isEnabled(),false);await p.getByRole('button',{name:'54',exact:true}).click();}
  await p.getByRole('button',{name:step.label,exact:true}).click();await p.waitForTimeout(Math.min(600,step.duration*450));assert.equal(await p.getByRole('tooltip').count(),0);
  await p.screenshot({path:`artifacts/early-expanded/${s.kind}-${step.id}-motion.png`});await p.waitForFunction(({id,n})=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length===n,{id:s.id,n:i+1});
  if(i===0)performance=await p.evaluate(()=>window.__sample);
 }
 await p.getByRole('button',{name:'关闭探索回顾',exact:true}).click();const saved=await state();await p.reload({waitUntil:'networkidle'});assert.deepEqual((await state()).actions,saved.actions);assert.ok(saved.viewed.includes(o.id));
 const renderer=await p.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable';});
 await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'reduce'});await p.locator('.object-switcher').getByRole('button',{name:new RegExp(s.objects.at(-1).name)}).click();await p.getByRole('heading',{name:s.objects.at(-1).name,exact:true}).waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`artifacts/early-expanded/${s.id}-390.png`,fullPage:true});
 await p.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await p.locator('canvas').count(),0);assert.equal(await p.evaluate(()=>window.__audio.every(a=>a.state==='closed')),true);
 checks.push({scene:s.id,objects:s.objects.length,completed:s.steps.length,renderer,...performance,pointerRegion:o.id,mobile:390});console.log('Verified',s.id,performance);
 }catch(e){await p.screenshot({path:`artifacts/early-expanded/${s.id}-failure.png`,fullPage:true});throw e;}finally{await p.close();}
 }
 // WebGL unavailable: new regions must still be readable and operable through buttons.
 if(!process.env.SCENE_ID){const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await p.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...a){return type==='webgl'||type==='webgl2'?null:get.call(this,type,...a);};});await p.goto(`${base}/#/scene/pre-qin-making`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.getByRole('heading',{name:'三维场景暂时无法显示',exact:true}).waitFor();await p.locator('.object-switcher').getByRole('button',{name:/制范与晾置棚/}).click();await p.getByRole('heading',{name:'制范与晾置棚',exact:true}).waitFor();await p.getByRole('button',{name:'资料',exact:true}).click();assert.ok(await p.locator('a[href*="news.pku.edu.cn"]').count());await p.close();}
 assert.deepEqual(errors,[]);await writeFile(process.env.SCENE_ID?`artifacts/early-expanded/check-${process.env.SCENE_ID}.json`:'artifacts/early-expanded/checks.json',JSON.stringify({browser:browser.version(),viewport:'1440x1000',dpr:1,headless:true,method:'3.5-second rAF interval during the first action; not GPU frame time',checks,errors},null,2));
}finally{await browser.close();}
