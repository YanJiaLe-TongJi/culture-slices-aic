import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {chromium}=require(process.argv[2]||'playwright');
const b=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>console.log('ERROR',e.message));
await p.goto('http://127.0.0.1:5173/#/scene/peiligang-grain',{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();await p.waitForTimeout(1700);await p.screenshot({path:'artifacts/village-overview.png',fullPage:true});
await p.locator('.zone-switcher').getByRole('button',{name:/屋前磨粮/}).click();await p.waitForTimeout(1400);await p.screenshot({path:'artifacts/village-grinding.png',fullPage:true});
await p.getByRole('button',{name:'将谷物放上磨盘'}).click();await p.waitForTimeout(1000);await p.screenshot({path:'artifacts/village-pouring.png',fullPage:true});await p.waitForTimeout(1800);
await p.getByRole('button',{name:'返回全景',exact:true}).click();await p.locator('.zone-switcher').getByRole('button',{name:/屋内器用/}).click();await p.waitForTimeout(1700);await p.screenshot({path:'artifacts/village-house.png',fullPage:true});
console.log('UI capture complete');await b.close();
