import {useMemo,type ReactNode} from 'react';
import {Blocks,Box,Jar,Mat,type Block} from './DioramaPrimitives';
import {RammedWall,Roof,Gable,Door,Stairs} from './ArchitecturePrimitives';
import {Beams,Frame,Tree,Fuel,Bundles,YarnRack,noise} from './SettlementDetails';
import {BuildingReveal} from './BuildingReveal';
import type {Point} from './exhibits';
type Props={wrap:(id:string,children:ReactNode)=>ReactNode;selected?:string|null};

function Wall({p,w,h=1.6,turn=false,c='#b9a17e'}:{p:Point;w:number;h?:number;turn?:boolean;c?:string}){return <group position={p} rotation={[0,turn?Math.PI/2:0,0]}><RammedWall p={[0,0,0]} w={w} h={h} t={.36} color={c}/><Box p={[0,h+.025,0]} s={[w+.06,.06,.4]} c={c}/></group>;}
function Platform({p,w,d,h}:{p:Point;w:number;d:number;h:number}){return <group position={p}><Box p={[0,h/2,0]} s={[w,h,d]} c='#a58c69'/><Blocks data={Array.from({length:Math.ceil(h/.16)},(_,i)=>({p:[0,.08+i*.16,0],s:[w+.02,.025,d+.02],c:i%2?'#b8a07a':'#ad9571'}))}/><Box p={[0,h+.018,0]} s={[w-.08,.036,d-.08]} c='#c6b594'/></group>;}
function Windows({p,w=1.25,h=1.25}:{p:Point;w?:number;h?:number}){return <group position={p}><Box s={[w+.14,h+.15,.12]} c='#594f3d'/><Blocks data={[...Array.from({length:Math.ceil(w/.13)},(_,i)=>({p:[-w/2+i*.13,0,.075] as Point,s:[.04,h,.05] as Point,c:'#997955'})),...[-h/2,0,h/2].map(y=>({p:[0,y,.075] as Point,s:[w,.06,.05] as Point,c:'#98754f'}))]}/></group>;}
function Jars({p,count=4}:{p:Point;count?:number}){return <group position={p}>{Array.from({length:count},(_,i)=><group key={i} position={[(i%3)*.68,0,Math.floor(i/3)*.7]}><Jar size={.48+i%2*.1}/></group>)}</group>;}
function Well({p,wood=false}:{p:Point;wood?:boolean}){return <group position={p}><Box p={[0,-.155,0]} s={[1.42,.1,1.42]} c='#445d52'/><Blocks data={Array.from({length:20},(_,i)=>{const side=i%4,y=Math.floor(i/4);return {p:[side===0?-.74:side===1?.74:0,.045+y*.12,side===2?-.74:side===3?.74:0],s:side<2?[.14,.11,1.62]:[1.34,.11,.14],c:wood?'#776044':'#a99778'};})}/><Beams data={[{a:[-.99,0,0],b:[-.99,2,0],w:.16},{a:[.99,0,0],b:[.99,2,0],w:.16},{a:[-1.15,2,0],b:[1.15,2,0],w:.18},{a:[0,1.95,0],b:[0,.4,0],w:.025,c:'#bea276'}]}/></group>;}

