import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as THREE from 'three';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5173';
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
await page.addInitScript(()=>{
 window.__audioContexts=[];const Audio=window.AudioContext;window.AudioContext=class extends Audio{constructor(...args){super(...args);window.__audioContexts.push(this);}};
 window.__chatAborts=0;const nativeFetch=window.fetch;window.fetch=function(input,init){if(String(input).includes('/api/chat'))init?.signal?.addEventListener('abort',()=>window.__chatAborts++);return nativeFetch.call(this,input,init);};
});
const progress=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('culture-slice:progress:v1')));
const back=()=>page.getByRole('link',{name:'返回时间轴',exact:false}).click();
async function aim(point,target,level='village'){
 const r=await page.locator('.scene-renderer canvas').boundingBox();const cam=new THREE.OrthographicCamera(-r.width/2,r.width/2,r.height/2,-r.height/2,.1,100);
 cam.position.set(target[0]+8,target[1]+10,target[2]+13);cam.lookAt(...target);cam.zoom=level==='village'?Math.min(55,r.width/18.5,r.height/15.5):Math.min(125,r.width/6.9,r.height/5.8);cam.updateProjectionMatrix();cam.updateMatrixWorld();const p=new THREE.Vector3(...point).project(cam);
 await page.mouse.move(r.x+(p.x+1)*r.width/2,r.y+(1-p.y)*r.height/2);
}
try{
 await page.goto(`${base}/`,{waitUntil:'networkidle'});
 assert.equal(await page.getByRole('tab').count(),8);assert.equal(await page.locator('.slice-card').count(),3);assert.equal(await page.locator('canvas').count(),0);
 assert.ok(!requests.some(url=>/(?:Experience|Scene|OrbitControls)[-.]|@react-three|three_fiber/.test(url)),'homepage fetched 3D code');
 for(const tab of await page.getByRole('tab').all()){await tab.click();await page.waitForTimeout(40);assert.equal(await page.locator('.slice-card').count(),3);}
 assert.equal(await page.getByRole('link',{name:'进入场景',exact:true}).count(),3);assert.equal(await page.locator('.planned a,.planned button').count(),0);
 await page.getByRole('tab',{name:/近现代/}).focus();await page.keyboard.press('Home');await page.getByRole('tab',{name:/史前/}).waitFor();assert.equal(await page.getByRole('tab',{name:/史前/}).getAttribute('aria-selected'),'true');
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(50);assert.match(page.url(),/pre-qin/);await page.goBack();await page.waitForTimeout(100);assert.match(page.url(),/prehistory/);await page.goForward();await page.waitForTimeout(100);assert.match(page.url(),/pre-qin/);
 await page.getByRole('tab',{name:/史前/}).click();await page.screenshot({path:'artifacts/v03-timeline.png',fullPage:true});
 await page.getByRole('link',{name:'进入场景',exact:true}).first().click();await page.getByRole('button',{name:'开始探索',exact:true}).click();await page.mouse.move(10,10);await page.waitForTimeout(1800);assert.equal(await page.getByRole('tooltip').count(),0);assert.equal(await page.locator('.world-label').count(),0);await page.screenshot({path:'artifacts/v03-scene-clean.png',fullPage:true});
 await aim([-1.6,.4,2.85],[0,.2,0]);await page.getByRole('tooltip',{name:'屋前磨粮',exact:true}).waitFor();assert.equal(await page.getByRole('tooltip').evaluate(el=>getComputedStyle(el).pointerEvents),'none');await page.screenshot({path:'artifacts/v03-hover-region.png',fullPage:true});
 await page.mouse.move(10,10);await page.waitForTimeout(30);assert.equal(await page.getByRole('tooltip').count(),0);
 await aim([-1.6,.4,2.85],[0,.2,0]);await page.mouse.down();await page.mouse.up();await page.getByRole('heading',{name:'屋前磨粮',exact:true}).waitFor();await page.mouse.move(10,10);await page.waitForTimeout(1800);
 await aim([-1.5,.4,2.9],[-1.2,0,2.7],'zone');await page.getByRole('tooltip',{name:'石磨盘',exact:true}).waitFor();await page.screenshot({path:'artifacts/v03-hover-object.png',fullPage:true});
 await page.mouse.down();await page.mouse.move(600,570,{steps:5});assert.equal(await page.getByRole('tooltip').count(),0);await page.mouse.up();await page.mouse.move(10,10);
 await page.keyboard.press('Tab');await page.locator('.object-switcher').getByRole('button',{name:/石磨棒/}).focus();await page.getByRole('tooltip',{name:'石磨棒',exact:true}).waitFor();assert.equal(await page.locator('.scene-renderer').getAttribute('data-highlight-target'),'roller');await page.keyboard.press('Enter');await page.getByRole('heading',{name:'石磨棒',exact:true}).waitFor();assert.equal(await page.getByRole('tooltip').count(),0);
 await page.getByRole('button',{name:'将谷物放上磨盘',exact:true}).click();await back();await page.getByRole('heading',{name:/在时间里/}).waitFor();await page.waitForTimeout(2400);assert.equal(await page.locator('canvas').count(),0);assert.deepEqual((await progress()).actions,[]);assert.ok((await progress()).viewed.includes('roller'));
 await page.getByRole('link',{name:'继续探索',exact:true}).click();await page.locator('.zone-switcher').getByRole('button',{name:/屋前磨粮/}).click();await page.getByRole('button',{name:'将谷物放上磨盘',exact:true}).click();await page.getByRole('button',{name:'动手加工',exact:true}).waitFor();assert.deepEqual((await progress()).actions,['placed']);await back();await page.reload({waitUntil:'networkidle'});await page.getByRole('link',{name:'继续探索',exact:true}).click();assert.deepEqual((await progress()).actions,['placed']);
 await page.getByRole('button',{name:'开启环境声',exact:true}).click();await back();assert.equal(await page.evaluate(()=>window.__audioContexts.at(-1).state),'closed');
 await page.route('**/api/status',r=>r.fulfill({json:{configured:true}}));let pendingRoute;await page.route('**/api/chat',r=>{pendingRoute=r;});
 await page.getByRole('link',{name:'继续探索',exact:true}).click();await page.getByRole('button',{name:'问一问',exact:true}).click();await page.getByText('结合当前器物与操作回答',{exact:true}).waitFor();await page.getByLabel('你的问题').fill('这些器物是什么？');await page.getByRole('button',{name:'发送问题',exact:true}).click();await page.getByRole('status').filter({hasText:'正在查阅'}).waitFor();await back();assert.equal(await page.evaluate(()=>window.__chatAborts),1);await pendingRoute?.abort().catch(()=>{});await page.unroute('**/api/chat');await page.unroute('**/api/status');
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/v03-timeline-mobile.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.getByRole('tablist').getAttribute('aria-orientation'),'vertical');
 await page.getByRole('link',{name:'继续探索',exact:true}).click();await page.waitForTimeout(1200);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'artifacts/v03-scene-mobile.png',fullPage:true});
 await page.goto(`${base}/#/scene/not-registered`,{waitUntil:'networkidle'});await page.getByRole('heading',{name:'这一页还没有开放'}).waitFor();assert.equal(await page.locator('canvas').count(),0);
 assert.deepEqual(errors,[]);const result={checks:['eight eras and three slots','all modern scenes available and no planned actions','homepage avoids 3D downloads','keyboard timeline','back and forward','clean scene','region hover','object hover','nonblocking tooltip','drag clears tooltip','keyboard highlight and selection','leave cancels placement','stable progress and resume','audio closes','chat aborts','mobile timeline and scene','invalid routes'],errors};await writeFile('artifacts/v03-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
