import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.argv[2]||'playwright');
await mkdir('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:900}});
await page.addInitScript(()=>{
  window.__sceneTools={};
  Object.defineProperty(document,'modelContext',{value:{registerTool(tool,{signal}){
    window.__sceneTools[tool.name]=tool;
    signal.addEventListener('abort',()=>{if(window.__sceneTools[tool.name]===tool)delete window.__sceneTools[tool.name];});
  }}});
});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
  await page.route('**/api/status',route=>route.fulfill({json:{configured:true}}));
  let attempt=0;
  await page.route('**/api/chat',route=>{
    const request=route.request().postDataJSON();
    assert.equal(request.objectId,'slab');
    if(attempt++===0)return route.fulfill({status:502,json:{error:'问答服务暂时不可用，请稍后重试。'}});
    return route.fulfill({json:{answer:'这是石磨盘。资料中记载其表面留有磨蚀凹陷。',sourceIds:['nmc-grinding-tools'],mode:'live'}});
  });
  await page.goto('http://127.0.0.1:5173/#/scene/peiligang-grain',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'开始探索',exact:true}).click();
  await page.locator('.zone-switcher').getByRole('button',{name:/屋前磨粮/}).click();
  await page.locator('.object-switcher').getByRole('button',{name:/石磨盘/}).click();
  const toolRead=await page.evaluate(()=>window.__sceneTools.read_culture_scene.execute({}));
  assert.equal(toolRead.selectedObjectId,'slab');assert.ok(toolRead.progress.viewed.includes('slab'));
  const invalid=await page.evaluate(()=>{try{window.__sceneTools.read_culture_scene.execute({unexpected:1});return false;}catch{return true;}});
  assert.equal(invalid,true);
  await page.getByRole('button',{name:/问一问/}).click();
  await page.getByLabel('你的问题').fill('这是什么？');
  await page.getByRole('button',{name:'发送问题'}).click();
  await page.getByRole('alert').waitFor();
  await page.getByRole('button',{name:'重试这个问题'}).click();
  await page.locator('.message.assistant').waitFor();
  assert.equal(await page.locator('.message.user').count(),1);
  assert.match(await page.locator('.message.assistant').innerText(),/石磨盘/);
  await page.getByRole('button',{name:'开启环境声'}).click();
  await page.getByRole('button',{name:'关闭声音'}).click();
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(1100);
  await page.screenshot({path:'artifacts/06-small-window.png',fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
const disabled=await chromium.launch({channel:'msedge',headless:true,args:['--disable-webgl']});
try{
  const page=await disabled.newPage({viewport:{width:1280,height:900}});
  await page.goto('http://127.0.0.1:5173/#/scene/peiligang-grain',{waitUntil:'networkidle'});
  await page.getByRole('heading',{name:'三维场景暂时无法显示'}).waitFor();
  await page.getByRole('button',{name:'开始探索',exact:true}).click();
  await page.locator('.zone-switcher').getByRole('button',{name:/屋前磨粮/}).click();
  await page.locator('.object-switcher').getByRole('button',{name:/石磨盘/}).click();
  await page.getByRole('heading',{name:'石磨盘',exact:true}).waitFor();
  await page.getByRole('button',{name:'资料',exact:true}).click();
  await page.getByRole('link',{name:'阅读馆方原文'}).waitFor();
  await page.screenshot({path:'artifacts/07-no-webgl.png',fullPage:true});
}finally{await disabled.close();}
const result={checks:['configured UI with mocked provider','retry after failure','no duplicate retry message','current object included','sound toggle','390px viewport','WebGL-disabled fallback','fallback source access','optional WebMCP contract via stub (not a supported browser integration)'],errors};
await writeFile('artifacts/edge-case-results.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
