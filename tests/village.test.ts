import {test} from 'node:test';
import assert from 'node:assert/strict';
import {objects,zones,sources,presetResult,scene} from '../src/content';
import {parseInput,buildMessages,answerChat,ChatError} from '../server/chat';
import {restoreProgress} from '../src/state';
import {placementPose} from '../src/placement';

test('village objects and sources resolve, including the original saved progress',()=>{
  for(const o of objects){assert.ok(zones.some(z=>z.id===o.zoneId));for(const id of o.sourceIds)assert.ok(sources.some(s=>s.id===id));}
  const old=restoreProgress(JSON.stringify({version:1,entered:true,viewed:['slab','grain','jar','fake'],actions:['placed'],grinding:.4}));
  assert.deepEqual(old.viewed,['slab','grain','jar']);assert.equal(old.grinding,.4);
});
test('placement starts and ends at the tray and transfers grain monotonically',()=>{
  const first=placementPose(0),last=placementPose(1);
  assert.equal(first.travel,0);assert.equal(first.amount,0);assert.equal(last.travel,0);assert.equal(last.lift,0);assert.equal(last.amount,1);
  let prior=0;for(let i=0;i<=100;i++){const p=placementPose(i/100);assert.ok(p.amount>=prior);assert.ok(p.travel>=0&&p.travel<=1);prior=p.amount;}
});
const request={sceneId:scene.id,zoneId:'cooking',objectId:'ding',actions:[],question:'陶鼎为什么有三只足？',history:[]};
test('new object prompt and citations use the matching cultural evidence',async()=>{
  const parsed=parseInput(request),prompt=buildMessages(parsed)[0].content;
  assert.match(prompt,/灶边炊煮/);assert.match(prompt,/河南博物院/);assert.doesNotMatch(prompt,/nmc-grinding-tools/);
  const result=await answerChat(parsed,{url:'',key:'',model:''});assert.deepEqual(result.sourceIds,['henan-ding']);assert.match(result.answer,/三/);
  const mock=(async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({answer:'三足给薪柴留出空间。',sourceIds:['henan-ding','nmc-grinding-tools','invented']})}}]}))) as typeof fetch;
  const live=await answerChat(parsed,{url:'https://example.com/chat',key:'test',model:'test'},mock);assert.deepEqual(live.sourceIds,['henan-ding']);
});
test('region mismatch fails and offline unknown questions do not borrow grinding answers',()=>{
  assert.throws(()=>parseInput({...request,zoneId:'grinding'}),ChatError);
  assert.throws(()=>parseInput({...request,zoneId:'unknown'}),ChatError);
  assert.match(presetResult('陶鼎怎样维修？','ding').answer,/尚未连接/);
  assert.deepEqual(presetResult('陶鼎怎样维修？','ding').sourceIds,[]);
  assert.deepEqual(presetResult(request.question,null,'cooking').sourceIds,['henan-ding']);
});
