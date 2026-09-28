import {useMemo} from 'react';
import {Blocks,Box,type Block} from './DioramaPrimitives';
import {BrickPanel,WindowFrame} from './ModernPrimitives';
import {lateLayouts,type LateKind} from './late-layouts';
import {inFootprint} from './site-footprints';
import type {Point} from './exhibits';
export function LateGround({kind}:{kind:LateKind}){
 const data=useMemo(()=>{const a:Block[]=[],o=lateLayouts[kind].outline;const minX=Math.min(...o.map(p=>p[0])),maxX=Math.max(...o.map(p=>p[0])),minZ=Math.min(...o.map(p=>p[1])),maxZ=Math.max(...o.map(p=>p[1]));
 for(let x=minX;x<=maxX;x+=.28)for(let z=minZ;z<=maxZ;z+=.28){if(!inFootprint(x,z,o))continue;const n=Math.sin(x*39+z*27),h=['sewing','carding','cinema'].includes(kind)?.08:0;
 const c=kind==='study'?(n>.3?'#b5bc94':'#bcc09c'):kind==='newyear'?(n>.3?'#aeb4a2':'#b8bdaa'):kind==='porcelain'?(n>.3?'#b5b5a2':'#c3bca7'):(n>.3?'#b4b7a8':'#bfc0ae');
 a.push({p:[x,h-.07,z],s:[.28,.14,.28],c},{p:[x,(h-.62)/2,z],s:[.28,h+.48,.28],c:n>.1?'#a19c86':'#aaa28c'},{p:[x,-.63,z],s:[.28,.14,.28],c:'#858a77'});}
 return a;},[kind]);return <><Blocks data={data}/><mesh position={[0,-.72,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.16}/></mesh></>;
}
/** Wall bay with an actual opening: no opaque wall behind the glazing. */
export function WindowBay({w=2.3,h=2.65,ww=1.25,wh=1.25,sill=.95,c='#c7c4ac',frame='#76847a',brick=false}:{w?:number;h?:number;ww?:number;wh?:number;sill?:number;c?:string;frame?:string;brick?:boolean}){
 const panel=(width:number,height:number)=>brick?<BrickPanel w={width} h={height} c={c}/>:<Box p={[0,height/2,0]} s={[width,height,.22]} c={c}/>;
 return <>{[-1,1].map(s=><group key={s} position={[s*(ww+(w-ww)/2)/2,0,0]}>{panel((w-ww)/2,h)}</group>)}{panel(ww,sill)}<group position={[0,sill+wh,0]}>{panel(ww,h-sill-wh)}</group><group position={[0,sill+wh/2,.03]}><WindowFrame w={ww-.06} h={wh-.06} c={frame}/></group><Box p={[0,sill,.13]} s={[ww+.15,.08,.37]} c='#aaa990'/></>;
}
export function Paving({p,w,d,c='#b7b6a2'}:{p:Point;w:number;d:number;c?:string}){const data=useMemo(()=>{const a:Block[]=[];for(let x=-w/2+.25;x<w/2;x+=.5)for(let z=-d/2+.25;z<d/2;z+=.5)a.push({p:[x,0,z],s:[.48,.055,.48],c:Math.sin(x*24+z*11)>.3?c:'#aeb09c'});return a;},[w,d,c]);return <group position={p}><Blocks data={data}/></group>;}
export function Bench({p,w=1.6}:{p:Point;w?:number}){return <group position={p}><Box p={[0,.47,0]} s={[w,.08,.40]} c='#a18b69'/>{[-1,1].map(s=><Box key={s} p={[s*(w/2-.18),.23,0]} s={[.09,.46,.32]} c='#797c67'/>)}</group>;}
