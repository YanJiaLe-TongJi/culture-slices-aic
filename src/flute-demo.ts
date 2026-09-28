// Timing and hole states are an explanatory animation, not historical fingering.
export const fluteHoles=[-1.32,-.9,-.48,-.06,.36,.78,1.2];
export const fluteNotes=(index:number)=>index===2?[{at:.25,note:0},{at:1.05,note:1},{at:1.85,note:0}]:[{at:.25,note:index%2}];
export function flutePose(index:number,seconds:number){
 const notes=fluteNotes(index);let note=notes[0].note;
 for(const event of notes)if(seconds>=event.at-.18)note=event.note;
 return {note,covered:note===0?5:2,sounding:notes.some(e=>seconds>=e.at&&seconds<e.at+.65)};
}
