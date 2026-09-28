import {useEffect,useMemo,useRef,useState,type CSSProperties,type KeyboardEvent,type PointerEvent} from 'react';
import {eras,scenes,readyScene,type SceneSummary} from './catalog';
import {restoreProgress,STORAGE_KEY} from './state';
import {LAST_SCENE_KEY,exhibitKey,restoreExhibit} from './exhibit-state';
import {exhibits,getExhibit} from './exhibits';
import {objects as villageObjects,sources as villageSources,zones} from './content';
import {categoryNotes,eraTheme,formalNumber,hanNumber,webpCover} from './era-theme';
import {BrandMark,CountUp,Icon,InkBirds,InkLandscape,Seal,useLiveSections,useReveal} from './ui';
import './timeline.css';

type Ready=SceneSummary&{status:'ready'};
type Mark={viewed:number;total:number;done:boolean;entered:boolean};
const ready=scenes.filter((s):s is Ready=>s.status==='ready');
const showcase=['peiligang-grain','pre-qin-culture','qin-han-living','wei-jin-culture','sui-tang-living','song-yuan-making','ming-qing-living','modern-making','new-era-making'].map(id=>ready.find(s=>s.id===id)).filter((s):s is Ready=>!!s);
const stats=[
 {value:eras.length,label:'个历史分组'},
 {value:ready.length,label:'处微缩场景'},
 {value:exhibits.reduce((n,s)=>n+s.objects.length,0)+villageObjects.length,label:'个观察入口'},
 {value:new Set([...exhibits.flatMap(s=>s.sources.map(x=>x.url)),...villageSources.map(s=>s.url)]).size,label:'条资料出处'}
];
const methods=[
 {title:'观其物',en:'OBSERVE',text:'悬停发现，点击靠近。器物、房屋与地形都在一块微缩地台上，可以旋转、缩放、细看。',art:<><path pathLength={1} d="M14 30h40M18 30c0 13 7 20 18 20s18-7 18-20M22 30v-8h6v8M42 30v-8h6v8M25 48l-4 12M36 51v10M47 48l4 12"/><circle pathLength={1} cx="58" cy="38" r="10"/><path pathLength={1} d="m65 45 9 9"/></>},
 {title:'试其用',en:'TRY',text:'磨粮、范铸、引梭、刷印……每处切片都有三到四步操作，随时可以取消、跳过或重放。',art:<><path pathLength={1} d="M8 52h64M12 52c4 7 52 7 56 0"/><rect pathLength={1} x="22" y="38" width="36" height="8" rx="4"/><path pathLength={1} d="M16 30q-5 8 0 16M64 30q5 8 0 16M34 26l6-8 6 8"/></>},
 {title:'问其详',en:'ASK',text:'AI 向导知道你正看着什么、做过什么，结合已登记资料讲解，并标出依据。',art:<><path pathLength={1} d="M10 12h60v34H36l-13 11V46H10Z"/><path pathLength={1} d="M20 24h40M20 33h26"/><rect pathLength={1} x="52" y="36" width="14" height="14" rx="1"/></>},
 {title:'溯其源',en:'TRACE',text:'文物事实、使用解释与艺术推定分开标注，每条资料都能回到博物馆与考古机构原文。',art:<><path pathLength={1} d="M40 20c-8-6-20-6-28-2v38c8-4 20-4 28 2 8-6 20-6 28-2V18c-8-4-20-4-28 2ZM40 20v38"/><path pathLength={1} d="M20 28h12M20 36h12M48 28h12M48 36h8"/></>}
];
function sceneMeta(id:string){
 if(id==='peiligang-grain')return `${zones.length} 处生活角落 · ${villageObjects.length} 件器物`;
 const ex=getExhibit(id);return ex?`${ex.objects.length} 个观察入口 · ${ex.steps.length} 步操作`:'';
}
function readMark(id:string):Mark|null{
 try{
  if(id==='peiligang-grain'){const p=restoreProgress(localStorage.getItem(STORAGE_KEY));return {viewed:p.viewed.length,total:villageObjects.length,done:p.actions.includes('ground'),entered:p.entered};}
  const ex=getExhibit(id);if(!ex)return null;const p=restoreExhibit(ex,localStorage.getItem(exhibitKey(id)));
  return {viewed:p.viewed.length,total:ex.objects.length,done:p.actions.length===ex.steps.length,entered:p.entered};
 }catch{return null;}
}
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function Cover({scene,eager=false}:{scene:Ready;eager?:boolean}){
 const [src,setSrc]=useState(()=>webpCover(scene.cover)),[failed,setFailed]=useState(false);
 return failed?<span className="cover-fallback">{scene.title}</span>:<img src={src} alt="" decoding="async" loading={eager?'eager':'lazy'} className={scene.id==='new-era-living'?'is-wide':undefined} onError={()=>{if(src!==scene.cover)setSrc(scene.cover);else setFailed(true);}}/>;
}
function FrameDraw(){return <span className="frame-draw" aria-hidden="true"><i/><i/><i/><i/></span>;}

