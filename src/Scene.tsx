import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type ComponentRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { objects, zones, type ObjectId, type ZoneId } from './content';
import { placementPose, type PlacementClock } from './placement';
import { resolveTarget, targetDefinition, type InteractionId } from './interaction';
import {villageFootprint,inFootprint,edgeDistance} from './site-footprints';

type Vec = [number,number,number];
type Voxel = { p: Vec; s: Vec; c: string };
const noise=(x:number,z:number)=>Math.abs(Math.sin(x*127.1+z*311.7)*43758.5453)%1;
function Blocks({blocks,meshRef}:{blocks:Voxel[];meshRef?:RefObject<THREE.InstancedMesh|null>}){
  const localRef=useRef<THREE.InstancedMesh>(null);
  const ref=meshRef||localRef;
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const d=new THREE.Object3D();
    blocks.forEach((b,i)=>{d.position.set(...b.p);d.scale.set(...b.s);d.updateMatrix();ref.current!.setMatrixAt(i,d.matrix);ref.current!.setColorAt(i,new THREE.Color(b.c));});
    ref.current.instanceMatrix.needsUpdate=true;
    if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;
    ref.current.computeBoundingSphere();
  },[blocks]);
  return <instancedMesh ref={ref} args={[undefined,undefined,blocks.length]} castShadow receiveShadow><boxGeometry/><meshStandardMaterial roughness={.96}/></instancedMesh>;
}
function Box({position=[0,0,0],size,color,rotation=0}:{position?:Vec;size:Vec;color:string;rotation?:number}){
  return <mesh position={position} rotation={[0,rotation,0]} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.95}/></mesh>;
}
function Terrain(){
  const terrain=useMemo(()=>{
    const b:Voxel[]=[],vertices:number[]=[],colors:number[]=[];
    const color=new THREE.Color();
    for(let x=-18;x<=18;x++)for(let z=-14;z<=14;z++){
      const px=x*.4,pz=z*.4;
      if(!inFootprint(px,pz,villageFootprint))continue;
      const edge=edgeDistance(px,pz,villageFootprint)<.65;
      const grass=edge||pz<-.8&&Math.abs(px)>1.5;
      const n=noise(Math.floor(x/3),Math.floor(z/3));
      if(edge){b.push({p:[px,-.15,pz],s:[.402,.36,.402],c:n>.5?'#b2976c':'#bba279'});b.push({p:[px,-.52,pz],s:[.402,.38,.402],c:n>.5?'#917958':'#a18760'});}
      color.set(grass?['#92966a','#9ba176','#a4a67a'][Math.floor(n*3)]:['#c5ae83','#c9b38b','#c2aa80'][Math.floor(n*3)]);
      for(const [dx,dz] of [[-.2,-.2],[-.2,.2],[.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]]){vertices.push(px+dx,.03,pz+dz);colors.push(color.r,color.g,color.b);}
      if(edge&&noise(x,z)>.8)b.push({p:[px,.1,pz],s:[.11,.18,.09],c:'#879462'});
    }
    // A few stones at the edge; paths are soil clearings, not a paved street.
    for(let i=0;i<50;i++){const x=(noise(i,3)-.5)*14,z=(noise(i,5)-.5)*10.6;if(inFootprint(x,z,villageFootprint)&&edgeDistance(x,z,villageFootprint)<.7)b.push({p:[x,.12,z],s:[.16+noise(i,3)*.25,.18,.23],c:'#999783'});}
    const surface=new THREE.BufferGeometry();surface.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));surface.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));surface.computeVertexNormals();
    return {blocks:b,surface};
  },[]);
  useEffect(()=>()=>terrain.surface.dispose(),[terrain]);
  return <group><Blocks blocks={terrain.blocks}/><mesh geometry={terrain.surface} receiveShadow><meshStandardMaterial vertexColors roughness={1}/></mesh></group>;
}
function Plants(){
  const blocks=useMemo(()=>{
    const b:Voxel[]=[];
    for(let i=0;i<95;i++){
      const x=4.1+noise(i,2)*1.6,z=-.2+noise(i,5)*2.7;
      if(x<5.1&&z>1)continue;
      const h=.45+noise(i,6)*.55;
      b.push({p:[x,h/2,z],s:[.035,h,.035],c:'#8c8d4f'});
      b.push({p:[x,h,z],s:[.085,.21,.09],c:i%3?'#c4ac63':'#d6bf7c'});
      b.push({p:[x+.07,h*.45,z],s:[.18,.035,.06],c:'#8c9962'});
    }
    for(const [x,z] of [[-5.8,-2.9],[5.6,-2.5],[-5,3.4],[2.5,-4.2],[-2.8,-4.5]]){
      for(let i=0;i<9;i++)b.push({p:[x+(noise(i,x)-.5)*.8,.1+noise(i,z)*.35,z+(noise(i,3)-.5)*.6],s:[.32,.23,.32],c:i%2?'#849063':'#a0aa78'});
    }
    return b;
  },[]);
  return <Blocks blocks={blocks}/>;
}
function House({position,scale=1,open=false,onClick}:{position:Vec;scale?:number;open?:boolean;onClick?:()=>void}){
  const roof=useRef<THREE.Group>(null),front=useRef<THREE.Group>(null);
  const parts=useMemo(()=>{
    const back:Voxel[]=[],fore:Voxel[]=[],top:Voxel[]=[],wood:Voxel[]=[];
    for(let x=-6;x<=6;x++)for(let z=-6;z<=6;z++){
      const r=Math.hypot(x*.2,z*.2);
      if(r>1.29||r<1.04)continue;
      if(z>3&&Math.abs(x)<2)continue;
      for(let y=0;y<7;y++)(z>1?fore:back).push({p:[x*.2,.12+y*.18,z*.2],s:[.205,.18,.205],c:['#b79b75','#bca17c','#b39872'][Math.floor(noise(Math.floor(x/2),Math.floor(y/2))*3)]});
    }
    for(let y=0;y<10;y++){
      const r=1.63-y*.15;
      for(let x=-9;x<=9;x++)for(let z=-9;z<=9;z++){
        const d=Math.hypot(x*.18,z*.18);
        if(d<r&&d>Math.max(0,r-.26))top.push({p:[x*.18,1.35+y*.13,z*.18],s:[.185,.15,.185],c:['#9b8353','#ae935c','#b99d64'][Math.floor(noise(Math.floor(x/3),Math.floor(z/3)+y*.1)*3)]});
      }
    }
    top.push({p:[0,2.65,0],s:[.22,.2,.22],c:'#957b49'});
    for(let i=0;i<8;i++){const a=i*Math.PI/4;wood.push({p:[Math.cos(a)*1.06,.69,Math.sin(a)*1.06],s:[.1,1.4,.1],c:'#79664b'});}
    return {back,fore,top,wood};
  },[]);
  useFrame((_,dt)=>{
    const a=1-Math.exp(-5*dt),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(roof.current){roof.current.position.y=THREE.MathUtils.lerp(roof.current.position.y,open?2.6:0,reduce?1:a);roof.current.scale.setScalar(THREE.MathUtils.lerp(roof.current.scale.x,open?.001:1,reduce?1:a));}
    if(front.current)front.current.scale.y=THREE.MathUtils.lerp(front.current.scale.y,open?.12:1,reduce?1:a);
  });
  return <group position={position} scale={scale} onClick={e=>{if(onClick){e.stopPropagation();onClick();}}}>
    <mesh position={[0,.015,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><circleGeometry args={[1.2,32]}/><meshStandardMaterial color="#ad926e"/></mesh>
    <Blocks blocks={parts.back}/><group ref={front}><Blocks blocks={parts.fore}/></group><Blocks blocks={parts.wood}/>
    <Box position={[0,.1,1.13]} size={[.8,.15,.4]} color="#ad9874"/>
    <group ref={roof}><Blocks blocks={parts.top}/></group>
  </group>;
}
function Slab(){
  const blocks=useMemo(()=>{
    const b:Voxel[]=[];
    // Long shoe-shaped body. Surface colours form broad wear patches.
    for(let x=-13;x<=13;x++)for(let z=-6;z<=6;z++){
      const px=x*.075,pz=z*.075;
      if((px/1.035)**2+(pz/(.42+.02*Math.sin(x*.2)))**2>1)continue;
      const r=Math.min(1,(px/.98)**2+(pz/.41)**2),h=.14+.07*r;
      b.push({p:[px,.22+h/2,pz],s:[.076,h,.076],c:r<.5?'#adaf9d':noise(Math.floor(x/4),Math.floor(z/3))>.5?'#969d8e':'#9fa491'});
    }
    for(const x of [-.63,.63])for(const z of [-.24,.24])b.push({p:[x,.13,z],s:[.2,.26,.17],c:'#818b7b'});
    return b;
  },[]);
  return <Blocks blocks={blocks}/>;
}
function Roller({motion,placed}:{motion:number;placed:boolean}){
  const ref=useRef<THREE.Group>(null);
  useFrame((_,dt)=>{if(ref.current)ref.current.position.x=THREE.MathUtils.lerp(ref.current.position.x,placed?motion*.6:-.57,1-Math.exp(-18*dt));});
  return <group ref={ref} position={[-.57,.45,0]}><mesh rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.075,.078,1.53,8]}/><meshStandardMaterial color="#aaa890" roughness={.94} flatShading/></mesh><HitBox size={[.22,.22,1.65]}/></group>;
}
function GrainPile({amount,processed=0,onSlab=false}:{amount:()=>number;processed?:number;onSlab?:boolean}){
  const ref=useRef<THREE.InstancedMesh>(null);
  const blocks=useMemo(()=>Array.from({length:90},(_,i):Voxel=>{
    const x=(noise(i,4)-.5)*(onSlab?1.5:.5),z=(noise(i,8)-.5)*(onSlab?.45:.45);
    return {p:[x,(onSlab?.375:.15)+noise(i,10)*.035,z],s:[.035,.026,.043],c:i/90<processed?'#ede0ad':i%3?'#d9b865':'#bc944c'};
  }),[onSlab,processed]);
  useFrame(()=>{if(ref.current)ref.current.count=Math.ceil(Math.max(0,Math.min(1,amount()))*90);});
  return <Blocks meshRef={ref} blocks={blocks}/>;
}
function Tray(){
  return <><Box size={[.66,.06,.61]} color="#96774e"/>{[-1,1].map(i=><group key={i}><Box position={[i*.32,.11,0]} size={[.055,.22,.65]} color="#aa8756"/><Box position={[0,.11,i*.3]} size={[.66,.22,.045]} color="#ac8a59"/></group>)}</>;
}
function GrainTransfer({clock,placed,processed}:{clock:PlacementClock;placed:boolean;processed:number}){
  const tray=useRef<THREE.Group>(null),stream=useRef<THREE.InstancedMesh>(null);
  const dummy=useMemo(()=>new THREE.Object3D(),[]);
  const amount=()=>placed?1:clock.active?placementPose(clock.time).amount:0;
  useFrame(()=>{
    const pose=placementPose(Math.max(0,clock.time)),active=clock.active;
    if(tray.current){tray.current.position.set(active?THREE.MathUtils.lerp(-.1,-1.15,pose.travel):-.1,.16+(active?pose.lift*.8:0),active?THREE.MathUtils.lerp(3.2,2.7,pose.travel):3.2);tray.current.rotation.z=active?pose.tilt*.9:0;}
    if(stream.current){
      stream.current.visible=active&&pose.pouring;
      if(stream.current.visible){for(let i=0;i<20;i++){const t=(clock.time*6+i/20)%1;dummy.position.set(-1.42+(noise(i,1)-.5)*.15,.98-t*.6,2.7+(noise(i,3)-.5)*.17);dummy.scale.set(.035,.04,.035);dummy.updateMatrix();stream.current.setMatrixAt(i,dummy.matrix);}stream.current.instanceMatrix.needsUpdate=true;}
    }
  });
  return <>
    <group ref={tray} position={[-.1,.16,3.2]}><Tray/><GrainPile amount={()=>1-amount()}/><HitBox position={[0,.15,0]} size={[.8,.35,.75]}/></group>
    <group position={[-1.5,0,2.7]}><GrainPile onSlab amount={amount} processed={processed}/></group>
    <instancedMesh ref={stream} args={[undefined,undefined,20]} visible={false} frustumCulled={false}><boxGeometry/><meshStandardMaterial color="#d9b865" roughness={1}/></instancedMesh>
  </>;
}
function Pot({jar=false}:{jar?:boolean}){
  const points=useMemo(()=> (jar?[[.15,.04],[.27,.14],[.32,.36],[.24,.58],[.115,.72],[.105,.84],[.13,.88],[.095,.88],[.078,.82],[.09,.72],[.2,.56],[.275,.35],[.23,.15],[.12,.09]]:[[.09,.22],[.25,.26],[.38,.41],[.46,.62],[.48,.76],[.43,.76],[.41,.63],[.34,.43],[.2,.3],[.09,.28]]).map(([x,y])=>new THREE.Vector2(x,y)),[jar]);
  return <group>
    <mesh castShadow receiveShadow><latheGeometry args={[points,16]}/><meshStandardMaterial color={jar?'#b77450':'#ab6746'} side={THREE.DoubleSide} roughness={.96} flatShading/></mesh>
    {jar?[-1,1].map(i=><mesh key={i} position={[i*.24,.62,0]} rotation={[0,0,i*.32]} castShadow><torusGeometry args={[.09,.027,4,10]}/><meshStandardMaterial color="#aa6a48" roughness={1}/></mesh>):<>
      {[0,1,2].map(i=><Box key={i} position={[Math.cos(i*Math.PI*2/3)*.25,.16,Math.sin(i*Math.PI*2/3)*.25]} size={[.1,.32,.13]} color="#995e40" rotation={-i*Math.PI*2/3}/>)}
      {[.43,.55,.67].map((y,row)=>Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2,r=.36+row*.045;return <Box key={`${row}-${i}`} position={[Math.cos(a)*r,y,Math.sin(a)*r]} size={[.055,.045,.055]} color="#bd7b53" rotation={-a}/>;}))}
    </>}
  </group>;
}
function Hearth({lit}:{lit:boolean}){
  const fire=useRef<THREE.Group>(null),glow=useRef<THREE.PointLight>(null);
  useFrame(({clock},dt)=>{const target=lit?1:0;if(fire.current){const v=THREE.MathUtils.lerp(fire.current.scale.x,target,1-Math.exp(-4*dt));fire.current.scale.set(v,v*(1+Math.sin(clock.elapsedTime*6)*.07),v);}if(glow.current)glow.current.intensity=THREE.MathUtils.lerp(glow.current.intensity,lit?1.6:0,1-Math.exp(-4*dt));});
  return <group>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,.04,0]}><circleGeometry args={[.72,16]}/><meshStandardMaterial color="#73674d"/></mesh>
    {[0,1,2].map(i=><Box key={i} position={[(i-1)*.18,.1,0]} size={[.11,.1,.83]} rotation={i*.9} color="#64513b"/>)}
    <group ref={fire} scale={0}>{[0,1,2,3,4].map(i=><mesh key={i} position={[(i-2)*.065,.2,.04*Math.sin(i)]}><coneGeometry args={[.085,.32+(i%2)*.1,4]}/><meshStandardMaterial color={i%2?'#eeac50':'#d77e34'} emissive="#e57829" emissiveIntensity={.35}/></mesh>)}</group>
    <pointLight ref={glow} position={[0,.3,0]} color="#ffae61" intensity={0} distance={2}/>
  </group>;
}
function Clay({building}:{building:number}){
  const ref=useRef<THREE.Group>(null),t=useRef(1);
  useEffect(()=>{t.current=building?0:1;},[building]);
  useFrame((_,dt)=>{
    if(document.hidden)return;
    t.current=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1,t.current+dt/4);
    ref.current?.children.forEach((child,i)=>{const size=THREE.MathUtils.clamp((t.current*9-i),0,1);child.scale.setScalar(size);child.visible=size>0;});
  });
  return <group><mesh rotation={[-Math.PI/2,0,0]} position={[0,.07,0]}><circleGeometry args={[.55,16]}/><meshStandardMaterial color="#aa9370"/></mesh><group ref={ref}>{Array.from({length:8},(_,i)=><mesh key={i} position={[0,.12+i*.065,0]} rotation={[Math.PI/2,0,0]} castShadow><torusGeometry args={[.19+Math.sin(i/8*Math.PI)*.1,.044,5,18]}/><meshStandardMaterial color="#b99572" roughness={1} flatShading/></mesh>)}</group><Box position={[.6,.12,.1]} size={[.12,.12,.47]} color="#bfa17c"/></group>;
}
function Kiln(){
  const blocks=useMemo(()=>{const b:Voxel[]=[];for(let x=-4;x<=4;x++)for(let z=-4;z<=4;z++){const r=Math.hypot(x,z);if(r<2||r>4.2||z>1&&Math.abs(x)<2)continue;b.push({p:[x*.15,.1+(4-r)*.08,z*.15],s:[.15,.22+(4-r)*.16,.15],c:noise(x,z)>.5?'#a77c57':'#b38862'});}return b;},[]);
  return <group position={[-4.7,0,-.25]}><Blocks blocks={blocks}/><Box position={[0,.035,0]} size={[.42,.04,.55]} color="#6e5945"/></group>;
}
function Tools({sickle=false}:{sickle?:boolean}){
  const blocks=useMemo(()=>{
    const b:Voxel[]=[];
    if(sickle){for(let i=0;i<18;i++){const x=(i-8)*.045,z=Math.pow((i-8)/12,2)*.28;b.push({p:[x,0,z],s:[.046,.06,.15],c:'#8c9185'});if(i%2===0)b.push({p:[x,0,z+.09],s:[.025,.045,.04],c:'#a4a999'});}}
    else for(let i=0;i<16;i++)for(let j=-2;j<=2;j++){if(i>12&&Math.abs(j)===2)continue;b.push({p:[j*.06,0,(i-7)*.06],s:[.061,.045+Math.sin(i/16*Math.PI)*.04,.061],c:Math.abs(j)<2?'#929d8b':'#a7ad9b'});}
    return b;
  },[sickle]);
  return <group rotation={[-.12,sickle?-.7:.35,.06]}><Blocks blocks={blocks}/></group>;
}
interface RigProps {selected:ObjectId|null;zone:ZoneId|null;reset:number;locked:boolean;entered:boolean}
function Rig({selected,zone,reset,locked,entered,onStart,onEnd}:RigProps&{onStart:()=>void;onEnd:()=>void}){
  const {size,camera}=useThree(),controls=useRef<ComponentRef<typeof OrbitControls>>(null);
  const snapshots=useRef(new Map<string,{position:THREE.Vector3;target:THREE.Vector3;zoom:number}>());
  const previous=useRef<string|null>(null),lastReset=useRef(reset),zoomGoal=useRef(42);
  const moving=useRef(true),goal=useRef(new THREE.Vector3()),camGoal=useRef(new THREE.Vector3());
  const zoom=selected?Math.min(165,size.width/5.4,size.height/4.4):zone?Math.min(125,size.width/6.9,size.height/5.8):Math.min(55,size.width/18.5,size.height/15.5);
  useEffect(()=>{
    const key=selected?`object:${selected}`:zone?`zone:${zone}`:'village';
    if(lastReset.current!==reset){snapshots.current.clear();lastReset.current=reset;previous.current=null;}
    if(previous.current&&previous.current!==key&&!moving.current&&controls.current)snapshots.current.set(previous.current,{position:camera.position.clone(),target:controls.current.target.clone(),zoom:camera.zoom});
    previous.current=key;
    const saved=snapshots.current.get(key);
    if(saved){goal.current.copy(saved.target);camGoal.current.copy(saved.position);zoomGoal.current=THREE.MathUtils.clamp(saved.zoom,zoom*.65,zoom*1.65);moving.current=true;return;}
    zoomGoal.current=zoom;
    const p=objects.find(o=>o.id===selected)?.position||zones.find(z=>z.id===zone)?.position||[0,.2,0];
    goal.current.set(p[0],p[1],p[2]);
    if(selected==='jar')goal.current.y=.5;
    camGoal.current.copy(goal.current).add(new THREE.Vector3(8,10,13));moving.current=true;
  },[selected,zone,reset,size.width,size.height]);
  useFrame(({camera},dt)=>{
    if(!controls.current||!moving.current)return;
    const alpha=matchMedia('(prefers-reduced-motion: reduce)').matches?1:1-Math.exp(-5*dt);
    camera.position.lerp(camGoal.current,alpha);controls.current.target.lerp(goal.current,alpha);camera.zoom=THREE.MathUtils.lerp(camera.zoom,zoomGoal.current,alpha);camera.updateProjectionMatrix();controls.current.update();
    if(camera.position.distanceTo(camGoal.current)<.003&&Math.abs(camera.zoom-zoomGoal.current)<.01)moving.current=false;
  });
  return <OrbitControls ref={controls} enabled={entered&&!locked} onStart={()=>{moving.current=false;onStart();}} onEnd={onEnd} enablePan={false} minZoom={Math.max(12,zoom*.65)} maxZoom={zoom*1.65} minPolarAngle={.4} maxPolarAngle={1.16} minAzimuthAngle={-.65} maxAzimuthAngle={1.2}/>;
}
class RenderBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?this.props.fallback:this.props.children;}}
function HitBox({position=[0,0,0],size}:{position?:Vec;size:Vec}){
  return <mesh position={position}><boxGeometry args={size}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh>;
}
function Target({id,active,selected,enabled,onHover,onSelect,children}:{id:InteractionId;active:boolean;selected:boolean;enabled:boolean;onHover:(id:InteractionId|null)=>void;onSelect:(id:InteractionId)=>void;children:ReactNode}){
  const ref=useRef<THREE.Group>(null);
  const bases=useRef(new Map<THREE.MeshStandardMaterial,{color:THREE.Color;intensity:number}>());
  useLayoutEffect(()=>{
    ref.current?.traverse(node=>{
      if(!(node instanceof THREE.Mesh))return;
      for(const m of Array.isArray(node.material)?node.material:[node.material]){
        if(!(m instanceof THREE.MeshStandardMaterial))continue;
        if(!bases.current.has(m))bases.current.set(m,{color:m.emissive.clone(),intensity:m.emissiveIntensity});
        const base=bases.current.get(m)!;
        const intensity=!enabled?0:active?.22:selected?.12:.035;
        m.emissive.copy(base.color).multiplyScalar(base.intensity).add(new THREE.Color('#e5bb70').multiplyScalar(intensity));m.emissiveIntensity=1;
      }
    });
  },[active,selected,enabled]);
  useEffect(()=>()=>{for(const [m,b] of bases.current){m.emissive.copy(b.color);m.emissiveIntensity=b.intensity;}bases.current.clear();},[]);
  const over=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();if(enabled&&e.pointerType!=='touch')onHover(id);};
  return <group ref={ref} onPointerOver={over} onPointerMove={over} onPointerOut={()=>onHover(null)} onClick={e=>{e.stopPropagation();if(enabled&&e.delta<=5)onSelect(id);}}>{children}</group>;
}
function TooltipPosition({id,element}:{id:InteractionId|null;element:RefObject<HTMLDivElement|null>}){
  const point=useMemo(()=>new THREE.Vector3(),[]);
  useFrame(({camera,size})=>{
    const el=element.current;if(!id||!el)return;
    const item=targetDefinition(id);point.set(...item.position);point.y+=.65;
    if(id==='slab'){point.x-=.55;point.z+=.6;}
    if(['jar','ding','clay'].includes(id))point.y=1.3;
    point.project(camera);
    el.style.transform=`translate(${Math.max(70,Math.min(size.width-70,(point.x+1)*size.width/2))}px,${Math.max(24,Math.min(size.height-24,(1-point.y)*size.height/2))}px) translate(-50%,-100%)`;
    el.style.visibility=Math.abs(point.x)>1.1||Math.abs(point.y)>1.1?'hidden':'visible';
  });return null;
}
function AdaptiveResolution({quality,onSlow}:{quality:number;onSlow:(value:number)=>void}){
  const sample=useRef({warm:0,time:0,frames:0});
  useFrame((_,dt)=>{
    if(document.hidden||dt>.3)return;
    const s=sample.current;s.warm+=dt;if(s.warm<2)return;
    s.time+=dt;s.frames++;
    if(s.time>=2){if(s.time/s.frames>1/29&&quality>.65)onSlow(Math.max(.65,quality-.15));s.time=0;s.frames=0;}
  });return null;
}
function ShadowRefresh({zone,animated}:{zone:ZoneId|null;animated:boolean}){
  const {gl}=useThree(),remaining=useRef(2),last=useRef(0);
  useEffect(()=>{gl.shadowMap.autoUpdate=false;gl.shadowMap.needsUpdate=true;return()=>{gl.shadowMap.autoUpdate=true;};},[gl]);
  useEffect(()=>{remaining.current=2;gl.shadowMap.needsUpdate=true;},[zone,animated,gl]);
  useFrame((_,dt)=>{remaining.current=Math.max(0,remaining.current-dt);last.current+=dt;if((remaining.current>0||animated)&&last.current>.09){gl.shadowMap.needsUpdate=true;last.current=0;}});
  return null;
}
interface Props extends RigProps {onSelect:(id:ObjectId)=>void;onZone:(id:ZoneId)=>void;placed:boolean;processed:number;motion:number;placement:PlacementClock;focusTarget:InteractionId|null;fire:boolean;building:number}
export default function Scene(props:Props){
  const {selected,zone,onSelect,onZone,placed,processed,motion,placement,focusTarget,locked,reset,entered,fire,building}=props;
  const [quality,setQuality]=useState(1),[hover,setHover]=useState<InteractionId|null>(null),[dragging,setDragging]=useState(false);
  const [tipKey,setTipKey]=useState('');
  const tooltipElement=useRef<HTMLDivElement>(null);
  const active=entered&&!locked&&!dragging?(hover||focusTarget):null;
  const key=active?`${zone||'village'}:${active}`:'';
  useEffect(()=>{setTipKey('');if(!key)return;const timer=setTimeout(()=>setTipKey(key),150);return()=>clearTimeout(timer);},[key]);
  useEffect(()=>{setHover(null);setTipKey('');},[selected,zone,locked,reset]);
  const shown=key&&tipKey===key?active:null;
  const pick=(id:InteractionId)=>{setHover(null);setTipKey('');if(zones.some(z=>z.id===id))onZone(id as ZoneId);else onSelect(id as ObjectId);};
  const target=(id:InteractionId,children:ReactNode)=>{const normalized=resolveTarget(id,zone);return <Target id={normalized} active={active===normalized} selected={selected===normalized} enabled={entered&&!locked} onHover={id=>{if(!dragging)setHover(id);}} onSelect={pick}>{children}</Target>;};
  const fallback=<div className="scene-fallback"><span>文化切片</span><h2>三维场景暂时无法显示</h2><p>请使用支持 WebGL 2 的桌面浏览器并开启硬件加速。下方区域与器物按钮仍可阅读资料、操作和查看回顾。</p></div>;
  return <RenderBoundary fallback={fallback}><div className="scene-renderer" data-highlight-target={active||selected||''} data-hover-target={shown||''} onPointerLeave={()=>setHover(null)}><Canvas shadows dpr={quality} fallback={fallback} style={{cursor:active?'pointer':locked?'default':dragging?'grabbing':'grab'}} gl={{antialias:true,alpha:true}} onPointerMissed={()=>setHover(null)}>
    <OrthographicCamera makeDefault position={[8,10,13]} zoom={42} near={.1} far={100}/>
    <ambientLight intensity={1.2}/><hemisphereLight args={['#fcf3db','#788663',1.15]}/>
    <directionalLight position={[-5,12,7]} intensity={2.5} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-normalBias={.035}/>
    <Suspense fallback={null}>
      <Terrain/><Plants/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.82,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial transparent opacity={.14}/></mesh>
      {target('dwelling',<><House position={[-3.45,0,-2.5]} scale={.85}/><House position={[0,0,-2.5]} open={zone==='dwelling'}/><House position={[3.35,0,-2.15]} scale={.82}/></>)}
      {target('slab',<group position={[-1.5,0,2.7]}><Slab/></group>)}
      {target('roller',<group position={[-1.5,0,2.7]}><Roller motion={motion} placed={placed}/></group>)}
      {target('grain',<GrainTransfer clock={placement} placed={placed} processed={processed}/>)}
      {target('ding',<group position={[1.8,0,2.6]}><Hearth lit={fire}/><group position={[0,.13,0]}><Pot/></group></group>)}
      {target('jar',<group position={[0,.07,-2.5]}><Pot jar/></group>)}
      {target('clay',<group position={[-4,0,1]}><Clay building={building}/></group>)}
      {target('pottery',<Kiln/>)}
      {target('shovel',<group position={[4.5,.18,1.4]}><Tools/><HitBox size={[.5,.25,1.1]}/></group>)}
      {target('sickle',<group position={[5.2,.18,2.5]}><Tools sickle/><HitBox position={[0,0,.1]} size={[.9,.25,.45]}/></group>)}
      {zones.map(z=><group key={z.id}>{target(z.id,<mesh position={[z.position[0],.025,z.position[2]]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[z.id==='grinding'?1.4:1.1,24]}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh>)}</group>)}
    </Suspense>
    <Rig selected={selected} zone={zone} reset={reset} locked={locked} entered={entered} onStart={()=>{setDragging(true);setHover(null);setTipKey('');}} onEnd={()=>{setDragging(false);setHover(null);}}/>
    <TooltipPosition id={shown} element={tooltipElement}/>
    <AdaptiveResolution quality={quality} onSlow={setQuality}/>
    <ShadowRefresh zone={zone} animated={placement.active||locked}/>
  </Canvas><div className="scene-labels">{shown&&<div ref={tooltipElement} id="scene-tooltip" role="tooltip" className="scene-tooltip">{targetDefinition(shown).name}</div>}</div></div></RenderBoundary>;
}
