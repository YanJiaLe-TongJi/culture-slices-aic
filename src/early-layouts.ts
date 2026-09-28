import type {Footprint} from './site-footprints';
import type {Point} from './exhibits';

// Display cuts follow the additional activity areas. Artifact coordinates stay fixed.
export const earlyLayouts={
 village:{outline:[[-10,-5.2],[-7.5,-9.3],[-3.6,-10],[1,-9.5],[5.4,-9],[8.5,-6.4],[10.2,-2.7],[10.3,4.4],[7,6],[1.6,5.8],[.5,7.2],[-2.8,7.2],[-4.2,5.8],[-8.5,5],[-10.2,1.2]],scale:1.22,center:[0,.6,-1.4]},
 pottery:{outline:[[-10.7,-8.3],[-5.8,-9.5],[1.8,-9.5],[1.8,-8.6],[8.7,-8.6],[10.5,-5.6],[10.5,2.7],[8.2,4.7],[2.5,4.7],[2.5,6.5],[-2.8,6.5],[-4,5.4],[-9.7,5.4],[-10.7,2.5],[-9.8,.4]],scale:1.48,center:[0,.65,-1.6]},
 flute:{outline:[[-9.4,-6.8],[-7,-9.6],[-2.4,-10],[2.7,-8.9],[7.8,-10],[8.5,-4],[8.5,6],[5.5,7.3],[2.8,5.5],[-.4,6.1],[-4.9,5.7],[-8.6,3.7],[-10,-.4]],scale:1.43,center:[-.4,.55,-1.5]},
 feast:{outline:[[-6.4,-13.5],[6.4,-13.5],[6.4,6.6],[2.1,6.6],[2.1,8],[-2.1,8],[-2.1,6.6],[-6.4,6.6]],scale:1.52,center:[0,.7,-3.1]},
 casting:{outline:[[-11,-5.4],[-8,-8.5],[0,-9],[4,-7.5],[8.9,-7.8],[11,-4.3],[10,-.4],[10.6,3.8],[5,5.3],[1,6.3],[-5.3,5.6],[-11,3.3]],scale:1.5,center:[0,.6,-1.3]},
 bells:{outline:[[-10,-8.8],[7.5,-8.8],[7.5,-7.5],[10,-7.5],[10,2.7],[7.8,2.7],[7.8,5.5],[3,5.5],[3,7],[-3,7],[-3,5.5],[-10,5.5]],scale:1.51,center:[0,1.4,-1.2]},
 lamp:{outline:[[-9,-6.3],[9.3,-6.3],[9.3,4.5],[3,4.5],[3,7],[-3,7],[-3,4.5],[-9,4.5]],scale:1.38,center:[0,1,-.15]},
 loom:{outline:[[-10.4,-5.1],[10.4,-5.1],[10.4,7.5],[-8.7,7.5],[-8.7,6.3],[-10.4,6.3]],scale:1.5,center:[0,.8,1]},
 slips:{outline:[[-10,-10],[9,-10],[9,6.4],[2.2,6.4],[2.2,5.2],[-10,5.2]],scale:1.48,center:[0,.7,-1.7]},
} satisfies Record<string,{outline:Footprint;scale:number;center:Point}>;
export type EarlyKind=keyof typeof earlyLayouts;
export function earlyLayout(kind:string){return earlyLayouts[kind as EarlyKind];}
