import * as T from 'three';

export const TRAIN_GAP=.23;
export const TRAIN_TRAVEL=3.2;
export const TRAIN_Z=2.55;
export const TRAIN_LENGTH=2*8.4+4*6.4+5*TRAIN_GAP;
export const TRAIN_CARS=Array.from({length:6},(_,i)=>{
 const length=i===0||i===5?8.4:6.4;
 const start=-TRAIN_LENGTH/2+(i===0?0:8.4+(i-1)*6.4+i*TRAIN_GAP);
 return {number:i+1,length,center:start+length/2,cab:i===0||i===5,reverse:i===0};
});
export const HEAD_X=TRAIN_CARS[5].center;
export const TAIL_X=TRAIN_CARS[0].center;
export const PANTO_X=TRAIN_CARS[3].center;

// One shared body profile: straight window walls, rounded shoulder/roof and lower skirt.
// Points run clockwise when viewed from the positive X end.
const right:[number,number][]=[[0,2.34],[.28,2.335],[.48,2.30],[.62,2.22],[.72,2.08],[.77,1.96],[.78,1.90],[.78,1.82],[.78,1.64],[.78,1.56],[.78,1.50],[.78,1.44],[.78,1.00],[.75,.90],[.68,.79],[.5,.72],[0,.70]];
export const BODY_PROFILE=[...right,...right.slice(1,-1).reverse().map(([z,y])=>[-z,y] as [number,number])];
type Section={x:number;w:number;h:number;cy:number};
const sections:Section[]=[
 {x:-4.2,w:1,h:1,cy:1.52},{x:.5,w:1,h:1,cy:1.52},
 {x:1.1,w:.98,h:.98,cy:1.52},{x:1.8,w:.93,h:.88,cy:1.49},
 {x:2.4,w:.81,h:.65,cy:1.39},{x:3.0,w:.65,h:.43,cy:1.23},
 {x:3.5,w:.47,h:.29,cy:1.15},{x:3.9,w:.28,h:.22,cy:1.15},
 {x:4.1,w:.14,h:.15,cy:1.15},{x:4.2,w:.001,h:.002,cy:1.15}
];
export function cabSection(x:number):Section{
 const next=sections.findIndex((s,i)=>i>0&&s.x>=x),i=next<0?sections.length-2:Math.max(0,next-1),a=sections[i],b=sections[i+1];
 const t=T.MathUtils.clamp((x-a.x)/(b.x-a.x),0,1);
 return {x,w:T.MathUtils.lerp(a.w,b.w,t),h:T.MathUtils.lerp(a.h,b.h,t),cy:T.MathUtils.lerp(a.cy,b.cy,t)};
}
export function carGeometry(cab:boolean){
 const rings=cab?sections:[{x:-3.2,w:1,h:1,cy:1.52},{x:3.2,w:1,h:1,cy:1.52}];
 const p:number[]=[],colors:number[]=[],index:number[]=[],n=BODY_PROFILE.length;
 for(const ring of rings)for(const [z,y] of BODY_PROFILE){
  p.push(ring.x,ring.cy+(y-1.52)*ring.h,z*ring.w);
  const side=Math.abs(z)>.69;
  const c=new T.Color(side&&y>=1.44&&y<=1.56?'#bc3b41':side&&y>=1.64&&y<=1.96?'#243948':y<.91?'#70818b':'#dfe5e7');
  colors.push(c.r,c.g,c.b);
 }
 for(let r=0;r<rings.length-1;r++)for(let j=0;j<n;j++){const a=r*n+j,b=r*n+(j+1)%n,c=a+n,d=b+n;index.push(a,b,c,c,b,d);}
 // Close both ends with their own normals. Passenger cars never end in an open tube.
 for(const end of [0,rings.length-1]){
  const s=rings[end],center=p.length/3;p.push(s.x,s.cy,0);colors.push(.55,.61,.64);
  const ringStart=p.length/3;
  for(let j=0;j<n;j++){const k=(end*n+j)*3;p.push(p[k],p[k+1],p[k+2]);colors.push(colors[k],colors[k+1],colors[k+2]);}
  for(let j=0;j<n;j++)index.push(...(end===0?[center,ringStart+(j+1)%n,ringStart+j]:[center,ringStart+j,ringStart+(j+1)%n]));
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setIndex(index);g.computeVertexNormals();return g;
}
// Surface interpolation keeps the glass on the same faceted shell used by the cab.
export function cabTop(x:number,z:number){
 const s=cabSection(x),az=Math.abs(z)/s.w;
 const i=right.slice(0,7).findIndex((p,i)=>i>0&&p[0]>=az),a=right[Math.max(0,i-1)],b=right[Math.max(1,i)];
 const y=T.MathUtils.lerp(a[1],b[1],T.MathUtils.clamp((az-a[0])/(b[0]-a[0]),0,1));
 return s.cy+(y-1.52)*s.h;
}
export function windshieldGeometry(){
 const p:number[]=[],uv:number[]=[],index:number[]=[];
 for(let i=0;i<=16;i++)for(let j=0;j<=20;j++){
  const t=i/16,v=j/20,x=1.03+t*.97,z=(v*2-1)*(.52-t*.11);
  p.push(x,cabTop(x,z)+.012,z);uv.push(v,t);
 }
 for(let i=0;i<16;i++)for(let j=0;j<20;j++){const a=i*21+j,b=a+21;index.push(a,a+1,b,b,a+1,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();return g;
}
