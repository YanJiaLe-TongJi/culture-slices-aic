import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const p=await browser.newPage({viewport:{width:1600,height:1050}});
 await p.goto('https://minghuaji.dpm.org.cn/paint/appreciate?id=592d80e225aac624977fee2e19452c1f',{waitUntil:'domcontentloaded',timeout:30000});await p.waitForTimeout(3000);
 await p.getByText('我已阅读并同意本声明',{exact:true}).click();await p.waitForTimeout(3500);await p.screenshot({path:'artifacts/reference-song-qingming-viewer.png'});
 console.log(await p.locator('body').innerText());console.log(await p.locator('canvas').count());await p.close();
}finally{await browser.close();}
