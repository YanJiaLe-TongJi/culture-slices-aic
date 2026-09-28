import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {Blocks,Box,Stick,Jar,type Block} from './DioramaPrimitives';
import type {Point} from './exhibits';

export type Beam={a:Point;b:Point;r:number;c?:string};
export function Timbers({items}:{items:Beam[]}) {
  const mesh=useRef<T.InstancedMesh>(null);
  useLayoutEffect(()=>{const o=new T.Object3D(),a=new T.Vector3(),b=new T.Vector3();items.forEach((v,i)=>{a.set(...v.a);b.set(...v.b);o.position.copy(a).add(b).multiplyScalar(.5);o.scale.set(v.r,b.distanceTo(a),v.r);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.sub(a).normalize());o.updateMatrix();mesh.current!.setMatrixAt(i,o.matrix);mesh.current!.setColorAt(i,new T.Color(v.c||'#795638'));});mesh.current!.instanceMatrix.needsUpdate=true;mesh.current!.instanceColor!.needsUpdate=true;mesh.current!.computeBoundingSphere();},[items]);
  return <instancedMesh ref={mesh} args={[undefined,undefined,items.length]} castShadow receiveShadow><boxGeometry/><meshStandardMaterial roughness={.88}/></instancedMesh>;
}

const roofHeight=(z:number,d:number,e:number,r:number)=>e+r*Math.pow(Math.max(0,1-Math.abs(z)/(d/2)),1.24)+.055*Math.pow(Math.abs(z)/(d/2),9);
/** Low, deep eaves with actual curved tile courses, not stacked voxel slabs. */
function RiverRoof({w,d,eave,rise,fine}:{w:number;d:number;eave:number;rise:number;fine:boolean}) {
  const geo=useMemo(()=>{const positions:number[]=[],indices:number[]=[];for(let j=0;j<=32;j++){const z=-d/2+j*d/32,y=roofHeight(z,d,eave,rise);positions.push(-w/2,y,z,w/2,y,z);if(j<32){const n=j*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;},[w,d,eave,rise]);
  const tileGeo=useMemo(()=>{const s=new T.Shape(),r=fine?.061:.083;s.absarc(0,0,r,0,Math.PI,false);s.absarc(0,0,r-.014,Math.PI,0,true);s.closePath();return new T.ExtrudeGeometry(s,{depth:fine?.255:.34,bevelEnabled:false,curveSegments:6});},[fine]);
  useEffect(()=>()=>{geo.dispose();tileGeo.dispose();},[geo,tileGeo]);
  const tiles=useMemo(()=>{const a:{p:Point;angle:number;c:string}[]=[],dx=fine?.13:.18,dz=fine?.21:.29;for(let x=-w/2+.05;x<w/2;x+=dx)for(let z=-d/2;z<d/2-.07;z+=dz){const h=roofHeight(z,d,eave,rise),slope=(roofHeight(z+.02,d,eave,rise)-h)/.02;a.push({p:[x,h+.012,z],angle:-Math.atan(slope),c:['#626b64','#72796c','#7b8070'][Math.abs(Math.round(x*81+z*41))%3]});}return a;},[w,d,eave,rise,fine]);
  const mesh=useRef<T.InstancedMesh>(null);
  useLayoutEffect(()=>{const o=new T.Object3D();tiles.forEach((t,i)=>{o.position.set(...t.p);o.rotation.set(t.angle,0,0);o.updateMatrix();mesh.current!.setMatrixAt(i,o.matrix);mesh.current!.setColorAt(i,new T.Color(t.c));});mesh.current!.instanceMatrix.needsUpdate=true;mesh.current!.instanceColor!.needsUpdate=true;mesh.current!.computeBoundingSphere();},[tiles]);
  const rafters:Beam[]=[];for(let x=-w/2+.1;x<w/2;x+=fine?.19:.35)for(const side of [-1,1])rafters.push({a:[x,eave-.12,side*d/2],b:[x,eave+rise-.16,0],r:.055,c:'#806546'});
  return <><mesh geometry={geo} castShadow receiveShadow><meshStandardMaterial color='#596459' side={T.DoubleSide}/></mesh><instancedMesh ref={mesh} args={[tileGeo,undefined,tiles.length]} castShadow receiveShadow><meshStandardMaterial roughness={.94}/></instancedMesh><Timbers items={rafters}/><Box p={[0,eave+rise+.05,0]} s={[w+.12,.11,.16]} c='#6f7463'/>{[-1,1].map(s=><Box key={s} p={[0,eave-.10,s*d/2]} s={[w,.1,.11]} c='#5e4935'/>)}</>;
}

export function RiverSign({text,w=.6,h=.85}:{text:string;w?:number;h?:number}) {
  const texture=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=128;canvas.height=192;const c=canvas.getContext('2d')!;c.fillStyle='#cfbd8a';c.fillRect(0,0,128,192);c.strokeStyle='#694c36';c.lineWidth=5;c.strokeRect(8,8,112,176);c.fillStyle='#483d2f';c.font='48px serif';c.textAlign='center';text.split('').forEach((t,i)=>c.fillText(t,64,62+i*57));const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;return t;},[text]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh><boxGeometry args={[w,h,.025]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>;
}

export function RiverShop({fine=false,floors=1,w=3,d=2.1,kind='tea'}:{fine?:boolean;floors?:number;w?:number;d?:number;kind?:'tea'|'warehouse'|'inn'}) {
  const blocks:Block[]=[],frame:Beam[]=[],floor=1.85,eave=floors*floor+.23;
  blocks.push({p:[0,.10,0],s:[w+.3,.2,d+.32],c:'#aaa082'},{p:[0,1.0,-d/2+.12],s:[w,1.6,.17],c:'#cebe9b'});
  for(const x of [-w/2,w/2]){blocks.push({p:[x,.99,0],s:[.16,1.8,d],c:'#bba989'});frame.push({a:[x,.2,-d/2],b:[x,eave,-d/2],r:.11},{a:[x,.2,d/2],b:[x,eave,d/2],r:.12});}
  for(const x of [-w/2,0,w/2])frame.push({a:[x,.2,d/2+.38],b:[x,1.98,d/2+.38],r:.095});
  for(let level=0;level<floors;level++){
    const y=.2+level*floor;
    frame.push({a:[-w/2,y+1.66,d/2],b:[w/2,y+1.66,d/2],r:.14},{a:[-w/2,y+1.72,-d/2],b:[w/2,y+1.72,-d/2],r:.12});
    if(level){blocks.push({p:[0,y-.05,0],s:[w+.2,.14,d+.2],c:'#97754c'},{p:[0,y+.75,-d/2],s:[w,1.5,.15],c:'#bda986'});for(const x of [-w/2,0,w/2])frame.push({a:[x,y,d/2],b:[x,y+1.72,d/2],r:.1});
      blocks.push({p:[0,y+.28,d/2],s:[w,.48,.07],c:'#92734e'});
      for(let x=-w/2+.12;x<w/2;x+=.16)blocks.push({p:[x,y+.96,d/2],s:[.026,.84,.035],c:'#624f39'});
      for(const h of [.06,.51,.70,.90,1.10,1.38,1.61])blocks.push({p:[0,y+h,d/2+.01],s:[w,.034,.055],c:'#7e5d3d'});
      for(const side of [-1,1]){blocks.push({p:[side*w/2,y+.24,0],s:[.085,.48,d],c:'#a28862'});for(let z=-d/2;z<d/2;z+=.16)blocks.push({p:[side*w/2,y+.92,z],s:[.04,.86,.026],c:'#70563b'});for(const h of [.51,.76,1.01,1.38,1.61])blocks.push({p:[side*w/2,y+h,0],s:[.06,.032,d],c:'#72583d'});}
    }
  }
  if(fine){for(let x=-w/2;x<w/2;x+=.115)blocks.push({p:[x,.22,.12],s:[.108,.024,d-.2],c:x>0?'#a48459':'#98784f'});for(const x of [-w/2,0,w/2]){blocks.push({p:[x,1.72,d/2+.21],s:[.32,.09,.46],c:'#7f6141'},{p:[x,1.82,d/2+.25],s:[.45,.08,.30],c:'#92734d'});}for(const side of [-1,1])for(let z=-d/2+.05;z<d/2;z+=.2)for(let row=0;row<3;row++)blocks.push({p:[side*(w/2+.03),.06+row*.052,z],s:[.19,.047,.186],c:row%2?'#9a957e':'#aaa28a'});}
  // Close the roof's gable ends and carry the purlins across the upper frame.
  for(const side of [-1,1])for(let z=-d/2;z<d/2;z+=.10){const h=roofHeight(z,d+.7,eave,floors===2?.6:.5)-eave+.04;blocks.push({p:[side*w/2,eave+h/2-.1,z],s:[.07,h,.10],c:'#b6a17d'});}
  for(const z of [-d*.38,0,d*.38])frame.push({a:[-w/2-.17,roofHeight(z,d+.7,eave,floors===2?.6:.5)-.18,z],b:[w/2+.17,roofHeight(z,d+.7,eave,floors===2?.6:.5)-.18,z],r:.07,c:'#73583d'});
  const awning=useMemo(()=>{const g=new T.PlaneGeometry(w+.32,.98,8,6),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),v=p.getY(i);p.setXYZ(i,x,1.91+v*.18-Math.cos(x*6)*.015,d/2+.55-v*.95);}g.computeVertexNormals();return g;},[w,d]);
  useEffect(()=>()=>awning.dispose(),[awning]);
  return <><Blocks data={blocks}/><Timbers items={frame}/><RiverRoof w={w+.6} d={d+.7} eave={eave} rise={floors===2?.6:.5} fine={fine}/><mesh geometry={awning} castShadow><meshStandardMaterial color={kind==='warehouse'?'#9a9271':'#c7b38a'} roughness={1} side={T.DoubleSide}/></mesh>
    <Box p={[0,.85,d/2+.03]} s={[w-.3,.10,.62]} c='#80623f'/>{[-1,1].map(s=><Box key={s} p={[s*(w/2-.3),.5,d/2+.05]} s={[.09,.65,.5]} c='#70563a'/>)}
    {kind==='warehouse'?<Cargo p={[0,.23,.15]} fine={fine}/>:[-.8,0,.8].map(x=><group key={x} position={[x,.92,d/2+.02]}><Jar size={.19} dark/></group>)}
    <Stick a={[w/2-.12,1.95,d/2]} b={[w/2+.42,1.95,d/2+.15]} r={.025}/><group position={[w/2+.34,1.42,d/2+.15]}><RiverSign text={kind==='tea'?'茶':kind==='inn'?'酒':'货'} w={.32} h={.65}/></group>
    {fine&&[-1,1].map(s=><group key={s} position={[s*(w/2-.35),.23,d/2-.16]} rotation={[0,s*.15,0]}><Box p={[0,.52,0]} s={[.4,1.04,.055]} c='#85684a'/>{[-.11,0,.11].map(x=><Box key={x} p={[x,.52,.035]} s={[.014,1.0,.014]} c='#bba078'/>)}</group>)}
  </>;
}

