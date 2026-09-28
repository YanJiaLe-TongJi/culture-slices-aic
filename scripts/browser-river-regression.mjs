import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[],results=[];
const base=process.env.BASE_URL||'http://127.0.0.1:5173';
const key='culture-slice:exhibit:song-yuan-making:v1';
const steps=['移开桥面，看交错木拱','收帆倒桅，留出净空','沿河前行，穿过桥孔'];
const actions=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)).actions,key);
try{
 for(const edition of ['detailed','expanded']){
  const p=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`${base}/?river=${edition}#/scene/song-yuan-making`,{waitUntil:'networkidle'});
  await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.getByRole('button',{name:'收起手册',exact:true}).click();await p.waitForTimeout(1200);
  const rect=await p.locator('canvas').boundingBox(),cam=new T.OrthographicCamera(-rect.width/2,rect.width/2,rect.height/2,-rect.height/2,.1,80);
  cam.position.set(8,9.65,12);cam.lookAt(0,.65,0);cam.zoom=Math.min(62,rect.width/(18.5*(edition==='expanded'?1.66:1)),rect.height/(14.5*(edition==='expanded'?1.66:1)));cam.updateProjectionMatrix();cam.updateMatrixWorld();
  const point=new T.Vector3(0,2.5,.35).project(cam);
  await p.mouse.move(rect.x+(point.x+1)*rect.width/2,rect.y+(1-point.y)*rect.height/2);await p.getByRole('tooltip',{name:'贯木拱与桥面',exact:true}).waitFor();await p.mouse.click(rect.x+(point.x+1)*rect.width/2,rect.y+(1-point.y)*rect.height/2);await p.getByRole('heading',{name:'贯木拱与桥面',exact:true}).waitFor();await p.mouse.move(8,8);
  await p.getByRole('button',{name:steps[0],exact:true}).click();await p.waitForTimeout(450);
  await p.getByRole('button',{name:edition==='expanded'?'B · 精细版':'A · 扩大版',exact:true}).click();
  assert.deepEqual(await actions(p),[]);assert.equal(await p.getByRole('button',{name:'取消操作',exact:true}).count(),0);
  await p.getByRole('button',{name:edition==='expanded'?'A · 扩大版':'B · 精细版',exact:true}).click();
  for(const [i,label] of steps.entries()){
   await p.getByRole('button',{name:label,exact:true}).click();await p.waitForTimeout(i===0?2000:1400);
   await p.screenshot({path:`artifacts/river-${edition}-motion-${i}.png`});
   await p.getByRole('button',{name:'跳过动画',exact:true}).click();
  }
  await p.getByRole('button',{name:'关闭探索回顾',exact:true}).click();assert.deepEqual(await actions(p),['structure','mast','pass']);
  await p.reload({waitUntil:'networkidle'});assert.deepEqual(await actions(p),['structure','mast','pass']);assert.equal(await p.locator('.world').getAttribute('data-river-edition'),edition);
  await p.getByRole('button',{name:edition==='expanded'?'B · 精细版':'A · 扩大版',exact:true}).click();assert.deepEqual(await actions(p),['structure','mast','pass']);
  await p.locator('.object-switcher').getByRole('button',{name:/河道里的运输船/}).click();await p.mouse.move(8,8);await p.waitForTimeout(800);await p.screenshot({path:`artifacts/river-${edition}-restored-boat.png`});
  let requests=0;
  await p.route('**/api/chat',async route=>{const input=route.request().postDataJSON();assert.ok(['expanded','detailed'].includes(input.presentation));assert.equal(input.objectId,'boat');requests++;await route.fulfill({status:requests===1?502:200,contentType:'application/json',body:JSON.stringify(requests===1?{error:'测试：暂时无法回答'}:{answer:'这是接口重试测试回答。',sourceIds:['dpm-qingming-song'],mode:'live'})});});
  await p.locator('.panel-tabs').getByRole('button',{name:'问一问',exact:true}).click();await p.getByRole('textbox',{name:'你的问题',exact:true}).fill('这个是什么？');await p.getByRole('button',{name:'发送问题',exact:true}).click();await p.getByRole('alert').waitFor();await p.getByRole('button',{name:'重试这个问题',exact:true}).click();await p.getByText('这是接口重试测试回答。',{exact:true}).waitFor();assert.equal(requests,2);
  await p.locator('.object-switcher').getByRole('button',{name:/贯木拱/}).focus();await p.keyboard.press('Tab');await p.waitForTimeout(200);assert.ok(await p.locator('.scene-renderer').getAttribute('data-highlight-target'));
  await p.setViewportSize({width:390,height:844});await p.getByRole('button',{name:'返回全景',exact:true}).click();await p.waitForTimeout(900);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:`artifacts/river-${edition}-mobile.png`,fullPage:true});
  await p.getByRole('link',{name:'← 返回时间轴',exact:true}).click();await p.getByRole('heading',{name:/宋元/}).first().waitFor();assert.equal(await p.locator('canvas').count(),0);await p.close();results.push({edition,flow:true,hover:true,switchCancellation:true,restore:true,retry:true,keyboard:true,mobile:true,exit:true});
 }
 for(const fallback of [false,true]){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  if(fallback)await context.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(/webgl/.test(type))return null;return get.call(this,type,...args);};});
  const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.route('**/api/status',r=>r.fulfill({contentType:'application/json',body:'{"configured":false}'}));
  await p.goto(base+'/?river=expanded#/scene/song-yuan-making',{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();
  for(const name of steps)await p.getByRole('button',{name,exact:true}).click();await p.getByRole('button',{name:'关闭探索回顾',exact:true}).click();assert.deepEqual(await actions(p),['structure','mast','pass']);
  await p.locator('.panel-tabs').getByRole('button',{name:'问一问',exact:true}).click();await p.getByText('预置讲解可用 · 自由问答未连接',{exact:true}).waitFor();
  await p.getByRole('button',{name:/虹桥是石桥吗/}).click();await p.locator('.message.assistant').waitFor();if(fallback)await p.getByRole('heading',{name:'三维场景暂时无法显示',exact:true}).first().waitFor();
  await context.close();results.push({fallback,reducedMotion:true,offline:true});
 }
 assert.deepEqual(errors,[]);await writeFile('artifacts/river-regression.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));
}finally{await browser.close();}
