import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialProgress, restoreProgress, transition } from '../src/state';
test('cannot grind before placing grain',()=>{const s=initialProgress();assert.deepEqual(transition(s,{type:'grind',amount:1}),s);});
test('full exploration, duplicate observations, replay and reset',()=>{
  let s=transition(initialProgress(),{type:'enter'});
  s=transition(s,{type:'view',id:'slab'});s=transition(s,{type:'view',id:'slab'});assert.equal(s.viewed.length,1);
  s=transition(s,{type:'place'});s=transition(s,{type:'grind',amount:.5});assert.equal(s.actions.includes('ground'),false);
  s=transition(s,{type:'grind',amount:.8});assert.equal(s.grinding,1);assert.deepEqual(s.actions,['placed','ground']);
  s=transition(s,{type:'replay'});assert.equal(s.grinding,0);assert.deepEqual(s.actions,['placed']);assert.equal(s.viewed.length,1);
  assert.deepEqual(transition(s,{type:'reset'}),initialProgress());
});
test('restore handles corrupt, old and inconsistent saved progress',()=>{
  for(const raw of ['bad','null','{"version":9}','{"version":1,"viewed":null,"actions":[]}'])assert.deepEqual(restoreProgress(raw),initialProgress());
  assert.deepEqual(restoreProgress(JSON.stringify({version:1,entered:true,viewed:['slab','slab','bad'],actions:['ground'],grinding:-1})),{version:1,entered:true,viewed:['slab'],actions:['ground','placed'],grinding:1});
  const s=transition(transition(initialProgress(),{type:'place'}),{type:'grind',amount:.4});assert.deepEqual(restoreProgress(JSON.stringify(s)),s);
});
test('nonfinite or negative grinding cannot damage progress',()=>{
  const s=transition(initialProgress(),{type:'place'});assert.equal(transition(s,{type:'grind',amount:NaN}).grinding,0);assert.equal(transition(s,{type:'grind',amount:-5}).grinding,0);
});
