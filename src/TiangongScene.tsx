import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {Box,Blocks,Stick,type Block} from './DioramaPrimitives';
import {BuildingReveal} from './BuildingReveal';
import {Screen,phase} from './NewEraPrimitives';
import type {WeiJinModelProps} from './WeiJinScenes';

function Hull({length=6,r=.8,open=false}:{length?:number;r?:number;open?:boolean}){return <>
 <mesh rotation={[0,0,Math.PI/2]} castShadow receiveShadow><cylinderGeometry args={[r,r,length,32,1,false,Math.PI,Math.PI]}/><meshStandardMaterial color='#d8d8c6' roughness={.65}/></mesh>
 <BuildingReveal open={open}><mesh rotation={[0,0,Math.PI/2]} castShadow receiveShadow><cylinderGeometry args={[r,r,length,32,1,false,0,Math.PI]}/><meshStandardMaterial color='#e3e1ce' roughness={.64}/></mesh>{[-.35,0,.35].map(x=><mesh key={x} position={[x*length,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[r+.01,.035,6,32,Math.PI]}/><meshStandardMaterial color='#919f9b'/></mesh>)}</BuildingReveal>
 {[-1,1].map(s=><mesh key={s} position={[s*length/2,0,0]} rotation={[0,0,Math.PI/2]} castShadow><cylinderGeometry args={[r+.045,r+.045,.12,32]}/><meshStandardMaterial color='#aab5ad' roughness={.6}/></mesh>)}
 <Box p={[0,-r*.5,0]} s={[length-.16,.10,r*1.3]} c='#afbcb6'/>
 {Array.from({length:Math.floor(length/.6)},(_,i)=><group key={i} position={[-length/2+.35+i*.6,-.06,-r*.4]}><Box s={[.51,.72,.33]} c='#eceadd'/><Box p={[0,.14,.18]} s={[.35,.21,.035]} c='#567a7b'/><Box p={[0,-.21,.18]} s={[.4,.022,.04]} c='#b39a57'/></group>)}
 </>;}
function SolarWing(){const data=useMemo(()=>{const a:Block[]=[];for(let i=0;i<7;i++)for(let j=0;j<25;j++)a.push({p:[(i-3)*.25,0,.18+j*.25],s:[.23,.028,.23],c:(i+j)%3?'#34546d':'#466e83'});return a;},[]);return <><Box p={[0,-.045,3.18]} s={[1.86,.045,6.5]} c='#b19353'/><Blocks data={data}/>{[-.92,.92].map(x=><Box key={x} p={[x,.004,3.18]} s={[.032,.06,6.52]} c='#c0a269'/>)}<Box p={[0,.026,3.18]} s={[.035,.055,6.5]} c='#c2b47f'/></>;}
function Earth(){const cloud=useMemo(()=>{const a:Block[]=[];for(let i=-17;i<=17;i++)for(let j=-12;j<=12;j++){const x=i*.48,z=j*.48,d=x*x+z*z;if(d>95||Math.sin(x*.75+z*.45)+Math.sin(z*1.8-x*.2)<.82)continue;const y=-18.8+Math.sqrt(18*18-d);a.push({p:[x,y+.03,z],s:[.42,.024,.4],c:i%3?'#a7c7c6':'#cbddd2'});}return a;},[]);return <><mesh position={[0,-18.8,0]}><sphereGeometry args={[18,80,32,0,Math.PI*2,0,.65]}/><meshStandardMaterial color='#5f929e' roughness={1}/></mesh><Blocks data={cloud}/></>;}
export default function TiangongScene({value,wrap,selected}:WeiJinModelProps){
 const wings=useRef<T.Group>(null),records=useRef<T.Group>(null),signal=useRef<T.Mesh>(null);
 const v=value(),open=!!selected&&['mengtian','racks','airlock'].includes(selected)||v>=2;
 const line=useMemo(()=>new T.CatmullRomCurve3([new T.Vector3(4.4,2.3,-1.5),new T.Vector3(2,3.6,-.9),new T.Vector3(0,3.2,.2),new T.Vector3(-2,1.2,4.2)]),[]);
 const tube=useMemo(()=>new T.TubeGeometry(line,60,.026,6,false),[line]);useEffect(()=>()=>tube.dispose(),[tube]);
 useFrame(()=>{const n=value();if(wings.current)for(const g of wings.current.children){g.scale.z=.72+.28*phase(n);g.rotation.x=(.2-phase(n)*.2)*(g.userData.sign||1);}if(records.current){records.current.visible=n>1;records.current.children.forEach((m,i)=>{m.position.y=.07+Math.sin(phase(n,1)*Math.PI*2+i)*.11;m.scale.setScalar(.75+.25*phase(n,1));});}if(signal.current){signal.current.visible=n>=2;line.getPoint(phase(n,2),signal.current.position);}});
 return <><Earth/>
 {wrap('core',<group position={[0,2,2]} rotation={[0,Math.PI/2,0]}><Hull length={6.7} r={.83} open={selected==='core'}/>{[-2.6,2.6].map(x=><Box key={x} p={[x,.93,0]} s={[.55,.25,.7]} c='#b0ada0'/>)}<Box p={[1.6,.78,.52]} s={[1.6,.10,.9]} c='#d1d4c5'/></group>)}
 <mesh position={[0,2,-1.5]} castShadow><sphereGeometry args={[.82,24,16]}/><meshStandardMaterial color='#dbded2' roughness={.66}/></mesh>
 {wrap('wentian',<group position={[-4.75,2,-1.5]}><Hull length={7.7} r={.78} open={selected==='wentian'}/><Box p={[-2.85,0,-.85]} s={[.9,.55,.30]} c='#bab698'/>{[-1.8,.1,1.6].map(x=><Box key={x} p={[x,.68,-.58]} s={[1.16,.09,.85]} c='#c6d0c8'/>)}<mesh position={[-3.65,0,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.5,.5,.5,20]}/><meshStandardMaterial color='#bca75d'/></mesh></group>)}
 {wrap('mengtian',<group position={[4.75,2,-1.5]}><Hull length={7.7} r={.78} open={open}/></group>)}
 {wrap('racks',<group position={[4.3,1.62,-1.5]}><Box p={[0,.19,0]} s={[1.6,.6,.5]} c='#dedbba'/><group position={[0,.4,.29]} scale={.55}><Screen w={1.4} h={.65}/></group><group ref={records} position={[0,.28,.34]}>{[-.5,0,.5].map((x,i)=><mesh key={x} position={[x,0,0]}><sphereGeometry args={[.07,12,8]}/><meshStandardMaterial color={['#bd8c56','#78b5b4','#c2d388'][i]} emissive='#7f9b76' emissiveIntensity={.14}/></mesh>)}</group></group>)}
 {wrap('airlock',<group position={[6.7,2,-1.5]}><Box p={[0,0,0]} s={[.95,1.25,1.30]} c='#d2cfc0'/><Box p={[0,.66,0]} s={[.72,.025,.86]} c='#acb8af'/><Box p={[0,.05,-1.25]} s={[2,.12,1.18]} c='#bdac70'/>{[-.65,0,.65].map(x=><Box key={x} p={[x,.26,-1.3]} s={[.36,.3,.45]} c='#e0e0c9'/>)}</group>)}
 {wrap('arrays',<group ref={wings}>{[-1,1].flatMap(side=>[-1,1].map(sign=><group key={`${side}${sign}`} userData={{sign}} position={[side*8.75,2,-1.5]} rotation={[0,sign<0?Math.PI:0,0]}><Stick a={[0,0,0]} b={[0,0,.7]} r={.07} c='#c4baa0'/><group position={[0,0,.45]}><SolarWing/></group></group>))}</group>)}
 {[-1,1].map(s=><group key={s} position={[s*1.9,2,4.2]}><Box s={[2.3,.06,.9]} c='#465f7d'/>{Array.from({length:9},(_,i)=><Box key={i} p={[-1.02+i*.25,.038,0]} s={[.018,.015,.87]} c='#b1aaa0'/>)}<Stick a={[-s*.4,0,0]} b={[-s*1.1,0,0]} r={.035} c='#b5b6a8'/></group>)}
 {wrap('telemetry',<><Stick a={[0,2.6,.2]} b={[0,3.2,.2]} r={.035} c='#aab6ab'/><mesh position={[0,3.25,.2]} rotation={[-.8,0,0]}><sphereGeometry args={[.38,24,12,0,Math.PI*2,0,.9]}/><meshStandardMaterial color='#cfcdb9' side={T.DoubleSide}/></mesh><group position={[.35,2.8,0]}><Stick a={[0,0,0]} b={[1.1,.65,0]} r={.075} c='#c8cdbb'/><Stick a={[1.1,.65,0]} b={[1.6,.2,-.6]} r={.06} c='#b7b69e'/></group></>)}
 {v>=2&&<mesh geometry={tube}><meshBasicMaterial color='#a9d6ce' transparent opacity={.5} depthWrite={false}/></mesh>}<mesh ref={signal}><sphereGeometry args={[.095,12,8]}/><meshBasicMaterial color='#e4d79b'/></mesh>
 </>;
}
