import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {exhibits} from '../src/exhibits.ts';

const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const dir='artifacts/flicker/scenes',errors=[],checks=[];
const scenes=[{id:'peiligang-grain',subtitle:'裴李岗生活村落',village:true},...exhibits];
await mkdir(dir,{recursive:true});
try{
 for(const s of scenes){
  const p=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(`${s.id}: ${e.message}`));
  try{
   await p.goto(`http://127.0.0.1:5173/#/scene/${s.id}`,{waitUntil:'networkidle'});
   await p.getByRole('button',{name:'开始探索',exact:true}).click();
   const close=p.getByRole('button',{name:'收起手册',exact:true});if(await close.count())await close.click();
   await p.mouse.move(10,10);await p.waitForTimeout(1200);
   const canvas=p.locator('canvas');assert.equal(await canvas.count(),1);
   await p.screenshot({path:`${dir}/${s.id}-overview.png`});
   // Real OrbitControls input; the reverse-facing wall surfaces were worst before the fix.
   const box=await canvas.boundingBox();
   await p.mouse.move(box.x+box.width*.65,box.y+box.height*.62);await p.mouse.down();
   await p.mouse.move(box.x+box.width*.38,box.y+box.height*.53,{steps:30});await p.mouse.up();
   await p.mouse.move(10,10);await p.waitForTimeout(500);
   assert.equal(await p.getByRole('tooltip').count(),0);
   await p.screenshot({path:`${dir}/${s.id}-rotated.png`});
   await p.getByRole('button',{name:'返回全景',exact:true}).click();
   if(s.village){
    await p.locator('.zone-switcher').getByRole('button',{name:/聚落后巷/}).click();
   }else{
    const object=s.objects[0];
    await p.locator('.object-switcher').getByRole('button',{name:new RegExp(object.name)}).click();
    await p.getByRole('heading',{name:object.name,exact:true}).waitFor();
   }
   await p.mouse.move(10,10);await p.waitForTimeout(1500);
   await p.screenshot({path:`${dir}/${s.id}-detail.png`});
   await p.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await canvas.count(),0);
   checks.push(s.id);console.log('Rotation and detail verified:',s.id);
  }finally{await p.close();}
 }
 // Visual review sheets use real runtime captures, not hand-maintained cover images.
 for(const suffix of ['overview','rotated','detail']){
  const rows=await Promise.all(scenes.map(async s=>`<figure><img src="data:image/png;base64,${(await readFile(`${dir}/${s.id}-${suffix}.png`)).toString('base64')}"><figcaption>${s.subtitle}</figcaption></figure>`));
  const p=await browser.newPage({viewport:{width:1600,height:2450}});
  await p.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#f6f1e7;display:grid;grid-template-columns:repeat(4,1fr);font:16px serif}figure{margin:0;padding:4px;border:1px solid #d5cab5}img{width:100%;height:365px;object-fit:contain}figcaption{text-align:center}</style>${rows.join('')}`);
  await p.screenshot({path:`${dir}/${suffix}-contact.png`,fullPage:true});await p.close();
 }
 assert.deepEqual(errors,[]);
 await writeFile(`${dir}/checks.json`,JSON.stringify({browser:browser.version(),viewport:'1440x1000',dpr:1,checks,errors},null,2));
}finally{await browser.close();}
