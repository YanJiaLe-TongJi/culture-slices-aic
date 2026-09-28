import {useEffect,useMemo,useRef,type ReactNode} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {Box,Blocks,Stick,type Block} from './DioramaPrimitives';
import {Beams} from './SettlementDetails';
import {phase} from './NewEraPrimitives';
import {TRAIN_CARS,TRAIN_GAP,TRAIN_TRAVEL,TRAIN_Z,PANTO_X,HEAD_X,carGeometry,windshieldGeometry} from './highspeed-train-geometry';

function windowMap(){
 const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d')!;
 g.clearRect(0,0,256,128);g.beginPath();g.roundRect(4,4,248,120,20);g.clip();
 const gradient=g.createLinearGradient(0,0,0,128);gradient.addColorStop(0,'#253c50');gradient.addColorStop(.55,'#4e7187');gradient.addColorStop(1,'#203a4c');g.fillStyle=gradient;g.fillRect(0,0,256,128);
 g.fillStyle='#b6d5e72b';g.beginPath();g.moveTo(22,0);g.lineTo(126,0);g.lineTo(223,128);g.lineTo(150,128);g.fill();
 g.strokeStyle='#7f9ca977';g.lineWidth=3;g.strokeRect(10,9,236,111);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;
}
function numberingMap(n:number){
 const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d')!;
 x.fillStyle='#465963';x.font='42px sans-serif';x.textAlign='center';x.fillText('复 兴 号',180,58);x.font='26px sans-serif';x.fillText('CULTURE  /  '+String(n).padStart(2,'0'),210,105);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;
}
export function TrainBogie(){return <>
 <Box p={[0,.60,0]} s={[1.22,.18,1.18]} c='#3f515e'/><Box p={[0,.75,0]} s={[1.0,.13,1.05]} c='#5b6c73'/>
 {[-.42,.42].map(x=><group key={x} position={[x,0,0]}>
  <mesh position={[0,.48,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.065,.065,1.28,12]}/><meshStandardMaterial color='#697882' metalness={.65}/></mesh>
  {[-.58,.58].map(z=><group key={z} position={[0,.48,z]}><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.19,.19,.10,24]}/><meshStandardMaterial color='#384953' metalness={.5} roughness={.55}/></mesh><mesh position={[0,0,Math.sign(z)*.056]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.083,.083,.018,16]}/><meshStandardMaterial color='#82929a' metalness={.6}/></mesh></group>)}
 </group>)}
 {[-.45,.45].flatMap(x=>[-.60,.60].map(z=><mesh key={`${x}${z}`} position={[x,.68,z]}><cylinderGeometry args={[.09,.09,.18,12]}/><meshStandardMaterial color='#859196'/></mesh>))}
 </>;}

function Car({cab,number,body,glass,map}:{cab:boolean;number:number;body:T.BufferGeometry;glass:T.BufferGeometry;map:T.Texture}){
 const lettering=useMemo(()=>numberingMap(number),[number]);useEffect(()=>()=>lettering.dispose(),[lettering]);
 const bogies=cab?[-2.75,.65]:[-2.10,2.10],windows=cab?[-2.75,-1.9,-1.05,-.2]:[-1.70,-.85,0,.85,1.70],doors=cab?[-3.65]:[-2.73,2.73];
 const detail=useMemo(()=>{const blocks:Block[]=[];for(const x of (cab?[-1.45]:[-.95,.95])){
  blocks.push({p:[x,2.40,0],s:[1.1,.12,.73],c:'#a5b2b9'});
  for(let i=0;i<9;i++)blocks.push({p:[x-.43+i*.105,2.468,0],s:[.038,.016,.57],c:'#71818c'});
 }for(let i=0;i<6;i++)blocks.push({p:[(i-2.5)*.43,.77,0],s:[.39,.29,1.14],c:i%2?'#75838c':'#62747e'});return blocks;},[cab]);
 return <>
  <mesh geometry={body} castShadow receiveShadow><meshStandardMaterial vertexColors metalness={.22} roughness={.48}/></mesh><Blocks data={detail}/>
  {[-1,1].map(side=><group key={side}>
   {windows.map(x=><mesh key={x} position={[x,1.78,side*.789]} rotation={[0,side<0?Math.PI:0,0]}><planeGeometry args={[.64,.29]}/><meshStandardMaterial map={map} transparent alphaTest={.1} roughness={.25} metalness={.2}/></mesh>)}
   {doors.map(x=><group key={x} position={[x,1.40,side*.786]}><Box s={[.43,.95,.014]} c='#778994'/><Box p={[0,0,side*.009]} s={[.39,.91,.008]} c='#dbe2e4'/><mesh position={[0,.34,side*.017]} rotation={[0,side<0?Math.PI:0,0]}><planeGeometry args={[.25,.26]}/><meshStandardMaterial map={map} transparent alphaTest={.1}/></mesh><Box p={[.115,-.11,side*.018]} s={[.019,.105,.008]} c='#5d717c'/><Box p={[0,-.5,0]} s={[.48,.045,.12]} c='#6e8088'/></group>)}
   <mesh position={[cab?-1.3:0,1.15,side*.791]} rotation={[0,side<0?Math.PI:0,0]}><planeGeometry args={[1.25,.31]}/><meshStandardMaterial map={lettering} transparent alphaTest={.12} roughness={.65}/></mesh>
   {cab&&<><mesh position={[.59,1.85,side*.786]} rotation={[0,side<0?Math.PI:0,0]}><planeGeometry args={[.43,.29]}/><meshStandardMaterial map={map} transparent alphaTest={.1}/></mesh><Box p={[-3.05,.85,side*.6]} s={[1.45,.07,.16]} c='#a6b3b9'/></>}
  </group>)}
  {bogies.map(x=><group key={x} position={[x,0,0]}><TrainBogie/></group>)}
  {cab&&<><mesh geometry={glass}><meshStandardMaterial color='#243e50' metalness={.2} roughness={.2} side={T.DoubleSide}/></mesh>
   <Stick a={[1.38,2.28,0]} b={[1.72,2.17,.32]} r={.011} c='#7e929f'/>
   {[-1,1].map(s=><group key={s} position={[3.43,1.28,s*.36]} rotation={[0,s*.38,0]}><mesh scale={[.21,.065,.035]}><sphereGeometry args={[1,18,8]}/><meshStandardMaterial color={number===1?'#d17871':'#e5e9de'} emissive={number===1?'#992e26':'#e2d9b9'} emissiveIntensity={.22}/></mesh></group>)}
   <mesh position={[3.99,1.15,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.15,.012,5,30]}/><meshStandardMaterial color='#80919b'/></mesh>
  </>}
 </>;
}

