export const bellNotes=(index:number)=>index===2?[{at:.35,note:0},{at:1.15,note:1},{at:1.95,note:0}]:[{at:.35,note:index%2}];
export function bellStrike(index:number,time:number){
 let note=index===1?1:0,amount=0;
 for(const event of bellNotes(index)){const d=time-event.at;if(d>=-.22&&d<.32){note=event.note;amount=Math.max(amount,Math.max(0,1-Math.abs(d)/.22));}}
 return {note,amount};
}
