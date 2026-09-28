import {HanResidence,HanWeavingHouse,QinStreetOffice} from './PeriodArchitecture';
import {useEffect,useMemo,useRef,type ReactNode} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import type {Point} from './exhibits';
import type {ActionClock} from './exhibit-state';
import {QinHanGround} from './QinHanArchitecture';
import {Mat} from './DioramaPrimitives';
import ChangxinLamp from './ChangxinLamp';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const phase=(v:number,n:number)=>clamp(v-n);
const easing=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
const wood='#795f40',bronze='#54766b',gold='#b1924e';
function Box({p=[0,0,0],s=[1,1,1],c=wood,rotation=0}:{p?:Point;s?:Point;c?:string;rotation?:number}){return <mesh position={p} rotation={[0,rotation,0]} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} roughness={.9}/></mesh>;}
function Rod({a,b,r=.03,c=wood}:{a:Point;b:Point;r?:number;c?:string}){
 const v=new T.Vector3(...b).sub(new T.Vector3(...a)),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize());
 return <mesh position={new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5)} quaternion={q} castShadow><cylinderGeometry args={[r,r,v.length(),8]}/><meshStandardMaterial color={c} roughness={.8}/></mesh>;
}
function Ring({p=[0,0,0],r=.4,t=.04,c=bronze,vertical=false}:{p?:Point;r?:number;t?:number;c?:string;vertical?:boolean}){return <mesh position={p} rotation={vertical?[0,0,0]:[Math.PI/2,0,0]} castShadow><torusGeometry args={[r,t,5,24]}/><meshStandardMaterial color={c} roughness={.7}/></mesh>;}
function Bowl({r=.75,h=.7,c='#b87755'}:{r?:number;h?:number;c?:string}){
 const points=useMemo(()=>[[.25,0],[.5,.1],[.8,.45],[1,1],[.92,1],[.71,.43],[.41,.12],[.2,.09]].map(([x,y])=>new T.Vector2(x*r,y*h)),[r,h]);
 return <mesh castShadow receiveShadow><latheGeometry args={[points,24]}/><meshStandardMaterial color={c} side={T.DoubleSide} roughness={.9} flatShading/></mesh>;
}
function TextTile({text,w=1,h=1,c='#c3a375',ink='#483b27'}:{text:string;w?:number;h?:number;c?:string;ink?:string}){
 const texture=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const ctx=canvas.getContext('2d')!;ctx.fillStyle=c;ctx.fillRect(0,0,512,512);ctx.strokeStyle='#67502c25';for(let x=0;x<512;x+=16){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+3,512);ctx.stroke();}ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='middle';const lines=text.split('|');ctx.font=`${lines.length>3?42:60}px serif`;lines.forEach((line,i)=>ctx.fillText(line,256,(i+.5)*512/lines.length,460));const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;return t;},[text,c,ink]);
 useEffect(()=>()=>texture.dispose(),[texture]);
 return <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[w,h]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>;
}
function Bench({p=[0,0,0],size:sz=[2,.12,1.6],c=wood}:{p?:Point;size?:Point;c?:string}){return <group position={p}><Box p={[0,.4,0]} s={sz} c={c}/>{[-1,1].flatMap(x=>[-1,1].map(z=><Box key={`${x}${z}`} p={[x*(sz[0]/2-.13),.2,z*(sz[2]/2-.13)]} s={[.12,.4,.12]} c={c}/>))}</group>;}
function Hit({s=[1,1,1]}:{s?:Point}){return <mesh><boxGeometry args={s}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh>;}
// Each model reads the mutable action clock; continuous movement never enters React state.
interface ModelProps{value:()=>number;variant:number;wrap:(id:string,children:ReactNode)=>ReactNode;clock:ActionClock;selected?:string|null}
function LoomModel({value,wrap}:ModelProps){
 const warp=useRef<T.LineSegments>(null),shuttle=useRef<T.Group>(null),reed=useRef<T.Group>(null),cloth=useRef<T.Group>(null);
 const warpGeometry=useMemo(()=>{const g=new T.BufferGeometry(),p=new Float32Array(36*4*3),c=new Float32Array(36*4*3);for(let i=0;i<36;i++){const color=new T.Color(i%4?'#d6b879':'#98534e');for(let j=0;j<4;j++)color.toArray(c,(i*4+j)*3);}g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('color',new T.BufferAttribute(c,3));return g;},[]);
 useEffect(()=>()=>warpGeometry.dispose(),[warpGeometry]);
 useFrame(()=>{const v=value(),shed=v>3?Math.sin(phase(v,3)*Math.PI):phase(v,0)*(1-phase(v,2)),p=warpGeometry.attributes.position;
  for(let i=0;i<36;i++){const x=-1+i*.058,y=.87+(i%2?1:-1)*shed*.2*(v>3?-1:1);p.setXYZ(i*4,x,.87,-1.1);p.setXYZ(i*4+1,x,y,.1);p.setXYZ(i*4+2,x,y,.1);p.setXYZ(i*4+3,x,.87,1.4);}p.needsUpdate=true;warpGeometry.computeBoundingSphere();
  if(shuttle.current)shuttle.current.position.x=1.5-phase(v,1)*2.8+phase(v,3)*2.8;if(reed.current)reed.current.position.z=-.1+phase(v,2)*.7;if(cloth.current)cloth.current.scale.z=.28+phase(v,2)*.35+phase(v,3)*.35;
 });
 return <>{wrap('loom',<group>{[-1.25,1.25].map(x=><group key={x}><Box p={[x,.8,-1.1]} s={[.14,1.6,.14]} c={wood}/><Box p={[x,1.15,.35]} s={[.13,2.3,.13]} c={wood}/><Box p={[x,.52,.1]} s={[.1,.1,2.7]} c={wood}/></group>)}<Rod a={[-1.4,.85,-1.15]} b={[1.4,.85,-1.15]} r={.1}/><Rod a={[-1.4,.85,1.4]} b={[1.4,.85,1.4]} r={.12}/><Box p={[0,2.28,.35]} s={[2.8,.13,.15]} c={wood}/>{[-1,1].map(x=><group key={x}><Rod a={[x*1.25,.15,1.3]} b={[x*1.25,1.8,.35]} r={.05}/><Box p={[x*.42,.14,.45]} s={[.24,.07,1.8]} c='#977246'/><Rod a={[x*.42,.17,-.2]} b={[x*.74,1.5,.1]} r={.019} c='#b6a17c'/></group>)}<Box p={[0,1.45,.1]} s={[2.1,.07,.08]} c='#af956c'/><lineSegments ref={warp} geometry={warpGeometry}><lineBasicMaterial vertexColors/></lineSegments><group ref={reed}>{Array.from({length:19},(_,i)=><Rod key={i} a={[-1+i*.11,.7,0]} b={[-1+i*.11,1.2,0]} r={.014} c='#b39b70'/>)}<Box p={[0,1.22,0]} s={[2.15,.065,.065]} c={wood}/></group></group>)}
 {wrap('shuttle',<group ref={shuttle} position={[1.5,.88,.1]}><mesh rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[.045,.12,.58,4]}/><meshStandardMaterial color='#9f5c45'/></mesh><Ring r={.075} t={.027} c='#d9b578'/><Hit s={[.8,.4,.5]}/></group>)}
 {wrap('cloth',<group position={[-1.8,.22,1.2]}><Box s={[.7,.05,.85]} c='#9d594d'/>{Array.from({length:8},(_,i)=><Box key={i} p={[-.29+i*.084,.03,0]} s={[.026,.01,.8]} c='#d7bd84'/>)}</group>)}<group ref={cloth} position={[0,.885,1.1]}>{Array.from({length:16},(_,i)=><Box key={i} p={[0,.002*i,.025-i*.054]} s={[2.04,.013,.022]} c={i%4?'#bd965f':'#95504b'}/>)}</group><Box p={[0,.32,1.92]} s={[1.7,.12,.55]} c={wood}/></>;
}
function SlipsModel({value,wrap}:ModelProps){
 const slips=useRef<T.Group>(null),bundle=useRef<T.Group>(null),answer=useRef<T.Group>(null);useFrame(()=>{const v=value(),spread=easing(phase(v,0));slips.current?.children.forEach((s,i)=>{s.position.x=(i-4)*(.12+spread*.13);s.rotation.z=phase(v,2)*(i-4)*.13;s.position.x*=1-phase(v,2)*.58;s.position.y=Math.sin(phase(v,2)*Math.abs(i-4)*.28)*.15;});if(bundle.current)bundle.current.scale.setScalar(.75+phase(v,2)*.25);if(answer.current)answer.current.scale.setScalar(Math.max(.001,phase(v,1)));});
 return <><Bench p={[0,0,.2]} size={[4.8,.12,2.8]} c='#806649'/>{[-.4,.65].map(z=><Rod key={z} a={[-1.28,.538,z]} b={[1.28,.538,z]} r={.014} c='#948461'/>)}{wrap('slips',<group ref={slips} position={[0,.51,.4]}>{Array.from({length:9},(_,i)=><group key={i} position={[(i-4)*.12,0,0]}><Box s={[.21,.045,1.55]} c={i%2?'#cfb57f':'#c5a774'}/>{Array.from({length:6},(_,j)=><Box key={j} p={[0,.025,-.58+j*.22]} s={[.08-(j%3)*.015,.006,.04]} c='#655136'/>)}</group>)}</group>)}
 {wrap('table',<group position={[1.9,.52,1]}><Box s={[1.1,.07,1.28]} c='#b7955d'/><group position={[0,.04,0]}><TextTile text='九九八十一|六九五十四|现代转写示意' w={1.06} h={1.24}/></group><Hit s={[1.2,.3,1.4]}/></group>)}
 {wrap('bundle',<group ref={bundle} position={[-2,.6,-.7]}>{Array.from({length:7},(_,i)=><Box key={i} p={[Math.sin(i*2)*.18,Math.cos(i*2)*.1,0]} s={[.18,.055,1.15]} c='#c5ad7e' rotation={i*.03}/>)}{[-.36,.36].map(z=><mesh key={z} position={[0,0,z]}><torusGeometry args={[.25,.02,5,16]}/><meshStandardMaterial color='#766748'/></mesh>)}</group>)}
 <group ref={answer} position={[0,.54,-1]}><TextTile text='6 × 9 = 54' w={1.8} h={.4} c='#cab384'/></group><Rod a={[-1.1,.5,1.15]} b={[-.4,.56,1.5]} r={.025}/><Bowl r={.18} h={.1} c='#4b4637'/></>;
}

