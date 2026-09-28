import {MiddleGround,WaterLaneHouse,KilnTerraces} from './MiddleArchitecture';
import {BuildingReveal} from './BuildingReveal';
import {useEffect,useMemo,useRef,type ReactNode} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {Box,Blocks,Stick,Mat,Hit,ClayMaterial,type Block} from './DioramaPrimitives';
import {CourtyardDrain,Bamboo} from './WeiJinArchitecture';
import type {Point} from './exhibits';
import type {ActionClock} from './exhibit-state';
export interface WeiJinModelProps{value:()=>number;variant:number;wrap:(id:string,children:ReactNode)=>ReactNode;clock:ActionClock;selected?:string|null}
const phase=(v:number,n=0)=>T.MathUtils.clamp(v-n,0,1);
function Tube({points,r=.035,c='#a6a079'}:{points:Point[];r?:number;c?:string}){const g=useMemo(()=>new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,10,false),[JSON.stringify(points),r]);useEffect(()=>()=>g.dispose(),[g]);return <mesh geometry={g} castShadow><meshStandardMaterial color={c} roughness={.43}/></mesh>;}
function Celadon({map,color=map?'#c3c2a1':'#a6a079'}:{map?:T.Texture;color?:string}){return <meshStandardMaterial map={map} color={color} roughness={.32} metalness={.04} side={T.DoubleSide}/>;}
function Bowl({size=1,color='#999d74'}:{size?:number;color?:string}){const p=useMemo(()=>[[0,.02],[.18,.02],[.21,.10],[.30,.20],[.37,.34],[.365,.37],[.34,.37],[.27,.21],[.17,.11],[0,.10]].map(([x,y])=>new T.Vector2(x,y)),[]);return <group scale={size}><mesh castShadow receiveShadow><latheGeometry args={[p,64]}/><Celadon color={color}/></mesh></group>;}
function Ewer({wrap}:{wrap:WeiJinModelProps['wrap']}){
 const map=useMemo(()=>{const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d')!;x.fillStyle='#d8d0a9';x.fillRect(0,0,512,512);for(let i=0;i<11000;i++){x.fillStyle=i%3?'#766d4120':'#fff6d126';x.fillRect((Math.sin(i*13)*.5+.5)*512,(Math.cos(i*37)*.5+.5)*512,1,1);}x.fillStyle='#6b472bb0';for(let section=0;section<8;section++){const center=(section+.5)*64;for(let row=0;row<4;row++)for(const sign of [-1,1]){x.beginPath();x.ellipse(center+sign*row*7,190+row*28,3.5,4.2,.3,0,Math.PI*2);x.fill();}for(let i=0;i<7;i++){x.beginPath();x.arc(center+Math.cos(i/7*Math.PI*2)*10,278+Math.sin(i/7*Math.PI*2)*13,3.3,0,Math.PI*2);x.fill();}}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;},[]);useEffect(()=>()=>map.dispose(),[map]);
 const profile=useMemo(()=>[[0,.01],[.20,.01],[.3,.035],[.36,.15],[.44,.33],[.465,.52],[.405,.71],[.28,.82],[.135,.87],[.13,1.01],[.17,1.1],[.26,1.14],[.27,1.2],[.245,1.205],[.238,1.16],[.148,1.13],[.105,1.02],[.11,.87],[.25,.79],[.385,.67],[.43,.51],[.4,.31],[.32,.15],[.2,.065],[0,.065]].map(([x,y])=>new T.Vector2(x,y)),[]);
 const body=useMemo(()=>{const g=new T.LatheGeometry(profile,96),uv=g.getAttribute('uv'),p=g.getAttribute('position');for(let i=0;i<p.count;i++)uv.setY(i,i%profile.length<=12?p.getY(i)/1.205:.99);uv.needsUpdate=true;return g;},[profile]);useEffect(()=>()=>body.dispose(),[body]);
 return <>{wrap('ewer',<group><mesh geometry={body} castShadow receiveShadow><Celadon map={map}/></mesh>{[-1,1].map(side=><group key={side} position={[0,.77,side*.30]}><Tube points={[[-.09,0,0],[-.08,.09,side*.02],[.08,.09,side*.02],[.09,0,0]]} r={.025}/></group>)}<mesh position={[0,.035,0]}><cylinderGeometry args={[.29,.27,.065,64]}/><meshStandardMaterial color='#b6a990' roughness={.93}/></mesh></group>)}
 {wrap('spout',<group><Tube points={[[.29,.76,0],[.5,.86,0],[.55,1.1,0],[.38,1.27,0],[.23,1.20,0]]} r={.052}/>
 <group position={[-.355,.80,0]} rotation={[0,0,.09]}><mesh position={[0,.055,0]} scale={[.069,.18,.075]} castShadow><sphereGeometry args={[1,24,18]}/><Celadon/></mesh><mesh position={[-.03,.19,0]} scale={[.105,.075,.071]} castShadow><sphereGeometry args={[1,32,20]}/><Celadon/></mesh><mesh position={[-.12,.19,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.043,.041,.06,32,1,true]}/><Celadon/></mesh><mesh position={[-.151,.19,0]} rotation={[0,Math.PI/2,0]}><circleGeometry args={[.035,24]}/><meshStandardMaterial color='#403d29'/></mesh>{[-1,1].map(s=><mesh key={s} position={[-.052,.21,s*.065]}><sphereGeometry args={[.012,12,8]}/><meshStandardMaterial color='#423b25'/></mesh>)}{[0,1,2].map(i=><mesh key={i} position={[.015+i*.015,.27+i*.007,0]} scale={[.014,.044,.026]}><sphereGeometry args={[1,12,8]}/><Celadon color='#978b60'/></mesh>)}</group></group>)}
 </>;
}
export function EwerCourt({value,wrap,selected}:WeiJinModelProps){
 const ewer=useRef<T.Group>(null),stream=useRef<T.Mesh>(null),liquid=useRef<T.Mesh>(null);
 const streamGeometry=useMemo(()=>new T.CylinderGeometry(.012,.018,1,12),[]),origin=useMemo(()=>new T.Vector3(),[]),target=useMemo(()=>new T.Vector3(-2,.805,1.25),[]),up=useMemo(()=>new T.Vector3(0,1,0),[]);
 useEffect(()=>()=>streamGeometry.dispose(),[streamGeometry]);
 useFrame(()=>{const v=value(),lift=phase(v)*(1-phase(v,2)),pour=phase(v,1),tilt=Math.sin(pour*Math.PI)*.58;
  if(ewer.current){ewer.current.position.set(-.8-.35*lift,.67+.30*lift,1.25);ewer.current.rotation.set(0,phase(v,2)*Math.PI*2,tilt);ewer.current.updateWorldMatrix(true,false);}
  if(stream.current&&ewer.current){const pouring=pour>.18&&pour<.85&&v<2;stream.current.visible=pouring;if(pouring){origin.set(-.51,.995,0).applyMatrix4(ewer.current.matrixWorld);const direction=target.clone().sub(origin);stream.current.position.copy(origin).add(target).multiplyScalar(.5);stream.current.quaternion.setFromUnitVectors(up,direction.clone().normalize());stream.current.scale.y=direction.length();}}
  if(liquid.current){liquid.current.visible=v>1.2;liquid.current.position.y=.70+phase((pour-.18)/.67)*.10;}
 });
 return <><MiddleGround kind="ewer"/><WaterLaneHouse wrap={wrap} selected={selected}/>{wrap('drain',<CourtyardDrain/>)}
  <group position={[-1.45,.25,1.25]}><Mat w={3.5} d={1.95}/><Box p={[0,.34,0]} s={[3.1,.13,1.3]} c='#73513a'/>{[-1.3,1.3].map(x=><Box key={x} p={[x,.17,0]} s={[.14,.34,.9]} c='#624830'/>)}</group>
  <group ref={ewer} position={[-.8,.67,1.25]} scale={.85}><Ewer wrap={wrap}/></group>
  {wrap('cup',<group position={[-2,.67,1.25]}><Bowl size={.63}/><group position={[0,.15,0]}><Hit s={[.55,.4,.55]}/></group></group>)}
  <mesh ref={liquid} position={[-2,.7,1.25]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.155,40]}/><meshStandardMaterial color='#858b66' transparent opacity={.72} roughness={.2}/></mesh>
  <mesh ref={stream} geometry={streamGeometry}><meshStandardMaterial color='#b2c3bb' transparent opacity={.78} roughness={.16}/></mesh>
  <group position={[-2.1,.27,2.4]}><Mat w={1.6} d={.6}/></group><group position={[.3,.255,.4]}><Bowl size={.85}/></group>
 </>;
}

function Support(){return <group><mesh position={[0,.13,0]} castShadow><cylinderGeometry args={[.12,.21,.26,24]}/><meshStandardMaterial color='#a99777' roughness={.92}/></mesh>{[0,1,2].map(i=><group key={i} rotation={[0,i*Math.PI*2/3,0]}><Box p={[.13,.29,0]} s={[.30,.055,.07]} c='#9e8f72'/><Box p={[.23,.35,0]} s={[.055,.12,.065]} c='#9e8f72'/></group>)}</group>;}
function KilnShell({open}:{open:boolean}){
 const shape=useMemo(()=>{const s=new T.Shape();s.absarc(0,.24,1.1,Math.PI/2,Math.PI,false);s.lineTo(-.89,.24);s.absarc(0,.24,.89,Math.PI,Math.PI/2,true);s.closePath();return s;},[]);
 return <group position={[1.2,.03,3.4]} rotation={[.216,0,0]}>
  <Box p={[0,-.05,-4.1]} s={[2.35,.19,8.8]} c='#9a7c5e'/><Box p={[-1.07,.10,-4.1]} s={[.23,.31,8.8]} c='#977756'/><Box p={[1.04,.08,-4.1]} s={[.22,.27,8.8]} c='#997659'/>
  <mesh position={[0,0,-8.5]} castShadow receiveShadow><extrudeGeometry args={[shape,{depth:8.6,bevelEnabled:false,steps:1,curveSegments:40}]}/><ClayMaterial color='#a68867'/></mesh>
  {Array.from({length:12},(_,i)=><mesh key={i} position={[0,.24,-i*.74]} rotation={[0,0,Math.PI/2]} castShadow><torusGeometry args={[1.10,.016,5,44,Math.PI/2]}/><meshStandardMaterial color='#83654c'/></mesh>)}
  <BuildingReveal open={open} wall><group scale={[-1,1,1]}><mesh position={[0,0,-8.5]} castShadow receiveShadow><extrudeGeometry args={[shape,{depth:8.6,bevelEnabled:false,steps:1,curveSegments:40}]}/><ClayMaterial color='#a68867'/></mesh></group></BuildingReveal>
  <mesh position={[0,.23,.1]} castShadow><torusGeometry args={[1.06,.12,8,64,Math.PI]}/><meshStandardMaterial color='#967758' roughness={.95}/></mesh>
  <Box p={[0,.2,-8.55]} s={[2.4,.45,.22]} c='#8d7055'/>{[-.7,-.25,.25,.7].map(x=><Box key={x} p={[x,.29,-8.4]} s={[.15,.18,.20]} c='#3d3c30'/>)}
  {[-6.6,-5,-3.4].map((z,i)=><group key={z} position={[i%2?.40:-.38,.12,z]}><Support/><group position={[0,.42,0]}><Bowl size={.95}/></group></group>)}
 </group>;
}
export function KilnYard({value,wrap,clock,selected}:WeiJinModelProps){
 const carrier=useRef<T.Group>(null),support=useRef<T.Group>(null),movingBowl=useRef<T.Mesh>(null),fire=useRef<T.Group>(null),light=useRef<T.PointLight>(null),arrows=useRef<T.InstancedMesh>(null),bowlMat=useRef<T.MeshStandardMaterial>(null);
 const dummy=useMemo(()=>new T.Object3D(),[]),from=useMemo(()=>new T.Vector3(-2.85,.5,1.25),[]),to=useMemo(()=>new T.Vector3(1.55,.67,.58),[]),clay=useMemo(()=>new T.Color('#b5a78b'),[]),glaze=useMemo(()=>new T.Color('#85966d'),[]);
 useFrame(({clock:renderClock})=>{const v=value(),load=phase(v,1),heat=phase(v,2),burn=heat>0&&heat<.8?Math.sin(heat/.8*Math.PI):0;
  if(carrier.current){carrier.current.position.copy(from).lerp(to,load);carrier.current.position.y+=Math.sin(load*Math.PI)*.8;}
  if(support.current){const a=phase(v);support.current.position.set(1.55*(1-a),-.48*(1-a)+Math.sin(a*Math.PI)*.18,.85*(1-a));}if(movingBowl.current)movingBowl.current.position.y=.40*phase(v);
  if(fire.current){fire.current.visible=burn>.01;fire.current.scale.y=.5+burn*.9;}if(light.current)light.current.intensity=burn*2.5;
  if(bowlMat.current){bowlMat.current.color.copy(clay).lerp(glaze,phase((heat-.75)/.25));bowlMat.current.roughness=.88-phase((heat-.75)/.25)*.5;}
  if(arrows.current){arrows.current.visible=burn>.03;for(let i=0;i<22;i++){const t=(i/22+(clock.running?renderClock.elapsedTime*.25:0))%1;dummy.position.set(1.2+Math.sin(i*3)*.23,.55+t*1.86,3.15-t*8.2);dummy.scale.set(.038,.025,.17);dummy.updateMatrix();arrows.current.setMatrixAt(i,dummy.matrix);}arrows.current.instanceMatrix.needsUpdate=true;}
 });
 return <><MiddleGround kind='kiln'/>{wrap('kiln',<KilnShell open={!!selected&&['kiln','firebox','blank','supports'].includes(selected)}/>)}<KilnTerraces wrap={wrap} selected={selected}/>
  <Box p={[-2.85,.40,1.25]} s={[2.0,.17,1.55]} c='#806748'/>{[-3.65,-2.05].map(x=><Box key={x} p={[x,.2,1.25]} s={[.15,.4,1.1]} c='#786145'/>)}
  {wrap('blank',<group position={[-3.5,.5,1.25]}><Bowl size={.75} color='#b6a98e'/><group position={[0,.18,0]}><Hit s={[.8,.4,.8]}/></group></group>)}
  {wrap('supports',<group position={[-1.8,.02,2.1]}><Support/><group position={[.55,0,.15]}><Support/></group><group position={[.28,.25,0]}><Hit s={[1.1,.7,.7]}/></group></group>)}
  <group ref={carrier} position={[-2.85,.5,1.25]}><group ref={support}><Support/></group><mesh ref={movingBowl} castShadow><latheGeometry args={[[new T.Vector2(.12,0),new T.Vector2(.20,.08),new T.Vector2(.29,.23),new T.Vector2(.30,.27),new T.Vector2(.27,.27),new T.Vector2(.16,.08),new T.Vector2(.10,.04)],56]}/><meshStandardMaterial ref={bowlMat} color='#b5a78b' roughness={.88} side={T.DoubleSide}/></mesh></group>
  {wrap('firebox',<group position={[1.2,.02,3.6]}><Box p={[0,.02,.1]} s={[1.45,.1,1.2]} c='#4e4737'/>{[-.5,0,.5].map(x=><Stick key={x} a={[x,.1,-.3]} b={[x+.1,.19,.85]} r={.10} c='#615239'/>)}<group ref={fire}>{[-.4,0,.4].map(x=><mesh key={x} position={[x,.38,0]} scale={[.16,.55,.20]}><octahedronGeometry args={[1,1]}/><meshStandardMaterial color='#e5a54c' emissive='#c57526' emissiveIntensity={.8} transparent opacity={.82}/></mesh>)}</group><pointLight ref={light} position={[0,.55,-.4]} color='#ffb456' distance={4}/><Hit s={[1.7,.6,1.5]}/></group>)}
  <instancedMesh ref={arrows} args={[undefined,undefined,22]}><sphereGeometry args={[1,8,6]}/><meshBasicMaterial color='#edc17b' transparent opacity={.8}/></instancedMesh>
  {Array.from({length:9},(_,i)=><Stick key={i} a={[-4.9+(i%3)*.16,.18+Math.floor(i/3)*.17,3.1]} b={[-4.2+(i%3)*.16,.2+Math.floor(i/3)*.17,3.45]} r={.07} c={i%2?'#725d42':'#947b54'}/>)}
  <Bamboo p={[-5.7,0,1.3]}/><Bamboo p={[4.9,1.8,-4.6]}/>
 </>;
}
