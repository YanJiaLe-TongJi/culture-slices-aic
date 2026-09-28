import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const b=await chromium.launch({channel:'msedge',headless:true});
try{for(const [name,url] of [
 ['tea','https://www.news.cn/politics/2022-05/21/1128671163_16530964893071n.jpg'],
 ['plough','https://www.ciae.com.cn/Uploads/Picture/2017/11/16/s5a0d25461db57.jpg']
]){const p=await b.newPage({viewport:{width:1200,height:950}});await p.goto(url,{waitUntil:'load',timeout:20000});await p.locator('img').first().screenshot({path:`artifacts/reference-tang-${name}-object.png`});console.log(name);await p.close();}}finally{await b.close();}
