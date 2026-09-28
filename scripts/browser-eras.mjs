import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {exhibits} from '../src/exhibits.ts';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await mkdir('artifacts',{recursive:true});await mkdir('public/images',{recursive:true});
await page.addInitScript(()=>{window.__audio=[];const A=window.AudioContext;window.AudioContext=class extends A{constructor(...args){super(...args);window.__audio.push(this);}};});
const state=s=>page.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)),s.id);
try{
 for(const s of exhibits){
  await page.goto(`${base}/#/scene/${s.id}`,{waitUntil:'networkidle'});await page.getByRole('button',{name:'开始探索',exact:true}).click();await page.mouse.move(10,10);await page.waitForTimeout(1000);assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.getByRole('tooltip').count(),0);
  await page.screenshot({path:`artifacts/v04-${s.kind}-overview.png`,fullPage:true});
  for(const o of s.objects){await page.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await page.getByRole('heading',{name:o.name,exact:true}).waitFor();}
  await page.keyboard.press('Tab');await page.locator('.object-switcher button').first().focus();await page.getByRole('tooltip',{name:s.objects[0].name,exact:true}).waitFor();await page.keyboard.press('Enter');
  for(const [i,step] of s.steps.entries()){
   if(s.kind==='slips'&&i===1){await page.getByRole('button',{name:'45',exact:true}).click();assert.equal(await page.getByRole('button',{name:step.label,exact:true}).isDisabled(),true);await page.getByRole('button',{name:'54',exact:true}).click();}
   await page.getByRole('button',{name:step.label,exact:true}).click();
   if(i===0){await page.waitForTimeout(350);await page.screenshot({path:`artifacts/v04-${s.kind}-action.png`,fullPage:true});}
   await page.waitForFunction(({id,n})=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.length===n,{id:s.id,n:i+1});
  }
  await page.getByRole('dialog').waitFor();assert.equal((await state(s)).actions.length,s.steps.length);await page.getByRole('button',{name:'关闭探索回顾',exact:true}).click();
  await page.getByRole('button',{name:'问一问',exact:true}).click();await page.getByRole('button',{name:s.qa[0].question,exact:true}).click();await page.locator('.message.assistant').waitFor();assert.match(await page.locator('.message.assistant').innerText(),new RegExp(s.sources[0].institution.split(' · ')[0]));assert.ok(await page.locator('.message.assistant a').count());
  const response=await page.request.post(`${base}/api/chat`,{data:{sceneId:s.id,objectId:s.objects[0].id,zoneId:null,actions:s.steps.map(x=>x.id),question:s.qa[0].question,history:[]}});assert.equal(response.status(),200);assert.deepEqual((await response.json()).sourceIds,s.qa[0].sourceIds);
  await page.getByRole('button',{name:'资料',exact:true}).click();assert.ok(await page.getByRole('link',{name:'阅读原始资料'}).count());
  await page.reload({waitUntil:'networkidle'});assert.equal((await state(s)).actions.length,s.steps.length);assert.equal(await page.getByRole('button',{name:'开始探索',exact:true}).count(),0);await page.mouse.move(10,10);await page.waitForTimeout(1100);
  if(process.env.CAPTURE_COVERS==='1'){await page.getByRole('button',{name:'收起手册',exact:true}).click();await page.waitForTimeout(1000);await page.locator('.scene-canvas').screenshot({path:`public/images/${s.id}.png`});}
  await page.screenshot({path:`artifacts/v04-${s.kind}-complete.png`,fullPage:true});
  await page.getByRole('link',{name:'返回时间轴',exact:false}).click();await page.getByRole('heading',{name:/在时间里/}).waitFor();assert.equal(await page.locator('canvas').count(),0);assert.equal(await page.getByRole('link',{name:'继续探索',exact:true}).getAttribute('href'),`#/scene/${s.id}`);assert.equal(await page.evaluate(()=>window.__audio.every(a=>a.state==='closed')),true);
  checks.push({scene:s.id,objects:s.objects.length,actions:s.steps.length,completed:true});console.log(`Verified ${s.subtitle}`);
 }
 for(const id of ['prehistory','pre-qin','qin-han','wei-jin','sui-tang','song-yuan','ming-qing','modern']){await page.goto(`${base}/#/era/${id}`,{waitUntil:'networkidle'});assert.equal(await page.getByRole('link',{name:'进入场景',exact:true}).count(),3);await page.screenshot({path:`artifacts/v04-timeline-${id}.png`,fullPage:true});}
 await page.setViewportSize({width:390,height:844});await page.goto(`${base}/#/era/qin-han`,{waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/v04-timeline-mobile.png',fullPage:true});
 await page.goto(`${base}/#/scene/qin-han-making`,{waitUntil:'networkidle'});await page.waitForTimeout(1200);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/v04-loom-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);await writeFile('artifacts/v04-browser-results.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}
