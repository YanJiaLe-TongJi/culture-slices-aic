import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const results=[];
for(const [sceneId,objectId,question,expected] of [
 ['new-era-living','power','这列车是不是只有车头有动力？','crrc-fuxing'],
 ['new-era-making','airlock','航天员可以从这里走出空间站吗？','cmse-tiangong'],
 ['new-era-culture','practice-wall','眼前这个图案就是敦煌某个洞窟的原始壁画吗？','dha-capture'],
]){
 const response=await fetch('http://127.0.0.1:5173/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sceneId,objectId,question,actions:[],history:[]}),signal:AbortSignal.timeout(40000)});
 const data=await response.json();assert.equal(response.status,200);assert.equal(data.mode,'live');assert.ok(data.sourceIds.includes(expected));assert.ok(data.answer.length>10&&!data.answer.includes('\uFFFD'));
 results.push({sceneId,objectId,question,...data});
}
await writeFile('artifacts/new-era/deepseek-live.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
