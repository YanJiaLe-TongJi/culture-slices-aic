import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {eras,scenes,readyScene} from './catalog';
import {restoreProgress,STORAGE_KEY} from './state';
import {LAST_SCENE_KEY} from './exhibit-state';
import './timeline.css';
function Motif({index}:{index:number}){
  return <svg viewBox="0 0 120 100" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">{index===1?<><path d="M18 76h84M30 76V47l30-25 30 25v29M43 76V54h34v22M25 45l35-29 35 29"/><path d="M36 37h49M60 16v10M49 34v12m22-12v12"/></>:<><circle cx="60" cy="47" r="26"/><circle cx="60" cy="47" r="17"/><path d="M60 16V8m0 78v-8M29 47h-8m78 0h-8M42 28l-6-6m48 50-6-6M78 28l6-6M36 72l6-6M35 85h50"/></>}</svg>;
}
export default function Timeline({eraId}:{eraId:string}){
  const era=eras.find(e=>e.id===eraId)!,index=era.order;
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const [narrow,setNarrow]=useState(()=>matchMedia('(max-width: 700px)').matches);
  const [saved]=useState(()=>{try{return restoreProgress(localStorage.getItem(STORAGE_KEY));}catch{return null;}});
  const [coverFailed,setCoverFailed]=useState<string[]>([]);
  const [resume]=useState(()=>{try{const id=localStorage.getItem(LAST_SCENE_KEY);return scenes.find(s=>s.id===id&&s.status==='ready')||(saved?.entered?readyScene:null);}catch{return saved?.entered?readyScene:null;}});
  useEffect(()=>{const mq=matchMedia('(max-width: 700px)'),update=()=>setNarrow(mq.matches);mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update);},[]);
  useEffect(()=>{if(!narrow)buttons.current[index]?.scrollIntoView({block:'nearest',inline:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[index,narrow]);
  function choose(next:number,focus=false){const n=Math.max(0,Math.min(eras.length-1,next));location.hash=`/era/${eras[n].id}`;if(focus)buttons.current[n]?.focus({preventScroll:true});}
  function navigate(e:KeyboardEvent<HTMLButtonElement>,i:number){
    const n=e.key==='Home'?0:e.key==='End'?eras.length-1:['ArrowRight','ArrowDown'].includes(e.key)?i+1:['ArrowLeft','ArrowUp'].includes(e.key)?i-1:null;
    if(n!==null){e.preventDefault();choose(n,true);}
  }
  return <div className="timeline-shell">
    <header className="topbar"><a className="brand" href="#/era/prehistory" aria-label="文化切片首页"><span className="brand-mark">切</span><span>文化切片<small>CULTURE, UP CLOSE</small></span></a><span className="timeline-edition">历史长卷 <i/> 器物里的生活</span>{resume?<a className="timeline-resume" href={`#/scene/${resume.id}`}>继续探索 <span aria-hidden="true">↗</span></a>:<span className="timeline-header-note">从一处生活，看见一个时代</span>}</header>
    <main className="timeline-main">
      <section className="timeline-intro"><div><p className="timeline-kicker"><span/> A JOURNEY THROUGH EVERYDAY LIFE</p><h1>在时间里，<br/>遇见<span>生活。</span></h1></div><div className="timeline-intro-copy"><span className="intro-seal">古今</span><p>让器物回到生活，<br/>让好奇走进历史。</p><span>沿着时间，走进一处微缩场景。<br/>观察、动手，再与 AI 探索向导聊一聊。</span></div></section>
      <section className="era-navigation" aria-label="历史时期"><div className="timeline-section-top"><span>循着时间，选择一站</span><div className="timeline-arrows"><button onClick={()=>choose(index-1)} disabled={index===0} aria-label="上一个时期">←</button><button onClick={()=>choose(index+1)} disabled={index===eras.length-1} aria-label="下一个时期">→</button></div></div><div className="era-track" role="tablist" aria-label="历史时期" aria-orientation={narrow?'vertical':'horizontal'}>{eras.map((e,i)=><button key={e.id} ref={el=>{buttons.current[i]=el;}} id={`era-${e.id}`} className={`era-stop ${eraId===e.id?'active':''}`} role="tab" aria-selected={eraId===e.id} aria-controls="era-panel" tabIndex={eraId===e.id?0:-1} onClick={()=>choose(i)} onKeyDown={event=>navigate(event,i)}><span className="era-order">0{i+1}</span><span className="era-dot"/><strong>{e.title}</strong><span className="era-status">{scenes.filter(s=>s.eraId===e.id&&s.status==='ready').length?`${scenes.filter(s=>s.eraId===e.id&&s.status==='ready').length} 个切片已开放`:'场景筹备中'}</span></button>)}</div></section>
      <section className="era-panel" id="era-panel" role="tabpanel" aria-labelledby={`era-${era.id}`} tabIndex={0}><div className="era-heading"><div><span className="timeline-kicker">CHAPTER 0{index+1} / 历史切片</span><h2>{era.title}<small>三种视角，走近一个时代</small></h2><p>{era.introduction}</p></div><p className="era-question">{era.question}</p></div><div className="slice-grid">{era.sceneIds.map((id,i)=>{const slice=scenes.find(s=>s.id===id)!;return <article className={`slice-card ${slice.status}`} key={id}>{slice.status==='ready'?<><a className="slice-cover" href={`#/scene/${slice.id}`} tabIndex={-1} aria-hidden="true">{!coverFailed.includes(id)?<img src={slice.cover} alt="" onError={()=>setCoverFailed(ids=>[...ids,id])}/>:<span className="cover-fallback">{slice.title}</span>}<span className="cover-badge">可探索</span><span className="cover-caption">{slice.title}</span></a><div className="slice-body"><span className="slice-category">0{i+1} · {slice.category}</span><h3>{slice.title}</h3><p>{slice.description}</p><a className="slice-enter" href={`#/scene/${slice.id}`}>进入场景 <span aria-hidden="true">↗</span></a></div></>:<><div className="planned-art"><Motif index={i}/><span>筹备中</span></div><div className="slice-body"><span className="slice-category">0{i+1} · 未来的切片</span><h3>{slice.title}</h3><p>{slice.description}</p><span className="planned-note">正在寻找有据可循的生活片段</span></div></>}</article>;})}</div></section>
      <footer className="timeline-footer"><p><span>观其物 · 知其用 · 见其人</span><br/>以文物资料为依据，用微缩场景与 AI 讲解走近历史。</p><p>按历史阶段浏览，后续在组内展开朝代与文化。<br/>每处场景标明资料来源与艺术演绎，持续核对与完善。</p></footer>
    </main>
  </div>;
}