export function Cargo({p=[0,0,0],fine=false}:{p?:Point;fine?:boolean}) {return <group position={p}>{[[-.36,0],[.29,.12],[-.07,.47]].map(([x,z],i)=><group key={i} position={[x,i===2?.3:0,z]}><Box p={[0,.16,0]} s={[.48,.30,.59]} c={i%2?'#b39d6c':'#c4b181'}/>{[-.13,.13].map(dx=><Box key={dx} p={[dx,.315,0]} s={[.018,.012,.6]} c='#76674c'/>)}<Box p={[0,.316,0]} s={[.49,.012,.018]} c='#817054'/>{fine&&[-1,1].map(s=><Box key={s} p={[0,.16,s*.299]} s={[.018,.30,.008]} c='#76674c'/>)}</group>)}</group>;}

export function MarketStall({fine=false,color='#bea67b'}:{fine?:boolean;color?:string}) {const poles:Beam[]=[];for(const x of [-.87,.87])for(const z of [-.5,.6])poles.push({a:[x,0,z],b:[x,1.52-z*.14,z],r:.055});return <><Timbers items={poles}/><mesh position={[0,1.5,.07]} rotation={[.14,0,0]} castShadow><boxGeometry args={[2,.035,1.4]}/><meshStandardMaterial color={color} roughness={1}/></mesh><Box p={[0,.7,0]} s={[1.72,.09,.68]} c='#a68459'/>{[-.68,.68].map(x=><Box key={x} p={[x,.34,0]} s={[.07,.65,.58]} c='#715840'/>)}{[-.54,0,.54].map(x=><group key={x} position={[x,.77,0]}><Jar size={fine?.20:.23}/></group>)}{fine&&Array.from({length:18},(_,i)=><Box key={i} p={[-.95+i*.11,1.405,.77]} s={[.055,.16,.022]} c='#ae9369'/>)}</>;}

