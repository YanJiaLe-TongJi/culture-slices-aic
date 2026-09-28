import {useEffect,useMemo,useRef,type ReactNode} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {Blocks,Box,Stick,Torus,Hit,Mat,Basket,Jar,type Block} from './DioramaPrimitives';
import {fluteHoles,flutePose} from './flute-demo';
import {makeFluteGeometry,bend,radius} from './flute-geometry';
import type {ActionClock} from './exhibit-state';
import type {Point} from './exhibits';
import {fluteFootprint,inFootprint,edgeDistance} from './site-footprints';
const noise=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
const shore=(z:number)=>3.45+Math.sin(z*.64)*.8;
function BoneMaterial({cut=false,inner=false,attach='material'}:{cut?:boolean;inner?:boolean;attach?:string}){
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=128;const x=c.getContext('2d')!;x.fillStyle=cut?'#b3a282':'#d8c7a1';x.fillRect(0,0,1024,128);for(let i=0;i<5000;i++){x.fillStyle=i%3?'#76533813':'#fff4d52d';x.fillRect(noise(i,1)*1024,noise(i,2)*128,1+noise(i,3)*14,.5+noise(i,4));}for(let i=0;i<18;i++){x.strokeStyle='#745a3820';x.lineWidth=.7;x.beginPath();const py=noise(i,6)*128;x.moveTo(0,py);x.bezierCurveTo(300,py-4,650,py+5,1024,py);x.stroke();}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;},[cut]);
 useEffect(()=>()=>texture.dispose(),[texture]);return <meshStandardMaterial attach={attach} color={inner?'#81745e':'#ffffff'} map={texture} bumpMap={texture} bumpScale={.0015} roughness={.84} side={T.DoubleSide}/>;
}
function BoneFlute(){const geometry=useMemo(makeFluteGeometry,[]);useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh geometry={geometry} castShadow receiveShadow><BoneMaterial attach='material-0'/><BoneMaterial inner attach='material-1'/></mesh>;}
function CrossSection(){
 const geometry=useMemo(()=>{
  const shape=new T.Shape();shape.absarc(0,0,.32,.32,Math.PI*2-.32,false);shape.absarc(0,0,.235,Math.PI*2-.32,.32,true);shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:1.55,bevelEnabled:false,curveSegments:56});g.translate(0,0,-.775);return g;
 },[]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <group rotation={[0,-.35,0]}><mesh geometry={geometry} rotation={[0,0,Math.PI/2]} castShadow receiveShadow><BoneMaterial cut/></mesh><group position={[0,-.34,0]}><Box s={[.7,.09,1.75]} c='#897b60'/></group></group>;
}
function ShoreTerrain(){
 const terrain=useMemo(()=>{const earth:Block[]=[],water:Block[]=[],green:Block[]=[],stones:Block[]=[];
  for(let x=-21;x<=21;x++)for(let z=-17;z<=17;z++){const px=x*.34,pz=z*.34,n=noise(x,z);if(!inFootprint(px,pz,fluteFootprint))continue;const edge=edgeDistance(px,pz,fluteFootprint);const wet=px>shore(pz),path=Math.abs(px+.5)<1.4||Math.abs(pz-1.4)<.85;earth.push({p:[px,wet?-.44:-.25,pz],s:[.344,wet?.14:.5,.344],c:wet?'#829a85':edge<.6?'#9c9e75':path?['#c7ba95','#c4b68e','#cbbb95'][Math.floor(noise(Math.floor(x/2),Math.floor(z/2))*3)]:['#9aa87e','#a6b28b','#aeb992'][Math.floor(noise(Math.floor(x/3),Math.floor(z/3))*3)]});if(edge<.4)earth.push({p:[px,-.56,pz],s:[.344,.22,.344],c:wet?'#6b8476':'#8b9375'});if(wet)water.push({p:[px,-.27,pz],s:[.344,.16,.344],c:['#7eafa2','#83b3a5','#89b9ac'][Math.floor(noise(Math.floor(x/4),Math.floor(z/5))*3)]});if(!wet&&edge<.6&&n>.63)green.push({p:[px,.06+n*.07,pz],s:[.045,.15+n*.1,.045],c:'#7e925f'});if(!wet&&Math.abs(px-shore(pz))<.45&&n>.5)stones.push({p:[px,.025,pz],s:[.15+n*.19,.13,.22],c:n>.7?'#a6ac91':'#989e85'});}
  for(const [x,z] of [[-5.1,2.8],[-5,-3.2],[-2.2,-4.3],[2.5,-3.8],[2.3,3.5]])for(let i=0;i<22;i++)green.push({p:[x+(noise(i,x)-.5)*1.4,.08+noise(i,z)*.17,z+(noise(i,2)-.5)*.9],s:[.18,.17,.2],c:['#849765','#93a572','#aabb87'][i%3]});
  return {earth,water,green,stones};
 },[]);
 return <><Blocks data={terrain.earth}/><Blocks data={terrain.water}/><Blocks data={terrain.green}/><Blocks data={terrain.stones}/><mesh position={[0,-.64,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.13}/></mesh></>;
}
function Reeds(){
 const data=useMemo(()=>{const b:Block[]=[];for(let i=0;i<95;i++){const z=-3.9+noise(i,4)*7.4;if(z>-.5&&z<1.2)continue;const x=shore(z)+.12+noise(i,5)*.65,h=.5+noise(i,6)*.8;b.push({p:[x,h/2-.19,z],s:[.023,h,.024],c:i%3?'#83935b':'#a1a471'});b.push({p:[x,h-.12,z],s:[.06,.2,.065],c:'#bcb28a'});b.push({p:[x+.09,h*.45-.15,z],s:[.19,.023,.04],c:'#8d9c66'});b.push({p:[x-.07,h*.63-.15,z],s:[.17,.026,.035],c:'#a0aa77'});}return b;},[]);return <Blocks data={data}/>;
}
function Tree({p,scale=1}:{p:Point;scale?:number}){
 const leaves=useMemo(()=>Array.from({length:95},(_,i):Block=>({p:[(noise(i,3)-.5)*2.7,2.6+noise(i,6)*1.2,(noise(i,4)-.5)*2.1],s:[.35+noise(i,7)*.25,.26,.35],c:['#82966c','#93a879','#a8b58a','#bac49b'][i%4]})),[]);
 return <group position={p} scale={scale}><Stick a={[0,0,0]} b={[-.15,2.9,0]} r={.145} c='#75664e'/><Stick a={[-.1,1.7,0]} b={[-.95,2.85,.3]} r={.07}/><Stick a={[-.1,2.1,0]} b={[.8,3.1,-.1]} r={.07}/><Blocks data={leaves}/>{Array.from({length:10},(_,i)=><Stick key={i} a={[(noise(i,2)-.5)*2.3,2.8,(noise(i,8)-.5)*1.8]} b={[(noise(i,2)-.5)*2.3,1.8+noise(i,5)*.5,(noise(i,8)-.5)*1.8]} r={.018} c='#99a67c'/>)}</group>;
}
function ListeningShelter(){
 const roof=useMemo(()=>{const b:Block[]=[];for(let x=-10;x<=10;x++)for(let z=-7;z<=6;z++)b.push({p:[x*.18,2.38-z*.047,z*.18],s:[.182,.08,.185],c:['#a3956b','#b2a577','#c2b388'][Math.floor(noise(x,z)*3)]});return b;},[]);
 return <><Blocks data={roof}/>{[-1.65,1.65].flatMap(x=>[-1.1,1.1].map(z=><Stick key={`${x}${z}`} a={[x,0,z]} b={[x,2.43-z*.26,z]} r={.065}/>))}{[-1.6,0,1.6].map(x=><Stick key={x} a={[x,2.8,-1.35]} b={[x,2.12,1.23]} r={.035} c='#857351'/>)}<Stick a={[-1.8,.62,-1.1]} b={[1.8,.62,-1.1]} r={.04}/><group position={[-.6,.035,.1]}><Mat w={1.25} d={1.8}/></group><group position={[.95,.035,.35]}><Mat w={1} d={1.4}/></group><group position={[-1.35,.04,-.65]}><Jar size={.65} dark/></group><group position={[1.2,.04,-.65]}><Basket size={.8}/></group></>;
}
function Ripple(){
 const group=useRef<T.Group>(null);useFrame(({clock:renderClock})=>{const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;group.current?.children.forEach((o,i)=>{const t=reduce?.5:(renderClock.elapsedTime*.12+i*.31)%1;o.scale.setScalar(.5+t*.8);(o as T.Mesh).material instanceof T.MeshBasicMaterial&&((o as T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>).material.opacity=.12*(1-t));});});
 return <group ref={group}>{[[4.6,.5],[5,-1.8],[4.7,2.9]].map(([x,z],i)=><mesh key={i} position={[x,-.174,z]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.49,.51,40]}/><meshBasicMaterial color='#e5ead2' transparent opacity={.1} depthWrite={false}/></mesh>)}</group>;
}
export default function FluteGrove({value,variant,wrap,clock}:{value:()=>number;variant:number;wrap:(id:string,children:ReactNode)=>ReactNode;clock:ActionClock}){
 const covers=useRef<T.Group>(null),board=useRef<T.Group>(null),waves=useRef<T.Group>(null);
 useFrame((_,dt)=>{
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,v=value(),demo=clock.running?flutePose(clock.index,clock.phase*clock.duration):{covered:variant<.5?5:2,sounding:false};
  const animate=(group:T.Group|null)=>group?.children.forEach((o,i)=>{const closed=v>0&&i<demo.covered,target=closed?.014:.17;o.position.y=reduce?target:T.MathUtils.damp(o.position.y,target,12,dt);o.scale.setScalar(reduce?(closed?1:.12):T.MathUtils.damp(o.scale.x,closed?1:.12,12,dt));});animate(covers.current);animate(board.current);
  waves.current?.children.forEach((o,i)=>{o.visible=clock.running&&demo.sounding;const t=(clock.phase*clock.duration*1.25+i*.22)%1;o.scale.setScalar(.6+t*.75);(o as T.Mesh<T.BufferGeometry,T.MeshBasicMaterial>).material.opacity=(1-t)*.24;});
 });
 return <><ShoreTerrain/><Reeds/><Ripple/><Tree p={[-4.8,0,-2.15]} scale={1.13}/><Tree p={[-5.35,0,1.8]} scale={.6}/>
 {wrap('shelter',<group position={[-1.55,0,-2.65]}><ListeningShelter/></group>)}
 {/* The specimen is deliberately enlarged, supported on a low observation mat. */}
 <group position={[-.35,.04,1.55]}><Mat w={2.35} d={1.05}/>{[-.62,.62].map(x=><group key={x}><Box p={[x,.14,0]} s={[.19,.2,.38]} c='#9c896a'/><Box p={[x,.26,0]} s={[.23,.04,.36]} c='#b9a077'/></group>)}</group>
 {wrap('flute',<group position={[-.35,.35,1.55]} scale={.38}><BoneFlute/><group ref={covers}>{fluteHoles.map((x,i)=><group key={i} position={[x,.17,0]}><mesh position={[0,bend(x)+radius(x)+.004,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.069,28]}/><meshStandardMaterial color='#789e8c' transparent opacity={.8} roughness={.8} side={T.DoubleSide}/></mesh></group>)}</group><Hit s={[4.9,.55,.53]}/></group>)}
 {wrap('tube',<group position={[-3.65,.31,.45]} scale={.65}><CrossSection/><Hit s={[.9,.85,1.95]}/></group>)}
 {wrap('holes',<group position={[-.45,.09,2.65]} scale={.65}><Box s={[3.65,.15,.93]} c='#948b6d'/><group position={[0,.085,0]}><Mat w={3.5} d={.8}/></group>{fluteHoles.map((x,i)=><group key={i} position={[x,.14,0]}><mesh rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.068,.101,24]}/><meshStandardMaterial color='#d6c8a4' side={T.DoubleSide}/></mesh><mesh position={[0,-.003,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.068,24]}/><meshStandardMaterial color='#3e5147'/></mesh></group>)}<group ref={board}>{fluteHoles.map((x,i)=><group key={i} position={[x,.17,0]}><mesh position={[0,.15,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.068,24]}/><meshStandardMaterial color='#789e8c' side={T.DoubleSide}/></mesh></group>)}</group><Hit s={[3.8,.45,1]}/></group>)}
 {wrap('shore',<group><group position={[2.1,.035,-.1]}><Mat w={1.1} d={1.5}/><group position={[.1,.05,-.2]}><Basket size={1}/></group><group position={[-.15,.05,.6]} rotation={[0,.2,0]}><Stick a={[-.35,0,0]} b={[.4,0,0]} r={.03}/></group></group><group position={[3.15,.15,.15]}><Hit s={[1.2,.9,1.9]}/></group>{[-.1,.13,.35].map(z=><Stick key={z} a={[2.7,.04,z]} b={[3.75,-.12,z]} r={.055} c='#8c8061'/>)}</group>)}
 <group position={[-4.05,.04,2.6]}><Basket size={.8}/></group><group position={[-4.15,.04,1.5]}><Jar size={.61} dark/></group><group position={[1.4,.035,-.9]}><Mat w={1.5} d={1.2}/><group position={[.35,.05,0]}><Jar size={.5}/></group><Stick a={[-.5,.06,.2]} b={[.1,.06,.4]} r={.022}/></group>
 <group ref={waves} position={[.58,.36,1.55]} scale={.6} rotation={[0,Math.PI/2,0]}>{[0,1,2].map(i=><mesh key={i} position={[0,0,.14+i*.13]}><ringGeometry args={[.21,.219,40]}/><meshBasicMaterial color='#547e74' transparent opacity={.2} depthWrite={false} side={T.DoubleSide}/></mesh>)}</group>
 </>;
}
