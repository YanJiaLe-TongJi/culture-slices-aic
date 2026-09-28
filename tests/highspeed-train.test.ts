import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {BODY_PROFILE,TRAIN_CARS,TRAIN_GAP,TRAIN_LENGTH,TRAIN_TRAVEL,carGeometry,windshieldGeometry} from '../src/highspeed-train-geometry';
import {getExhibit} from '../src/exhibits';
import {restoreExhibit} from '../src/exhibit-state';
import {parseInput,buildMessages} from '../server/chat';

test('six connected cars have opposing cab ends and fit the track even after departure',()=>{
 assert.equal(TRAIN_CARS.length,6);
 assert.deepEqual(TRAIN_CARS.filter(c=>c.cab).map(c=>[c.number,c.reverse]),[[1,true],[6,false]]);
 assert.equal(TRAIN_CARS.filter(c=>!c.cab).length,4);
 for(let i=0;i<5;i++){
  const a=TRAIN_CARS[i],b=TRAIN_CARS[i+1];
  assert.ok(Math.abs(b.center-b.length/2-(a.center+a.length/2)-TRAIN_GAP)<1e-8);
 }
 assert.ok(-TRAIN_LENGTH/2>-25.3);
 assert.ok(TRAIN_LENGTH/2+TRAIN_TRAVEL<27.6);
});

test('cab and coach mating sections share exact width, roof, skirt and outward surfaces',()=>{
 const coach=carGeometry(false),cab=carGeometry(true);
 try{
  const a=coach.getAttribute('position'),b=cab.getAttribute('position');
  for(let i=0;i<BODY_PROFILE.length;i++){
   assert.equal(a.getY(i),b.getY(i));assert.equal(a.getZ(i),b.getZ(i));
  }
  for(const geom of [cab,coach]){
   const mesh=new T.Mesh(geom,new T.MeshBasicMaterial());mesh.updateMatrixWorld();
   const side=new T.Raycaster(new T.Vector3(-2,1.8,3),new T.Vector3(0,0,-1)).intersectObject(mesh);
   assert.ok(side.length>0);assert.ok(Math.abs(side[0].point.z-.78)<1e-6);
   mesh.material.dispose();
  }
 }finally{coach.dispose();cab.dispose();}
});

test('windshield hugs actual cab triangles instead of floating above the nose',()=>{
 const hull=carGeometry(true),glass=windshieldGeometry(),material=new T.MeshBasicMaterial(),mesh=new T.Mesh(hull,material);
 mesh.updateMatrixWorld();const p=glass.getAttribute('position');
 try{for(let i=0;i<p.count;i++){
  const ray=new T.Raycaster(new T.Vector3(p.getX(i),4,p.getZ(i)),new T.Vector3(0,-1,0)),hits=ray.intersectObject(mesh);
  assert.ok(hits.length>0);const gap=p.getY(i)-hits[0].point.y;
  assert.ok(gap>0&&gap<.04,`glass-to-body separation ${gap}`);
 }}finally{hull.dispose();glass.dispose();material.dispose();}
});

test('six-car content preserves existing progress and separates display consist from specifications',()=>{
 const scene=getExhibit('new-era-living')!,legacy={version:1,entered:true,viewed:['train','bogie'],actions:['airflow','power-up','depart']};
 assert.deepEqual(restoreExhibit(scene,JSON.stringify(legacy)),legacy);
 assert.ok(scene.objects.some(o=>o.id==='tail'));
 const input=parseInput({sceneId:scene.id,objectId:'tail',actions:legacy.actions,question:'这里为什么是六节？',history:[]});
 const prompt=buildMessages(input)[0].content;
 assert.match(prompt,/六节/);assert.match(prompt,/8.*16.*17/);
 assert.ok(!prompt.includes('仅截取车头与相邻客车'));
});
