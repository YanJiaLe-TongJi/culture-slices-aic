import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bellNotes,bellStrike} from '../src/bell-demo';
import {exhibits} from '../src/exhibits';
import {restoreExhibit} from '../src/exhibit-state';
import {exhibitPreset} from '../src/exhibits';
import {parseInput,buildMessages} from '../server/chat';

test('bell strikes reach each contact point when its note is scheduled',()=>{
 assert.deepEqual(bellNotes(2).map(e=>e.note),[0,1,0]);
 for(const index of [0,1,2])for(const e of bellNotes(index)){
  assert.deepEqual(bellStrike(index,e.at),{note:e.note,amount:1});
  assert.ok(bellStrike(index,e.at-.1).amount>0);
  assert.equal(bellStrike(index,e.at+.4).amount,0);
 }
});
test('expanded pre-Qin courts retain legacy progress and ground new scenery in scene context',()=>{
 for(const s of exhibits.filter(s=>s.id.startsWith('pre-qin-'))){
  const legacy={version:1,entered:true,viewed:s.objects.slice(0,3).map(o=>o.id),actions:s.steps.map(a=>a.id)};
  const restored=restoreExhibit(s,JSON.stringify(legacy));assert.deepEqual(restored,legacy);
  for(const o of s.objects.slice(3)){
   assert.ok(!restored.viewed.includes(o.id));
   const input=parseInput({sceneId:s.id,objectId:o.id,zoneId:null,actions:legacy.actions,question:'这是出土原貌吗？',history:[]});
   const prompt=buildMessages(input)[0].content;assert.ok(prompt.includes(o.name));assert.ok(prompt.includes(s.interpretation));
  }
 }
});


test('building explanations cite their own architectural evidence instead of the featured artifact',()=>{
 const cases=[['pre-qin-living','setting','zhouyuan-courtyard'],['pre-qin-making','store','pku-guoyuanzui-workshop'],['pre-qin-culture','gallery','hubei-longwan-terrace']];
 for(const [id,objectId,sourceId] of cases){const s=exhibits.find(s=>s.id===id)!;
  const result=exhibitPreset(s,'这是什么？',objectId);assert.ok(result.sourceIds.includes(sourceId));assert.ok(!result.sourceIds.includes(s.sources[0].id));
  const input=parseInput({sceneId:id,objectId,zoneId:null,actions:[],question:'这里的房子是复原的吗？',history:[]});
  const prompt=buildMessages(input)[0].content;assert.ok(prompt.includes(sourceId));assert.ok(prompt.includes(s.sources.find(x=>x.id===sourceId)!.facts[0]));assert.ok(prompt.includes('推定')||prompt.includes('演绎'));
 }
});
