import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
import {mingQingExhibits} from '../src/exhibits-ming-qing.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5173',browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],checks=[];
try{for(const s of mingQingExhibits){
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`${base}/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.mouse.move(10,10);await p.waitForTimeout(1400);
 assert.equal(await p.getByRole('tooltip').count(),0);assert.equal(await p.locator('canvas').evaluate(canvas=>!!canvas.getContext('webgl2')),true);
 const r=await p.locator('canvas').boundingBox(),cam=new T.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,80);cam.position.set(8,9.65,12);cam.lookAt(0,.65,0);cam.zoom=Math.min(62,r.width/18.5,r.height/14.5);cam.updateProjectionMatrix();cam.updateMatrixWorld();const v=new T.Vector3(...(s.objects[0].position)).project(cam);
 const expected=p.getByRole('tooltip',{name:s.objects[0].name,exact:true});let found=false;
 for(const [dx,dy] of [[0,0],[-12,0],[12,0],[0,-18],[0,18],[-25,-20],[25,20]]){await p.mouse.move(r.x+(v.x+1)*r.width/2+dx,r.y+(1-v.y)*r.height/2+dy);await p.waitForTimeout(180);if(await expected.count()){found=true;break;}}
 assert.ok(found,`${s.id} first object must be discoverable by pointer`);await p.mouse.down();await p.mouse.up();await p.getByRole('heading',{name:s.objects[0].name,exact:true}).waitFor();await p.mouse.move(10,10);
 for(const [i,step] of s.steps.entries()){
  if(i===0){await p.getByRole('button',{name:step.label,exact:true}).click();await p.waitForTimeout(300);await p.getByRole('button',{name:'取消操作',exact:true}).click();assert.equal(await p.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length,s.id),0);}
  await p.getByRole('button',{name:step.label,exact:true}).click();await p.waitForTimeout(step.duration*520);await p.screenshot({path:`artifacts/ming-qing-${s.kind}-${step.id}-motion.png`});
  await p.waitForFunction(({id,n})=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length===n,{id:s.id,n:i+1});
 }
 await p.getByRole('button',{name:'关闭探索回顾',exact:true}).click();
 for(const o of s.objects){await p.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await p.getByRole('heading',{name:o.name,exact:true}).waitFor();await p.waitForTimeout(1100);await p.screenshot({path:`artifacts/ming-qing-${s.kind}-${o.id}-detail.png`});const res=await p.request.post(`${base}/api/chat`,{data:{sceneId:s.id,objectId:o.id,zoneId:null,actions:s.steps.map(x=>x.id),question:'这是什么？',history:[]}});assert.equal(res.status(),200);assert.deepEqual((await res.json()).sourceIds,o.sourceIds);}
 await p.reload({waitUntil:'networkidle'});assert.equal(await p.getByRole('button',{name:'开始探索',exact:true}).count(),0);assert.equal(await p.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length,s.id),3);
 await p.getByRole('button',{name:'收起手册',exact:true}).click();await p.waitForTimeout(1400);await p.screenshot({path:`artifacts/ming-qing-${s.kind}-overview.png`});await p.locator('canvas').screenshot({path:`public/images/${s.id}.png`});
 await p.setViewportSize({width:390,height:844});await p.locator('.object-switcher button').first().click();await p.waitForTimeout(1000);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:`artifacts/ming-qing-${s.kind}-mobile.png`});
 await p.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await p.locator('canvas').count(),0);checks.push({id:s.id,objects:5,steps:3,restored:true});console.log('Verified',s.id);await p.close();
 }assert.deepEqual(errors,[]);await writeFile('artifacts/ming-qing-results.json',JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}
