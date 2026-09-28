import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as T from 'three';
import {exhibits} from '../src/exhibits.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[],checks=[],dir='artifacts/late-reveal';await mkdir(dir,{recursive:true});
async function project(page,point,target,spatial=false){
 const r=await page.locator('canvas').boundingBox(),c=new T.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,80);
 c.position.set(target[0]+8,target[1]+9,target[2]+12);c.lookAt(...target);c.zoom=Math.min(85,r.width/(spatial?14:8.2),r.height/(spatial?10.5:7));c.updateProjectionMatrix();c.updateMatrixWorld();
 const q=new T.Vector3(...point).project(c);return {x:r.x+(q.x+1)*r.width/2,y:r.y+(1-q.y)*r.height/2};
}
try{
 for(const s of exhibits.filter(s=>['study','porcelain','newyear','sewing','carding'].includes(s.kind)&&(!process.env.SCENE_ID||process.env.SCENE_ID===s.id))){
  const p=await browser.newPage({viewport:{width:1440,height:1000}});p.setDefaultTimeout(10000);p.on('pageerror',e=>errors.push(`${s.kind}: ${e.message}`));
  try{
   await p.goto(`http://127.0.0.1:5173/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.waitForTimeout(1400);
   await p.screenshot({path:`${dir}/${s.kind}-closed.png`});
   const buildingId={study:'study-room',porcelain:'yard',newyear:'courtyard',sewing:'room',carding:'factory'}[s.kind],building=s.objects.find(o=>o.id===buildingId);
   const choose=async id=>{await p.locator('.object-switcher').getByRole('button',{name:new RegExp(s.objects.find(o=>o.id===id).name)}).click();await p.mouse.move(10,10);await p.waitForTimeout(1800);await p.getByRole('heading',{name:s.objects.find(o=>o.id===id).name,exact:true}).waitFor();assert.equal(await p.locator('.object-switcher [aria-pressed="true"]').count(),1);};
   await choose(buildingId);await p.screenshot({path:`${dir}/${s.kind}-open.png`});
   if(true){
    // The roof and front frame used to intercept this actual pointer ray.
    const objectId=s.kind==='grotto'?'buddha':s.objects[0].id,object=s.objects.find(o=>o.id===objectId);
    const point=s.kind==='grotto'?[0,1.7,1.9]:object.position,pt=await project(p,point,building.position,building.kind==='生活空间 · 教学演绎');
    await p.mouse.move(pt.x,pt.y);await p.getByRole('tooltip',{name:object.name,exact:true}).waitFor();await p.mouse.click(pt.x,pt.y);await p.getByRole('heading',{name:object.name,exact:true}).waitFor();await p.mouse.move(10,10);await p.waitForTimeout(1500);
    await p.screenshot({path:`${dir}/${s.kind}-artifact.png`});checks.push(`${s.kind}: physical pointer through revealed building`);
    // Every indoor object must keep its building open, including secondary actions.
    for(const o of s.objects.slice(0,3)){await choose(o.id);await p.screenshot({path:`${dir}/${s.kind}-${o.id}.png`});}
   }else if(s.kind==='pottery'){await choose('settlement');await p.screenshot({path:`${dir}/pottery-round-open.png`});}
   await p.getByRole('button',{name:'返回全景',exact:true}).click();await p.mouse.move(10,10);await p.waitForTimeout(1700);await p.screenshot({path:`${dir}/${s.kind}-closed-again.png`});
   assert.equal(await p.getByRole('tooltip').count(),0);
   await p.emulateMedia({reducedMotion:'reduce'});await choose(buildingId);await p.getByRole('button',{name:'返回全景',exact:true}).click();await p.waitForTimeout(150);
   await p.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await p.locator('canvas').count(),0);
   checks.push(`${s.kind}: open, return, reduced motion, unmount`);console.log('Building verified',s.kind);
  }catch(e){await p.screenshot({path:`${dir}/${s.kind}-failure.png`});throw e;}finally{await p.close();}
 }
 assert.deepEqual(errors,[]);await writeFile(process.env.SCENE_ID?`${dir}/check-${process.env.SCENE_ID}.json`:`${dir}/checks.json`,JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}
