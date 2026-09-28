import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);const {chromium}=require(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('culture-slice:progress:v1')));
const region=async name=>{await page.getByRole('button',{name:'返回全景',exact:true}).click();await page.locator('.zone-switcher').getByRole('button',{name:new RegExp(name)}).click();};
try{
 await page.goto('http://127.0.0.1:5173/#/scene/peiligang-grain',{waitUntil:'networkidle'});await page.getByRole('button',{name:'开始探索',exact:true}).click();
 await region('屋前磨粮');
 await page.getByRole('button',{name:'将谷物放上磨盘'}).click();await page.getByRole('button',{name:'取消放置',exact:true}).click();await page.waitForTimeout(2400);assert.deepEqual((await state()).actions,[]);
 await page.getByRole('button',{name:'将谷物放上磨盘'}).click();await page.getByRole('button',{name:'返回全景',exact:true}).click();await page.waitForTimeout(2400);assert.deepEqual((await state()).actions,[]);
 await region('屋前磨粮');await page.getByRole('button',{name:'将谷物放上磨盘'}).click();await page.getByRole('button',{name:'重新开始',exact:true}).click();await page.waitForTimeout(2400);assert.deepEqual((await state()).actions,[]);assert.equal((await state()).viewed.length,0);
 await region('屋前磨粮');await page.getByRole('button',{name:'将谷物放上磨盘'}).click();await page.reload({waitUntil:'networkidle'});assert.deepEqual((await state()).actions,[]);
 await region('屋前磨粮');await page.getByRole('button',{name:'将谷物放上磨盘'}).click();await page.getByRole('button',{name:'跳过动画',exact:true}).click();await page.getByRole('button',{name:'动手加工',exact:true}).waitFor();assert.deepEqual((await state()).actions,['placed']);
 await region('灶边炊煮');await page.getByRole('button',{name:'点亮薪火，观察三足',exact:true}).click();await page.getByRole('heading',{name:'乳钉纹红陶鼎',exact:true}).waitFor();await page.waitForTimeout(1400);await page.screenshot({path:'artifacts/village-cooking.png',fullPage:true});
 await page.getByRole('button',{name:'问一问',exact:true}).click();await page.getByRole('button',{name:/陶鼎为什么有三只足/}).click();assert.match(await page.locator('.message.assistant').innerText(),/河南博物院/);assert.equal(await page.locator('.message.assistant a').count(),1);
 await page.getByRole('button',{name:'资料',exact:true}).click();assert.match(await page.getByRole('link',{name:'阅读馆方原文'}).getAttribute('href'),/rdwhtd/);
 await region('制陶角');await page.getByRole('button',{name:'观看泥条成形',exact:true}).click();await page.waitForTimeout(1600);await page.screenshot({path:'artifacts/village-pottery.png',fullPage:true});await page.getByRole('button',{name:'观看泥条成形',exact:true}).click();
 await region('屋内器用');await page.locator('.object-switcher').getByRole('button',{name:/红陶双耳壶/}).click();await page.getByRole('heading',{name:'红陶双耳壶',exact:true}).waitFor();assert.match(await page.locator('.object-detail').innerText(),/石固/);await page.waitForTimeout(1600);await page.screenshot({path:'artifacts/village-jar.png',fullPage:true});
 await region('村边土地');await page.locator('.object-switcher').getByRole('button',{name:/石铲/}).click();await page.getByRole('heading',{name:'石铲',exact:true}).waitFor();await page.locator('.object-switcher').getByRole('button',{name:/锯齿石镰/}).click();await page.getByRole('heading',{name:'锯齿石镰',exact:true}).waitFor();assert.match(await page.locator('.object-detail').innerText(),/水泉/);
 await page.getByRole('button',{name:'循着谷物，去屋前磨粮'}).click();await page.getByRole('button',{name:'动手加工',exact:true}).waitFor();await page.reload({waitUntil:'networkidle'});assert.ok((await state()).viewed.includes('jar'));assert.ok((await state()).viewed.includes('ding'));assert.ok((await state()).viewed.includes('sickle'));
 const response=await page.request.post('http://127.0.0.1:5173/api/chat',{data:{sceneId:'peiligang-grain',zoneId:'cooking',objectId:'ding',actions:[],question:'陶鼎为什么有三只足？',history:[]}});assert.equal(response.status(),200);assert.deepEqual((await response.json()).sourceIds,['henan-ding']);
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(1000);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/village-small.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'重新开始',exact:true}).click();await region('屋前磨粮');await page.getByRole('button',{name:'将谷物放上磨盘'}).click();await page.getByRole('button',{name:'动手加工',exact:true}).waitFor();assert.deepEqual((await state()).actions,['placed']);assert.equal(await page.getByRole('button',{name:'取消放置',exact:true}).count(),0);
 assert.deepEqual(errors,[]);const result={checks:['cancel placement','leave during placement','reset without stale callback','reload during placement','skip placement','five regions','fire','coil replay','artifact provenance','contextual offline answer','matching citations','new object persistence','updated server API','390px layout','reduced motion'],errors};await writeFile('artifacts/village-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
