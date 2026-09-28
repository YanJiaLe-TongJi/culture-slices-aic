import type {Exhibit} from './exhibits';
import type {SourceEntry} from './content';
const chair:SourceEntry={id:'dpm-ming-chair',institution:'故宫博物院',title:'黄花梨木雕螭纹圈椅',url:'https://www.dpm.org.cn/collection/gear/229580.html',facts:['明代圈椅高103厘米，长63厘米，宽45厘米；椅圈由搭脑延伸成扶手，背板微向后弯。','座面为藤心，联帮棍呈S形，腿足外撇，管脚枨前低后高。','背板和牙板有雕饰，不能把明式家具概括为完全没有装饰。']};
const join:SourceEntry={id:'sh-mortise-furniture',institution:'上海市文旅推广网',title:'传统家具制作技艺：明清家具榫卯制作技艺',url:'https://www.meet-in-shanghai.net/cn/intangible-cultural-heritage/traditional-furniture-making-skills-ming-and-qing-dynasty-furniture-mortise-and-tenon-production-skills-408687/',facts:['榫卯以两个木构件的凹凸部分连接，凸部为榫头，凹部为榫眼。','不同家具采用多种榫卯，不能由一个简单示意推断全部构造。']};
const study:SourceEntry={id:'nmc-zhenshang-study',institution:'中国国家博物馆',title:'文徵明真赏斋图卷',url:'https://www.chnmuseum.cn/zp/zpml/csp/202203/t20220318_254422.shtml',facts:['画中茅舍两间，置屏风、书案，人物展卷赏玩，旁有书籍、器物和书画架。','湖石、竹木和斋室共同组织文人生活意象；画卷不是房屋测绘图。','此为文徵明88岁所作，主人为华夏；不能把另外一件馆藏椅说成画中主人原物。']};
const vase:SourceEntry={id:'dpm-qianlong-lotus-vase',institution:'故宫博物院',title:'青花缠枝莲瓶',url:'https://www.dpm.org.cn/collection/ceramic/227703.html',facts:['此瓶为清乾隆器，撇口、长颈、圆腹、外撇圈足，纹饰分区鲜明。','赏瓶器形创于雍正，此件乾隆器的缠枝莲纹与清廉寓意相联系，属于宫廷赏赐用瓷。','青花在胎上绘含钴色料，再施透明釉高温烧成，属于釉下彩。']};
const workshops:SourceEntry={id:'ich-jingdezhen-workshop',institution:'中国非物质文化遗产网',title:'景德镇传统瓷窑作坊营造技艺',url:'https://www.ihchina.cn/project_details/14311.html',facts:['坯房、窑房的空间要服务生产、仓储和生活，重视宽敞与通风。','窑体、窑房与坯房不同，不能把画坯房直接当作烧瓷的窑炉。']};
const archaeology:SourceEntry={id:'dpm-jingdezhen-layout',institution:'故宫博物院院刊 · 钟燕娣等',title:'明中期景德镇御器厂制瓷作坊布局讨论',url:'https://www.dpm.org.cn/Uploads/File/2020/09/25/u5f6d70f920d38.pdf',facts:['研究区分明中期考古所见与清后期至民国保留坯房，不同阶段布局不能混用。','传统坯房资料中，正间、廒间、泥房以木架和矩形天井组织生产、储藏与泥料准备。','现存或文献所绘布局不能直接当作某件器物烧造时的原工场。']};
const prints:SourceEntry={id:'ich-yangliuqing-print',institution:'中国非物质文化遗产网',title:'杨柳青木版年画',url:'https://www.ihchina.cn/project_details/13899.html',facts:['杨柳青年画采用刻绘结合，题材广泛，常以饱满构图表达吉祥愿望。','这是天津地域传统，不能与所有产地的木版年画制作方式混为一谈。']};
const process:SourceEntry={id:'ich-print-and-paint',institution:'中国非物质文化遗产网',title:'新春话年画',url:'https://www.ihchina.cn/news_1_details/10351.html',facts:['杨柳青年画常用半印半画：创稿、刻版、刷印套色之后，再手工填染与细绘。','印工需要对准墨线与套色，人物和背景还可能需要手绘完成。']};
const courtyard:SourceEntry={id:'tj-shi-courtyard',institution:'天津政务网',title:'石家大院',url:'https://www.tj.gov.cn/sq/yztj/mswh/202005/t20200520_2468011.html',facts:['石家大院位于杨柳青，大规模营建始于清光绪初年1875，院落相连、轴线明确。','砖木石构与高台形成清末当地院落的一例；这是富商宅第，不能当作所有画坊的原型。']};
const lotus:SourceEntry={id:'hkbu-lotus-fish-print',institution:'香港浸会大学图书馆',title:'莲年有余：年画藏品说明',url:'https://bcc.lib.hkbu.edu.hk/artcollection/j218-022/',facts:['莲与鱼的谐音联系连年有余，表达对美好生活的愿望。','馆藏这一张编目为20世纪年代不详，只能作题材对照，不能说成已确认的清代原版。']};
export const mingQingExhibits:Exhibit[]=[{
 id:'ming-qing-living',eraId:'ming-qing',kind:'study',title:'一椅一书',subtitle:'明代江南书斋',culture:'明代 · 家具与文人斋室',question:'一把椅子的线条，也能讲述生活方式吗？',description:'走入茅舍书斋，转看圈椅的连续弧线，组合一处榫卯示意，再在案上展开书卷。',accent:'#886448',ground:'#beb899',interpretation:'圈椅依据故宫实物照片自制，保留椅圈、背板、藤心、联帮棍与高低枨，雕纹为简化描绘。两间茅舍及竹石关系借国博《真赏斋图》意象重新组织，前屋面与右侧前墙展示性剖切；圈椅不是华夏原物，不能声称此处是真赏斋原貌。独立榫卯样块只解释凹凸接合，不拆解文物、不指认原椅具体节点；展卷画样自行制作。',sources:[chair,join,study],objects:[
 {id:'chair',name:'黄花梨圈椅',kind:'馆藏器形线索',fact:'一条弧形椅圈从后背延伸成扶手，线条与支承相连。',detail:'转动时观察后弯背板、S形联帮棍、藤心座面、外撇腿足和前低后高枨。模型简化雕纹，没有把木材颜色当作材种鉴定依据。',position:[-1.4,1.25,1.5],sourceIds:[chair.id]},
 {id:'joint',name:'榫头与榫眼',kind:'教学接合样块',fact:'凸出的榫头进入相应的榫眼，木件得以连接。',detail:'放大的样块仅说明凹凸配合；不能推断这把圈椅的所有节点都是同样形式，更不能由此声称所有古家具都不用胶或金属。',position:[1.7,1.45,1.0],sourceIds:[join.id]},
 {id:'scroll',name:'案上的展卷',kind:'生活情境示意',fact:'画中展卷、书案、藏书把斋室与赏玩活动联系起来。',detail:'这里展开的是自绘山石墨线，不是《真赏斋图》复制品，也没有编造卷中文字。器物所在位置为重新布置。',position:[-.3,1.36,-.65],sourceIds:[study.id]},
 {id:'books',name:'书架与屏风',kind:'原画生活线索',fact:'书画架、屏风与案台为不同活动划出空间。',detail:'本场景将右室留作藏书，左室开向庭院；书卷、册页与陈设为器类示意，不指认主人真实藏书。',position:[.9,1.55,-2.55],sourceIds:[study.id]},
 {id:'garden',name:'茅舍与竹石庭角',kind:'画面线索与推定',fact:'两间茅舍、湖石和竹木共同形成书斋意象。',detail:'依据文徵明画中空间关系，保留简朴屋面和方窗，没有套用豪华明清厅堂。建筑尺度、地台轮廓与木构细节为推定。',position:[3.65,1.2,2.4],sourceIds:[study.id]}
 ],steps:[
 {id:'turn',label:'转看圈椅，追随弧线',objectId:'chair',duration:5,explanation:'圈椅平稳转动，观察椅圈、扶手、后背与腿足的连续关系；动作是展示方式。'},
 {id:'join',label:'对准榫眼，合入木件',objectId:'joint',duration:4.5,explanation:'教学样块完成凹凸接合，并非原椅的拆装修复；不同节点还会有不同结构。'},
 {id:'scroll',label:'在书案上缓缓展卷',objectId:'scroll',duration:5,explanation:'自绘画样随卷轴展开，联系原画中的展卷赏玩生活；没有复制原作图像。'}
 ],qa:[
 {question:'圈椅为什么要弯成一圈？',answer:'馆方说明椅圈由搭脑延伸至两侧成为扶手，后背微倾，支承构件与流畅轮廓一起构成这种椅式。模型的旋转帮助观察连接关系。',sourceIds:[chair.id]},
 {question:'所有古家具都不用钉子吗？',answer:'不能一概而论。这个样块只说明榫头与榫眼怎样配合，不足以推断所有家具、所有节点是否用胶或金属辅助。',sourceIds:[join.id]},
 {question:'这是真赏斋原来的家具吗？',answer:'不是。建筑从《真赏斋图》提取空间意象，圈椅来自另一件故宫馆藏；这里是教学组合，没有同址或同主人的证据。',sourceIds:[study.id,chair.id]}
 ]
},{
 id:'ming-qing-making',eraId:'ming-qing',kind:'porcelain',title:'青花入釉',subtitle:'景德镇画坯工场',culture:'清代 · 青花赏瓶与制瓷空间',question:'青花的蓝色纹样，是画在釉里面还是外面？',description:'沿天井走到画案，观察长颈圆腹赏瓶上的纹饰分区，演示绘料、覆釉，再对照烧成。',accent:'#526c87',ground:'#b9b6a1',interpretation:'瓶形参照故宫乾隆青花缠枝莲瓶实物，自绘纹样保留分区与缠枝关系，不作原器摹本。工场借传统坯房正间、廒间、泥房与天井关系推定，部分资料为晚清民国保留实例，不宣称是乾隆御窑原址。颜料显色、釉层与烧成对照为教学可视化；在画坯房中不点火烧瓷，未演出的烧造、冷却通过状态过渡明确交代。',sources:[vase,workshops,archaeology],objects:[
 {id:'vase',name:'长颈圆腹赏瓶',kind:'馆藏器形线索',fact:'撇口、长颈、圆腹与外撇圈足构成赏瓶轮廓。',detail:'参考器为清乾隆，赏瓶器形创于雍正。纹饰从口沿、颈、肩、腹到足分带排列，蓝花为自绘近似纹样。',position:[-.8,1.65,1.5],sourceIds:[vase.id]},
 {id:'brush',name:'钴料与画笔',kind:'工艺原理示意',fact:'青花先在瓷胎上绘含钴色料，再进入施釉与烧成。',detail:'动作只描绘一段缠枝图案，并用逐步显现表达其余纹样。色料与烧成青色分开显示，不演示真实配方、温度或工艺参数。',position:[-2.15,1.26,1.5],sourceIds:[vase.id]},
 {id:'glaze',name:'覆盖纹样的釉层',kind:'教学可视化',fact:'透明釉覆盖纹样，青花因此属于釉下彩。',detail:'动画在原位显示薄层包覆，属于剖解原理，实际并不是透明罩自动套住瓶子。釉浆盆只交代工序关系。',position:[1.1,1.24,1.6],sourceIds:[vase.id]},
 {id:'rack',name:'存坯与晾架',kind:'生产情境',fact:'制作、干燥、存放和搬运需要不同空间。',detail:'架上白坯、托板和匣钵是场景道具，不对应此瓶原工场的实际产量。烧成另在窑房进行，画坯间不是窑炉。',position:[4.5,1.4,.35],sourceIds:[workshops.id]},
 {id:'yard',name:'天井与坯房',kind:'建筑线索与推定',fact:'木构房间围绕天井，服务制作、原料与存坯。',detail:'研究区分明代考古所见与晚清民国坯房。这里提取传统空间关系重新组织，不复制明中期F6遗址，不宣称乾隆御窑完整布局。',position:[-1,1.5,-2.9],sourceIds:[workshops.id,archaeology.id]}
 ],steps:[
 {id:'paint',label:'转动素坯，描绘缠枝',objectId:'vase',duration:5.5,explanation:'含钴色料先画在坯上，纹饰仍未经过烧成；笔路与时间为简化示意。'},
 {id:'glaze',label:'覆盖釉层，观察先后关系',objectId:'glaze',duration:4.5,explanation:'釉层覆盖已绘纹样。当前用包覆可视化说明关系，不等于实际施釉动作。'},
 {id:'fired',label:'对照烧成后的青花',objectId:'vase',duration:5,explanation:'对照的是另经窑房烧造、冷却后的结果；没有在画坯桌上直接烧瓷。蓝花位于透明釉下。'}
 ],qa:[
 {question:'青花是烧好后才画上去的吗？',answer:'不是。青花先在胎上绘含钴色料，再施透明釉并烧成，所以称釉下彩。这里最后一步是烧成前后对照，不是在桌上烧瓷。',sourceIds:[vase.id]},
 {question:'这是雍正还是乾隆的瓶子？',answer:'参考的馆藏器为清乾隆，赏瓶器形则创于雍正。器形出现年代和这一件实物的年代需要分开。',sourceIds:[vase.id]},
 {question:'这里就是原来造这件瓶子的工场吗？',answer:'不是。房屋借鉴传统坯房空间研究，部分依据为晚清民国实例，不能据此复原乾隆御窑或证明原瓶出自这间屋子。',sourceIds:[workshops.id,archaeology.id]}
 ]
},{
 id:'ming-qing-culture',eraId:'ming-qing',kind:'newyear',title:'纸上迎年',subtitle:'杨柳青年画坊',culture:'清末天津 · 半印半画的传统',question:'一张年画，为什么既要印又要画？',description:'走过青砖小院，从墨线版开始对准套色，再为鱼莲图样手工添彩，体会一张画里的工序协作。',accent:'#aa6652',ground:'#aaa997',interpretation:'建筑借清末天津院落的青砖灰瓦、门庭与房间关系组织，石家大院只是地域材料对照，不把富商宅第认成年画作坊。自绘鱼莲画样仅解释工序和谐音，不是馆藏摹印。大学图书馆的《莲年有余》标注20世纪年代不详，不能冒充清代原版；技艺材料只支撑原理，未精确复原某家清末画店。',sources:[prints,process,courtyard,lotus],objects:[
 {id:'keyblock',name:'墨线版与印纸',kind:'自制教学版',fact:'墨线把形象的轮廓先印到纸上。',detail:'木版、纸面和鱼莲图样均自行制作，用来表达轮廓定位；不复制馆藏人物或题字，制版过程已省略。',position:[-1.7,1.2,1.6],sourceIds:[prints.id,process.id]},
 {id:'colorblock',name:'套色版与定位角',kind:'套印示意',fact:'不同颜色对准同一张纸，才能与墨线配合。',detail:'演示只选一块红色色版，实际可能需要更多颜色和工序。定位角是教学辅助，不当作清末工具实物。',position:[.4,1.22,1.6],sourceIds:[process.id]},
 {id:'painting',name:'画门子上的加彩',kind:'手工补绘示意',fact:'杨柳青年画常在刷印套色后继续手工填染。',detail:'纸固定在倾斜支板上，画笔补充叶色和细线；不能以一笔显色代替实际全部细绘。它与单纯木版套色的流程存在区别。',position:[2.2,1.7,.45],sourceIds:[process.id]},
 {id:'motif',name:'鱼与莲的愿望',kind:'题材解读',fact:'莲、鱼与连、余谐音，寄托对生活富足的愿望。',detail:'图书馆所藏《莲年有余》提供题材说明，但该张年代未明确到清代；这里用自绘鱼莲纹样解释，不认定每张年画都有同一寓意。',position:[2.4,1.5,-2.5],sourceIds:[lotus.id]},
 {id:'courtyard',name:'青砖小院与存版房',kind:'地域建筑推定',fact:'印、画、存放在小院两侧形成不同作业角落。',detail:'从清末天津砖木院落提取高台、砖墙、灰瓦和门庭关系，省略富商宅第的戏楼等设施。不是石家大院原场景，更不是所有画坊的标准样式。',position:[-1.4,1.6,-2.8],sourceIds:[courtyard.id]}
 ],steps:[
 {id:'outline',label:'覆纸刷印，留下墨线',objectId:'keyblock',duration:5,explanation:'自制木版的轮廓印到纸上；此时图像还没有全部完成。'},
 {id:'color',label:'对准套色，添入红色',objectId:'colorblock',duration:5.2,explanation:'第二块版与纸上墨线对齐，添入一层色块。演示省略其他套色。'},
 {id:'paint',label:'移上画板，手工补彩',objectId:'painting',duration:5.7,explanation:'纸移到画门子后继续填绘，表现杨柳青年画半印半画的关系；图样是项目自制。'}
 ],qa:[
 {question:'年画都是直接印完的吗？',answer:'不同产地与作品有不同方法。杨柳青年画常采用刻绘结合，刷印套色后还要手工填染与细绘，不能把所有年画都当成同一种工艺。',sourceIds:[prints.id,process.id]},
 {question:'为什么要把颜色对准？',answer:'墨线版先留下轮廓，套色时需要让色块落在相应位置，否则会错位。这里的定位角是解释原理的教学道具。',sourceIds:[process.id]},
 {question:'这条鱼和莲花表示什么？',answer:'莲与连、鱼与余谐音，常表达连年有余的美好愿望。本场景自行绘制图案，所参考的图书馆藏品不能据此认定为清代原版。',sourceIds:[lotus.id]}
 ]
}];
