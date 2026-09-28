import {LAST_SCENE_KEY} from './exhibit-state';
import { useEffect, useReducer, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from 'react';
import Scene from './Scene';
import { objects, scene, sources, zones, contextSources, questionsFor, presetResult, type ObjectId, type ZoneId } from './content';
import { initialProgress, restoreProgress, STORAGE_KEY, transition } from './state';
import { useSceneTool } from './useSceneTool';
import { usePlacement } from './placement';
import type { InteractionId } from './interaction';
import { eraTheme, formalNumber } from './era-theme';
import { Icon, InkLandscape, SceneTopbar, Seal } from './ui';

type Tab = 'object' | 'chat' | 'sources';
type Message = { role: 'user' | 'assistant'; content: string; sourceIds?: string[]; mode?: string };
function readProgress(){try{return restoreProgress(localStorage.getItem(STORAGE_KEY));}catch{return initialProgress();}}

export default function Experience(){
  const [focusTarget,setFocusTarget]=useState<InteractionId|null>(null);
  const [progress,dispatch]=useReducer(transition,undefined,readProgress);
  const [selected,setSelected]=useState<ObjectId|null>(null);
  const [zone,setZone]=useState<ZoneId|null>(null);
  const [fire,setFire]=useState(false);
  const [buildRun,setBuildRun]=useState(0);
  useSceneTool(progress,selected,zone);
  const [tab,setTab]=useState<Tab>('object');
  const [panel,setPanel]=useState(true);
  const [cameraReset,setCameraReset]=useState(0);
  const [grinding,setGrinding]=useState(false);
  const [demo,setDemo]=useState(false);
  const [motion,setMotion]=useState(0);
  const [recap,setRecap]=useState(false);
  const [sound,setSound]=useState(false);
  const [storageFailed,setStorageFailed]=useState(false);
  const [connected,setConnected]=useState(false);
  const [provider,setProvider]=useState('AI');
  const [messages,setMessages]=useState<Message[]>([]);
  const [question,setQuestion]=useState('');
  const [pending,setPending]=useState(false);
  const [chatError,setChatError]=useState('');
  const [retry,setRetry]=useState('');
  const audio=useRef<AudioContext|null>(null);
  const chatAbort=useRef<AbortController|null>(null);
  const drag=useRef<number|null>(null);
  const chatEnd=useRef<HTMLDivElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const complete=progress.actions.includes('ground');
  const wasComplete=useRef(complete);
  const placed=progress.actions.includes('placed');
  const placement=usePlacement(()=>dispatch({type:'place'}));
  const region=zones.find(z=>z.id===zone);
  const regionObjects=objects.filter(o=>o.zoneId===zone);
  const references=contextSources(selected,zone);
  const questions=questionsFor(selected,zone);
  const object=objects.find(o=>o.id===selected);
  const stage=complete?3:placed?2:progress.viewed.length?1:0;

  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));if(progress.entered)localStorage.setItem(LAST_SCENE_KEY,'peiligang-grain');}catch{setStorageFailed(true);}},[progress]);
  useEffect(()=>{const controller=new AbortController();fetch('/api/status',{signal:controller.signal}).then(r=>r.json()).then(x=>{setConnected(x.configured===true);setProvider(x.provider||'AI');}).catch(()=>{});return()=>controller.abort();},[]);
  useEffect(()=>()=>{chatAbort.current?.abort();chatAbort.current=null;const context=audio.current;audio.current=null;if(context&&context.state!=='closed')void context.close().catch(()=>{});},[]);
  useEffect(()=>{
    if(!demo)return;
    let elapsed=0;
    const id=window.setInterval(()=>{if(document.hidden)return;elapsed+=50;dispatch({type:'grind',amount:.009});setMotion(Math.sin(elapsed/270));},50);
    return()=>clearInterval(id);
  },[demo]);
  useEffect(()=>{
    if(complete){setDemo(false);setGrinding(false);setMotion(0);}
    if(complete&&!wasComplete.current){setRecap(true);}
    wasComplete.current=complete;
  },[complete]);
  useEffect(()=>{if(recap)dialog.current?.showModal();else dialog.current?.close();},[recap]);
  useEffect(()=>{chatEnd.current?.scrollIntoView({block:'nearest',behavior:'smooth'});},[messages,pending]);

  function select(id:ObjectId){setFocusTarget(null);placement.cancel();setZone(objects.find(o=>o.id===id)!.zoneId);setSelected(id);dispatch({type:'view',id});setPanel(true);setTab('object');setDemo(false);setGrinding(false);}
  function overview(){setFocusTarget(null);placement.cancel();setZone(null);setSelected(null);setDemo(false);setGrinding(false);}
  function enterZone(id:ZoneId){setFocusTarget(null);placement.cancel();setZone(id);setSelected(null);setDemo(false);setGrinding(false);setMotion(0);setPanel(true);setTab('object');}
  function placeGrain(){if(placed||placement.placing)return;select('grain');placement.start();}
  function reset(){setCameraReset(n=>n+1);setFire(false);setBuildRun(0);chatAbort.current?.abort();chatAbort.current=null;setPending(false);setMessages([]);setChatError('');setQuestion('');setRetry('');setRecap(false);overview();setTab('object');dispatch({type:'reset'});dispatch({type:'enter'});}
  function startGrinding(auto=false){if(!placed||placement.placing)return;setZone('grinding');setSelected('roller');dispatch({type:'view',id:'roller'});if(complete)dispatch({type:'replay'});setGrinding(!auto);setDemo(auto);setPanel(false);}
  function move(event:PointerEvent<HTMLDivElement>){
    if(drag.current===null||!grinding)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=Math.max(0,Math.min(rect.width,event.clientX-rect.left));
    const delta=Math.abs(x-drag.current);drag.current=x;
    setMotion(x/rect.width*2-1);
    dispatch({type:'grind',amount:Math.min(delta,60)/1600});
  }
  async function toggleSound(){
    if(!audio.current){
      const context=new AudioContext();audio.current=context;
      const buffer=context.createBuffer(1,context.sampleRate*3,context.sampleRate);
      const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.2;
      const node=context.createBufferSource();node.buffer=buffer;node.loop=true;
      const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=450;
      const gain=context.createGain();gain.gain.value=.15;node.connect(filter);filter.connect(gain);gain.connect(context.destination);node.start();
    }
    try{if(sound)await audio.current.suspend();else await audio.current.resume();setSound(!sound);}catch{setSound(false);}
  }
  async function ask(text:string,retrying=false){
    if(!text.trim()||pending)return;
    const q=text.trim().slice(0,1000);setQuestion('');setChatError('');setRetry(q);
    const history=messages.slice(-8).map(({role,content})=>({role,content}));
    if(!retrying)setMessages(m=>[...m,{role:'user',content:q}]);
    if(!connected){const result=presetResult(q,selected,zone);setMessages(m=>[...m,{role:'assistant',content:result.answer,sourceIds:result.sourceIds,mode:'preset'}]);return;}
    const controller=new AbortController();chatAbort.current=controller;setPending(true);
    const timeout=setTimeout(()=>controller.abort(),35000);
    try{
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({sceneId:scene.id,zoneId:zone,objectId:selected,actions:progress.actions,question:q,history:retrying?history.slice(0,-1):history})});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'暂时无法回答，请重试。');
      if(chatAbort.current!==controller)return;
      setMessages(m=>[...m,{role:'assistant',content:result.answer,sourceIds:result.sourceIds,mode:result.mode}]);
    }catch(error){if(chatAbort.current===controller)setChatError(error instanceof Error&&error.name!=='AbortError'?error.message:'回答等待超时。你可以重试，或先查看资料。');}
    finally{clearTimeout(timeout);if(chatAbort.current===controller){setPending(false);chatAbort.current=null;}}
  }
  function submit(e:FormEvent){e.preventDefault();void ask(question);}

  const theme=eraTheme('prehistory'),tabs:Tab[]=['object','chat','sources'];
  const focusProps=(id:InteractionId)=>({onFocus:(e:React.FocusEvent<HTMLButtonElement>)=>{if(e.currentTarget.matches(':focus-visible'))setFocusTarget(id);},onBlur:()=>setFocusTarget(null)});
  return <div className="app-shell village-shell" style={{'--exhibit-accent':'#9b6a3c','--era':theme.color} as CSSProperties}>
    <SceneTopbar eraId="prehistory" subtitle="裴李岗生活村落"><button className="icon-button" onClick={overview} title="返回全景" aria-label="返回全景"><Icon type="home" size={18}/></button><button className={`icon-button ${sound?'on':''}`} onClick={()=>void toggleSound()} disabled={!progress.entered} title={sound?'关闭声音':'开启环境声'} aria-label={sound?'关闭声音':'开启环境声'}><Icon type={sound?'sound':'mute'} size={18}/></button><button className="icon-button" onClick={reset} disabled={!progress.entered} title="重新开始" aria-label="重新开始"><Icon type="reset" size={18}/></button></SceneTopbar>
    <main className={`experience ${progress.entered&&panel?'with-panel':''}`}>
      <section className="world" aria-label="裴李岗生活村落">
        <div className="world-backdrop" aria-hidden="true"><span className="world-glyph">{theme.glyph}</span><InkLandscape className="world-ink" birds={false} sun={false}/></div>
        <div className="scene-heading"><div className="eyebrow"><Seal text={theme.glyph}/><span>新石器时代 · 裴李岗文化线索</span></div><h1>{region?.name||'一粟之间'}<span>{region?.question||'一座小村落，几处生活的痕迹'}</span></h1><svg className="brush-stroke" viewBox="0 0 220 12" aria-hidden="true"><path pathLength={1} d="M2 8C40 3 90 2 130 5s64 4 86 1"/></svg></div>
        <div className="scene-canvas"><Scene zone={zone} onZone={enterZone} placement={placement.clock} focusTarget={focusTarget} fire={fire} building={buildRun} selected={selected} onSelect={select} placed={placed} processed={progress.grinding} motion={motion} locked={grinding||demo||placement.placing} reset={cameraReset} entered={progress.entered}/></div>
        <div className="scene-corner" aria-hidden="true"><span>卷一 · 文化切片</span><span>基于文物资料的艺术演绎</span></div>
        {!progress.entered?<div className="entry-card"><span className="entry-rod"/><div className="entry-paper"><span className="tiny-tag">一座可慢慢探索的史前村落</span><Seal text={theme.glyph} className="entry-seal"/><h2>土地、器物与火，<br/>怎样组成一日的生活？</h2><p>走进五处相连的生活角落。<br/>靠近一件器物，看见一种日常。</p><button className="primary" onClick={()=>dispatch({type:'enter'})}>开始探索<Icon type="arrow" size={18}/></button><span className="entry-note">无需登录 · 可随时离开与继续</span></div><span className="entry-rod bottom"/></div>:<>
          <nav className="breadcrumbs" aria-label="场景层级"><button onClick={overview}>村落全景</button>{region&&<><span aria-hidden="true">／</span><button onClick={()=>enterZone(region.id)}>{region.name}</button></>}{object&&<><span aria-hidden="true">／</span><span>{object.name}</span></>}</nav>
          {placement.placing&&<div className="placement-card" role="status"><span className="placement-label"><i aria-hidden="true"/>正在将谷物倾入磨盘…</span><div className="progress-line"><span ref={placement.progressElement} style={{width:0}}/></div><div className="placement-actions"><button onClick={placement.finish}>跳过动画</button><button onClick={placement.cancel}>取消放置</button></div></div>}
          {!panel&&!grinding&&!demo&&<button className="open-panel" onClick={()=>setPanel(true)}><Icon type="book" size={18}/><span>探索手册</span></button>}
          {(grinding||demo)&&<div className="grind-card"><div className="grind-head"><span><Seal text="磨"/>{demo?'观察磨棒如何往复运动':'按住下方区域，左右往复拖动'}</span><button className="icon-button" aria-label="退出加工" onClick={()=>{setGrinding(false);setDemo(false);setPanel(true);}}><Icon type="close" size={18}/></button></div><div className={`drag-track ${demo?'playing':''}`} role="slider" tabIndex={0} aria-label="往复加工，左右方向键也可操作" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress.grinding*100)} onKeyDown={e=>{if(!demo&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();dispatch({type:'grind',amount:.025});setMotion(e.key==='ArrowLeft'?-.7:.7);}}} onPointerDown={e=>{if(demo)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current=Math.max(0,Math.min(e.currentTarget.clientWidth,e.clientX-e.currentTarget.getBoundingClientRect().left));}} onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}><span className="drag-axis"/><span className="drag-handle" style={{left:`${50+motion*35}%`}}>↔</span><span className="drag-word">{demo?'演示中':'左右拖动'}</span></div><div className="progress-line"><span style={{width:`${progress.grinding*100}%`}}/></div><div className="grind-foot"><span>使用关系示意 · 不代表真实加工时长</span><span>{Math.round(progress.grinding*100)}%</span></div></div>}
          <div className="world-bottom"><span className="navigation-help">{placement.placing?'谷物正在落定 · 已锁定视角':grinding||demo?'加工时已锁定视角':zone?'拖动旋转 · 滚轮缩放 · 点击器物探索':'点击一处生活区域，靠近观察'}</span><div className={`object-switcher ${zone?'':'zone-switcher'}`}>{!zone?zones.map((z,i)=><button key={z.id} {...focusProps(z.id)} onClick={()=>enterZone(z.id)}><span className="obj-no" aria-hidden="true">{formalNumber(i+1)}</span>{z.name}</button>):regionObjects.map((o,i)=><button key={o.id} {...focusProps(o.id)} onClick={()=>select(o.id)} className={`${selected===o.id?'selected':''} ${progress.viewed.includes(o.id)?'seen':''}`} aria-pressed={selected===o.id}><span className="obj-no" aria-hidden="true">{formalNumber(i+1)}</span>{o.name}{progress.viewed.includes(o.id)&&<span className="sr-only">（已观察）</span>}</button>)}</div></div>
        </>}
      </section>
      {progress.entered&&panel&&<aside className="side-panel" aria-label="探索手册"><div className="panel-header"><span className="panel-title"><Seal text="册"/>探索手册<small>裴李岗生活村落</small></span><button className="icon-button" onClick={()=>setPanel(false)} aria-label="收起手册"><Icon type="close" size={18}/></button></div><nav className="panel-tabs" aria-label="手册内容" style={{'--tab':tabs.indexOf(tab)} as CSSProperties}>{tabs.map((t,i)=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}><Icon type={['eye','chat','source'][i]} size={16}/>{['器物','问一问','资料'][i]}</button>)}<span className="tab-ink" aria-hidden="true"/></nav>
        {tab==='object'&&<div className="panel-scroll object-detail">
          <div className="object-head" key={selected||zone||'overview'}><span className="section-index">{object?`器物 · ${formalNumber(objects.indexOf(object)+1)} / OBJECT`:region?'生活角落 · ZONE':'场景导览 · FIELD NOTES'}</span><h2>{object?.name||region?.name||'走进一座小村落'}</h2><span className="english-name">{object?.english||region?.english||'A SMALL WINDOW INTO THE PAST'}</span><p className="lead">{object?.description||region?.description||'从村边的土地，到屋前的磨盘，再到火上的陶鼎。选择一个生活角落，慢慢靠近。'}</p>
          {object?<><div className="fact-note"><span>看见一个细节</span><p>{object.fact}</p></div><p className="detail-copy">{object.detail}</p><span className="object-kind">{object.kind}</span></>:<div className="intro-steps">{region?<><p className="toc-title">这一角，留意：{region.question}</p>{regionObjects.map((o,i)=><button className="region-object" key={o.id} {...focusProps(o.id)} onClick={()=>select(o.id)}><b aria-hidden="true">{formalNumber(i+1)}</b><span>{o.name}</span><i className="leader" aria-hidden="true"/>{progress.viewed.includes(o.id)?<em>已观</em>:null}<Icon type="arrow" size={16}/></button>)}</>:<><p className="toc-title">村落目录</p>{zones.map((z,i)=><button className="region-object" key={z.id} {...focusProps(z.id)} onClick={()=>enterZone(z.id)}><b aria-hidden="true">{formalNumber(i+1)}</b><span>{z.name}</span><i className="leader" aria-hidden="true"/><Icon type="arrow" size={16}/></button>)}</>}</div>}</div>
          <div className="context-actions">
            {zone==='grinding'&&(!placed?<button className="primary" disabled={placement.placing} onClick={placeGrain}>{placement.placing?'谷物正在落定…':'将谷物放上磨盘'}<Icon type="arrow" size={18}/></button>:<><button className="primary" onClick={()=>startGrinding(false)}>{complete?'再试一次':'动手加工'}<Icon type="hand" size={18}/></button><button className="secondary" onClick={()=>startGrinding(true)}><Icon type="play" size={16}/>观看演示</button></>)}
            {zone==='cooking'&&<><button className="primary" onClick={()=>{select('ding');setFire(f=>!f);}}>{fire?'熄灭薪火':'点亮薪火，观察三足'}<Icon type="spark" size={18}/></button><p className="activity-note">火焰与位置是使用关系示意，不复原古代食谱。</p></>}
            {zone==='pottery'&&<><button className="primary" onClick={()=>{select('clay');setBuildRun(n=>n+1);}}>观看泥条成形<Icon type="arrow" size={18}/></button><p className="activity-note">泥条逐层叠起；干燥与烧制未在这段动画中模拟。</p></>}
            {zone==='dwelling'&&<p className="activity-note">屋顶与前墙已展开。建筑外形和器物摆放为艺术示意。</p>}
            {zone==='field-edge'&&<button className="primary" onClick={()=>enterZone('grinding')}>循着谷物，去屋前磨粮<Icon type="arrow" size={18}/></button>}
            {complete&&<button className="text-button" onClick={()=>setRecap(true)}>查看我的探索回顾</button>}
          </div>
          <button className="question-link" onClick={()=>{setTab('chat');}}><span>关于{object?.name||'这些器物'}，我还想知道</span><Icon type="chat" size={18}/></button><button className="source-link" onClick={()=>setTab('sources')}><Icon type="source" size={16}/>查看文物资料与演绎说明</button>
        </div>}
        {tab==='sources'&&<div className="panel-scroll source-detail"><span className="section-index">BEHIND THE SCENE · 资料</span><h2>每一处好奇，<br/>都有迹可循。</h2>{references.map((source,i)=><section className="reference-entry" key={source.id}><div className="source-card"><span className="source-no">{formalNumber(i+1)}</span><span>资料来源 · {source.institution}</span><h3>{source.title}</h3><a href={source.url} target="_blank" rel="noreferrer">阅读馆方原文<Icon type="external" size={14}/></a></div><ul className="fact-list">{source.facts.map(f=><li key={f}>{f}</li>)}</ul></section>)}<div className="interpretation"><b><Seal text="注"/>哪些属于艺术演绎？</b><p>三处住处、屋顶、路径、火塘与器物摆放是为探索而组合；不是遗址原貌复原。双耳壶与石镰采用同文化其他遗址的标本。谷物、陶坯和操作动画为教学示意，不代表实际劳动时长。</p></div></div>}
        {tab==='chat'&&<div className="chat-panel"><div className="chat-context"><Seal text="导" className="guide-seal"/><div><strong>文化探索向导</strong>{connected?<span className="guide-state on"><i aria-hidden="true"/>{provider} 已接入 · <span>结合当前器物与操作回答</span></span>:<span className="guide-state"><i aria-hidden="true"/>预置讲解可用 · 自由问答未连接</span>}</div></div><div className="context-chip"><span>当前关注</span>{object?.name||region?.name||'村落全景'}{complete?<em>已尝试加工</em>:placed?<em>已放入谷物</em>:null}</div><div className="chat-scroll"><p className="chat-welcome">看见什么，就从那里问起。<br/>可以先从这些问题开始：</p><div className="suggestions">{questions.map(q=><button key={q} onClick={()=>void ask(q)} disabled={pending}>{q}<Icon type="arrow" size={14}/></button>)}</div>{messages.map((m,i)=><div className={`message ${m.role}`} key={i}><span>{m.role==='user'?'你':m.mode==='preset'?'预置讲解':'文化探索向导'}</span><p>{m.content}</p>{sources.filter(s=>m.sourceIds?.includes(s.id)).map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer">依据：{s.institution}《{s.title}》 ↗</a>)}</div>)}{pending&&<p className="pending" role="status"><span className="ink-dots" aria-hidden="true"><i/><i/><i/></span>正在查阅当前场景资料…</p>}{chatError&&<div className="error-box" role="alert">{chatError}<button onClick={()=>void ask(retry,true)}>重试这个问题</button></div>}<div ref={chatEnd}/></div><form className="chat-form" onSubmit={submit}><label className="sr-only" htmlFor="question">你的问题</label><textarea id="question" maxLength={1000} rows={2} value={question} onChange={e=>setQuestion(e.target.value)} placeholder={connected?'问问眼前的器物…':'可先选择上方的预置问题'} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void ask(question);}}}/><button className="send-button" type="submit" disabled={pending||!question.trim()} aria-label="发送问题"><Icon type="send" size={16}/></button></form><p className="chat-footnote">事实依据可追溯，艺术演绎会注明。</p></div>}
      </aside>}
    </main>
    <footer className="journey"><span className="journey-title"><Seal text={theme.glyph}/>磨粮体验</span><ol>{scene.steps.map((step,i)=><li className={stage>i?'done':stage===i?'current':''} key={step}><span className="journey-node">{stage>i?<Icon type="check" size={14}/>:formalNumber(i+1)}</span><span className="journey-label">{step}</span></li>)}</ol><button onClick={()=>{if(progress.entered)setRecap(true);}} disabled={!progress.entered}>我的发现<span className="discovery-count">{progress.viewed.length}/{objects.length}</span></button></footer>
    {storageFailed&&<div className="storage-notice" role="status">浏览器无法保存进度，本次探索仍可继续。</div>}
    <dialog ref={dialog} className="recap" onCancel={()=>setRecap(false)} onClose={()=>setRecap(false)}><button className="icon-button recap-close" onClick={()=>setRecap(false)} aria-label="关闭探索回顾"><Icon type="close" size={18}/></button><span className="section-index">YOUR FIELD NOTES · 游记</span><h2>今天，你发现了什么？</h2><p className="recap-intro">裴李岗生活村落 · 你的探索记录</p>{complete&&<Seal text="观止" className="recap-stamp"/>}<div className="recap-objects">{objects.map(o=><div key={o.id} className={progress.viewed.includes(o.id)?'visited':''}><span>{progress.viewed.includes(o.id)?'已观察':'尚未观察'}</span><strong>{o.name}</strong></div>)}</div><div className="recap-facts"><p className={placed?'done':''}><i aria-hidden="true">{placed?'✓':''}</i>{placed?'已将谷物放入磨盘。':'尚未将谷物放入磨盘。'}</p><p className={complete?'done':''}><i aria-hidden="true">{complete?'✓':''}</i>{complete?'已体验磨棒与磨盘配合使用的示意。':'还可以试试磨棒如何与磨盘配合。'}</p></div>{complete&&<blockquote>两件工具共同工作，石面留下使用的痕迹。<small>相关知识 · 依据中国国家博物馆资料</small></blockquote>}<button className="primary" onClick={()=>{setRecap(false);setPanel(true);setTab('chat');}}>继续探索与提问<Icon type="arrow" size={18}/></button><button className="text-button" onClick={reset}>重新开始这次探索</button></dialog>
  </div>;
}
