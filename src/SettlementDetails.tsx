import {useLayoutEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import {Blocks,Box,Jar,Mat,type Block} from './DioramaPrimitives';
import {Roof,RammedWall,Gable,Door} from './ArchitecturePrimitives';
import type {Point} from './exhibits';
import {BuildingReveal} from './BuildingReveal';
export const noise=(a:number,b:number)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n);};
type Beam={a:Point;b:Point;w?:number;c?:string};
// Rafters, frames, fences and racks share one draw call per assembly.
export function Beams({data}:{data:Beam[]}){
 const mesh=useRef<T.InstancedMesh>(null);
 useLayoutEffect(()=>{const o=new T.Object3D(),a=new T.Vector3(),b=new T.Vector3(),up=new T.Vector3(0,1,0);data.forEach((v,i)=>{a.set(...v.a);b.set(...v.b);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());o.scale.set(v.w||.09,a.distanceTo(b),v.w||.09);o.updateMatrix();mesh.current!.setMatrixAt(i,o.matrix);mesh.current!.setColorAt(i,new T.Color(v.c||'#765e40'));});mesh.current!.instanceMatrix.needsUpdate=true;mesh.current!.instanceColor!.needsUpdate=true;mesh.current!.computeBoundingSphere();},[data]);
 return <instancedMesh ref={mesh} args={[undefined,undefined,data.length]} castShadow receiveShadow><boxGeometry/><meshStandardMaterial roughness={.92}/></instancedMesh>;
}
export function Frame({w,d,h,color='#795c3f',bays=3}:{w:number;d:number;h:number;color?:string;bays?:number}){
 const data=useMemo(()=>{const a:Beam[]=[];for(let i=0;i<=bays;i++){const x=-w/2+i*w/bays;for(const z of [-d/2,d/2]){a.push({a:[x,.05,z],b:[x,h,z],w:.16,c:color});a.push({a:[x,h-.62,z],b:[x+(i===bays?-.4:.4),h-.05,z],w:.08,c:color});}a.push({a:[x,h,-d/2],b:[x,h,d/2],w:.15,c:color});}for(const z of [-d/2,d/2])a.push({a:[-w/2-.1,h,z],b:[w/2+.1,h,z],w:.2,c:color});return a;},[w,d,h,color,bays]);
 return <><Beams data={data}/><Blocks data={Array.from({length:(bays+1)*2},(_,i)=>({p:[-w/2+Math.floor(i/2)*w/bays,.07,i%2?d/2:-d/2],s:[.3,.14,.3],c:'#a59a7e'}))}/></>;
}
export function Tree({p,size=1,tone='green'}:{p:Point;size?:number;tone?:'green'|'gold'}){
 const leaves=useMemo(()=>Array.from({length:85},(_,i):Block=>({p:[(noise(i,3)-.5)*2.2,2.25+noise(i,6)*1.15,(noise(i,4)-.5)*2],s:[.42,.32,.45],c:(tone==='green'?['#809068','#95a274','#a8b586']:['#9b995c','#b3aa6d','#c3b784'])[i%3]})),[tone]);
 return <group position={p} scale={size}><Beams data={[{a:[0,0,0],b:[-.08,2.8,0],w:.22},{a:[-.03,1.3,0],b:[-.8,2.7,.15],w:.11},{a:[-.05,1.9,0],b:[.7,2.9,-.2],w:.1}]}/><Blocks data={leaves}/></group>;
}
export function EarthHouse({p,oval=1,size=1,open=false}:{p:Point;oval?:number;size?:number;open?:boolean}){
 const [back,front]=useMemo(()=>{const back:Block[]=[],front:Block[]=[];for(let i=0;i<48;i++){const ang=i/48*Math.PI*2,x=Math.cos(ang)*1.52,z=Math.sin(ang)*1.52;for(let y=0;y<7;y++){if(z>1.2&&Math.abs(x)<.5&&y<6)continue;(z>.2?front:back).push({p:[x,.1+y*.17,z],s:[.23,.18,.23],c:['#b49b73','#c1a880','#baa079'][y%3]});}}return [back,front];},[]);
 const roof=useMemo(()=>{const a:Block[]=[];for(let y=0;y<16;y++){const r=Math.max(0,1.87-y*.125),count=Math.max(1,Math.ceil(r*46));for(let i=0;i<count;i++){const angle=i/count*Math.PI*2;a.push({p:[Math.cos(angle)*r,1.22+y*.103,Math.sin(angle)*r],s:[.2,.14,.2],c:['#a48d55','#b29b65','#c0aa76'][Math.floor(noise(i,y)*3)]});}}return a;},[]);
 return <group position={p} scale={[size*oval,size,size]}><mesh position={[0,.016,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><circleGeometry args={[1.65,48]}/><meshStandardMaterial color='#bca581'/></mesh><Blocks data={back}/><BuildingReveal open={open} wall><Blocks data={front}/></BuildingReveal><BuildingReveal open={open}><Blocks data={roof}/></BuildingReveal><Beams data={Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return {a:[Math.cos(a)*1.35,0,Math.sin(a)*1.35] as Point,b:[Math.cos(a)*1.35,1.36,Math.sin(a)*1.35] as Point,w:.1};})}/><Box p={[0,.06,1.6]} s={[.85,.12,.5]} c='#ab916b'/><group position={[-.7,.02,-.6]}><Jar size={.58}/></group><group position={[.3,.02,0]}><Mat w={1.1} d={.8}/></group><mesh rotation={[-Math.PI/2,0,0]} position={[-.4,.032,.65]}><circleGeometry args={[.32,16]}/><meshStandardMaterial color='#75614c'/></mesh></group>;
}
export function CropPatch({p,w=3,d=4}:{p:Point;w?:number;d?:number}){
 const data=useMemo(()=>{const a:Block[]=[];for(let row=0;row<Math.floor(w/.38);row++)for(let i=0;i<Math.floor(d/.27);i++){const x=-w/2+row*.38,z=-d/2+i*.27,h=.35+noise(row,i)*.38;a.push({p:[x,h/2,z],s:[.025,h,.025],c:'#8e9457'},{p:[x,h,z],s:[.065,.16,.066],c:'#c6b779'},{p:[x+.05,h*.45,z],s:[.13,.025,.04],c:'#9ca570'});}return a;},[w,d]);return <group position={p}><Box p={[0,.017,0]} s={[w+.3,.03,d+.3]} c='#aa9971'/><Blocks data={data}/></group>;
}
export function Fence({p,length=4,rotation=0}:{p:Point;length?:number;rotation?:number}){
 const data=useMemo(()=>{const a:Beam[]=[];for(let x=-length/2;x<=length/2;x+=.65)a.push({a:[x,0,0],b:[x,.85,0],w:.065});for(const y of [.28,.56])a.push({a:[-length/2,y,0],b:[length/2,y,0],w:.045,c:'#aa9470'});return a;},[length]);return <group position={p} rotation={[0,rotation,0]}><Beams data={data}/></group>;
}
export function Bundles({p,count=8}:{p:Point;count?:number}){return <group position={p}><Blocks data={Array.from({length:count},(_,i)=>({p:[(i%3)*.6,.2+Math.floor(i/6)*.36,Math.floor(i/3)%2*.65],s:[.5,.36,.55],c:['#bda570','#c8b07c','#af9867'][i%3]}))}/><Blocks data={Array.from({length:count},(_,i)=>({p:[(i%3)*.6,.387+Math.floor(i/6)*.36,Math.floor(i/3)%2*.65],s:[.055,.016,.56],c:'#78644b'}))}/></group>;}
export function Fuel({p,w=2}:{p:Point;w?:number}){return <group position={p}><Beams data={Array.from({length:24},(_,i)=>({a:[-w/2+(i%8)*w/8,.07+Math.floor(i/8)*.12,-.5] as Point,b:[-w/2+(i%8)*w/8,.08+Math.floor(i/8)*.12,.55] as Point,w:.11,c:i%2?'#766046':'#8b7352'}))}/></group>;}
// A room is a low-level assembly; the nine settlement plans are composed separately.
export function Hall({p,w=5,d=3,h=2.1,rise=.85,floor=.24,roof='reed',hip=false,open=false,color='#beaa87',wood='#77583a',rotation=0}:{p:Point;w?:number;d?:number;h?:number;rise?:number;floor?:number;roof?:'clay'|'reed'|'thatch';hip?:boolean;open?:boolean;color?:string;wood?:string;rotation?:number}){
 return <group position={p} rotation={[0,rotation,0]}><Box p={[0,floor/2,0]} s={[w+.2,floor,d+.2]} c='#aa9270'/><Box p={[0,floor+.025,0]} s={[w,.05,d]} c='#c4b290'/><group position={[0,floor+.05,0]}><Frame w={w-.5} d={d-.5} h={h} color={wood}/>{!open&&<><RammedWall p={[0,0,-d/2+.1]} w={w-.22} h={h-.05} color={color}/>{[-1,1].map(side=><group key={side} position={[side*(w/2-.12),0,0]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={d-.3} h={h-.05} color={color}/>{!hip&&<group position={[0,h,0]}><Gable w={d-.3} h={rise} color={color}/></group>}</group>)}{[-1,1].map(side=><RammedWall key={side} p={[side*(w/4+.3),0,d/2-.1]} w={w/2-.65} h={h-.05} color={color}/>)}<RammedWall p={[0,h*.82,d/2-.1]} w={1.25} h={h*.18} color={color}/><group position={[0,0,d/2-.04]}><Door w={1.15} h={h*.82}/></group></>}<Roof w={w+.55} d={d+.55} eave={h+.09} rise={rise} material={roof} hip={hip}/></group></group>;
}
export function YarnRack({p,w=3}:{p:Point;w?:number}){return <group position={p}><Frame w={w} d={.65} h={1.75} bays={2}/><Blocks data={Array.from({length:56},(_,i)=>({p:[-w/2+.14+i*(w-.28)/56,1.05,.07*(i%2)],s:[.014,1.3,.016],c:i%7<3?'#c7aa76':'#e0c895'}))}/></group>;}