function Gangway(){
 const detail=useMemo(()=>{const b:Block[]=[];for(let i=0;i<5;i++){const x=-TRAIN_GAP/2+.026+i*(TRAIN_GAP-.052)/4;for(const side of [-1,1])b.push({p:[x,1.47,side*.675],s:[.024,1.16,.042],c:i%2?'#54616c':'#747e83'});b.push({p:[x,2.04,0],s:[.024,.07,1.34],c:'#77838a'});}return b;},[]);
 return <><Box p={[0,1.47,0]} s={[TRAIN_GAP,1.14,1.32]} c='#303f4a'/><Blocks data={detail}/><Box p={[0,.73,0]} s={[TRAIN_GAP+.03,.1,.43]} c='#52616a'/></>;
}

export default function HighspeedTrain({value,wrap}:{value:()=>number;wrap:(id:string,children:ReactNode)=>ReactNode}){
 const moving=useRef<T.Group>(null),panto=useRef<T.Group>(null);
 const assets=useMemo(()=>({coach:carGeometry(false),cab:carGeometry(true),glass:windshieldGeometry(),window:windowMap()}),[]);
 useEffect(()=>()=>Object.values(assets).forEach(a=>a.dispose()),[assets]);
 useFrame(()=>{if(moving.current)moving.current.position.x=phase(value(),2)*TRAIN_TRAVEL;if(panto.current)panto.current.scale.y=.42+.58*phase(value(),1);});
 return <group ref={moving} position={[0,0,TRAIN_Z]} name='six-car-train'>
  {TRAIN_CARS.map(car=><group key={car.number} position={[car.center,0,0]} rotation={[0,car.reverse?Math.PI:0,0]} name={`car-${car.number}`}>
   {wrap(car.reverse?'tail':'train',<Car cab={car.cab} number={car.number} body={car.cab?assets.cab:assets.coach} glass={assets.glass} map={assets.window}/>)}</group>)}
  {TRAIN_CARS.slice(0,-1).map(car=><group key={car.number} position={[car.center+car.length/2+TRAIN_GAP/2,0,0]}><Gangway/></group>)}
  {wrap('power',<group ref={panto} position={[PANTO_X,2.37,0]}><Box s={[1.3,.09,.5]} c='#7c8b93'/><Beams data={[{a:[-.48,0,0],b:[.28,.53,0],w:.04,c:'#716c62'},{a:[.28,.53,0],b:[-.2,1.06,0],w:.04,c:'#716c62'},{a:[-.38,0,.25],b:[.38,.53,.25],w:.04,c:'#8a7c67'},{a:[.38,.53,.25],b:[-.1,1.06,.25],w:.04,c:'#8a7c67'}]}/><Box p={[-.15,1.09,.08]} s={[.65,.04,.87]} c='#586a76'/></group>)}
  {wrap('bogie',<group position={[HEAD_X-2.75,.60,0]}><mesh><boxGeometry args={[1.5,.65,1.45]}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh></group>)}
 </group>;
}
