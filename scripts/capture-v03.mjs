import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const b=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:5173/#/scene/peiligang-grain',{waitUntil:'networkidle'});await page.getByRole('button',{name:'开始探索',exact:true}).click();await page.getByRole('button',{name:'收起手册',exact:true}).click();await page.mouse.move(10,10);await page.waitForTimeout(2000);
 await page.addStyleTag({content:'.scene-heading,.scene-corner,.breadcrumbs,.world-bottom,.open-panel,.scene-labels{visibility:hidden!important}'});
 const box=await page.locator('.scene-canvas').boundingBox();await mkdir('public/images',{recursive:true});await page.screenshot({path:'public/images/peiligang-village.png',clip:{x:box.x+box.width/2-430,y:box.y+box.height/2-245,width:860,height:490}});
 await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.screenshot({path:'artifacts/v03-timeline.png',fullPage:true});
 await page.getByRole('link',{name:'进入场景',exact:true}).click();await page.locator('.scene-renderer canvas').waitFor();await page.waitForTimeout(2000);await page.screenshot({path:'artifacts/v03-scene-clean.png',fullPage:true});
 console.log(JSON.stringify({errors}));
}finally{await b.close();}
