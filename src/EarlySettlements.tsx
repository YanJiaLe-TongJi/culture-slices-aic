import {useMemo,type ReactNode} from 'react';
import {Blocks,Box,Jar,Mat,Hit,type Block} from './DioramaPrimitives';
import {Beams,Frame,Tree,EarthHouse,CropPatch,Fence,Bundles,Fuel,Hall,noise} from './SettlementDetails';
import type {Point} from './exhibits';
type Wrap=(id:string,children:ReactNode)=>ReactNode;

function Path({points,width=.9,color='#c4ae86'}:{points:[number,number][];width?:number;color?:string}){
 const data=useMemo(()=>{const b:Block[]=[];for(let k=1;k<points.length;k++){const a=points[k-1],c=points[k],len=Math.hypot(c[0]-a[0],c[1]-a[1]);for(let t=0;t<=len;t+=.24)b.push({p:[a[0]+(c[0]-a[0])*t/len,.047,a[1]+(c[1]-a[1])*t/len],s:[width,.025,width],c:color});}return b;},[points,width,color]);return <Blocks data={data}/>;
}
function StorageJars({p,count=5}:{p:Point;count?:number}){return <group position={p}>{Array.from({length:count},(_,i)=><group key={i} position={[(i%3)*.63,0,Math.floor(i/3)*.68]}><Jar size={.44+i%3*.075} dark={i%2===0}/></group>)}</group>;}
function KilnShell({p}:{p:Point}){
 // A single voxel grid gives each exposed face one owner, including the upper rings.
 const data=useMemo(()=>{const b:Block[]=[];const pitch=.15,layer=.115;for(let y=0;y<9;y++){const r=Math.sqrt(Math.max(.1,1-(y*.11)**2))*1.05;for(let i=-8;i<=8;i++)for(let j=-8;j<=8;j++){const x=i*pitch,z=j*pitch,d=Math.hypot(x,z);if(d>r+.08||d<Math.max(0,r-.23)||z>.7&&Math.abs(x)<.38&&y<4)continue;b.push({p:[x,.07+y*layer,z],s:[pitch,layer,pitch],c:['#aa7654','#b2825b','#bf9168'][Math.abs(i*7+j*11+y)%3]});}}return b;},[]);
 return <group position={p}><Box p={[0,.015,.15]} s={[2.5,.03,2.65]} c='#977c57'/><Blocks data={data}/><Box p={[0,.06,1.18]} s={[.65,.12,1]} c='#675343'/><Box p={[0,1.05,0]} s={[.24,.1,.24]} c='#685744'/></group>;
}

export function VillageExpansion({wrap,selected}:{wrap:Wrap;selected?:string|null}){return <>
 <Path points={[[-1.2,6.9],[-2,4.8],[-2.3,-.8],[-1.8,-4.4],[-4.7,-6.4]]}/><Path points={[[-1.8,-4.4],[3.6,-4.6],[7.5,-1],[7.7,3.3]]}/>
 {wrap('houses',<><EarthHouse p={[-5.8,0,-6.55]} size={1.05} open={selected==='houses'}/><EarthHouse p={[-1.25,0,-7.25]} size={.95}/><EarthHouse p={[3.5,0,-6.4]} size={1.03} oval={1.12}/><StorageJars p={[-4.4,.04,-4.8]} count={3}/><group position={[-4.1,.1,-6.1]}><Hit s={[7,2.8,4.8]}/></group></>)}
 {wrap('harvest',<><CropPatch p={[7.75,.035,1.2]} w={3.1} d={6}/><Fence p={[7.9,0,-2.25]} length={3.1}/><Bundles p={[6.6,.03,4.2]} count={6}/></>)}
 <Tree p={[-8.7,0,-3]} size={1.13}/><Tree p={[-7.7,0,3.3]} size={.8}/><Tree p={[7.1,0,-6.3]} size={1.1}/><Tree p={[1.3,0,-8.8]} size={.65}/>
 <Fence p={[-6.6,0,4.6]} length={4}/><Fence p={[3.8,0,5.3]} length={3.7}/><Fuel p={[-7.3,.03,-.7]}/><StorageJars p={[-7.7,.03,1.4]} count={3}/>
 </>;}

