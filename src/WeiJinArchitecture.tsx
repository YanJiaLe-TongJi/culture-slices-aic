import {useMemo} from 'react';
import * as T from 'three';
import {Blocks,Box,Stick,Jar,Basket,Mat,type Block} from './DioramaPrimitives';
import {RammedWall,Roof,Door,Stairs,Post,Gable} from './ArchitecturePrimitives';
import {inFootprint,type Footprint} from './site-footprints';
import type {Point} from './exhibits';
const outlines:Record<'court'|'kiln'|'cave',Footprint>={
 court:[[-6.5,-4.6],[6.25,-4.6],[6.25,4.85],[2.5,4.85],[2.5,5.25],[-4.5,5.25],[-4.5,4.65],[-6.5,4.65]],
 kiln:[[-6.25,-4.5],[-3.5,-5.35],[3.4,-5.75],[5.8,-4.4],[6,2.8],[4.5,5.4],[-2.2,5.5],[-5.8,3.1]],
 cave:[[-6.6,-5.2],[6.4,-5.2],[6.4,3.55],[4.8,3.55],[4.8,4.8],[1.8,5.4],[-1.8,5.4],[-1.8,4.7],[-6.6,4.7]]
};
export function WeiJinGround({plan}:{plan:keyof typeof outlines}){
 const data=useMemo(()=>{const a:Block[]=[];for(let i=-24;i<=24;i++)for(let j=-21;j<=21;j++){
  const x=i*.28,z=j*.28;if(!inFootprint(x,z,outlines[plan]))continue;const n=Math.abs(Math.sin(i*33+j*18));
  let top=plan==='kiln'?x>-.05?Math.max(.04,(3.5-z)*.22):.04:0;
  if(plan==='kiln'&&x>.15&&x<2.35&&z<3.7&&z>-5.15)top-=.28;
  if(plan==='court'&&z>3.43&&z<4.17)top=-.3;
  const c=plan==='cave'?n>.5?'#baad92':'#c4b69b':plan==='kiln'?n>.5?'#ada181':'#b9a687':n>.4?'#bcb493':'#b3ad91';
  a.push({p:[x,top-.10,z],s:[.285,.20,.285],c});a.push({p:[x,(top-.76)/2,z],s:[.285,top+.56,.285],c:plan==='cave'?'#9b8972':n>.55?'#968365':'#a08b6e'});
 }return a;},[plan]);return <><Blocks data={data}/><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.77,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.16}/></mesh></>;
}
export function Brickwork({p=[0,0,0],w,h,d=.28,color='#898b7b'}:{p?:Point;w:number;h:number;d?:number;color?:string}){
 const data=useMemo(()=>{const a:Block[]=[];for(let row=0;row<h/.13;row++)for(let col=0;col<w/.42;col++){
 const x=-w/2+.21+col*.42+(row%2)*.21;if(x>w/2-.05)continue;a.push({p:[x,.065+row*.13,0],s:[Math.min(.40,w/2-x+.18),.12,d],c:new T.Color(color).multiplyScalar(.91+Math.abs(Math.sin(row*18+col*3))*.16).getStyle()});}return a;},[w,h,d,color]);return <group position={p}><Blocks data={data}/></group>;
}
function Window({w=1.2,h=1.15}:{w?:number;h?:number}){const bars=useMemo(()=>Array.from({length:Math.ceil(w/.12)},(_,i):Block=>({p:[-w/2+i*.12,h/2,.035],s:[.037,h,.035],c:'#665240'})),[w,h]);return <><Box p={[0,h/2,0]} s={[w+.1,h+.1,.06]} c='#474a3b'/><Blocks data={bars}/>{[0,h].map(y=><Box key={y} p={[0,y,.06]} s={[w+.18,.075,.08]} c='#795a3e'/>)}</>;}
export function Bamboo({p}:{p:Point}){return <group position={p}>{[0,1,2,3].map(i=><group key={i} position={[Math.sin(i*2)*.3,0,Math.cos(i*2)*.25]}><Stick a={[0,0,0]} b={[.08,2+i%2*.45,.07]} r={.03} c='#647758'/>{[.65,1.1,1.6,1.95].map((y,j)=><group key={y}><Box p={[0,y,0]} s={[.07,.035,.07]} c='#93a178'/><Stick a={[0,y,0]} b={[j%2?.5:-.5,y+.25,.14]} r={.015} c='#718264'/>{[-1,1].map(s=><mesh key={s} position={[(j%2?1:-1)*.37,y+.14,s*.10]} rotation={[.4,s*.6,.2]} scale={[.10,.026,.30]}><sphereGeometry args={[1,6,4]}/><meshStandardMaterial color={i%2?'#657851':'#8d9c67'} flatShading/></mesh>)}</group>)}</group>)}</group>;}
export function JiangnanHouse(){return <>
 <Box p={[0,.1,-.7]} s={[11.4,.20,6]} c='#aaa083'/><Box p={[0,.225,-.7]} s={[11.15,.05,5.85]} c='#bdb297'/>
 <group position={[.3,.25,-2.8]}>
  <Brickwork p={[0,0,-1.3]} w={9.8} h={.4}/><RammedWall p={[0,.4,-1.3]} w={9.8} h={1.85} color='#c3b59a'/>
  {[-3.8,-1.5,1.2,4.3].map(x=><Post key={x} x={x} z={1.1} h={2.55} c='#614b37'/>)}
  {[-3.5,3.35].map(x=><group key={x} position={[x,.83,-1.13]}><Window w={1.45}/></group>)}
  <group position={[.35,0,-1.1]}><Door w={1.65} h={2.0}/></group>
  <Box p={[.2,2.47,1.1]} s={[9.8,.19,.20]} c='#6d5139'/>
  <Roof w={10.4} d={3.4} eave={2.65} rise={1.05} material='clay'/>
  {[-4.65,4.85].map(x=><group key={x} position={[x,0,0]} rotation={[0,Math.PI/2,0]}><Brickwork w={2.75} h={.4}/><RammedWall p={[0,.4,0]} w={2.75} h={2.13} color='#b6a68c'/><group position={[0,2.53,0]}><Gable w={3.1} h={1.13} color='#b6a68c'/></group></group>)}
  <group position={[-2.25,.03,0]}><Mat w={2.2} d={1.65}/><Box p={[0,.24,-.3]} s={[1.7,.12,.65]} c='#6c4636'/>{[-.7,.7].map(x=><Box key={x} p={[x,.12,-.3]} s={[.12,.23,.44]} c='#654633'/>)}</group>
  <group position={[3.2,.03,-.4]}><Box p={[0,.27,0]} s={[1.2,.54,.70]} c='#805d40'/><group position={[-.28,.56,0]}><Jar size={.42} dark/></group><group position={[.9,0,.15]}><Basket size={.7}/></group></group>
 </group>
 <group position={[-5.3,.25,.3]} rotation={[0,Math.PI/2,0]}><Brickwork w={3.8} h={.6}/><RammedWall p={[0,.6,0]} w={3.8} h={.7} color='#bcac8f'/></group>
 <group position={[5.3,.25,.3]} rotation={[0,Math.PI/2,0]}><Brickwork w={3.8} h={.7}/><RammedWall p={[0,.7,0]} w={3.8} h={.45} color='#bcac8f'/></group>
 <Stairs p={[-2.8,0,2.3]} width={2.5} height={.25} steps={2}/><Bamboo p={[4.45,.27,1.15]}/><Bamboo p={[-4.6,.27,1.5]}/>
 </>;}
