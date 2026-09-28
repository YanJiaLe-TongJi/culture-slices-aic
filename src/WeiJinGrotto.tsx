import {GrottoEnvelope} from './GrottoEnvelope';
import {MiddleGround} from './MiddleArchitecture';
import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {Blocks,Box,Hit,type Block} from './DioramaPrimitives';
import type {WeiJinModelProps} from './WeiJinScenes';
import type {Point} from './exhibits';
const stone='#b8a17c',dark='#8c775e';
const phase=(v:number,n=0)=>T.MathUtils.clamp(v-n,0,1);
function StoneLine({points,r=.016,c=dark}:{points:Point[];r?:number;c?:string}){const g=useMemo(()=>new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),36,r,6,false),[JSON.stringify(points),r]);useEffect(()=>()=>g.dispose(),[g]);return <mesh geometry={g} castShadow><meshStandardMaterial color={c} roughness={.95}/></mesh>;}
function Oval({p,s,c=stone}:{p:Point;s:Point;c?:string}){return <mesh position={p} scale={s} castShadow receiveShadow><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color={c} roughness={.95}/></mesh>;}
function Statue({pose='seated'}:{pose?:'seated'|'chair'|'crossed'}){const profile=useMemo(()=>[[0,0],[pose==='seated'?.50:.32,.03],[pose==='seated'?.47:.30,.16],[.33,.36],[.25,.6],[.29,.82],[.2,.98],[.12,1.03],[0,1.05]].map(([r,y])=>new T.Vector2(r,y)),[pose]);return <>
 <mesh scale={[1,1,.68]} castShadow receiveShadow><latheGeometry args={[profile,64]}/><meshStandardMaterial color={stone} roughness={.93}/></mesh>
 <Oval p={[0,1.18,0]} s={[.17,.24,.155]}/><Oval p={[0,1.40,-.025]} s={[.095,.08,.09]} c='#a68e6d'/>
 {[-1,1].map(s=><group key={s}><Oval p={[s*.172,1.16,0]} s={[.031,.10,.035]}/><StoneLine points={[[s*.035,1.215,.145],[s*.08,1.225,.137],[s*.125,1.21,.11]]} r={.008}/>{pose==='seated'?<Oval p={[s*.29,.16,.17]} s={[.29,.12,.21]}/>:<><StoneLine points={[[s*.18,.16,.13],[s*.19,-.12,.18],[s*(pose==='crossed'?-.10:.19),-.35,.27]]} r={.095} c={stone}/><Oval p={[s*(pose==='crossed'?-.10:.19),-.36,.31]} s={[.085,.055,.16]}/></>}<StoneLine points={[[s*.2,.9,.09],[s*.34,.63,.10],[s*.25,.4,.23],[s*.08,.36,.24]]} r={.082} c={stone}/></group>)}
 <Oval p={[0,1.16,.151]} s={[.029,.062,.039]}/><StoneLine points={[[-.043,1.08,.125],[0,1.073,.142],[.042,1.08,.125]]} r={.006}/>
 {Array.from({length:7},(_,i)=><StoneLine key={i} points={[[-.16+i*.045,.91,.12],[-.25+i*.07,.60,.18],[-.35+i*.10,.25,.25],[-.43+i*.12,.12,.22]]} r={.012} c='#9f8766'/>)}
 <StoneLine points={[[-.19,.97,.10],[-.08,.83,.175],[.18,.61,.18],[.26,.32,.22]]} r={.026} c='#c1ab87'/>
 <Oval p={[0,.37,.26]} s={[.14,.048,.07]}/>
 </>;}
