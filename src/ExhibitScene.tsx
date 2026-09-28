import {Component,Suspense,useEffect,useLayoutEffect,useMemo,useRef,useState,type ReactNode,type RefObject,type ComponentRef} from 'react';
import {Canvas,useFrame,useThree,type ThreeEvent} from '@react-three/fiber';
import {OrbitControls,OrthographicCamera} from '@react-three/drei';
import * as T from 'three';
import PotteryWorkshop from './PotteryWorkshop';
import FluteGrove from './FluteGrove';
import {FeastCourt,CastingYard,BellCourt} from './PreQinScenes';
import {LampCourt,LoomCourt,SlipsCourt} from './QinHanScenes';
import {EwerCourt,KilnYard} from './WeiJinScenes';
import WeiJinGrotto from './WeiJinGrotto';
import TangTeaScene from './TangTeaScene';
import TangPloughScene from './TangPloughScene';
import TangPrintScene from './TangPrintScene';
import SongTeaScene from './SongTeaScene';
import SongBridgeScene from './SongBridgeScene';
import YuanLandscapeScene from './YuanLandscapeScene';
import MingStudyScene from './MingStudyScene';
import QingPorcelainScene from './QingPorcelainScene';
import QingNewyearScene from './QingNewyearScene';
import ModernSewingScene from './ModernSewingScene';
import ModernCardingScene from './ModernCardingScene';
import ModernCinemaScene from './ModernCinemaScene';
import type {Exhibit,Point} from './exhibits';
import type {ActionClock} from './exhibit-state';

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const easing=(v:number)=>{const t=clamp(v);return t*t*(3-2*t);};
function Pick({id,active,selected,enabled,hover,choose,children}:{id:string;active:boolean;selected:boolean;enabled:boolean;hover:(id:string|null)=>void;choose:(id:string)=>void;children:ReactNode}){
 const root=useRef<T.Group>(null),original=useRef(new Map<T.MeshStandardMaterial,{c:T.Color;i:number}>());
 useLayoutEffect(()=>{root.current?.traverse(n=>{if(!(n instanceof T.Mesh))return;for(const m of Array.isArray(n.material)?n.material:[n.material]){if(!(m instanceof T.MeshStandardMaterial))continue;if(!original.current.has(m))original.current.set(m,{c:m.emissive.clone(),i:m.emissiveIntensity});const b=original.current.get(m)!;m.emissive.copy(b.c).multiplyScalar(b.i).add(new T.Color('#e4bf7b').multiplyScalar(!enabled?0:active?.2:selected?.11:.025));m.emissiveIntensity=1;}});},[active,selected,enabled]);
 useEffect(()=>()=>{for(const [m,b] of original.current){m.emissive.copy(b.c);m.emissiveIntensity=b.i;}original.current.clear();},[]);
 const over=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();if(enabled&&e.pointerType!=='touch')hover(id);};
 return <group ref={root} onPointerOver={over} onPointerMove={over} onPointerOut={()=>hover(null)} onClick={e=>{e.stopPropagation();if(enabled&&e.delta<5)choose(id);}}>{children}</group>;
}
interface ModelProps{value:()=>number;variant:number;wrap:(id:string,children:ReactNode)=>ReactNode;clock:ActionClock;selected?:string|null}
function Models(p:ModelProps&{kind:Exhibit['kind']}){switch(p.kind){case'pottery':return <PotteryWorkshop {...p}/>;case'flute':return <FluteGrove {...p}/>;case'feast':return <FeastCourt {...p}/>;case'casting':return <CastingYard {...p}/>;case'bells':return <BellCourt {...p}/>;case'lamp':return <LampCourt {...p}/>;case'loom':return <LoomCourt {...p}/>;case'slips':return <SlipsCourt {...p}/>;case'ewer':return <EwerCourt {...p}/>;case'kiln':return <KilnYard {...p}/>;case'grotto':return <WeiJinGrotto {...p}/>;case'tea':return <TangTeaScene {...p}/>;case'plough':return <TangPloughScene {...p}/>;case'printing':return <TangPrintScene {...p}/>;case'diancha':return <SongTeaScene {...p}/>;case'bridge':return <SongBridgeScene {...p}/>;case'landscape':return <YuanLandscapeScene {...p}/>;case'study':return <MingStudyScene {...p}/>;case'porcelain':return <QingPorcelainScene {...p}/>;case'newyear':return <QingNewyearScene {...p}/>;case'sewing':return <ModernSewingScene {...p}/>;case'carding':return <ModernCardingScene {...p}/>;case'cinema':return <ModernCinemaScene {...p}/>;}}
function Camera({target,reset,locked,drag,wide=false,area=false,inspect=false,detail=false,artifact=false,side=false}:{target:Point|null;reset:number;locked:boolean;drag:(b:boolean)=>void;wide?:boolean;area?:boolean;inspect?:boolean;detail?:boolean;artifact?:boolean;side?:boolean}){
 const {camera,size}=useThree(),controls=useRef<ComponentRef<typeof OrbitControls>>(null),moving=useRef(true),position=useMemo(()=>new T.Vector3(),[]),goal=useMemo(()=>new T.Vector3(),[]);
 const zoom=Math.min(target?(area?85:detail?230:wide?140:130):(wide?62:90),size.width/(target?(area?8.2:detail?3.8:5.8):(wide?18.5:10)),size.height/(target?(area?7:detail?3.1:4.8):(wide?14.5:8)));
 useEffect(()=>{goal.set(...(target||[0,.65,0]));position.copy(goal).add(side?new T.Vector3(12,4.5,6):artifact?new T.Vector3(4,3.8,12):inspect?new T.Vector3(5,13,9):new T.Vector3(8,9,12));moving.current=true;},[target,reset,zoom,goal,position,inspect,artifact,side]);
 useFrame((_,dt)=>{if(!controls.current||!moving.current)return;const a=matchMedia('(prefers-reduced-motion:reduce)').matches?1:1-Math.exp(-6*dt);camera.position.lerp(position,a);controls.current.target.lerp(goal,a);camera.zoom=T.MathUtils.lerp(camera.zoom,zoom,a);camera.updateProjectionMatrix();controls.current.update();if(camera.position.distanceTo(position)<.002&&Math.abs(camera.zoom-zoom)<.01)moving.current=false;});
 return <OrbitControls ref={controls} enabled={!locked} enablePan={false} minZoom={Math.max(10,zoom*.65)} maxZoom={zoom*1.6} minPolarAngle={.35} maxPolarAngle={artifact?1.32:1.2} minAzimuthAngle={artifact?0:-.6} maxAzimuthAngle={1.3} onStart={()=>{moving.current=false;drag(true);}} onEnd={()=>drag(false)}/>;
}
function ProjectTip({p,element}:{p:Point|null;element:RefObject<HTMLDivElement|null>}){const point=useMemo(()=>new T.Vector3(),[]);useFrame(({camera,size})=>{if(!p||!element.current)return;point.set(...p);point.y+=.6;point.project(camera);element.current.style.transform=`translate(${Math.max(65,Math.min(size.width-65,(point.x+1)*size.width/2))}px,${Math.max(25,Math.min(size.height-25,(1-point.y)*size.height/2))}px) translate(-50%,-100%)`;});return null;}
class Boundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?this.props.fallback:this.props.children;}}
export default function ExhibitScene({scene,selected,focus,choose,clock,stage,variant,entered,reset}:{scene:Exhibit;selected:string|null;focus:string|null;choose:(id:string)=>void;clock:ActionClock;stage:number;variant:number;entered:boolean;reset:number}){
 const [hover,setHover]=useState<string|null>(null),[dragging,setDragging]=useState(false),[tip,setTip]=useState<string|null>(null),element=useRef<HTMLDivElement>(null);
 const active=entered&&!clock.running&&!dragging?(hover||focus):null;
 useEffect(()=>{setTip(null);if(!active)return;const t=setTimeout(()=>setTip(active),150);return()=>clearTimeout(t);},[active]);
 useEffect(()=>{setHover(null);setTip(null);},[selected,clock.running,reset]);
 const shown=tip===active?scene.objects.find(o=>o.id===tip):null;
 // Restored progress must focus the object's settled position, not its starting mark.
 const settledPoint=(id:string|null):Point|null=>{const o=scene.objects.find(o=>o.id===id);if(!o)return null;
  if(scene.kind==='bridge'&&['boat','mast'].includes(o.id))return [o.position[0],o.position[1],o.position[2]-(stage>=3?6.3:0)];
  if(scene.kind==='landscape'&&o.id==='boat')return [stage>=3?2.6:-1.5,.19,2.4];
  return o.position;
 };
 const wrap=(id:string,children:ReactNode)=><Pick key={id} id={id} active={active===id} selected={selected===id} enabled={entered&&!clock.running} hover={id=>{if(!dragging)setHover(id);}} choose={id=>{setHover(null);setTip(null);choose(id);}}>{children}</Pick>;
 const fallback=<div className='scene-fallback'><span>文化切片</span><h2>三维场景暂时无法显示</h2><p>可通过下方物件按钮继续观察、操作和阅读资料。请使用支持 WebGL 2 的浏览器开启三维画面。</p></div>;
 return <Boundary fallback={fallback}><div className='scene-renderer' data-highlight-target={active||selected||''} onPointerLeave={()=>setHover(null)}><Canvas shadows dpr={[1,1.3]} gl={{antialias:true,alpha:true}} fallback={fallback} style={{cursor:active?'pointer':dragging?'grabbing':'grab'}}><OrthographicCamera makeDefault position={[8,9,12]} zoom={65} near={.1} far={80}/><ambientLight intensity={scene.kind==='lamp'?.9:1.2}/><hemisphereLight args={['#fff1d7','#73816d',1.1]}/><directionalLight position={[-4,10,5]} intensity={2.2} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-.0001} shadow-normalBias={.03}/><Suspense fallback={null}><Models selected={selected} kind={scene.kind} value={()=>clock.running?clock.index+easing(clock.phase):stage} variant={variant} wrap={wrap} clock={clock}/></Suspense><Camera side={scene.kind==='cinema'&&selected==='projector'} artifact={(scene.kind==='sewing'&&['machine','pedal','cloth'].includes(selected||''))||(scene.kind==='carding'&&['carder','sliver','drive'].includes(selected||''))||(scene.kind==='cinema'&&['projector','screen','speaker'].includes(selected||''))||(scene.kind==='lamp'&&['lamp','shade','smoke'].includes(selected||''))||(scene.kind==='grotto'&&selected==='buddha')||(scene.kind==='study'&&selected==='chair')||(scene.kind==='porcelain'&&(selected==='vase'||clock.running&&selected==='glaze'))} detail={(scene.kind==='sewing'&&['machine','pedal','cloth'].includes(selected||''))||(scene.kind==='cinema'&&['projector','film'].includes(selected||''))||(scene.kind==='study'&&['chair','joint','scroll'].includes(selected||''))||(scene.kind==='porcelain'&&['vase','brush','glaze'].includes(selected||''))||(scene.kind==='diancha'&&['bowl','pitcher','whisk','powder'].includes(selected||''))||(scene.kind==='tea'&&['mill','cake','sieve'].includes(selected||''))||(['ewer','spout','cup','blank','supports'].includes(selected||'')&&['ewer','kiln'].includes(scene.kind))||(scene.kind==='lamp'&&['lamp','shade','smoke'].includes(selected||''))||(scene.kind==='pottery'&&selected==='basin')||(scene.kind==='flute'&&['flute','tube','holes'].includes(selected||''))} inspect={scene.kind==='pottery'&&selected==='basin'} wide area={scene.kind==='landscape'||scene.kind==='bridge'||['factory','square','garden','books','yard','courtyard','stall','drying','shelter','shore','setting','hearth','store','furnace','gallery','rack','implements','room','mat','workshop','yarn','office','well','house','drain','shed','kiln','pillar','passage','shop','ridge','channel'].includes(selected||'')} target={scene.kind==='porcelain'&&clock.running&&selected==='glaze'?[-.8,1.65,1.5]:scene.kind==='bridge'&&clock.running&&['boat','mast'].includes(selected||'')?[.25,.7,0]:scene.kind==='landscape'&&clock.running&&selected==='boat'?[.6,.25,2.5]:settledPoint(selected)} reset={reset} locked={clock.running||!entered} drag={b=>{setDragging(b);setHover(null);setTip(null);}}/><ProjectTip p={shown?settledPoint(shown.id):null} element={element}/></Canvas><div className='scene-labels'>{shown&&<div ref={element} role='tooltip' className='scene-tooltip'>{shown.name}</div>}</div></div></Boundary>;
}
