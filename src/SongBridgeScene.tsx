import {useEffect,useMemo,useRef,type RefObject} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {Blocks,Box,Stick,Hit,type Block} from './DioramaPrimitives';
import {Stairs} from './ArchitecturePrimitives';
import {Timbers,RiverShop,MarketStall,Cargo,RiverPerson,RiverTree,type Beam} from './SongRiverArchitecture';
import type {WeiJinModelProps} from './WeiJinScenes';
import type {Point} from './exhibits';

import type {RiverEdition} from './river-editions';
const clamp=(x:number)=>T.MathUtils.clamp(x,0,1);
const deckY=(x:number)=>.68+1.74*Math.cos(x/4.35*Math.PI/2);
const noise=(x:number,z:number)=>T.MathUtils.euclideanModulo(Math.sin(x*81.7+z*137.2)*43758.5453,1);

function RiverBanks({expanded,fine}:{expanded:boolean;fine:boolean}) {
  const land=useMemo(()=>{const a:Block[]=[],step=expanded?.32:.22,hx=expanded?11.3:6.8,hz=expanded?9.1:5.4;for(let x=-hx;x<=hx;x+=step)for(let z=-hz;z<=hz;z+=step){const bend=expanded?Math.max(0,Math.abs(z)-4)*.14:0;if(x>-2.76+(z<0?bend:-bend)&&x<2.76+(z<0?bend:-bend))continue;if(Math.abs(x)>hx-.8&&Math.abs(z)>hz-1.5||x<-hx+1.2&&z>hz-2.6)continue;const n=noise(x,z);a.push({p:[x,-.14,z],s:[step,1.26,step],c:n>.75?'#ad9574':'#b7a07c'},{p:[x,.52,z],s:[step,.09,step],c:n>.8?'#c9bb97':'#c1b390'});}
    // Masonry courses follow the cut bank; worn paving gathers at each bridgehead.
    for(const s of [-1,1])for(let z=-hz+.25;z<hz;z+=.42){if(s===1&&z>1.1&&z<3.1)continue;const bend=expanded?Math.max(0,Math.abs(z)-4)*.14:0,x=s*2.78+(z<0?bend:-bend);for(let k=0;k<3;k++)a.push({p:[x,.06+k*.16,z+(k%2)*.06],s:[.22,.15,.4],c:k%2?'#99947c':'#aaa087'});}
    if(fine)for(const s of [-1,1])for(let i=0;i<14;i++)for(let j=0;j<8;j++)a.push({p:[s*(3+i*.24),.579,-.95+j*.25],s:[.223,.025,.235],c:noise(i,j)>.5?'#b1a58b':'#bfb194'});
    return a;},[expanded,fine]);
  const ripples=useMemo(()=>{const a:Block[]=[];for(let i=0;i<(expanded?110:65);i++){const z=(noise(i,8)-.5)*(expanded?18:10.7),x=(noise(i,2)-.5)*4.7;a.push({p:[x,-.041,z],s:[.15+noise(i,4)*.72,.007,.009],c:i%3?'#a5bdad':'#c4d0b5'});}return a;},[expanded]);
  return <><Blocks data={land}/><Box p={[0,-.39,0]} s={[expanded?8:5.74,.6,expanded?18.65:11.12]} c='#72958a'/><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.075,0]} receiveShadow><planeGeometry args={[expanded?8:5.74,expanded?18.65:11.12]}/><meshStandardMaterial color='#8cae9f' roughness={.45} metalness={.08}/></mesh><Blocks data={ripples}/><mesh position={[0,-.78,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.16}/></mesh></>;
}

function Rope({points,r=.014,c='#b8a175'}:{points:Point[];r?:number;c?:string}) {
  const geo=useMemo(()=>new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,5,false),[points,r]);
  useEffect(()=>()=>geo.dispose(),[geo]);return <mesh geometry={geo} castShadow><meshStandardMaterial color={c} roughness={1}/></mesh>;
}

