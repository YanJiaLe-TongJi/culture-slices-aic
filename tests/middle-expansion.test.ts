import {test} from 'node:test';
import assert from 'node:assert/strict';
import {exhibits} from '../src/exhibits';
import {restoreExhibit} from '../src/exhibit-state';
import {buildMessages,parseInput} from '../server/chat';
import {middleLayout} from '../src/middle-layouts';
import {inFootprint} from '../src/site-footprints';

test('next nine scenes retain v1 progress and include new spatial evidence in AI context',()=>{
 const scenes=exhibits.filter(s=>['wei-jin','sui-tang','song-yuan'].includes(s.eraId));assert.equal(scenes.length,9);
 for(const scene of scenes){
  const legacy={version:1,entered:true,viewed:scene.objects.slice(0,5).map(o=>o.id),actions:scene.steps.map(s=>s.id)};
  const restored=restoreExhibit(scene,JSON.stringify(legacy));assert.deepEqual(restored,legacy);
  const additions=scene.objects.slice(5);assert.equal(additions.length,2);
  for(const obj of additions){
   assert.ok(!restored.viewed.includes(obj.id));
   const input=parseInput({sceneId:scene.id,objectId:obj.id,actions:restored.actions,question:'这里的房屋是原貌吗？',history:[]});
   const prompt=buildMessages(input)[0].content;
   assert.ok(prompt.includes(obj.name)&&prompt.includes(obj.detail));
   for(const id of obj.sourceIds)assert.ok(scene.sources.some(s=>s.id===id));
   const layout=middleLayout(scene.kind);if(layout)assert.ok(inFootprint(obj.position[0],obj.position[2],layout.outline),`${scene.kind}/${obj.id} outside its site`);
  }
 }
});
