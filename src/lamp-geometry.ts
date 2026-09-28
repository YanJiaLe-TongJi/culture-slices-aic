import * as T from 'three';
type Ring={y:number;rx:number;rz:number;x?:number;z?:number;fold?:number};
/** Continuous cross-sections preserve cloth volume instead of assembling block limbs. */
export function sculptedLoft(rings:Ring[],segments=72){
 const p:number[]=[],uv:number[]=[],indices:number[]=[];
 // Sample a continuous profile: extra radial sides alone leave hard horizontal bands.
 const profile=new T.CatmullRomCurve3(rings.map(r=>new T.Vector3(r.rx,r.y,r.rz)),false,'catmullrom',.28);
 const centers=new T.CatmullRomCurve3(rings.map(r=>new T.Vector3(r.x||0,r.fold||0,r.z||0)),false,'catmullrom',.28);
 const rows=Math.max(96,(rings.length-1)*8),ring=new T.Vector3(),center=new T.Vector3();
 for(let j=0;j<=rows;j++){const t=j/rows;profile.getPoint(t,ring);centers.getPoint(t,center);for(let i=0;i<=segments;i++){const angle=i/segments*Math.PI*2,fold=center.y*(Math.cos(angle*9)+.4*Math.sin(angle*17));p.push(center.x+(Math.max(0,ring.x)+fold)*Math.sin(angle),ring.y,center.z+(Math.max(0,ring.z)+fold)*Math.cos(angle));uv.push(i/segments,t);if(j&&i){const n=j*(segments+1)+i;indices.push(n,n-1,n-segments-2,n,n-segments-2,n-segments-1);}}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function sweptSleeve(points:number[][],radii:number[],pleats=.006){
 const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),length=72,sides=40,frames=curve.computeFrenetFrames(length,false),p:number[]=[],uv:number[]=[],idx:number[]=[];
 for(let i=0;i<=length;i++){const t=i/length,at=curve.getPointAt(t),f=t*(radii.length-1),r=T.MathUtils.lerp(radii[Math.floor(f)],radii[Math.min(radii.length-1,Math.floor(f)+1)],f%1);for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,rr=r+pleats*Math.sin(a*8+t*3),v=at.clone().addScaledVector(frames.normals[i],Math.cos(a)*rr).addScaledVector(frames.binormals[i],Math.sin(a)*rr);p.push(v.x,v.y,v.z);uv.push(j/sides,t);if(i&&j){const n=i*(sides+1)+j;idx.push(n,n-1,n-sides-2,n,n-sides-2,n-sides-1);}}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function hangingSleeve(){
 const p:number[]=[],uv:number[]=[],idx:number[]=[],w=48,h=48;
 for(let j=0;j<=h;j++)for(let i=0;i<=w;i++){const u=i/w,v=j/h,x=-.35+u*.64+.16*(1-v),y=1.04*(1-v)+.075*v+.05*Math.sin(u*Math.PI),z=.75+.15*v+(.025+.038*v)*Math.cos(u*Math.PI*8);p.push(x,y,z);uv.push(u,v);if(i&&j){const n=j*(w+1)+i;idx.push(n,n-1,n-w-2,n,n-w-2,n-w-1);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
export const lampCenter={x:-.57,z:.7};
export const lampSmokePath=new T.CatmullRomCurve3([
 new T.Vector3(-.57,1.52,.7),new T.Vector3(-.57,2.13,.7),new T.Vector3(-.52,2.40,.46),new T.Vector3(-.23,2.32,.06),new T.Vector3(-.03,2.13,-.1),new T.Vector3(.02,1.72,-.12),new T.Vector3(.3,1.27,-.12),new T.Vector3(.3,.65,-.1),
]);
