import {positionEarlyCamera} from './early-camera.mjs';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {exhibits} from '../src/exhibits.ts';
import assert from 'node:assert/strict';
import * as THREE from 'three';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const s=exhibits[0];await mkdir('artifacts',{recursive:true});
try{
 await page.goto(`${process.env.BASE_URL||'http://127.0.0.1:5173'}/#/scene/${s.id}`,{waitUntil:'networkidle'});await page.getByRole('button',{name:'开始探索',exact:true}).click();await page.mouse.move(10,10);await page.waitForTimeout(1600);
 await page.screenshot({path:'artifacts/pottery-refined-overview.png',fullPage:true});
 const r=await page.locator('canvas').boundingBox(),cam=new THREE.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,80);positionEarlyCamera(cam,r,'pottery');const point=new THREE.Vector3(-.35,.81,1.65).project(cam);await page.mouse.move(r.x+(point.x+1)*r.width/2,r.y+(1-point.y)*r.height/2);await page.getByRole('tooltip',{name:'彩陶盆',exact:true}).waitFor();assert.equal(await page.getByRole('tooltip').evaluate(e=>getComputedStyle(e).pointerEvents),'none');await page.mouse.down();await page.mouse.up();await page.getByRole('heading',{name:'彩陶盆',exact:true}).waitFor();await page.mouse.move(10,10);
 await page.getByRole('button',{name:s.steps[0].label,exact:true}).click();await page.waitForTimeout(500);await page.getByRole('button',{name:'取消操作',exact:true}).click();assert.deepEqual(await page.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions,s.id),[]);
 for(const step of s.steps){await page.getByRole('button',{name:step.label,exact:true}).click();await page.waitForTimeout(step.duration*500);await page.screenshot({path:`artifacts/pottery-${step.id}-motion.png`,fullPage:true});await page.waitForFunction(({id,step})=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)).actions.includes(step),{id:s.id,step:step.id});}
 await page.getByRole('button',{name:'关闭探索回顾',exact:true}).click();await page.waitForTimeout(900);await page.screenshot({path:'artifacts/pottery-refined-detail.png',fullPage:true});
 await page.getByRole('button',{name:'网纹示意',exact:true}).click();await page.waitForTimeout(300);await page.screenshot({path:'artifacts/pottery-net-detail.png',fullPage:true});await page.getByRole('button',{name:'鱼纹示意',exact:true}).click();
 for(const o of s.objects){await page.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await page.getByRole('heading',{name:o.name,exact:true}).waitFor();await page.waitForTimeout(1300);await page.screenshot({path:`artifacts/pottery-object-${o.id}.png`,fullPage:true});}
 await page.getByRole('button',{name:'返回全景',exact:true}).click();await page.getByRole('button',{name:'收起手册',exact:true}).click();await page.waitForTimeout(1300);await page.screenshot({path:'artifacts/pottery-refined-wide.png',fullPage:true});
 await page.locator('canvas').screenshot({path:'artifacts/pottery-clean-cover.png'});
 if(process.env.CAPTURE_COVERS==='1')await page.locator('canvas').screenshot({path:'public/images/prehistory-making.png'});
 await page.reload({waitUntil:'networkidle'});assert.equal(await page.getByRole('button',{name:'开始探索',exact:true}).count(),0);await page.getByRole('button',{name:'彩陶盆',exact:false}).first().click();
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'返回全景',exact:true}).click();await page.waitForTimeout(1400);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/pottery-refined-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);await writeFile('artifacts/pottery-refinement-results.json',JSON.stringify({objects:s.objects.length,actions:s.steps.length,checks:['real pointer hover and click','cancel animation','all animated steps','fish and net motifs','five object focus views','refresh restores','390px layout'],errors},null,2));
 console.log('Pottery refinement checks passed');
}finally{await browser.close();}
