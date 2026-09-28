import * as T from 'three';
import {fluteHoles} from './flute-demo';
export const bend=(x:number)=>.065*Math.sin(x*1.1)+.018*x;
export const radius=(x:number)=>.137*(1+.075*Math.sin(x*2.6)+.18*Math.pow(Math.abs(x)/2.3,8));

// Both walls share the same opening boundary. Unlike black discs over a solid
// cylinder, these openings let rays and light pass into the bore.
export function makeFluteGeometry(){
 const positions:number[]=[],uv:number[]=[],indices:number[]=[],nx=336,na=56,stride=na+1,layer=(nx+1)*stride;
 const opening=(x:number)=>{let gap=0;for(const h of fluteHoles){const dx=(x-h)/.071;if(Math.abs(dx)<1)gap=Math.max(gap,Math.asin(Math.sqrt(1-dx*dx)*.074/radius(x)));}return gap;};
 for(let side=0;side<2;side++)for(let i=0;i<=nx;i++){
  const x=-2.3+4.6*i/nx,r=radius(x)-(side?.032:0),gap=opening(x);
  for(let j=0;j<=na;j++){const a=gap+(Math.PI*2-gap*2)*j/na;positions.push(x,bend(x)+Math.cos(a)*r,Math.sin(a)*r*.89);uv.push(i/nx,j/na);}
 }
 for(let side=0;side<2;side++)for(let i=0;i<nx;i++)for(let j=0;j<na;j++){const a=side*layer+i*stride+j,b=a+stride;if(side)indices.push(a,a+1,b,b,a+1,b+1);else indices.push(a,b,a+1,b,b+1,a+1);}
 // Annular end faces and the seven hole rims join the outside to the bore.
 for(const row of [0,nx])for(let j=0;j<na;j++){const a=row*stride+j,b=a+layer;indices.push(a,a+1,b,b,a+1,b+1);}
 for(let i=0;i<nx;i++){const x=-2.3+4.6*(i+.5)/nx;if(!opening(x))continue;for(const col of [0,na]){const a=i*stride+col,b=a+stride;indices.push(a,a+layer,b,b,a+layer,b+layer);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.addGroup(0,nx*na*6,0);g.addGroup(nx*na*6,nx*na*6,1);g.addGroup(nx*na*12,indices.length-nx*na*12,0);g.computeVertexNormals();return g;
}
