import type {Exhibit,ExhibitObject,Point} from './exhibits';
import type {SourceEntry} from './content';
const context=(id:string,name:string,position:Point,fact:string,detail:string,sourceIds:string[]):ExhibitObject=>({id,name,position,fact,detail,sourceIds,kind:'生活空间 · 教学演绎'});
const banpo:SourceEntry={id:'capital-banpo-settlement',institution:'首都博物馆',title:'半坡姑娘生活的地方',url:'https://www.capitalmuseum.org.cn/article/608d847521c64789a72c36d576d8f921',facts:['半坡遗址保存房屋遗址、陶窑等生产生活遗存。','半坡出土农作物主要为粟。','本场景据生活与生产的关系组合房屋、晾坯、烧陶空间；地上建筑和窑体为艺术推定，不是原工坊复原。']};
const jiahu:SourceEntry={id:'henan-jiahu-settlement',institution:'河南省文物考古研究院',title:'河南考古成果展：贾湖遗址',url:'https://www.hnswwkgyjy.cn/NewsView.php?News_ID=740',facts:['贾湖是河南舞阳的一处新石器时代聚落，遗址呈近圆形。','发掘出土骨笛等遗物及大量动植物遗骸。','场景中的草泥屋、听音棚、网架和岸线为情境演绎，不能作为骨笛原使用地点的证据。']};
const objects:Partial<Record<Exhibit['kind'],ExhibitObject[]>>={
 pottery:[context('settlement','作业区后的居住角',[-5,1.15,-6.5],'制陶活动之外，聚落还包含居住空间。','半坡资料支持房址与陶窑等遗存。圆形草泥屋与方形低屋的屋面、比例、陈设及相互位置均为展示推定；点选时展开，返回全景合拢，不把制陶工坊当作已完整发掘的现场。',[banpo.id]),context('firing','外缘烧陶空场',[7.25,.65,-4.8],'泥坯成形后，还需要经历干燥与烧制。','两处低矮窑体、薪柴与待处理陶器是工序关系示意；不复原半坡某座窑的内部结构、窑温或燃烧时间。',[banpo.id,'nmc-painted-basin'])],
 flute:[context('homes','林后的草泥住居',[-5.1,.9,-6],'骨笛来自聚落生活的背景。','贾湖资料提供聚落和丰富遗存线索。低矮草泥屋、房屋数量与屋顶形制属于艺术推定；点选时打开屋面和前壁是现代教学剖视；附近空地不能据此认定是史前音乐场所。',[jiahu.id]),context('wetland','芦苇岸边与网架',[2.2,.65,-5.5],'水岸帮助理解骨笛材料与自然环境的联系。','骨笛采用鹤类禽鸟骨管；湿地、网架及容器在这里构成环境示意。网具形态、使用方式和骨笛在岸边的摆放并没有被这些资料确证。',[jiahu.id,'henan-jiahu-flute'])],
 feast:[context('rear-court','后庭与后室',[0,1.5,-10.5],'堂、室、前后庭院可以组织不同的活动空间。','借周原王家嘴先周建筑的前后庭院和堂室线索，帮助观察空间层次。这不是利簋所在宅院；草泥屋顶、廊柱和房间尺度都是推定。',['zhouyuan-courtyard']),context('side-court','后庭短厢',[-4.28,1.2,-6.95],'侧厢将院落与相邻空间联系起来。','后庭一侧的短厢房与通道联系前堂和后室；资料支持厢房与院落关系，具体行走路线、器物和使用分工为教学安排。',['zhouyuan-courtyard'])],
 casting:[context('mould-yard','制范与晾置棚',[-3.15,1.2,-5.15],'铸铜需要制范、备料等多种准备活动。','郭元咀台基四周柱洞被解释为生产工棚，遗址有陶范与冶金遗存。单坡斜置工棚、工作台和范块摆放推定；此地不是后母戊鼎铸造地的证据。',['pku-guoyuanzui-workshop','nmc-bronze-mould']),context('fuel-yard','露天备料与薪柴',[-7.6,.65,.15],'作业场还需要材料暂存和通行空地。','把露天备料和薪柴与制范棚、炉火区分开，展示多工序协作。建筑地上部分、燃料种类及用量不由当前资料确定；不能按模型复现真实冶炼。',['pku-guoyuanzui-workshop'])],
 bells:[context('high-terrace','层台上的瓦厅',[-.45,4,-5.8],'台基高差让建筑空间具有层次。','借龙湾楚地夯土层台和瓦材，组织逐层收分的台榭与一座主厅。该证据不等同曾国宫室，屋顶、红黑木构和踏道比例为推定。',['hubei-longwan-terrace','longwan-building-tiles']),context('long-gallery','台侧短廊与登阶',[-6,2,-.5],'廊与登阶把不同高度的空间连接起来。','龙湾资料记录长廊和回廊柱洞。此处廊屋的高度、瓦顶与转折路线属于教学构图，不是曾侯乙真实演奏路线。',['hubei-longwan-terrace'])],
 lamp:[context('residence','前堂之后的分室',[-.35,1.3,-3.2],'一盏灯所在的室内，可以与院落和其他房间联系。','汉代建筑明器保存房屋、院落等线索，但具有墓葬用途与象征性。此处前堂、后部小室和侧院为教学组合，不是窦绾宅邸的直接复原。点选屋面或灯具时展开围护，返回全景恢复完整瓦屋。',['nmc-han-buildings']),context('service-court','侧院与井架',[6.7,1,.2],'生活空间还包含取水和储物等活动。','井、仓、院落等明器提供建筑类型线索；井架形制、容器内容和侧院分工为艺术组合，不能据模型确定长信宫灯原本摆在哪里。',['nmc-han-buildings'])],
 loom:[context('yarn-court','屋前整纱场',[-5.65,1,5.1],'织机之外，纱线也需要整理。','这里用屋前多排纱架展现织造准备空间，织机依据成都老官山模型，厂房与整理动作没有随织机一同出土，均属讲解场景。',['nmc-han-buildings']),context('storehouse','长屋端部存料间',[-7.1,1,-1.7],'生产空间需要为材料与通行留出位置。','横向多开间长屋把备料、织造与储物放在连续屋面下，外接整纱场与侧渠；只借汉代房屋类型，不宣称复原真实西汉工场的规模或管理制度。',['nmc-han-buildings'])],
 slips:[context('gate-lane','偏门与丁字街巷',[5.8,1,-2.3],'城内建筑通过门道与道路相联系。','里耶资料支持城墙、建筑、排水等线索。丁字街巷、连续夯土界墙、偏置门道和街沟位置为情境组合；不是按实测原址建立的县署模型。',['hunan-liye-city']),context('archive-yard','署舍的文书附室',[-6.12,1,-.6],'文字记录连接日常生活和地方事务。','紧凑署舍旁的附室是讲解文书流转的空间设计，不能据此认定考古发现了此形制的档案室；一号井也不是专门存档设施。',['hunan-liye-city','nmc-liye'])],
};
export function expandEarlyContent(s:Exhibit){
 const extra=objects[s.kind];if(!extra)return;
 if(s.kind==='pottery')s.sources.push(banpo);if(s.kind==='flute')s.sources.push(jiahu);
 s.objects.push(...extra);
 s.description={pottery:'从生活房屋走到制坯、晾坯与外缘烧陶空场，近看彩陶纹样。',flute:'沿芦苇水岸走近草泥住居，听见骨管与孔位的关系。',feast:'由门塾经过前庭、堂与后庭，从鼎簋理解器用与礼仪。',casting:'在斜置工棚、露天备料与炉火之间，观察铸造工序。',bells:'沿层台登阶走近钟架，在高台瓦厅前比较一钟两音。',lamp:'点开完整瓦屋，观察前堂灯具、后部分室与侧院。',loom:'从屋前纱架进入多开间长屋，体验经纬交织。',slips:'沿丁字街巷穿过偏门，进入署舍展开一束秦简。'}[s.kind as 'pottery'|'flute'|'feast'|'casting'|'bells'|'lamp'|'loom'|'slips']||s.description;
 s.interpretation+=' 扩大场景中的新增房屋、道路与作业分区为资料线索的教学组合，非遗址测绘；各区域卡片分别说明推定边界。';
 s.qa.push({question:'扩展的建筑是原样复原吗？',answer:extra.map(o=>`${o.name}：${o.detail}`).join(' '),sourceIds:[...new Set(extra.flatMap(o=>o.sourceIds))]});
}
