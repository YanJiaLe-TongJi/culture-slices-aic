import type {Exhibit} from './exhibits';
import type {SourceEntry} from './content';
const mill:SourceEntry={id:'famen-tea-mill',institution:'法门寺博物馆 · 央博展品资料',title:'唐鎏金鸿雁纹银茶槽子、鎏金团花银碢轴',url:'https://yangbo.cctv.cn/2023/05/17/ARTIb3bIhi0TwQuoFubuws1x230517.shtml',facts:['茶槽与银碢轴1987年出土于法门寺唐塔地宫，配套用于碾碎烤好的茶饼。','长方形茶碾由碾槽、辖板、槽座等构成；圆碾轮配横向执手，纹饰局部鎏金。','这是宫廷高等级茶具，不能代表唐代所有家庭的日用品。']};
const teaware:SourceEntry={id:'dpm-tang-teaware',institution:'故宫博物院 · 林熙文',title:'「事简茶香」——从茶具看唐、清两代宫廷茶文化的价值取向',url:'https://www.dpm.org.cn/Uploads/File/2019/12/09/u5dee21accd557.pdf',facts:['公开图版展示法门寺茶碾槽、碾轴和银茶罗子的分体结构。','茶罗子用来筛茶粉，包含盖、套框、筛罗、屉和器座。','陆羽《茶经》所述煎茶把茶末放入釜中煮；不能把宋代点茶的击拂直接当作这里的过程。']};
const courtyard:SourceEntry={id:'xian-tang-court',institution:'西安博物院 · 陕西日报现场专访',title:'从一座院落，看唐人的生活起居',url:'https://www.sxdaily.com.cn/2024-08/08/content_10805556.html',facts:['灵沼乡唐墓出土三彩院落模型，院内有前堂、后室和分列两旁的厢房。','模型屋顶采用悬山样式，后室明柱形成面阔三间，瓦垄和屋脊可辨。','建筑明器与真实宅院之间有简化与象征关系；模型的绿釉不等于民居都铺绿色琉璃瓦。']};
export const tangExhibits:Exhibit[]=[{
 id:'sui-tang-living',eraId:'sui-tang',kind:'tea',title:'碾间茶香',subtitle:'唐代茶事院落',culture:'晚唐器物 · 关中宅院线索',question:'一块茶饼，为什么要先碾再筛？',description:'坐近内庭茶案，观察银茶碾的槽与轮，再让茶末经过茶罗，走近唐人的备茶过程。',accent:'#957d4a',ground:'#bdb59a',
 interpretation:'主器依照法门寺地宫茶具的正面、底部和拆分图自制；银金花纹样为简化描绘，不是扫描模型。建筑借鉴盛唐三彩院落明器，与晚唐器物教学组合，不宣称是法门寺建筑或原使用宅邸。灰瓦、低案、茶饼和炉釜为情境推定；模型省略操作者并压缩加工时间，展示投茶、碾茶、过罗，不给出真实茶粉粒径或完整煎茶配方。',sources:[mill,teaware,courtyard],objects:[
 {id:'mill',name:'银茶碾与碢轴',kind:'馆藏形制线索',fact:'长槽托住碾轮，横轴便于让圆轮往复滚动。',detail:'主形参考法门寺鎏金鸿雁纹银茶槽子与鎏金团花银碢轴：透空矮座、长槽、辖板、圆轮和横轴。局部金花简化，轮与槽相配，不是上下两块圆石磨。',position:[-.84,.843,1.8125],sourceIds:[mill.id,teaware.id]},
 {id:'cake',name:'待碾的茶饼',kind:'情境对象',fact:'这里处理的是饼茶，先准备为可以碾碎的小块。',detail:'茶饼形状与碎块只是流程示意，不是地宫出土茶叶的复原。此前烘烤等准备工作没有完整演出；动画将已准备的碎茶放入碾槽。',position:[-2.105,.655,1.9425],sourceIds:[mill.id]},
 {id:'sieve',name:'银茶罗子',kind:'馆藏结构示意',fact:'碾碎以后，还可以用筛罗分开粗细。',detail:'参考公开图版中的盖、套框、筛罗、抽屉与器座；动画先把茶末送入筛面，再过罗收在屉内。孔径、颗粒与速度被放大便于观察，不能当作真实粒度标准。',position:[.495,.876,1.8125],sourceIds:[teaware.id]},
 {id:'stove',name:'炉与茶釜',kind:'备茶情境',fact:'陆羽所述煎茶要把茶末放入釜中煮。',detail:'这处炉釜只补充下一环节的语境，器形和摆放为自制示意；当前操作并未完成整套煎茶，不把碾好的茶末说成已经泡好的茶。',position:[3.6,.8,2.55],sourceIds:[teaware.id]},
 {id:'house',name:'明柱与悬山瓦屋',kind:'建筑线索与推定',fact:'前堂、后室与侧厢把内庭围合起来。',detail:'借鉴西安博物院唐三彩院落的房屋关系、悬山顶与明柱；为看清茶案，前堂屋面与部分墙柱作剖切。建筑明器并非精确施工图，此处没有把宅院说成法门寺原貌。',position:[-.7,1.5,-3.4],sourceIds:[courtyard.id]}
 ],steps:[
 {id:'load',label:'移开槽盖，将碎茶放入',objectId:'mill',duration:3.8,explanation:'碎茶已落入碾槽，盖板移到一侧；这是经过前期准备的茶饼碎块。'},
 {id:'roll',label:'往复碾磨，观察轮与槽',objectId:'mill',duration:5,explanation:'圆轮沿长槽滚动，横轴与碾轮一起运动；颗粒变化是示意，不表示真实碾磨次数或效率。'},
 {id:'sift',label:'送入茶罗，筛出细末',objectId:'sieve',duration:5.4,explanation:'茶末经过筛面落入屉内，较粗的颗粒暂留上面。备茶还没有等于煎茶完成。'}
 ],qa:[
 {question:'为什么不用两块石磨？',answer:'这件法门寺银茶碾使用圆轮和长槽，横轴带动碾轮往复滚动，把准备好的茶饼碾碎。它是高等级金银茶具的一例，不能代表所有人的工具。',sourceIds:[mill.id]},
 {question:'碾完为什么还要筛？',answer:'茶碾负责把茶饼碾碎，茶罗进一步分开粗细，细末收进屉内。动画把颗粒与筛孔放大，实际细度不能据此判断。',sourceIds:[teaware.id]},
 {question:'这就能像宋代那样打出茶沫吗？',answer:'这里讲唐代备茶及陆羽所述煎茶的线索；煎茶会将茶末入釜煮。宋代点茶与击拂是另一套方法，当前没有演示。',sourceIds:[teaware.id]}
 ]
}];

