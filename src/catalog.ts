import {getExhibit} from './exhibits';
export const categories=['日常生活','生产技术','精神文化'] as const;
type SceneBase={id:string;eraId:string;title:string;category:typeof categories[number];description:string};
export type SceneSummary=SceneBase&({status:'ready';cover:string}|{status:'planned';cover?:never});
export interface EraDefinition{id:string;title:string;order:number;introduction:string;question:string;sceneIds:[string,string,string]}
const entries=[
  ['prehistory','史前','文字出现以前，日常写在器物上。石磨盘上的凹痕、陶器内壁的泥条、骨笛上的音孔，记下人们安排食物、容器与声音的方式。','一粒谷物，怎样成为一日的食物？'],
  ['pre-qin','先秦','鼎簋列于堂上，陶范合于炉前，编钟悬于层台。青铜器连接着宴享、祭祀、铸造与音律，也标记着身份与秩序。','人们用什么组织共同的生活？'],
  ['qin-han','秦汉','木牍上的九九表、织机上的经纬、宫灯里的导烟，记录着计算、织造与照明的技艺；文书沿路接力传送，把远方的郡县联系起来。','远方的人与事，怎样发生联系？'],
  ['wei-jin','魏晋南北朝','政权并立、人口迁徙，不同的生活与信仰在南北相遇。江南窑场烧出青瓷壶盏，北魏平城开凿石窟，把木构楼阁的样式刻进岩壁。','不同的生活与观念，怎样相遇？'],
  ['sui-tang','隋唐','茶饼碾成细末，曲辕犁翻开江南水田，木版刷墨印出成页的文字。器物与技艺在城乡之间流转，把日常连向更远的地方。','一件器物，能带来多远的故事？'],
  ['song-yuan','宋元','临街敞棚里点茶，虹桥下的货船收帆倒桅，画家把山岸与江面留在长卷上。城市、水运与笔墨，映出日常生活的新关系。','街巷之间，日常怎样变化？'],
  ['ming-qing','明清','圈椅的弧线、青花的纹样、年画的套色，都出自分工细密的手艺。许多熟悉的家居与年俗，能在这里找到来路。','熟悉的生活，留下了怎样的来路？'],
  ['modern','近现代','缝纫机、梳棉机与放映机，把机械传动带进家庭、工厂与公共场地。生活空间与节奏，随工具和媒介一起改变。','身边的生活，是怎样成为今天的模样？'],
  ['new-era','新时代','高速列车缩短城市之间的距离，空间站把实验室带上轨道，数字化让千年壁画被更多人仔细看见。新的技术拓展着出行、研究与文化共享的边界。','新的技术，怎样让人与远方、与历史相遇？']
] as const;
export const eras:EraDefinition[]=entries.map(([id,title,introduction,question],order)=>({id,title,order,introduction,question,sceneIds:[order===0?'peiligang-grain':`${id}-living`,`${id}-making`,`${id}-culture`]}));
export const scenes:SceneSummary[]=eras.flatMap(era=>era.sceneIds.map((id,index):SceneSummary=>{
 const base={id,eraId:era.id,category:categories[index]};
 if(id==='peiligang-grain')return {...base,title:'裴李岗生活村落',description:'穿过草泥住居与田边，走近磨粮、制陶和薪火，探索聚落生活。',status:'ready',cover:'/images/peiligang-village.png'};
 const exhibit=getExhibit(id);
 return exhibit?{...base,title:exhibit.subtitle,description:exhibit.description,status:'ready',cover:`/images/${id}.png`}:{...base,title:categories[index],description:['衣食住行里的时代印记','工具与手艺背后的发现','从艺术与表达走近内心世界'][index],status:'planned'};
}));
export const readyScene=scenes.find((s):s is SceneSummary&{status:'ready'}=>s.status==='ready')!;
