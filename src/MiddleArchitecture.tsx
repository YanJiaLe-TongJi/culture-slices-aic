import {useMemo} from 'react';
import {Blocks,Box,Stick,Jar,Basket,Mat,type Block} from './DioramaPrimitives';
import {Roof,RammedWall,Gable,Door,Stairs,Post} from './ArchitecturePrimitives';
import {BuildingReveal} from './BuildingReveal';
import {Bamboo,Brickwork} from './WeiJinArchitecture';
import {inFootprint} from './site-footprints';
import {middleLayouts,type MiddleKind} from './middle-layouts';
import type {Point} from './exhibits';
import type {WeiJinModelProps} from './WeiJinScenes';
type SpaceProps=Pick<WeiJinModelProps,'wrap'|'selected'>;

export function MiddleGround({kind}:{kind:MiddleKind}){
 const data=useMemo(()=>{const b:Block[]=[];const outline=middleLayouts[kind].outline;for(let i=-45;i<=45;i++)for(let j=-49;j<=32;j++){
  const x=i*.25,z=j*.25;if(!inFootprint(x,z,outline))continue;const n=Math.abs(Math.sin(i*43+j*17));let top=0;
  if(kind==='kiln'){top=x>-.05?Math.max(.04,(3.5-z)*.22):.04;if(x>.15&&x<2.35&&z<3.7&&z>-5.15)top-=.28;if(x>=3.75&&x<=8&&z>=-.25&&z<=3.75)top=.36;}
  if(kind==='ewer'&&z>3.43&&z<4.17)top=-.3;
  if(kind==='plough')top=x>3.7&&x<4.6?-.15:z<-1.8||x<-3.5?.32:.08;
  if(kind==='printing')top=z>2.75?.01:.26;
  if(kind==='diancha')top=z>2.8||x>3.1?0:.15;
  const surface=kind==='grotto'?'#b7a88b':kind==='plough'?(top<.1?'#94936d':'#afa47d'):kind==='kiln'?'#ae9b78':kind==='printing'?'#c1ad8d':'#bdb095';
  b.push({p:[x,top-.06,z],s:[.25,.12,.25],c:n>.5?surface:kind==='plough'?'#a9a080':'#b3a488'},{p:[x,(top-.84)/2,z],s:[.25,top+.60,.25],c:n>.5?'#a08b6d':'#ac9474'},{p:[x,-.79,z],s:[.25,.14,.25],c:'#8e7c65'});
 }return b;},[kind]);return <><Blocks data={data}/><mesh position={[0,-.87,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.15}/></mesh></>;
}

// Components below describe construction members; no complete scene background is reused.
function Lattice({w=1.1,h=.9}:{w?:number;h?:number}){const b=useMemo(()=>{const a:Block[]=[];for(let x=-w/2;x<=w/2;x+=.12)a.push({p:[x,h/2,.05],s:[.035,h,.035],c:'#9b805a'});for(const y of [0,h/2,h])a.push({p:[0,y,.05],s:[w+.12,.05,.065],c:'#8c6b48'});return a;},[w,h]);return <><Box p={[0,h/2,0]} s={[w,h,.05]} c='#514d3c'/><Blocks data={b}/></>;}
function SideWall({x,d,h,color}:{x:number;d:number;h:number;color:string}){return <group position={[x,0,0]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={d} h={h} color={color}/><group position={[0,h,-.1]}><Gable w={d} h={d*.28} color={color}/></group></group>;}
function Room({p,w,d,h=2.3,floor=.22,material='clay',open=false,rotation=0,color='#c3b18f',roof=true,front='home',porch=0}:{p:Point;w:number;d:number;h?:number;floor?:number;material?:'clay'|'reed'|'thatch';open?:boolean;rotation?:number;color?:string;roof?:boolean;front?:'home'|'hall'|'shop'|'timber'|'rural';porch?:number}){
 const door=Math.min(1.4,w*.31);return <group position={p} rotation={[0,rotation,0]}>
  <Box p={[0,floor/2,0]} s={[w+.35,floor,d+.3]} c='#a69a7c'/><Box p={[0,floor+.015,0]} s={[w,.03,d]} c='#c5b699'/>
  <group position={[0,floor,0]}><Brickwork p={[0,0,-d/2]} w={w} h={.28}/><RammedWall p={[0,.28,-d/2]} w={w} h={h-.28} color={color}/>
   <BuildingReveal open={open} wall><SideWall x={-w/2} d={d} h={h} color={color}/><SideWall x={w/2} d={d} h={h} color={color}/>
    <group position={[0,0,-porch]}>
    {front==='home'||front==='rural'?<>{[-1,1].map(s=><group key={s}><RammedWall p={[s*(w+door)/4,0,d/2]} w={(w-door)/2} h={h} color={color}/>{w>4&&<group position={[s*w*.33,front==='rural'?1.1:.83,d/2+.17]}>{front==='rural'?<Box p={[0,.22,0]} s={[.53,.44,.04]} c='#67573d'/>:<Lattice w={Math.min(1.2,w*.2)}/>}</group>}</group>)}<group position={[0,0,d/2+.1]}><Door w={door} h={h*.8}/></group></>:<>
     {[-1,0,1].map(i=><group key={i} position={[i*w/3,0,d/2]}>
      {front==='shop'?<><RammedWall p={[0,0,0]} w={w/3-.16} h={i===1?.12:.72} color={color}/><Box p={[0,h-.3,0]} s={[w/3-.18,.55,.08]} c='#a38a62'/>{i!==1&&<Box p={[0,.78,.22]} s={[w/3-.12,.13,.54]} c='#8d6c45'/>}</>:<><RammedWall p={[0,0,0]} w={w/3-.15} h={h} color={color}/><group position={[0,.06,.18]}>{front==='hall'||i===0?<Door w={w/3-.42} h={h*.81}/>:<group position={[0,.6,0]}><Lattice w={w/3-.35} h={h-.85}/></group>}</group></>}
     </group>)}{[-.5,-1/6,1/6,.5].map(x=><Box key={x} p={[x*w,h/2,d/2+.21]} s={[.17,h,.19]} c='#79583d'/>)}<Box p={[0,h-.14,d/2+.21]} s={[w+.12,.2,.2]} c='#78553b'/>{front==='timber'&&<Box p={[0,.45,d/2+.2]} s={[w,.12,.13]} c='#8c6849'/>}
    </>}
    </group>
   </BuildingReveal>
   <BuildingReveal open={open}>{roof&&<Roof w={w+.8} d={d+.85} eave={h+.05} rise={d*.28} material={material}/>}{(front==='hall'?[-w/2,-w/6,w/6,w/2]:[-w/2,0,w/2]).map(x=><Post key={x} x={x} z={d/2+.17} h={h} c='#73563e'/>)}<Box p={[0,h-.08,d/2+.17]} s={[w+.25,.18,.18]} c='#73553c'/></BuildingReveal>
  </group>
 </group>;
}
function Path({p,w,d,brick=false}:{p:Point;w:number;d:number;brick?:boolean}){const data=useMemo(()=>{const a:Block[]=[];for(let x=-w/2;x<w/2;x+=.4)for(let z=-d/2;z<d/2;z+=.26)a.push({p:[x+.18,.025,z+.12],s:[.38,.05,.24],c:brick?(Math.sin(x*9+z*3)>0?'#999680':'#aba58d'):'#c1b297'});return a;},[w,d,brick]);return <group position={p}>{brick?<Blocks data={data}/>:<Box p={[0,.025,0]} s={[w,.05,d]} c='#bba886'/>}</group>;}
function Rack({p,w=3,ware=false}:{p:Point;w?:number;ware?:boolean}){return <group position={p}>{[-w/2,w/2].map(x=><Post key={x} x={x} z={0} h={1.6}/>)}{[.35,.85,1.35].map(y=><group key={y}><Box p={[0,y,0]} s={[w+.2,.08,.8]} c='#91744f'/>{Array.from({length:4},(_,i)=><group key={i} position={[-w*.37+i*w*.25,y+.04,0]}>{ware?<Jar size={.23+(i%2)*.07}/>:<Box p={[0,.09,0]} s={[w*.20,.18,.57]} c='#70583c'/>}</group>)}</group>)}</group>;}
export function WaterLaneHouse({wrap,selected}:SpaceProps){const open=!!selected&&['house','ewer','spout','cup'].includes(selected);return <>
 {wrap('house',<><Room p={[-1.2,0,.3]} w={7.2} d={4.8} floor={.25} open={open}/><Stairs p={[-1.2,0,2.95]} width={1.8} height={.25} steps={2}/></>)}
 {wrap('rear-room',<><Room p={[-2.2,0,-6.15]} w={9} d={3.1} h={2.05}/><group position={[-5.8,.25,-5.6]}><Jar size={.6}/><group position={[1,0,0]}><Basket size={.8}/></group></group><Path p={[-2.1,0,-3.3]} w={8.4} d={1.8} brick/></>)}
 {wrap('side-yard',<><Room p={[5.2,0,-4.15]} w={3.3} d={4.7} h={1.95}/><Path p={[4.9,0,.0]} w={2.1} d={4.1} brick/><Bamboo p={[7.1,0,1.5]}/><Bamboo p={[6.5,0,2.1]}/><group position={[4.5,0,-.9]}><Basket size={.8}/><group position={[.9,0,.5]}><Jar size={.5}/></group></group></>)}
 <Path p={[-7.1,0,-1]} w={1.65} d={11.5} brick/><Path p={[.1,0,5.2]} w={15.8} d={1.35} brick/>
 <group position={[-8,0,-2.8]} rotation={[0,Math.PI/2,0]}><Brickwork w={9.8} h={.5}/><RammedWall p={[0,.5,0]} w={9.8} h={.8}/></group><Bamboo p={[-6.3,0,-3.15]}/>
 </>;}

export function KilnTerraces({wrap,selected}:SpaceProps){return <>
 {wrap('shed',<><group position={[-5.05,.04,-3.15]}><Box p={[0,.06,0]} s={[5.7,.12,3.6]} c='#a5916d'/><RammedWall p={[0,.12,-1.6]} w={5.3} h={1.2} color='#a68c66'/>{[-2.5,0,2.5].flatMap(x=>[-1.4,1.4].map(z=><Post key={`${x}${z}`} x={x} z={z} h={2.0} y={.12}/>))}<BuildingReveal open={selected==='shed'}><Roof w={6.0} d={4.0} eave={2.2} rise={.65} material='reed'/></BuildingReveal><Box p={[-2.5,.7,0]} s={[.15,1.1,3.1]} c='#8d7551'/></group><Rack p={[-4.7,.18,-3.7]} w={3.8} ware/><Stairs p={[-5.05,.04,-1.3]} width={2} height={.12} steps={1}/></>)}
 {wrap('drying-yard',<><Box p={[-4.35,.2,-6.7]} s={[6.6,.32,2.45]} c='#ac9572'/><Rack p={[-4.4,.37,-7.15]} w={5.5} ware/><group position={[-7.2,.37,-6.5]}><Basket size={.8}/></group><Stairs p={[-3.4,.04,-5.15]} width={1.6} height={.32} steps={3}/></>)}
 {wrap('clay-pit',<><Box p={[5.8,.45,1.3]} s={[3.5,.20,2.35]} c='#817e65'/>{[-1,1].map(s=><Box key={s} p={[5.8+s*1.8,.63,1.3]} s={[.22,.35,2.7]} c='#9a8666'/>)}{[-1,1].map(s=><Box key={s} p={[5.8,.63,1.3+s*1.25]} s={[3.38,.35,.2]} c='#9d8969'/>)}<group position={[5.7,.36,3.15]}><Basket size={.8}/><group position={[1.2,0,.0]}><Basket size={.6}/></group></group></>)}
 <group position={[-6.5,.04,2.5]}>{Array.from({length:16},(_,i)=><Stick key={i} a={[-.8+(i%4)*.34,.18+Math.floor(i/4)*.18,-.4]} b={[.7+(i%4)*.25,.20+Math.floor(i/4)*.18,.2]} r={.1} c={i%2?'#71583f':'#937b54'}/>)}</group>
 <Path p={[-.95,.045,-3.4]} w={1.2} d={11}/><Bamboo p={[-8.5,.04,-5.4]}/><Bamboo p={[6,2.55,-8.1]}/>
 </>;}

export function TangCompound({wrap,selected}:SpaceProps){const open=!!selected&&['house','mill','cake','sieve','stove'].includes(selected);return <>
 {wrap('house',<><Room p={[0,0,.65]} w={8} d={4.2} floor={.18} h={2.95} open={open} front='hall' porch={.6}/><Stairs p={[0,0,3]} width={3.2} height={.18} steps={2}/></>)}
 {wrap('inner-court',<><Room p={[0,0,-9]} w={8.6} d={3.1} h={3.0} floor={.38} front='hall' porch={.45}/><Stairs p={[0,0,-7.1]} width={3.5} height={.38}/><Path p={[0,0,-5.1]} w={3.2} d={3.7}/>{[-1,1].map(s=><RammedWall key={s} p={[s*3.6,0,-4.05]} w={4.4} h={1.65} color='#c6ad88'/>)}{[-1,1].map(s=><Post key={s} x={s*1.35} z={-4.05} h={2}/>)}</>)}
 {wrap('side-rooms',<>{[-1,1].flatMap(s=>[-2.6,-7].map((z,i)=><Room key={`${s}${z}`} p={[s*6.6,0,z]} w={3.05} d={i?3.1:3.6} rotation={s*Math.PI/2} h={i?2.15:2.35} floor={.2} front='hall' porch={.35}/>))}<Path p={[-4.85,0,-4.55]} w={.85} d={10}/><Path p={[4.85,0,-4.55]} w={.85} d={10}/></>)}
 {[-1,1].map(s=><group key={s} position={[s*8.6,0,-3.45]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={14.7} h={1.25} color='#bb9f77'/><Box p={[0,1.29,0]} s={[14.7,.12,.38]} c='#827d66'/></group>)}
 <Path p={[0,0,4.65]} w={2.7} d={3.4}/><Bamboo p={[-3.65,0,-5.5]}/><Bamboo p={[3.65,0,-5.7]}/>
 </>;}

function Rice({p,w,d}:{p:Point;w:number;d:number}){const b=useMemo(()=>{const a:Block[]=[];for(let x=-w/2+.2;x<w/2;x+=.35)for(let z=-d/2+.2;z<d/2;z+=.4)for(let k=0;k<3;k++)a.push({p:[x+k*.035,.15+k*.04,z],s:[.026,.25+k*.055,.025],c:k%2?'#93a477':'#76865c'});return a;},[w,d]);return <group position={p}><Box p={[0,.015,0]} s={[w,.03,d]} c='#879b83'/><Blocks data={b}/>{[-1,1].map(s=><Box key={s} p={[0,.1,s*d/2]} s={[w+.35,.20,.22]} c='#b1a477'/>)}{[-1,1].map(s=><Box key={s} p={[s*w/2,.1,0]} s={[.22,.20,d+.4]} c='#aa9e74'/>)}</group>;}
export function PaddySettlement({wrap,selected}:SpaceProps){return <>
 {wrap('shed',<><Room p={[-6.65,.32,-5.5]} w={5.1} d={3.6} h={1.95} material='thatch' front='rural' open={selected==='shed'} color='#b7a27c'/><Stairs p={[-6.65,0,-3.25]} width={1.6} height={.54}/><group position={[-6.7,.32,-.8]}>{[-1.7,1.7].flatMap(x=>[-1,1].map(z=><Post key={`${x}${z}`} x={x} z={z} h={1.8}/>))}<Roof w={4.2} d={2.75} eave={1.86} rise={.45} material='reed'/><Box p={[0,.28,-.3]} s={[2.8,.12,.5]} c='#927b54'/><group position={[-1,.35,-.3]}><Basket size={.65}/></group><Stick a={[.5,.1,.1]} b={[1,1.55,-.5]} r={.05}/></group></>)}
 {wrap('upper-fields',<><Rice p={[-.5,.32,-6.1]} w={5.2} d={5.4}/><Rice p={[6.6,.32,-6.3]} w={3.2} d={5.9}/><Rice p={[7,.08,.7]} w={3.8} d={5.2}/><Box p={[3.2,.28,-6.3]} s={[.6,.04,5.5]} c='#739388'/></>)}
 {wrap('threshing',<><Box p={[-6.55,.37,3.3]} s={[5.2,.1,3.4]} c='#c0ad79'/><group position={[-6.4,.44,3.3]}><Mat w={3.2} d={2.2}/></group>{[-1,0,1].map(i=><group key={i} position={[-8+i*.75,.45,2.35]}><mesh castShadow><cylinderGeometry args={[.20,.34,.75,7]}/><meshStandardMaterial color='#b7a26b' roughness={1}/></mesh><Box p={[0,0,0]} s={[.7,.04,.7]} c='#8f8158'/></group>)}</>)}
 <Rice p={[-.4,.08,5.25]} w={6.1} d={2.8}/><Bamboo p={[-9.1,.32,-7.3]}/>
 </>;}

export function PrintQuarter({wrap,selected}:SpaceProps){const open=!!selected&&['shop','board','brush','paper','scroll'].includes(selected);return <>
 {wrap('shop',<Room p={[0,.26,-.35]} w={8.1} d={6.1} h={2.65} floor={.04} open={open} front='shop' color='#c5ae8d'/>)}
 {wrap('paper-yard',<><Room p={[0,.26,-8.8]} w={6.3} d={2.4} h={2.15} floor={.08}/><Path p={[0,.26,-5.4]} w={5.4} d={3.6}/><Rack p={[-2.1,.28,-5.5]} w={2.2}/>{[0,1,2].map(i=><group key={i} position={[1.8,.28,-4.45-i*.72]}><Post x={-.8} z={0} h={1.6}/><Post x={.8} z={0} h={1.6}/><Box p={[0,1.4,0]} s={[1.6,.08,.08]} c='#a28a63'/><Box p={[0,.93,.06]} s={[1.45,.82,.015]} c={i%2?'#cfc6a3':'#dfd5b6'}/></group>)}</>)}
 {wrap('street-front',<><Room p={[-6.7,.26,-1.4]} w={3.3} d={4.2} h={2.2} floor={.03} front='shop'/><Room p={[-6.7,.26,-6.4]} w={3.3} d={4.2} h={2.25} floor={.03}/><Room p={[6.3,.26,-1.45]} w={3.2} d={4.1} h={2.1} floor={.03} front='shop'/><Path p={[0,.01,4.6]} w={16.4} d={1.8}/><group position={[6.4,.02,3.5]}><Basket size={.8}/><group position={[-1,0,0]}><Jar size={.65}/></group></group></>)}
 {[-1,1].map(s=><group key={s} position={[s*3.55,.26,-5.7]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={4.1} h={1.7} color='#bca482'/></group>)}
 </>;}

export function SongCorner({wrap,selected}:SpaceProps){const open=!!selected&&['stall','bowl','pitcher','whisk','powder'].includes(selected);return <>
 {wrap('stall',<><Room p={[-1.5,.15,-3.6]} w={6.7} d={3.8} h={2.35} floor={.15} roof={false} front='shop' color='#d2c2a2'/>
  <group position={[-1.4,.15,.9]}><BuildingReveal open={open}>{[-2.5,2.5].flatMap(x=>[-1.1,1.8].map(z=><Post key={`${x}${z}`} x={x} z={z} h={z<0?2.8:2.35}/>))}<mesh position={[0,2.60,.38]} rotation={[.153,0,0]} castShadow><boxGeometry args={[5.45,.055,3.22]}/><meshStandardMaterial color='#c6b382' roughness={1}/></mesh>{Array.from({length:28},(_,i)=><Stick key={i} a={[-2.65+i*.195,2.82,-1.23]} b={[-2.65+i*.195,2.34,1.97]} r={.028} c={i%2?'#b7a170':'#d0bc8a'}/>)}<Box p={[0,2.3,1.83]} s={[5.45,.15,.13]} c='#8d704a'/></BuildingReveal></group>
 </>)}
 {wrap('upper-room',<><Room p={[-1.5,2.73,-3.6]} w={6.7} d={3.8} h={2.05} floor={.12} front='timber' color='#d1c4a5'/><Box p={[-1.5,2.8,-1.05]} s={[7.0,.18,1.4]} c='#97754f'/>{Array.from({length:26},(_,i)=><Box key={i} p={[-4.77+i*.26,3.13,-.39]} s={[.045,.55,.06]} c='#926d48'/>)}<Box p={[-1.5,3.45,-.4]} s={[6.75,.07,.09]} c='#8e6845'/><Stairs p={[-5.75,.15,-5.1]} width={1.2} height={2.64} steps={12} run={.24}/></>)}
 {wrap('street-corner',<><Room p={[.6,.15,-7]} w={7.1} d={1.8} h={2.0} floor={.1}/><Room p={[6.1,0,-1.2]} w={3.1} d={3.5} h={2.35} floor={.15}/><Path p={[4.1,0,-4.4]} w={1.5} d={6.1} brick/><Path p={[1.3,0,4.25]} w={14.9} d={1.6} brick/>{[-7,-5.9].map(x=><group key={x} position={[x,.15,1.3]}><Basket size={.9}/></group>)}</>)}
 <group position={[-6.7,.15,-6.6]}><Bamboo p={[0,0,0]}/></group>
 </>;}
