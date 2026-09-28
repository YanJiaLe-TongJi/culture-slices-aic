import type {Point} from './exhibits';
import type {Footprint} from './site-footprints';
export const newEraLayouts={
 highspeed:{center:[1,1.2,-.5] as Point,scale:1.65,overviewSpan:[56,30] as [number,number],outline:[[-25.5,-3.8],[-10,-3.8],[-10,-7.8],[9,-7.8],[9,-3.8],[28,-3.8],[28,6.1],[-25.5,6.1]] as Footprint},
 tiangong:{center:[0,1.6,.1] as Point,scale:1.65},
 digitalheritage:{center:[0,1,-1] as Point,scale:1.62,outline:[[-11,-5.3],[-8.4,-7.8],[.7,-7.4],[4,-6],[9,-5.5],[11,-1.4],[10,4.2],[7,6.3],[-2,6],[-9,3.8]] as Footprint}
};
export const newEraLayout=(kind:string)=>newEraLayouts[kind as keyof typeof newEraLayouts];