/** Zhou: a narrow sequence of gate, forecourt, hall, rear court and rooms. */
export function ZhouCompound({wrap}:Props){return <>
 {wrap('setting',<><Platform p={[0,0,-3.4]} w={9.5} d={4.15} h={.44}/><group position={[0,.48,-3.4]}><Wall p={[0,0,-1.65]} w={8.8} h={2.2} c='#c7b591'/><Wall p={[-4.3,0,0]} w={3.5} h={2.2} turn/><Wall p={[4.3,0,0]} w={3.5} h={2.2} turn/><Frame w={8.3} d={3.15} h={2.35} bays={4}/><Roof w={9.65} d={4.65} eave={2.43} rise={1.18} material='reed'/>{[-4.4,4.4].map(x=><group key={x} position={[x,2.3,0]} rotation={[0,Math.PI/2,0]}><Gable w={3.8} h={1.19} color='#c7b591'/></group>)}{[-2.4,0,2.4].map(x=><group key={x} position={[x,0,-1.43]}><Door w={1.25} h={1.85}/></group>)}</group><Stairs p={[0,0,-1.22]} width={3.2} height={.45} steps={3}/>
 <Wall p={[-5.7,0,-3.4]} w={19} turn/><Wall p={[5.7,0,-3.4]} w={19} turn/><Wall p={[0,0,-12.9]} w={11.4}/>
 {[-1,1].map(side=><group key={side} position={[side*3.05,0,5.4]}><Platform p={[0,0,0]} w={3.6} d={2.3} h={.12}/><Wall p={[0,.12,-.9]} w={3.3} h={1.35}/><Wall p={[0,.12,.9]} w={3.3} h={1.35}/><Wall p={[side*1.53,.12,0]} w={1.8} h={1.35} turn/><Frame w={3} d={1.65} h={1.56} bays={2}/><Roof w={3.9} d={2.7} eave={1.65} rise={.66} material='reed'/></group>)}<Beams data={[{a:[-1.23,0,5.4],b:[-1.23,1.78,5.4],w:.17},{a:[1.23,0,5.4],b:[1.23,1.78,5.4],w:.17},{a:[-1.4,1.78,5.4],b:[1.4,1.78,5.4],w:.2}]}/><Box p={[0,.02,6.25]} s={[2.45,.04,2.7]} c='#cbb790'/></>)}
 {wrap('rear-court',<><Box p={[0,.025,-7.4]} s={[8.8,.05,3.5]} c='#c9b998'/><Platform p={[0,0,-10.95]} w={9.1} d={3.45} h={.28}/><group position={[0,.32,-10.95]}><Wall p={[0,0,-1.45]} w={8.5} h={1.95}/><Wall p={[-4.12,0,0]} w={2.9} h={1.95} turn/><Wall p={[4.12,0,0]} w={2.9} h={1.95} turn/><Wall p={[0,0,1.45]} w={8.5} h={1.95}/>{[-2.6,0,2.6].map(x=><group key={x} position={[x,0,1.68]}><Door h={1.65}/></group>)}<Frame w={8} d={2.8} h={2.08} bays={4}/><Roof w={9.5} d={3.95} eave={2.13} rise={.98} material='reed'/>{[-4.2,4.2].map(x=><group key={x} position={[x,1.95,0]} rotation={[0,Math.PI/2,0]}><Gable w={2.9} h={1.1} color='#b9a17e'/></group>)}</group><Stairs p={[0,0,-9.16]} width={1.7} height={.3} steps={2}/></>)}
 {wrap('side-court',<group position={[-4.28,0,-6.95]}><Platform p={[0,0,0]} w={2.15} d={2.65} h={.2}/><Wall p={[-.95,.23,0]} w={2.4} h={1.62} turn/><Wall p={[0,.23,-1.15]} w={1.9} h={1.62}/><Frame w={1.75} d={2.15} h={1.88} bays={1}/><group rotation={[0,Math.PI/2,0]}><Roof w={2.9} d={2.6} eave={1.94} rise={.6} material='reed'/></group><Jars p={[-.5,.25,.45]} count={2}/></group>)}
 <Tree p={[-5.25,0,1.9]} size={.72}/><Jars p={[4.3,.025,-.3]} count={3}/><group position={[2.6,.04,-7.3]}><Mat w={1.5} d={1.2}/></group>
 </>;}

