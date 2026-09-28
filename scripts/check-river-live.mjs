import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:5173';
const results=[];
for(const [objectId,actions,question] of [
  ['mast',['structure','mast'],'刚才为什么要把它放倒？这座桥能打开让船过去吗？'],
  ['market',[],'这座两层酒楼是哪年建成的，叫什么名字？'],
]){
  const r=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sceneId:'song-yuan-making',presentation:'detailed',objectId,actions,question,history:[]})});
  const data=await r.json();assert.equal(r.status,200);assert.equal(data.mode,'live');assert.ok(!data.answer.includes('\uFFFD'));assert.ok(data.answer.length>10);assert.ok(data.sourceIds.every(id=>['dpm-qingming-song','dpm-rainbow-bridge'].includes(id)));results.push({question,...data});
}
const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[];
try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/?river=detailed#/scene/song-yuan-making',{waitUntil:'networkidle'});await p.getByRole('button',{name:'开始探索',exact:true}).click();
 await p.locator('.object-switcher').getByRole('button',{name:/贯木拱/}).click();
 await p.locator('.panel-tabs').getByRole('button',{name:'问一问',exact:true}).click();
 await p.getByText('DeepSeek 已接入 · 结合当前器物回答',{exact:true}).waitFor();
 await p.getByRole('textbox',{name:'你的问题',exact:true}).fill('眼前这座是石拱桥吗？');
 await p.getByRole('button',{name:'发送问题',exact:true}).click();await p.locator('.message.assistant').waitFor({timeout:35000});
 const answer=await p.locator('.message.assistant').innerText();assert.ok(!answer.includes('\uFFFD'));assert.ok(answer.includes('木'));assert.ok(await p.locator('.message.assistant a').count());
 await p.screenshot({path:'artifacts/river-deepseek-live.png'});
 results.push({browserAnswer:answer});assert.deepEqual(errors,[]);
 await writeFile('artifacts/river-live-answers.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));
}finally{await browser.close();}