export default function Timeline({eraId}:{eraId:string}){
 const era=eras.find(e=>e.id===eraId)!,index=era.order,theme=eraTheme(era.id);
 const page=useRef<HTMLDivElement>(null),hero=useRef<HTMLElement>(null),rail=useRef<HTMLDivElement>(null),panel=useRef<HTMLDivElement>(null);
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const [narrow,setNarrow]=useState(()=>matchMedia('(max-width: 700px)').matches);
 const [scrolled,setScrolled]=useState(false);
 const [slide,setSlide]=useState(0),[paused,setPaused]=useState(false);
 const [ai,setAi]=useState<{configured:boolean;provider:string}|null>(null);
 const [marks]=useState(()=>Object.fromEntries(ready.map(s=>[s.id,readMark(s.id)])) as Record<string,Mark|null>);
 const [resume]=useState(()=>{
  let saved=null;try{saved=restoreProgress(localStorage.getItem(STORAGE_KEY));}catch{/* storage unavailable */}
  try{const id=localStorage.getItem(LAST_SCENE_KEY);return ready.find(s=>s.id===id)||(saved?.entered?readyScene:null);}catch{return saved?.entered?readyScene:null;}
 });
 const pendingFocus=useRef(false),followPanel=useRef(false);
 useReveal(page);
 useLiveSections(page);
 useReveal(panel,[era.id]);
 useEffect(()=>{const mq=matchMedia('(max-width: 700px)'),update=()=>setNarrow(mq.matches);mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update);},[]);
 // 从场景返回或直接打开某一卷时，定位到时代长卷；默认首页停在卷首。
 useEffect(()=>{if(/^#\/era\//.test(location.hash))document.getElementById('chronicle')?.scrollIntoView({block:'start'});},[]);
 useEffect(()=>{
  let frame=0;const update=()=>{frame=0;const y=scrollY;setScrolled(y>30);hero.current?.style.setProperty('--sy',String(Math.min(1,y/Math.max(1,innerHeight))));};
  const on=()=>{if(!frame)frame=requestAnimationFrame(update);};update();addEventListener('scroll',on,{passive:true});return()=>{removeEventListener('scroll',on);cancelAnimationFrame(frame);};
 },[]);
 useEffect(()=>{if(paused||reduced())return;const t=setInterval(()=>{if(!document.hidden)setSlide(n=>(n+1)%showcase.length);},4600);return()=>clearInterval(t);},[paused]);
 useEffect(()=>{const c=new AbortController();fetch('/api/status',{signal:c.signal}).then(r=>r.json()).then(x=>setAi({configured:x.configured===true,provider:x.provider||'AI'})).catch(()=>{});return()=>c.abort();},[]);
 useEffect(()=>{
  const track=rail.current,tab=buttons.current[index];
  if(track&&tab&&!narrow)track.scrollTo({left:tab.offsetLeft-track.clientWidth/2+tab.offsetWidth/2,behavior:reduced()?'auto':'smooth'});
  const behavior=reduced()?'auto':'smooth';
  if(pendingFocus.current){pendingFocus.current=false;panel.current?.focus({preventScroll:true});(narrow?panel.current:document.getElementById('chronicle'))?.scrollIntoView({block:'start',behavior});}
  else if(followPanel.current){followPanel.current=false;panel.current?.scrollIntoView({block:'start',behavior});}
 },[index,narrow]);
 const choose=(next:number,focus=false)=>{const n=Math.max(0,Math.min(eras.length-1,next));location.hash=`/era/${eras[n].id}`;if(focus)buttons.current[n]?.focus({preventScroll:true});};
 const turn=(next:number)=>{pendingFocus.current=true;choose(next);};
 function navigate(e:KeyboardEvent<HTMLButtonElement>,i:number){
  const n=e.key==='Home'?0:e.key==='End'?eras.length-1:['ArrowRight','ArrowDown'].includes(e.key)?i+1:['ArrowLeft','ArrowUp'].includes(e.key)?i-1:null;
  if(n!==null){e.preventDefault();choose(n,true);}
 }
 const scrollToId=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});
 const toTop=()=>scrollTo({top:0,behavior:reduced()?'auto':'smooth'});
 const random=()=>{const pool=ready.filter(s=>s.id!==resume?.id);location.hash=`/scene/${pool[Math.floor(Math.random()*pool.length)].id}`;};
 function parallax(e:PointerEvent<HTMLElement>){
  if(e.pointerType!=='mouse'||reduced())return;const r=e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx',((e.clientX-r.left)/r.width*2-1).toFixed(3));e.currentTarget.style.setProperty('--my',((e.clientY-r.top)/r.height*2-1).toFixed(3));
 }
 const current=showcase[slide],currentEra=eras.find(e=>e.id===current.eraId)!,rows=useMemo(()=>[ready.slice(0,14),ready.slice(14)],[]);
 const ring=eras.map(e=>e.title).join('　·　')+'　·　';

 return <div className="home" ref={page} style={{'--era':theme.color} as CSSProperties}>
  <header className={`site-nav ${scrolled?'is-scrolled':''}`}>
   <BrandMark href="#/" onClick={toTop}/>
   <nav className="site-links" aria-label="首页导航"><button onClick={()=>scrollToId('chronicle')}>时代长卷</button><button onClick={()=>scrollToId('method')}>游览之法</button><button onClick={()=>scrollToId('panorama')}>全景长卷</button></nav>
   <span className="site-note">从一处生活，看见一个时代</span>
  </header>

  <main>
   <section className="hero" ref={hero} onPointerMove={parallax} aria-labelledby="hero-title" data-live>
    <InkLandscape className="hero-ink" sun={false} birds={false}/>
    <InkBirds className="hero-birds"/>
    <div className="hero-calligraphy" aria-hidden="true">{[...'文化切片'].map((c,i)=><span key={c} style={{'--i':i} as CSSProperties}>{c}</span>)}<Seal text="古今" className="hero-calligraphy-seal"/></div>
    <div className="hero-copy">
     <p className="kicker hero-kicker"><span className="kicker-line"/>一部可以走进去的历史长卷</p>
     <h1 id="hero-title" className="hero-title"><span className="hero-line">在时间里，</span><span className="hero-line">遇见<em>生活</em>。</span></h1>
     <p className="hero-verse">{['观其物','试其用','问其详'].map((t,i)=><span key={t} style={{'--i':i} as CSSProperties}>{t}</span>)}</p>
     <p className="hero-lede">从一粒粟到一列高铁，九个历史分组、二十七处可以走进去的微缩生活场景。靠近一件器物，亲手试一试它的用法，再向懂得此情此景的 AI 向导追问——每一句讲解，都能回到资料出处。</p>
     <div className="hero-actions">
      <button className="btn btn-ink" onClick={()=>scrollToId('chronicle')}>展卷入史<Icon type="down" size={18}/></button>
      {resume?<a className="btn btn-line" href={`#/scene/${resume.id}`} aria-label="继续探索">继续探索<span className="btn-note">{resume.title}</span><Icon type="arrow" size={18}/></a>:null}
      <button className="btn btn-text" onClick={random}><Icon type="shuffle" size={18}/>随手翻一页</button>
     </div>
     <dl className="hero-stats">{stats.map(s=><div key={s.label}><dt><CountUp value={s.value}/></dt><dd>{s.label}</dd></div>)}</dl>
    </div>
    <figure className="moon-gate" onPointerEnter={()=>setPaused(true)} onPointerLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)}>
     <svg className="moon-ring" viewBox="0 0 500 500" aria-hidden="true"><defs><path id="moon-ring-path" d="M250 250m-236 0a236 236 0 1 1 472 0a236 236 0 1 1-472 0"/></defs><text><textPath href="#moon-ring-path" textLength="1478" lengthAdjust="spacing">{ring}</textPath></text></svg>
     <div className="moon-frame" aria-hidden="true"><div className="moon-window">{showcase.map((s,i)=><div key={s.id} className={`moon-slide ${i===slide?'on':''}`}><Cover scene={s} eager/></div>)}</div><span className="moon-lattice"/></div>
     <figcaption><a className="moon-caption" href={`#/scene/${current.id}`} key={current.id}><Seal text={eraTheme(current.eraId).glyph}/><span><small>卷{hanNumber(currentEra.order+1)} · {currentEra.title}</small><b>{current.title}</b></span><Icon type="arrow" size={18}/></a></figcaption>
     <div className="moon-dots" role="group" aria-label="卷首轮播">{showcase.map((s,i)=><button key={s.id} aria-label={`展示${s.title}`} aria-pressed={i===slide} onClick={()=>setSlide(i)}/>)}</div>
    </figure>
    <button className="scroll-cue" onClick={()=>scrollToId('chronicle')}><span>向下展卷</span><i aria-hidden="true"/></button>
   </section>

   <section className="chronicle" id="chronicle" aria-labelledby="chronicle-title" data-live>
    <header className="section-head" data-reveal>
     <span className="section-no" aria-hidden="true">壹</span>
     <div><p className="kicker">时代长卷 · NINE SCROLLS</p><h2 id="chronicle-title">循着时间，展开九卷</h2><p className="section-note">九个分组用于导航阅读，并非朝代的简单接替，也不意味着后来者更好。</p></div>
     <div className="rail-arrows"><button onClick={()=>choose(index-1)} disabled={index===0} aria-label="上一个时期"><Icon type="back" size={18}/></button><button onClick={()=>choose(index+1)} disabled={index===eras.length-1} aria-label="下一个时期"><Icon type="arrow" size={18}/></button></div>
    </header>
    <div className="era-rail" ref={rail} role="tablist" aria-label="历史时期" aria-orientation={narrow?'vertical':'horizontal'} style={{'--at':index} as CSSProperties}>
     <svg className="era-river" viewBox="0 0 900 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20C50 8 100 32 150 20S250 8 300 20 400 32 450 20 550 8 600 20 700 32 750 20 850 8 900 20"/><path className="era-river-flow" d="M0 20C50 8 100 32 150 20S250 8 300 20 400 32 450 20 550 8 600 20 700 32 750 20 850 8 900 20"/></svg>
     <span className="era-marker" aria-hidden="true"><i/></span>
     {eras.map((e,i)=>{const t=eraTheme(e.id),count=scenes.filter(s=>s.eraId===e.id&&s.status==='ready').length;return <button key={e.id} ref={el=>{buttons.current[i]=el;}} id={`era-${e.id}`} className={`era-stop ${eraId===e.id?'active':''}`} role="tab" aria-selected={eraId===e.id} aria-controls="era-panel" tabIndex={eraId===e.id?0:-1} onClick={()=>{followPanel.current=narrow;choose(i);}} onKeyDown={event=>navigate(event,i)} style={{'--c':t.color,gridColumn:i+1} as CSSProperties}>
      <span className="era-tile" aria-hidden="true"><span>{t.glyph}</span></span><strong>{e.title}</strong><small>卷{hanNumber(i+1)} · {count?`${count} 处切片`:'筹备中'}</small></button>;})}
    </div>

    <div className="era-stage" id="era-panel" ref={panel} role="tabpanel" aria-labelledby={`era-${era.id}`} tabIndex={0} key={era.id}>
     <div className="era-watermark" aria-hidden="true">{theme.glyph}</div>
     <div className="era-intro" data-reveal>
      <div className="era-title-block">
       <span className="era-roll">卷{hanNumber(index+1)}<i>/</i>九</span>
       <h3 className="era-name">{era.title}</h3>
       <p className="era-motto">{theme.motto}</p>
       <span className="era-color"><i/>卷色 · {theme.colorName}</span>
      </div>
      <div className="era-text">
       <p className="era-lede">{era.introduction}</p>
       <p className="era-question"><Seal text="问"/><span>{era.question}</span></p>
      </div>
     </div>
     <div className="slice-grid" data-reveal>{era.sceneIds.map((id,i)=>{
      const slice=scenes.find(s=>s.id===id)!,mark=marks[id];
      if(slice.status!=='ready')return <article className="slice-card planned" key={id} style={{'--i':i} as CSSProperties}><div className="slice-cover planned-art"><Seal text={theme.glyph} outline/><span>筹备中</span></div><div className="slice-body"><span className="slice-index">{formalNumber(i+1)} · 未来的切片</span><h4>{slice.title}</h4><p>{slice.description}</p><span className="slice-meta">正在寻找有据可循的生活片段</span></div></article>;
      return <article className="slice-card" key={id} style={{'--i':i} as CSSProperties}>
       <a className="slice-cover" href={`#/scene/${slice.id}`} tabIndex={-1} aria-hidden="true">
        <span className="slice-cat">{slice.category}</span><Cover scene={slice} eager/><FrameDraw/>
        {mark?.done?<Seal text="已游" className="slice-stamp"/>:mark?.entered?<span className="slice-progress">已观察 {mark.viewed}/{mark.total}</span>:null}
       </a>
       <div className="slice-body">
        <span className="slice-index">{formalNumber(i+1)} · {slice.category}<i>{categoryNotes[slice.category]}</i></span>
        <h4>{slice.title}</h4>
        <p>{slice.description}</p>
        <span className="slice-meta">{sceneMeta(id)}</span>
        <a className="slice-enter" href={`#/scene/${slice.id}`}>进入场景<span className="slice-arrow" aria-hidden="true"><Icon type="arrow" size={18}/></span></a>
       </div>
      </article>;})}</div>
     <nav className="era-pager" aria-label="翻卷">
      {index>0?<button onClick={()=>turn(index-1)}><Icon type="back" size={18}/><span><small>上一卷</small>{eras[index-1].title}</span></button>:<span/>}
      {index<eras.length-1?<button className="next" onClick={()=>turn(index+1)}><span><small>下一卷</small>{eras[index+1].title}</span><Icon type="arrow" size={18}/></button>:<span/>}
     </nav>
    </div>
   </section>

   <section className="method" id="method" aria-labelledby="method-title" data-live>
    <header className="section-head" data-reveal><span className="section-no" aria-hidden="true">贰</span><div><p className="kicker">游览之法 · HOW TO WANDER</p><h2 id="method-title">一处切片，四种走近的方式</h2><p className="section-note">场景与操作由程序控制，AI 只负责解释与交流；没有接入模型时，全部互动、资料与预置讲解依然可用。</p></div></header>
    <ol className="method-steps">{methods.map((m,i)=><li key={m.title} data-reveal style={{'--i':i} as CSSProperties}>
     <span className="method-no" aria-hidden="true">{hanNumber(i+1)}</span>
     <svg className="method-art" viewBox="0 0 80 70" aria-hidden="true">{m.art}</svg>
     <h3>{m.title}<small>{m.en}</small></h3><p>{m.text}</p></li>)}</ol>
    <div className="guide-demo" data-reveal>
     <div className="guide-copy">
      <p className="kicker">AI 向导 · CONTEXT AWARE</p>
      <h3>一位懂得此情此景的向导</h3>
      <p>提问时，向导会带上你此刻的处境：正在哪处场景、选中了哪件器物、完成了哪些操作，以及这一场景已经核对登记的资料。回答必须引用登记出处，资料不足时直说不知道。</p>
      <p className={`guide-status ${ai?.configured?'on':''}`}><i aria-hidden="true"/>{ai===null?'正在确认向导状态…':ai.configured?`已接入 ${ai.provider}，可自由提问`:'预置讲解模式：自由问答待接入模型服务'}</p>
     </div>
     <div className="guide-flow" aria-hidden="true">
      <ul className="flow-chips">{[['当前场景','曾侯乙钟庭'],['选中器物','双音钟'],['已完成','敲击正面示意点'],['已登记资料','湖北省博物馆'],['最近对话','八条以内']].map(([k,v],i)=><li key={k} style={{'--i':i} as CSSProperties}><small>{k}</small>{v}</li>)}</ul>
      <span className="flow-line"><i/></span>
      <span className="flow-hub"><Seal text="向导"/></span>
      <span className="flow-line"><i/></span>
      <div className="flow-answer"><p>同一件钟，敲击正面与侧面的不同位置，可以发出两个音，两音大致呈三度关系……</p><small><Icon type="source" size={14}/>依据：湖北省博物馆《曾侯乙编钟》</small></div>
     </div>
    </div>
   </section>

   <section className="panorama" id="panorama" aria-labelledby="panorama-title" data-live>
    <header className="section-head" data-reveal><span className="section-no" aria-hidden="true">叁</span><div><p className="kicker">全景长卷 · ALL SLICES</p><h2 id="panorama-title">二十七处生活切片</h2><p className="section-note">长卷缓缓展开；悬停暂停，点击走进任意一处。</p></div></header>
    <div className="scroll-band">{rows.map((row,r)=><div className={`band-row ${r?'reverse':''}`} key={r}><div className="band-track" style={{'--n':row.length} as CSSProperties}>{[...row,...row].map((s,i)=>{const e=eras.find(x=>x.id===s.eraId)!,dup=i>=row.length;return <a key={`${s.id}-${i}`} className="band-item" href={`#/scene/${s.id}`} aria-hidden={dup||undefined} tabIndex={dup?-1:undefined} style={{'--c':eraTheme(e.id).color} as CSSProperties}>
     <span className="band-image"><Cover scene={s}/></span><span className="band-label"><Seal text={eraTheme(e.id).glyph}/><span><b>{s.title}</b><small>{e.title} · {s.category}</small></span></span></a>;})}</div></div>)}</div>
   </section>
  </main>

  <footer className="colophon" data-live>
   <InkLandscape className="colophon-ink" sun={false} birds={false}/>
   <div className="colophon-inner">
    <div className="colophon-brand"><Seal text="文化切片" className="seal-lg"/><div><b>文化切片</b><span>观其物 · 知其用 · 见其人</span></div></div>
    <div className="colophon-text">
     <p>以文物资料为依据，用微缩场景与 AI 讲解走近历史。模型、建筑组合、动画与声音属于教学性艺术表现，不等同于遗址测绘、文物扫描或历史现场复原；每处场景都区分文物事实、使用解释与空间推定。</p>
     <p>九个分组用于导航，不把并存政权表达为简单继承，也不把历史变化一概解释为“后来的更好”。</p>
    </div>
    <div className="colophon-meta"><span>AIC 参赛作品 · AI+软件创新赛道</span><button onClick={toTop}>回到卷首<Icon type="up" size={16}/></button></div>
   </div>
  </footer>
 </div>;
}