export function LampCourt(p:ModelProps){return <><QinHanGround plan='lamp'/><HanResidence wrap={p.wrap} selected={p.selected}/><group position={[0,.43,1.05]} scale={.8}><ChangxinLamp {...p}/></group>{p.wrap('mat',<group position={[2.85,.46,.7]}><Mat w={1.5} d={2.3}/><Box p={[0,.19,-.4]} s={[1.45,.22,.66]} c='#633a2a'/><Box p={[0,.31,-.4]} s={[1.5,.045,.72]} c='#343d33'/><group position={[0,.1,0]}><Hit s={[1.55,.2,2.4]}/></group></group>)}</>;}
export function LoomCourt(p:ModelProps){return <><QinHanGround plan='loom'/><HanWeavingHouse wrap={p.wrap} selected={p.selected}/><group position={[.45,.13,.1]}><LoomModel {...p}/></group>{p.wrap('yarn',<group position={[3.4,.2,-1]}><Bench size={[1.4,.1,1.25]}/>{[0,1,2,3].map(i=><group key={i} position={[-.45+(i%2)*.6,.58,-.3+Math.floor(i/2)*.6]} rotation={[0,0,Math.PI/2]}><Rod a={[0,-.25,0]} b={[0,.25,0]} r={.045}/><mesh castShadow><cylinderGeometry args={[.14,.14,.3,20]}/><meshStandardMaterial color={i%2?'#d0b784':'#a8755f'}/></mesh>{[-.18,.18].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.2,.2,.06,16]}/><meshStandardMaterial color='#896543'/></mesh>)}</group>)}<group position={[0,.5,0]}><Hit s={[1.5,.8,1.4]}/></group></group>)}</>;}
export function SlipsCourt(p:ModelProps){return <><QinHanGround plan='slips'/><QinStreetOffice wrap={p.wrap} selected={p.selected}/><group position={[.25,.27,.85]} scale={.83}><SlipsModel {...p}/></group></>;}
