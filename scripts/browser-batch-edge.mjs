import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {exhibits} from '../src/exhibits.ts';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const batch=exhibits.filter(s=>s.eraId===(process.env.ERA_ID||'wei-jin')),base=process.env.BASE_URL||'http://127.0.0.1:5173',checks=[],errors=[];
for(const fallback of [false,true]){
 const b=await chromium.launch({channel:'msedge',headless:true,args:fallback?['--disable-webgl']:[]});
 try{for(const s of batch){
  const p=await b.newPage({viewport:fallback?{width:390,height:844}:{width:1440,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`${base}/#/scene/${s.id}`,{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();
  if(fallback)await p.getByRole('heading',{name:'三维场景暂时无法显示',exact:true}).waitFor();
  const button=p.locator('.object-switcher button').first();await button.focus();await p.keyboard.press('Enter');await p.getByRole('heading',{name:s.objects[0].name,exact:true}).waitFor();
  for(const a of s.steps)await p.getByRole('button',{name:a.label,exact:true}).click();
  await p.getByRole('dialog').waitFor();await p.getByRole('button',{name:'关闭探索回顾',exact:true}).click();
  const state=await p.evaluate(id=>JSON.parse(localStorage.getItem(`culture-slice:exhibit:${id}:v1`)),s.id);assert.deepEqual(state.actions,s.steps.map(a=>a.id));
  await p.getByRole('button',{name:'资料',exact:true}).click();await p.getByRole('link',{name:'阅读原始资料',exact:false}).first().waitFor();assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.getByRole('link',{name:'返回时间轴',exact:false}).click();assert.equal(await p.locator('canvas').count(),0);checks.push({id:s.id,fallback,reducedMotion:true,keyboard:true,sources:true});await p.close();
 }}finally{await b.close();}
}
assert.deepEqual(errors,[]);await writeFile(`artifacts/${process.env.ERA_ID||'wei-jin'}-edge-results.json`,JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
