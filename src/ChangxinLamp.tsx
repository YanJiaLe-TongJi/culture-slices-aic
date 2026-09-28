import {createContext,useContext,useEffect,useMemo,useRef,type ReactNode} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {Box,Hit,Mat} from './DioramaPrimitives';
import {sculptedLoft,sweptSleeve,hangingSleeve,lampCenter,lampSmokePath} from './lamp-geometry';
import type {ActionClock} from './exhibit-state';
import type {Point} from './exhibits';
const clamp=(x:number)=>T.MathUtils.clamp(x,0,1);
const GoldContext=createContext<T.CanvasTexture|null>(null);
const robeRings=[
 {y:.025,rx:0,rz:0,z:-.11},{y:.04,rx:.54,rz:.75,z:-.1,fold:.003},{y:.11,rx:.63,rz:.73,z:-.08,fold:.006},
 {y:.26,rx:.62,rz:.65,z:-.02,fold:.008},{y:.41,rx:.53,rz:.50,z:0,fold:.006},{y:.6,rx:.4,rz:.39,z:-.06,fold:.005},
 {y:.82,rx:.32,rz:.30,z:-.13},{y:1.03,rx:.32,rz:.28,z:-.12},{y:1.27,rx:.38,rz:.28,z:-.12},{y:1.52,rx:.42,rz:.25,z:-.13},{y:1.68,rx:.40,rz:.245,z:-.12},{y:1.8,rx:.25,rz:.20,z:-.10},{y:1.84,rx:.16,rz:.15,z:-.09},{y:1.85,rx:0,rz:0,z:-.09}
];
function robeSurface(x:number,y:number){
 const i=Math.max(1,robeRings.findIndex(r=>r.y>=y)),a=robeRings[i-1],b=robeRings[i],t=clamp((y-a.y)/(b.y-a.y));
 const rx=T.MathUtils.lerp(a.rx,b.rx,t),rz=T.MathUtils.lerp(a.rz,b.rz,t),z=T.MathUtils.lerp(a.z,b.z,t);
 return z+rz*Math.sqrt(Math.max(0,1-(x/rx)**2))+.018;
}
function Gold({dark=false,polished=false}:{dark?:boolean;polished?:boolean}){const map=useContext(GoldContext);return <meshStandardMaterial map={polished?null:map} color={polished?'#bd9f57':dark?'#b09a60':'#eee0b4'} metalness={.62} roughness={polished?.56:.49} side={T.DoubleSide}/>;}
function Engraving(){return <meshStandardMaterial color='#665635' metalness={.4} roughness={.68}/>;}
function Curve({points,r=.008,dark=false}:{points:Point[];r?:number;dark?:boolean}){
 const geometry=useMemo(()=>new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),40,r,7,false),[JSON.stringify(points),r]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <mesh geometry={geometry} castShadow>{dark?<Engraving/>:<Gold/>}</mesh>;
}
function Ellipsoid({p,s,rotation=[0,0,0],dark=false}:{p:Point;s:Point;rotation?:Point;dark?:boolean}){return <mesh position={p} scale={s} rotation={rotation} castShadow receiveShadow><sphereGeometry args={[1,36,24]}/><Gold dark={dark}/></mesh>;}
function Band({y,r=.4,t=.018}:{y:number;r?:number;t?:number}){return <mesh position={[0,y,0]} rotation={[Math.PI/2,0,0]} castShadow><torusGeometry args={[r,t,10,80]}/><Gold/></mesh>;}
function Lapel({points,width=.095}:{points:Point[];width?:number}){
 const geometry=useMemo(()=>{const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),positions:number[]=[],uv:number[]=[],index:number[]=[];for(let i=0;i<=40;i++){const t=i/40,p=curve.getPoint(t),tangent=curve.getTangent(t),side=new T.Vector3(-tangent.y,tangent.x,0).normalize().multiplyScalar(width/2);for(const sign of [-1,1]){const v=p.clone().addScaledVector(side,sign);positions.push(v.x,v.y,robeSurface(v.x,v.y));uv.push((sign+1)/2,t);}if(i){const n=i*2;index.push(n,n-2,n-1,n,n-1,n+1);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(index);g.computeVertexNormals();return g;},[JSON.stringify(points),width]);useEffect(()=>()=>geometry.dispose(),[geometry]);return <mesh geometry={geometry} castShadow><Gold dark/></mesh>;
}
function Robe(){
 const geometry=useMemo(()=>sculptedLoft(robeRings),[]);useEffect(()=>()=>geometry.dispose(),[geometry]);
 return <group position={[.3,0,0]}><mesh geometry={geometry} castShadow receiveShadow><Gold/></mesh>
  {/* Crossing collar, layered lapels and broad folds are read from the museum's photos. */}
  <Lapel points={[[-.12,1.80,0],[-.20,1.73,0],[-.04,1.59,0],[.18,1.43,0],[.28,1.30,0]]} width={.065}/>
  <Lapel points={[[.12,1.80,0],[.20,1.73,0],[.10,1.64,0],[.025,1.58,0]]} width={.075}/>
  <Curve points={[[-.27,.93,.14],[-.04,.84,.17],[.25,.84,.08],[.33,.88,-.07]]} r={.012}/>
  {[-1,1].map(sign=><group key={sign}>
   <Curve points={[[sign*.22,.57,.23],[sign*.34,.38,.44],[sign*.42,.15,.53]]} r={.01} dark/>
   <Curve points={[[sign*.26,.49,.27],[sign*.42,.34,.38],[sign*.53,.11,.39]]} r={.018}/>
   <Curve points={[[sign*.30,.45,.22],[sign*.51,.24,.24],[sign*.56,.08,.12]]} r={.012} dark/>
  </group>)}
  <Curve points={[[.20,.82,.2],[.37,.67,.22],[.46,.44,.36],[-.12,.40,.51],[-.46,.20,.39]]} r={.011}/>
  <Curve points={[[.42,.35,-.30],[.49,.25,-.46],[.46,.12,-.66],[.38,.065,-.76]]} r={.008} dark/>
  <Curve points={[[.46,.31,-.25],[.55,.19,-.34],[.55,.08,-.50]]} r={.009}/>
 </group>;
}
function Head(){
 const face=useMemo(()=>sculptedLoft([
  {y:0,rx:.11,rz:.105,z:-.02},{y:.075,rx:.105,rz:.10,z:.035},{y:.14,rx:.16,rz:.14,z:.025},{y:.23,rx:.207,rz:.16,z:.018},
  {y:.36,rx:.232,rz:.178,z:0},{y:.49,rx:.23,rz:.185,z:-.012},{y:.61,rx:.222,rz:.18,z:-.018},{y:.68,rx:.22,rz:.175,z:-.02},{y:.7,rx:0,rz:0,z:-.02},
 ],96),[]);useEffect(()=>()=>face.dispose(),[face]);
 return <group position={[.28,1.79,-.08]} rotation={[.09,-.13,-.03]}>
  <mesh geometry={face} castShadow receiveShadow><Gold polished/></mesh>
  {/* Cloth cap with a flat crown, forehead seam and trailing ties, rather than a sphere of hair. */}
  <mesh position={[0,.623,-.022]} scale={[1,1,.82]} castShadow><cylinderGeometry args={[.239,.246,.19,64]}/><Gold/></mesh>
  <Curve points={[[-.235,.54,.003],[-.15,.54,.152],[0,.545,.187],[.15,.55,.15],[.235,.55,0]]} r={.013}/>
  <Curve points={[[-.22,.60,.06],[-.12,.59,.166],[0,.6,.196],[.16,.63,.153],[.23,.64,.025]]} r={.007} dark/>
  <Ellipsoid p={[0,.46,-.225]} s={[.15,.20,.09]} dark/>
  {[-1,1].map(sign=><group key={sign}>
   <Curve points={[[sign*.12,.53,-.21],[sign*.2,.37,-.27],[sign*.24,.10,-.25],[sign*.3,-.035,-.16]]} r={.023}/>
   <Ellipsoid p={[sign*.234,.35,-.008]} s={[.041,.092,.038]}/>
   <Curve points={[[sign*.246,.40,.019],[sign*.255,.35,.026],[sign*.245,.30,.02]]} r={.008} dark/>
   <Curve points={[[sign*.045,.415,.178],[sign*.10,.433,.177],[sign*.175,.423,.128]]} r={.005} dark/>
   <Curve points={[[sign*.044,.355,.17],[sign*.103,.363,.163],[sign*.17,.346,.128]]} r={.006} dark/>
   <Curve points={[[sign*.05,.346,.172],[sign*.109,.335,.159],[sign*.17,.346,.128]]} r={.006}/>
  </group>)}
  <Ellipsoid p={[0,.311,.174]} s={[.036,.076,.035]}/><Ellipsoid p={[0,.266,.202]} s={[.046,.029,.029]}/>
  <Curve points={[[-.028,.253,.201],[0,.245,.213],[.029,.253,.201]]} r={.005} dark/>
  <Curve points={[[-.057,.202,.172],[-.018,.21,.189],[0,.204,.195],[.02,.21,.187],[.055,.204,.172]]} r={.006} dark/>
  <Curve points={[[-.044,.192,.175],[0,.183,.192],[.04,.194,.177]]} r={.006}/>
 </group>;
}
function LeftSleeve(){
 const arm=useMemo(()=>sweptSleeve([[.50,1.63,-.10],[.73,1.37,.07],[.7,1.12,.31],[.45,1.0,.56],[-.23,1.02,.75]],[.21,.22,.24,.18,.15],.006),[]),drape=useMemo(hangingSleeve,[]);
 useEffect(()=>()=>{arm.dispose();drape.dispose();},[arm,drape]);
 return <><mesh geometry={arm} castShadow receiveShadow><Gold/></mesh><mesh geometry={drape} castShadow receiveShadow><Gold/></mesh>
  {[0,1,2].map(i=><Curve key={i} points={[[.71+i*.012,1.2-i*.05,.39],[.69,1.13-i*.045,.49],[.59,1.07-i*.038,.59]]} r={.007} dark/>)}
  {[-.34,.27].map((x,i)=><Curve key={x} points={[[x+.16,1.04,.79],[x+.09,.72,.84],[x,.075,.88]]} r={.013}/>)}
  <Curve points={[[.59,1.21,.47],[.52,1.11,.63],[.37,1.03,.75],[.20,.99,.80]]} r={.015}/>
  <Ellipsoid p={[-.39,1.0,.75]} s={[.19,.1,.125]} rotation={[0,0,-.2]}/>
  {[0,1,2,3].map(i=><Curve key={i} points={[[ -.34,1.015-i*.035,.82],[-.48,1.0-i*.032,.835],[-.60,.995-i*.024,.78]]} r={.017}/>)}
  <Curve points={[[-.34,1.035,.74],[-.39,1.11,.80],[-.48,1.115,.84]]} r={.023}/>
 </>;
}
function SmokeSleeve(){
 const arm=useMemo(()=>sweptSleeve([[.01,1.65,-.13],[-.02,1.92,-.13],[-.12,2.20,-.1],[-.29,2.36,.09],[-.48,2.42,.36],[-.56,2.39,.60]],[.17,.18,.18,.18,.19,.19],.004),[]);
 const hood=useMemo(()=>{const profile=[[.5,1.94],[.508,1.96],[.499,1.99],[.48,2.035],[.458,2.055],[.463,2.076],[.445,2.1],[.421,2.134],[.428,2.151],[.41,2.172],[.38,2.203],[.386,2.221],[.37,2.244],[.34,2.27],[.344,2.286],[.31,2.316],[.265,2.35],[.23,2.41],[.195,2.478],[.135,2.54],[.07,2.573],[0,2.584]];const curve=new T.CatmullRomCurve3(profile.map(([x,y])=>new T.Vector3(x,y,0)),false,'catmullrom',.22);return new T.LatheGeometry(curve.getPoints(160).map(p=>new T.Vector2(Math.max(0,p.x),p.y)),96);},[]);
 useEffect(()=>()=>{arm.dispose();hood.dispose();},[arm,hood]);
 return <><mesh geometry={arm} castShadow receiveShadow><Gold/></mesh><group position={[lampCenter.x,0,lampCenter.z]}><mesh geometry={hood} castShadow receiveShadow><Gold/></mesh><Band r={.498} y={1.947} t={.014}/></group><Curve points={[[-.14,2.07,-.30],[-.18,2.24,-.28],[-.25,2.39,-.1]]} r={.01} dark/></>;
}
export default function ChangxinLamp({value,variant,wrap,clock,selected}:{value:()=>number;variant:number;wrap:(id:string,children:ReactNode)=>ReactNode;clock:ActionClock;selected?:string|null}){
 const map=useMemo(()=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d')!,pixels=ctx.createImageData(512,512);
  let seed=1789;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  // Periodic multiscale fields make irregular worn gilding, without repeating large spots.
  const field=(cells:number)=>{const values=Float32Array.from({length:cells*cells},rand);return (u:number,v:number)=>{const x=u*cells,y=v*cells,ix=Math.floor(x),iy=Math.floor(y),sx=x-ix,sy=y-iy,a=sx*sx*(3-2*sx),b=sy*sy*(3-2*sy);const at=(dx:number,dy:number)=>values[((iy+dy)%cells)*cells+(ix+dx)%cells];return T.MathUtils.lerp(T.MathUtils.lerp(at(0,0),at(1,0),a),T.MathUtils.lerp(at(0,1),at(1,1),a),b);};};
  const broad=field(14),medium=field(51),fine=field(143);
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
   const u=x/512,v=y/512,grain=fine(u,v),wear=broad(u,v)*.37+medium(u,v)*.43+grain*.2;
   const oxidation=T.MathUtils.smoothstep(wear,.585,.70),tone=(grain-.5)*20,base=[198+tone,167+tone,94+tone],patina=[88,79,48];
   const at=(y*512+x)*4;for(let channel=0;channel<3;channel++)pixels.data[at+channel]=T.MathUtils.lerp(base[channel],patina[channel],oxidation);pixels.data[at+3]=255;
  }
  ctx.putImageData(pixels,0,0);
  const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t;
 },[]);useEffect(()=>()=>map.dispose(),[map]);
 const shade=useRef<T.Group>(null),body=useRef<T.Group>(null),smoke=useRef<T.Group>(null),flame=useRef<T.Mesh>(null),light=useRef<T.PointLight>(null),particles=useRef<T.InstancedMesh>(null),beam=useRef<T.Mesh>(null);
 const dummy=useMemo(()=>new T.Object3D(),[]),pathPosition=useMemo(()=>new T.Vector3(),[]);
 useFrame(({clock:renderClock},dt)=>{
  const v=value(),on=clamp(v),open=clamp(v-1)*variant,xray=selected==='smoke'||clock.running&&clock.index===2,reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(shade.current)shade.current.rotation.y=-open*2.2;
  if(flame.current)flame.current.scale.set(.022*Math.max(.001,on),.085*Math.max(.001,on),.025*Math.max(.001,on));if(light.current)light.current.intensity=on*(.6+open*1.8);
  if(beam.current){beam.current.visible=v>0;beam.current.scale.set(.2+open,.7+open*.3,1);}
  for(const root of [body.current,smoke.current])root?.traverse(o=>{if(o instanceof T.Mesh){const m=o.material as T.MeshStandardMaterial;m.transparent=true;m.opacity=reduced?(xray?.28:1):T.MathUtils.damp(m.opacity,xray?.28:1,10,dt);m.depthWrite=!xray;}});
  if(particles.current){particles.current.visible=xray;const animated=clock.running&&clock.index===2&&!matchMedia('(prefers-reduced-motion:reduce)').matches;for(let i=0;i<18;i++){const t=animated?(renderClock.elapsedTime*.19+i/18)%1:i/17;lampSmokePath.getPointAt(t,pathPosition);dummy.position.copy(pathPosition);dummy.scale.setScalar(.016+Math.sin(t*Math.PI)*.006);dummy.updateMatrix();particles.current.setMatrixAt(i,dummy.matrix);}particles.current.instanceMatrix.needsUpdate=true;}
 });
 return <GoldContext.Provider value={map}>
  <Box p={[0,.39,.15]} s={[2.85,.15,2.05]} c='#755437'/>{[-1.23,1.23].flatMap(x=>[-.65,.95].map(z=><Box key={`${x}${z}`} p={[x,.17,z]} s={[.10,.34,.10]} c='#5c422d'/>))}
  <group position={[0,.472,.1]}><Mat w={2.55} d={1.73}/></group>
  <group position={[.05,.54,.02]} scale={.95}>
   {wrap('lamp',<group><group ref={body}><Robe/><Head/><LeftSleeve/></group>
    <group position={[lampCenter.x,0,lampCenter.z]}><mesh position={[0,1.085,0]} castShadow><cylinderGeometry args={[.255,.29,.065,80]}/><Gold/></mesh><mesh position={[0,1.225,0]} castShadow><cylinderGeometry args={[.13,.15,.24,64]}/><Gold/></mesh><mesh position={[0,1.34,0]} castShadow><cylinderGeometry args={[.525,.505,.065,96]}/><Gold/></mesh><Band y={1.373} r={.515} t={.017}/><mesh position={[0,1.379,0]}><cylinderGeometry args={[.463,.463,.01,72]}/><meshStandardMaterial color='#655638' metalness={.3} roughness={.67}/></mesh><Box p={[-.68,1.357,0]} s={[.34,.045,.11]} c='#b69348'/><Band y={1.09} r={.273} t={.012}/><mesh position={[0,1.421,0]}><coneGeometry args={[.014,.08,12]}/><Gold dark/></mesh><mesh ref={flame} position={[0,1.52,0]}><sphereGeometry args={[1,16,16]}/><meshBasicMaterial color='#ffd691'/></mesh><pointLight ref={light} position={[0,1.57,.1]} color='#ffc274' distance={3.5} intensity={0}/></group>
    <group position={[.37,1.31,0]}><Hit s={[.55,.95,.4]}/></group>
   </group>)}
   {wrap('shade',<group position={[lampCenter.x,1.67,lampCenter.z]}><mesh castShadow><cylinderGeometry args={[.465,.465,.56,80,1,true,Math.PI/2,Math.PI]}/><Gold/></mesh><group ref={shade}><mesh castShadow><cylinderGeometry args={[.47,.47,.56,80,1,true,-Math.PI/2,Math.PI]}/><Gold/></mesh><Curve points={[[-.47,-.27,0],[-.47,0,0],[-.47,.27,0]]} r={.007} dark/></group></group>)}
   {wrap('smoke',<group ref={smoke}><SmokeSleeve/></group>)}
   <instancedMesh ref={particles} args={[undefined,undefined,18]} frustumCulled={false}><sphereGeometry args={[1,10,8]}/><meshBasicMaterial color='#beeddf' transparent opacity={.9} depthTest={false}/></instancedMesh>
   <mesh ref={beam} position={[-.52,.026,1.0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.8,48]}/><meshBasicMaterial color='#ffe3a2' transparent opacity={.12} depthWrite={false}/></mesh>
  </group>
 </GoldContext.Provider>;
}
