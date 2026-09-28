import {Box,Stick,Jar,Basket} from './DioramaPrimitives';
import {Roof,RammedWall,Gable,Door,Stairs,Post} from './ArchitecturePrimitives';
import {BuildingReveal} from './BuildingReveal';
import {Bamboo} from './WeiJinArchitecture';
import {Tree,Beams} from './SettlementDetails';
import {BrickPanel} from './ModernPrimitives';
import {WindowBay,Paving} from './LateArchitectureParts';
import type {WeiJinModelProps} from './WeiJinScenes';
type Props=Pick<WeiJinModelProps,'wrap'|'selected'>;
function Lattice({w,h}:{w:number;h:number}){return <><Box p={[0,h/2,0]} s={[w,h,.075]} c='#a4a78c'/>{Array.from({length:Math.ceil(w/.2)},(_,i)=><Box key={i} p={[-w/2+.1+i*.2,h/2,.047]} s={[.027,h,.045]} c='#877858'/>)}{[.1,h*.5,h-.1].map(y=><Box key={y} p={[0,y,.05]} s={[w,.032,.055]} c='#79694f'/>)}</>;}
function StockShelf({w=2.1,pots=false}:{w?:number;pots?:boolean}){return <>{[-1,1].flatMap(s=>[-.3,.3].map(z=><Box key={`${s}${z}`} p={[s*w/2,.85,z]} s={[.08,1.7,.08]} c='#867359'/>))}{[.12,.68,1.24,1.72].map((y,j)=><group key={y}><Box p={[0,y,0]} s={[w+.14,.06,.75]} c='#a18d68'/>{Array.from({length:4},(_,i)=>pots?<group key={i} position={[-w*.35+i*w*.23,y+.03,0]} scale={.22}><Jar/></group>:<Box key={i} p={[-w*.35+i*w*.23,y+.20,0]} s={[.08,.32,.52]} c={j%2?'#8e7452':'#79634b'}/>)}</group>)}</>;}