export function PotteryExpansion({wrap,selected}:{wrap:Wrap;selected?:string|null}){return <>
 <Path points={[[0,5.9],[.7,3.5],[.7,-1],[.3,-5.5],[-4.2,-6]]}/><Path points={[[.7,-1],[5.8,-.7],[7,-4.7]]}/>
 {wrap('settlement',<><EarthHouse p={[-7.3,0,-5.6]} size={1.03} open={selected==='settlement'}/><Hall p={[-2.2,0,-7.5]} w={4.35} d={2.7} h={1.42} rise={1.12} floor={.08} roof='thatch' color='#b69b77'/><StorageJars p={[-3.5,.14,-6.6]} count={4}/><group position={[-7.2,.02,-3.5]}><Mat w={1.9} d={1.2}/></group></>)}
 {wrap('firing',<><KilnShell p={[7.65,.025,-5.9]}/><KilnShell p={[7.65,.025,-2.6]}/><Fuel p={[4.95,.025,-6.5]} w={1.5}/><StorageJars p={[6.25,.02,-.9]} count={6}/><Box p={[6.9,.04,-4.15]} s={[3.7,.04,.7]} c='#b49a74'/></>)}
 <Hall p={[-7.7,0,1.35]} w={3.1} d={2} h={1.5} rise={.52} floor={.06} roof='reed' open rotation={Math.PI/2}/><Fuel p={[-7.8,.1,1.2]} w={1.6}/>
 <Fence p={[-6.65,0,4.7]} length={4.1}/><Fence p={[3.8,0,-8.3]} length={3.2}/><Tree p={[-9.3,0,-.85]} size={.95}/><Tree p={[3.9,0,-7.2]} size={.85}/><Tree p={[8.5,0,2.6]} size={.65}/>
 <Blocks data={Array.from({length:42},(_,i)=>({p:[-8.5+(i%14)*.23,.04,3+Math.floor(i/14)*.27],s:[.16,.06,.18],c:i%3?'#b18762':'#8f7655'}))}/>
 </>;}

export function FluteExpansion({wrap,selected}:{wrap:Wrap;selected?:string|null}){return <>
 <Path points={[[-1,4.9],[-2,3],[-2,-.3],[-3.6,-4.8],[-5.2,-7.7]]} color='#bfc09a'/><Path points={[[-3.6,-4.8],[.7,-5.3],[2.8,-3.2]]} color='#bfc09a'/>
 {wrap('homes',<><EarthHouse p={[-6.8,0,-5.6]} size={.96} oval={1.12} open={selected==='homes'}/><EarthHouse p={[-2.55,0,-7.1]} size={.86} oval={1.15}/><StorageJars p={[-5.1,.03,-4.1]} count={3}/><group position={[-5.4,.04,-7.8]}><Mat w={1.5} d={1.1}/></group></>)}
 {wrap('wetland',<><group position={[1.35,0,-5.8]}><Frame w={2.4} d={.55} h={1.45} bays={2}/><Blocks data={Array.from({length:50},(_,i)=>({p:[-1.13+i%25*.094,.87-Math.floor(i/25)*.45,.03],s:[.018,.92,.018],c:'#b7ad86'}))}/><Beams data={Array.from({length:6},(_,i)=>({a:[-1.2,.48+i*.15,.03] as Point,b:[1.2,.48+i*.15,.03] as Point,w:.015,c:'#b7ad86'}))}/></group><StorageJars p={[1.1,.02,-4.55]} count={2}/><group position={[3.4,0,-6.5]}><Hit s={[2.3,.8,4]}/></group></>)}
 <Tree p={[-8.3,0,-2.3]} size={1.1}/><Tree p={[-6.6,0,2.8]} size={.92}/><Tree p={[-5.7,0,-8.7]} size={.65}/><Tree p={[.1,0,-8.2]} size={.85}/>
 <Blocks data={Array.from({length:210},(_,i)=>{const z=-9+noise(i,1)*14,x=3.6+Math.sin(z*.64)*.8+noise(i,2)*.72,h=.4+noise(i,6)*.75;return {p:[x,h/2-.14,z],s:[.035,h,.035],c:i%4?'#8d9e69':'#c2bc8c'};})}/>
 <Fence p={[-7.6,0,3.8]} length={2.7}/><group position={[-6,.03,.3]}><Mat w={1.9} d={1.3}/></group>
 </>;}
