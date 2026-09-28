import {useEffect,useLayoutEffect,useMemo,useRef} from 'react';
import * as T from 'three';
import type {Point} from './exhibits';
export type Block={p:Point;s:Point;c:string};
const noise=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
export function Blocks({data}:{data:Block[]}){
 const ref=useRef<T.InstancedMesh>(null);
 useLayoutEffect(()=>{const d=new T.Object3D();data.forEach((b,i)=>{d.position.set(...b.p);d.scale.set(...b.s);d.updateMatrix();ref.current!.setMatrixAt(i,d.matrix);ref.current!.setColorAt(i,new T.Color(b.c));});ref.current!.instanceMatrix.needsUpdate=true;ref.current!.instanceColor!.needsUpdate=true;ref.current!.computeBoundingSphere();},[data]);
 return <instancedMesh ref={ref} args={[undefined,undefined,data.length]} castShadow receiveShadow><boxGeometry/><meshStandardMaterial roughness={.98}/></instancedMesh>;
}
export function Box({p=[0,0,0],s,c='#80654b',rotation=0}:{p?:Point;s:Point;c?:string;rotation?:number}){return <mesh position={p} rotation={[0,rotation,0]} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} roughness={.95}/></mesh>;}
export function Stick({a,b,r=.04,c='#796145'}:{a:Point;b:Point;r?:number;c?:string}){const delta=new T.Vector3(...b).sub(new T.Vector3(...a));return <mesh position={new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5)} quaternion={new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize())} castShadow><cylinderGeometry args={[r*.8,r,delta.length(),7]}/><meshStandardMaterial color={c} roughness={.98}/></mesh>;}
export function Torus({r=.5,t=.035,y=0,c='#b48c60'}:{r?:number;t?:number;y?:number;c?:string}){return <mesh position={[0,y,0]} rotation={[Math.PI/2,0,0]} castShadow><torusGeometry args={[r,t,6,64]}/><meshStandardMaterial color={c} roughness={.95}/></mesh>;}
export function Hit({s}:{s:Point}){return <mesh><boxGeometry args={s}/><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false}/></mesh>;}
export function ClayMaterial({color}:{color:string}){
 const map=useMemo(()=>{const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const c=canvas.getContext('2d')!;c.fillStyle='#ded8ce';c.fillRect(0,0,256,256);for(let i=0;i<6000;i++){c.fillStyle=i%3?'#80664618':'#ffffff35';const r=.5+noise(i,6)*1.4;c.fillRect(noise(i,1)*256,noise(i,2)*256,r,r);}for(let y=0;y<256;y+=12){c.fillStyle='#79634708';c.fillRect(0,y,256,1);}const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,1);t.anisotropy=4;return t;},[]);
 useEffect(()=>()=>map.dispose(),[map]);return <meshStandardMaterial color={color} map={map} roughness={.97} bumpMap={map} bumpScale={.006} side={T.DoubleSide}/>;
}
export function Jar({size=1,dark=false}:{size?:number;dark?:boolean}){
 const points=useMemo(()=>[[0,0],[.23,0],[.37,.15],[.49,.49],[.43,.75],[.27,.96],[.27,1.08],[.23,1.08],[.23,.96],[.39,.74],[.45,.49],[.32,.15],[.18,.07],[0,.07]].map(([x,y])=>new T.Vector2(x,y)),[]);
 return <group scale={size}><mesh castShadow receiveShadow><latheGeometry args={[points,40]}/><ClayMaterial color={dark?'#96745b':'#c78d66'}/></mesh><Torus r={.26} y={1.065} t={.026} c={dark?'#a68260':'#c7936d'}/>{[.36,.42,.48].map(y=><Torus key={y} r={.465} y={y} t={.009} c={dark?'#6b5141':'#a06a4b'}/>)}</group>;
}
export function Mat({w=2,d=1.5}:{w?:number;d?:number}){
 const data=useMemo(()=>{const b:Block[]=[];for(let i=0;i<w/.07;i++)b.push({p:[-w/2+i*.07,.025,0],s:[.038,.025,d],c:i%3?'#b59a67':'#c2aa79'});for(let j=0;j<d/.15;j++)b.push({p:[0,.039,-d/2+j*.15],s:[w,.018,.025],c:'#8d7953'});return b;},[w,d]);return <Blocks data={data}/>;
}
export function Basket({size=.55}:{size?:number}){
 return <group scale={size}>{Array.from({length:12},(_,i)=><Torus key={i} r={.45+i*.017} y={i*.055} t={.027} c={i%3?'#a58a59':'#c0a171'}/>)}{Array.from({length:16},(_,i)=><Stick key={i} a={[Math.cos(i*Math.PI/8)*.43,0,Math.sin(i*Math.PI/8)*.43]} b={[Math.cos(i*Math.PI/8)*.65,.66,Math.sin(i*Math.PI/8)*.65]} r={.021} c='#81704b'/>)}<mesh rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.45,32]}/><meshStandardMaterial color='#9a8159'/></mesh></group>;
}
