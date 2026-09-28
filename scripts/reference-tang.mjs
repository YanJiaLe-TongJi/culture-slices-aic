import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{for(const [name,url] of [
 ['tea','https://www.gdwsw.gov.cn/dt/content/post_28540.html'],
 ['plough','http://www.agriculturalmuseum.com/detail/zh/31.html'],
 ['print','https://idp.bl.uk/blog/the-diamond-sutra-on-display-text-panel-2/'],
 ['court','https://www.sxdaily.com.cn/2024-08/08/content_10805556.html']
]){const p=await browser.newPage({viewport:{width:1200,height:950}});try{await p.goto(url,{waitUntil:'domcontentloaded',timeout:25000});await p.waitForTimeout(2000);console.log(name,await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.naturalWidth>200&&i.naturalHeight>170).map(i=>({src:i.src,w:i.naturalWidth,h:i.naturalHeight,alt:i.alt})).slice(0,24)));await p.screenshot({path:`artifacts/reference-tang-${name}.png`,fullPage:true});}catch(e){console.log(name,e.message);}await p.close();}}finally{await browser.close();}