const plough:SourceEntry={id:'ihns-jiangdong-plough',institution:'中国科学院自然科学史研究所',title:'中国传统农业技术成就：江东犁',url:'https://agri-history.ihns.ac.cn/techniques/technique-b.htm',facts:['陆龟蒙《耒耜经》记述江东犁；曲辕结构适应江南较小田块的转向。','铧用于破土，犁壁使土翻转；木制犁评与犁梢参与控制入土深浅。','宋元增加的钩环不应直接放进唐代结构。']};
const toolPhoto:SourceEntry={id:'agri-traditional-plough',institution:'中国农业博物馆',title:'传统农具展：曲辕犁',url:'https://www.ciae.com.cn/detail/zh/31.html',facts:['展览展示传统曲辕犁的木架、弯曲辕、扶柄及金属犁头。','该展示用于形制比较，不能据此认定照片中的器具为唐代出土文物。']};
tangExhibits.push({
 id:'sui-tang-making',eraId:'sui-tang',kind:'plough',title:'江南开犁',subtitle:'江东犁与水田一角',culture:'唐代文献 · 江南农业线索',question:'弯曲的木辕，怎样和铁犁头一起工作？',description:'走到田埂边，观察木架、犁铧与犁壁，调节入土关系，跟随牵引看见土块翻起。',accent:'#6e805a',ground:'#a9af88',
 interpretation:'曲辕犁综合《耒耜经》的结构说明与农博传统农具照片制作，是原理模型，不是唐代出土原物的复原。农舍、草顶农具棚、浅水田、渠道与田块边界为环境推定，不对应某处已发掘唐代农舍。省略牛与操作者，以绳索移动提示外部牵引；停止、调节、翻土、回转被压缩演示，不计算真实耕深、牵引力或效率。',sources:[plough,toolPhoto],objects:[
 {id:'plough',name:'曲辕与扶柄',kind:'文献结构示意',fact:'弯曲的辕连接木架与牵引端，后部扶柄用于操控。',detail:'观察短曲辕、长底木、扶柄和中部犁柱的连接；模型没有照搬传统农具照片上的后期金属钩环。看动作时，前方绳索代表场景外的牵引。',position:[-.45,.95,1.15],sourceIds:[plough.id,toolPhoto.id]},
 {id:'share',name:'铁铧与犁壁',kind:'功能构件',fact:'前端破开土层，弯曲的壁面让土向一侧翻转。',detail:'铧与壁不是两个装饰片。动画让被切开的土顺着壁面滚向侧边；土块被放大，形状并非真实土壤模拟。',position:[.3,.42,1.35],sourceIds:[plough.id]},
 {id:'ridge',name:'田块与田埂',kind:'环境推定',fact:'田块的边界让转向成为耕作时要考虑的问题。',detail:'这里用小田块表达农具与空间的关系。示范地留作浅湿泥土，邻田保留浅水，不演示从耕地到收获的整套稻作。',position:[.2,.18,2.6],sourceIds:[plough.id]},
 {id:'channel',name:'田边水沟',kind:'情境对象',fact:'水田环境中需要留意水与土的关系。',detail:'沟渠和横跨的小木桥帮助说明场地关系，尺寸、位置及水位为美术推定；这里没有复原某项唐代水利工程。',position:[4.5,.02,.2],sourceIds:[plough.id]},
 {id:'shed',name:'田旁农具棚',kind:'建筑情境推定',fact:'田边小棚为工具留出干燥的存放空间。',detail:'草屋面、木柱和泥墙是场景推定，不作为唐代农舍定型证据。它和关中茶事宅院使用不同的尺度、材料和布局。',position:[-3.75,1.2,-3.1],sourceIds:[toolPhoto.id]}
 ],steps:[
 {id:'adjust',label:'停犁，调节木评',objectId:'plough',duration:3.6,explanation:'调节在停止时进行，改变辕与犁柱的关系。模型只显示连接方式，不给出真实耕深刻度。'},
 {id:'furrow',label:'沿田牵引，观察翻土',objectId:'share',duration:6,explanation:'牵引使铁铧前进，土从犁壁一侧翻起；绳索只代表外部动力，犁不会自行耕作。'},
 {id:'turn',label:'到田头，提犁回转',objectId:'plough',duration:4.5,explanation:'短曲辕使转向更便于安排。这里简化了操作者、牛和转弯半径，不能据动画推算效率。'}
 ],qa:[
 {question:'为什么辕要弯曲？',answer:'江东犁采用较短的曲辕，适应江南田块内的操控与转向。模型依据文献作结构示意，不能拿动画计算真实转弯半径。',sourceIds:[plough.id]},
 {question:'铧和壁有什么区别？',answer:'铧切开土，犁壁引导土翻转。看刚才的翻土动画，土从前端进入，再向侧边翻开。',sourceIds:[plough.id]},
 {question:'这是唐代出土的犁吗？',answer:'不是。唐代结构来自文献，形状另参考中国农业博物馆展示的传统农具；照片中的器具没有在这里被认定为唐代原物。',sourceIds:[plough.id,toolPhoto.id]}
 ]
});