function Bridge({value,fine}:{value:()=>number;fine:boolean}) {
  const deck=useRef<T.Group>(null),people=useRef<T.Group>(null);
  const planks=useMemo(()=>{const a:Block[]=[],n=fine?94:49;for(let i=0;i<n;i++){const x=-4.28+i*8.56/n;a.push({p:[x,deckY(x),0],s:[8.56/n-.008,.12,1.94],c:i%4?'#ae8b58':'#bea071'});if(fine){for(const z of [-.70,.7])a.push({p:[x,deckY(x)+.065,z],s:[.018,.009,.023],c:'#6d5c41'});a.push({p:[x,deckY(x)+.064,.15*Math.sin(i)],s:[8.56/n*.65,.004,.003],c:'#d1b782'});}}return a;},[fine]);
  const beams=useMemo(()=>{const a:Beam[]=[];[-.83,-.43,0,.43,.83].forEach((z,i)=>{const path=i%2===0?[[-4.17,.59],[-1.64,1.82],[1.64,1.82],[4.17,.59]]:[[-4.17,.59],[-2.56,1.35],[0,2.04],[2.56,1.35],[4.17,.59]];path.slice(1).forEach(([x,y],j)=>a.push({a:[path[j][0],path[j][1],z],b:[x,y,z],r:fine?.17:.19,c:i%2?'#735435':'#927047'}));});for(const x of [-2.56,-1.64,0,1.64,2.56])a.push({a:[x,Math.abs(x)>2?1.37:Math.abs(x)>1?1.84:2.04,-1.10],b:[x,Math.abs(x)>2?1.37:Math.abs(x)>1?1.84:2.04,1.10],r:.16,c:'#6f5238'});return a;},[fine]);
  const railing=useMemo(()=>{const a:Beam[]=[];for(const s of [-1,1])for(let i=0;i<22;i++){const x=-4.18+i*8.36/21,h=deckY(x);a.push({a:[x,h+.06,s*.91],b:[x,h+.58,s*.91],r:.046,c:'#806440'});if(i<21)for(const y of [.24,.53])a.push({a:[x,h+y,s*.91],b:[x+8.36/21,deckY(x+8.36/21)+y,s*.91],r:.037,c:'#a58251'});}return a;},[]);
  useFrame(()=>{if(deck.current){const v=clamp(value());if(people.current)people.current.visible=Math.sin(v*Math.PI)<.025;deck.current.position.y=Math.sin(v*Math.PI)*1.15;deck.current.position.z=-Math.sin(v*Math.PI)*.55;}});
  return <><Timbers items={beams}/>{fine&&[-2.56,-1.64,0,1.64,2.56].flatMap(x=>[-.83,0,.83].map(z=><group key={`${x}${z}`} position={[x,Math.abs(x)>2?1.37:Math.abs(x)>1?1.84:2.04,z]}>{[-.07,-.025,.02,.065].map(dx=><mesh key={dx} position={[dx,0,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.15,.012,5,12]}/><meshStandardMaterial color='#b4a17c'/></mesh>)}</group>))}
    <group ref={deck}><Blocks data={planks}/><Timbers items={railing}/><group ref={people}>{[-2.3,.8,2.7].map((x,i)=><RiverPerson key={x} p={[x,deckY(x)+.07,i%2?.48:-.48]} c={i%2?'#9c805d':'#757d6c'} turn={i}/>)}</group></group>
    {[-1,1].map(s=><group key={s}><Box p={[s*4.13,.51,0]} s={[.75,.25,2.2]} c='#a59c80'/>{[-1,1].map(z=><group key={z}><Stick a={[s*4.62,.58,z*1.12]} b={[s*4.62,2.48,z*1.12]} r={.05}/><Stick a={[s*4.85,2.29,z*1.12]} b={[s*4.4,2.29,z*1.12]} r={.023}/><Box p={[s*4.62,2.51,z*1.12]} s={[.17,.08,.18]} c='#a99062'/></group>)}</group>)}
  </>;
}

