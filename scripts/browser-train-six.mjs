import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
import {newEraLayouts} from '../src/new-era-layouts.ts';
import {getExhibit} from '../src/exhibits.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true}),s=getExhibit('new-era-living'),errors=[];
const p=await browser.newPage({viewport:{width:1440,height:1000}});
p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await mkdir('artifacts/train-six',{recursive:true});
try{
 await p.goto('http://127.0.0.1:5173/#/scene/new-era-living',{waitUntil:'networkidle'});
 await p.getByRole('button',{name:'开始探索',exact:true}).click();
 await p.getByRole('button',{name:'收起手册',exact:true}).click();await p.mouse.move(10,10);await p.waitForTimeout(1400);
 const r=await p.locator('canvas').boundingBox(),layout=newEraLayouts.highspeed;
 const cam=new T.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,80);cam.position.set(layout.center[0]+8,layout.center[1]+9,layout.center[2]+12);cam.lookAt(...layout.center);cam.zoom=Math.min(62,r.width/layout.overviewSpan[0],r.height/layout.overviewSpan[1]);cam.updateProjectionMatrix();cam.updateMatrixWorld();
 const q=new T.Vector3(-18,2.30,2.55).project(cam),x=r.x+(q.x+1)*r.width/2,y=r.y+(1-q.y)*r.height/2;
 await p.mouse.move(x,y);await p.getByRole('tooltip',{name:'尾部驾驶端',exact:true}).waitFor();await p.mouse.click(x,y);
 await p.getByRole('heading',{name:'尾部驾驶端',exact:true}).waitFor();await p.mouse.move(10,10);await p.waitForTimeout(1300);
 await p.screenshot({path:'artifacts/train-six/tail-picked.png'});
 await p.getByRole('button',{name:'返回全景',exact:true}).click();await p.waitForTimeout(1300);await p.screenshot({path:'artifacts/train-six/whole-before.png'});
 await p.emulateMedia({reducedMotion:'reduce'});
 for(const step of s.steps){if(!(await p.getByRole('button',{name:step.label,exact:true}).count()))await p.getByRole('button',{name:/探索手册/}).click();await p.getByRole('button',{name:step.label,exact:true}).click();}
 await p.getByRole('button',{name:'关闭探索回顾',exact:true}).click();await p.getByRole('button',{name:'返回全景',exact:true}).click();
 await p.screenshot({path:'artifacts/train-six/whole-departed.png'});
 await p.reload({waitUntil:'networkidle'});
 for(const id of ['train','tail','bogie']){
  const o=s.objects.find(o=>o.id===id);await p.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await p.waitForTimeout(350);await p.screenshot({path:`artifacts/train-six/restored-${id}.png`});
 }
 await p.getByRole('button',{name:'返回全景',exact:true}).click();await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.screenshot({path:'artifacts/train-six/whole-390.png',fullPage:true});
 const progress=await p.evaluate(()=>JSON.parse(localStorage.getItem('culture-slice:exhibit:new-era-living:v1')));assert.equal(progress.actions.length,3);assert.ok(progress.viewed.includes('tail'));
 assert.deepEqual(errors,[]);await writeFile('artifacts/train-six/browser.json',JSON.stringify({browser:browser.version(),checks:['real tail hover/click','complete six-car panorama','whole consist departed','restored front/rear/bogie framing','390px full overview'],errors},null,2));
 console.log('Six-car browser checks passed');
}finally{await browser.close();}
