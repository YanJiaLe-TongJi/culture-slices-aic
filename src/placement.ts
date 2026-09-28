import { useEffect, useMemo, useRef, useState } from 'react';

export const PLACEMENT_SECONDS = 2.2;
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
export function placementPose(t:number){
  const travel=ease((t-.08)/.26), back=ease((t-.79)/.21);
  const amount=clamp((t-.38)/.36);
  return { travel:travel*(1-back), lift:ease(t/.12)*(1-back), tilt:ease((t-.3)/.12)*(1-ease((t-.73)/.1)), amount, pouring:t>=.38&&t<.74 };
}
// Mutable animation clock: React only receives lifecycle transitions, never frames.
export function createPlacementClock(onComplete:()=>void,onActive:(active:boolean)=>void=()=>{}){
  const clock={
    active:false,time:-1,
    start(){if(clock.active)return;clock.active=true;clock.time=0;onActive(true);},
    advance(seconds:number){if(!clock.active||!Number.isFinite(seconds))return;clock.time=Math.min(1,clock.time+Math.max(0,seconds)/PLACEMENT_SECONDS);if(clock.time>=1)clock.finish();},
    finish(){if(!clock.active)return;clock.active=false;clock.time=-1;onActive(false);onComplete();},
    cancel(notify=true){clock.active=false;clock.time=-1;if(notify)onActive(false);}
  };
  return clock;
}
export type PlacementClock=ReturnType<typeof createPlacementClock>;
export function usePlacement(onComplete:()=>void){
  const [placing,setPlacing]=useState(false),complete=useRef(onComplete);
  const progressElement=useRef<HTMLSpanElement>(null);
  complete.current=onComplete;
  const clock=useMemo(()=>createPlacementClock(()=>complete.current(),setPlacing),[]);
  useEffect(()=>{
    if(!placing)return;
    let frame=0,last=performance.now();
    const tick=(now:number)=>{
      if(!document.hidden)clock.advance(Math.min((now-last)/1000,.1));
      if(progressElement.current)progressElement.current.style.width=`${Math.max(0,clock.time)*100}%`;
      last=now;if(clock.active)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[placing,clock]);
  useEffect(()=>()=>clock.cancel(false),[clock]);
  return {clock,placing,progressElement,start:()=>{clock.start();if(matchMedia('(prefers-reduced-motion: reduce)').matches)clock.finish();},cancel:()=>clock.cancel(),finish:clock.finish};
}
