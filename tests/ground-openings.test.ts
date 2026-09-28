import {test} from 'node:test';
import assert from 'node:assert/strict';
import {subtractOpening,type Rect} from '../src/ground-openings';
const area=(r:Rect)=>Math.max(0,r.x1-r.x0)*Math.max(0,r.z1-r.z0);
const intersection=(a:Rect,b:Rect):Rect=>({x0:Math.max(a.x0,b.x0),x1:Math.min(a.x1,b.x1),z0:Math.max(a.z0,b.z0),z1:Math.min(a.z1,b.z1)});
test('well opening clips boundary tiles without overlaps, overhang or lost ground',()=>{
 const hole={x0:6.03,x1:7.37,z0:-.22,z1:1.12};
 for(let x=5.6;x<7.9;x+=.28)for(let z=-.56;z<1.7;z+=.28){
  const cell={x0:x,x1:x+.28,z0:z,z1:z+.28},parts=subtractOpening(cell,hole);
  assert.ok(Math.abs(parts.reduce((a,r)=>a+area(r),0)+area(intersection(cell,hole))-area(cell))<1e-9);
  for(const [i,r] of parts.entries()){
   assert.equal(area(intersection(r,hole)),0);
   assert.ok(Math.abs(area(intersection(r,cell))-area(r))<1e-9);
   for(const other of parts.slice(i+1))assert.equal(area(intersection(r,other)),0);
  }
 }
 assert.deepEqual(subtractOpening(hole,hole),[]);
 const adjacent={...hole,x0:hole.x1,x1:hole.x1+1};
 assert.deepEqual(subtractOpening(adjacent,hole),[adjacent]);
});