const sutra:SourceEntry={id:'bl-diamond-sutra',institution:'英国图书馆 · 国际敦煌项目',title:'藏经洞藏品：868年《金刚经》印本',url:'https://idp.bl.uk/discover/learning/dunhuang/collection-items/cave-17-the-library-cave/',facts:['此卷有868年纪年，是现存最早有确切纪年的完整印刷书卷。','七张染黄纸印刷后接成约五米长卷，含精细扉画。','敦煌藏经洞是其发现地，不能因此断言印刷地点；纪年不等于雕版术的发明年份。']};
const printing:SourceEntry={id:'unesco-block-print',institution:'联合国教科文组织',title:'中国雕版印刷技艺',url:'https://ich.unesco.org/en/RL/china-engraved-block-printing-technique-00229',facts:['传统雕版把图文刻在木版上，凸起的部分承墨并将图文转到纸上。','制版和印刷包含多项手工协作；保留下来的传统技艺只能作为原理对照，不能直接证明全部唐代工具细节。']};
const street:SourceEntry={id:'chengdu-street-phases',institution:'中国社会科学网 · 考古研究',title:'古城的消失与重构 · 成都江南馆街遗址分期',url:'https://www.cssn.cn/kgxc/kgxc_kgsb/202207/t20220728_5431241.shtml',facts:['成都江南馆街遗址包含唐宋时期的道路、房屋及排水设施。','临街房屋为理解城市经营与生活空间提供线索，各时期遗存应分别辨认；不能把南宋砖铺大街整体倒放到晚唐。']};
tangExhibits.push({
 id:'sui-tang-culture',eraId:'sui-tang',kind:'printing',title:'木版上的文字',subtitle:'晚唐印刷铺作',culture:'晚唐印本 · 成都印业情境',question:'一块木版，怎样留下许多相同的字？',description:'走入临街铺作，为凸起的版面刷墨、覆纸擦印，再翻开纸张，对照反字与正字。',accent:'#826c58',ground:'#b9ac90',
 interpretation:'以868年《金刚经》印本引入早期雕版，另借成都街坊遗址和晚唐印业背景组织场景，不宣称此卷原印于这间铺子。房屋立面、屋面、案具、存板架和工具为推定；未采用南宋砖铺主街。板面“一版一印、以墨传文”为当代自制教学字样，字体并非古字摹刻；没有将馆藏扫描图作为产品贴图。传统雕版原理用于解释，动作省略操作者，不能据动画计算印刷速度。',sources:[printing,sutra,street],objects:[
 {id:'board',name:'反字木版',kind:'教学自制模型',fact:'版面凸起的部分承墨，印到纸上才成为正字。',detail:'木版上是自制示范文字，不是《金刚经》原版。整页图文固定在同一块板上，和后来可以逐字排组的活字不同。',position:[-1,.98,.8],sourceIds:[printing.id,sutra.id]},
 {id:'brush',name:'墨与擦刷',kind:'工艺原理示意',fact:'墨附在凸起版面，覆纸后通过擦印转到纸面。',detail:'演示先刷墨，再放纸，最后用另一只擦刷使纸贴合。刷具形状参考传统原理，不声称是唐代出土的原样工具。',position:[-2.7,1.02,.0],sourceIds:[printing.id]},
 {id:'paper',name:'覆纸与揭印',kind:'互动对象',fact:'揭纸之后，可以对照木版与印样的方向。',detail:'薄纸通过抬起、移位和翻转展示印迹；运动经过简化。自制字样只用于解释原理，没有冒充史料原文。',position:[.15,1.02,.8],sourceIds:[printing.id]},
 {id:'scroll',name:'从印张到书卷',kind:'文献线索',fact:'868年《金刚经》由多张印纸接成长卷。',detail:'七张染黄纸构成约五米长卷，扉画和文字都展现早期印刷的成熟程度。柜上书卷为示意，不逐字复现原件；“最早有纪年的完整印本”不等于最早发明印刷。',position:[2.15,1.0,-2.55],sourceIds:[sutra.id]},
 {id:'shop',name:'临街铺屋与存板间',kind:'建筑线索与推定',fact:'前部开向街巷，后部给存板与备纸留出空间。',detail:'借鉴成都唐宋遗址中的临街房址关系，采用土路并把前屋顶剖开以便观察。木构、泥墙、瓦顶和陈设为艺术推定，不能用这套模型判断某间唐代作坊的真实形制。',position:[-.7,1.5,-2.8],sourceIds:[street.id]}
 ],steps:[
 {id:'ink',label:'刷墨，让凸字承墨',objectId:'board',duration:4.4,explanation:'凸起的图文承墨。版面是当代自制教学字样，刻版准备过程已省略。'},
 {id:'press',label:'移入薄纸，轻擦覆印',objectId:'paper',duration:5.1,explanation:'纸平稳覆盖版面，擦刷让纸与承墨文字贴合；这不是用一张有字的纸盖住木版。'},
 {id:'lift',label:'揭纸翻看，对照字向',objectId:'paper',duration:4.8,explanation:'版面反字与纸面正字相对应。印张可重复制作，再装裱或接卷；此处没有演完书卷的全部制作步骤。'}
 ],qa:[
 {question:'为什么木版上的字是反的？',answer:'纸与木版接触后，从印迹一面看，方向会翻转。因此木版以反字制版，纸面才显示正字。这里的示范字样是项目自制。',sourceIds:[printing.id]},
 {question:'唐代已经有活字了吗？',answer:'这里演示的是整版雕刻，不是活字排版。868年《金刚经》是雕版印本，不能把它当作活字印刷的证据。',sourceIds:[sutra.id]},
 {question:'868年就是印刷术发明的时间吗？',answer:'不能这样说。这卷书的重要性在于完整保存并有明确纪年；它并不能证明印刷术就在那年才出现。敦煌是发现地，也不能直接等同印刷地。',sourceIds:[sutra.id]}
 ]
});
