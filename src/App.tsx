import {Component,lazy,Suspense,useEffect,useState,type ReactNode} from 'react';
import Timeline from './Timeline';
import {scenes} from './catalog';
import {parseRoute} from './routes';
import {InkLandscape,ScrollLoader,Seal} from './ui';
const Experience=lazy(()=>import('./Experience'));
const ExhibitExperience=lazy(()=>import('./ExhibitExperience'));
function RouteMessage({kicker,title,children,busy=false}:{kicker:string;title:string;children:ReactNode;busy?:boolean}){
 return <main className="route-message" role={busy?'status':undefined}><InkLandscape className="route-ink" birds={false}/><div className="route-card">{busy?<ScrollLoader/>:<Seal text="文化切片" className="seal-lg"/>}<p>{kicker}</p><h1>{title}</h1><div className="route-actions">{children}</div></div></main>;
}
class LoadBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<RouteMessage kicker="这一页暂时没有展开" title="场景加载遇到了问题"><button className="btn btn-ink" onClick={()=>location.reload()}>重新加载</button><a className="btn btn-text" href="#/era/prehistory">返回时间轴</a></RouteMessage>:this.props.children;}
}
export default function App(){
 const [route,setRoute]=useState(()=>parseRoute(location.hash));
 useEffect(()=>{const update=()=>setRoute(parseRoute(location.hash));window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[]);
 useEffect(()=>{document.title=route.kind==='scene'?`${scenes.find(s=>s.id===route.id)?.title||'探索'} · 文化切片`:'文化切片 · 在时间里遇见生活';},[route]);
 // 首页自行决定停在卷首还是时代长卷；进入场景时回到顶部。
 useEffect(()=>{if(route.kind!=='era')window.scrollTo({top:0});},[route.kind,route.kind==='scene'?route.id:'']);
 const page=route.kind==='era'?<Timeline eraId={route.id}/>
  :route.kind==='not-found'?<RouteMessage kicker="文化切片" title="这一页还没有开放"><a className="btn btn-ink" href="#/">回到历史长卷</a></RouteMessage>
  :<LoadBoundary key={route.id}><Suspense fallback={<RouteMessage busy kicker="文化切片" title="正在展开这一页历史…"><a className="btn btn-text" href="#/era/prehistory">返回时间轴</a></RouteMessage>}>{route.id==='peiligang-grain'?<Experience/>:<ExhibitExperience key={route.id} sceneId={route.id}/>}</Suspense></LoadBoundary>;
 return <>{page}<div className="route-curtain" key={`curtain:${route.kind==='scene'?route.id:route.kind}`} aria-hidden="true"/></>;
}
