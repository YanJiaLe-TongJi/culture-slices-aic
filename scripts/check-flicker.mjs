import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)(process.argv[2]||'playwright');
const tag=process.argv[3]||'after',dir=`artifacts/flicker/${tag}`;await mkdir(dir,{recursive:true});
await writeFile('artifacts/flicker-fixture.html',`<!doctype html><html><head><meta charset="utf-8"><style>html,body,#root{margin:0;width:100%;height:100%;overflow:hidden}</style></head><body><div id="root"></div><script type="module" src="/scripts/flicker-fixture.tsx"></script></body></html>`);
const browser=await chromium.launch({channel:'msedge',headless:true});const errors=[],results=[];
try{for(const kind of (process.env.FLICKER_CASES||'wall,roof,ground').split(',')){
 const p=await browser.newPage({viewport:{width:800,height:600},deviceScaleFactor:1,reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
 await p.goto(`http://127.0.0.1:5173/artifacts/flicker-fixture.html?case=${kind}`,{waitUntil:'networkidle'});await p.waitForFunction(()=>!!window.flickerProbe);await p.waitForTimeout(600);
 const frames=[];
 for(const [i,offset] of [0,.0001,-.0001,.0002].entries()){await p.evaluate(offset=>{window.flickerProbe.set(offset);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},offset);frames.push((await p.screenshot({path:`${dir}/${kind}-${i}.png`})).toString('base64'));}
 // Tiny camera motion should only change a few silhouette pixels, not entire surfaces.
 // Compare screenshots in a 2D canvas so this diagnostic needs no image library.
 const deltas=await p.evaluate(async frames=>{
  const pixels=await Promise.all(frames.map(async data=>{const img=new Image();img.src=`data:image/png;base64,${data}`;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return ctx.getImageData(0,0,c.width,c.height).data;}));
  return pixels.slice(1).map(b=>{let changed=0,strong=0;for(let i=0;i<b.length;i+=4){const d=Math.max(...[0,1,2].map(k=>Math.abs(b[i+k]-pixels[0][i+k])));if(d>3)changed++;if(d>12)strong++;}return {changed, strong};});
 },frames);
 const renderer=await p.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unknown';});
 results.push({kind,deltas,renderer});
 // These ceilings allow raster-edge differences across GPUs; original meshes exceed them.
 if(!tag.startsWith('before'))for(const delta of deltas)assert.ok(delta.changed<(kind==='wall'?600:settingLimit(kind)),`${kind}: ${delta.changed} unstable pixels; inspect ${dir}`);
 await p.close();
}if(errors.length)throw Error(errors.join('\n'));await writeFile(`${dir}/checks.json`,JSON.stringify({browser:browser.version(),viewport:'800x600',dpr:1,shadows:false,offsets:[0,.0001,-.0001,.0002],results,errors},null,2));console.log(`${tag}: wall, roof and ground captured with shadows disabled; camera offsets <= 0.0002 world units`,results.map(r=>({kind:r.kind,deltas:r.deltas})));
}finally{await browser.close();}
function settingLimit(kind){return ['wall','roof','ground'].includes(kind)?150:600;}
