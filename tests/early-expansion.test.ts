import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exhibits} from '../src/exhibits';
import {earlyLayouts} from '../src/early-layouts';
import {inFootprint} from '../src/site-footprints';
import {buildMessages,parseInput} from '../server/chat';
import {restoreExhibit} from '../src/exhibit-state';
import {restoreProgress} from '../src/state';
import {objects} from '../src/content';
import {parseRiverEdition} from '../src/river-editions';

test('expanded regions resolve to their own evidence without changing legacy actions',()=>{
 for(const s of exhibits.filter(s=>['prehistory','pre-qin','qin-han'].includes(s.eraId))){
  const regions=s.objects.filter(o=>o.kind==='生活空间 · 教学演绎');assert.equal(regions.length,2);
  const legacy={version:1,entered:true,viewed:s.objects.slice(0,3).map(o=>o.id),actions:s.steps.map(a=>a.id)};
  assert.deepEqual(restoreExhibit(s,JSON.stringify(legacy)),legacy);
  for(const o of regions){
   const input=parseInput({sceneId:s.id,objectId:o.id,zoneId:null,actions:legacy.actions,question:'这里是发掘原貌吗？',history:[]});
   const prompt=buildMessages(input)[0].content;assert.ok(prompt.includes(o.name));assert.ok(prompt.includes(o.detail));
   assert.ok(o.sourceIds.every(id=>s.sources.some(x=>x.id===id)));
   assert.ok(inFootprint(o.position[0],o.position[2],earlyLayouts[s.kind as keyof typeof earlyLayouts].outline));
  }
 }
});
test('larger village retains grinding progress and adds contextual regions',()=>{
 const raw={version:1,entered:true,viewed:['slab','roller','grain'],actions:['placed','ground'],grinding:1};
 assert.deepEqual(restoreProgress(JSON.stringify(raw)),raw);
 for(const id of ['houses','harvest']){const o=objects.find(o=>o.id===id)!;assert.ok(o);const input=parseInput({sceneId:'peiligang-grain',objectId:id,zoneId:o.zoneId,actions:raw.actions,question:'这是什么？',history:[]});assert.ok(buildMessages(input)[0].content.includes(o.detail));}
});
test('river opens expanded by default while explicit comparison links remain usable',()=>{
 assert.equal(parseRiverEdition(null),'expanded');assert.equal(parseRiverEdition('unknown'),'expanded');assert.equal(parseRiverEdition('expanded'),'expanded');assert.equal(parseRiverEdition('detailed'),'detailed');
});
