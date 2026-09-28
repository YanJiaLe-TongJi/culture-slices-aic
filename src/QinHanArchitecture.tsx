import {subtractOpening} from './ground-openings';
import {earlyLayouts} from './early-layouts';
import {useMemo} from 'react';
import {Blocks,type Block} from './DioramaPrimitives';
import {inFootprint,type Footprint} from './site-footprints';
const outlines:Record<'lamp'|'loom'|'slips',Footprint>={lamp:earlyLayouts.lamp.outline,loom:earlyLayouts.loom.outline,slips:earlyLayouts.slips.outline};
export function QinHanGround({plan}:{plan:keyof typeof outlines}){
 const blocks=useMemo(()=>{const data:Block[]=[],poly=outlines[plan],xs=poly.map(p=>p[0]),zs=poly.map(p=>p[1]),minX=Math.floor(Math.min(...xs)/.28),maxX=Math.ceil(Math.max(...xs)/.28),minZ=Math.floor(Math.min(...zs)/.28),maxZ=Math.ceil(Math.max(...zs)/.28);for(let i=minX;i<=maxX;i++)for(let j=minZ;j<=maxZ;j++){const x=i*.28,z=j*.28;if(!inFootprint(x,z,outlines[plan]))continue;const channel=plan==='loom'?x>9.25&&x<9.85:plan==='slips'&&x>5.3&&x<5.65,n=Math.abs(Math.sin(i*81+j*32));const cell={x0:x-.14,x1:x+.14,z0:z-.14,z1:z+.14},center=plan==='lamp'?[6.7,.45]:plan==='slips'?[4.3,2.4]:null;const pieces=center?subtractOpening(cell,{x0:center[0]-.67,x1:center[0]+.67,z0:center[1]-.67,z1:center[1]+.67}):[cell];for(const r of pieces){const cx=(r.x0+r.x1)/2,cz=(r.z0+r.z1)/2,w=r.x1-r.x0,d=r.z1-r.z0;data.push({p:[cx,(channel?-.17:0)-.08,cz],s:[w,.16,d],c:channel?'#8a9384':plan==='lamp'?'#a69a7a':n>.5?'#b7ac8d':'#bdae8e'});data.push({p:[cx,-.38,cz],s:[w,.44,d],c:n>.7?'#a38b69':'#9a8365'});}}return data;},[plan]);
 return <><Blocks data={blocks}/><mesh position={[0,-.64,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.16}/></mesh></>;
}
