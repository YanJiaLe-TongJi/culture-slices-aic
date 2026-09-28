import {useEffect,useMemo,useRef,type ReactNode} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import type {ActionClock} from './exhibit-state';
import type {Point} from './exhibits';
import {potteryFootprint,inFootprint,edgeDistance} from './site-footprints';

import {Blocks,Box,Stick,Torus,Hit,ClayMaterial,Jar,Mat,Basket,type Block} from './DioramaPrimitives';
const noise=(x:number,z:number)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
const clay=['#b87f5a','#c38a63','#cd976e','#b77b54'];






// Self-drawn illustration: no museum photograph is embedded. Polar UVs keep the
// decoration on the curved inner wall rather than floating above the vessel.
function paintTexture(net:boolean){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const c=canvas.getContext('2d')!;
 c.fillStyle='#c9916c';c.fillRect(0,0,1024,1024);
 for(let i=0;i<18000;i++){const n=noise(i,4);c.fillStyle=i%3?'#6c3d2110':'#ffe3b321';c.fillRect(noise(i,1)*1024,noise(i,2)*1024,1+n*3,1+n*3);}
 c.translate(512,512);c.strokeStyle=c.fillStyle='#302b25';c.lineCap='round';c.lineJoin='round';
 // Interrupted black band around the lip, with the same twofold organization
 // as the source's description; the figures remain explicitly interpretive.
 c.lineWidth=31;for(let i=0;i<8;i++){c.beginPath();c.arc(0,0,461,i*Math.PI/4+.04,(i+1)*Math.PI/4-.06);c.stroke();}
 function fish(x:number,y:number,size:number,turn:number){c.save();c.translate(x,y);c.rotate(turn);c.scale(size,size);c.beginPath();c.moveTo(-80,0);c.quadraticCurveTo(-20,-51,55,0);c.quadraticCurveTo(-20,51,-80,0);c.closePath();c.fill();c.beginPath();c.moveTo(-78,0);c.lineTo(-116,-34);c.lineTo(-110,33);c.closePath();c.fill();c.fillStyle='#c9916c';c.beginPath();c.arc(29,-5,5,0,Math.PI*2);c.fill();c.strokeStyle='#c9916c';c.lineWidth=3;for(let j=0;j<4;j++){c.beginPath();c.moveTo(-64+j*17,-18);c.lineTo(-42+j*17,18);c.stroke();}c.restore();}
 if(net){c.save();c.beginPath();c.arc(0,0,410,0,Math.PI*2);c.clip();c.lineWidth=8;for(let x=-850;x<850;x+=65){c.beginPath();c.moveTo(x,-430);c.lineTo(x+860,430);c.stroke();c.beginPath();c.moveTo(x,430);c.lineTo(x+860,-430);c.stroke();}c.restore();}
 else{
  for(let i=0;i<2;i++){c.save();c.rotate(i*Math.PI);c.translate(0,-240);c.lineWidth=9;c.beginPath();c.ellipse(0,0,79,74,0,0,Math.PI*2);c.stroke();c.beginPath();c.arc(0,-7,63,Math.PI,Math.PI*2);c.lineTo(0,-7);c.closePath();c.fill();c.beginPath();c.moveTo(-37,13);c.lineTo(-12,13);c.moveTo(13,13);c.lineTo(37,13);c.moveTo(0,7);c.lineTo(0,40);c.lineTo(21,40);c.moveTo(0,40);c.lineTo(-21,40);c.stroke();c.beginPath();c.moveTo(-23,-74);c.lineTo(0,-127);c.lineTo(23,-74);c.closePath();c.fill();fish(-106,46,.62,0);fish(106,46,.62,Math.PI);fish(-104,-19,.32,.3);fish(104,-19,.32,Math.PI-.3);c.restore();}
  fish(-245,0,1.13,-Math.PI/2);fish(245,0,1.13,Math.PI/2);
 }
 const t=new T.CanvasTexture(canvas);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;
}
function innerGeometry(r:number,h:number){
 const p:number[]=[],uv:number[]=[],indices:number[]=[],rings=24,segments=96;
 for(let j=0;j<=rings;j++){const q=j/rings;for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;p.push(Math.cos(a)*q*r,.12+h*Math.pow(q,2.05),Math.sin(a)*q*r);uv.push(.5+Math.cos(a)*q*.5,.5-Math.sin(a)*q*.5);}}
 for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function Basin({painted=false,net=false,paintRef,r=1.12,h=.61}:{painted?:boolean;net?:boolean;paintRef?:React.RefObject<T.MeshStandardMaterial|null>;r?:number;h?:number}){
 const points=useMemo(()=>[[0,.01],[.36,.01],[.47,.075],[.63,.16],[.8,.3],[.96,.49],[1.035,h+.09],[1.035,h+.15],[1,h+.16],[.995,h+.12]].map(([x,y])=>new T.Vector2(x*r,y)),[r,h]);
 const inner=useMemo(()=>innerGeometry(r,h),[r,h]),texture=useMemo(()=>paintTexture(net),[net]);
 useEffect(()=>()=>inner.dispose(),[inner]);useEffect(()=>()=>texture.dispose(),[texture]);
 return <><mesh castShadow receiveShadow><latheGeometry args={[points,96]}/><ClayMaterial color='#bd8966'/></mesh><mesh geometry={inner} receiveShadow><ClayMaterial color='#d4a27d'/></mesh><mesh geometry={inner} position={[0,.003,0]} receiveShadow><meshStandardMaterial ref={paintRef} map={texture} transparent opacity={painted?1:0} depthWrite={false} polygonOffset polygonOffsetFactor={-1} roughness={.97} side={T.DoubleSide}/></mesh><Torus r={r*1.017} y={h+.137} t={.027} c='#c9956e'/></>;
}



