import {useEffect,useMemo} from 'react';
import * as T from 'three';
import {Box,Blocks,type Block} from './DioramaPrimitives';
import {inFootprint,type Footprint} from './site-footprints';
import type {Point} from './exhibits';
export const phase=(v:number,n=0)=>T.MathUtils.clamp(v-n,0,1);
export function Site({outline,color='#c4c7b8',paved=true}:{outline:Footprint;color?:string;paved?:boolean}){
 const shape=useMemo(()=>{const s=new T.Shape();outline.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();return s;},[outline]);
 const tiles=useMemo(()=>{const b:Block[]=[];const xs=outline.map(p=>p[0]),zs=outline.map(p=>p[1]);if(paved)for(let x=Math.min(...xs)+.275;x<Math.max(...xs);x+=.55)for(let z=Math.min(...zs)+.275;z<Math.max(...zs);z+=.55)if(inFootprint(x,z,outline))b.push({p:[x,.025,z],s:[.53,.04,.53],c:new T.Color(color).multiplyScalar(.98+.035*Math.sin(x*7+z*13)).getStyle()});return b;},[outline,color,paved]);
 return <><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.6,0]} receiveShadow castShadow><extrudeGeometry args={[shape,{depth:.6,bevelEnabled:false}]}/><meshStandardMaterial color={color} roughness={.96}/></mesh>{tiles.length>0&&<Blocks data={tiles}/>}<mesh position={[0,-.615,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.13}/></mesh></>;
}
export function Sign({text,w=2,h=.6,color='#d8e3d7',bg='#365c59'}:{text:string;w?:number;h?:number;color?:string;bg?:string}){
 const map=useMemo(()=>{const c=document.createElement('canvas');c.width=1024;c.height=256;const x=c.getContext('2d')!;x.fillStyle=bg;x.fillRect(0,0,1024,256);x.fillStyle=color;x.textAlign='center';x.textBaseline='middle';x.font='66px sans-serif';x.fillText(text,512,133,960);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;},[text,color,bg]);useEffect(()=>()=>map.dispose(),[map]);
 return <><Box s={[w+.08,h+.08,.07]} c={bg}/><mesh position={[0,0,.041]}><planeGeometry args={[w,h]}/><meshStandardMaterial map={map} roughness={.8}/></mesh></>;
}
export function Bench({p,w=2.5}:{p:Point;w?:number}){return <group position={p}><Box p={[0,.53,0]} s={[w,.12,.6]} c='#85978e'/><Box p={[0,.9,-.23]} s={[w,.62,.10]} c='#a8b7a9'/>{[-1,1].map(s=><Box key={s} p={[s*w*.36,.25,0]} s={[.12,.5,.46]} c='#576b67'/>)}{Array.from({length:Math.floor(w/.28)},(_,i)=><Box key={i} p={[-w/2+.1+i*.28,.92,-.164]} s={[.018,.48,.018]} c='#647970'/>)}</group>;}
export function Screen({w=1.8,h=1.1}:{w?:number;h?:number}){return <><Box s={[w+.14,h+.14,.12]} c='#3c4b4b'/><Box p={[0,0,.071]} s={[w,h,.014]} c='#779e9d'/>{[0,1,2,3].map(i=><Box key={i} p={[-w*.15,h*.28-i*h*.17,.083]} s={[w*(.56-i*.09),.018,.01]} c='#cce3cf'/>)}<Box p={[0,-h/2-.15,0]} s={[.13,.3,.12]} c='#576e68'/></>;}