export function CourtyardDrain(){const paving=useMemo(()=>{const a:Block[]=[];for(let i=0;i<32;i++)for(let j=0;j<2;j++)a.push({p:[-6.3+i*.4,.023,4.35+j*.32],s:[.385,.045,.30],c:(i+j)%3?'#929382':'#a6a38d'});for(let i=0;i<22;i++)a.push({p:[-6.2+i*.58,-.23,3.8],s:[.55,.08,.52],c:i%3?'#6d6249':'#847453'});return a;},[]);return <><Blocks data={paving}/><Brickwork p={[0,-.23,3.38]} w={12.4} h={.27} d={.22}/><Brickwork p={[0,-.23,4.18]} w={12.4} h={.27} d={.22}/><Box p={[0,-.135,3.8]} s={[12.4,.025,.45]} c='#788e88'/>{[-3.45,-3.05,-2.65].map(x=><Box key={x} p={[x,.1,3.8]} s={[.36,.14,1.15]} c='#9e9987'/>)}</>;}
export function KilnShed(){return <group position={[-4.05,.05,-2.2]}>
 <Brickwork p={[0,0,-1.3]} w={3.65} h={.25} color='#a49576'/><RammedWall p={[0,.25,-1.3]} w={3.65} h={1.45} color='#af9571'/>
 {[-1.6,1.6].map(x=><Post key={x} x={x} z={1.05} h={1.85}/>)}<Roof w={4.1} d={3.15} eave={1.94} rise={.75} material='reed'/>
 <Box p={[0,.55,-.3]} s={[3.1,.12,1.15]} c='#786045'/>{[-1.25,1.25].map(x=><Box key={x} p={[x,.25,-.3]} s={[.14,.5,.7]} c='#71573f'/>)}
 {[-.95,0,.95].map((x,i)=><group key={x} position={[x,.63,-.3]}><Jar size={.4+i*.08} dark/></group>)}
 <group position={[-.9,0,1]}><Basket size={.75}/></group>
 </group>;}
