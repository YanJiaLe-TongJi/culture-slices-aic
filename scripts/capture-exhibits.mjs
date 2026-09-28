import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {exhibits} from '../src/exhibits.ts';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl']});
await mkdir('artifacts',{recursive:true});await mkdir('public/images',{recursive:true});
try{for(const s of exhibits.filter(s=>!process.env.ERA_ID||s.eraId===process.env.ERA_ID)){const p=await browser.newPage({viewport:{width:1440,height:1000}});await p.addInitScript(s=>localStorage.setItem(`culture-slice:exhibit:${s.id}:v1`,JSON.stringify({version:1,entered:true,viewed:s.objects.map(o=>o.id),actions:s.steps.map(o=>o.id)})),s);await p.goto(`http://127.0.0.1:5173/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'收起手册',exact:true}).click();await p.mouse.move(10,10);await p.waitForTimeout(1200);await p.locator('canvas').screenshot({path:`public/images/${s.id}.png`});await p.screenshot({path:`artifacts/v04-${s.kind}-final.png`,fullPage:true});await p.close();console.log(`Captured ${s.id}`);}}finally{await browser.close();}
