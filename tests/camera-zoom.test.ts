import {test} from 'node:test';
import assert from 'node:assert/strict';
import {OrthographicCamera,Vector3} from 'three';
import {recenterOnZoomOut} from '../src/camera-zoom';

test('wheel zoom-out reaches the overview center while preserving the viewing direction',()=>{
  const camera=new OrthographicCamera(),target=new Vector3(7,2,-4),center=[0,.6,-1.4];
  const direction=new Vector3(8,9,12);
  camera.position.copy(target).add(direction);
  let previous=150;
  for(const zoom of [120,90,60,30,19,13]){
    camera.zoom=zoom;
    recenterOnZoomOut(camera,target,center,previous,20);
    assert.ok(camera.position.clone().sub(target).distanceTo(direction)<1e-10);
    previous=zoom;
  }
  assert.ok(target.distanceTo(new Vector3(...center))<1e-10);
});

test('zooming in and rotating at the same zoom keep the chosen center',()=>{
  const camera=new OrthographicCamera(),target=new Vector3(7,2,-4),original=target.clone();
  camera.position.set(15,11,8);
  const position=camera.position.clone();
  for(const zoom of [100,120]){
    camera.zoom=zoom;
    recenterOnZoomOut(camera,target,[0,0,0],100,20);
    assert.deepEqual(target,original);
    assert.deepEqual(camera.position,position);
  }
});

test('one large wheel step and many smaller steps produce the same frame',()=>{
  function move(zooms:number[]){
    const camera=new OrthographicCamera(),target=new Vector3(-12,1,3);
    camera.position.copy(target).add(new Vector3(8,9,12));
    let previous=160;
    for(const zoom of zooms){camera.zoom=zoom;recenterOnZoomOut(camera,target,[0,.65,0],previous,10);previous=zoom;}
    return target;
  }
  assert.ok(move([40]).distanceTo(move([140,120,100,80,60,40]))<1e-10);
});