/** A sloping work canopy, not a miniature ritual hall. */
function WorkCanopy(){
 const roof=useMemo(()=>{const b:Block[]=[];for(let x=-4.4;x<=4.4;x+=.14)for(let z=-1.75;z<=1.75;z+=.15)b.push({p:[x,2.35-z*.23,z],s:[.14,.11,.15],c:['#aa8c55','#b49a66','#beaa7a'][Math.floor(noise(x,z)*3)]});return b;},[]);
 return <><Blocks data={roof}/><Beams data={[-4,-2,0,2,4].flatMap(x=>[{a:[x,0,-1.4],b:[x,2.66,-1.4],w:.14},{a:[x,0,1.4],b:[x,2.03,1.4],w:.14},{a:[x,2.7,-1.7],b:[x,1.96,1.7],w:.12}])}/><Beams data={[-1.4,1.4].map(z=>({a:[-4.4,2.32-z*.23,z],b:[4.4,2.32-z*.23,z],w:.14}))}/><Wall p={[0,0,-1.45]} w={8.2} h={.85}/></>;
}
export function ShangWorksite({wrap}:Props){return <>
 {wrap('mould-yard',<group position={[-3.15,0,-5.15]} rotation={[0,-.18,0]}><Platform p={[0,0,0]} w={9.2} d={4} h={.16}/><group position={[0,.19,0]}><WorkCanopy/><Frame w={7} d={.85} h={.55} bays={4}/><Box p={[0,.62,0]} s={[7.5,.12,1.1]} c='#967a54'/><Blocks data={Array.from({length:18},(_,i)=>({p:[-3.3+i%9*.78,.81,Math.floor(i/9)*.51-.25],s:[.4,.26,.38],c:i%2?'#c1a682':'#ae9370'}))}/></group></group>)}
 {wrap('store',<group position={[7.15,0,-4.7]} rotation={[0,.28,0]}><Platform p={[0,0,0]} w={3.8} d={3.35} h={.13}/><Wall p={[0,.14,-1.45]} w={3.35} h={1.34}/><Wall p={[-1.58,.14,0]} w={2.9} h={1.34} turn/><Wall p={[1.58,.14,0]} w={2.9} h={1.34} turn/>{[-1.2,1.2].map(x=><Wall key={x} p={[x,.14,1.45]} w={.95} h={1.34}/>)}<Roof w={4.15} d={3.95} eave={1.55} rise={1.18} material='thatch' hip/><Jars p={[-.55,.14,.2]} count={2}/></group>)}
 {wrap('fuel-yard',<><Box p={[-7.6,.03,.15]} s={[4.2,.06,4.5]} c='#b29a71'/><Fuel p={[-8.25,.04,-.65]} w={2.1}/><Fuel p={[-8.25,.04,.75]} w={2.1}/><Bundles p={[-7.1,.04,1.5]} count={6}/><Beams data={[{a:[-9.25,0,-1.8],b:[-9.25,.85,-1.8],w:.1},{a:[-9.25,0,2.2],b:[-9.25,.85,2.2],w:.1},{a:[-9.25,.6,-1.8],b:[-9.25,.6,2.2],w:.06}]}/></>)}
 <Box p={[4.35,.02,.1]} s={[3.7,.04,3.2]} c='#8f765a'/><Blocks data={Array.from({length:65},(_,i)=>({p:[3.1+noise(i,1)*3,.065,noise(i,3)*2.8-1.3],s:[.12,.055,.15],c:i%3?'#6d6656':'#a07952'}))}/><Box p={[-4.85,-.32,1.65]} s={[1.55,.07,1.6]} c='#81704f'/><Jars p={[7,.025,-1.4]} count={5}/><Fuel p={[6.85,.025,2.25]} w={1.5}/><Tree p={[-8.8,0,-6.4]} size={.72}/><Tree p={[2,0,-7.65]} size={.8}/>
 </>;}

