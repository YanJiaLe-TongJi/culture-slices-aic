import type {Footprint} from './site-footprints';
import type {Point} from './exhibits';
export const lateLayouts={
 study:{outline:[[-9,-7.5],[-5.5,-9],[1,-8.7],[6,-7.2],[9,-3.5],[8.7,2.5],[6.8,5.8],[2,7],[-5.6,6.5],[-9,2.5]],scale:1.5,center:[0,.8,-1]},
 porcelain:{outline:[[-8,-10],[7.2,-10],[7.2,3.7],[8.5,3.7],[8.5,6.2],[-4.5,6.2],[-4.5,4.5],[-8,4.5]],scale:1.5,center:[0,.7,-2]},
 newyear:{outline:[[-8.5,-9],[8,-9],[8,5.3],[9,5.3],[9,7],[-6.4,7],[-8.5,4.9]],scale:1.52,center:[0,.8,-1.5]},
 sewing:{outline:[[-9.8,-10.3],[8.4,-10.3],[8.4,-5.3],[10,-5.3],[10,6.4],[-6.2,6.4],[-6.2,5.3],[-9.8,5.3]],scale:1.6,center:[0,1.5,-2]},
 carding:{outline:[[-10.3,-9.7],[7,-9.7],[7,-7.9],[10.5,-7.9],[10.5,6.6],[-7,6.6],[-7,3.8],[-10.3,3.8]],scale:1.6,center:[0,1,-1.6]},
 cinema:{outline:[[-12,-10.5],[7,-10.5],[7,-8.2],[11,-8.2],[11,4.2],[8,8.4],[-7.5,8.4],[-12,3.5]],scale:1.68,center:[-.5,1.2,-1.4]},
} satisfies Record<string,{outline:Footprint;scale:number;center:Point}>;
export type LateKind=keyof typeof lateLayouts;
export const lateLayout=(kind:string)=>lateLayouts[kind as LateKind];
