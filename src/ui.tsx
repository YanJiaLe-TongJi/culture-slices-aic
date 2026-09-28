import {useEffect,useId,useRef,useState,type ReactNode,type RefObject} from 'react';
import {eras} from './catalog';
import {eraTheme,hanNumber} from './era-theme';

const icons:Record<string,ReactNode>={
 reset:<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>,
 home:<><path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/></>,
 sound:<><path d="m4 9 4 0 5-4v14l-5-4H4Z"/><path d="M17 8q5 4 0 8M20 5q7 7 0 14"/></>,
 mute:<><path d="m4 9 4 0 5-4v14l-5-4H4Z"/><path d="m17 9 5 6m0-6-5 6"/></>,
 arrow:<path d="M4 12h15m-6-6 6 6-6 6"/>,
 back:<path d="M20 12H5m6-6-6 6 6 6"/>,
 up:<path d="M12 20V5m-6 6 6-6 6 6"/>,
 down:<path d="M12 4v15m-6-6 6 6 6-6"/>,
 external:<path d="M7 17 17 7M9 7h8v8"/>,
 close:<path d="m6 6 12 12M6 18 18 6"/>,
 book:<path d="M12 5Q6 2 3 5v15q4-3 9 0 5-3 9 0V5q-4-3-9 0Zm0 0v15"/>,
 check:<path d="m5 12 5 5L20 7"/>,
 spark:<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>,
 eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
 hand:<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-1.5v-2a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v1m0 0a1.5 1.5 0 0 1 3 0v3c0 3.5-2.5 6-6 6h-1.5c-2 0-3.2-.8-4.4-2.2L4.5 15a1.5 1.5 0 0 1 2.3-1.9L8 14.5"/>,
 chat:<><path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h5"/></>,
 source:<><path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 12h7M9 16h7"/></>,
 shuffle:<path d="M4 7h3c4 0 6 10 10 10h3m-3-3 3 3-3 3M4 17h3c1.5 0 2.7-1.4 3.7-3.2M14 8.6C15 7.6 16 7 17 7h3m-3-3 3 3-3 3"/>,
 play:<path d="M8 5v14l11-7Z"/>,
 send:<path d="M4 12 20 4l-6 16-3-7Z"/>
};
export function Icon({type,size=20}:{type:string;size?:number}){
 return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[type]||icons.spark}</svg>;
}

/** 朱砂印：一至二字居中；四字按传统印文右起竖读排成两列。 */
export function Seal({text,className='',outline=false}:{text:string;className?:string;outline?:boolean}){
 const n=[...text].length;
 return <span className={`seal ${outline?'seal-outline':''} ${n===4?'seal-four':''} ${className}`} aria-hidden="true"><span>{text}</span></span>;
}
export function BrandMark({href,onClick}:{href:string;onClick?:()=>void}){
 return <a className="brand" href={href} onClick={onClick} aria-label="文化切片首页"><Seal text="文化切片" className="brand-seal"/><span className="brand-text"><b>文化切片</b><small>CULTURE · SLICES</small></span></a>;
}

