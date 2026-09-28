import {newEraExhibits} from './exhibits-new-era';
import {expandLateContent} from './late-expansion-content';
import {expandMiddleContent} from './middle-expansion-content';
import {expandEarlyContent} from './early-expansion-content';
import type {SourceEntry} from './content';
import {weiJinExhibits} from './exhibits-wei-jin';
import {tangExhibits} from './exhibits-tang';
import {songExhibits} from './exhibits-song';
import {mingQingExhibits} from './exhibits-ming-qing';
import {modernExhibits} from './exhibits-modern';
export type ExhibitKind='pottery'|'flute'|'feast'|'casting'|'bells'|'lamp'|'loom'|'slips'|'ewer'|'kiln'|'grotto'|'tea'|'plough'|'printing'|'diancha'|'bridge'|'landscape'|'study'|'porcelain'|'newyear'|'sewing'|'carding'|'cinema'|'highspeed'|'tiangong'|'digitalheritage';
export type Point=[number,number,number];
export interface ExhibitObject{id:string;name:string;kind:string;fact:string;detail:string;position:Point;sourceIds:string[]}
export interface ExhibitStep{id:string;label:string;objectId:string;duration:number;explanation:string}
export interface Exhibit{id:string;eraId:string;kind:ExhibitKind;title:string;subtitle:string;culture:string;question:string;description:string;accent:string;ground:string;interpretation:string;objects:ExhibitObject[];steps:ExhibitStep[];sources:SourceEntry[];qa:{question:string;answer:string;sourceIds:string[]}[]}
const source=(id:string,institution:string,title:string,url:string,facts:string[]):SourceEntry=>({id,institution,title,url,facts});
const pottery=source('nmc-painted-basin','中国国家博物馆','人面鱼纹彩陶盆','https://www.chnmuseum.cn/zp/zpml/kgfjp/202008/t20200824_247218.shtml',['仰韶文化人面鱼纹彩陶盆以红陶为底，在口沿和内壁绘黑彩。','内壁有人面与鱼组合的对称纹样，相关半坡陶器还见鱼纹、网纹。','类似陶盆多作儿童瓮棺的棺盖；纹样寓意有不同解释，不能当作已确定的故事。']);
const flute=source('henan-jiahu-flute','河南博物院','贾湖骨笛','https://www.chnmus.net/sitesources/hnsbwy/page_pc/bwzl/yyhxzzjd/cpsx/articledeee3377fb384cc384be6d4643476be1.html',['骨笛出土于河南舞阳贾湖新石器时代遗址。','以鹤类禽鸟中空尺骨截去关节、钻孔制成。','馆方介绍的这支骨笛长23.1厘米，钻有七个音孔；测音研究说明它具有演奏旋律的能力。']);
const gui=source('nmc-li-gui','中国国家博物馆','“利”青铜簋','https://www.chnmuseum.cn/zp/zpml/kgfjp/202108/t20210802_250931.shtml',['利簋上部为圆形器腹，两侧有兽形耳，下部为方座。','簋主要盛放煮熟的饭食，同时在商周宴享、祭祀中作为礼器。','利簋的铭文记录武王征商，是理解西周早期历史的实物材料。']);
const food=source('nmc-food-ritual','中国国家博物馆','中国古代饮食文化展','https://www.chnmuseum.cn/portals/0/web/zt/202112yswhz/',['鼎、鬲、甑等器具与蒸煮食物的方式有关。','商周饮食礼器的组合和使用包含礼仪及身份秩序的含义。']);
const cast=source('nmc-bronze-mould','中国国家博物馆','礼和万方——商周青铜鼎特展','https://www.chnmuseum.cn/portals/0/web/zt/202109lhwf/home/',['范铸法涉及由模制范、由范制芯、范芯组合后浇铸等环节。','陶范和芯共同约束铜液成形，商代已有合范灌注等技术。']);
const ding=source('nmc-houmuwu','中国国家博物馆','“后母戊”青铜方鼎','https://www.chnmuseum.cn/zp/zpml/kgfjp/202008/t20200824_247255.shtml',['后母戊鼎呈长方形器腹，下有四个柱足。','鼎身与四足整体铸造，鼎耳在器身完成后另行装范浇铸。','大型青铜铸造涉及泥模、陶范、合范灌注等多个环节，需要组织与分工。']);
const bells=source('hubei-zeng-bells','湖北省博物馆','曾侯乙编钟','https://hbww.org.cn/zgzb/p/4695.html',['曾侯乙编钟1978年出土于湖北随州曾侯乙墓，属于战国早期。','全套65件，分三层八组悬于曲尺形铜木钟架。','每件钟可发出呈三度音程关系的双音；钟、架、钩的铭文涉及编号、标音和乐律。']);
const lamp=source('dpm-changxin','故宫博物院 · 展品资料','长信宫灯','https://ggzl.dpm.org.cn/pages/exhibit_works/details?id=10933',['西汉长信宫灯出土于河北满城窦绾墓，收藏于河北博物院。','灯罩由两块弧形铜板构成，其中一片可移动，用于调节光的亮度和照射方向。']);
const smoke=source('baoji-changxin','宝鸡市文物局','首批禁止出国（境）展览文物——长信宫灯','https://wwj.baoji.gov.cn/zzzb/wbwy/202506/t20250611_1156684.html',['灯具作跪坐持灯人像，通体鎏金，人像中空。','右臂连接灯罩与中空身体，具有导烟结构；不能据此断言完全没有烟尘。']);
const loom=source('silk-laoguanshan','中国丝绸博物馆','成都老官山汉墓出土提花织机的复原研究','https://www.chinasilkmuseum.com/cs/info_164.aspx?itemid=28182',['成都老官山西汉墓出土四架竹木提花织机模型及纺织工具模型。','经线布在织机上，纬线由梭引入，经纬交织形成织物。','提综把经线分成上下层形成梭口，随后引纬、打紧。','多综机构与纹样控制有关；出土模型及复原研究不能简化为普通平纹织机的全部结构。']);
const slips=source('nmc-liye','中国国家博物馆','小城故事——湖南龙山里耶秦简文化展','https://www.chnmuseum.cn/portals/0/web/zt/20190806liye/',['里耶秦简记录秦代迁陵的行政和社会生活。','出土九九表木牍说明乘法口诀用于数量运算；展览联系土地、收成、税收与生活统计作解释。','简牍材料中有书信、文书和邮传的线索，邮传采用沿路线接力传送的方式。']);
const zhouArchitecture=source('zhouyuan-courtyard','西北大学文化遗产学院 · 周原考古项目','2024年度中国西北地区重要考古进展：周原遗址','https://culture.nwu.edu.cn/info/1134/3495.htm',['周原王家嘴揭露的先周大型建筑包含门塾、东西厢房、前堂、后室和前后庭院。','周原考古还揭示西周时期城墙与宫城，为理解当地建筑和聚落组织提供线索。','当前模型借鉴周原院落的空间组织，草泥屋面、木构细部、尺度与器物陈设是艺术推定，不是某座建筑的测绘复原。']);
const shangArchitecture=source('pku-guoyuanzui-workshop','北京大学考古文博学院','湖北武汉郭元咀商周遗址发掘项目','https://news.pku.edu.cn/xwzh/0844f99463c3469fbc2511434c94d200.htm',['郭元咀商代铸铜遗址有大型台基，四周柱洞被解释为生产活动的工棚建筑。','遗址有铜渣、陶范、坩埚壁、烧土面与炉基等冶金遗存。','本场景借鉴台地工棚与生产分区，不表示后母戊鼎在郭元咀铸造；房屋地上部分、草顶、坑位和尺寸为教学推定。']);
const chuArchitecture=source('hubei-longwan-terrace','湖北省文化和旅游厅','楚离宫潜江龙湾遗址','https://wlt.hubei.gov.cn/bmdt/ztzl/zshb/201912/t20191226_1799408.shtml',['龙湾遗址有成组夯土宫殿台基，放鹰台一号基址保存层台、门道、长廊及回廊柱洞等线索。','遗址楚国材料集中于春秋晚期至战国初期，可作为江汉地区先秦高等级建筑的区域参考。','层台与回廊仅用于本场景的区域建筑表达；龙湾是楚地遗址，不是曾国宫室证据，不能据此复原曾侯乙的真实演奏地点。']);
const chuTiles=source('longwan-building-tiles','人民日报海外版 · 龙湾遗址博物馆采访','章华台上品楚韵','https://ent.people.com.cn/n1/2024/1210/c1012-40379003.html',['龙湾遗址博物馆展示出土陶制筒瓦、板瓦和瓦当等建筑构件。','瓦材与夯土层台为场景设计提供线索，当前屋面坡度、四坡轮廓、色彩及木构比例属于简化推定。']);
const object=(id:string,name:string,kind:string,fact:string,detail:string,position:Point,sourceIds:string[]):ExhibitObject=>({id,name,kind,fact,detail,position,sourceIds});
const step=(id:string,label:string,objectId:string,duration:number,explanation:string):ExhibitStep=>({id,label,objectId,duration,explanation});
export const exhibits:Exhibit[]=[
 {id:'prehistory-making',eraId:'prehistory',kind:'pottery',title:'泥土上的纹样',subtitle:'彩陶纹样工坊',culture:'新石器时代 · 仰韶文化线索',question:'一只陶盆，怎样承载形状与图案？',description:'走进制陶院落，从备泥、盘筑到绘彩，近看陶盆内壁的人面与鱼纹。',accent:'#9b573e',ground:'#d6ba91',interpretation:'工棚、晾坯架、备泥坑、编织物及工具均为教学性艺术组合，不对应某个出土工坊。纹样按馆方文字描述自行绘制，保留对称人面、鱼纹与间断黑彩带，网纹用于对照；并非原盆纹样摹本或测绘复原。不能将该类盆误作普通餐盆，也不能确定纹样寓意。',sources:[pottery],objects:[
 object('basin','彩陶盆','文物形制线索','红色陶胎与黑色纹饰形成对比。','参考国博人面鱼纹彩陶盆。此类盆多被用作儿童瓮棺棺盖，不能因为像碗就断言是餐具。',[-.35,.94,1.65],[pottery.id]),
 object('pigment','黑彩与纹样','图案示意','人面、鱼纹和对称关系是这件陶盆的观察线索。','两种图案按钮只用于比较人面鱼纹和网状线条；不复原颜料配方、古代画笔或完整原纹。',[2.25,.45,1.5],[pottery.id]),
 object('coils','泥条陶坯','制作示意','形状和装饰可以分开观察。','旁边的泥条用于解释容器如何逐层成形，不声称这件馆藏盆的每一道工序已经被复原。',[-3.45,.3,.65],[pottery.id]),
 object('drying','晾坯与成品架','场景布置','对照素坯、黑彩与器形，分辨观察的层次。','架子、遮棚和器物摆放为教学设计，不是该盆出土现场的陈设复原；不由排列推断具体烧成顺序或时间。',[3.45,1,-2.05],[pottery.id]),
 object('shelter','制陶工棚','场景布置','从院落回到器物，注意环境与文物证据的区别。','屋面与围墙默认完整，点选后展开内部，返回全景合拢；这是现代观察方式。墙体、屋顶、编织器与储藏罐仅用于组织场景空间。馆方资料支持的是彩陶盆及相关文化信息，没有提供这座工棚的复原依据。',[-3.15,1,-2.5],[pottery.id])],steps:[
 step('shape','逐层盘起器形','basin',3.6,'已观察器形逐层出现。这里只示意成形关系，干燥与烧成没有被模拟。'),step('paint','展开黑彩纹样','basin',4,'已对照陶胎与黑彩。模型的鱼纹是简化设计，寓意仍需保留多种解释。'),step('compare','转盆，观察内壁','basin',2.8,'已观察内壁纹样。器形、装饰与考古用途，是不同层次的证据。')],qa:[
 {question:'这只盆是吃饭用的吗？',answer:'不能这样断定。国博说明类似人面鱼纹彩陶盆多用于儿童瓮棺的棺盖。这里的工坊是教学性组合，不能把模型摆在台上就解释为餐具。',sourceIds:[pottery.id]},
 {question:'鱼纹是什么意思？',answer:'这类图案的含义有不同解释。资料描述人面与鱼的组合，也讨论信仰等可能联系；本场景只帮助观察图案，不将某一种寓意当作定论。',sourceIds:[pottery.id]}]},
 {id:'prehistory-culture',eraId:'prehistory',kind:'flute',title:'骨管里的回声',subtitle:'贾湖骨笛',culture:'新石器时代 · 舞阳贾湖',question:'一根中空的骨管，怎样成为乐器？',description:'走进芦苇水岸，近看七孔骨管、放大断面，再比较两个声音。',accent:'#678478',ground:'#b2b898',interpretation:'水岸、芦苇与木台是艺术场景，不还原骨笛出土位置。音频是现代合成音，按孔图只说明变化关系，不是原笛音高、指法或史前曲调。',sources:[flute],objects:[
 object('flute','七孔骨笛','文物线索','馆方介绍的骨笛有七个音孔。','贾湖骨笛以鹤类禽鸟中空尺骨加工制成；馆方这支藏品长23.1厘米。此处放大骨管、七个开口与两端壁厚，便于观察，不是等比例考古测绘。',[-.35,.35,1.55],[flute.id]),
 object('tube','中空骨管','材料结构示意','中空结构为吹管乐器提供了条件。','横断面是解释骨管结构的示意，尺寸与口部结构不用于演奏复原。',[-3.65,.31,.45],[flute.id]),
 object('holes','音孔对照','乐理示意','孔的位置与发音能力之间有联系。','听到的高低两音只让变化可感知。没有在这里复原具体标本的音阶与古代乐曲。',[-.45,.23,2.65],[flute.id]),
 object('shelter','棚下听音席','场景布置','有遮阴的空间帮助集中观察与比较声音。','棚架、席子与储藏器物是艺术布置；资料并未说明这支骨笛在这样的棚下演奏，不据场景推断仪式或使用者身份。',[-1.55,1,-2.65],[flute.id]),
 object('shore','芦苇水岸','场景布置','从水岸环境回到材料与声音的问题。','水面、植物、篮筐与临水木条用于组织微缩场景，不能当作贾湖遗址某处岸线的考古复原。',[3.05,.25,.15],[flute.id])],steps:[step('low','试听第一种孔位示意','flute',2,'已试听较低的合成音；不是出土骨笛的录音。'),step('high','改变孔位，试听另一音','flute',2,'已试听另一种音高。按孔动画不是可用于复奏的历史指法。'),step('listen','比较两种声音','holes',2.8,'已比较两个示意音。资料能支持骨笛的演奏能力，不能告诉我们史前的人演奏了哪首曲子。')],qa:[{question:'这是原来的声音吗？',answer:'不是。当前声音由浏览器合成，按孔方式也只是示意。馆方对实物的测音研究说明它能演奏旋律，但这里不能据此还原史前曲调。',sourceIds:[flute.id]},{question:'为什么选择骨头？',answer:'这件骨笛用鹤类禽鸟中空尺骨加工，去掉关节并钻孔。资料支持材料与结构描述，但不足以确定当时制作者选择它的全部理由。',sourceIds:[flute.id]}]},
 {id:'pre-qin-living',eraId:'pre-qin',kind:'feast',title:'一席之间',subtitle:'鼎簋与食器',culture:'西周早期 · 利簋与周原院落线索',question:'盛放食物的器物，也能讲述礼仪吗？',description:'从鼎与簋的分工，走近食物、器用与身份。',accent:'#57766d',ground:'#b6aa8b',interpretation:'簋参考利簋、鼎为器类示意；建筑另以周原院落组织为参考，屋顶与柱梁细部为艺术推定。不是同址出土组合、利簋使用地或普通家庭的复原；默认展示完整建筑，器物放在前庭供观察。',sources:[gui,food,zhouArchitecture],objects:[object('gui','方座双耳簋','利簋形制线索','圆腹、双耳与方座构成利簋的轮廓。','簋用于盛熟饭食，也进入宴享与祭祀情境。模型保留方座、兽首双耳与纹饰分区，细部为艺术化简化。',[-.85,.82,1.1],[gui.id]),object('tripod','三足鼎','器类示意','鼎与蒸煮食物的技术和饮食礼仪相关。','此鼎不对应某一件馆藏标本；与利簋组合用于比较用途，不用器物数量推定人物等级。',[1.8,.7,1],[food.id]),object('inscription','器内铭文','文字示意','利簋铭文记载武王征商。','场景使用现代释义牌连接器物与历史事件，不是原铭文拓本。',[-1.9,.65,1.4],[gui.id]),object('setting','周原式堂院','建筑线索与演绎','门塾、前庭、堂、后庭与后室沿纵深轴线依次展开。','参考周原先周建筑的堂、室、厢房与院落组织，放入西周器物讲解。草泥屋面、柱梁和墙高为推定，短厢位于后庭一侧；不复原利簋的使用地点。',[0,1.7,-2.3],[zhouArchitecture.id]),object('hearth','炊煮备器角','场景布置','鼎的炊煮用途与礼器身份可以一并观察。','灶火、容器和食物位置是教学组合，没有模拟真实烹饪，也不把这里当作商周家庭的普遍样貌。',[3.7,.5,-1.4],[food.id])],steps:[step('serve','把熟粮盛入簋','gui',2.8,'已观察簋与熟饭食的关系，场景中的粮食是示意。'),step('vessels','对照鼎与簋','tripod',2.3,'已比较器物分工。用途与礼仪含义可以同时存在。'),step('read','查看铭文线索','inscription',2,'已查看铭文解释。器物也能保存关于历史事件的文字。')],qa:[{question:'簋和鼎有什么不同？',answer:'簋用于盛放熟饭食；鼎与炊煮食物相关。商周时期它们也参与宴享、祭祀和身份表达。这里是器类关系示意，不是某一场典礼的复原。',sourceIds:[gui.id,food.id]},{question:'这是普通人家的饭桌吗？',answer:'不能这样理解。青铜礼器与特定的礼仪、身份情境有关；当前庭院和筵席是教学组合，不能代表所有商周家庭。',sourceIds:[food.id]}]},
 {id:'pre-qin-making',eraId:'pre-qin',kind:'casting',title:'铜从范中来',subtitle:'青铜范铸工坊',culture:'先秦 · 商代青铜铸造线索',question:'液态金属，怎样留下器物的形状？',description:'合范、观察浇注、开范，从空隙理解铸造。',accent:'#927044',ground:'#bbaa90',interpretation:'方鼎表达范铸关系，建筑另参考商代郭元咀台地工棚资料。土墙草顶、备泥坑与不规则地块是教学组合；不是后母戊鼎铸造地。外范分块、浇道、尺寸和时长经过简化，不是完整工艺复原。',sources:[cast,ding,shangArchitecture],objects:[object('mould','陶范与芯','制作结构示意','外范与芯之间留出的空间决定器壁的形状。','国博展览介绍由模制范、由范制芯、组合后浇铸。本模型用两侧外范和中心芯帮助观察空间。',[0,.95,1],[cast.id]),object('crucible','浇注容器','工序示意','合范后浇入金属，是范铸的一个环节。','容器形状与浇注姿态为艺术表现，不提供温度、配方或真实操作步骤。',[-2.65,.5,1.1],[cast.id]),object('bronze','方鼎成品','后母戊鼎形制线索','方腹与四柱足是参考器物的重要特征。','国博指出后母戊鼎身、足整体铸成，双耳另行装范浇铸。动画没有表现所有环节。',[2.8,.72,1.55],[ding.id]),object('store','独立泥墙储料屋','建筑线索与演绎','低矮储料屋与斜置工棚分散在开放土场上。','工棚与台地关系参考商代郭元咀遗址；地上泥墙草顶、屋架、晾置棚和备泥坑位置为推定，不是殷墟或郭元咀原貌，也不表示后母戊鼎在此铸造。',[7.15,1.2,-4.7],[shangArchitecture.id]),object('furnace','炉火与备料角','工艺背景示意','浇注之前还涉及材料处理和熔炼。','炉形、燃料与篮筐为氛围示意，不提供配方、温度或可照做的操作流程。',[4.5,.65,-.1],[cast.id,shangArchitecture.id])],steps:[step('close','合拢外范，保留空隙','mould',2.8,'已观察外范与芯的组合，空隙是理解器壁成形的关键。'),step('pour','观察铜液进入陶范','mould',3.8,'已观察浇注示意；流动效果与时长不代表真实铸造。'),step('reveal','冷却后开范，观察器形','mould',3,'已观察成形关系。后母戊鼎的耳还需另行铸接，本演示没有完整复原。')],qa:[{question:'为什么需要芯？',answer:'外范与芯共同约束器壁。可以把两者之间的空隙理解为金属成形的空间。本模型简化了范块和浇道，不能代替工艺复原。',sourceIds:[cast.id]},{question:'后母戊鼎一次就铸好了吗？',answer:'不能把整件器物都说成一次铸好。国博资料指出鼎身与四足整体铸造，鼎耳在器身完成后另行装范浇铸。',sourceIds:[ding.id]}]},
 {id:'pre-qin-culture',eraId:'pre-qin',kind:'bells',title:'一钟，两音',subtitle:'曾侯乙钟庭',culture:'先秦 · 战国早期，曾侯乙墓线索',question:'同一口钟，为什么能听到两个音？',description:'对照两个击点，让钟声与铭文发生联系。',accent:'#456e66',ground:'#afb3a1',interpretation:'十口钟为原套65件的局部意象。建筑借鉴龙湾楚地层台、回廊与瓦材，属于跨遗址的区域文化演绎，不是曾国宫室或曾侯乙演奏现场的复原。屋面、木构、击点和合成声均为示意。',sources:[bells,chuArchitecture,chuTiles],objects:[object('bell','双音钟','文物结构线索','馆方资料说明每件钟可发出两个呈三度关系的音。','通过两个示意击点比较音高，不把合成声当作原钟音色。',[-.4,2.55,1.14],[bells.id]),object('rack','铜木钟架','组合结构示意','原套编钟有65件，悬挂在曲尺形钟架上。','当前仅有十口局部示意钟，曲尺架和悬挂层次经过艺术化简化，不是原套缩比陈列。',[-.15,2.8,-1.2],[bells.id]),object('marks','标音铭文','知识线索','铭文内容包含编号、标音和乐律。','这里用现代说明卡连接声音与文字，模型上的线条不冒充可释读的古代文字。',[-2.3,1.65,1.4],[bells.id]),object('gallery','层台与乐器前坪','区域建筑参考','收分台基托起主厅，前坪与侧向登阶连接不同高度。','参考江汉地区龙湾楚宫的层台、回廊柱洞及出土瓦材。龙湾不是曾国宫室证据；本建筑是区域文化演绎，屋顶和红黑木构为推定，不是曾侯乙的真实演奏地点。',[-.4,1.5,1.5],[chuArchitecture.id,chuTiles.id]),object('implements','击奏用具','演示道具','两个示意击点用于比较同一口钟的声音。','木槌与动作经过简化，不据模型判断原物演奏方法或力道。',[1.8,1.5,3.1],[bells.id])],steps:[step('front','敲击正面示意点','bell',1.6,'已试听正面击点的合成音。'),step('side','敲击侧面示意点','bell',1.6,'已试听另一击点的合成音，比较同一口钟的双音关系。'),step('pair','连听双音，查看标音','bell',2.9,'已比较两个示意音并查看标音线索，声音与文字共同保存乐律知识。')],qa:[{question:'一口钟真的有两个音吗？',answer:'湖北省博物馆介绍曾侯乙编钟具有双音特征，两个音呈三度关系。当前两声由浏览器合成，只用于对照，不是实物音频。',sourceIds:[bells.id]},{question:'原套有多少口钟？',answer:'原套有65件，分三层八组悬于曲尺形钟架。当前十口模型只选取局部意象，数量和比例经过简化。',sourceIds:[bells.id]}]},
{
 "id": "qin-han-living",
 "eraId": "qin-han",
 "kind": "lamp",
 "title": "一灯照见",
 "subtitle": "长信宫灯的一隅",
 "culture": "秦汉 · 西汉，满城汉墓线索",
 "question": "古人怎样调整一盏灯的光与烟？",
 "description": "点灯、转动灯罩，再循着右臂观察导烟结构。",
 "accent": "#ad8644",
 "ground": "#aaa58d",
 "interpretation": "长信宫灯依据河南博物院国宝特展的实物正面、拆分和侧面图独立建模，表现跪坐、交领、垂袖、灯盘短柄与右袖灯盖；属于照片参考的风格化模型，不是扫描或精确测绘。灯室建筑为汉代建筑明器线索的艺术组合；导烟时的透明视图、光效与烟粒是教学示意，不测量原灯照度或净化效率。",
 "sources": [
  {
   "id": "dpm-changxin",
   "institution": "故宫博物院 · 展品资料",
   "title": "长信宫灯",
   "url": "https://ggzl.dpm.org.cn/pages/exhibit_works/details?id=10933",
   "facts": [
    "西汉长信宫灯出土于河北满城窦绾墓，收藏于河北博物院。",
    "灯罩由两块弧形铜板构成，其中一片可移动，用于调节光的亮度和照射方向。"
   ]
  },
  {
   "id": "baoji-changxin",
   "institution": "宝鸡市文物局",
   "title": "首批禁止出国（境）展览文物——长信宫灯",
   "url": "https://wwj.baoji.gov.cn/zzzb/wbwy/202506/t20250611_1156684.html",
   "facts": [
    "灯具作跪坐持灯人像，通体鎏金，人像中空。",
    "右臂连接灯罩与中空身体，具有导烟结构；不能据此断言完全没有烟尘。"
   ]
  },
  {
   "id": "nmc-han-buildings",
   "institution": "中国国家博物馆",
   "title": "汉代建筑明器研究",
   "url": "https://www.chnmuseum.cn/yj/xscg/xslw/201812/t20181224_36398.shtml",
   "facts": [
    "汉代建筑明器包括房屋、楼阁、院落、仓、灶、井等类型。",
    "建筑明器表现出门、窗和房间组织等建筑线索，但有墓葬用途与象征性，不能直接等同墓主真实宅邸。",
    "场景借鉴房间与院落分工；屋面、涂色、比例与器物摆放是教学推定。"
   ]
  },
  {
   "id": "hn-changxin-reference",
   "institution": "河南博物院 · 河北博物院藏品特展",
   "title": "长信宫灯：实物、六部分拆分与结构图",
   "url": "https://www.chnmus.net/sitesources/hnsbwy/page_pc/bwzl/zxgd/",
   "facts": [
    "馆方特展展示长信宫灯的实物正面、六部分拆分照片与侧面结构示意。",
    "长信宫灯由头部、身躯、右臂、灯座、灯盘和灯罩六部分组成，收藏于河北博物院。",
    "两块弧形铜板嵌入灯盘槽中，可以开合以调节光的亮度和方向。",
    "场景从照片观察跪姿、交领、垂袖与灯盖轮廓；几何、色斑和衣褶是自行绘制，不能当作原器物测绘数据。"
   ]
  }
 ],
 "objects": [
  {
   "id": "lamp",
   "name": "长信宫灯",
   "kind": "文物线索",
   "fact": "这件西汉灯具作跪坐持灯人像。",
   "detail": "藏于河北博物院。参考馆方正面、拆分与侧面图，重做跪姿、交领、头巾、下垂衣袖及托灯手。表面鎏金斑驳为程序绘制；这是照片参考的风格化模型，不是扫描复原。",
   "position": [
    0.3,
    1.85,
    1.1
   ],
   "sourceIds": [
    "dpm-changxin",
    "baoji-changxin",
    "hn-changxin-reference"
   ]
  },
  {
   "id": "shade",
   "name": "弧形灯罩",
   "kind": "结构线索",
   "fact": "一片灯罩可以移动，以改变亮度和照射方向。",
   "detail": "移动页面滑块可比较开合；数字仅表示模型状态，不是原器物刻度。",
   "position": [
    -0.39,
    2.13,
    1.6
   ],
   "sourceIds": [
    "dpm-changxin"
   ]
  },
  {
   "id": "smoke",
   "name": "导烟右臂",
   "kind": "结构示意",
   "fact": "右臂与中空灯体相通，形成导烟路径。",
   "detail": "右袖与灯盖连成导烟结构。选中时以透明示意显示袖内到身体的路径；实物并不透明，也不能据此得出完全无烟或固定净化效率。",
   "position": [
    -0.17,
    2.35,
    1.18
   ],
   "sourceIds": [
    "baoji-changxin"
   ]
  },
  {
   "id": "room",
   "name": "灯室与瓦屋",
   "kind": "建筑线索与演绎",
   "fact": "一座深进瓦屋分出前堂与后室，侧面连接井院。",
   "detail": "参考汉代建筑明器中的房屋、门窗与院落线索；明器带有墓葬象征性，不能当作窦绾真实住宅。瓦屋、比例、窗格和陈设为推定，默认屋面和墙体完整；点选灯室或灯具后展开，返回全景合拢。",
   "position": [
    0,
    1.6,
    -2.3
   ],
   "sourceIds": [
    "nmc-han-buildings"
   ]
  },
  {
   "id": "mat",
   "name": "席地与低案",
   "kind": "场景陈设",
   "fact": "低位陈设让灯光与人的活动空间发生联系。",
   "detail": "席子、低案和器物位置服务于观察灯光，是艺术组合；不声称重现某场西汉室内活动。",
   "position": [
    2.85,
    0.5,
    0.7
   ],
   "sourceIds": [
    "nmc-han-buildings"
   ]
  }
 ],
 "steps": [
  {
   "id": "light",
   "label": "点亮灯火",
   "objectId": "lamp",
   "duration": 1.6,
   "explanation": "已观察灯光亮起。当前光效不测量历史照度。"
  },
  {
   "id": "shade",
   "label": "转动灯罩，比较明暗",
   "objectId": "shade",
   "duration": 1.8,
   "explanation": "已观察罩片改变开口；还可拖动滑块自由比较。"
  },
  {
   "id": "smoke",
   "label": "循着右臂观察导烟",
   "objectId": "smoke",
   "duration": 2.2,
   "explanation": "已观察导烟路径。这种结构不等于完全消除烟尘。"
  }
 ],
 "qa": [
  {
   "question": "灯罩为什么可以动？",
   "answer": "故宫展品资料介绍，一片弧形罩片可以移动，用来调节光的亮度与照射方向。页面滑块只演示这种结构关系。",
   "sourceIds": [
    "dpm-changxin"
   ]
  },
  {
   "question": "烟真的全部消失了吗？",
   "answer": "不能这样断言。资料说明右臂与中空身体相连形成导烟结构；模型的烟粒用于解释路径，没有模拟或测量全部烟尘去向。",
   "sourceIds": [
    "baoji-changxin"
   ]
  },
  {
   "question": "这座建筑是原样复原的吗？",
   "answer": "参考汉代建筑明器中的房屋、门窗与院落线索；明器带有墓葬象征性，不能当作窦绾真实住宅。瓦屋、比例、窗格和陈设为推定，默认屋面和墙体完整；点选灯室或灯具后展开，返回全景合拢。",
   "sourceIds": [
    "nmc-han-buildings"
   ]
  }
 ]
},
{
 "id": "qin-han-making",
 "eraId": "qin-han",
 "kind": "loom",
 "title": "经纬之间",
 "subtitle": "汉代织机工坊",
 "culture": "秦汉 · 西汉，成都老官山模型线索",
 "question": "交错的线，怎样变成一块布？",
 "description": "提综、引纬、打纬，从一根线看见织造关系。",
 "accent": "#8d5c53",
 "ground": "#c1b18d",
 "interpretation": "沿经线方向组织长条作坊，侧面开敞、后部备料。老官山资料支持织机模型，未记录这间厂房；屋顶、泥墙、晾布与筒纱为教学布置。织机只演示经纬配合，不复原完整多综传动或某种汉锦。",
 "sources": [
  {
   "id": "silk-laoguanshan",
   "institution": "中国丝绸博物馆",
   "title": "成都老官山汉墓出土提花织机的复原研究",
   "url": "https://www.chinasilkmuseum.com/cs/info_164.aspx?itemid=28182",
   "facts": [
    "成都老官山西汉墓出土四架竹木提花织机模型及纺织工具模型。",
    "经线布在织机上，纬线由梭引入，经纬交织形成织物。",
    "提综把经线分成上下层形成梭口，随后引纬、打紧。",
    "多综机构与纹样控制有关；出土模型及复原研究不能简化为普通平纹织机的全部结构。"
   ]
  },
  {
   "id": "nmc-han-buildings",
   "institution": "中国国家博物馆",
   "title": "汉代建筑明器研究",
   "url": "https://www.chnmuseum.cn/yj/xscg/xslw/201812/t20181224_36398.shtml",
   "facts": [
    "汉代建筑明器包括房屋、楼阁、院落、仓、灶、井等类型。",
    "建筑明器表现出门、窗和房间组织等建筑线索，但有墓葬用途与象征性，不能直接等同墓主真实宅邸。",
    "场景借鉴房间与院落分工；屋面、涂色、比例与器物摆放是教学推定。"
   ]
  }
 ],
 "objects": [
  {
   "id": "loom",
   "name": "织机与综框",
   "kind": "出土模型线索",
   "fact": "提综形成供纬线通过的梭口。",
   "detail": "老官山汉墓出土的是织机模型。本场景放大关键关系，不把简化机架当作原物精确结构。",
   "position": [
    0.45,
    1.13,
    0
   ],
   "sourceIds": [
    "silk-laoguanshan"
   ]
  },
  {
   "id": "shuttle",
   "name": "梭与纬线",
   "kind": "技术关系示意",
   "fact": "纬线由梭引入，与经线交织。",
   "detail": "观察梭在开口中横向穿过；运动速度和纱线粗细是示意。",
   "position": [
    1.95,
    1.01,
    0.2
   ],
   "sourceIds": [
    "silk-laoguanshan"
   ]
  },
  {
   "id": "cloth",
   "name": "织物与经线",
   "kind": "交织示意",
   "fact": "布于机上的经线与引入的纬线方向不同。",
   "detail": "示意织物帮助对照方向和交错关系，不复原汉锦纹样与完整提花程序。",
   "position": [
    -1.35,
    0.4,
    1.3
   ],
   "sourceIds": [
    "silk-laoguanshan"
   ]
  },
  {
   "id": "workshop",
   "name": "多开间织造长屋",
   "kind": "建筑线索与演绎",
   "fact": "横向连续开间容纳织造与存料，屋前留出整纱空地。",
   "detail": "汉代建筑明器提供房屋和院落分区的参考；老官山出土织机模型没有记录真实厂房。连续长屋、端部存料间与前方纱架均为教学推定；点选屋面或器物展开内部，不还原成都某座工坊。",
   "position": [
    -3.5,
    1.5,
    -0.5
   ],
   "sourceIds": [
    "silk-laoguanshan",
    "nmc-han-buildings"
   ]
  },
  {
   "id": "yarn",
   "name": "备线小案",
   "kind": "工序背景示意",
   "fact": "在经纬交织之前，丝线需要准备与安排。",
   "detail": "线筒与备料案用于帮助分辨材料和织物，不冒充老官山原件，也不复原完整缫丝、染色或整经流程。",
   "position": [
    3.4,
    0.8,
    -1
   ],
   "sourceIds": [
    "silk-laoguanshan"
   ]
  }
 ],
 "steps": [
  {
   "id": "shed",
   "label": "提综，打开梭口",
   "objectId": "loom",
   "duration": 1.6,
   "explanation": "已观察经线分层形成开口。"
  },
  {
   "id": "weft",
   "label": "引梭，将纬线穿入",
   "objectId": "shuttle",
   "duration": 2,
   "explanation": "已观察纬线横向进入经线之间。"
  },
  {
   "id": "beat",
   "label": "打纬，让丝线靠紧",
   "objectId": "loom",
   "duration": 1.6,
   "explanation": "已观察纬线靠紧，织物由一次次交织形成。"
  },
  {
   "id": "weave",
   "label": "交替开口，再织一行",
   "objectId": "loom",
   "duration": 2,
   "explanation": "已比较两次交织。这只是完整提花技术中的基本关系。"
  }
 ],
 "qa": [
  {
   "question": "经线和纬线有什么不同？",
   "answer": "经线先布在织机上，纬线由梭横向引入；提综形成开口，随后引纬、打紧。二者交织成布，本模型突出方向与配合关系。",
   "sourceIds": [
    "silk-laoguanshan"
   ]
  },
  {
   "question": "这是完整的汉代提花机吗？",
   "answer": "不是精确复原。老官山出土四架织机模型，研究涉及复杂的多综与传动机构。这里为理解经纬而简化，未复制完整汉锦提花程序。",
   "sourceIds": [
    "silk-laoguanshan"
   ]
  },
  {
   "question": "这座建筑是原样复原的吗？",
   "answer": "汉代建筑明器提供房屋和院落分区的参考；老官山出土织机模型没有记录真实厂房。连续长屋、端部存料间与前方纱架均为教学推定；点选屋面或器物展开内部，不还原成都某座工坊。",
   "sourceIds": [
    "silk-laoguanshan",
    "nmc-han-buildings"
   ]
  }
 ]
},
{
 "id": "qin-han-culture",
 "eraId": "qin-han",
 "kind": "slips",
 "title": "片简有言",
 "subtitle": "里耶秦简与九九表",
 "culture": "秦汉 · 秦代，里耶迁陵线索",
 "question": "没有屏幕，文字与计算怎样记录日常？",
 "description": "展开木简，对照九九，再把记录整理成束。",
 "accent": "#80643d",
 "ground": "#c5b995",
 "interpretation": "结合里耶城址的建筑基址、排水与古井线索，组织一处L形文书院落。廊屋、瓦屋、书架、书案位置为艺术推定，不是发掘出的秦代档案室；井旁展示出土情境而非往井里存档。木牍文字为现代字体转写，不是原简释文或拓本。",
 "sources": [
  {
   "id": "nmc-liye",
   "institution": "中国国家博物馆",
   "title": "小城故事——湖南龙山里耶秦简文化展",
   "url": "https://www.chnmuseum.cn/portals/0/web/zt/20190806liye/",
   "facts": [
    "里耶秦简记录秦代迁陵的行政和社会生活。",
    "出土九九表木牍说明乘法口诀用于数量运算；展览联系土地、收成、税收与生活统计作解释。",
    "简牍材料中有书信、文书和邮传的线索，邮传采用沿路线接力传送的方式。"
   ]
  },
  {
   "id": "hunan-liye-city",
   "institution": "湖南省人民政府",
   "title": "里耶古城（秦简）遗址和博物馆",
   "url": "https://hunan.gov.cn/hnszf/c101487/202108/t20210830_20409875.html",
   "facts": [
    "里耶古城地处酉水河畔，发现城墙、建筑基址、排水设施和古井等遗迹。",
    "秦简提供秦代迁陵的行政与生活记录；遗址线索不能证明场景中地面文书房的具体外观。"
   ]
  },
  {
   "id": "hunan-liye-well",
   "institution": "湖南省文物局 · 新华社发掘采访",
   "title": "里耶秦简发掘记",
   "url": "https://wwj.hunan.gov.cn/wwj/c100310/c100350/202511/t20251113_33853885.html",
   "facts": [
    "一号井发掘中清理出方形木框，简牍从井内堆积中发现。",
    "古井用于说明发现与保存情境，不能解释为古人专门在井里存档。",
    "场景木衬井口缩浅展示，不复原井的真实深度、井房或遗址原貌。"
   ]
  }
 ],
 "objects": [
  {
   "id": "slips",
   "name": "简牍记录",
   "kind": "文物线索",
   "fact": "里耶秦简保存了秦代迁陵的行政与生活信息。",
   "detail": "文字记录提供器物外的另一种证据。当前木片与字体为示意，不对应某一支原简的全貌。",
   "position": [
    0.25,
    0.77,
    1.18
   ],
   "sourceIds": [
    "nmc-liye"
   ]
  },
  {
   "id": "table",
   "name": "九九表木牍",
   "kind": "文物线索",
   "fact": "里耶出土有乘法口诀表木牍。",
   "detail": "示例用现代汉字显示“九九八十一”等关系；可以先猜结果再核对，不把练习当作原简逐字复写。",
   "position": [
    1.83,
    0.7,
    1.68
   ],
   "sourceIds": [
    "nmc-liye"
   ]
  },
  {
   "id": "bundle",
   "name": "成束的记录",
   "kind": "整理示意",
   "fact": "简牍中的文书与邮传材料呈现信息的流转。",
   "detail": "捆束动画只表达整理与携带的关系，不复原某份公文的封检程序。",
   "position": [
    -1.41,
    0.77,
    0.27
   ],
   "sourceIds": [
    "nmc-liye"
   ]
  },
  {
   "id": "office",
   "name": "街巷内的署舍",
   "kind": "建筑线索与演绎",
   "fact": "简牍记录与城址、道路和房间组织形成联系。",
   "detail": "里耶保留建筑基址、排水、城墙和古井等线索。丁字街、土墙偏门、紧凑署舍与文书附室是教学性组合；点选署舍或简牍后展开屋顶，不能据此断言某间房专门处理了这些文书。",
   "position": [
    -1.2,
    1.35,
    -2.6
   ],
   "sourceIds": [
    "hunan-liye-city"
   ]
  },
  {
   "id": "well",
   "name": "木衬古井",
   "kind": "发掘背景示意",
   "fact": "大量里耶秦简从古井堆积中被发现。",
   "detail": "一号井发掘出现方形木框。此处井口缩浅，用于连接文书与发现背景；古井不是专门存档设施，模型也不还原井的实际深度。",
   "position": [
    4.3,
    0.28,
    2.4
   ],
   "sourceIds": [
    "hunan-liye-well"
   ]
  }
 ],
 "steps": [
  {
   "id": "open",
   "label": "展开木简，观察记录",
   "objectId": "slips",
   "duration": 1.6,
   "explanation": "已观察简牍这种记录载体。"
  },
  {
   "id": "calculate",
   "label": "核对九九表中的乘法",
   "objectId": "table",
   "duration": 1.4,
   "explanation": "已对照乘法示例。资料把九九表与土地、收成和生活中的数量运算联系起来。"
  },
  {
   "id": "bundle",
   "label": "整理记录，收拢成束",
   "objectId": "bundle",
   "duration": 1.8,
   "explanation": "已观察记录被整理的示意。文字让生活中的信息有机会被保存与传递。"
  }
 ],
 "qa": [
  {
   "question": "这些是原简上的字吗？",
   "answer": "画面使用现代字体转写的示例，不是原简拓本或完整释文。来源展览介绍里耶秦简和九九表木牍，可继续查看馆方资料核对原物。",
   "sourceIds": [
    "nmc-liye"
   ]
  },
  {
   "question": "为什么当时需要九九表？",
   "answer": "国博展览把乘法口诀与土地面积、收成、税收及生活统计联系起来。它说明数量运算与具体生活、管理活动有关，不能据此断言每个人都使用同一张表。",
   "sourceIds": [
    "nmc-liye"
   ]
  },
  {
   "question": "这座建筑是原样复原的吗？",
   "answer": "里耶保留建筑基址、排水、城墙和古井等线索。丁字街、土墙偏门、紧凑署舍与文书附室是教学性组合；点选署舍或简牍后展开屋顶，不能据此断言某间房专门处理了这些文书。",
   "sourceIds": [
    "hunan-liye-city"
   ]
  }
 ]
}
];
exhibits.forEach(expandEarlyContent);
exhibits.push(...weiJinExhibits,...tangExhibits,...songExhibits,...mingQingExhibits,...modernExhibits,...newEraExhibits);
exhibits.forEach(expandMiddleContent);
exhibits.forEach(expandLateContent);
export const getExhibit=(id:string)=>exhibits.find(s=>s.id===id);
export function exhibitSources(s:Exhibit,objectId:string|null){const o=s.objects.find(o=>o.id===objectId);return s.sources.filter(source=>!o||o.sourceIds.includes(source.id));}
export function exhibitPreset(s:Exhibit,question:string,objectId:string|null,actions:string[]=[]){
 const qa=s.qa.find(q=>q.question===question),o=s.objects.find(o=>o.id===objectId);
 if(qa)return {answer:qa.answer,sourceIds:qa.sourceIds,mode:'preset'};
 if(/^(这是什么|这个是什么)[？?]?$/.test(question))return o?{answer:`${o.name}：${o.fact} ${o.detail}`,sourceIds:o.sourceIds,mode:'preset'}:{answer:'请先选中一个物件，我就能围绕它讲解。',sourceIds:[],mode:'preset'};
 if(/刚才|做了什么/.test(question)){const last=s.steps.find(step=>step.id===actions.at(-1));return {answer:last?`你的记录显示：${last.explanation}`:'当前还没有完成操作，可以先观察一件器物。',sourceIds:[],mode:'preset'};}
 return {answer:'自由问答尚未连接。可以选择预置问题，或打开资料核对。现有材料不足以自动回答这个问题。',sourceIds:[],mode:'preset'};
}