export function ChuTerrace({wrap}:Props){return <>
 {wrap('gallery',<><Platform p={[-.45,0,-1.65]} w={13.8} d={12.2} h={.66}/><Platform p={[-.45,.68,-1.65]} w={13.1} d={11.7} h={.58}/><Stairs p={[.1,0,4.28]} width={4.1} height={1.3} steps={7} run={.26}/></>)}
 {wrap('high-terrace',<><Platform p={[-.45,1.3,-5.8]} w={11.8} d={4.8} h={1.05}/><Platform p={[-.45,2.37,-5.8]} w={11.15} d={4.3} h={.35}/><group position={[-.45,2.76,-5.8]}><Frame w={10} d={3.35} h={2.85} bays={5} color='#7b4532'/><Wall p={[0,0,-1.65]} w={10.3} h={2.65} c='#c5b698'/><Wall p={[-5.05,0,0]} w={3.3} h={2.65} turn c='#c5b698'/><Wall p={[5.05,0,0]} w={3.3} h={2.65} turn c='#c5b698'/>{[-3.7,-1.25,1.25,3.7].map(x=><group key={x} position={[x,0,-1.42]}><Door w={1.35} h={2.1}/></group>)}<Roof w={12.15} d={6.15} eave={2.95} rise={1.45} material='clay' hip/><Beams data={[-4,-2,0,2,4].map(x=>({a:[x,2.5,1.67],b:[x,2.85,2.38],w:.13,c:'#7b4532'}))}/></group><Stairs p={[3.95,1.3,-3.23]} width={2.1} height={1.45} steps={8} run={.21}/></>)}
 {wrap('long-gallery',<><group position={[-6,1.3,-.5]} rotation={[0,Math.PI/2,0]}><Frame w={4.1} d={1.3} h={1.88} bays={2} color='#7b4532'/><Roof w={4.85} d={2} eave={1.95} rise={.55} material='clay'/></group><group position={[6.66,0,.6]} rotation={[0,Math.PI/2,0]}><Stairs p={[0,0,0]} width={1.85} height={1.3} steps={7} run={.3}/></group><Box p={[7.6,.1,-2.3]} s={[1.8,.2,3.8]} c='#b7a486'/></>)}
 <Tree p={[-8.6,0,-6.8]} size={.9}/><Tree p={[7.8,0,-6.4]} size={.9}/><Tree p={[-8.4,0,3.1]} size={.72}/>
 </>;}

/** Han dwelling: a single deep envelope, partitioned rooms and a side service court. */
export function HanResidence({wrap,selected}:Props){
 const open=!!selected&&['room','residence','lamp','shade','smoke','mat'].includes(selected);
 return <>
 <Platform p={[-.35,0,-.6]} w={11.2} d={9.2} h={.4}/>
 {wrap('room',<group position={[-.35,.44,-.6]}><Wall p={[0,0,-4.1]} w={10.6} h={2.76} c='#c6b697'/><Wall p={[-5.1,0,0]} w={8.3} h={2.76} turn c='#c6b697'/><BuildingReveal open={open} wall><Wall p={[5.1,0,0]} w={8.3} h={2.76} turn c='#c6b697'/>{[-3.45,3.45].map(x=><Wall key={x} p={[x,0,3.65]} w={3.35} h={2.76} c='#c6b697'/>)}<Wall p={[0,2.18,3.65]} w={3.6} h={.58} c='#c6b697'/><Windows p={[-3.45,1.65,3.86]} w={1.8}/><Windows p={[3.45,1.65,3.86]} w={1.8}/></BuildingReveal><BuildingReveal open={open}><Frame w={10} d={7.7} h={2.85} bays={4} color='#754935'/></BuildingReveal><BuildingReveal open={open}><Roof w={12.1} d={10.1} eave={2.99} rise={1.45} material='clay' hip/></BuildingReveal></group>)}
 {wrap('residence',<><group position={[-.35,.44,-.6]}>{[-3.75,0,3.75].map(x=><group key={x}><Wall p={[x,0,-1.62]} w={2.6} h={1.72} c='#b9a584'/><group position={[x,0,-1.4]}><Door w={.9} h={1.57}/></group></group>)}{[-1.65,1.65].map(x=><Wall key={x} p={[x,0,-2.8]} w={2.7} h={1.72} turn c='#b9a584'/>)}<group position={[-3.4,.025,-2.8]}><Mat w={2.1} d={1.8}/></group><Box p={[3.55,.36,-2.9]} s={[1.65,.68,.85]} c='#85603f'/><Jars p={[-.65,.03,-3.4]} count={3}/></group><Box p={[-4.48,.5,-4.7]} s={[1.3,.12,.85]} c='#75533b'/></>)}
 {wrap('service-court',<><Wall p={[8.5,0,-.7]} w={8.5} h={1.65} turn/><Wall p={[6.7,0,-4.95]} w={3.6} h={1.65}/><Wall p={[7.1,0,3.55]} w={2.8} h={1.45}/><Well p={[6.7,.03,.45]}/><Jars p={[5.9,.03,-3.25]} count={5}/><Box p={[6.75,.25,-2.8]} s={[2.15,.5,1.3]} c='#a08c69'/><Fuel p={[6.9,.025,2.45]} w={1.35}/></>)}
 <Stairs p={[-.35,0,4.08]} width={3.5} height={.42} steps={4} run={.34}/><Tree p={[-7.6,0,-3.5]} size={1.15}/><Tree p={[-7.3,0,2.5]} size={.82}/><Box p={[0,.015,5.85]} s={[3.45,.03,1.6]} c='#baaa87'/>
 </>;
}