const cleanId=(id:string)=>id.replace(/[^a-zA-Z0-9_-]/g,'');
export function InkBirds({className=''}:{className?:string}){
 return <svg className={`ink-birds ${className}`} viewBox="0 0 120 40" aria-hidden="true"><path d="M4 18q6-6 10 0q4-6 10 0M40 8q5-5 8 0q3-5 8 0M70 26q4-4 7 0q3-4 7 0"/></svg>;
}
/** 分层水墨山：每层独立 SVG，父元素通过 --mx/--my/--sy 驱动视差位移（只改 transform）。 */
export function InkLandscape({className='',sun=true,birds=true}:{className?:string;sun?:boolean;birds?:boolean}){
 const id=cleanId(useId());
 const layer=(name:string,d:string,top:number,color:string,alpha:number,blur=0)=><svg className={`ink-layer ink-${name}`} viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice">
  <defs><linearGradient id={`${id}${name}`} x1="0" y1={top} x2="0" y2="600" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor={color} stopOpacity={alpha}/><stop offset=".45" stopColor={color} stopOpacity={alpha*.45}/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient>
  <filter id={`${id}${name}f`} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="3" seed={top}/><feDisplacementMap in="SourceGraphic" scale="14"/>{blur?<feGaussianBlur stdDeviation={blur}/>:null}</filter></defs>
  <path d={d} fill={`url(#${id}${name})`} filter={`url(#${id}${name}f)`}/></svg>;
 return <div className={`ink-landscape ${className}`} aria-hidden="true">
  {sun&&<span className="ink-sun"/>}
  {layer('far','M0 600V330C60 300 110 250 170 262S250 196 320 180 420 232 470 242 580 150 660 120 770 192 830 212 940 170 1010 160 1120 232 1190 226 1300 140 1380 130 1500 212 1600 232V600Z',120,'#6f756f',.42,1.4)}
  {birds&&<InkBirds/>}
  {layer('mid','M0 600V402C80 382 120 318 200 330S300 402 360 396 470 300 550 290 650 362 720 372 840 320 900 310 1020 382 1100 386 1220 330 1300 320 1420 382 1500 392 1580 380 1600 376V600Z',290,'#3d4541',.5,.6)}
  <span className="ink-mist ink-mist-a"/><span className="ink-mist ink-mist-b"/>
  {layer('near','M0 600V436C60 414 100 362 170 372S262 452 332 472 500 522 600 540 800 572 900 578 1000 560 1080 522 1230 420 1320 402 1450 442 1520 432 1590 410 1600 406V600Z',362,'#1f2421',.62)}
 </div>;
}

/** 首页滚动显现：给带 data-reveal 的元素加 is-in；减少动态效果时直接显示。 */
export function useReveal(root:RefObject<HTMLElement|null>,deps:unknown[]=[]){
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const items=[...el.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')];
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(i=>i.classList.add('is-in'));return;}
  const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}},{rootMargin:'0px 0px -8% 0px',threshold:.12});
  items.forEach(i=>io.observe(i));return()=>io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },deps);
}

/** 离开视口的分节暂停循环动画，回到视口时继续。 */
export function useLiveSections(root:RefObject<HTMLElement|null>){
 useEffect(()=>{
  const el=root.current;if(!el||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(entries=>{for(const e of entries)e.target.classList.toggle('is-paused',!e.isIntersecting);});
  el.querySelectorAll('[data-live]').forEach(s=>io.observe(s));return()=>io.disconnect();
 },[root]);
}

export function CountUp({value,pad=2}:{value:number;pad?:number}){
 const ref=useRef<HTMLSpanElement>(null),[shown,setShown]=useState(value);
 useEffect(()=>{
  const el=ref.current;if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  setShown(0);let frame=0;
  const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;io.disconnect();const start=performance.now();const tick=(now:number)=>{const t=Math.min(1,(now-start)/1400),k=1-Math.pow(1-t,3);setShown(Math.round(value*k));if(t<1)frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);},{threshold:.4});
  io.observe(el);return()=>{io.disconnect();cancelAnimationFrame(frame);};
 },[value]);
 return <span ref={ref} className="count-up">{String(shown).padStart(pad,'0')}</span>;
}

/** 载入时的手卷展开动画。 */
export function ScrollLoader({label='正在展开这一页历史'}:{label?:string}){
 return <div className="scroll-loader" aria-hidden="true"><span className="scroll-rod"/><span className="scroll-paper"><span className="scroll-ink">{label}</span></span><span className="scroll-rod"/></div>;
}

/** 场景页顶栏：返回时间轴与工具按钮保持原有名称，便于键盘与回归脚本使用。 */
export function SceneTopbar({eraId,subtitle,children}:{eraId:string;subtitle:string;children:ReactNode}){
 const era=eras.find(e=>e.id===eraId)!,theme=eraTheme(eraId);
 return <header className="topbar scene-topbar">
  <BrandMark href={`#/era/${eraId}`}/>
  <div className="edition" aria-label={`${era.title} · ${subtitle}`}><span className="edition-roll">卷{hanNumber(era.order+1)}</span><Seal text={theme.glyph} className="edition-seal"/><span className="edition-era">{era.title}</span><span className="edition-title">{subtitle}</span></div>
  <div className="top-actions"><a className="back-timeline" href={`#/era/${eraId}`}><Icon type="back" size={16}/>返回时间轴</a>{children}</div>
 </header>;
}
