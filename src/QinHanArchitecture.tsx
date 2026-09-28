import {useMemo} from 'react';
import {Blocks,Box,Stick,Jar,Mat,Basket,type Block} from './DioramaPrimitives';
import {RammedWall,Roof,Door,Stairs,Post,Gable} from './ArchitecturePrimitives';
import {inFootprint,type Footprint} from './site-footprints';
const outlines:Record<'lamp'|'loom'|'slips',Footprint>={
 lamp:[[-6,-4.8],[6,-4.8],[6,3.7],[2.1,3.7],[2.1,4.9],[-2.1,4.9],[-2.1,3.7],[-6,3.7]],
 loom:[[-6,-5.5],[3.1,-5.5],[3.1,-4.7],[5.7,-4.7],[5.7,4.45],[2.5,4.45],[2.5,5.35],[-5.4,5.35],[-5.4,2.1],[-6,2.1]],
 slips:[[-6.6,-4.6],[6.4,-4.6],[6.4,5.25],[2.9,5.25],[2.9,4.15],[-3.5,4.15],[-3.5,2.7],[-6.6,2.7]],
};
export function QinHanGround({plan}:{plan:keyof typeof outlines}){
 const blocks=useMemo(()=>{const data:Block[]=[];for(let i=-24;i<=24;i++)for(let j=-21;j<=21;j++){const x=i*.28,z=j*.28;if(!inFootprint(x,z,outlines[plan]))continue;const well=plan==='slips'&&Math.abs(x-4.3)<.85&&Math.abs(z-2.4)<.85,channel=plan==='loom'?x>4.85:plan==='slips'&&z>3.6&&x<3.2,n=Math.abs(Math.sin(i*81+j*32));if(!well){data.push({p:[x,(channel?-.17:0)-.08,z],s:[.284,.16,.284],c:channel?'#8a9384':plan==='lamp'?'#a69a7a':n>.5?'#b7ac8d':'#bdae8e'});data.push({p:[x,-.38,z],s:[.284,.45,.284],c:n>.7?'#a38b69':'#9a8365'});}}return data;},[plan]);
 return <><Blocks data={blocks}/><mesh position={[0,-.64,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.16}/></mesh></>;
}
function Lattice({w=1.2,h=1.2}:{w?:number;h?:number}){const data=useMemo(()=>{const d:Block[]=[];for(let x=-w/2;x<=w/2;x+=.12)d.push({p:[x,0,0],s:[.035,h,.035],c:'#846448'});for(let y=-h/2;y<=h/2;y+=.22)d.push({p:[0,y,0],s:[w,.034,.04],c:'#88694c'});return d;},[w,h]);return <><Box s={[w+.12,h+.13,.07]} c='#494e3f'/><group position={[0,0,.05]}><Blocks data={data}/></group></>;}
export function LampRoom(){return <>
 <Box p={[0,.18,-.35]} s={[10.8,.36,7.4]} c='#ad9572'/><Box p={[0,.39,-.35]} s={[10.5,.065,7.1]} c='#bcad8e'/>
 <group position={[0,.43,0]}>
  <RammedWall p={[0,0,-3.4]} w={10.35} h={2.65} color='#c9baa0'/>
  {[-4.4,-2.2,0,2.2,4.4].map(x=><Post key={x} x={x} z={-3.14} h={2.7} c='#65412f'/>)}
  {[-3.3,3.3].map(x=><group key={x} position={[x,1.55,-3.19]}><Lattice w={1.35} h={1.25}/></group>)}
  <group position={[0,0,-3.18]}><Door w={1.55} h={2.1}/></group>
  {/* Retain the western roof bay; eastern roof and front wall are removed for viewing. */}
  <group position={[-3.8,0,-.25]} rotation={[0,Math.PI/2,0]}><Roof w={7.55} d={3.2} eave={2.74} rise={1.05} material='clay'/></group>
  <Box p={[0,2.68,-3.38]} s={[10.65,.19,.3]} c='#674530'/>
  <group position={[-3.8,2.63,3.1]}><Gable w={2.9} h={1.12} color='#c6b296'/></group>
  <RammedWall p={[-3.8,0,3.1]} w={2.9} h={2.64} color='#c6b296'/>
  <group position={[-2.35,0,-.25]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={6.65} h={.5} color='#c6b296'/></group>
  <group position={[-5,0,-.5]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={5.8} h={2.2} color='#c6b296'/><group position={[0,1.5,.16]}><Lattice w={1.35}/></group></group>
  <group position={[5,0,-.3]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={6.2} h={.47} color='#c6b296'/></group>
  {[-4.9,4.9].map(x=><Post key={x} x={x} z={2.8} h={1.8} c='#674b36'/>)}
  <group position={[2.85,.02,.7]}><Box p={[0,.19,-.4]} s={[1.45,.22,.66]} c='#633a2a'/><Box p={[0,.31,-.4]} s={[1.5,.045,.72]} c='#343d33'/></group>
  <group position={[3.45,.025,-1.35]}><Box p={[0,.38,0]} s={[1.5,.75,.78]} c='#805639'/><Box p={[0,.77,0]} s={[1.58,.065,.86]} c='#633f2d'/>{[-.3,.3].map(x=><Box key={x} p={[x,.52,.41]} s={[.07,.1,.025]} c='#bb9b57'/>)}<group position={[-.4,.81,0]}><Jar size={.48} dark/></group></group>
  <group position={[1.5,.025,2.35]}><Mat w={1.6} d={.8}/></group>
 </group>
 <Stairs p={[0,0,3.37]} width={3.4} height={.4} steps={4} run={.3}/>
 </>;}
export function WeavingYard(){return <>
 {/* A longitudinal working bay with one open side, separate from the rear store. */}
 <group position={[-3.5,0,-.5]} rotation={[0,Math.PI/2,0]}>
  <Box p={[0,.11,0]} s={[8.2,.22,3.2]} c='#a9926d'/><RammedWall p={[0,.22,-1.35]} w={7.8} h={2.25} color='#b5a184'/>
  {[-3.5,-1.75,0,1.75,3.5].map(x=><Post key={x} x={x} z={1.22} y={.22} h={2.3}/>)}
  <Box p={[0,2.5,1.22]} s={[8,.18,.18]} c='#735037'/><Roof w={8.5} d={3.55} eave={2.6} rise={.86} material='clay'/>
  {[-3.75,3.75].map(x=><group key={x} position={[x,.22,0]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,0]} w={2.7} h={2.24} color='#b5a184'/><group position={[0,2.24,-.1]}><Gable w={2.8} h={.98} color='#b5a184'/></group></group>)}
  {[-2.7,-1.15,.45,2.1].map((x,i)=><group key={x} position={[x,.24,0]}><Basket size={.9}/><group position={[0,.3,0]}><Jar size={.4+i%2*.1}/></group></group>)}
 </group>
 <group position={[1.8,0,-3.65]}><Box p={[0,.12,0]} s={[5.1,.24,2.45]} c='#aa9575'/><RammedWall p={[0,.24,-.9]} w={4.7} h={1.85} color='#b9a68a'/>{[-2.1,0,2.1].map(x=><Post key={x} x={x} z={.86} y={.24} h={1.9}/>)}<Roof w={5.4} d={2.8} eave={2.23} rise={.84} material='reed'/><group position={[0,.24,-.72]}><Door w={1.3} h={1.7}/></group></group>
 <Box p={[.6,.06,.3]} s={[5.15,.12,5.3]} c='#bca984'/>
 {[-.9,2.5].map(x=><group key={x}><Stick a={[x,.04,3.9]} b={[x,1.8,3.9]} r={.055}/><Stick a={[x,.07,3.35]} b={[x,1.2,3.9]} r={.035}/></group>)}<Stick a={[-1.08,1.75,3.9]} b={[2.68,1.75,3.9]} r={.045}/>
 {[0,1,2].map(i=><group key={i} position={[-.6+i*.95,1.13,3.9]}><Box s={[.7,1.25,.03]} c={['#b69b6c','#975f52','#d1ba87'][i]}/>{[-.22,.22].map(x=><Box key={x} p={[x,0,.025]} s={[.035,1.25,.014]} c='#dfc994'/>)}</group>)}
 <Box p={[4.83,-.03,0]} s={[.14,.13,8.8]} c='#8f836a'/><Box p={[5.63,-.035,0]} s={[.15,.14,8.8]} c='#8f836a'/>
 <group position={[3.5,.025,2.6]}><Basket size={.8}/></group>
 </>;}
export function SlipsOffice(){return <>
 <Box p={[-.9,.1,-.35]} s={[9.7,.2,6.7]} c='#aa9472'/><Box p={[-.9,.23,-.35]} s={[9.4,.055,6.4]} c='#c3b391'/>
 <group position={[-.8,.26,-2.85]}><RammedWall p={[0,0,-.75]} w={10.4} h={2.1} color='#bbae8f'/>{[-4.6,-2.3,0,2.3,4.6].map(x=><Post key={x} x={x} z={.95} h={2.2} c='#66513d'/>)}<Box p={[0,2.15,.95]} s={[10.5,.16,.2]} c='#68503c'/><Roof w={11} d={2.45} eave={2.3} rise={.7} material='clay'/>{[-3.3,3.3].map(x=><group key={x} position={[x,0,-.52]}><Door w={1.05} h={1.7}/></group>)}</group>
 <group position={[-5.1,.26,-.2]} rotation={[0,Math.PI/2,0]}><RammedWall p={[0,0,-.5]} w={4.5} h={1.4} color='#b4a485'/>{[-1.9,1.9].map(x=><Post key={x} x={x} z={.6} h={1.9}/>)}<Roof w={4.85} d={1.7} eave={1.98} rise={.55} material='clay'/></group>
 {/* Wood-lined shaft is an interpretive cut, not a well used as an archive. */}
 <group position={[4.3,0,2.4]}>{Array.from({length:5},(_,i)=><group key={i}>{[-1,1].map(sign=><group key={sign}><Box p={[sign*.77,.24-i*.14,0]} s={[.16,.13,1.75]} c={i%2?'#7b634a':'#896f50'}/><Box p={[0,.24-i*.14,sign*.77]} s={[1.75,.13,.16]} c={i%2?'#876d4e':'#947856'}/></group>)}</group>)}<Box p={[0,-.45,0]} s={[1.5,.04,1.5]} c='#3d4f45'/>{[-1,1].map(x=><Box key={x} p={[x*.8,.4,0]} s={[.2,.13,1.96]} c='#9e815a'/>)}<Box p={[0,.4,-.8]} s={[1.95,.13,.2]} c='#9e815a'/></group>
 <group position={[-3.5,.27,-1.5]}><Box p={[0,.8,0]} s={[1.4,1.6,.18]} c='#74583b'/>{[.3,.9,1.5].map(y=><group key={y}><Box p={[0,y,.32]} s={[1.65,.09,.85]} c='#896747'/>{[-.5,0,.5].map(x=><group key={x} position={[x,y+.12,.3]}>{[0,1,2,3].map(i=><Box key={i} p={[(i%2)*.09,Math.floor(i/2)*.07,0]} s={[.07,.06,.66]} c='#c1a270'/>)}</group>)}</group>)}</group>
 <group position={[-2.4,.27,1.05]}><Mat w={1.1} d={1.65}/></group><group position={[2.9,.27,-1.2]}><Basket size={.75}/></group>
 <Box p={[-.1,-.03,3.54]} s={[6.4,.16,.15]} c='#9a9075'/><Box p={[-.1,-.05,4.1]} s={[6.4,.15,.13]} c='#9a9075'/>
 {[0,1,2].map(i=><Box key={i} p={[1.7+i*.32,.015,3.83]} s={[.24,.12,.77]} c='#ad9a79'/>)}
 <Stairs p={[0,0,2.92]} width={2.2} height={.24} steps={2}/>
 </>;}
