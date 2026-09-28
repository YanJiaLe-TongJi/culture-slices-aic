import {useMemo} from 'react';
import {Blocks,Box,Stick,Mat,Basket,Jar,type Block} from './DioramaPrimitives';
import {RammedWall,Gable,Roof,Door,Stairs,Post} from './ArchitecturePrimitives';

type Plan='zhou'|'shang'|'chu';
const noise=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
const outlines:Record<Plan,[number,number][]>= {
 zhou:[[-6.4,-5.4],[6.4,-5.4],[6.4,4.6],[1.7,4.6],[1.7,5.6],[-1.7,5.6],[-1.7,4.6],[-6.4,4.6]],
 shang:[[-6.8,-4.1],[-4.9,-5.3],[.7,-5.15],[1.5,-4.6],[5.7,-4.6],[6.3,-2.3],[5.8,.3],[6.5,2.6],[4.2,4.55],[1.3,4.2],[.2,5.1],[-3.4,4.8],[-6.5,3.1],[-6.2,.2],[-7,-1]],
 chu:[[-6.15,-5.4],[5.3,-5.4],[5.3,-3.2],[6.7,-3.2],[6.7,4.8],[2.4,4.8],[2.4,4.05],[-6.15,4.05]],
};
function inside(x:number,z:number,poly:[number,number][]){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
/** Deliberately different site cuts: axial court, excavated work yard, stepped terrace. */
export function PreQinGround({plan}:{plan:Plan}){
 const blocks=useMemo(()=>{const data:Block[]=[],step=.28;for(let i=-26;i<=25;i++)for(let j=-21;j<=21;j++){
  const x=i*step,z=j*step;if(!inside(x,z,outlines[plan])||(plan==='zhou'&&z>4.5))continue;
  const pit=plan==='shang'&&x>-5.7&&x<-4&&z>.65&&z<2.65;
  const h=pit?-.36:0,n=noise(i,j),top=plan==='zhou'?['#c3b295','#cab99c','#c1b091']:plan==='shang'?['#b39770','#bba17b','#af946d']:['#a5a38a','#b0ab91','#a8a58b'];
  data.push({p:[x,h-.08,z],s:[step+.008,.16,step+.008],c:top[Math.floor(n*3)]});
  for(let k=0;k<(pit?1:3);k++)data.push({p:[x,-.21-k*.18,z],s:[step+.008,.18,step+.008],c:plan==='shang'?['#9d7c57','#aa8860','#8b7050'][k]:['#ab9574','#bcaa86','#96856b'][k]});
  if(plan==='shang'&&n>.972&&Math.abs(x)>5.1)data.push({p:[x,.11,z],s:[.05,.2,.05],c:'#858951'});
 }
 return data;},[plan]);
 return <><Blocks data={blocks}/><mesh position={[0,-.69,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.14}/></mesh></>;
}
export function ZhouArchitecture(){
 return <>
  <Box p={[0,.18,-3.1]} s={[8.2,.36,3.6]} c='#b49a73'/><Box p={[0,.39,-3.1]} s={[7.9,.06,3.38]} c='#d1c5a9'/>
  <group position={[0,.42,-3.15]}>
   <RammedWall p={[0,0,-1.2]} w={7.45} h={2.25} color='#d1c1a0'/>
   {[-3.6,3.6].map(x=><group key={x} position={[x,0,0]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={2.65} h={2.25} color='#c8b695'/><group position={[0,2.25,-.1]}><Gable w={2.7} h={1.02} color='#c8b695'/></group></group>)}
   {[-2.35,0,2.35].map(x=><group key={x} position={[x,0,-.5]}><Door w={1.35} h={1.8}/></group>)}
   {[-3.4,-1.15,1.15,3.4].map(x=><Post key={x} x={x} z={1.04} h={2.27}/>)}
   <Box p={[0,2.2,1.04]} s={[7.6,.17,.19]} c='#725136'/><Roof w={8.15} d={3.3} eave={2.3} rise={1.03} material='reed'/>
   {[-2.2,2.2].map(x=><group key={x} position={[x,.02,.55]}><Mat w={1.7} d={.75}/></group>)}
  </group>
  <Stairs p={[0,0,-1.27]} width={2.3} height={.4}/>
  <group position={[-4.95,0,-.4]} rotation={[0,Math.PI/2,0]}>
   <Box p={[0,.12,0]} s={[5.3,.24,1.95]} c='#b8a17e'/><RammedWall p={[0,.24,-.67]} w={4.85} h={1.72} color='#d0bea0'/>
   {[-2,-.65,.65,2].map(x=><Post key={x} x={x} z={.7} y={.24} h={1.7}/>)}<Box p={[0,1.94,.7]} s={[5.1,.14,.15]} c='#7f6042'/><Roof w={5.55} d={2.1} eave={2.03} rise={.65} material='reed'/>
   {[-1.35,1.35].map(x=><group key={x} position={[x,.24,-.65]}><Door w={.75} h={1.3}/></group>)}
  </group>
  <group position={[5,0,-2.65]} rotation={[0,Math.PI/2,0]}><Box p={[0,.12,0]} s={[2.4,.24,1.85]} c='#b8a17e'/><RammedWall p={[0,.24,-.7]} w={2.2} h={1.65} color='#d0bea0'/>{[-.9,.9].map(x=><Post key={x} x={x} z={.6} h={1.94}/>)}<Roof w={2.65} d={2.1} eave={1.98} rise={.62} material='reed'/></group>
  {/* Low eastern/front walls are a display cut, retaining the courtyard outline. */}
  <group position={[5.15,0,.75]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={3.5} h={.52} color='#c8b38f'/></group>
  {[-1,1].map(x=><RammedWall key={x} p={[x*3.6,0,4.1]} w={4.25} h={.45} color='#c5af88'/>)}
  <RammedWall p={[-3.95,0,3.35]} w={2.2} h={1.65} color='#c9b798'/><group position={[-3.95,0,3.35]}><Roof w={2.55} d={1.35} eave={1.7} rise={.42} material='reed'/></group>
  <Stairs p={[0,-.56,4.6]} width={2.45} height={.56} steps={4} run={.24}/>
  {[-1,1].map(x=><Box key={x} p={[x*1.53,.24,4.1]} s={[.27,.48,.38]} c='#ad9671'/>)}
  <Box p={[4.65,.007,1]} s={[.14,.035,5.7]} c='#8b8068'/>
  <group position={[-3.1,.03,-3.15]}><Jar size={.75}/></group>
 </>;
}

export function ShangArchitecture(){
 return <>
  <group position={[-2.65,0,-2.75]}>
   <Box p={[0,.12,0]} s={[4.5,.24,3.55]} c='#a1855e'/>
   <RammedWall p={[0,.24,-1.3]} w={4.15} h={1.75} color='#ab8a59'/>
   <group position={[-2,.24,0]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={2.8} h={1.75} color='#b09264'/><group position={[0,1.75,-.1]}><Gable w={2.8} h={1.23} color='#b09264'/></group></group>
   <group position={[2,.24,0]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={2.8} h={1.75} color='#b09264'/><group position={[0,1.75,-.1]}><Gable w={2.8} h={1.23} color='#b09264'/></group></group>
   <RammedWall p={[-1.45,.24,1.18]} w={1.1} h={1.45} color='#b09264'/><RammedWall p={[1.45,.24,1.18]} w={1.1} h={1.45} color='#b09264'/>
   {[-1.94,-.85,.85,1.94].map(x=><Post key={x} x={x} z={1.2} y={.24} h={1.83} c='#6c5032'/>)}
   <Box p={[0,2.04,1.18]} s={[4.4,.17,.19]} c='#715338'/><Roof w={4.85} d={3.45} eave={2.12} rise={1.27}/>
   <group position={[0,.25,.45]}><Mat w={1.5} d={.9}/></group>
   {[-1.45,-.65,.3,1.3].map((x,i)=><group key={x} position={[x,.3,-.65]}><Box s={[.48,.3,.5]} c={i%2?'#bfa67b':'#baa178'}/><Box p={[0,.18,0]} s={[.37,.13,.43]} c='#c7b18e'/></group>)}
  </group>
  <group position={[2.8,0,-3.1]} rotation={[0,-.12,0]}>
   {[-1.2,1.2].flatMap(x=>[-.82,.82].map(z=><Post key={`${x}${z}`} x={x} z={z} h={1.8} c='#6d5438'/>))}
   <Box p={[0,1.75,.82]} s={[2.8,.15,.14]} c='#76573b'/><Roof w={3.05} d={2.3} eave={1.83} rise={.73}/>
   <Box p={[0,.4,0]} s={[2.25,.14,.85]} c='#826341'/>{[-.88,.88].map(x=><Box key={x} p={[x,.19,0]} s={[.17,.38,.7]} c='#796143'/>)}
   {[-.76,0,.76].map((x,i)=><Box key={x} p={[x,.59,0]} s={[.44,.22,.58]} c={i%2?'#b29b73':'#bca683'}/>)}
  </group>
  {/* Exposed clay pit with a visible earth section, not a second display pedestal. */}
  <Box p={[-4.85,-.32,1.65]} s={[1.62,.08,1.88]} c='#8b7453'/><Box p={[-4.85,-.3,2.5]} s={[1.7,.12,.2]} c='#a68b62'/>
  <Stick a={[-5.3,-.24,1.9]} b={[-4.2,.1,1.4]} r={.035}/><Box p={[-5.23,-.18,1.88]} s={[.26,.06,.33]} c='#85795f'/>
  {Array.from({length:17},(_,i)=><Box key={i} p={[4.3+(noise(i,1)-.5)*1.4,.055,2.7+noise(i,2)*.65]} s={[.12,.08,.12]} c={i%2?'#866d52':'#b48d63'} rotation={i}/>) }
  <group position={[-5.55,.025,-3.2]}><Basket size={.65}/></group><group position={[5.2,.025,-3.8]}><Jar size={.68}/></group>
  {Array.from({length:8},(_,i)=><Stick key={i} a={[-5.4+i*.23,.04,-.35]} b={[-5.4+i*.23,.1,-1.05]} r={.055} c='#776044'/>)}
 </>;
}

export const bellFloor=.64;
export function ChuArchitecture(){
 return <>
  {/* Main terrace and an offset approach give the plot a long, stepped silhouette. */}
  <Box p={[-.5,.19,-.75]} s={[10.7,.38,8.5]} c='#ad9776'/><Box p={[-.5,.5,-.75]} s={[10.3,.24,8.15]} c='#bba583'/>
  <Box p={[-.5,.63,-.75]} s={[10,.04,7.95]} c='#c4b38e'/>
  <Box p={[4.6,.32,3.4]} s={[2.3,.64,.85]} c='#b9a17b'/><Stairs p={[4.9,0,3.72]} width={2.7} height={.64} steps={5} run={.22}/>
  {[-.5,.5].map(x=><Box key={x} p={[4.9+x*2.9,.12,4.1]} s={[.16,.24,1.6]} c='#a68d68'/>)}
  <group position={[-.35,bellFloor,-3.3]}>
   <Box p={[0,.16,0]} s={[8.75,.32,3.25]} c='#b3a07b'/><Box p={[0,.34,0]} s={[8.5,.055,3]} c='#c8b696'/>
   <RammedWall p={[0,.37,-1.12]} w={8.1} h={2.45} color='#b8a38a'/>
   {[-3.95,3.95].map(x=><group key={x} position={[x,.37,-.1]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={2.55} h={2.42} color='#b8a38a'/></group>)}
   {[-3.55,-1.75,0,1.75,3.55].map(x=><Post key={x} x={x} z={1.06} y={.37} h={2.46} c='#793f2e'/>)}
   {[-2.6,0,2.6].map(x=><group key={x} position={[x,.37,-.5]}><Door w={1.2} h={1.94}/></group>)}
   <Box p={[0,2.73,1.06]} s={[8.65,.23,.23]} c='#743d2d'/><Box p={[0,2.87,1.06]} s={[8.65,.065,.25]} c='#332f29'/>
   <Roof w={9.25} d={3.85} eave={2.97} rise={1.15} material='clay' hip/>
   {[-1,1].map(sign=><Box key={sign} p={[sign*2.85,4.14,0]} s={[.18,.32,.23]} c='#5a5b50'/>)}
   <Stairs p={[0,0,1.52]} width={2.15} height={.36}/>
  </group>
  {/* A side gallery turns toward the foreground; its front roof is cut away for sightlines. */}
  <group position={[-5,bellFloor,-.1]} rotation={[0,Math.PI/2,0]}>
   <RammedWall p={[0,0,-.42]} w={4.5} h={1.4} t={.24} color='#b6a086'/>
   {[-2,-.7,.7,2].map(x=><Post key={x} x={x} z={.48} h={2.05} c='#793f2e'/>)}<Box p={[0,2,.48]} s={[4.7,.16,.2]} c='#773c2b'/>
   <group position={[-1.3,0,0]}><Roof w={2.25} d={1.6} eave={2.12} rise={.46} material='clay'/></group>
  </group>
  <Box p={[-.6,bellFloor+.03,3.05]} s={[7.5,.06,.24]} c='#a59172'/>
  <group position={[6.02,.02,-.25]}><Box s={[.5,.025,5.4]} c='#728c83'/>{[0,1,2].map(i=><Box key={i} p={[0,.025,-1.7+i*1.6]} s={[.47,.016,.025]} c='#b8c5ac'/>)}</group>
 </>;
}
