import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
import {exhibits} from '../src/exhibits.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright'),base=process.env.BASE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],checks=[];
try{for(const s of exhibits.filter(s=>s.eraId==='qin-han'&&(!process.env.SCENE_ID||s.id===process.env.SCENE_ID))){
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${base}/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.mouse.move(10,10);await p.waitForTimeout(1600);assert.equal(await p.getByRole('tooltip').count(),0);
 const r=await p.locator('canvas').boundingBox(),cam=new T.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,80);cam.position.set(8,9.65,12);cam.lookAt(0,.65,0);cam.zoom=Math.min(62,r.width/18.5,r.height/14.5);cam.updateProjectionMatrix();cam.updateMatrixWorld();const v=new T.Vector3(...s.objects[0].position).project(cam);
 await p.mouse.move(r.x+(v.x+1)*r.width/2,r.y+(1-v.y)*r.height/2);await p.getByRole('tooltip',{name:s.objects[0].name,exact:true}).waitFor();await p.mouse.click(r.x+(v.x+1)*r.width/2,r.y+(1-v.y)*r.height/2);await p.getByRole('heading',{name:s.objects[0].name,exact:true}).waitFor();await p.mouse.move(10,10);
 for(const [i,step] of s.steps.entries()){
  if(s.kind==='slips'&&i===1){await p.getByRole('button',{name:'45',exact:true}).click();assert.equal(await p.getByRole('button',{name:step.label,exact:true}).isEnabled(),false);await p.getByRole('button',{name:'54',exact:true}).click();}
  if(i===0){await p.getByRole('button',{name:step.label,exact:true}).click();await p.waitForTimeout(250);await p.getByRole('button',{name:'取消操作',exact:true}).click();assert.equal(await p.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length,s.id),0);}
  await p.getByRole('button',{name:step.label,exact:true}).click();await p.waitForTimeout(step.duration*470);await p.screenshot({path:`artifacts/qinhan-${s.kind}-${step.id}-motion.png`});
  await p.waitForFunction(({id,n})=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length===n,{id:s.id,n:i+1});
 }
 await p.getByRole('button',{name:'关闭探索回顾',exact:true}).click();
 for(const o of s.objects){await p.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await p.getByRole('heading',{name:o.name,exact:true}).waitFor();await p.waitForTimeout(1200);await p.screenshot({path:`artifacts/qinhan-${s.kind}-${o.id}-detail.png`});const response=await p.request.post(`${base}/api/chat`,{data:{sceneId:s.id,objectId:o.id,zoneId:null,actions:[],question:'这是什么？',history:[]}});assert.equal(response.status(),200);assert.deepEqual((await response.json()).sourceIds,o.sourceIds);}
 await p.getByRole('button',{name:'返回全景',exact:true}).click();await p.getByRole('button',{name:'收起手册',exact:true}).click();await p.mouse.move(10,10);await p.waitForTimeout(1300);await p.screenshot({path:`artifacts/qinhan-${s.kind}-overview.png`});if(process.env.CAPTURE_COVERS==='1')await p.locator('canvas').screenshot({path:`public/images/${s.id}.png`});
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(1000);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`artifacts/qinhan-${s.kind}-mobile.png`});await p.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await p.locator('canvas').count(),0);
 checks.push({id:s.id,objects:s.objects.length,actions:s.steps.length});console.log('Verified',s.id);await p.close();
}assert.deepEqual(errors,[]);await writeFile('artifacts/qinhan-refinement-results.json',JSON.stringify({checks,errors},null,2));}finally{await browser.close();}
