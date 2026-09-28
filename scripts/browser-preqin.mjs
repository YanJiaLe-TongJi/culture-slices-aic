import {positionEarlyCamera} from './early-camera.mjs';
import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {exhibits} from '../src/exhibits.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright'),base=process.env.BASE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],checks=[];
try{for(const s of exhibits.filter(s=>s.id.startsWith('pre-qin-')&&(!process.env.SCENE_ID||s.id===process.env.SCENE_ID))){
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__audio=[];window.__notes=[];const A=window.AudioContext;window.AudioContext=class extends A{constructor(...a){super(...a);window.__audio.push(this)}createOscillator(){const o=super.createOscillator(),start=o.start.bind(o);o.start=(...a)=>{window.__notes.push(o.frequency.value);start(...a)};return o}}});
 const state=()=>page.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)),s.id);
 await page.goto(`${base}/#/scene/${s.id}`,{waitUntil:'networkidle'});await page.getByRole('button',{name:'开始探索',exact:true}).click();await page.mouse.move(10,10);await page.waitForTimeout(1500);assert.equal(await page.getByRole('tooltip').count(),0);
 const r=await page.locator('canvas').boundingBox(),cam=new THREE.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,80);positionEarlyCamera(cam,r,s.kind);const point=new THREE.Vector3(...(s.kind==='casting'?[1.12,.95,1]:s.objects[0].position)).project(cam);
 await page.mouse.move(r.x+(point.x+1)*r.width/2,r.y+(1-point.y)*r.height/2);await page.getByRole('tooltip',{name:s.objects[0].name,exact:true}).waitFor();await page.mouse.click(r.x+(point.x+1)*r.width/2,r.y+(1-point.y)*r.height/2);await page.getByRole('heading',{name:s.objects[0].name,exact:true}).waitFor();await page.mouse.move(10,10);
 for(const [i,step] of s.steps.entries()){
  if(i===1){await page.getByRole('button',{name:step.label,exact:true}).click();await page.waitForTimeout(350);await page.getByRole('button',{name:'取消操作',exact:true}).click();assert.equal((await state()).actions.length,i);assert.equal(await page.evaluate(()=>window.__audio.every(a=>a.state==='closed')),true);}
  await page.getByRole('button',{name:step.label,exact:true}).click();await page.waitForTimeout(step.duration*450);await page.screenshot({path:`artifacts/preqin-${s.kind}-${step.id}-motion.png`});await page.waitForFunction(({id,n})=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length===n,{id:s.id,n:i+1});
 }
 await page.getByRole('button',{name:'关闭探索回顾',exact:true}).click();
 for(const o of s.objects){await page.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await page.getByRole('heading',{name:o.name,exact:true}).waitFor();await page.waitForTimeout(1250);await page.screenshot({path:`artifacts/preqin-${s.kind}-${o.id}-detail.png`});}
 if(s.kind==='bells'){const notes=await page.evaluate(()=>window.__notes);assert.ok(new Set(notes).size>=2);await page.getByRole('button',{name:'关闭声音',exact:true}).click();const n=notes.length;await page.getByRole('button',{name:'重放这一轮操作',exact:true}).click();await page.getByRole('button',{name:s.steps[0].label,exact:true}).click();await page.waitForTimeout(1700);assert.equal(await page.evaluate(()=>window.__notes.length),n);}
 await page.getByRole('button',{name:'返回全景',exact:true}).click();await page.getByRole('button',{name:'收起手册',exact:true}).click();await page.waitForTimeout(1300);await page.screenshot({path:`artifacts/preqin-${s.kind}-refined.png`});if(process.env.CAPTURE_COVERS==='1')await page.locator('canvas').screenshot({path:`public/images/${s.id}.png`});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(1100);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:`artifacts/preqin-${s.kind}-mobile.png`});await page.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await page.locator('canvas').count(),0);assert.equal(await page.evaluate(()=>window.__audio.every(a=>a.state==='closed')),true);
 checks.push({scene:s.id,objects:s.objects.length,actions:s.steps.length});console.log('Verified',s.id);await page.close();
}assert.deepEqual(errors,[]);await writeFile(process.env.SCENE_ID?`artifacts/${process.env.SCENE_ID}-refinement-results.json`:'artifacts/preqin-refinement-results.json',JSON.stringify({checks,errors},null,2));}finally{await browser.close();}