/** Weaving: long horizontal production bays with an end store, not a courtyard. */
export function HanWeavingHouse({wrap,selected}:Props){
 const open=!!selected&&['workshop','loom','cloth','shuttle','yarn','storehouse'].includes(selected);
 return <>
 <Platform p={[0,0,-.5]} w={18.2} d={7.1} h={.1}/>
 {wrap('workshop',<group position={[0,.14,-.5]}><Wall p={[0,0,-3.15]} w={17.7} h={2.5} c='#b9aa8b'/><Wall p={[-8.7,0,0]} w={6.3} h={2.5} turn/><BuildingReveal open={open} wall><Wall p={[8.7,0,0]} w={6.3} h={2.5} turn/><Wall p={[-7,0,2.7]} w={3.1} h={2.5}/><Wall p={[7,0,2.7]} w={3.1} h={2.5}/>{[-3.9,3.9].map(x=><Wall key={x} p={[x,0,2.7]} w={1.1} h={2.5}/>)}<Wall p={[0,2.2,2.7]} w={11.3} h={.3}/></BuildingReveal><BuildingReveal open={open}><Frame w={17.2} d={5.8} h={2.64} bays={8}/></BuildingReveal><BuildingReveal open={open}><Roof w={19.05} d={7.65} eave={2.78} rise={1.05} material='clay'/>{[-8.8,8.8].map(x=><group key={x} position={[x,2.5,0]} rotation={[0,Math.PI/2,0]}><Gable w={6.3} h={1.3} color='#b9aa8b'/></group>)}</BuildingReveal><Windows p={[-5.7,1.65,-2.94]} w={1.6}/><Windows p={[5.7,1.65,-2.94]} w={1.6}/><BuildingReveal open={open}><Beams data={[-6.45,-4.3,-2.15,0,2.15,4.3,6.45].map(x=>({a:[x,2.63,-2.9],b:[x,3.54,0],w:.13}))}/></BuildingReveal></group>)}
 {wrap('storehouse',<><Wall p={[-5.3,.14,-1.45]} w={3.65} h={1.45} turn/><Bundles p={[-7.8,.14,-2.8]} count={12}/><Bundles p={[-7.8,.14,-.8]} count={9}/><group position={[-7.1,.14,-1.5]}><Frame w={2.3} d={1.05} h={1.7} bays={2}/><Box p={[0,1.1,0]} s={[2.5,.12,1.1]} c='#967751'/></group><Jars p={[6.4,.14,-2.3]} count={6}/></>)}
 {wrap('yarn-court',<><YarnRack p={[-5.65,0,4.4]} w={4.3}/><YarnRack p={[-5.65,0,6.1]} w={4.3}/><YarnRack p={[3.1,0,5.25]} w={3.5}/><group position={[-1.8,.02,4.1]}><Mat w={1.4} d={2.5}/></group></>)}
 <Blocks data={Array.from({length:32},(_,i)=>({p:[9.55,-.04,-4.45+i*.36],s:[.54,.035,.34],c:i%2?'#82978b':'#90a399'}))}/><Box p={[9.55,.07,3.1]} s={[1.2,.14,1.4]} c='#a89370'/><Tree p={[-9.6,0,4.8]} size={.73}/><Tree p={[7.7,0,6.3]} size={.88}/>
 </>;
}

