import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {exhibits} from '../src/exhibits.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const scenes=exhibits.filter(s=>['prehistory-making','qin-han-living','wei-jin-making','wei-jin-culture'].includes(s.id));
const errors=[];await mkdir('artifacts/flicker/local-scenes',{recursive:true});
try{for(const s of scenes.filter(s=>!process.env.SCENE_ID||process.env.SCENE_ID===s.id)){
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(`${s.id}: ${e.message}`));
 await p.goto(`http://127.0.0.1:5173/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();
 const close=p.getByRole('button',{name:'收起手册',exact:true});if(await close.count())await close.click();await p.mouse.move(10,10);await p.waitForTimeout(1500);
 await p.screenshot({path:`artifacts/flicker/local-scenes/${s.id}-page.png`});
 const coverStyle=await p.addStyleTag({content:'.scene-heading,.scene-corner,.breadcrumbs,.open-panel,.world-bottom,.river-comparison{visibility:hidden!important}'});
 await p.locator('canvas').screenshot({path:`artifacts/flicker/local-scenes/${s.id}.png`});
 if(process.env.CAPTURE_COVERS==='1')await p.locator('canvas').screenshot({path:`public/images/${s.village?'peiligang-village':s.id}.png`});
 await coverStyle.evaluate(e=>e.remove());
 if(!s.village){for(const o of s.objects.filter(o=>['firing','service-court','clay-pit','pillar','buddha'].includes(o.id))){
  await p.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await p.waitForTimeout(1150);await p.screenshot({path:`artifacts/flicker/local-scenes/${s.id}-${o.id}.png`});const box=await p.locator('canvas').boundingBox();await p.mouse.move(box.x+box.width*.62,box.y+box.height*.6);await p.mouse.down();await p.mouse.move(box.x+box.width*.37,box.y+box.height*.53,{steps:35});await p.mouse.up();await p.mouse.move(10,10);await p.waitForTimeout(500);await p.screenshot({path:`artifacts/flicker/local-scenes/${s.id}-${o.id}-rotated.png`});
 }}else {await p.locator('.zone-switcher').getByRole('button',{name:/聚落后巷/}).click();await p.waitForTimeout(1200);await p.screenshot({path:'artifacts/flicker/local-scenes/village-houses.png'});}
 await p.close();console.log(`Rendered ${s.id}`);
 }
 const images=await Promise.all(scenes.map(async(s)=>`<figure><img src="data:image/png;base64,${(await readFile(`artifacts/flicker/local-scenes/${s.id}.png`)).toString('base64')}"><figcaption>${s.subtitle}</figcaption></figure>`));
 const sheet=await browser.newPage({viewport:{width:1500,height:470}});await sheet.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#f6f1e7;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(1,470px);font:18px serif}figure{margin:0;padding:8px;border:1px solid #d5cab5}img{width:100%;height:410px;object-fit:contain}figcaption{text-align:center}</style>${images.join('')}`);await sheet.screenshot({path:'artifacts/flicker/local-scenes/contact.png',fullPage:true});await sheet.close();
 await writeFile('artifacts/flicker/local-scenes/render-errors.json',JSON.stringify(errors));if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
