import {useEffect,useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {Box,Blocks,Stick,type Block} from './DioramaPrimitives';
import HighspeedTrain from './HighspeedTrain';
import {HEAD_X,PANTO_X,TRAIN_Z} from './highspeed-train-geometry';
import {Beams} from './SettlementDetails';
import {BuildingReveal} from './BuildingReveal';
import {Site,Sign,Bench} from './NewEraPrimitives';
import {newEraLayouts} from './new-era-layouts';
import type {WeiJinModelProps} from './WeiJinScenes';

export default function HighspeedScene({value,wrap,selected}:WeiJinModelProps){
 const air=useRef<T.Group>(null),power=useRef<T.Group>(null);
 const curves=useMemo(()=>[-1,0,1].map(s=>new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(HEAD_X+4.7,1.3,TRAIN_Z+s*.3),new T.Vector3(HEAD_X+2.4,2.35,TRAIN_Z+s*.85),new T.Vector3(HEAD_X,2.65,TRAIN_Z+s*1.15),new T.Vector3(HEAD_X-2,2.55,TRAIN_Z+s*1.15)]),48,.014,5,false)),[]);useEffect(()=>()=>curves.forEach(g=>g.dispose()),[curves]);
 useFrame(()=>{const v=value();if(air.current)air.current.visible=v>0&&v<2;if(power.current)power.current.visible=v>=1&&v<2;});
 const track=useMemo(()=>{const b:Block[]=[];for(let i=0;i<144;i++)for(const z of [2.55,5.02]){const x=-25.2+i*.37;b.push({p:[x,.09,z],s:[.18,.16,1.7],c:i%3?'#8d9a90':'#9eaa9d'});for(const sign of [-1,1])b.push({p:[x,.2,z+sign*.56],s:[.20,.06,.18],c:'#6d807a'});}return b;},[]);
 return <><Site outline={newEraLayouts.highspeed.outline} color='#b6bfb3'/><Blocks data={track}/>{[2.55,5.02].flatMap(z=>[-1,1].map(s=><Box key={`${z}${s}`} p={[1.2,.25,z+s*.56]} s={[53,.08,.068]} c='#617a76'/>))}
 {wrap('platform',<><Box p={[-.8,.45,-.4]} s={[47,.82,3.6]} c='#b8beb0'/><Box p={[-.8,.885,1.04]} s={[47,.045,.14]} c='#c8ae5f'/>{Array.from({length:150},(_,i)=><Box key={i} p={[-23.8+i*.31,.894,.73]} s={[.15,.028,.13]} c='#d0bd79'/>)}<Bench p={[-6.2,.86,-.9]} w={2.7}/><Bench p={[-.3,.86,-.9]} w={2.7}/><Bench p={[5.5,.86,-.9]} w={2.7}/><Bench p={[-17,.86,-.9]} w={2.7}/><Bench p={[16,.86,-.9]} w={2.7}/></>)}
 {wrap('canopy',<>{[-20.25,-15.75,-11.25,-6.75,-2.25,2.25,6.75,11.25,15.75,20.25].map(x=><group key={x}><Box p={[x,2.02,-1.5]} s={[.18,2.35,.20]} c='#889c94'/><Beams data={[{a:[x,2.65,-1.5],b:[x,3.62,-3.2],w:.12,c:'#8ca299'},{a:[x,2.65,-1.5],b:[x,3.62,.6],w:.12,c:'#8ca299'},{a:[x,3.45,-3.2],b:[x,3.45,.6],w:.10,c:'#98aba1'}]}/></group>)}<BuildingReveal open={selected==='canopy'||selected==='platform'||selected==='concourse'}>{Array.from({length:86},(_,i)=><Box key={i} p={[-22.1+i*.52,3.68,-1.3]} s={[.50,.10,4.25]} c={i%6===0?'#abc6c0':'#d4dbca'}/>)}<Box p={[0,3.78,-3.45]} s={[45,.09,.13]} c='#869f94'/><Box p={[0,3.78,.85]} s={[45,.09,.13]} c='#869f94'/></BuildingReveal>{[-18,-7,4,15].map(x=><group key={x} position={[x,3.02,.25]}><Sign text='01  |  站台' w={1.9} h={.48}/></group>)}</>)}
 {wrap('concourse',<group position={[-.7,0,-5.45]}><Box p={[0,.57,0]} s={[17.2,1.14,3.8]} c='#a8b4aa'/><Box p={[0,2.35,-1.85]} s={[16.7,2.5,.12]} c='#88a7a3'/>{[-8.3,8.3].map(x=><Box key={x} p={[x,2.35,0]} s={[.13,2.5,3.7]} c='#8ca9a2'/>)}<BuildingReveal open={selected==='concourse'} wall><Box p={[0,2.35,1.78]} s={[16.7,2.5,.07]} c='#9ab4ac'/>{Array.from({length:18},(_,i)=><Box key={i} p={[-8.15+i*.96,2.38,1.84]} s={[.06,2.62,.08]} c='#d0d5c1'/>)}</BuildingReveal><BuildingReveal open={selected==='concourse'}>{Array.from({length:36},(_,i)=>{const x=-8.7+(i+.5)*.49;return <Box key={i} p={[x,3.75+.30*Math.cos(x/17*Math.PI),0]} s={[.49,.16,4.25]} c={i%5?'#d4dccd':'#a1bbb2'}/>;})}</BuildingReveal>{[-5,0,5].map(x=><Bench key={x} p={[x,1.14,0]} w={2.8}/>)}<group position={[-5,3.3,1.92]}><Sign text='候车  /  出发' w={2.7} h={.48}/></group></group>)}
 <BuildingReveal open={selected==='concourse'}>{wrap('solar-roof',<group position={[2.6,4.13,-5.45]}>{Array.from({length:20},(_,i)=><Box key={i} p={[(i%5)*.8-1.6,0,Math.floor(i/5)*.7-1.05]} s={[.74,.035,.64]} c={i%3?'#536e78':'#6e8990'}/>)}</group>)}</BuildingReveal>
 <group position={[9.6,0,-3.5]}>{Array.from({length:8},(_,i)=><Box key={i} p={[0,(8-i)*.07,i*.22]} s={[1.65,(8-i)*.14,.22]} c='#aab6a9'/>)}<Beams data={[-.87,.87].map(x=>({a:[x,2,-.1],b:[x,.9,1.8],w:.055,c:'#728c83'}))}/></group>
 {wrap('power',<>{[-24,-14,-4,6,16,26].map(x=><group key={x}><Box p={[x,2.1,6.0]} s={[.13,4.2,.14]} c='#8b9e94'/><Stick a={[x,4.02,6]} b={[x,3.65,2.55]} r={.034} c='#70897e'/><Stick a={[x,3.65,2.55]} b={[x,3.47,2.55]} r={.025} c='#89998b'/></group>)}<Stick a={[-25.3,3.48,2.55]} b={[27.6,3.48,2.55]} r={.014} c='#657a72'/><Stick a={[-25.3,3.79,2.55]} b={[27.6,3.79,2.55]} r={.012} c='#81958b'/></>)}
 <HighspeedTrain value={value} wrap={wrap}/>
 <group ref={air}>{curves.map((g,i)=><mesh key={i} geometry={g}><meshBasicMaterial color='#a1b9b0' transparent opacity={.6} depthWrite={false}/></mesh>)}</group><group ref={power}><Stick a={[PANTO_X,3.51,TRAIN_Z]} b={[PANTO_X+4,3.51,TRAIN_Z]} r={.026} c='#c9ac57'/><Stick a={[PANTO_X,2.37,TRAIN_Z]} b={[PANTO_X,3.51,TRAIN_Z]} r={.023} c='#c9ac57'/></group>
 </>;
}
