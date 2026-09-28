import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const b=await chromium.launch({channel:'msedge',headless:true});
try{for(const [name,url] of [
 ['ewer','https://wzmuseum.cn/Art/Art_28/Art_28_3272.aspx'],
 ['grotto','https://lib.zafu.edu.cn/info/1148/4235.htm'],
 ['kiln','https://cpc.people.com.cn/n/2014/1224/c83083-26266077.html']
]){const p=await b.newPage({viewport:{width:1200,height:950}});try{await p.goto(url,{waitUntil:'domcontentloaded',timeout:18000});console.log(name,await p.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.naturalWidth>200).map(i=>({src:i.src,alt:i.alt,w:i.naturalWidth,h:i.naturalHeight})).slice(0,45)));await p.screenshot({path:`artifacts/reference-${name}.png`,fullPage:true});}catch(e){console.log(name,e.message);}await p.close();}}finally{await b.close();}