export function ScholarGarden({wrap,selected}:Props){const open=!!selected&&['chair','joint','scroll','books','study-room'].includes(selected);
 return <>
 {wrap('study-room',<group position={[-1,.30,-.55]}>
  <Box p={[0,-.105,0]} s={[8.3,.39,6.25]} c='#c4bea5'/><RammedWall p={[0,.09,-3]} w={8.2} h={2.65} color='#d2d2b7'/>
  <group position={[-4.02,.09,0]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={6.02} h={2.65} color='#c8ccb0'/><group position={[0,2.65,-.1]}><Gable w={6.02} h={1.16} color='#c8ccb0'/></group></group>
  <group position={[1.65,1.54,-2.86]}><Lattice w={2.1} h={.95}/></group>
  <Box p={[.40,.66,-1.74]} s={[.13,1.15,2.4]} c='#c7c8ac'/><Post x={.40} z={-.52} y={.09} h={2.65} c='#938260'/>
  <BuildingReveal open={open} wall><group position={[4.02,.09,0]} rotation={[0,-Math.PI/2,0]}><RammedWall p={[0,0,0]} w={6.02} h={2.65} color='#cdd0b7'/><group position={[0,2.65,-.1]}><Gable w={6.02} h={1.16} color='#cdd0b7'/></group></group>
   {[-3.38,-1.13,1.13,3.38].map((x,i)=><group key={x} position={[x,.09,3.0]}>{i===1?<><Box p={[0,2.43,0]} s={[2.25,.44,.19]} c='#c9ccb2'/><group position={[0,0,.01]}><Door w={1.30} h={2.18}/></group>{[-1,1].map(s=><Box key={s} p={[s*.92,1.1,0]} s={[.42,2.2,.19]} c='#c9ccb2'/>)}</>:<><RammedWall p={[0,0,0]} w={2.24} h={.72} color='#c9ccb2'/><group position={[0,.76,.02]}><Lattice w={2.18} h={1.67}/></group><Box p={[0,2.56,0]} s={[2.24,.18,.19]} c='#c9ccb2'/></>}</group>)}
   {[-3.9,.40,3.9].map(x=><Post key={x} x={x} z={2.95} y={.09} h={2.65} c='#8a7857'/>)}
  </BuildingReveal>
  <BuildingReveal open={open}><Roof w={8.8} d={6.8} eave={2.71} rise={1.20} material='thatch'/><Beams data={[-3.9,.4,3.9].flatMap(x=>[{a:[x,2.68,-3],b:[x,2.68,3],w:.13},{a:[x,2.68,-3],b:[x,3.84,0],w:.12},{a:[x,3.84,0],b:[x,2.68,3],w:.12}])}/></BuildingReveal>
 </group>)}
 <Stairs p={[-2.12,0,2.7]} width={2.4} height={.30} run={.20}/>
 {wrap('bamboo-path',<><group position={[5.8,0,-4.7]}>{[-1,0,1].map(i=><Bamboo key={i} p={[i*.9,0,Math.sin(i)*.8]}/>)}</group>
 {Array.from({length:19},(_,i)=><Box key={i} p={[2.0+Math.sin(i*.15)*4.9,.025,4.7-i*.49]} s={[.59,.05,.38]} c={i%2?'#a4ad96':'#bbc1a6'}/>)}</>)}
 {[[ -6.5,0,-3.8],[-5.7,0,-6.1],[.8,0,-6.7],[6.8,0,-.2]].map((p,i)=><Tree key={i} p={p as [number,number,number]} size={i===0?1.55:1.16}/>)}
 <group position={[-1.5,0,-7.25]}><RammedWall p={[0,0,0]} w={9.4} h={1.0} color='#b6b99b'/><Box p={[0,1.06,0]} s={[9.6,.14,.47]} c='#8f957c'/></group>
 <group position={[-7,0,.9]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={5.2} h={.74} color='#b6b99b'/><Box p={[0,.8,0]} s={[5.4,.12,.45]} c='#949a80'/></group>
 {Array.from({length:11},(_,i)=><Box key={i} p={[-2.15-i*.24,.035,3.5+i*.20]} s={[.52,.07,.36]} c='#adb397'/>)}</>;
}

export function PorcelainCompound({wrap,selected}:Props){const open=!!selected&&['vase','brush','glaze','yard','clay-room','drying-court'].includes(selected),storeOpen=selected==='rack';return <>
 {wrap('yard',<group position={[-.5,0,1]}><Box p={[0,.025,0]} s={[6.5,.05,5.6]} c='#bab6a0'/>
  <group position={[0,.05,-2.7]}><BrickPanel w={6.3} h={2.75} c='#aeb4a2'/></group>
  <group position={[-3.18,.05,0]} rotation={[0,Math.PI/2,0]}><BrickPanel w={5.45} h={2.75} c='#b3b7a4'/><group position={[0,2.75,-.1]}><Gable w={5.45} h={.95} color='#acb29f'/></group></group>
  <BuildingReveal open={open} wall><group position={[3.18,.05,0]} rotation={[0,-Math.PI/2,0]}><BrickPanel w={5.45} h={2.75} c='#b3b7a4'/><group position={[0,2.75,-.1]}><Gable w={5.45} h={.95} color='#acb29f'/></group></group>{[-2.2,0,2.2].map(x=><group key={x} position={[x,.05,2.7]}><Lattice w={2.12} h={2.12}/><Box p={[0,2.60,0]} s={[2.18,.23,.12]} c='#827457'/></group>)}{[-3.08,-1.06,1.06,3.08].map(x=><Post key={x} x={x} z={2.65} y={.05} h={2.78}/>)}</BuildingReveal>
  <BuildingReveal open={open}><Roof w={6.85} d={5.95} eave={2.84} rise={.94} material='clay'/><Beams data={[-3,-1,1,3].flatMap(x=>[{a:[x,2.72,-2.65],b:[x,2.72,2.65],w:.10},{a:[x,2.35,-2.65],b:[x,3.05,-1.25],w:.08},{a:[x,2.35,2.65],b:[x,3.05,1.25],w:.08}])}/></BuildingReveal>
 </group>)}
 {wrap('rack',<group position={[4.5,.2,-2.25]} rotation={[0,Math.PI/2,0]}><Box p={[0,-.08,0]} s={[8.9,.24,2.1]} c='#aab09c'/><group position={[0,.04,-.97]}><BrickPanel w={8.8} h={2.35} c='#adb29f'/></group>{[-4.4,4.4].map(x=><BuildingReveal key={x} open={selected==='rack'&&x<0} wall><group position={[x,.04,0]} rotation={[0,Math.PI/2,0]}><BrickPanel w={2} h={2.35} c='#a9af9c'/><group position={[0,2.35,-.10]}><Gable w={2} h={.5} color='#adb29f'/></group></group></BuildingReveal>)}<BuildingReveal open={storeOpen}><Roof w={9.25} d={2.6} eave={2.43} rise={.48} material='clay'/>{[-4.1,-2.05,0,2.05,4.1].map(x=><Post key={x} x={x} z={.97} h={2.40}/>)}</BuildingReveal><group position={[1.9,.05,0]}><StockShelf w={2.3} pots/></group></group>)}
 {wrap('clay-room',<group position={[-5.65,0,-5.3]} rotation={[0,Math.PI/2,0]}><Box p={[0,.12,0]} s={[5.5,.24,2.8]} c='#acb09a'/><group position={[0,.24,-1.22]}><BrickPanel w={5.3} h={2.0} c='#b3b5a1'/></group>{[-2.6,2.6].map(x=><BuildingReveal key={x} open={selected==='clay-room'} wall><group position={[x,.24,0]} rotation={[0,Math.PI/2,0]}><BrickPanel w={2.6} h={2}/><group position={[0,2,-.1]}><Gable w={2.6} h={.6} color='#acb19c'/></group></group></BuildingReveal>)}<BuildingReveal open={selected==='clay-room'}><Roof w={5.8} d={3.1} eave={2.29} rise={.60} material='clay'/>{[-2.5,0,2.5].map(x=><Post key={x} x={x} z={1.17} y={.24} h={2.02}/>)}</BuildingReveal><Box p={[-1.15,.4,0]} s={[1.8,.35,1.9]} c='#9f9f86'/><Box p={[-1.15,.59,0]} s={[1.5,.05,1.6]} c='#bdb198'/><group position={[1.25,.24,0]} scale={.65}><Jar/></group></group>)}
 {wrap('drying-court',<><Paving p={[-.35,.055,-5.25]} w={5.65} d={6.2}/>{[-7,-5].map(z=><group key={z} position={[-.55,0,z]}><Box p={[0,.83,0]} s={[3.6,.08,1.25]} c='#b09b76'/>{[-1.55,1.55].flatMap(x=>[-.4,.4].map(d=><Box key={`${x}${d}`} p={[x,.4,d]} s={[.1,.8,.1]} c='#938263'/>))}{[-1.3,-.45,.45,1.3].map(x=><group key={x} position={[x,.88,0]} scale={.24}><Jar/></group>)}</group>)}<group position={[1.8,.06,-3.2]} scale={.55}><Basket/></group></>)}
 <group position={[0,0,-9]}><BrickPanel w={12.2} h={1.65} c='#adb09c'/><Box p={[0,1.73,0]} s={[12.5,.16,.41]} c='#727e6c'/></group>
 <Paving p={[0,.035,4.8]} w={12.8} d={1.6}/><Tree p={[-6.6,0,2.5]} size={.9}/></>;
}

export function NewyearCourts({wrap,selected}:Props){const open=!!selected&&['keyblock','colorblock','painting','motif','courtyard','block-store'].includes(selected);return <>
 {wrap('courtyard',<>
 <group position={[-1.9,0,.65]}><Box p={[0,-.01,0]} s={[6.55,.06,4.4]} c='#b2b3a0'/><group position={[0,0,-2.05]}><BrickPanel w={6.5} h={2.8} c='#909f94'/></group>
 <group position={[-3.25,0,0]} rotation={[0,Math.PI/2,0]}><BrickPanel w={4.1} h={2.85} c='#96a397'/><group position={[0,2.85,-.1]}><Gable w={4.1} h={1.04} color='#98a396'/></group></group>
 <BuildingReveal open={open} wall><group position={[3.25,0,0]} rotation={[0,Math.PI/2,0]}><BrickPanel w={4.1} h={2.85} c='#96a397'/><group position={[0,2.85,-.1]}><Gable w={4.1} h={1.04} color='#98a396'/></group></group>{[-2.15,0,2.15].map(x=><group key={x} position={[x,0,2.05]}><Lattice w={2.06} h={2.5}/><Box p={[0,2.67,0]} s={[2.15,.3,.16]} c='#827155'/></group>)}{[-3.16,-1.06,1.06,3.16].map(x=><Post key={x} x={x} z={2.04} h={2.8} c='#886d51'/>)}</BuildingReveal>
 <BuildingReveal open={open}><Roof w={6.35} d={4.55} eave={2.87} rise={1.04} material='clay'/><Beams data={[-3.16,0,3.16].flatMap(x=>[{a:[x,2.78,-2],b:[x,2.78,2],w:.18,c:'#796349'},{a:[x,3.20,-1.12],b:[x,3.20,1.12],w:.15,c:'#8f7454'}])}/></BuildingReveal></group>
 <group position={[3.35,0,-1.8]} rotation={[0,Math.PI/2,0]}><Box p={[0,-.01,0]} s={[8.7,.06,3.0]} c='#b5b8a4'/><BuildingReveal open={open} wall><group position={[0,0,-1.50]}><BrickPanel w={8.7} h={3.1} c='#929f91'/></group></BuildingReveal>
 <group position={[4.35,0,0]} rotation={[0,Math.PI/2,0]}><BrickPanel w={3} h={3.15} c='#93a091'/><group position={[0,3.15,-.1]}><Gable w={3} h={.95} color='#93a091'/></group></group>
 <BuildingReveal open={open} wall><group position={[-4.35,0,0]} rotation={[0,Math.PI/2,0]}>{[-1,1].map(s=><group key={s} position={[s*1.07,0,0]}><BrickPanel w={.86} h={3.15} c='#93a091'/></group>)}<group position={[0,2.25,0]}><BrickPanel w={1.3} h={.9} c='#93a091'/></group><Door w={1.22} h={2.25}/><group position={[0,3.15,-.1]}><Gable w={3} h={.95} color='#93a091'/></group><Beams data={[{a:[-1.62,3.21,0],b:[0,4.17,0],w:.18,c:'#71816e'},{a:[0,4.17,0],b:[1.62,3.21,0],w:.18,c:'#71816e'}]}/></group><group position={[0,0,1.5]}>{[-3.25,-1.08,1.08,3.25].map(x=><group key={x} position={[x,0,0]}><WindowBay w={2.17} h={3.12} ww={1.65} wh={1.7} sill={.85} brick c='#96a393' frame='#8c7d60'/></group>)}</group></BuildingReveal>
 <BuildingReveal open={open}><Roof w={8.45} d={3.48} eave={3.18} rise={.94} material='clay'/><Beams data={[-4.2,-2.1,0,2.1,4.2].map(x=>({a:[x,3.05,-1.4],b:[x,3.05,1.4],w:.18,c:'#806b50'}))}/></BuildingReveal>
 </group><Box p={[3.35,1.05,-2.30]} s={[2.7,2.1,.12]} c='#b7b39a'/><group position={[3.35,0,-4.8]}><StockShelf w={2}/></group>
 </>)}
 {wrap('block-store',<group position={[-6.35,.18,-5.35]} rotation={[0,Math.PI/2,0]}><Box p={[0,-.09,0]} s={[5.1,.18,2.45]} c='#a9b39f'/><group position={[0,0,-1.12]}><BrickPanel w={4.9} h={2.15} c='#9fab9c'/></group>{[-2.45,2.45].map(x=><BuildingReveal key={x} open={selected==='block-store'&&x<0} wall><group position={[x,0,0]} rotation={[0,Math.PI/2,0]}><BrickPanel w={2.25} h={2.15} c='#9fab9c'/><group position={[0,2.15,-.1]}><Gable w={2.25} h={.56} color='#9eaa98'/></group></group></BuildingReveal>)}<BuildingReveal open={selected==='block-store'}><Roof w={5.3} d={2.7} eave={2.21} rise={.56} material='clay'/>{[-2.3,0,2.3].map(x=><Post key={x} x={x} z={1.08} h={2.18}/>)}</BuildingReveal>{[-1.25,1.25].map(x=><group key={x} position={[x,0,0]}><StockShelf w={1.8}/></group>)}</group>)}
 <Paving p={[.6,.035,-5.2]} w={9.6} d={4.2}/><group position={[.6,0,-8]}><BrickPanel w={12.7} h={2.0} c='#9eaa9a'/><Box p={[0,2.08,0]} s={[12.9,.16,.45]} c='#6e7d6d'/></group>
 {[-1.8,.3,2.4].map(x=><group key={x} position={[x,0,-5.3]}><Stick a={[-.88,0,0]} b={[-.88,1.75,0]} r={.04}/><Stick a={[.88,0,0]} b={[.88,1.75,0]} r={.04}/><Box p={[0,1.70,0]} s={[1.94,.07,.07]} c='#988365'/>{[-.5,0,.5].map(t=><Box key={t} p={[t,1.26,0]} s={[.44,.75,.014]} c='#d5cfb0'/>)}</group>)}
 {wrap('gate-lane',<><Paving p={[.1,.04,4.4]} w={14.7} d={1.9}/><group position={[6.75,0,3.2]} rotation={[0,Math.PI/2,0]}>{[-1,1].map(s=><group key={s} position={[s*1.22,0,0]}><BrickPanel w={.68} h={2.4} c='#95a190'/></group>)}<Box p={[0,2.34,0]} s={[3.15,.24,.56]} c='#867359'/><Roof w={3.5} d={1.9} eave={2.55} rise={.51} material='clay'/></group><group position={[5.6,0,.1]}><BrickPanel w={2.1} h={1.92} c='#9daa96'/><Box p={[0,2.0,0]} s={[2.35,.14,.47]} c='#6c7c6b'/></group><Paving p={[7,.035,-2]} w={1.3} d={7.8}/></>)}
 <Tree p={[4.8,0,-6.4]} size={1.05}/><group position={[-6.5,.02,2.0]} scale={.65}><Basket/></group></>;
}
