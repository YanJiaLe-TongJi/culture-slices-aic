import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true}),errors=[];
await mkdir('artifacts',{recursive:true});
try {
  const p=await browser.newPage({viewport:{width:1440,height:1000}});
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:5173/?river=detailed#/scene/song-yuan-making',{waitUntil:'networkidle'});
  await p.getByRole('button',{name:'开始探索',exact:true}).click();
  await p.getByRole('button',{name:'收起手册',exact:true}).click();
  for (const [edition,label] of [['detailed','B · 精细版'],['expanded','A · 扩大版']]) {
    await p.getByRole('button',{name:label,exact:true}).click();await p.mouse.move(8,8);await p.waitForTimeout(1800);
    assert.equal(await p.locator('.world').getAttribute('data-river-edition'),edition);
    assert.equal(await p.getByRole('tooltip').count(),0);
    await p.screenshot({path:`artifacts/river-${edition}-overview.png`});
    await p.locator('canvas').screenshot({path:`artifacts/river-${edition}-cover.png`});
    for(const [id,name] of [['bridge','贯木拱与桥面'],['boat','河道里的运输船'],['market','桥头敞棚与街铺']]) {
      await p.locator('.object-switcher').getByRole('button',{name:new RegExp(name)}).click();await p.mouse.move(8,8);await p.waitForTimeout(1200);
      await p.screenshot({path:`artifacts/river-${edition}-${id}.png`});
    }
    await p.getByRole('button',{name:'收起手册',exact:true}).click();
  }
  assert.deepEqual(errors,[]);
  await writeFile('artifacts/river-comparison-preview.json',JSON.stringify({errors,variants:2},null,2));
  console.log('Both river editions and six close views rendered without page errors.');
} finally {await browser.close();}
