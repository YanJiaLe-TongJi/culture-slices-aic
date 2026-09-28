import {useLayoutEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {Blocks,Box,Stick,type Block} from './DioramaPrimitives';
import type {Point} from './exhibits';
const noise=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
export function RammedWall({p,w,h,t=.3,color='#bb9e77'}:{p:Point;w:number;h:number;t?:number;color?:string}){
 const data=useMemo(()=>{const a:Block[]=[];for(let y=0;y<h;y+=.15)a.push({p:[0,Math.min(y+.075,h-.035),0],s:[w,Math.min(.15,h-y),t],c:new T.Color(color).multiplyScalar(.97+noise(y,w)*.07).getStyle()});return a;},[w,h,t,color]);
 return <group position={p}><Blocks data={data}/></group>;
}
export function Gable({w,h,color}:{w:number;h:number;color:string}){
 const shape=useMemo(()=>{const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();return s;},[w,h]);
 return <mesh castShadow><extrudeGeometry args={[shape,{depth:.2,bevelEnabled:false}]}/><meshStandardMaterial color={color} roughness={1}/></mesh>;
}
function TileEnds({w,d,eave}:{w:number;d:number;eave:number}){
 const mesh=useRef<T.InstancedMesh>(null),count=Math.floor(w/.16)+1;
 useLayoutEffect(()=>{const o=new T.Object3D();for(let i=0;i<count*2;i++){const side=i<count?-1:1;o.position.set(-w/2+(i%count)*.16,eave-.02,side*(d/2+.045));o.rotation.set(Math.PI/2,0,0);o.updateMatrix();mesh.current!.setMatrixAt(i,o.matrix);mesh.current!.setColorAt(i,new T.Color(i%3?'#646a5e':'#7b7d6a'));}mesh.current!.instanceMatrix.needsUpdate=true;mesh.current!.instanceColor!.needsUpdate=true;mesh.current!.computeBoundingSphere();},[w,d,eave,count]);
 return <instancedMesh ref={mesh} args={[undefined,undefined,count*2]} castShadow><cylinderGeometry args={[.047,.047,.05,10]}/><meshStandardMaterial roughness={.96}/></instancedMesh>;
}
/** Only the low-level roof construction is shared; each building has its own plan. */
export function Roof({w,d,eave,rise,material='thatch',hip=false}:{w:number;d:number;eave:number;rise:number;material?:'thatch'|'clay'|'reed';hip?:boolean}){
 const data=useMemo(()=>{const a:Block[]=[],sx=material==='clay'?.16:.115,sz=.16;for(let x=-w/2;x<=w/2;x+=sx)for(let z=-d/2;z<=d/2;z+=sz){const slope=Math.max(0,Math.min(1-Math.abs(z)/(d/2),hip?(w/2-Math.abs(x))/(d/2):1));const n=noise(x,z);a.push({p:[x,eave+rise*slope,z],s:[sx*1.08,.105,sz*1.32],c:material==='clay'?['#5b625c','#697069','#74766a'][Math.floor(n*3)]:material==='reed'?['#a88f58','#b39b66','#c1a971'][Math.floor(n*3)]:['#9d814c','#b2965f','#bda36c'][Math.floor(n*3)]});}if(material==='thatch')for(let x=-w/2;x<=w/2;x+=.055)for(const side of [-1,1])a.push({p:[x,eave-.06-noise(x,side)*.045,side*(d/2+.05)],s:[.026,.12+noise(x,5)*.11,.07],c:noise(x,3)>.5?'#c0a266':'#9d7d47'});return a;},[w,d,eave,rise,material,hip]);
 const ridge=hip?Math.max(.4,w-d):w;
 return <><Blocks data={data}/>{material==='clay'&&<TileEnds w={w} d={d} eave={eave}/>}<Box p={[0,eave+rise+.11,0]} s={[ridge+.15,.17,.25]} c={material==='clay'?'#666757':'#7d6846'}/>{[-1,1].map(z=><Stick key={z} a={[-w/2,eave-.09,z*d/2]} b={[w/2,eave-.09,z*d/2]} r={.045} c='#796242'/>)}
 {Array.from({length:Math.floor(w/.52)},(_,i)=>{const x=-w/2+.28+i*.52,peak=eave+rise*(hip?Math.min(1,(w/2-Math.abs(x))/(d/2)):1)-.12;return <group key={i}><Stick a={[x,eave-.1,-d/2]} b={[x,peak,0]} r={.045}/><Stick a={[x,peak,0]} b={[x,eave-.1,d/2]} r={.045}/></group>;})}</>;
}
export function Door({w=.82,h=1.5}:{w?:number;h?:number}){return <><Box p={[0,h/2,0]} s={[w,h,.09]} c='#514535'/>{[-1,1].map(x=><Box key={x} p={[x*(w/2+.055),h/2,.065]} s={[.12,h+.1,.15]} c='#77573c'/>)}<Box p={[0,h+.04,.055]} s={[w+.23,.12,.16]} c='#77573c'/>{[-.26,.26].map(x=><Box key={x} p={[x*w,.6,.07]} s={[.08,.12,.035]} c='#9c8152'/>)}</>;}
export function Stairs({p,width=2,height=.45,steps=3,run=.3}:{p:Point;width?:number;height?:number;steps?:number;run?:number}){return <group position={p}>{Array.from({length:steps},(_,i)=><Box key={i} p={[0,(height/steps)*(steps-i)/2,i*run]} s={[width,(height/steps)*(steps-i),run+.03]} c={i%2?'#b8a380':'#bda987'}/>)}</group>;}
export function Post({x,z,h,y=0,c='#73533c'}:{x:number;z:number;h:number;y?:number;c?:string}){return <><Box p={[x,y+.065,z]} s={[.34,.13,.35]} c='#a1997d'/><Stick a={[x,y+.13,z]} b={[x,y+h,z]} r={.085} c={c}/></>;}
