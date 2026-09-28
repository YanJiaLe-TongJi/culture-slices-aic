import {earlyLayouts} from './early-layouts';
import {useMemo} from 'react';
import {Blocks,type Block} from './DioramaPrimitives';
export const bellFloor=1.3;

type Plan='zhou'|'shang'|'chu';
const noise=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
const outlines:Record<Plan,[number,number][]>= {zhou:earlyLayouts.feast.outline,shang:earlyLayouts.casting.outline,chu:earlyLayouts.bells.outline};
function inside(x:number,z:number,poly:[number,number][]){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
/** Deliberately different site cuts: axial court, excavated work yard, stepped terrace. */
export function PreQinGround({plan}:{plan:Plan}){
 const blocks=useMemo(()=>{const data:Block[]=[],step=.28,poly=outlines[plan],xs=poly.map(p=>p[0]),zs=poly.map(p=>p[1]),minX=Math.floor(Math.min(...xs)/step),maxX=Math.ceil(Math.max(...xs)/step),minZ=Math.floor(Math.min(...zs)/step),maxZ=Math.ceil(Math.max(...zs)/step);for(let i=minX;i<=maxX;i++)for(let j=minZ;j<=maxZ;j++){
  const x=i*step,z=j*step;if(!inside(x,z,outlines[plan]))continue;
  const pit=plan==='shang'&&x>-5.7&&x<-4&&z>.65&&z<2.65;
  const h=pit?-.36:0,n=noise(i,j),top=plan==='zhou'?['#c3b295','#cab99c','#c1b091']:plan==='shang'?['#b39770','#bba17b','#af946d']:['#a5a38a','#b0ab91','#a8a58b'];
  data.push({p:[x,h-.08,z],s:[step,.16,step],c:top[Math.floor(n*3)]});
  for(let k=0;k<(pit?1:3);k++)data.push({p:[x,-.21-k*.18,z],s:[step,.18,step],c:plan==='shang'?['#9d7c57','#aa8860','#8b7050'][k]:['#ab9574','#bcaa86','#96856b'][k]});
  if(plan==='shang'&&n>.972&&Math.abs(x)>5.1)data.push({p:[x,.11,z],s:[.05,.2,.05],c:'#858951'});
 }
 return data;},[plan]);
 return <><Blocks data={blocks}/><mesh position={[0,-.69,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.14}/></mesh></>;
}
