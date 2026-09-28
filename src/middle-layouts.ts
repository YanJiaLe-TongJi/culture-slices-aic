import type {Footprint} from './site-footprints';
import type {Point} from './exhibits';
export const middleLayouts={
 ewer:{outline:[[-9,-8.5],[4.9,-8.5],[4.9,-7.2],[8.2,-7.2],[8.2,5.8],[1.5,5.8],[1.5,6.4],[-9,6.4]],scale:1.43,center:[-.3,.7,-1.5]},
 kiln:{outline:[[-9.8,-7],[-6.4,-9.6],[1.3,-10.2],[6.5,-8.9],[9,-5.4],[8.7,1.4],[6.7,5.6],[.2,7],[-6.6,5.9],[-9.8,2.2]],scale:1.48,center:[0,1,-1.5]},
 grotto:{outline:[[-10.3,-8.3],[-6.7,-9.1],[4.8,-8.8],[9.8,-7.2],[10.5,-2.7],[9,4.2],[5.6,4.2],[5.6,6.6],[2,7.4],[-3,7.4],[-4,6.4],[-9.5,5.1]],scale:1.65,center:[0,2,-1.4]},
 tea:{outline:[[-9,-11.4],[9,-11.4],[9,4.8],[3.1,4.8],[3.1,6.7],[-3.1,6.7],[-3.1,4.8],[-9,4.8]],scale:1.54,center:[0,.8,-2.5]},
 plough:{outline:[[-10.3,-8.5],[-3.3,-8.5],[-3.3,-9.6],[8.5,-9.6],[8.5,-4.2],[10,-4.2],[10,6.6],[3.4,6.6],[3.4,7.5],[-4.6,7.5],[-4.6,5.5],[-10.3,5.5]],scale:1.46,center:[0,.5,-1.1]},
 printing:{outline:[[-9,-10.5],[4.5,-10.5],[4.5,-5],[8.3,-5],[8.3,6],[-9,6]],scale:1.46,center:[-.5,.8,-2]},
 diancha:{outline:[[-8.8,-8.1],[6.5,-8.1],[6.5,-3.5],[9,-3.5],[9,5.7],[-2.5,5.7],[-2.5,6.5],[-8.8,6.5]],scale:1.48,center:[-.1,1.3,-1.2]},
 landscape:{outline:[[-12,-8],[11,-8],[12,5],[-12,6]],scale:1.57,center:[0,.8,-.8]},
} satisfies Record<string,{outline:Footprint;scale:number;center:Point}>;
export type MiddleKind=keyof typeof middleLayouts;
export const middleLayout=(kind:string)=>middleLayouts[kind as MiddleKind];
