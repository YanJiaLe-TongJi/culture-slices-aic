import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exhibits,exhibitPreset} from '../src/exhibits';
import {completeStep,createActionClock,exhibitKey,freshExhibit,restoreExhibit} from '../src/exhibit-state';
import {answerChat,buildMessages,parseInput,ChatError} from '../server/chat';
import {parseRoute} from '../src/routes';
for(const s of exhibits)test(`${s.subtitle}: sources, progression, restoration and isolated chat`,async()=>{
 assert.deepEqual(parseRoute(`#/scene/${s.id}`),{kind:'scene',id:s.id});
 assert.ok(s.objects.length>=3);assert.ok(s.steps.length>=3);
 for(const o of s.objects){assert.ok(o.sourceIds.length);for(const id of o.sourceIds)assert.ok(s.sources.some(x=>x.id===id));}
 let p=freshExhibit();assert.equal(completeStep(s,p,s.steps[1].id),p);
 for(const step of s.steps){assert.ok(s.objects.some(o=>o.id===step.objectId));p=completeStep(s,p,step.id);}
 assert.equal(p.actions.length,s.steps.length);assert.equal(completeStep(s,p,s.steps[0].id),p);
 assert.deepEqual(restoreExhibit(s,JSON.stringify(p)),p);
 assert.deepEqual(restoreExhibit(s,JSON.stringify({...p,actions:[s.steps[0].id,'foreign',s.steps[2].id]})).actions,[s.steps[0].id]);
 const request={sceneId:s.id,objectId:s.objects[0].id,zoneId:null,actions:p.actions,question:'这是什么？',history:[]};
 for(const patch of [{objectId:'slab'},{actions:['placed']},{actions:[s.steps[1].id]},{zoneId:'grinding'},{question:''}])assert.throws(()=>parseInput({...request,...patch}),ChatError);
 const input=parseInput(request),prompt=buildMessages(input)[0].content;assert.ok(prompt.includes(s.culture));assert.ok(prompt.includes(s.steps.at(-1)!.explanation));assert.ok(!prompt.includes('nmc-grinding-tools'));
 for(const q of s.qa){const result=exhibitPreset(s,q.question,null);assert.ok(result.answer.length);assert.ok(result.sourceIds.every(id=>s.sources.some(x=>x.id===id)));}
 const preset=await answerChat(input,{url:'',key:'',model:''});assert.equal(preset.mode,'preset');assert.ok(preset.answer.includes(s.objects[0].name));
 assert.deepEqual(exhibitPreset(s,'请编造未知的具体制作人',null).sourceIds,[]);
 const mock=(async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({answer:'回答示意',sourceIds:[s.sources[0].id,'nmc-grinding-tools','foreign']})}}]}))) as typeof fetch;
 const live=await answerChat(input,{url:'https://example.com/chat',key:'test',model:'test'},mock);assert.deepEqual(live.sourceIds,[s.sources[0].id]);
});
test('action clocks cancel without stale completion; scene storage never overlaps',()=>{
 const finished:string[]=[],states:boolean[]=[];const c=createActionClock(id=>finished.push(id),a=>states.push(a));
 c.start('a',0,2);c.start('b',1,2);for(let i=0;i<30;i++)c.advance(.01);assert.deepEqual(states,[true]);c.cancel();c.advance(3);c.finish();assert.deepEqual(finished,[]);
 c.start('b',1,1);c.advance(2);c.finish();assert.deepEqual(finished,['b']);c.start('c',2,1);c.cancel(false);c.advance(3);assert.deepEqual(finished,['b']);
 assert.equal(new Set(exhibits.map(s=>exhibitKey(s.id))).size,exhibits.length);
});

test('expanded pottery workshop preserves v0.4 progress and explains contextual scenery',()=>{
 const s=exhibits.find(s=>s.kind==='pottery')!;
 const legacy={version:1,entered:true,viewed:['basin','pigment','coils'],actions:['shape','paint','compare']};
 const restored=restoreExhibit(s,JSON.stringify(legacy));assert.deepEqual(restored,legacy);
 for(const id of ['shelter','drying']){
  assert.ok(!restored.viewed.includes(id));
  const input=parseInput({sceneId:s.id,objectId:id,zoneId:null,actions:legacy.actions,question:'这是出土原貌吗？',history:[]});
  const prompt=buildMessages(input)[0].content;
  assert.ok(prompt.includes(s.objects.find(o=>o.id===id)!.name));
  assert.ok(prompt.includes('不对应某个出土工坊'));
 }
});
