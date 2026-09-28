import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exhibits,exhibitPreset} from '../src/exhibits';
import {restoreExhibit} from '../src/exhibit-state';
import {parseInput,buildMessages} from '../server/chat';

test('Qin-Han refinements retain completed legacy actions and put architecture evidence into chat',()=>{
 for(const s of exhibits.filter(s=>s.eraId==='qin-han')){
  const legacy={version:1,entered:true,viewed:s.objects.slice(0,3).map(o=>o.id),actions:s.steps.map(a=>a.id)};
  assert.deepEqual(restoreExhibit(s,JSON.stringify(legacy)),legacy);
  for(const o of s.objects.slice(3)){
   const result=exhibitPreset(s,'这是什么？',o.id);assert.deepEqual(result.sourceIds,o.sourceIds);
   const input=parseInput({sceneId:s.id,objectId:o.id,zoneId:null,actions:legacy.actions,question:'这是原样复原的吗？',history:[]});
   const prompt=buildMessages(input)[0].content;assert.ok(prompt.includes(s.interpretation));assert.ok(prompt.includes(o.detail));
   for(const id of o.sourceIds)assert.ok(prompt.includes(s.sources.find(source=>source.id===id)!.facts[0]));
  }
 }
 const s=exhibits.find(s=>s.kind==='slips')!;
 assert.match(exhibitPreset(s,'这是什么？','well').answer,/不是专门存档/);
 assert.ok(exhibitPreset(s,'这是什么？','office').sourceIds.includes('hunan-liye-city'));
});
