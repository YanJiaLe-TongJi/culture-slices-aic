// Run against the dev server; optionally pass the shared Playwright module path.
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[];
const base=process.env.BASE_URL||'http://127.0.0.1:5173';
await mkdir('artifacts',{recursive:true});
async function frame(page){
  return page.evaluate(async()=>{
    const url=performance.getEntriesByType('resource').find(e=>e.name.includes('/@react-three_fiber.js'))?.name;
    if(!url)throw new Error('Camera inspection requires the Vite dev server');
    const {_roots}=await import(url),root=_roots.get(document.querySelector('canvas'));
    const {camera}=root.store.getState();
    let controls;
    function visit(fiber){
      if(!fiber||controls)return;
      const object=fiber.stateNode?.object;
      if(object?.target&&object?.object===camera&&object?.update)controls=object;
      visit(fiber.child);visit(fiber.sibling);
    }
    visit(root.fiber.current);
    if(!controls)throw new Error('OrbitControls not found');
    return {zoom:camera.zoom,target:controls.target.toArray(),minZoom:controls.minZoom};
  });
}
try{
  for(const [id,object,village] of [['prehistory-making',0,false],['song-yuan-making',1,false],['new-era-making',0,false],['peiligang-grain',0,true]]){
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/#/scene/${id}`,{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'开始探索',exact:true}).click();
    await page.waitForTimeout(1800);
    const overview=await frame(page);
    if(village){await page.locator('.zone-switcher button').first().click();await page.waitForTimeout(1400);}
    await page.locator('.object-switcher button').nth(object).click();
    await page.waitForTimeout(1800);
    const detail=await frame(page);
    assert.ok(detail.zoom>overview.zoom*1.2,`${id}: selection should zoom in`);
    await page.screenshot({path:`artifacts/zoom-${id}-detail.png`});
    const rect=await page.locator('canvas').boundingBox();
    await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.6);
    for(let n=0;n<65;n++){await page.mouse.wheel(0,180);await page.waitForTimeout(30);}
    await page.waitForTimeout(500);
    const wide=await frame(page);
    assert.ok(wide.zoom<=overview.zoom,`${id}: wheel must reach overview zoom`);
    assert.ok(Math.hypot(...wide.target.map((v,i)=>v-overview.target[i]))<.03,`${id}: overview must be centered`);
    await page.screenshot({path:`artifacts/zoom-${id}-overview.png`});
    await page.mouse.wheel(0,-180);await page.waitForTimeout(300);
    const closer=await frame(page);
    assert.ok(closer.zoom>wide.zoom,`${id}: zoom in remains usable`);
    console.log(JSON.stringify({id,overview,detail,wide}));
    await page.close();
  }
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