function Arch({w=2.1,h=2.45}:{w?:number;h?:number}){
 const shapes=useMemo(()=>{const s=new T.Shape(),r=w/2,y=h-r;s.moveTo(-r,0);s.lineTo(-r,y);s.absarc(0,y,r,Math.PI,0,true);s.lineTo(r,0);s.closePath();const inner=new T.Path(),ri=r-.14;inner.moveTo(-ri,.1);inner.lineTo(ri,.1);inner.lineTo(ri,y);inner.absarc(0,y,ri,0,Math.PI,false);inner.closePath();s.holes.push(inner);const back=new T.Shape();back.moveTo(-r,0);back.lineTo(-r,y);back.absarc(0,y,r,Math.PI,0,true);back.lineTo(r,0);back.closePath();return {s,back};},[w,h]);
 return <><mesh position={[0,0,-.01]}><shapeGeometry args={[shapes.back,48]}/><meshStandardMaterial color='#756651' roughness={1}/></mesh><mesh castShadow><extrudeGeometry args={[shapes.s,{depth:.15,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2,curveSegments:32}]}/><meshStandardMaterial color='#c3ad87' roughness={.96}/></mesh></>;
}
function MiniFigures({count=7,p=[0,0,0],spacing=.43,scale=1}:{count?:number;p?:Point;spacing?:number;scale?:number}){
 const ref=useRef<T.InstancedMesh>(null);
 const g=useMemo(()=>{const parts=[new T.SphereGeometry(.06,10,8).translate(0,.22,0),new T.ConeGeometry(.11,.23,14).translate(0,.095,0),new T.SphereGeometry(.1,10,8).scale(1.3,.37,.75).translate(0,.025,.04)];const combined=mergeGeometries(parts);parts.forEach(g=>g.dispose());return combined;},[]);useEffect(()=>()=>g.dispose(),[g]);
 useLayoutEffect(()=>{const d=new T.Object3D();for(let i=0;i<count;i++){d.position.set((i-(count-1)/2)*spacing,0,0);d.updateMatrix();ref.current!.setMatrixAt(i,d.matrix);}ref.current!.instanceMatrix.needsUpdate=true;ref.current!.computeBoundingSphere();},[count,spacing]);
 return <group position={p} scale={scale}><instancedMesh ref={ref} args={[g,undefined,count]} castShadow><meshStandardMaterial color='#c2ab86' roughness={.97}/></instancedMesh></group>;
}
function StoneEaves({w=3.8,d=3.4}:{w?:number;d?:number}){
 const blocks=useMemo(()=>{const a:Block[]=[];for(let x=-w/2;x<=w/2;x+=.14)for(let z=-d/2;z<=d/2;z+=.17){const edge=Math.min(w/2-Math.abs(x),d/2-Math.abs(z));a.push({p:[x,.10+Math.min(.23,edge*.3),z],s:[.125,.11,.17],c:Math.round(x*100)%3?'#b49d79':'#c4ac86'});}for(let x=-w/2;x<w/2;x+=.22)for(const s of [-1,1])a.push({p:[x,-.08,s*d/2],s:[.095,.11,.30],c:'#9d8768'});return a;},[w,d]);return <><Box p={[0,-.02,0]} s={[w-.25,.18,d-.25]} c='#bca481'/><Blocks data={blocks}/></>;
}
function Niche({p,scale=1,rotation=0,main=false,pose='seated'}:{p:Point;scale?:number;rotation?:number;main?:boolean;pose?:'seated'|'chair'|'crossed'|'pair'}){return <group position={p} rotation={[0,rotation,0]} scale={scale}><Arch/><mesh position={[0,1.32,.0]} scale={[.51,.7,1]}><circleGeometry args={[1,56]}/><meshStandardMaterial color='#a38863'/></mesh>{pose==='pair'?[-.43,.43].map(x=><group key={x} position={[x,.2,.15]} scale={.75}><Statue/></group>):<group position={[0,pose==='seated'?.1:.58,.15]} scale={main?1.33:1.2}><Statue pose={pose}/></group>}<MiniFigures p={[0,2.42,.11]} count={7} spacing={.29} scale={.9}/></group>;}
function ReliefWall(){return <group position={[0,.55,-3.94]}>{[-3.6,0,3.6].map((x,i)=><group key={x} position={[x,0,0]}><Box p={[0,1.3,0]} s={[2.95,2.75,.12]} c='#9a866a'/>{[0,1,2].map(j=><group key={j} position={[0,.22+j*.84,.11]}><MiniFigures count={5} spacing={.46} scale={1.35}/><Box p={[0,-.055,0]} s={[2.9,.065,.15]} c='#c0a784'/></group>)}<Box p={[0,2.82,0]} s={[3.05,.16,.18]} c='#c1aa84'/>{[-1.43,1.43].map(q=><Box key={q} p={[q,1.3,.13]} s={[.10,2.65,.18]} c='#c7af89'/>)}<group position={[0,3,.04]} scale={.65}><Niche p={[0,0,0]}/></group></group>)}</group>;}
export default function WeiJinGrotto({value,wrap,selected}:WeiJinModelProps){
 const marker=useRef<T.Mesh>(null),route=useRef<T.Mesh>(null),light=useRef<T.PointLight>(null);
 const routeCurve=useMemo(()=>new T.CatmullRomCurve3([new T.Vector3(-2.6,.20,2.5),new T.Vector3(-2.7,.20,-1.6),new T.Vector3(0,.20,-2.85),new T.Vector3(2.75,.20,-1.6),new T.Vector3(2.6,.20,2.5),new T.Vector3(0,.20,3)],true),[]),routeGeometry=useMemo(()=>new T.TubeGeometry(routeCurve,140,.019,6,true),[routeCurve]);useEffect(()=>()=>routeGeometry.dispose(),[routeGeometry]);
 useFrame(()=>{const v=value(),walk=phase(v,1),beam=phase(v,2);if(marker.current){marker.current.visible=v>=1&&v<2;routeCurve.getPoint(walk,marker.current.position);}if(route.current)route.current.visible=v>=1;if(light.current){light.current.position.set(-2.7+beam*5.4,3.35,2.4);light.current.intensity=v>=2?2.6:0;}});
 return <><MiddleGround kind='grotto'/><GrottoEnvelope wrap={wrap} selected={selected}/>{wrap('relief',<ReliefWall/>)}
  {wrap('pillar',<group><Box p={[0,.3,0]} s={[3.8,.50,3.7]} c='#b6a17e'/><Box p={[0,.58,0]} s={[3.55,.12,3.45]} c='#cbb591'/><Box p={[0,3.18,0]} s={[2.9,5.16,2.8]} c='#b09a78'/><Box p={[0,5.95,-1.8]} s={[2.8,.36,3.8]} c='#baa587'/></group>)}
  {wrap('buddha',<Niche p={[0,.68,1.45]} main/>)}
  <Niche p={[1.48,.74,0]} rotation={Math.PI/2} scale={.93} pose='crossed'/><Niche p={[-1.48,.74,0]} rotation={-Math.PI/2} scale={.93} pose='chair'/><Niche p={[0,.74,-1.45]} rotation={Math.PI} scale={.93} pose='pair'/>
  {wrap('eaves',<group><group position={[0,3.30,0]}><StoneEaves/></group><group position={[0,5.65,0]}><StoneEaves w={3.5} d={3.2}/></group>
  {[-1.32,1.32].map(x=><group key={x} position={[x,3.60,1.20]}>{[0,1,2,3,4].map(i=><group key={i} position={[0,i*.37,0]}><Box p={[0,.12,0]} s={[.28,.23,.28]} c='#bba380'/><Box p={[0,.27,0]} s={[.45,.08,.43]} c='#c3ac87'/><Box p={[0,.29,.23]} s={[.25,.018,.06]} c='#917a5d'/></group>)}</group>)}</group>)}
  <group position={[0,3.71,1.44]} scale={.76}><Niche p={[0,0,0]}/></group>
  {[-1.59,1.59].map(x=><group key={x}>{Array.from({length:6},(_,i)=><group key={i} position={[x,.78+i*.39,1.48]}><MiniFigures count={1} scale={1}/></group>)}</group>)}
  {wrap('passage',<group position={[2.65,.10,1.5]}><Box s={[.78,.04,3]} c='#b3a58b'/><Hit s={[1.2,.24,3.3]}/></group>)}
  <mesh ref={route} geometry={routeGeometry}><meshBasicMaterial color='#cfaa64' transparent opacity={.7} depthWrite={false}/></mesh><mesh ref={marker}><sphereGeometry args={[.075,16,12]}/><meshBasicMaterial color='#f5d58a'/></mesh><pointLight ref={light} distance={7} color='#fff0cc'/>
 </>;
}