function Hull({fine}:{fine:boolean}) {
  const width=(z:number)=>.12+.48*Math.pow(Math.max(0,Math.sin((z+1.85)/3.7*Math.PI)),.6),up=(z:number)=>Math.pow(Math.abs(z)/1.85,4)*.2;
  const geometry=useMemo(()=>{const v:number[]=[],idx:number[]=[],n=fine?48:26,sides=fine?18:10;for(let j=0;j<=n;j++){const z=-1.85+j/n*3.7;for(let i=0;i<=sides;i++){const a=-Math.PI/2+i/sides*Math.PI;v.push(Math.sin(a)*width(z),.44-Math.cos(a)*.42+up(z),z);}}for(let j=0;j<n;j++)for(let i=0;i<sides;i++){const a=j*(sides+1)+i,b=a+sides+1;idx.push(a,b,a+1,b,b+1,a+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return g;},[fine]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  const ribs:Beam[]=[],planks:Block[]=[];for(let j=0;j<22;j++){const z=-1.69+j*.16,w=width(z);planks.push({p:[0,.285+up(z),z],s:[w*1.70,.035,.15],c:j%3?'#a98a5b':'#b99a6c'});for(const side of [-1,1])ribs.push({a:[side*w,.44+up(z),z],b:[side*width(z+.16),.44+up(z+.16),z+.16],r:.037,c:'#ba9b66'});}
  if(fine)for(let j=0;j<11;j++){const z=-1.6+j*.3;ribs.push({a:[-width(z)*.88,.40+up(z),z],b:[width(z)*.88,.40+up(z),z],r:.034,c:'#6e5338'});}
  return <><mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial color='#80613f' roughness={.88} side={T.DoubleSide}/></mesh><Blocks data={planks}/><Timbers items={ribs}/>{fine&&[-1,1].flatMap(s=>[0,1,2].map(k=><Rope key={`${s}${k}`} r={.007} c='#b59460' points={Array.from({length:15},(_,j)=>{const z=-1.76+j*3.52/14,a=.6+k*.25;return [s*width(z)*a,.13+k*.095+up(z),z] as Point;})}/>))}<Stick a={[.12,.57,1.6]} b={[.24,-.13,2.05]} r={.025}/><Box p={[.21,-.04,1.98]} s={[.22,.4,.055]} c='#795336'/></>;
}

function Boat({mastRef,fine=false,moored=false}:{mastRef?:RefObject<T.Group|null>;fine?:boolean;moored?:boolean}) {
  const cover=useMemo(()=>{const s=new T.Shape();s.absarc(0,0,.53,0,Math.PI,false);s.absarc(0,0,.50,Math.PI,0,true);s.closePath();return s;},[]);
  return <><Hull fine={fine}/><mesh position={[0,.44,.03]} castShadow receiveShadow><extrudeGeometry args={[cover,{depth:1.15,bevelEnabled:false,curveSegments:24}]}/><meshStandardMaterial color='#b1a076' roughness={1} side={T.DoubleSide}/></mesh>{Array.from({length:fine?14:5},(_,i)=>{const z=.03+i*1.13/(fine?13:4);return <mesh key={i} position={[0,.44,z]}><torusGeometry args={[.535,.012,5,24,Math.PI]}/><meshStandardMaterial color={i%3?'#877451':'#c4b385'}/></mesh>;})}
    {fine&&Array.from({length:9},(_,i)=>{const a=.1+i*Math.PI/9;return <Stick key={i} a={[Math.cos(a)*.537,.44+Math.sin(a)*.537,.04]} b={[Math.cos(a)*.537,.44+Math.sin(a)*.537,1.17]} r={.006} c='#c1af80'/>;})}
    <group position={[0,.3,-1.10]} scale={.6}><Cargo fine={fine}/></group><Stick a={[0,.28,-.65]} b={[0,1.05,-.65]} r={.045}/>
    <group ref={mastRef} position={[0,1.05,-.65]} rotation={moored?[Math.PI/2,0,0]:[0,0,0]}><Stick a={[0,0,0]} b={[0,2.20,0]} r={.035} c='#9b7948'/><Stick a={[-.40,1.48,0]} b={[.40,1.48,0]} r={.025}/><mesh position={[0,1.50,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.075,.065,.78,14]}/><meshStandardMaterial color='#c9bb8f'/></mesh>{[-.28,0,.28].map(x=><mesh key={x} position={[x,1.5,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.078,.009,5,18]}/><meshStandardMaterial color='#8b7452'/></mesh>)}{fine&&<Rope points={[[.01,2.08,0],[.34,1.8,.07],[.4,1.48,0]]}/>}</group>
    <RiverPerson p={[0,.46,1.47]} c='#6a7365'/><group position={[0,.5,.1]}><Hit s={[1.15,.55,3.5]}/></group>
  </>;
}

function Landing({fine,expanded}:{fine:boolean;expanded:boolean}) {
  const deck:Block[]=[];if(expanded)for(let i=0;i<19;i++)deck.push({p:[3.2,.27,-4.9+i*.14],s:[1.9,.075,.13],c:i%3?'#9e8357':'#b39a6a'});
  return <><group position={[3.30,-.11,2.25]} rotation={[0,-Math.PI/2,0]}><Stairs p={[0,0,0]} height={.66} steps={fine?8:5} run={fine?.13:.2} width={1.65}/>{[-.82,.82].map(x=><group key={x}><Stick a={[x,-.14,.84]} b={[x,.59,.84]} r={.07} c='#72694e'/>{fine&&[.37,.41,.45].map(y=><mesh key={y} position={[x,y,.84]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.078,.012,5,16]}/><meshStandardMaterial color='#baaa7e'/></mesh>)}</group>)}<group position={[0,.32,.35]}><Hit s={[2,.7,1.7]}/></group></group><Cargo p={[3.84,.57,3.25]} fine={fine}/><RiverPerson p={[4.45,.56,2.55]} c='#9a8c68' turn={-.8}/>{expanded&&<><Blocks data={deck}/>{[2.4,3.9].flatMap(x=>[-4.8,-2.45].map(z=><Stick key={`${x}${z}`} a={[x,-.45,z]} b={[x,.6,z]} r={.06}/>))}<Cargo p={[4.7,.56,-4.1]}/></>}</>;
}

function RiverMarket({fine,expanded}:{fine:boolean;expanded:boolean}) {
  return <>
    <group position={[-5.05,.56,-3.32]} rotation={[0,.1,0]}><RiverShop fine={fine} floors={2} w={2.65} d={1.95} kind='inn'/></group>
    <group position={[5.05,.56,-3.55]} rotation={[0,-.24,0]}><RiverShop fine={fine} w={2.5} d={2.0} kind='warehouse'/></group>
    <group position={[-5.25,.56,2.65]} rotation={[0,.32,0]}><MarketStall fine={fine}/></group>
    <group position={[5.35,.56,3.5]} rotation={[0,-.4,0]}><MarketStall fine={fine} color='#b2b391'/></group>
    <RiverPerson p={[-3.85,.57,-1.72]} c='#8c7d61'/><RiverPerson p={[-4.35,.57,1.47]} c='#68786c' turn={1.2}/><RiverPerson p={[4.6,.57,-1.6]} c='#9f8c69' turn={-.5}/>
    {fine&&<><group position={[-6.04,.57,.38]} scale={.7}><Cargo fine/></group><group position={[-3.4,.57,-4.7]} scale={.7}><RiverTree/></group><Box p={[-5.45,.94,1.45]} s={[1.1,.08,.29]} c='#8f724c'/>{[-5.85,-5.05].map(x=><Box key={x} p={[x,.75,1.45]} s={[.09,.37,.27]} c='#756044'/>)}</>}
    {expanded&&<>
      <group position={[-8.5,.56,-5.85]} rotation={[0,.05,0]}><RiverShop fine w={3.45} d={2.5} kind='tea'/></group>
      <group position={[-4.93,.56,-7.05]} rotation={[0,.04,0]}><RiverShop fine w={2.65} d={2.15} kind='warehouse'/></group>
      <group position={[7.45,.56,-6.65]} rotation={[0,-.22,0]}><RiverShop fine floors={2} w={3.3} d={2.3} kind='inn'/></group>
      <group position={[9.3,.56,-2.6]} rotation={[0,-Math.PI/2,0]}><RiverShop w={3.2} d={2} kind='warehouse'/></group>
      <group position={[-9.12,.56,1.7]} rotation={[0,Math.PI/2,0]}><RiverShop w={3.1} d={2.05}/></group>
      <group position={[-8,.56,5.8]} rotation={[0,.1,0]}><MarketStall/></group><group position={[7.3,.56,5.9]} rotation={[0,-.3,0]}><MarketStall color='#a4aa86'/></group>
      <group position={[-5,.56,7.5]}><Cargo/><Cargo p={[1.1,0,.3]}/></group>
      {[[-3.7,6.8],[-9.7,7.2],[5.1,7.7],[9.9,3.0]].map(([x,z])=><group key={`${x}${z}`} position={[x,.56,z]}><RiverTree/></group>)}
      {[[-6.1,-5],[-7,-2.6],[-6.7,4.1],[-3.9,5.2],[6.1,-4.8],[8.7,2.1],[5.4,6.3],[6.6,.1],[-9.4,-.5]].map(([x,z],i)=><RiverPerson key={i} p={[x,.56,z]} c={['#7d806c','#a38a63','#687b72'][i%3]} turn={i}/>) }
    </>}
  </>;
}

export default function SongBridgeScene({value,wrap,riverEdition='expanded'}:WeiJinModelProps&{riverEdition?:RiverEdition}) {
  const fine=riverEdition==='detailed',expanded=!fine,ship=useRef<T.Group>(null),mast=useRef<T.Group>(null),wash=useRef<T.Group>(null);
  useFrame(()=>{const v=value(),down=clamp(v-1),pass=clamp(v-2);if(ship.current)ship.current.position.set(.25,-.12,3.15-6.3*pass);if(mast.current)mast.current.rotation.x=down*Math.PI/2;if(wash.current){wash.current.visible=pass>0&&pass<1;wash.current.position.z=3.15-6.3*pass;}});
  return <><RiverBanks expanded={expanded} fine={fine}/>{wrap('bridge',<Bridge value={value} fine/>)}{wrap('market',<RiverMarket fine={fine} expanded={expanded}/>)}{wrap('landing',<Landing fine={fine} expanded={expanded}/>)}
    <group ref={ship} position={[.25,-.12,3.15]}>{wrap('boat',<Boat mastRef={mast} fine/>)}{wrap('mast',<group position={[0,1.5,-.65]}><Hit s={[.48,2.4,.45]}/></group>)}</group>
    {wrap('moorings',<><group position={expanded?[1.6,-.12,-4.1]:[1.6,-.12,-3.2]} rotation={[0,.10,0]}><Boat moored fine/></group>{expanded&&<group position={[-1.5,-.12,6.4]} rotation={[0,-.16,0]}><Boat moored fine/></group>}<Rope points={[[2.12,.29,-3.2],[2.4,.24,-3],[3.05,.5,-2.55]]}/></>)}
    {wrap('cargo-yard',<group position={expanded?[6.4,.56,.5]:[5.8,.56,1.35]} scale={expanded?1:.65}>{[-1.2,1.2].flatMap(x=>[-1,1].map(z=><Stick key={`${x}${z}`} a={[x,0,z]} b={[x,1.9,z]} r={.065}/>))}<Box p={[0,1.94,0]} s={[2.8,.11,2.6]} c='#b0a074'/><Cargo fine p={[-.65,0,-.4]}/><Cargo fine p={[.6,0,.4]}/><Box p={[0,.12,0]} s={[2.7,.16,2.5]} c='#a28a61'/></group>)}
    <group ref={wash}>{[-1,1].flatMap(s=>[0,1,2].map(i=><Box key={`${s}${i}`} p={[.25+s*(.68+i*.14),-.041,.5+i*.25]} s={[.022,.008,.30]} c='#d1debe'/>))}</group>
  </>;
}
