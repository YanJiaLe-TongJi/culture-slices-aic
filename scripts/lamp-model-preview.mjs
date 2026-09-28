import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:5173/#/scene/qin-han-living',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'开始探索',exact:true}).click();
 await page.locator('.object-switcher button').first().click();
 await page.waitForTimeout(1600);
 await page.screenshot({path:'artifacts/lamp-sculpture-detail.png'});
 await page.getByRole('button',{name:'点亮灯火',exact:true}).click();
 await page.getByRole('button',{name:'转动灯罩，比较明暗',exact:true}).click();
 const slider=page.getByRole('slider',{name:'灯罩开口',exact:true});
 await slider.waitFor();await slider.focus();
 for(const [key,name] of [['End','open'],['Home','closed']]){
  await page.keyboard.press(key);await page.waitForTimeout(350);
  await page.screenshot({path:`artifacts/lamp-shade-${name}.png`});
 }
 await page.keyboard.press('End');
 await page.locator('.object-switcher button').first().click();
 await page.getByRole('button',{name:'收起手册',exact:true}).click();
 await page.waitForTimeout(1300);
 await page.screenshot({path:'artifacts/lamp-sculpture-inspect.png'});
 for(const [x,name] of [[1110,'left'],[530,'right']]){
  await page.mouse.move(840,620);await page.mouse.down();
  await page.mouse.move(x,620,{steps:24});await page.mouse.up();
  await page.mouse.move(10,10);await page.waitForTimeout(500);
  await page.screenshot({path:`artifacts/lamp-sculpture-${name}.png`});
 }
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('Captured lamp front, rotated views and both shade limits; no page errors');
}finally{await browser.close();}
