// 首页与场景页共用的时代视觉：卷字、卷色（中国传统色）与题辞；导语与时代问题在 catalog.ts。
// 九个分组只用于导航阅读，不写入精确年代，也不表达朝代的简单继承或优劣。
export interface EraTheme{glyph:string;color:string;colorName:string;motto:string}
export const eraThemes:Record<string,EraTheme>={
 prehistory:{glyph:'陶',color:'#9b5634',colorName:'赭石',motto:'土与火，谷与声'},
 'pre-qin':{glyph:'金',color:'#2f6660',colorName:'青铜',motto:'吉金为器，礼乐成序'},
 'qin-han':{glyph:'简',color:'#94702c',colorName:'鎏金',motto:'简上有数，灯下有烟'},
 'wei-jin':{glyph:'瓷',color:'#5f7a4f',colorName:'青瓷',motto:'江南窑火，平城石窟'},
 'sui-tang':{glyph:'茶',color:'#6e4153',colorName:'紫檀',motto:'碾茶犁田，刻版成书'},
 'song-yuan':{glyph:'市',color:'#3f7680',colorName:'天青',motto:'街巷点茶，汴河行舟，江山入画'},
 'ming-qing':{glyph:'艺',color:'#2c4b7e',colorName:'青花',motto:'斋中木器，坯上青花，纸上迎年'},
 modern:{glyph:'机',color:'#4d5966',colorName:'铁灰',motto:'脚踏机声，纱厂棉条，幕前光影'},
 'new-era':{glyph:'远',color:'#b0342c',colorName:'中国红',motto:'驰于地，行于天，存于数'}
};
export const eraTheme=(id:string):EraTheme=>eraThemes[id]||eraThemes.prehistory;
const digits='〇一二三四五六七八九';
export const hanNumber=(n:number)=>n<=10?(n===10?'十':digits[n]):n<20?`十${digits[n%10]}`:`${digits[Math.floor(n/10)]}十${n%10?digits[n%10]:''}`;
const formal='零壹贰叁肆伍陆柒捌玖拾';
export const formalNumber=(n:number)=>formal[n]||String(n);
export const categoryNotes:Record<string,string>={'日常生活':'起居饮食','生产技术':'百工技艺','精神文化':'礼乐文心'};
/** 首页与回退封面使用同名的 WebP 副本（scripts/make-webp-covers.py 生成）；PNG 仍是渲染原件。 */
export const webpCover=(cover:string)=>cover.replace('/images/','/images/webp/').replace(/\.png$/,'.webp');
