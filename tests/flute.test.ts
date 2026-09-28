import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {makeFluteGeometry} from '../src/flute-geometry';
import {fluteHoles,fluteNotes,flutePose} from '../src/flute-demo';
import {exhibits} from '../src/exhibits';
import {restoreExhibit} from '../src/exhibit-state';
import {parseInput,buildMessages} from '../server/chat';

test('seven flute openings pass through the upper wall, solid gaps remain intact',()=>{
 const geometry=makeFluteGeometry(),material=new T.MeshBasicMaterial({side:T.DoubleSide}),mesh=new T.Mesh(geometry,[material,material]);mesh.updateMatrixWorld();
 try{
  for(const x of fluteHoles){const hits=new T.Raycaster(new T.Vector3(x,1,0),new T.Vector3(0,-1,0)).intersectObject(mesh);assert.ok(hits.length);const axis=.065*Math.sin(x*1.1)+.018*x;assert.ok(hits[0].point.y<axis,`hole ${x} is capped`);}
  for(const x of [-1.7,-1.1,.15,1.5]){const hits=new T.Raycaster(new T.Vector3(x,1,0),new T.Vector3(0,-1,0)).intersectObject(mesh);const axis=.065*Math.sin(x*1.1)+.018*x;assert.ok(hits[0].point.y>axis+.08,`wall at ${x} is missing`);}
  assert.equal(geometry.groups.length,3);
 }finally{geometry.dispose();material.dispose();}
});
test('flute note order and visual hole patterns share one timing definition',()=>{
 assert.deepEqual(fluteNotes(2).map(e=>e.note),[0,1,0]);
 for(const index of [0,1,2])for(const event of fluteNotes(index)){const p=flutePose(index,event.at+.05);assert.equal(p.note,event.note);assert.equal(p.covered,event.note?2:5);assert.equal(p.sounding,true);}
 assert.equal(flutePose(0,1.5).sounding,false);
});
test('expanded flute scenery preserves old progress without inventing archaeological context',()=>{
 const s=exhibits.find(e=>e.kind==='flute')!,old={version:1,entered:true,viewed:['flute','tube','holes'],actions:['low','high','listen']};
 assert.deepEqual(restoreExhibit(s,JSON.stringify(old)),old);
 for(const id of ['shore','shelter']){const input=parseInput({sceneId:s.id,objectId:id,zoneId:null,actions:old.actions,question:'这里是出土地点吗？',history:[]}),prompt=buildMessages(input)[0].content;assert.ok(prompt.includes(s.objects.find(o=>o.id===id)!.name));assert.ok(prompt.includes('不还原骨笛出土位置'));}
});
