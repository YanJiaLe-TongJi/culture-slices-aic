import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {exhibits} from '../src/exhibits.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const scenes=[{id:'peiligang-grain',subtitle:'裴李岗生活村落',village:true},...exhibits.filter(s=>['prehistory','pre-qin','qin-han'].includes(s.eraId))];
const errors=[];await mkdir('artifacts/early-expanded',{recursive:true});
try{for(const s of scenes){
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(`${s.id}: ${e.message}`));
 await p.goto(`http://127.0.0.1:5173/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();
 const close=p.getByRole('button',{name:'收起手册',exact:true});if(await close.count())await close.click();await p.mouse.move(10,10);await p.waitForTimeout(1500);
 await p.screenshot({path:`artifacts/early-expanded/${s.id}-page.png`});
 const coverStyle=await p.addStyleTag({content:'.scene-heading,.scene-corner,.breadcrumbs,.open-panel,.world-bottom,.river-comparison{visibility:hidden!important}'});
 await p.locator('canvas').screenshot({path:`artifacts/early-expanded/${s.id}.png`});
 if(process.env.CAPTURE_COVERS==='1')await p.locator('canvas').screenshot({path:`public/images/${s.village?'peiligang-village':s.id}.png`});
 await coverStyle.evaluate(e=>e.remove());
 if(!s.village){for(const o of [s.objects[0],...s.objects.slice(-2)]){
  await p.locator('.object-switcher').getByRole('button',{name:new RegExp(o.name)}).click();await p.waitForTimeout(1150);await p.screenshot({path:`artifacts/early-expanded/${s.id}-${o.id}.png`});
 }}else {await p.locator('.zone-switcher').getByRole('button',{name:/聚落后巷/}).click();await p.waitForTimeout(1200);await p.screenshot({path:'artifacts/early-expanded/village-houses.png'});}
 await p.close();console.log(`Rendered ${s.id}`);
 }
 const images=await Promise.all(scenes.map(async(s)=>`<figure><img src="data:image/png;base64,${(await readFile(`artifacts/early-expanded/${s.id}.png`)).toString('base64')}"><figcaption>${s.subtitle}</figcaption></figure>`));
 const sheet=await browser.newPage({viewport:{width:1500,height:1200}});await sheet.setContent(`<style>*{box-sizing:border-box}body{margin:0;background:#f6f1e7;display:grid;grid-template-columns:repeat(3,1fr);font:18px serif}figure{margin:0;padding:8px;border:1px solid #d5cab5}img{width:100%;height:355px;object-fit:contain}figcaption{text-align:center}</style>${images.join('')}`);await sheet.screenshot({path:'artifacts/early-expanded/contact.png',fullPage:true});await sheet.close();
 await writeFile('artifacts/early-expanded/render-errors.json',JSON.stringify(errors));if(errors.length)throw Error(errors.join('\n'));
}finally{await browser.close();}
