import {getExhibit} from './exhibits';
export const categories=['日常生活','生产技术','精神文化'] as const;
type SceneBase={id:string;eraId:string;title:string;category:typeof categories[number];description:string};
export type SceneSummary=SceneBase&({status:'ready';cover:string}|{status:'planned';cover?:never});
export interface EraDefinition{id:string;title:string;order:number;introduction:string;question:string;sceneIds:[string,string,string]}
const entries=[
  ['prehistory','史前','从土地、工具与聚居生活，追问日常怎样开始。','一粒谷物，怎样成为一日的食物？'],
  ['pre-qin','先秦','从器用与秩序，观察共同生活的不同方式。','人们用什么组织共同的生活？'],
  ['qin-han','秦汉','在道路、书写与日常器物之间，寻找联系。','远方的人与事，怎样发生联系？'],
  ['wei-jin','魏晋南北朝','从迁徙、交流与审美，认识时代的多种面貌。','不同的生活与观念，怎样相遇？'],
  ['sui-tang','隋唐','从往来、工艺与艺术，走近丰富的生活场景。','一件器物，能带来多远的故事？'],
  ['song-yuan','宋元','在城市、生产与交流中，观察新的生活关系。','街巷之间，日常怎样变化？'],
  ['ming-qing','明清','从手艺、家居与市井，读懂熟悉又陌生的日常。','熟悉的生活，留下了怎样的来路？'],
  ['modern','近现代','从工具、媒介与生活空间，观察变化如何发生。','身边的生活，是怎样成为今天的模样？']
] as const;
export const eras:EraDefinition[]=entries.map(([id,title,introduction,question],order)=>({id,title,order,introduction,question,sceneIds:[order===0?'peiligang-grain':`${id}-living`,`${id}-making`,`${id}-culture`]}));
export const scenes:SceneSummary[]=eras.flatMap(era=>era.sceneIds.map((id,index):SceneSummary=>{
 const base={id,eraId:era.id,category:categories[index]};
 if(id==='peiligang-grain')return {...base,title:'裴李岗生活村落',description:'走近磨盘、泥土与薪火，在五处生活角落里探索一日的来处。',status:'ready',cover:'/images/peiligang-village.png'};
 const exhibit=getExhibit(id);
 return exhibit?{...base,title:exhibit.subtitle,description:exhibit.description,status:'ready',cover:`/images/${id}.png`}:{...base,title:categories[index],description:['衣食住行里的时代印记','工具与手艺背后的发现','从艺术与表达走近内心世界'][index],status:'planned'};
}));
export const readyScene=scenes.find((s):s is SceneSummary&{status:'ready'}=>s.status==='ready')!;