/** Qin administrative setting: the street and earthen enclosure determine the plan. */
export function QinStreetOffice({wrap,selected}:Props){
 const open=!!selected&&['office','slips','bundle','table','archive-yard'].includes(selected);
 return <>
 <Box p={[7.1,.015,-1.9]} s={[3.1,.03,16.4]} c='#c4b28d'/><Box p={[-1.25,.016,-6.5]} s={[16,.032,2.65]} c='#c4b28d'/><Blocks data={Array.from({length:32},(_,i)=>({p:[5.15,.024,-9.2+i*.45],s:[.28,.05,.4],c:'#798471'}))}/>
 {wrap('gate-lane',<><Wall p={[-2.5,0,-4.7]} w={13.5} h={2.05}/><Wall p={[-9.15,0,-.3]} w={8.8} h={2.05} turn/><Wall p={[5.1,0,1.55]} w={5.1} h={1.85} turn/><Wall p={[5.1,0,-4.05]} w={1.3} h={2.05} turn/><group position={[5.1,0,-2.3]} rotation={[0,Math.PI/2,0]}><Frame w={2.35} d={1.05} h={2.2} bays={1}/><Roof w={3.1} d={2} eave={2.24} rise={.55} material='clay'/></group><Wall p={[-6.4,0,4.15]} w={5.5} h={1.2}/><Wall p={[2.1,0,4.15]} w={5.8} h={1.2}/><Box p={[5.75,.065,-2.3]} s={[1.7,.13,1.7]} c='#b49c76'/></>)}
 <Platform p={[-.45,0,.1]} w={6.8} d={6} h={.23}/>
 {wrap('office',<group position={[-.45,.27,.1]}><Wall p={[0,0,-2.7]} w={6.3} h={2.02}/><Wall p={[-3,0,0]} w={5.4} h={2.02} turn/><BuildingReveal open={open} wall><Wall p={[3,0,0]} w={5.4} h={2.02} turn/><Wall p={[-2.05,0,2.7]} w={2.05} h={2.02}/><Wall p={[2.05,0,2.7]} w={2.05} h={2.02}/><Wall p={[0,1.73,2.7]} w={2.1} h={.29}/></BuildingReveal><BuildingReveal open={open}><Frame w={5.8} d={5.15} h={2.12} bays={3}/></BuildingReveal><BuildingReveal open={open}><Roof w={7.3} d={6.65} eave={2.24} rise={.82} material='clay'/>{[-3.08,3.08].map(x=><group key={x} position={[x,2.02,0]} rotation={[0,Math.PI/2,0]}><Gable w={5.4} h={1.01} color='#b9a17e'/></group>)}</BuildingReveal></group>)}
 {wrap('archive-yard',<group position={[-6.12,0,-.6]}><Platform p={[0,0,0]} w={3.6} d={5.3} h={.23}/><Wall p={[-1.6,.27,0]} w={4.9} h={1.95} turn/><Wall p={[0,.27,-2.3]} w={3.2} h={1.95}/><BuildingReveal open={open} wall><Wall p={[0,.27,2.3]} w={3.2} h={1.95}/></BuildingReveal><BuildingReveal open={open}><Frame w={3.05} d={4.55} h={2.25} bays={2}/></BuildingReveal><BuildingReveal open={open}><group rotation={[0,Math.PI/2,0]}><Roof w={5.65} d={4.15} eave={2.3} rise={.7} material='clay'/></group></BuildingReveal><Bundles p={[-1.2,.27,-1.7]} count={9}/><Jars p={[-1.15,.27,.6]} count={3}/><Box p={[0,.86,-1.3]} s={[2.9,.12,1.15]} c='#8c714c'/></group>)}
 {wrap('well',<Well p={[4.3,.025,2.4]} wood/>)}<Stairs p={[0,0,3.14]} width={1.85} height={.26} steps={2}/><Tree p={[-7.75,0,-8.75]} size={.86}/><Jars p={[-2.7,.03,-3.8]} count={3}/><Fuel p={[-8.35,.025,2.45]} w={1.1}/>
 </>;
}
