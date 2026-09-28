import {test} from 'node:test';
import assert from 'node:assert/strict';
import {eras,scenes} from '../src/catalog';
import {parseRoute} from '../src/routes';
import {resolveTarget} from '../src/interaction';
import {createPlacementClock} from '../src/placement';

test('nine eras expose three slots each, all nine eras are fully playable',()=>{
  assert.equal(eras.length,9);assert.equal(scenes.length,27);
  for(const era of eras){assert.equal(era.sceneIds.length,3);for(const id of era.sceneIds)assert.equal(scenes.find(s=>s.id===id)?.eraId,era.id);}
  assert.equal(scenes.filter(s=>s.status==='ready').length,27);
  for(const era of eras)assert.equal(scenes.filter(s=>s.eraId===era.id&&s.status==='ready').length,3);
});
test('hash routes resolve direct entries and reject planned or unknown scenes',()=>{
  assert.deepEqual(parseRoute(''),{kind:'era',id:'prehistory'});
  for(const era of eras)assert.deepEqual(parseRoute(`#/era/${era.id}`),{kind:'era',id:era.id});
  assert.deepEqual(parseRoute('#/scene/peiligang-grain'),{kind:'scene',id:'peiligang-grain'});
  for(const scene of scenes.filter(s=>s.status==='ready'))assert.deepEqual(parseRoute(`#/scene/${scene.id}`),{kind:'scene',id:scene.id});
  for(const scene of scenes.filter(s=>s.status==='planned'))assert.deepEqual(parseRoute(`#/scene/${scene.id}`),{kind:'not-found'});
  for(const hash of ['#/scene/unknown','#/era/unknown','#/scene/peiligang-grain/extra','#/%ZZ'])assert.deepEqual(parseRoute(hash),{kind:'not-found'});
});
test('hover target follows the visible level and respects objects in other regions',()=>{
  assert.equal(resolveTarget('slab',null),'grinding');assert.equal(resolveTarget('slab','grinding'),'slab');
  assert.equal(resolveTarget('ding','grinding'),'cooking');assert.equal(resolveTarget('dwelling','dwelling'),'dwelling');
});
test('placement emits only lifecycle changes and cancels all future completion',()=>{
  let completed=0;const states:boolean[]=[];const c=createPlacementClock(()=>completed++,x=>states.push(x));
  c.start();c.start();for(let i=0;i<100;i++)c.advance(.01);assert.deepEqual(states,[true]);assert.equal(completed,0);
  c.cancel();c.advance(10);c.finish();assert.equal(completed,0);assert.equal(c.time,-1);
  c.start();c.advance(3);c.advance(3);c.finish();assert.equal(completed,1);assert.deepEqual(states,[true,false,true,false]);
  c.start();c.cancel(false);c.advance(3);assert.equal(completed,1);
});
