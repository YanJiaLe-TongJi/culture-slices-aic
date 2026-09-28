import {Component,lazy,Suspense,useEffect,useState,type ReactNode} from 'react';
import Timeline from './Timeline';
import {scenes} from './catalog';
import {parseRoute} from './routes';
const Experience=lazy(()=>import('./Experience'));
const ExhibitExperience=lazy(()=>import('./ExhibitExperience'));
class LoadBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<main className="route-message"><p>这一页暂时没有展开</p><h1>场景加载遇到了问题</h1><button className="primary" onClick={()=>location.reload()}>重新加载</button><a href="#/era/prehistory">返回时间轴</a></main>:this.props.children;}
}
export default function App(){
  const [route,setRoute]=useState(()=>parseRoute(location.hash));
  useEffect(()=>{const update=()=>setRoute(parseRoute(location.hash));window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[]);
  useEffect(()=>{document.title=route.kind==='scene'?`${scenes.find(s=>s.id===route.id)?.title||'探索'} · 文化切片`:'文化切片 · 在时间里遇见生活';},[route]);
  useEffect(()=>{window.scrollTo({top:0});},[route.kind]);
  if(route.kind==='era')return <Timeline eraId={route.id}/>;
  if(route.kind==='not-found')return <main className="route-message"><p>文化切片</p><h1>这一页还没有开放</h1><a className="primary" href="#/era/prehistory">回到历史长卷 →</a></main>;
  return <LoadBoundary key={route.id}><Suspense fallback={<main className="route-message" role="status"><p>文化切片</p><h1>正在展开这一页历史…</h1><a href="#/era/prehistory">返回时间轴</a></main>}>{route.id==='peiligang-grain'?<Experience/>:<ExhibitExperience key={route.id} sceneId={route.id}/>}</Suspense></LoadBoundary>;
}