function Landscape(){
 const parts=useMemo(()=>{
  const land:Block[]=[],plants:Block[]=[],details:Block[]=[];
  for(let x=-21;x<=21;x++)for(let z=-17;z<=17;z++){
   const px=x*.34,pz=z*.34,n=noise(x,z);if(!inFootprint(px,pz,potteryFootprint))continue;const edge=edgeDistance(px,pz,potteryFootprint);
   const path=Math.abs(px*.25+pz-1.7)<.85||Math.abs(px-1.3)<.85;
   const grass=edge<.65||pz<-.9&&!path;
   land.push({p:[px,-.24,pz],s:[.342,.5,.342],c:grass?['#939a70','#a0a87b','#aeb18a'][Math.floor(noise(Math.floor(x/3),Math.floor(z/3))*3)]:['#c9b18a','#cfb993','#c1a781'][Math.floor(noise(Math.floor(x/2),Math.floor(z/2))*3)]});
   if(edge<.5){details.push({p:[px,-.55,pz],s:[.342,.25,.342],c:n>.5?'#9d815e':'#b09672'});if(n>.65)plants.push({p:[px,.09+n*.08,pz],s:[.055,.15+n*.12,.055],c:'#7e8c57'});}
   if(!grass&&n>.96)details.push({p:[px,.035,pz],s:[.07,.035,.05],c:'#a38c6c'});
  }
  for(const [x,z] of [[-5.8,-3.2],[5.9,-1.6],[4.8,3.5],[-4,4],[-1.5,-4.7],[3.6,-4.3]])for(let i=0;i<25;i++){const h=.1+noise(i,x)*.25;plants.push({p:[x+(noise(i,z)-.5)*1.15,h,z+(noise(i,9)-.5)*.9],s:[.19,.15,.19],c:['#87965e','#9ba572','#acb582'][i%3]});}
  // Scattered shards and stones remain scenery, not identified excavated finds.
  for(let i=0;i<25;i++)details.push({p:[2.9+noise(i,6)*1.5,.055,2.8+noise(i,8)*.9],s:[.06+noise(i,2)*.12,.045,.07],c:clay[i%4]});
  return {land,plants,details};
 },[]);
 return <><Blocks data={parts.land}/><Blocks data={parts.plants}/><Blocks data={parts.details}/><mesh position={[0,-.72,0]} rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[200,200]}/><shadowMaterial opacity={.14}/></mesh>
 {/* An irregular clay mixing hollow, with a low rim and wet surface. */}
 <group position={[-4.5,.015,2.3]}><mesh rotation={[-Math.PI/2,0,0]} scale={[1,.72,1]} receiveShadow><circleGeometry args={[1.05,36]}/><meshStandardMaterial color='#977854' roughness={.8}/></mesh><mesh position={[0,.004,0]} rotation={[-Math.PI/2,0,0]} scale={[1,.67,1]}><circleGeometry args={[.7,32]}/><meshStandardMaterial color='#8c7358' roughness={.38}/></mesh>{Array.from({length:14},(_,i)=><Box key={i} p={[Math.cos(i*.45)*.95,.08,Math.sin(i*.45)*.67]} s={[.27,.15,.23]} c={clay[i%4]} rotation={i*.45}/>)}</group>
 <group position={[-5.45,0,-2.3]}><Stick a={[0,0,0]} b={[-.15,2.5,0]} r={.14}/><Stick a={[-.1,1.6,0]} b={[-.9,2.9,-.2]} r={.07}/><Stick a={[-.1,2,0]} b={[.7,3.1,.2]} r={.065}/><Blocks data={Array.from({length:60},(_,i)=>({p:[(noise(i,2)-.5)*2,2.6+noise(i,3)*1.2,(noise(i,4)-.5)*1.7],s:[.45,.35,.45],c:['#84935f','#98a06c','#adb27d'][i%3]}))}/></group>
 <group position={[5.7,0,-3.3]}>{Array.from({length:15},(_,i)=><Stick key={i} a={[(i%5)*.12,0,Math.floor(i/5)*.13]} b={[(i%5)*.12+.12,.6+noise(i,4)*.35,Math.floor(i/5)*.13]} r={.022} c='#9ca06a'/>)}</group>
 </>;
}
function Shelter(){
 const blocks=useMemo(()=>{const b:Block[]=[];
  // Cut-away front keeps the interior work surface and stored vessels readable.
  for(let x=-8;x<=8;x++)for(let y=0;y<8;y++)b.push({p:[x*.19,.12+y*.19,-1.22],s:[.195,.19,.26],c:['#b49b73','#bda67e','#c3ad87'][Math.floor(noise(x,y)*3)]});
  for(let z=-5;z<=5;z++)for(let y=0;y<(z>1?3:8);y++)b.push({p:[-1.57,.12+y*.19,z*.22],s:[.22,.19,.225],c:y%2?'#b69d77':'#bea780'});
  for(let x=-10;x<=10;x++)for(let z=-7;z<=7;z++){if(x>2&&z>1)continue;const y=2.68-Math.abs(x*.18)*.43;b.push({p:[x*.18,y,z*.2],s:[.185,.13,.21],c:['#9c875b','#b49b64','#c0a870','#ac925c'][Math.floor(noise(Math.floor(x/2),z)*4)]});}
  return b;},[]);
 return <><Blocks data={blocks}/>{[-1.4,1.4].flatMap(x=>[-1.15,1.15].map(z=><Stick key={`${x}${z}`} a={[x,0,z]} b={[x,2.1,z]} r={.085}/>))}<Stick a={[0,2.72,-1.6]} b={[0,2.72,1.6]} r={.08}/>{[-1.3,0,1.3].map(z=><group key={z}><Stick a={[-1.75,1.99,z]} b={[0,2.73,z]} r={.045}/><Stick a={[0,2.73,z]} b={[1.75,1.99,z]} r={.045}/></group>)}<Box p={[0,.12,-.62]} s={[2.8,.21,1.06]} c='#968365'/><group position={[-.7,.235,-.45]}><Jar size={.9}/></group><group position={[.5,.235,-.7]}><Jar size={.68} dark/></group><group position={[.4,.035,.55]}><Mat w={1.7} d={.9}/></group><group position={[1,.04,.45]}><Basket size={.6}/></group></>;
}
function DryingRack(){
 return <><Box p={[0,.055,0]} s={[3.5,.08,2]} c='#bda57c'/>{[-1.5,1.5].flatMap(x=>[-.75,.75].map(z=><Stick key={`${x}${z}`} a={[x,0,z]} b={[x,2.45,z]} r={.065}/>))}{[.52,1.26].map(y=><group key={y}>{Array.from({length:13},(_,i)=><Box key={i} p={[-1.5+i*.25,y,0]} s={[.1,.07,1.65]} c={i%2?'#9e835b':'#a88e66'}/>)}<Stick a={[-1.65,y,-.7]} b={[1.65,y,-.7]} r={.055}/><Stick a={[-1.65,y,.7]} b={[1.65,y,.7]} r={.055}/></group>)}<group position={[-.95,1.31,0]}><Jar size={.65}/></group><group position={[0,1.31,0]}><Jar size={.53} dark/></group><group position={[.95,1.31,0]} scale={.49}><Basin painted/></group><group position={[-.95,.57,0]} scale={.44}><Basin/></group><group position={[.2,.57,0]} scale={.44}><Basin painted net/></group><group position={[1.03,.57,0]}><Jar size={.48}/></group>
 <group position={[0,2.48,-.1]} rotation={[.13,0,0]}><Mat w={3.6} d={2.3}/></group><Stick a={[-1.75,2.48,1.04]} b={[1.75,2.48,1.04]} r={.055}/><Stick a={[-1.75,2.65,-1.2]} b={[1.75,2.65,-1.2]} r={.055}/></>;
}
export default function PotteryWorkshop({value,variant,wrap,clock}:{value:()=>number;variant:number;wrap:(id:string,children:ReactNode)=>ReactNode;clock:ActionClock}){
 const bowl=useRef<T.Group>(null),coils=useRef<T.Group>(null),brush=useRef<T.Group>(null),paint=useRef<T.MeshStandardMaterial>(null);
 const coilData=useMemo(()=>Array.from({length:14},(_,i)=>({r:.42+i*.054,y:.065+i*.046})),[]);
 useFrame(()=>{
  const v=value(),shape=smooth(v),ink=smooth(v-1),turn=smooth(v-2);
  if(bowl.current){bowl.current.scale.y=.32+shape*.68;bowl.current.rotation.y=turn*Math.PI*.8;}
  if(paint.current)paint.current.opacity=ink;
  coils.current?.children.forEach((o,i)=>{const a=clamp(v*17-i);o.visible=v<.98&&a>.01;o.scale.setScalar(Math.max(.001,a));o.position.y=(1-smooth(a))*.35;});
  if(brush.current){const a=clock.phase*Math.PI*3.3;brush.current.visible=clock.running&&clock.index===1;brush.current.position.set(-.35+Math.cos(a)*.73*.55,.74+(.12+.61*Math.pow(.73/1.12,2.05))*.55,1.65+Math.sin(a)*.73*.55);brush.current.rotation.set(.3,0,-.5+Math.sin(a)*.15);}
 });
 return <><Landscape/>
 {wrap('shelter',<group position={[-3.15,0,-2.5]}><Shelter/></group>)}
 {wrap('drying',<group position={[3.45,0,-2.05]}><DryingRack/></group>)}
 {/* Low stone-supported work slab, with a woven mat and intentionally open foreground. */}
 <group position={[-.35,0,1.65]}>{[-1,1].map(x=><Box key={x} p={[x*.65,.22,0]} s={[.39,.4,1.35]} c='#a39377'/>)}<Box p={[0,.48,0]} s={[2.35,.15,1.95]} c='#b49a76'/><group position={[0,.565,0]}><Mat w={2.15} d={1.78}/></group><mesh position={[0,.67,0]} castShadow receiveShadow><cylinderGeometry args={[.78,.82,.12,48]}/><meshStandardMaterial color='#ac8962' roughness={1}/></mesh></group>
 {wrap('basin',<group position={[-.35,.74,1.65]} scale={.55}><group ref={bowl}><Basin paintRef={paint} net={variant>=.5}/></group><group ref={coils}>{coilData.map((d,i)=><group key={i}><Torus r={d.r} y={d.y} t={.038} c={clay[i%4]}/></group>)}</group></group>)}
 {wrap('coils',<group position={[-3.45,.035,.65]}><Mat w={1.85} d={1.6}/>{Array.from({length:7},(_,i)=><group key={i} position={[-.4,.07+i*.071,0]}><Torus r={.35+i*.012} t={.041} c={clay[(i+2)%4]}/></group>)}{[0,1,2].map(i=><Stick key={i} a={[.15,.1+i*.08,-.4]} b={[.7,.1+i*.08,.3]} r={.042} c='#b78a65'/>)}<mesh position={[.55,.1,-.5]} castShadow><sphereGeometry args={[.23,12,8]}/><meshStandardMaterial color='#ab7d59' roughness={1}/></mesh><Box p={[.55,.06,.47]} s={[.52,.055,.14]} c='#897357' rotation={-.25}/><Hit s={[1.9,.7,1.65]}/></group>)}
 {wrap('pigment',<group position={[2.25,.05,1.5]}><Box p={[0,.1,0]} s={[1.5,.18,1.65]} c='#9d917a'/><mesh position={[-.2,.21,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.43,40]}/><meshStandardMaterial color='#4a4035' roughness={.95}/></mesh><mesh position={[-.2,.215,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[.3,32]}/><meshStandardMaterial color='#282d28' roughness={.56}/></mesh><mesh position={[.29,.28,-.25]} rotation={[0,.55,.2]} castShadow><capsuleGeometry args={[.095,.33,4,12]}/><meshStandardMaterial color='#6e695b' roughness={.93}/></mesh><Stick a={[-.51,.27,.48]} b={[.55,.3,.55]} r={.025} c='#99794d'/><Stick a={[-.63,.275,.47]} b={[-.44,.28,.48]} r={.036} c='#443a2d'/><group position={[.62,.19,-.63]} scale={.2}><Basin/></group><Hit s={[1.65,.65,1.8]}/></group>)}
 <group ref={brush} scale={.55}><Stick a={[0,0,0]} b={[.13,.65,.15]} r={.023} c='#98784d'/><Stick a={[0,0,0]} b={[.02,.14,.025]} r={.029} c='#332e25'/></group>
 <group position={[-2.1,.03,3.25]}><Basket size={.85}/></group><group position={[-2.5,.03,2.4]}><Jar size={.65} dark/></group><group position={[4.7,.03,.6]}><Jar size={.9}/></group><group position={[4.65,.03,1.5]} scale={.52}><Basin painted net/></group><group position={[3.8,.03,2.4]}><Basket size={.62}/></group>
 <group position={[-.9,.03,-1.5]}><Mat w={1.5} d={1.1}/><group position={[-.35,.05,0]} scale={.4}><Basin painted/></group><group position={[.48,.05,0]}><Jar size={.42}/></group></group>
 {/* Open woven fence suggests a workshop boundary without enclosing the camera. */}
 {[-1,1,3,5].map(x=><group key={x}><Stick a={[x,0,-4.05]} b={[x,.87,-4.05]} r={.05}/>{[.3,.48,.66].map(y=><Stick key={y} a={[x-1,y,-4.05]} b={[x+1,y,-4.05]} r={.021} c='#aa986d'/>)}</group>)}
 </>;
}
