import HighspeedScene from '../src/HighspeedScene';
import TiangongScene from '../src/TiangongScene';
import DigitalHeritageScene from '../src/DigitalHeritageScene';
// Local visual diagnostic only; not imported by the application or production build.
import React,{useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Canvas,useThree} from '@react-three/fiber';
import {Roof} from '../src/ArchitecturePrimitives';
import {BrickPanel} from '../src/ModernPrimitives';
import {LateGround} from '../src/LateArchitectureParts';
import PotteryWorkshop from '../src/PotteryWorkshop';
import {LampCourt} from '../src/QinHanScenes';
import {KilnYard} from '../src/WeiJinScenes';
import WeiJinGrotto from '../src/WeiJinGrotto';
import {createActionClock} from '../src/exhibit-state';
const kind=new URLSearchParams(location.search).get('case')||'wall';
const settings:Record<string,{target:[number,number,number];zoom:number;selected?:string}>={train:{target:[19.3,1.5,2.55],zoom:100},'train-joint':{target:[13.25,1.5,2.55],zoom:180},'train-tail':{target:[-19.3,1.5,2.55],zoom:100},station:{target:[0,2,-2],zoom:42},space:{target:[0,2,0],zoom:33},digital:{target:[0,1,-1],zoom:37},'digital-open':{target:[-5.3,2,-1.5],zoom:100,selected:'camera'},firing:{target:[7.25,.65,-4.8],zoom:95,selected:'firing'},well:{target:[6.7,.8,.45],zoom:150,selected:'service-court'},clay:{target:[5.8,.65,1.3],zoom:100,selected:'clay-pit'},grotto:{target:[0,3,-1.8],zoom:32},'grotto-open':{target:[0,2.9,0],zoom:73,selected:'pillar'},'grotto-niche':{target:[0,2,1.45],zoom:140,selected:'buddha'}};
const setting=settings[kind];
const target: [number,number,number]=setting?.target||(kind==='wall'?[0,1.5,0]:kind==='roof'?[0,3,0]:[0,0,0]);
const position:[number,number,number]=setting?[target[0]+8,target[1]+9,target[2]+12]:kind==='wall'?[2,2.9,-8]:kind==='roof'?[5,7,9]:[2,8,7];
const props={value:()=>0,variant:0,clock:createActionClock(()=>{}),selected:setting?.selected,wrap:(id:string,children:React.ReactNode)=><group key={id}>{children}</group>};
function Probe(){const {camera,gl,scene}=useThree();useEffect(()=>{
 const set=(offset:number)=>{camera.position.set(position[0]+offset,position[1],position[2]);camera.lookAt(...target);camera.updateMatrixWorld();gl.render(scene,camera);};set(0);
 Object.assign(window,{flickerProbe:{set}});
 return()=>{delete (window as any).flickerProbe;};
 },[camera,gl,scene]);return null;}
createRoot(document.getElementById('root')!).render(<Canvas orthographic dpr={1} gl={{antialias:true}} camera={{position,zoom:setting?.zoom||100,near:.1,far:80}}><color attach='background' args={['#e7e7dc']}/><ambientLight intensity={2}/>{(kind.startsWith('train')||kind==='station')?<HighspeedScene {...props}/>:kind==='space'?<TiangongScene {...props}/>:kind.startsWith('digital')?<DigitalHeritageScene {...props}/>:kind==='firing'?<PotteryWorkshop {...props}/>:kind==='well'?<LampCourt {...props}/>:kind==='clay'?<KilnYard {...props}/>:kind.startsWith('grotto')?<WeiJinGrotto {...props}/>:kind==='wall'?<BrickPanel w={5} h={3}/>:kind==='roof'?<Roof w={5} d={4} eave={2.4} rise={.9} material='clay'/>:<LateGround kind='study'/>}<Probe/></Canvas>);
