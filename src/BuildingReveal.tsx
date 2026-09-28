import {useEffect,useLayoutEffect,useRef,type ReactNode} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
const noRaycast:T.Mesh['raycast']=()=>{};

/** Complete buildings in the overview; a reversible teaching section on selection. */
export function BuildingReveal({open,children,wall=false}:{open:boolean;children:ReactNode;wall?:boolean}){
 const root=useRef<T.Group>(null),amount=useRef(0),reduced=useRef(false),materials=useRef<T.Material[]>([]),meshes=useRef(new Map<T.Mesh,T.Mesh['raycast']>());
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{reduced.current=media.matches;};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 useLayoutEffect(()=>{const found=new Set<T.Material>();root.current?.traverse(n=>{if(n instanceof T.Mesh){if(!meshes.current.has(n))meshes.current.set(n,n.raycast);for(const m of Array.isArray(n.material)?n.material:[n.material])found.add(m);}});materials.current=[...found];});
 useFrame((_,dt)=>{
  const goal=open?1:0,previous=amount.current;
  amount.current=reduced.current?goal:T.MathUtils.damp(previous,goal,7,Math.min(dt,.05));
  if(Math.abs(amount.current-goal)<.002)amount.current=goal;
  const a=amount.current;if(!root.current)return;
  root.current.visible=a<1;
  root.current.position.y=wall?0:a*.55;
  for(const [mesh,raycast] of meshes.current)mesh.raycast=a>.6?noRaycast:raycast;
  for(const m of materials.current){const translucent=a>0;if(m.transparent!==translucent){m.transparent=translucent;m.needsUpdate=true;}m.opacity=1-a;m.depthWrite=!translucent;}
 });
 return <group ref={root} name={wall?'reveal-wall':'reveal-roof'}>{children}</group>;
}
