import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const results=[];
for(const [sceneId,objectId,question,expected] of [
 ['modern-living','shared-kitchen','为什么这里有共用厨房？这是原街坊的原样复原吗？','yangpu-workers-home'],
 ['ming-qing-making','clay-room','眼前这个房间用来干什么？这就是乾隆御窑原来的布局吗？','dpm-jingdezhen-layout'],
]){
 const response=await fetch('http://127.0.0.1:5173/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sceneId,objectId,question,actions:[],history:[]}),signal:AbortSignal.timeout(40000)});
 const data=await response.json();assert.equal(response.status,200);assert.equal(data.mode,'live');assert.ok(data.sourceIds.includes(expected));assert.ok(data.answer.length>10&&!data.answer.includes('\uFFFD'));
 results.push({sceneId,objectId,question,...data});
}
await writeFile('artifacts/late-expanded/deepseek-live.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