export function RiverPerson({p,c='#777960',turn=0}:{p:Point;c?:string;turn?:number}) {return <group position={p} rotation={[0,turn,0]}><mesh position={[0,.43,0]} castShadow><cylinderGeometry args={[.07,.12,.34,7]}/><meshStandardMaterial color={c}/></mesh><mesh position={[0,.68,0]} castShadow><sphereGeometry args={[.074,8,6]}/><meshStandardMaterial color='#bd9770'/></mesh><Box p={[0,.736,0]} s={[.15,.044,.14]} c='#504c3d'/>{[-1,1].map(s=><group key={s}><Stick a={[s*.035,.3,0]} b={[s*.052,.04,s*.04]} r={.027} c='#665947'/><Stick a={[s*.07,.55,0]} b={[s*.13,.35,.075]} r={.033} c={c}/></group>)}</group>;}

export function RiverTree(){const items:Beam[]=[{a:[0,0,0],b:[.08,2.4,0],r:.15,c:'#72664d'}];for(let i=0;i<9;i++){const angle=i*2.4,x=Math.cos(angle),z=Math.sin(angle);items.push({a:[.05,.9+i*.14,0],b:[x*.8,2.1+(i%3)*.25,z*.8],r:.05,c:'#776e53'});for(let j=0;j<3;j++)items.push({a:[x*.6,2+i%3*.2,z*.6],b:[x*(1+j*.12),2.4+j*.16,z*(1+j*.1)],r:.016,c:'#897c5d'});}return <Timbers items={items}/>;}
