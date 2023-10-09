type Theme = {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  color10: string;
  color11: string;
  color12: string;
  background: string;
  backgroundHover: string;
  backgroundPress: string;
  backgroundFocus: string;
  backgroundStrong: string;
  backgroundTransparent: string;
  color: string;
  colorHover: string;
  colorPress: string;
  colorFocus: string;
  colorTransparent: string;
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
  borderColorPress: string;
  placeholderColor: string;
  blue1: string;
  blue2: string;
  blue3: string;
  blue4: string;
  blue5: string;
  blue6: string;
  blue7: string;
  blue8: string;
  blue9: string;
  blue10: string;
  blue11: string;
  blue12: string;
  gray1: string;
  gray2: string;
  gray3: string;
  gray4: string;
  gray5: string;
  gray6: string;
  gray7: string;
  gray8: string;
  gray9: string;
  gray10: string;
  gray11: string;
  gray12: string;
  green1: string;
  green2: string;
  green3: string;
  green4: string;
  green5: string;
  green6: string;
  green7: string;
  green8: string;
  green9: string;
  green10: string;
  green11: string;
  green12: string;
  orange1: string;
  orange2: string;
  orange3: string;
  orange4: string;
  orange5: string;
  orange6: string;
  orange7: string;
  orange8: string;
  orange9: string;
  orange10: string;
  orange11: string;
  orange12: string;
  pink1: string;
  pink2: string;
  pink3: string;
  pink4: string;
  pink5: string;
  pink6: string;
  pink7: string;
  pink8: string;
  pink9: string;
  pink10: string;
  pink11: string;
  pink12: string;
  purple1: string;
  purple2: string;
  purple3: string;
  purple4: string;
  purple5: string;
  purple6: string;
  purple7: string;
  purple8: string;
  purple9: string;
  purple10: string;
  purple11: string;
  purple12: string;
  red1: string;
  red2: string;
  red3: string;
  red4: string;
  red5: string;
  red6: string;
  red7: string;
  red8: string;
  red9: string;
  red10: string;
  red11: string;
  red12: string;
  yellow1: string;
  yellow2: string;
  yellow3: string;
  yellow4: string;
  yellow5: string;
  yellow6: string;
  yellow7: string;
  yellow8: string;
  yellow9: string;
  yellow10: string;
  yellow11: string;
  yellow12: string;
  shadowColor: string;
  shadowColorHover: string;
  shadowColorPress: string;
  shadowColorFocus: string;

}

function t(a) {
  let res: Record<string, string> = {}
  for (const [ki, vi] of a) {
    // @ts-ignore
    res[ks[ki]] = vs[vi]
  }
  return res
}
const vs = [
  '#fff',
  '#f8f8f8',
  'hsl(0, 0%, 96.3%)',
  'hsl(0, 0%, 94.1%)',
  'hsl(0, 0%, 92.0%)',
  'hsl(0, 0%, 90.0%)',
  'hsl(0, 0%, 88.5%)',
  'hsl(0, 0%, 81.0%)',
  'hsl(0, 0%, 56.1%)',
  'hsl(0, 0%, 50.3%)',
  'hsl(0, 0%, 42.5%)',
  'hsl(0, 0%, 9.0%)',
  'rgba(255,255,255,0)',
  'rgba(10,10,10,0)',
  'hsl(206, 100%, 99.2%)',
  'hsl(210, 100%, 98.0%)',
  'hsl(209, 100%, 96.5%)',
  'hsl(210, 98.8%, 94.0%)',
  'hsl(209, 95.0%, 90.1%)',
  'hsl(209, 81.2%, 84.5%)',
  'hsl(208, 77.5%, 76.9%)',
  'hsl(206, 81.9%, 65.3%)',
  'hsl(206, 100%, 50.0%)',
  'hsl(208, 100%, 47.3%)',
  'hsl(211, 100%, 43.2%)',
  'hsl(211, 100%, 15.0%)',
  'hsl(0, 0%, 99.0%)',
  'hsl(0, 0%, 97.3%)',
  'hsl(0, 0%, 95.1%)',
  'hsl(0, 0%, 93.0%)',
  'hsl(0, 0%, 90.9%)',
  'hsl(0, 0%, 88.7%)',
  'hsl(0, 0%, 85.8%)',
  'hsl(0, 0%, 78.0%)',
  'hsl(0, 0%, 52.3%)',
  'hsl(0, 0%, 43.5%)',
  'hsl(136, 50.0%, 98.9%)',
  'hsl(138, 62.5%, 96.9%)',
  'hsl(139, 55.2%, 94.5%)',
  'hsl(140, 48.7%, 91.0%)',
  'hsl(141, 43.7%, 86.0%)',
  'hsl(143, 40.3%, 79.0%)',
  'hsl(146, 38.5%, 69.0%)',
  'hsl(151, 40.2%, 54.1%)',
  'hsl(151, 55.0%, 41.5%)',
  'hsl(152, 57.5%, 37.6%)',
  'hsl(153, 67.0%, 28.5%)',
  'hsl(155, 40.0%, 14.0%)',
  'hsl(24, 70.0%, 99.0%)',
  'hsl(24, 83.3%, 97.6%)',
  'hsl(24, 100%, 95.3%)',
  'hsl(25, 100%, 92.2%)',
  'hsl(25, 100%, 88.2%)',
  'hsl(25, 100%, 82.8%)',
  'hsl(24, 100%, 75.3%)',
  'hsl(24, 94.5%, 64.3%)',
  'hsl(24, 94.0%, 50.0%)',
  'hsl(24, 100%, 46.5%)',
  'hsl(24, 100%, 37.0%)',
  'hsl(15, 60.0%, 17.0%)',
  'hsl(322, 100%, 99.4%)',
  'hsl(323, 100%, 98.4%)',
  'hsl(323, 86.3%, 96.5%)',
  'hsl(323, 78.7%, 94.2%)',
  'hsl(323, 72.2%, 91.1%)',
  'hsl(323, 66.3%, 86.6%)',
  'hsl(323, 62.0%, 80.1%)',
  'hsl(323, 60.3%, 72.4%)',
  'hsl(322, 65.0%, 54.5%)',
  'hsl(322, 63.9%, 50.7%)',
  'hsl(322, 75.0%, 46.0%)',
  'hsl(320, 70.0%, 13.5%)',
  'hsl(280, 65.0%, 99.4%)',
  'hsl(276, 100%, 99.0%)',
  'hsl(276, 83.1%, 97.0%)',
  'hsl(275, 76.4%, 94.7%)',
  'hsl(275, 70.8%, 91.8%)',
  'hsl(274, 65.4%, 87.8%)',
  'hsl(273, 61.0%, 81.7%)',
  'hsl(272, 60.0%, 73.5%)',
  'hsl(272, 51.0%, 54.0%)',
  'hsl(272, 46.8%, 50.3%)',
  'hsl(272, 50.0%, 45.8%)',
  'hsl(272, 66.0%, 16.0%)',
  'hsl(359, 100%, 99.4%)',
  'hsl(359, 100%, 98.6%)',
  'hsl(360, 100%, 96.8%)',
  'hsl(360, 97.9%, 94.8%)',
  'hsl(360, 90.2%, 91.9%)',
  'hsl(360, 81.7%, 87.8%)',
  'hsl(359, 74.2%, 81.7%)',
  'hsl(359, 69.5%, 74.3%)',
  'hsl(358, 75.0%, 59.0%)',
  'hsl(358, 69.4%, 55.2%)',
  'hsl(358, 65.0%, 48.7%)',
  'hsl(354, 50.0%, 14.6%)',
  'hsl(60, 54.0%, 98.5%)',
  'hsl(52, 100%, 95.5%)',
  'hsl(55, 100%, 90.9%)',
  'hsl(54, 100%, 86.6%)',
  'hsl(52, 97.9%, 82.0%)',
  'hsl(50, 89.4%, 76.1%)',
  'hsl(47, 80.4%, 68.0%)',
  'hsl(48, 100%, 46.1%)',
  'hsl(53, 92.0%, 50.0%)',
  'hsl(50, 100%, 48.5%)',
  'hsl(42, 100%, 29.0%)',
  'hsl(40, 55.0%, 13.5%)',
  'rgba(0,0,0,0.085)',
  'rgba(0,0,0,0.04)',
  '#050505',
  '#151515',
  '#191919',
  '#232323',
  '#282828',
  '#323232',
  '#424242',
  '#494949',
  '#545454',
  '#626262',
  '#a5a5a5',
  'hsl(212, 35.0%, 9.2%)',
  'hsl(216, 50.0%, 11.8%)',
  'hsl(214, 59.4%, 15.3%)',
  'hsl(214, 65.8%, 17.9%)',
  'hsl(213, 71.2%, 20.2%)',
  'hsl(212, 77.4%, 23.1%)',
  'hsl(211, 85.1%, 27.4%)',
  'hsl(211, 89.7%, 34.1%)',
  'hsl(209, 100%, 60.6%)',
  'hsl(210, 100%, 66.1%)',
  'hsl(206, 98.0%, 95.8%)',
  'hsl(0, 0%, 8.5%)',
  'hsl(0, 0%, 11.0%)',
  'hsl(0, 0%, 13.6%)',
  'hsl(0, 0%, 15.8%)',
  'hsl(0, 0%, 17.9%)',
  'hsl(0, 0%, 20.5%)',
  'hsl(0, 0%, 24.3%)',
  'hsl(0, 0%, 31.2%)',
  'hsl(0, 0%, 43.9%)',
  'hsl(0, 0%, 49.4%)',
  'hsl(0, 0%, 62.8%)',
  'hsl(146, 30.0%, 7.4%)',
  'hsl(155, 44.2%, 8.4%)',
  'hsl(155, 46.7%, 10.9%)',
  'hsl(154, 48.4%, 12.9%)',
  'hsl(154, 49.7%, 14.9%)',
  'hsl(154, 50.9%, 17.6%)',
  'hsl(153, 51.8%, 21.8%)',
  'hsl(151, 51.7%, 28.4%)',
  'hsl(151, 49.3%, 46.5%)',
  'hsl(151, 50.0%, 53.2%)',
  'hsl(137, 72.0%, 94.0%)',
  'hsl(30, 70.0%, 7.2%)',
  'hsl(28, 100%, 8.4%)',
  'hsl(26, 91.1%, 11.6%)',
  'hsl(25, 88.3%, 14.1%)',
  'hsl(24, 87.6%, 16.6%)',
  'hsl(24, 88.6%, 19.8%)',
  'hsl(24, 92.4%, 24.0%)',
  'hsl(25, 100%, 29.0%)',
  'hsl(24, 100%, 58.5%)',
  'hsl(24, 100%, 62.2%)',
  'hsl(24, 97.0%, 93.2%)',
  'hsl(318, 25.0%, 9.6%)',
  'hsl(319, 32.2%, 11.6%)',
  'hsl(319, 41.0%, 16.0%)',
  'hsl(320, 45.4%, 18.7%)',
  'hsl(320, 49.0%, 21.1%)',
  'hsl(321, 53.6%, 24.4%)',
  'hsl(321, 61.1%, 29.7%)',
  'hsl(322, 74.9%, 37.5%)',
  'hsl(323, 72.8%, 59.2%)',
  'hsl(325, 90.0%, 66.4%)',
  'hsl(322, 90.0%, 95.8%)',
  'hsl(284, 20.0%, 9.6%)',
  'hsl(283, 30.0%, 11.8%)',
  'hsl(281, 37.5%, 16.5%)',
  'hsl(280, 41.2%, 20.0%)',
  'hsl(279, 43.8%, 23.3%)',
  'hsl(277, 46.4%, 27.5%)',
  'hsl(275, 49.3%, 34.6%)',
  'hsl(272, 52.1%, 45.9%)',
  'hsl(273, 57.3%, 59.1%)',
  'hsl(275, 80.0%, 71.0%)',
  'hsl(279, 75.0%, 95.7%)',
  'hsl(353, 23.0%, 9.8%)',
  'hsl(357, 34.4%, 12.0%)',
  'hsl(356, 43.4%, 16.4%)',
  'hsl(356, 47.6%, 19.2%)',
  'hsl(356, 51.1%, 21.9%)',
  'hsl(356, 55.2%, 25.9%)',
  'hsl(357, 60.2%, 31.8%)',
  'hsl(358, 65.0%, 40.4%)',
  'hsl(358, 85.3%, 64.0%)',
  'hsl(358, 100%, 69.5%)',
  'hsl(351, 89.0%, 96.0%)',
  'hsl(45, 100%, 5.5%)',
  'hsl(46, 100%, 6.7%)',
  'hsl(45, 100%, 8.7%)',
  'hsl(45, 100%, 10.4%)',
  'hsl(47, 100%, 12.1%)',
  'hsl(49, 100%, 14.3%)',
  'hsl(49, 90.3%, 18.4%)',
  'hsl(50, 100%, 22.0%)',
  'hsl(54, 100%, 68.0%)',
  'hsl(48, 100%, 47.0%)',
  'hsl(53, 100%, 91.0%)',
  'rgba(0,0,0,0.3)',
  'rgba(0,0,0,0.2)',
  'hsla(24, 70.0%, 99.0%, 0)',
  'hsla(15, 60.0%, 17.0%, 0)',
  'hsla(60, 54.0%, 98.5%, 0)',
  'hsla(40, 55.0%, 13.5%, 0)',
  'hsla(136, 50.0%, 98.9%, 0)',
  'hsla(155, 40.0%, 14.0%, 0)',
  'hsla(206, 100%, 99.2%, 0)',
  'hsla(211, 100%, 15.0%, 0)',
  'hsla(280, 65.0%, 99.4%, 0)',
  'hsla(272, 66.0%, 16.0%, 0)',
  'hsla(322, 100%, 99.4%, 0)',
  'hsla(320, 70.0%, 13.5%, 0)',
  'hsla(359, 100%, 99.4%, 0)',
  'hsla(354, 50.0%, 14.6%, 0)',
  'hsla(30, 70.0%, 7.2%, 0)',
  'hsla(24, 97.0%, 93.2%, 0)',
  'hsla(45, 100%, 5.5%, 0)',
  'hsla(53, 100%, 91.0%, 0)',
  'hsla(146, 30.0%, 7.4%, 0)',
  'hsla(137, 72.0%, 94.0%, 0)',
  'hsla(212, 35.0%, 9.2%, 0)',
  'hsla(206, 98.0%, 95.8%, 0)',
  'hsla(284, 20.0%, 9.6%, 0)',
  'hsla(279, 75.0%, 95.7%, 0)',
  'hsla(318, 25.0%, 9.6%, 0)',
  'hsla(322, 90.0%, 95.8%, 0)',
  'hsla(353, 23.0%, 9.8%, 0)',
  'hsla(351, 89.0%, 96.0%, 0)',
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.9)',
  'transparent',
  'undefined',
]

const ks = [
'color1',
'color2',
'color3',
'color4',
'color5',
'color6',
'color7',
'color8',
'color9',
'color10',
'color11',
'color12',
'background',
'backgroundHover',
'backgroundPress',
'backgroundFocus',
'backgroundStrong',
'backgroundTransparent',
'color',
'colorHover',
'colorPress',
'colorFocus',
'colorTransparent',
'borderColor',
'borderColorHover',
'borderColorFocus',
'borderColorPress',
'placeholderColor',
'blue1',
'blue2',
'blue3',
'blue4',
'blue5',
'blue6',
'blue7',
'blue8',
'blue9',
'blue10',
'blue11',
'blue12',
'gray1',
'gray2',
'gray3',
'gray4',
'gray5',
'gray6',
'gray7',
'gray8',
'gray9',
'gray10',
'gray11',
'gray12',
'green1',
'green2',
'green3',
'green4',
'green5',
'green6',
'green7',
'green8',
'green9',
'green10',
'green11',
'green12',
'orange1',
'orange2',
'orange3',
'orange4',
'orange5',
'orange6',
'orange7',
'orange8',
'orange9',
'orange10',
'orange11',
'orange12',
'pink1',
'pink2',
'pink3',
'pink4',
'pink5',
'pink6',
'pink7',
'pink8',
'pink9',
'pink10',
'pink11',
'pink12',
'purple1',
'purple2',
'purple3',
'purple4',
'purple5',
'purple6',
'purple7',
'purple8',
'purple9',
'purple10',
'purple11',
'purple12',
'red1',
'red2',
'red3',
'red4',
'red5',
'red6',
'red7',
'red8',
'red9',
'red10',
'red11',
'red12',
'yellow1',
'yellow2',
'yellow3',
'yellow4',
'yellow5',
'yellow6',
'yellow7',
'yellow8',
'yellow9',
'yellow10',
'yellow11',
'yellow12',
'shadowColor',
'shadowColorHover',
'shadowColorPress',
'shadowColorFocus']


const n1 = t([[0, 0],[1, 1],[2, 2],[3, 3],[4, 4],[5, 5],[6, 6],[7, 7],[8, 8],[9, 9],[10, 10],[11, 11],[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 4],[24, 5],[25, 3],[26, 4],[27, 8],[28, 14],[29, 15],[30, 16],[31, 17],[32, 18],[33, 19],[34, 20],[35, 21],[36, 22],[37, 23],[38, 24],[39, 25],[40, 26],[41, 27],[42, 28],[43, 29],[44, 30],[45, 31],[46, 32],[47, 33],[48, 8],[49, 34],[50, 35],[51, 11],[52, 36],[53, 37],[54, 38],[55, 39],[56, 40],[57, 41],[58, 42],[59, 43],[60, 44],[61, 45],[62, 46],[63, 47],[64, 48],[65, 49],[66, 50],[67, 51],[68, 52],[69, 53],[70, 54],[71, 55],[72, 56],[73, 57],[74, 58],[75, 59],[76, 60],[77, 61],[78, 62],[79, 63],[80, 64],[81, 65],[82, 66],[83, 67],[84, 68],[85, 69],[86, 70],[87, 71],[88, 72],[89, 73],[90, 74],[91, 75],[92, 76],[93, 77],[94, 78],[95, 79],[96, 80],[97, 81],[98, 82],[99, 83],[100, 84],[101, 85],[102, 86],[103, 87],[104, 88],[105, 89],[106, 90],[107, 91],[108, 92],[109, 93],[110, 94],[111, 95],[112, 96],[113, 97],[114, 98],[115, 99],[116, 100],[117, 101],[118, 102],[119, 103],[120, 104],[121, 105],[122, 106],[123, 107],[124, 108],[125, 108],[126, 109],[127, 109]]) as Theme

export const light = n1 as Theme
const n2 = t([[0, 110],[1, 111],[2, 112],[3, 113],[4, 114],[5, 115],[6, 116],[7, 117],[8, 118],[9, 119],[10, 120],[11, 0],[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 114],[24, 115],[25, 113],[26, 114],[27, 118],[28, 121],[29, 122],[30, 123],[31, 124],[32, 125],[33, 126],[34, 127],[35, 128],[36, 22],[37, 129],[38, 130],[39, 131],[40, 132],[41, 133],[42, 134],[43, 135],[44, 136],[45, 137],[46, 138],[47, 139],[48, 140],[49, 141],[50, 142],[51, 29],[52, 143],[53, 144],[54, 145],[55, 146],[56, 147],[57, 148],[58, 149],[59, 150],[60, 44],[61, 151],[62, 152],[63, 153],[64, 154],[65, 155],[66, 156],[67, 157],[68, 158],[69, 159],[70, 160],[71, 161],[72, 56],[73, 162],[74, 163],[75, 164],[76, 165],[77, 166],[78, 167],[79, 168],[80, 169],[81, 170],[82, 171],[83, 172],[84, 68],[85, 173],[86, 174],[87, 175],[88, 176],[89, 177],[90, 178],[91, 179],[92, 180],[93, 181],[94, 182],[95, 183],[96, 80],[97, 184],[98, 185],[99, 186],[100, 187],[101, 188],[102, 189],[103, 190],[104, 191],[105, 192],[106, 193],[107, 194],[108, 92],[109, 195],[110, 196],[111, 197],[112, 198],[113, 199],[114, 200],[115, 201],[116, 202],[117, 203],[118, 204],[119, 205],[120, 104],[121, 206],[122, 207],[123, 208],[124, 209],[125, 209],[126, 210],[127, 210]]) as Theme

export const dark = n2 as Theme
const n3 = t([[0, 48],[1, 49],[2, 50],[3, 51],[4, 52],[5, 53],[6, 55],[7, 56],[8, 57],[9, 58],[10, 59],[11, 11],[12, 49],[13, 50],[14, 51],[15, 52],[16, 48],[17, 211],[18, 11],[19, 59],[20, 11],[21, 59],[22, 212],[23, 51],[24, 52],[25, 51],[26, 51],[27, 57]]) as Theme

export const light_orange = n3 as Theme
const n4 = t([[0, 96],[1, 97],[2, 98],[3, 99],[4, 100],[5, 101],[6, 103],[7, 104],[8, 105],[9, 106],[10, 107],[11, 11],[12, 97],[13, 98],[14, 99],[15, 100],[16, 96],[17, 213],[18, 11],[19, 107],[20, 11],[21, 107],[22, 214],[23, 99],[24, 100],[25, 99],[26, 99],[27, 105]]) as Theme

export const light_yellow = n4 as Theme
const n5 = t([[0, 36],[1, 37],[2, 38],[3, 39],[4, 40],[5, 41],[6, 43],[7, 44],[8, 45],[9, 46],[10, 47],[11, 11],[12, 37],[13, 38],[14, 39],[15, 40],[16, 36],[17, 215],[18, 11],[19, 47],[20, 11],[21, 47],[22, 216],[23, 39],[24, 40],[25, 39],[26, 39],[27, 45]]) as Theme

export const light_green = n5 as Theme
const n6 = t([[0, 14],[1, 15],[2, 16],[3, 17],[4, 18],[5, 19],[6, 21],[7, 22],[8, 23],[9, 24],[10, 25],[11, 11],[12, 15],[13, 16],[14, 17],[15, 18],[16, 14],[17, 217],[18, 11],[19, 25],[20, 11],[21, 25],[22, 218],[23, 17],[24, 18],[25, 17],[26, 17],[27, 23]]) as Theme

export const light_blue = n6 as Theme
const n7 = t([[0, 72],[1, 73],[2, 74],[3, 75],[4, 76],[5, 77],[6, 79],[7, 80],[8, 81],[9, 82],[10, 83],[11, 11],[12, 73],[13, 74],[14, 75],[15, 76],[16, 72],[17, 219],[18, 11],[19, 83],[20, 11],[21, 83],[22, 220],[23, 75],[24, 76],[25, 75],[26, 75],[27, 81]]) as Theme

export const light_purple = n7 as Theme
const n8 = t([[0, 60],[1, 61],[2, 62],[3, 63],[4, 64],[5, 65],[6, 67],[7, 68],[8, 69],[9, 70],[10, 71],[11, 11],[12, 61],[13, 62],[14, 63],[15, 64],[16, 60],[17, 221],[18, 11],[19, 71],[20, 11],[21, 71],[22, 222],[23, 63],[24, 64],[25, 63],[26, 63],[27, 69]]) as Theme

export const light_pink = n8 as Theme
const n9 = t([[0, 84],[1, 85],[2, 86],[3, 87],[4, 88],[5, 89],[6, 91],[7, 92],[8, 93],[9, 94],[10, 95],[11, 11],[12, 85],[13, 86],[14, 87],[15, 88],[16, 84],[17, 223],[18, 11],[19, 95],[20, 11],[21, 95],[22, 224],[23, 87],[24, 88],[25, 87],[26, 87],[27, 93]]) as Theme

export const light_red = n9 as Theme
const n10 = t([[0, 154],[1, 155],[2, 156],[3, 157],[4, 158],[5, 159],[6, 161],[7, 56],[8, 162],[9, 163],[10, 164],[11, 0],[12, 155],[13, 156],[14, 157],[15, 158],[16, 154],[17, 225],[18, 0],[19, 164],[20, 0],[21, 164],[22, 226],[23, 158],[24, 159],[25, 157],[26, 158],[27, 162]]) as Theme

export const dark_orange = n10 as Theme
export const dark_orange_ListItem = n10 as Theme
const n11 = t([[0, 198],[1, 199],[2, 200],[3, 201],[4, 202],[5, 203],[6, 205],[7, 104],[8, 206],[9, 207],[10, 208],[11, 0],[12, 199],[13, 200],[14, 201],[15, 202],[16, 198],[17, 227],[18, 0],[19, 208],[20, 0],[21, 208],[22, 228],[23, 202],[24, 203],[25, 201],[26, 202],[27, 206]]) as Theme

export const dark_yellow = n11 as Theme
export const dark_yellow_ListItem = n11 as Theme
const n12 = t([[0, 143],[1, 144],[2, 145],[3, 146],[4, 147],[5, 148],[6, 150],[7, 44],[8, 151],[9, 152],[10, 153],[11, 0],[12, 144],[13, 145],[14, 146],[15, 147],[16, 143],[17, 229],[18, 0],[19, 153],[20, 0],[21, 153],[22, 230],[23, 147],[24, 148],[25, 146],[26, 147],[27, 151]]) as Theme

export const dark_green = n12 as Theme
export const dark_green_ListItem = n12 as Theme
const n13 = t([[0, 121],[1, 122],[2, 123],[3, 124],[4, 125],[5, 126],[6, 128],[7, 22],[8, 129],[9, 130],[10, 131],[11, 0],[12, 122],[13, 123],[14, 124],[15, 125],[16, 121],[17, 231],[18, 0],[19, 131],[20, 0],[21, 131],[22, 232],[23, 125],[24, 126],[25, 124],[26, 125],[27, 129]]) as Theme

export const dark_blue = n13 as Theme
export const dark_blue_ListItem = n13 as Theme
const n14 = t([[0, 176],[1, 177],[2, 178],[3, 179],[4, 180],[5, 181],[6, 183],[7, 80],[8, 184],[9, 185],[10, 186],[11, 0],[12, 177],[13, 178],[14, 179],[15, 180],[16, 176],[17, 233],[18, 0],[19, 186],[20, 0],[21, 186],[22, 234],[23, 180],[24, 181],[25, 179],[26, 180],[27, 184]]) as Theme

export const dark_purple = n14 as Theme
export const dark_purple_ListItem = n14 as Theme
const n15 = t([[0, 165],[1, 166],[2, 167],[3, 168],[4, 169],[5, 170],[6, 172],[7, 68],[8, 173],[9, 174],[10, 175],[11, 0],[12, 166],[13, 167],[14, 168],[15, 169],[16, 165],[17, 235],[18, 0],[19, 175],[20, 0],[21, 175],[22, 236],[23, 169],[24, 170],[25, 168],[26, 169],[27, 173]]) as Theme

export const dark_pink = n15 as Theme
export const dark_pink_ListItem = n15 as Theme
const n16 = t([[0, 187],[1, 188],[2, 189],[3, 190],[4, 191],[5, 192],[6, 194],[7, 92],[8, 195],[9, 196],[10, 197],[11, 0],[12, 188],[13, 189],[14, 190],[15, 191],[16, 187],[17, 237],[18, 0],[19, 197],[20, 0],[21, 197],[22, 238],[23, 191],[24, 192],[25, 190],[26, 191],[27, 195]]) as Theme

export const dark_red = n16 as Theme
export const dark_red_ListItem = n16 as Theme
const n17 = t([[12, 239]]) as Theme

export const light_SheetOverlay = n17 as Theme
export const light_DialogOverlay = n17 as Theme
export const light_ModalOverlay = n17 as Theme
export const light_orange_SheetOverlay = n17 as Theme
export const light_orange_DialogOverlay = n17 as Theme
export const light_orange_ModalOverlay = n17 as Theme
export const light_yellow_SheetOverlay = n17 as Theme
export const light_yellow_DialogOverlay = n17 as Theme
export const light_yellow_ModalOverlay = n17 as Theme
export const light_green_SheetOverlay = n17 as Theme
export const light_green_DialogOverlay = n17 as Theme
export const light_green_ModalOverlay = n17 as Theme
export const light_blue_SheetOverlay = n17 as Theme
export const light_blue_DialogOverlay = n17 as Theme
export const light_blue_ModalOverlay = n17 as Theme
export const light_purple_SheetOverlay = n17 as Theme
export const light_purple_DialogOverlay = n17 as Theme
export const light_purple_ModalOverlay = n17 as Theme
export const light_pink_SheetOverlay = n17 as Theme
export const light_pink_DialogOverlay = n17 as Theme
export const light_pink_ModalOverlay = n17 as Theme
export const light_red_SheetOverlay = n17 as Theme
export const light_red_DialogOverlay = n17 as Theme
export const light_red_ModalOverlay = n17 as Theme
export const light_alt1_SheetOverlay = n17 as Theme
export const light_alt1_DialogOverlay = n17 as Theme
export const light_alt1_ModalOverlay = n17 as Theme
export const light_alt2_SheetOverlay = n17 as Theme
export const light_alt2_DialogOverlay = n17 as Theme
export const light_alt2_ModalOverlay = n17 as Theme
export const light_active_SheetOverlay = n17 as Theme
export const light_active_DialogOverlay = n17 as Theme
export const light_active_ModalOverlay = n17 as Theme
export const light_orange_alt1_SheetOverlay = n17 as Theme
export const light_orange_alt1_DialogOverlay = n17 as Theme
export const light_orange_alt1_ModalOverlay = n17 as Theme
export const light_orange_alt2_SheetOverlay = n17 as Theme
export const light_orange_alt2_DialogOverlay = n17 as Theme
export const light_orange_alt2_ModalOverlay = n17 as Theme
export const light_orange_active_SheetOverlay = n17 as Theme
export const light_orange_active_DialogOverlay = n17 as Theme
export const light_orange_active_ModalOverlay = n17 as Theme
export const light_yellow_alt1_SheetOverlay = n17 as Theme
export const light_yellow_alt1_DialogOverlay = n17 as Theme
export const light_yellow_alt1_ModalOverlay = n17 as Theme
export const light_yellow_alt2_SheetOverlay = n17 as Theme
export const light_yellow_alt2_DialogOverlay = n17 as Theme
export const light_yellow_alt2_ModalOverlay = n17 as Theme
export const light_yellow_active_SheetOverlay = n17 as Theme
export const light_yellow_active_DialogOverlay = n17 as Theme
export const light_yellow_active_ModalOverlay = n17 as Theme
export const light_green_alt1_SheetOverlay = n17 as Theme
export const light_green_alt1_DialogOverlay = n17 as Theme
export const light_green_alt1_ModalOverlay = n17 as Theme
export const light_green_alt2_SheetOverlay = n17 as Theme
export const light_green_alt2_DialogOverlay = n17 as Theme
export const light_green_alt2_ModalOverlay = n17 as Theme
export const light_green_active_SheetOverlay = n17 as Theme
export const light_green_active_DialogOverlay = n17 as Theme
export const light_green_active_ModalOverlay = n17 as Theme
export const light_blue_alt1_SheetOverlay = n17 as Theme
export const light_blue_alt1_DialogOverlay = n17 as Theme
export const light_blue_alt1_ModalOverlay = n17 as Theme
export const light_blue_alt2_SheetOverlay = n17 as Theme
export const light_blue_alt2_DialogOverlay = n17 as Theme
export const light_blue_alt2_ModalOverlay = n17 as Theme
export const light_blue_active_SheetOverlay = n17 as Theme
export const light_blue_active_DialogOverlay = n17 as Theme
export const light_blue_active_ModalOverlay = n17 as Theme
export const light_purple_alt1_SheetOverlay = n17 as Theme
export const light_purple_alt1_DialogOverlay = n17 as Theme
export const light_purple_alt1_ModalOverlay = n17 as Theme
export const light_purple_alt2_SheetOverlay = n17 as Theme
export const light_purple_alt2_DialogOverlay = n17 as Theme
export const light_purple_alt2_ModalOverlay = n17 as Theme
export const light_purple_active_SheetOverlay = n17 as Theme
export const light_purple_active_DialogOverlay = n17 as Theme
export const light_purple_active_ModalOverlay = n17 as Theme
export const light_pink_alt1_SheetOverlay = n17 as Theme
export const light_pink_alt1_DialogOverlay = n17 as Theme
export const light_pink_alt1_ModalOverlay = n17 as Theme
export const light_pink_alt2_SheetOverlay = n17 as Theme
export const light_pink_alt2_DialogOverlay = n17 as Theme
export const light_pink_alt2_ModalOverlay = n17 as Theme
export const light_pink_active_SheetOverlay = n17 as Theme
export const light_pink_active_DialogOverlay = n17 as Theme
export const light_pink_active_ModalOverlay = n17 as Theme
export const light_red_alt1_SheetOverlay = n17 as Theme
export const light_red_alt1_DialogOverlay = n17 as Theme
export const light_red_alt1_ModalOverlay = n17 as Theme
export const light_red_alt2_SheetOverlay = n17 as Theme
export const light_red_alt2_DialogOverlay = n17 as Theme
export const light_red_alt2_ModalOverlay = n17 as Theme
export const light_red_active_SheetOverlay = n17 as Theme
export const light_red_active_DialogOverlay = n17 as Theme
export const light_red_active_ModalOverlay = n17 as Theme
const n18 = t([[12, 240]]) as Theme

export const dark_SheetOverlay = n18 as Theme
export const dark_DialogOverlay = n18 as Theme
export const dark_ModalOverlay = n18 as Theme
export const dark_orange_SheetOverlay = n18 as Theme
export const dark_orange_DialogOverlay = n18 as Theme
export const dark_orange_ModalOverlay = n18 as Theme
export const dark_yellow_SheetOverlay = n18 as Theme
export const dark_yellow_DialogOverlay = n18 as Theme
export const dark_yellow_ModalOverlay = n18 as Theme
export const dark_green_SheetOverlay = n18 as Theme
export const dark_green_DialogOverlay = n18 as Theme
export const dark_green_ModalOverlay = n18 as Theme
export const dark_blue_SheetOverlay = n18 as Theme
export const dark_blue_DialogOverlay = n18 as Theme
export const dark_blue_ModalOverlay = n18 as Theme
export const dark_purple_SheetOverlay = n18 as Theme
export const dark_purple_DialogOverlay = n18 as Theme
export const dark_purple_ModalOverlay = n18 as Theme
export const dark_pink_SheetOverlay = n18 as Theme
export const dark_pink_DialogOverlay = n18 as Theme
export const dark_pink_ModalOverlay = n18 as Theme
export const dark_red_SheetOverlay = n18 as Theme
export const dark_red_DialogOverlay = n18 as Theme
export const dark_red_ModalOverlay = n18 as Theme
export const dark_alt1_SheetOverlay = n18 as Theme
export const dark_alt1_DialogOverlay = n18 as Theme
export const dark_alt1_ModalOverlay = n18 as Theme
export const dark_alt2_SheetOverlay = n18 as Theme
export const dark_alt2_DialogOverlay = n18 as Theme
export const dark_alt2_ModalOverlay = n18 as Theme
export const dark_active_SheetOverlay = n18 as Theme
export const dark_active_DialogOverlay = n18 as Theme
export const dark_active_ModalOverlay = n18 as Theme
export const dark_orange_alt1_SheetOverlay = n18 as Theme
export const dark_orange_alt1_DialogOverlay = n18 as Theme
export const dark_orange_alt1_ModalOverlay = n18 as Theme
export const dark_orange_alt2_SheetOverlay = n18 as Theme
export const dark_orange_alt2_DialogOverlay = n18 as Theme
export const dark_orange_alt2_ModalOverlay = n18 as Theme
export const dark_orange_active_SheetOverlay = n18 as Theme
export const dark_orange_active_DialogOverlay = n18 as Theme
export const dark_orange_active_ModalOverlay = n18 as Theme
export const dark_yellow_alt1_SheetOverlay = n18 as Theme
export const dark_yellow_alt1_DialogOverlay = n18 as Theme
export const dark_yellow_alt1_ModalOverlay = n18 as Theme
export const dark_yellow_alt2_SheetOverlay = n18 as Theme
export const dark_yellow_alt2_DialogOverlay = n18 as Theme
export const dark_yellow_alt2_ModalOverlay = n18 as Theme
export const dark_yellow_active_SheetOverlay = n18 as Theme
export const dark_yellow_active_DialogOverlay = n18 as Theme
export const dark_yellow_active_ModalOverlay = n18 as Theme
export const dark_green_alt1_SheetOverlay = n18 as Theme
export const dark_green_alt1_DialogOverlay = n18 as Theme
export const dark_green_alt1_ModalOverlay = n18 as Theme
export const dark_green_alt2_SheetOverlay = n18 as Theme
export const dark_green_alt2_DialogOverlay = n18 as Theme
export const dark_green_alt2_ModalOverlay = n18 as Theme
export const dark_green_active_SheetOverlay = n18 as Theme
export const dark_green_active_DialogOverlay = n18 as Theme
export const dark_green_active_ModalOverlay = n18 as Theme
export const dark_blue_alt1_SheetOverlay = n18 as Theme
export const dark_blue_alt1_DialogOverlay = n18 as Theme
export const dark_blue_alt1_ModalOverlay = n18 as Theme
export const dark_blue_alt2_SheetOverlay = n18 as Theme
export const dark_blue_alt2_DialogOverlay = n18 as Theme
export const dark_blue_alt2_ModalOverlay = n18 as Theme
export const dark_blue_active_SheetOverlay = n18 as Theme
export const dark_blue_active_DialogOverlay = n18 as Theme
export const dark_blue_active_ModalOverlay = n18 as Theme
export const dark_purple_alt1_SheetOverlay = n18 as Theme
export const dark_purple_alt1_DialogOverlay = n18 as Theme
export const dark_purple_alt1_ModalOverlay = n18 as Theme
export const dark_purple_alt2_SheetOverlay = n18 as Theme
export const dark_purple_alt2_DialogOverlay = n18 as Theme
export const dark_purple_alt2_ModalOverlay = n18 as Theme
export const dark_purple_active_SheetOverlay = n18 as Theme
export const dark_purple_active_DialogOverlay = n18 as Theme
export const dark_purple_active_ModalOverlay = n18 as Theme
export const dark_pink_alt1_SheetOverlay = n18 as Theme
export const dark_pink_alt1_DialogOverlay = n18 as Theme
export const dark_pink_alt1_ModalOverlay = n18 as Theme
export const dark_pink_alt2_SheetOverlay = n18 as Theme
export const dark_pink_alt2_DialogOverlay = n18 as Theme
export const dark_pink_alt2_ModalOverlay = n18 as Theme
export const dark_pink_active_SheetOverlay = n18 as Theme
export const dark_pink_active_DialogOverlay = n18 as Theme
export const dark_pink_active_ModalOverlay = n18 as Theme
export const dark_red_alt1_SheetOverlay = n18 as Theme
export const dark_red_alt1_DialogOverlay = n18 as Theme
export const dark_red_alt1_ModalOverlay = n18 as Theme
export const dark_red_alt2_SheetOverlay = n18 as Theme
export const dark_red_alt2_DialogOverlay = n18 as Theme
export const dark_red_alt2_ModalOverlay = n18 as Theme
export const dark_red_active_SheetOverlay = n18 as Theme
export const dark_red_active_DialogOverlay = n18 as Theme
export const dark_red_active_ModalOverlay = n18 as Theme
const n19 = t([[0, 1],[1, 2],[2, 3],[3, 4],[4, 5],[5, 6],[6, 7],[7, 8],[8, 9],[9, 10],[10, 11],[11, 11],[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7]]) as Theme

export const light_alt1 = n19 as Theme
const n20 = t([[0, 2],[1, 3],[2, 4],[3, 5],[4, 6],[5, 7],[6, 8],[7, 9],[8, 10],[9, 11],[10, 11],[11, 11],[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]]) as Theme

export const light_alt2 = n20 as Theme
const n21 = t([[0, 3],[1, 4],[2, 5],[3, 6],[4, 7],[5, 8],[6, 9],[7, 10],[8, 11],[9, 13],[10, 13],[11, 13],[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 7],[24, 8],[25, 6],[26, 7],[27, 5]]) as Theme

export const light_active = n21 as Theme
const n22 = t([[0, 111],[1, 112],[2, 113],[3, 114],[4, 115],[5, 116],[6, 117],[7, 118],[8, 119],[9, 120],[10, 0],[11, 0],[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117]]) as Theme

export const dark_alt1 = n22 as Theme
export const dark_alt1_ListItem = n22 as Theme
const n23 = t([[0, 112],[1, 113],[2, 114],[3, 115],[4, 116],[5, 117],[6, 118],[7, 119],[8, 120],[9, 0],[10, 0],[11, 0],[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116]]) as Theme

export const dark_alt2 = n23 as Theme
export const dark_alt2_ListItem = n23 as Theme
const n24 = t([[0, 113],[1, 114],[2, 115],[3, 116],[4, 117],[5, 118],[6, 119],[7, 120],[8, 0],[9, 12],[10, 12],[11, 12],[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 117],[24, 118],[25, 116],[26, 117],[27, 115]]) as Theme

export const dark_active = n24 as Theme
export const dark_active_ListItem = n24 as Theme
const n25 = t([[0, 49],[1, 50],[2, 51],[3, 52],[4, 53],[5, 55],[6, 56],[7, 57],[8, 58],[9, 59],[10, 11],[11, 11],[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 59],[19, 58],[20, 59],[21, 58],[22, 11],[23, 52],[24, 53],[25, 52],[26, 52],[27, 56]]) as Theme

export const light_orange_alt1 = n25 as Theme
const n26 = t([[0, 50],[1, 51],[2, 52],[3, 53],[4, 55],[5, 56],[6, 57],[7, 58],[8, 59],[9, 11],[10, 11],[11, 11],[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 58],[19, 57],[20, 58],[21, 57],[22, 59],[23, 53],[24, 55],[25, 53],[26, 53],[27, 55]]) as Theme

export const light_orange_alt2 = n26 as Theme
const n27 = t([[0, 51],[1, 52],[2, 53],[3, 55],[4, 56],[5, 57],[6, 58],[7, 59],[8, 11],[9, 212],[10, 212],[11, 212],[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[19, 56],[20, 57],[21, 56],[22, 58],[23, 55],[24, 56],[25, 55],[26, 55],[27, 53]]) as Theme

export const light_orange_active = n27 as Theme
const n28 = t([[0, 97],[1, 98],[2, 99],[3, 100],[4, 101],[5, 103],[6, 104],[7, 105],[8, 106],[9, 107],[10, 11],[11, 11],[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 107],[19, 106],[20, 107],[21, 106],[22, 11],[23, 100],[24, 101],[25, 100],[26, 100],[27, 104]]) as Theme

export const light_yellow_alt1 = n28 as Theme
const n29 = t([[0, 98],[1, 99],[2, 100],[3, 101],[4, 103],[5, 104],[6, 105],[7, 106],[8, 107],[9, 11],[10, 11],[11, 11],[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 106],[19, 105],[20, 106],[21, 105],[22, 107],[23, 101],[24, 103],[25, 101],[26, 101],[27, 103]]) as Theme

export const light_yellow_alt2 = n29 as Theme
const n30 = t([[0, 99],[1, 100],[2, 101],[3, 103],[4, 104],[5, 105],[6, 106],[7, 107],[8, 11],[9, 214],[10, 214],[11, 214],[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[19, 104],[20, 105],[21, 104],[22, 106],[23, 103],[24, 104],[25, 103],[26, 103],[27, 101]]) as Theme

export const light_yellow_active = n30 as Theme
const n31 = t([[0, 37],[1, 38],[2, 39],[3, 40],[4, 41],[5, 43],[6, 44],[7, 45],[8, 46],[9, 47],[10, 11],[11, 11],[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 47],[19, 46],[20, 47],[21, 46],[22, 11],[23, 40],[24, 41],[25, 40],[26, 40],[27, 44]]) as Theme

export const light_green_alt1 = n31 as Theme
const n32 = t([[0, 38],[1, 39],[2, 40],[3, 41],[4, 43],[5, 44],[6, 45],[7, 46],[8, 47],[9, 11],[10, 11],[11, 11],[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 46],[19, 45],[20, 46],[21, 45],[22, 47],[23, 41],[24, 43],[25, 41],[26, 41],[27, 43]]) as Theme

export const light_green_alt2 = n32 as Theme
const n33 = t([[0, 39],[1, 40],[2, 41],[3, 43],[4, 44],[5, 45],[6, 46],[7, 47],[8, 11],[9, 216],[10, 216],[11, 216],[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[19, 44],[20, 45],[21, 44],[22, 46],[23, 43],[24, 44],[25, 43],[26, 43],[27, 41]]) as Theme

export const light_green_active = n33 as Theme
const n34 = t([[0, 15],[1, 16],[2, 17],[3, 18],[4, 19],[5, 21],[6, 22],[7, 23],[8, 24],[9, 25],[10, 11],[11, 11],[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 25],[19, 24],[20, 25],[21, 24],[22, 11],[23, 18],[24, 19],[25, 18],[26, 18],[27, 22]]) as Theme

export const light_blue_alt1 = n34 as Theme
const n35 = t([[0, 16],[1, 17],[2, 18],[3, 19],[4, 21],[5, 22],[6, 23],[7, 24],[8, 25],[9, 11],[10, 11],[11, 11],[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 24],[19, 23],[20, 24],[21, 23],[22, 25],[23, 19],[24, 21],[25, 19],[26, 19],[27, 21]]) as Theme

export const light_blue_alt2 = n35 as Theme
const n36 = t([[0, 17],[1, 18],[2, 19],[3, 21],[4, 22],[5, 23],[6, 24],[7, 25],[8, 11],[9, 218],[10, 218],[11, 218],[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[19, 22],[20, 23],[21, 22],[22, 24],[23, 21],[24, 22],[25, 21],[26, 21],[27, 19]]) as Theme

export const light_blue_active = n36 as Theme
const n37 = t([[0, 73],[1, 74],[2, 75],[3, 76],[4, 77],[5, 79],[6, 80],[7, 81],[8, 82],[9, 83],[10, 11],[11, 11],[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 83],[19, 82],[20, 83],[21, 82],[22, 11],[23, 76],[24, 77],[25, 76],[26, 76],[27, 80]]) as Theme

export const light_purple_alt1 = n37 as Theme
const n38 = t([[0, 74],[1, 75],[2, 76],[3, 77],[4, 79],[5, 80],[6, 81],[7, 82],[8, 83],[9, 11],[10, 11],[11, 11],[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 82],[19, 81],[20, 82],[21, 81],[22, 83],[23, 77],[24, 79],[25, 77],[26, 77],[27, 79]]) as Theme

export const light_purple_alt2 = n38 as Theme
const n39 = t([[0, 75],[1, 76],[2, 77],[3, 79],[4, 80],[5, 81],[6, 82],[7, 83],[8, 11],[9, 220],[10, 220],[11, 220],[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[19, 80],[20, 81],[21, 80],[22, 82],[23, 79],[24, 80],[25, 79],[26, 79],[27, 77]]) as Theme

export const light_purple_active = n39 as Theme
const n40 = t([[0, 61],[1, 62],[2, 63],[3, 64],[4, 65],[5, 67],[6, 68],[7, 69],[8, 70],[9, 71],[10, 11],[11, 11],[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 71],[19, 70],[20, 71],[21, 70],[22, 11],[23, 64],[24, 65],[25, 64],[26, 64],[27, 68]]) as Theme

export const light_pink_alt1 = n40 as Theme
const n41 = t([[0, 62],[1, 63],[2, 64],[3, 65],[4, 67],[5, 68],[6, 69],[7, 70],[8, 71],[9, 11],[10, 11],[11, 11],[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 70],[19, 69],[20, 70],[21, 69],[22, 71],[23, 65],[24, 67],[25, 65],[26, 65],[27, 67]]) as Theme

export const light_pink_alt2 = n41 as Theme
const n42 = t([[0, 63],[1, 64],[2, 65],[3, 67],[4, 68],[5, 69],[6, 70],[7, 71],[8, 11],[9, 222],[10, 222],[11, 222],[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[19, 68],[20, 69],[21, 68],[22, 70],[23, 67],[24, 68],[25, 67],[26, 67],[27, 65]]) as Theme

export const light_pink_active = n42 as Theme
const n43 = t([[0, 85],[1, 86],[2, 87],[3, 88],[4, 89],[5, 91],[6, 92],[7, 93],[8, 94],[9, 95],[10, 11],[11, 11],[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 95],[19, 94],[20, 95],[21, 94],[22, 11],[23, 88],[24, 89],[25, 88],[26, 88],[27, 92]]) as Theme

export const light_red_alt1 = n43 as Theme
const n44 = t([[0, 86],[1, 87],[2, 88],[3, 89],[4, 91],[5, 92],[6, 93],[7, 94],[8, 95],[9, 11],[10, 11],[11, 11],[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 94],[19, 93],[20, 94],[21, 93],[22, 95],[23, 89],[24, 91],[25, 89],[26, 89],[27, 91]]) as Theme

export const light_red_alt2 = n44 as Theme
const n45 = t([[0, 87],[1, 88],[2, 89],[3, 91],[4, 92],[5, 93],[6, 94],[7, 95],[8, 11],[9, 224],[10, 224],[11, 224],[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[19, 92],[20, 93],[21, 92],[22, 94],[23, 91],[24, 92],[25, 91],[26, 91],[27, 89]]) as Theme

export const light_red_active = n45 as Theme
const n46 = t([[0, 155],[1, 156],[2, 157],[3, 158],[4, 159],[5, 161],[6, 56],[7, 162],[8, 163],[9, 164],[10, 0],[11, 0],[12, 156],[13, 157],[14, 158],[15, 159],[16, 155],[17, 154],[18, 164],[19, 163],[20, 164],[21, 163],[22, 0],[23, 159],[24, 161],[25, 158],[26, 159],[27, 56]]) as Theme

export const dark_orange_alt1 = n46 as Theme
export const dark_orange_alt1_ListItem = n46 as Theme
const n47 = t([[0, 156],[1, 157],[2, 158],[3, 159],[4, 161],[5, 56],[6, 162],[7, 163],[8, 164],[9, 0],[10, 0],[11, 0],[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 163],[19, 162],[20, 163],[21, 162],[22, 164],[23, 161],[24, 56],[25, 159],[26, 161],[27, 161]]) as Theme

export const dark_orange_alt2 = n47 as Theme
export const dark_orange_alt2_ListItem = n47 as Theme
const n48 = t([[0, 157],[1, 158],[2, 159],[3, 161],[4, 56],[5, 162],[6, 163],[7, 164],[8, 0],[9, 226],[10, 226],[11, 226],[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[19, 56],[20, 162],[21, 56],[22, 163],[23, 56],[24, 162],[25, 161],[26, 56],[27, 159]]) as Theme

export const dark_orange_active = n48 as Theme
export const dark_orange_active_ListItem = n48 as Theme
const n49 = t([[0, 199],[1, 200],[2, 201],[3, 202],[4, 203],[5, 205],[6, 104],[7, 206],[8, 207],[9, 208],[10, 0],[11, 0],[12, 200],[13, 201],[14, 202],[15, 203],[16, 199],[17, 198],[18, 208],[19, 207],[20, 208],[21, 207],[22, 0],[23, 203],[24, 205],[25, 202],[26, 203],[27, 104]]) as Theme

export const dark_yellow_alt1 = n49 as Theme
export const dark_yellow_alt1_ListItem = n49 as Theme
const n50 = t([[0, 200],[1, 201],[2, 202],[3, 203],[4, 205],[5, 104],[6, 206],[7, 207],[8, 208],[9, 0],[10, 0],[11, 0],[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 207],[19, 206],[20, 207],[21, 206],[22, 208],[23, 205],[24, 104],[25, 203],[26, 205],[27, 205]]) as Theme

export const dark_yellow_alt2 = n50 as Theme
export const dark_yellow_alt2_ListItem = n50 as Theme
const n51 = t([[0, 201],[1, 202],[2, 203],[3, 205],[4, 104],[5, 206],[6, 207],[7, 208],[8, 0],[9, 228],[10, 228],[11, 228],[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[19, 104],[20, 206],[21, 104],[22, 207],[23, 104],[24, 206],[25, 205],[26, 104],[27, 203]]) as Theme

export const dark_yellow_active = n51 as Theme
export const dark_yellow_active_ListItem = n51 as Theme
const n52 = t([[0, 144],[1, 145],[2, 146],[3, 147],[4, 148],[5, 150],[6, 44],[7, 151],[8, 152],[9, 153],[10, 0],[11, 0],[12, 145],[13, 146],[14, 147],[15, 148],[16, 144],[17, 143],[18, 153],[19, 152],[20, 153],[21, 152],[22, 0],[23, 148],[24, 150],[25, 147],[26, 148],[27, 44]]) as Theme

export const dark_green_alt1 = n52 as Theme
export const dark_green_alt1_ListItem = n52 as Theme
const n53 = t([[0, 145],[1, 146],[2, 147],[3, 148],[4, 150],[5, 44],[6, 151],[7, 152],[8, 153],[9, 0],[10, 0],[11, 0],[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 152],[19, 151],[20, 152],[21, 151],[22, 153],[23, 150],[24, 44],[25, 148],[26, 150],[27, 150]]) as Theme

export const dark_green_alt2 = n53 as Theme
export const dark_green_alt2_ListItem = n53 as Theme
const n54 = t([[0, 146],[1, 147],[2, 148],[3, 150],[4, 44],[5, 151],[6, 152],[7, 153],[8, 0],[9, 230],[10, 230],[11, 230],[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[19, 44],[20, 151],[21, 44],[22, 152],[23, 44],[24, 151],[25, 150],[26, 44],[27, 148]]) as Theme

export const dark_green_active = n54 as Theme
export const dark_green_active_ListItem = n54 as Theme
const n55 = t([[0, 122],[1, 123],[2, 124],[3, 125],[4, 126],[5, 128],[6, 22],[7, 129],[8, 130],[9, 131],[10, 0],[11, 0],[12, 123],[13, 124],[14, 125],[15, 126],[16, 122],[17, 121],[18, 131],[19, 130],[20, 131],[21, 130],[22, 0],[23, 126],[24, 128],[25, 125],[26, 126],[27, 22]]) as Theme

export const dark_blue_alt1 = n55 as Theme
export const dark_blue_alt1_ListItem = n55 as Theme
const n56 = t([[0, 123],[1, 124],[2, 125],[3, 126],[4, 128],[5, 22],[6, 129],[7, 130],[8, 131],[9, 0],[10, 0],[11, 0],[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 130],[19, 129],[20, 130],[21, 129],[22, 131],[23, 128],[24, 22],[25, 126],[26, 128],[27, 128]]) as Theme

export const dark_blue_alt2 = n56 as Theme
export const dark_blue_alt2_ListItem = n56 as Theme
const n57 = t([[0, 124],[1, 125],[2, 126],[3, 128],[4, 22],[5, 129],[6, 130],[7, 131],[8, 0],[9, 232],[10, 232],[11, 232],[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[19, 22],[20, 129],[21, 22],[22, 130],[23, 22],[24, 129],[25, 128],[26, 22],[27, 126]]) as Theme

export const dark_blue_active = n57 as Theme
export const dark_blue_active_ListItem = n57 as Theme
const n58 = t([[0, 177],[1, 178],[2, 179],[3, 180],[4, 181],[5, 183],[6, 80],[7, 184],[8, 185],[9, 186],[10, 0],[11, 0],[12, 178],[13, 179],[14, 180],[15, 181],[16, 177],[17, 176],[18, 186],[19, 185],[20, 186],[21, 185],[22, 0],[23, 181],[24, 183],[25, 180],[26, 181],[27, 80]]) as Theme

export const dark_purple_alt1 = n58 as Theme
export const dark_purple_alt1_ListItem = n58 as Theme
const n59 = t([[0, 178],[1, 179],[2, 180],[3, 181],[4, 183],[5, 80],[6, 184],[7, 185],[8, 186],[9, 0],[10, 0],[11, 0],[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 185],[19, 184],[20, 185],[21, 184],[22, 186],[23, 183],[24, 80],[25, 181],[26, 183],[27, 183]]) as Theme

export const dark_purple_alt2 = n59 as Theme
export const dark_purple_alt2_ListItem = n59 as Theme
const n60 = t([[0, 179],[1, 180],[2, 181],[3, 183],[4, 80],[5, 184],[6, 185],[7, 186],[8, 0],[9, 234],[10, 234],[11, 234],[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[19, 80],[20, 184],[21, 80],[22, 185],[23, 80],[24, 184],[25, 183],[26, 80],[27, 181]]) as Theme

export const dark_purple_active = n60 as Theme
export const dark_purple_active_ListItem = n60 as Theme
const n61 = t([[0, 166],[1, 167],[2, 168],[3, 169],[4, 170],[5, 172],[6, 68],[7, 173],[8, 174],[9, 175],[10, 0],[11, 0],[12, 167],[13, 168],[14, 169],[15, 170],[16, 166],[17, 165],[18, 175],[19, 174],[20, 175],[21, 174],[22, 0],[23, 170],[24, 172],[25, 169],[26, 170],[27, 68]]) as Theme

export const dark_pink_alt1 = n61 as Theme
export const dark_pink_alt1_ListItem = n61 as Theme
const n62 = t([[0, 167],[1, 168],[2, 169],[3, 170],[4, 172],[5, 68],[6, 173],[7, 174],[8, 175],[9, 0],[10, 0],[11, 0],[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 174],[19, 173],[20, 174],[21, 173],[22, 175],[23, 172],[24, 68],[25, 170],[26, 172],[27, 172]]) as Theme

export const dark_pink_alt2 = n62 as Theme
export const dark_pink_alt2_ListItem = n62 as Theme
const n63 = t([[0, 168],[1, 169],[2, 170],[3, 172],[4, 68],[5, 173],[6, 174],[7, 175],[8, 0],[9, 236],[10, 236],[11, 236],[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[19, 68],[20, 173],[21, 68],[22, 174],[23, 68],[24, 173],[25, 172],[26, 68],[27, 170]]) as Theme

export const dark_pink_active = n63 as Theme
export const dark_pink_active_ListItem = n63 as Theme
const n64 = t([[0, 188],[1, 189],[2, 190],[3, 191],[4, 192],[5, 194],[6, 92],[7, 195],[8, 196],[9, 197],[10, 0],[11, 0],[12, 189],[13, 190],[14, 191],[15, 192],[16, 188],[17, 187],[18, 197],[19, 196],[20, 197],[21, 196],[22, 0],[23, 192],[24, 194],[25, 191],[26, 192],[27, 92]]) as Theme

export const dark_red_alt1 = n64 as Theme
export const dark_red_alt1_ListItem = n64 as Theme
const n65 = t([[0, 189],[1, 190],[2, 191],[3, 192],[4, 194],[5, 92],[6, 195],[7, 196],[8, 197],[9, 0],[10, 0],[11, 0],[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 196],[19, 195],[20, 196],[21, 195],[22, 197],[23, 194],[24, 92],[25, 192],[26, 194],[27, 194]]) as Theme

export const dark_red_alt2 = n65 as Theme
export const dark_red_alt2_ListItem = n65 as Theme
const n66 = t([[0, 190],[1, 191],[2, 192],[3, 194],[4, 92],[5, 195],[6, 196],[7, 197],[8, 0],[9, 238],[10, 238],[11, 238],[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[19, 92],[20, 195],[21, 92],[22, 196],[23, 92],[24, 195],[25, 194],[26, 92],[27, 192]]) as Theme

export const dark_red_active = n66 as Theme
export const dark_red_active_ListItem = n66 as Theme
const n67 = t([[12, 0],[13, 1],[14, 2],[15, 3],[16, 0],[17, 0],[18, 11],[19, 10],[20, 11],[21, 10],[22, 11],[23, 3],[24, 4],[25, 2],[26, 3],[27, 9]]) as Theme

export const light_ListItem = n67 as Theme
const n68 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 11],[19, 10],[20, 11],[21, 10],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7]]) as Theme

export const light_Card = n68 as Theme
export const light_DrawerFrame = n68 as Theme
export const light_Progress = n68 as Theme
export const light_TooltipArrow = n68 as Theme
const n69 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 11],[19, 10],[20, 11],[21, 10],[22, 10],[23, 241],[24, 241],[25, 5],[26, 6],[27, 6]]) as Theme

export const light_Button = n69 as Theme
const n70 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 6],[24, 7],[25, 5],[26, 6],[27, 8]]) as Theme

export const light_Checkbox = n70 as Theme
export const light_RadioGroupItem = n70 as Theme
export const light_Input = n70 as Theme
export const light_TextArea = n70 as Theme
const n71 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 11],[19, 10],[20, 11],[21, 10],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]]) as Theme

export const light_Switch = n71 as Theme
export const light_TooltipContent = n71 as Theme
export const light_SliderTrack = n71 as Theme
const n72 = t([[12, 11],[13, 11],[14, 10],[15, 9],[16, 11],[17, 11],[18, 0],[19, 1],[20, 0],[21, 1],[22, 0],[23, 9],[24, 8],[25, 10],[26, 9],[27, 1]]) as Theme

export const light_SwitchThumb = n72 as Theme
const n73 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 0],[19, 1],[20, 0],[21, 1],[22, 1],[23, 5],[24, 4],[25, 6],[26, 5],[27, 5]]) as Theme

export const light_SliderTrackActive = n73 as Theme
const n74 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 13],[18, 0],[19, 1],[20, 0],[21, 1],[22, 12],[23, 7],[24, 6],[25, 8],[26, 7],[27, 3]]) as Theme

export const light_SliderThumb = n74 as Theme
export const light_Tooltip = n74 as Theme
export const light_ProgressIndicator = n74 as Theme
const n75 = t([[0, 110],[1, 111],[2, 112],[3, 113],[4, 114],[5, 115],[6, 116],[7, 117],[8, 118],[9, 119],[10, 120],[11, 0],[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 114],[24, 115],[25, 113],[26, 114],[27, 118]]) as Theme

export const dark_ListItem = n75 as Theme
const n76 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 0],[19, 120],[20, 0],[21, 120],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117]]) as Theme

export const dark_Card = n76 as Theme
export const dark_DrawerFrame = n76 as Theme
export const dark_Progress = n76 as Theme
export const dark_TooltipArrow = n76 as Theme
const n77 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 0],[19, 120],[20, 0],[21, 120],[22, 120],[23, 241],[24, 241],[25, 115],[26, 116],[27, 116]]) as Theme

export const dark_Button = n77 as Theme
const n78 = t([[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 116],[24, 117],[25, 115],[26, 116],[27, 118]]) as Theme

export const dark_Checkbox = n78 as Theme
export const dark_RadioGroupItem = n78 as Theme
export const dark_Input = n78 as Theme
export const dark_TextArea = n78 as Theme
const n79 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 0],[19, 120],[20, 0],[21, 120],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116]]) as Theme

export const dark_Switch = n79 as Theme
export const dark_TooltipContent = n79 as Theme
export const dark_SliderTrack = n79 as Theme
const n80 = t([[12, 0],[13, 0],[14, 120],[15, 119],[16, 0],[17, 0],[18, 110],[19, 111],[20, 110],[21, 111],[22, 110],[23, 119],[24, 118],[25, 120],[26, 119],[27, 111]]) as Theme

export const dark_SwitchThumb = n80 as Theme
const n81 = t([[12, 118],[13, 117],[14, 116],[15, 115],[16, 119],[17, 120],[18, 110],[19, 111],[20, 110],[21, 111],[22, 111],[23, 115],[24, 114],[25, 116],[26, 115],[27, 115]]) as Theme

export const dark_SliderTrackActive = n81 as Theme
const n82 = t([[12, 120],[13, 119],[14, 118],[15, 117],[16, 0],[17, 12],[18, 110],[19, 111],[20, 110],[21, 111],[22, 13],[23, 117],[24, 116],[25, 118],[26, 117],[27, 113]]) as Theme

export const dark_SliderThumb = n82 as Theme
export const dark_Tooltip = n82 as Theme
export const dark_ProgressIndicator = n82 as Theme
const n83 = t([[12, 48],[13, 49],[14, 50],[15, 51],[16, 48],[17, 48],[18, 11],[19, 59],[20, 11],[21, 59],[22, 11],[23, 50],[24, 51],[25, 50],[26, 50],[27, 58]]) as Theme

export const light_orange_ListItem = n83 as Theme
const n84 = t([[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 11],[19, 59],[20, 11],[21, 59],[22, 11],[23, 52],[24, 53],[25, 52],[26, 52],[27, 56]]) as Theme

export const light_orange_Card = n84 as Theme
export const light_orange_DrawerFrame = n84 as Theme
export const light_orange_Progress = n84 as Theme
export const light_orange_TooltipArrow = n84 as Theme
const n85 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 11],[19, 59],[20, 11],[21, 59],[22, 59],[23, 241],[24, 241],[25, 53],[26, 53],[27, 55]]) as Theme

export const light_orange_Button = n85 as Theme
const n86 = t([[12, 49],[13, 50],[14, 51],[15, 52],[16, 48],[17, 211],[18, 11],[19, 59],[20, 11],[21, 59],[22, 212],[23, 53],[24, 55],[25, 53],[26, 53],[27, 57]]) as Theme

export const light_orange_Checkbox = n86 as Theme
export const light_orange_RadioGroupItem = n86 as Theme
export const light_orange_Input = n86 as Theme
export const light_orange_TextArea = n86 as Theme
const n87 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 11],[19, 59],[20, 11],[21, 59],[22, 59],[23, 53],[24, 55],[25, 53],[26, 53],[27, 55]]) as Theme

export const light_orange_Switch = n87 as Theme
export const light_orange_TooltipContent = n87 as Theme
export const light_orange_SliderTrack = n87 as Theme
const n88 = t([[12, 11],[13, 11],[14, 59],[15, 58],[16, 11],[17, 11],[18, 48],[19, 49],[20, 48],[21, 49],[22, 48],[23, 59],[24, 58],[25, 59],[26, 59],[27, 49]]) as Theme

export const light_orange_SwitchThumb = n88 as Theme
const n89 = t([[12, 57],[13, 56],[14, 55],[15, 53],[16, 58],[17, 59],[18, 48],[19, 49],[20, 48],[21, 49],[22, 49],[23, 55],[24, 53],[25, 55],[26, 55],[27, 53]]) as Theme

export const light_orange_SliderTrackActive = n89 as Theme
const n90 = t([[12, 59],[13, 58],[14, 57],[15, 56],[16, 11],[17, 212],[18, 48],[19, 49],[20, 48],[21, 49],[22, 211],[23, 57],[24, 56],[25, 57],[26, 57],[27, 51]]) as Theme

export const light_orange_SliderThumb = n90 as Theme
export const light_orange_Tooltip = n90 as Theme
export const light_orange_ProgressIndicator = n90 as Theme
const n91 = t([[12, 96],[13, 97],[14, 98],[15, 99],[16, 96],[17, 96],[18, 11],[19, 107],[20, 11],[21, 107],[22, 11],[23, 98],[24, 99],[25, 98],[26, 98],[27, 106]]) as Theme

export const light_yellow_ListItem = n91 as Theme
const n92 = t([[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 11],[19, 107],[20, 11],[21, 107],[22, 11],[23, 100],[24, 101],[25, 100],[26, 100],[27, 104]]) as Theme

export const light_yellow_Card = n92 as Theme
export const light_yellow_DrawerFrame = n92 as Theme
export const light_yellow_Progress = n92 as Theme
export const light_yellow_TooltipArrow = n92 as Theme
const n93 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 11],[19, 107],[20, 11],[21, 107],[22, 107],[23, 241],[24, 241],[25, 101],[26, 101],[27, 103]]) as Theme

export const light_yellow_Button = n93 as Theme
const n94 = t([[12, 97],[13, 98],[14, 99],[15, 100],[16, 96],[17, 213],[18, 11],[19, 107],[20, 11],[21, 107],[22, 214],[23, 101],[24, 103],[25, 101],[26, 101],[27, 105]]) as Theme

export const light_yellow_Checkbox = n94 as Theme
export const light_yellow_RadioGroupItem = n94 as Theme
export const light_yellow_Input = n94 as Theme
export const light_yellow_TextArea = n94 as Theme
const n95 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 11],[19, 107],[20, 11],[21, 107],[22, 107],[23, 101],[24, 103],[25, 101],[26, 101],[27, 103]]) as Theme

export const light_yellow_Switch = n95 as Theme
export const light_yellow_TooltipContent = n95 as Theme
export const light_yellow_SliderTrack = n95 as Theme
const n96 = t([[12, 11],[13, 11],[14, 107],[15, 106],[16, 11],[17, 11],[18, 96],[19, 97],[20, 96],[21, 97],[22, 96],[23, 107],[24, 106],[25, 107],[26, 107],[27, 97]]) as Theme

export const light_yellow_SwitchThumb = n96 as Theme
const n97 = t([[12, 105],[13, 104],[14, 103],[15, 101],[16, 106],[17, 107],[18, 96],[19, 97],[20, 96],[21, 97],[22, 97],[23, 103],[24, 101],[25, 103],[26, 103],[27, 101]]) as Theme

export const light_yellow_SliderTrackActive = n97 as Theme
const n98 = t([[12, 107],[13, 106],[14, 105],[15, 104],[16, 11],[17, 214],[18, 96],[19, 97],[20, 96],[21, 97],[22, 213],[23, 105],[24, 104],[25, 105],[26, 105],[27, 99]]) as Theme

export const light_yellow_SliderThumb = n98 as Theme
export const light_yellow_Tooltip = n98 as Theme
export const light_yellow_ProgressIndicator = n98 as Theme
const n99 = t([[12, 36],[13, 37],[14, 38],[15, 39],[16, 36],[17, 36],[18, 11],[19, 47],[20, 11],[21, 47],[22, 11],[23, 38],[24, 39],[25, 38],[26, 38],[27, 46]]) as Theme

export const light_green_ListItem = n99 as Theme
const n100 = t([[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 11],[19, 47],[20, 11],[21, 47],[22, 11],[23, 40],[24, 41],[25, 40],[26, 40],[27, 44]]) as Theme

export const light_green_Card = n100 as Theme
export const light_green_DrawerFrame = n100 as Theme
export const light_green_Progress = n100 as Theme
export const light_green_TooltipArrow = n100 as Theme
const n101 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 11],[19, 47],[20, 11],[21, 47],[22, 47],[23, 241],[24, 241],[25, 41],[26, 41],[27, 43]]) as Theme

export const light_green_Button = n101 as Theme
const n102 = t([[12, 37],[13, 38],[14, 39],[15, 40],[16, 36],[17, 215],[18, 11],[19, 47],[20, 11],[21, 47],[22, 216],[23, 41],[24, 43],[25, 41],[26, 41],[27, 45]]) as Theme

export const light_green_Checkbox = n102 as Theme
export const light_green_RadioGroupItem = n102 as Theme
export const light_green_Input = n102 as Theme
export const light_green_TextArea = n102 as Theme
const n103 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 11],[19, 47],[20, 11],[21, 47],[22, 47],[23, 41],[24, 43],[25, 41],[26, 41],[27, 43]]) as Theme

export const light_green_Switch = n103 as Theme
export const light_green_TooltipContent = n103 as Theme
export const light_green_SliderTrack = n103 as Theme
const n104 = t([[12, 11],[13, 11],[14, 47],[15, 46],[16, 11],[17, 11],[18, 36],[19, 37],[20, 36],[21, 37],[22, 36],[23, 47],[24, 46],[25, 47],[26, 47],[27, 37]]) as Theme

export const light_green_SwitchThumb = n104 as Theme
const n105 = t([[12, 45],[13, 44],[14, 43],[15, 41],[16, 46],[17, 47],[18, 36],[19, 37],[20, 36],[21, 37],[22, 37],[23, 43],[24, 41],[25, 43],[26, 43],[27, 41]]) as Theme

export const light_green_SliderTrackActive = n105 as Theme
const n106 = t([[12, 47],[13, 46],[14, 45],[15, 44],[16, 11],[17, 216],[18, 36],[19, 37],[20, 36],[21, 37],[22, 215],[23, 45],[24, 44],[25, 45],[26, 45],[27, 39]]) as Theme

export const light_green_SliderThumb = n106 as Theme
export const light_green_Tooltip = n106 as Theme
export const light_green_ProgressIndicator = n106 as Theme
const n107 = t([[12, 14],[13, 15],[14, 16],[15, 17],[16, 14],[17, 14],[18, 11],[19, 25],[20, 11],[21, 25],[22, 11],[23, 16],[24, 17],[25, 16],[26, 16],[27, 24]]) as Theme

export const light_blue_ListItem = n107 as Theme
const n108 = t([[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 11],[19, 25],[20, 11],[21, 25],[22, 11],[23, 18],[24, 19],[25, 18],[26, 18],[27, 22]]) as Theme

export const light_blue_Card = n108 as Theme
export const light_blue_DrawerFrame = n108 as Theme
export const light_blue_Progress = n108 as Theme
export const light_blue_TooltipArrow = n108 as Theme
const n109 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 11],[19, 25],[20, 11],[21, 25],[22, 25],[23, 241],[24, 241],[25, 19],[26, 19],[27, 21]]) as Theme

export const light_blue_Button = n109 as Theme
const n110 = t([[12, 15],[13, 16],[14, 17],[15, 18],[16, 14],[17, 217],[18, 11],[19, 25],[20, 11],[21, 25],[22, 218],[23, 19],[24, 21],[25, 19],[26, 19],[27, 23]]) as Theme

export const light_blue_Checkbox = n110 as Theme
export const light_blue_RadioGroupItem = n110 as Theme
export const light_blue_Input = n110 as Theme
export const light_blue_TextArea = n110 as Theme
const n111 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 11],[19, 25],[20, 11],[21, 25],[22, 25],[23, 19],[24, 21],[25, 19],[26, 19],[27, 21]]) as Theme

export const light_blue_Switch = n111 as Theme
export const light_blue_TooltipContent = n111 as Theme
export const light_blue_SliderTrack = n111 as Theme
const n112 = t([[12, 11],[13, 11],[14, 25],[15, 24],[16, 11],[17, 11],[18, 14],[19, 15],[20, 14],[21, 15],[22, 14],[23, 25],[24, 24],[25, 25],[26, 25],[27, 15]]) as Theme

export const light_blue_SwitchThumb = n112 as Theme
const n113 = t([[12, 23],[13, 22],[14, 21],[15, 19],[16, 24],[17, 25],[18, 14],[19, 15],[20, 14],[21, 15],[22, 15],[23, 21],[24, 19],[25, 21],[26, 21],[27, 19]]) as Theme

export const light_blue_SliderTrackActive = n113 as Theme
const n114 = t([[12, 25],[13, 24],[14, 23],[15, 22],[16, 11],[17, 218],[18, 14],[19, 15],[20, 14],[21, 15],[22, 217],[23, 23],[24, 22],[25, 23],[26, 23],[27, 17]]) as Theme

export const light_blue_SliderThumb = n114 as Theme
export const light_blue_Tooltip = n114 as Theme
export const light_blue_ProgressIndicator = n114 as Theme
const n115 = t([[12, 72],[13, 73],[14, 74],[15, 75],[16, 72],[17, 72],[18, 11],[19, 83],[20, 11],[21, 83],[22, 11],[23, 74],[24, 75],[25, 74],[26, 74],[27, 82]]) as Theme

export const light_purple_ListItem = n115 as Theme
const n116 = t([[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 11],[19, 83],[20, 11],[21, 83],[22, 11],[23, 76],[24, 77],[25, 76],[26, 76],[27, 80]]) as Theme

export const light_purple_Card = n116 as Theme
export const light_purple_DrawerFrame = n116 as Theme
export const light_purple_Progress = n116 as Theme
export const light_purple_TooltipArrow = n116 as Theme
const n117 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 11],[19, 83],[20, 11],[21, 83],[22, 83],[23, 241],[24, 241],[25, 77],[26, 77],[27, 79]]) as Theme

export const light_purple_Button = n117 as Theme
const n118 = t([[12, 73],[13, 74],[14, 75],[15, 76],[16, 72],[17, 219],[18, 11],[19, 83],[20, 11],[21, 83],[22, 220],[23, 77],[24, 79],[25, 77],[26, 77],[27, 81]]) as Theme

export const light_purple_Checkbox = n118 as Theme
export const light_purple_RadioGroupItem = n118 as Theme
export const light_purple_Input = n118 as Theme
export const light_purple_TextArea = n118 as Theme
const n119 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 11],[19, 83],[20, 11],[21, 83],[22, 83],[23, 77],[24, 79],[25, 77],[26, 77],[27, 79]]) as Theme

export const light_purple_Switch = n119 as Theme
export const light_purple_TooltipContent = n119 as Theme
export const light_purple_SliderTrack = n119 as Theme
const n120 = t([[12, 11],[13, 11],[14, 83],[15, 82],[16, 11],[17, 11],[18, 72],[19, 73],[20, 72],[21, 73],[22, 72],[23, 83],[24, 82],[25, 83],[26, 83],[27, 73]]) as Theme

export const light_purple_SwitchThumb = n120 as Theme
const n121 = t([[12, 81],[13, 80],[14, 79],[15, 77],[16, 82],[17, 83],[18, 72],[19, 73],[20, 72],[21, 73],[22, 73],[23, 79],[24, 77],[25, 79],[26, 79],[27, 77]]) as Theme

export const light_purple_SliderTrackActive = n121 as Theme
const n122 = t([[12, 83],[13, 82],[14, 81],[15, 80],[16, 11],[17, 220],[18, 72],[19, 73],[20, 72],[21, 73],[22, 219],[23, 81],[24, 80],[25, 81],[26, 81],[27, 75]]) as Theme

export const light_purple_SliderThumb = n122 as Theme
export const light_purple_Tooltip = n122 as Theme
export const light_purple_ProgressIndicator = n122 as Theme
const n123 = t([[12, 60],[13, 61],[14, 62],[15, 63],[16, 60],[17, 60],[18, 11],[19, 71],[20, 11],[21, 71],[22, 11],[23, 62],[24, 63],[25, 62],[26, 62],[27, 70]]) as Theme

export const light_pink_ListItem = n123 as Theme
const n124 = t([[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 11],[19, 71],[20, 11],[21, 71],[22, 11],[23, 64],[24, 65],[25, 64],[26, 64],[27, 68]]) as Theme

export const light_pink_Card = n124 as Theme
export const light_pink_DrawerFrame = n124 as Theme
export const light_pink_Progress = n124 as Theme
export const light_pink_TooltipArrow = n124 as Theme
const n125 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 11],[19, 71],[20, 11],[21, 71],[22, 71],[23, 241],[24, 241],[25, 65],[26, 65],[27, 67]]) as Theme

export const light_pink_Button = n125 as Theme
const n126 = t([[12, 61],[13, 62],[14, 63],[15, 64],[16, 60],[17, 221],[18, 11],[19, 71],[20, 11],[21, 71],[22, 222],[23, 65],[24, 67],[25, 65],[26, 65],[27, 69]]) as Theme

export const light_pink_Checkbox = n126 as Theme
export const light_pink_RadioGroupItem = n126 as Theme
export const light_pink_Input = n126 as Theme
export const light_pink_TextArea = n126 as Theme
const n127 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 11],[19, 71],[20, 11],[21, 71],[22, 71],[23, 65],[24, 67],[25, 65],[26, 65],[27, 67]]) as Theme

export const light_pink_Switch = n127 as Theme
export const light_pink_TooltipContent = n127 as Theme
export const light_pink_SliderTrack = n127 as Theme
const n128 = t([[12, 11],[13, 11],[14, 71],[15, 70],[16, 11],[17, 11],[18, 60],[19, 61],[20, 60],[21, 61],[22, 60],[23, 71],[24, 70],[25, 71],[26, 71],[27, 61]]) as Theme

export const light_pink_SwitchThumb = n128 as Theme
const n129 = t([[12, 69],[13, 68],[14, 67],[15, 65],[16, 70],[17, 71],[18, 60],[19, 61],[20, 60],[21, 61],[22, 61],[23, 67],[24, 65],[25, 67],[26, 67],[27, 65]]) as Theme

export const light_pink_SliderTrackActive = n129 as Theme
const n130 = t([[12, 71],[13, 70],[14, 69],[15, 68],[16, 11],[17, 222],[18, 60],[19, 61],[20, 60],[21, 61],[22, 221],[23, 69],[24, 68],[25, 69],[26, 69],[27, 63]]) as Theme

export const light_pink_SliderThumb = n130 as Theme
export const light_pink_Tooltip = n130 as Theme
export const light_pink_ProgressIndicator = n130 as Theme
const n131 = t([[12, 84],[13, 85],[14, 86],[15, 87],[16, 84],[17, 84],[18, 11],[19, 95],[20, 11],[21, 95],[22, 11],[23, 86],[24, 87],[25, 86],[26, 86],[27, 94]]) as Theme

export const light_red_ListItem = n131 as Theme
const n132 = t([[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 11],[19, 95],[20, 11],[21, 95],[22, 11],[23, 88],[24, 89],[25, 88],[26, 88],[27, 92]]) as Theme

export const light_red_Card = n132 as Theme
export const light_red_DrawerFrame = n132 as Theme
export const light_red_Progress = n132 as Theme
export const light_red_TooltipArrow = n132 as Theme
const n133 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 11],[19, 95],[20, 11],[21, 95],[22, 95],[23, 241],[24, 241],[25, 89],[26, 89],[27, 91]]) as Theme

export const light_red_Button = n133 as Theme
const n134 = t([[12, 85],[13, 86],[14, 87],[15, 88],[16, 84],[17, 223],[18, 11],[19, 95],[20, 11],[21, 95],[22, 224],[23, 89],[24, 91],[25, 89],[26, 89],[27, 93]]) as Theme

export const light_red_Checkbox = n134 as Theme
export const light_red_RadioGroupItem = n134 as Theme
export const light_red_Input = n134 as Theme
export const light_red_TextArea = n134 as Theme
const n135 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 11],[19, 95],[20, 11],[21, 95],[22, 95],[23, 89],[24, 91],[25, 89],[26, 89],[27, 91]]) as Theme

export const light_red_Switch = n135 as Theme
export const light_red_TooltipContent = n135 as Theme
export const light_red_SliderTrack = n135 as Theme
const n136 = t([[12, 11],[13, 11],[14, 95],[15, 94],[16, 11],[17, 11],[18, 84],[19, 85],[20, 84],[21, 85],[22, 84],[23, 95],[24, 94],[25, 95],[26, 95],[27, 85]]) as Theme

export const light_red_SwitchThumb = n136 as Theme
const n137 = t([[12, 93],[13, 92],[14, 91],[15, 89],[16, 94],[17, 95],[18, 84],[19, 85],[20, 84],[21, 85],[22, 85],[23, 91],[24, 89],[25, 91],[26, 91],[27, 89]]) as Theme

export const light_red_SliderTrackActive = n137 as Theme
const n138 = t([[12, 95],[13, 94],[14, 93],[15, 92],[16, 11],[17, 224],[18, 84],[19, 85],[20, 84],[21, 85],[22, 223],[23, 93],[24, 92],[25, 93],[26, 93],[27, 87]]) as Theme

export const light_red_SliderThumb = n138 as Theme
export const light_red_Tooltip = n138 as Theme
export const light_red_ProgressIndicator = n138 as Theme
const n139 = t([[12, 156],[13, 157],[14, 158],[15, 159],[16, 155],[17, 154],[18, 0],[19, 164],[20, 0],[21, 164],[22, 0],[23, 159],[24, 161],[25, 158],[26, 159],[27, 56]]) as Theme

export const dark_orange_Card = n139 as Theme
export const dark_orange_DrawerFrame = n139 as Theme
export const dark_orange_Progress = n139 as Theme
export const dark_orange_TooltipArrow = n139 as Theme
const n140 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 0],[19, 164],[20, 0],[21, 164],[22, 164],[23, 241],[24, 241],[25, 159],[26, 161],[27, 161]]) as Theme

export const dark_orange_Button = n140 as Theme
const n141 = t([[12, 155],[13, 156],[14, 157],[15, 158],[16, 154],[17, 225],[18, 0],[19, 164],[20, 0],[21, 164],[22, 226],[23, 161],[24, 56],[25, 159],[26, 161],[27, 162]]) as Theme

export const dark_orange_Checkbox = n141 as Theme
export const dark_orange_RadioGroupItem = n141 as Theme
export const dark_orange_Input = n141 as Theme
export const dark_orange_TextArea = n141 as Theme
const n142 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 0],[19, 164],[20, 0],[21, 164],[22, 164],[23, 161],[24, 56],[25, 159],[26, 161],[27, 161]]) as Theme

export const dark_orange_Switch = n142 as Theme
export const dark_orange_TooltipContent = n142 as Theme
export const dark_orange_SliderTrack = n142 as Theme
const n143 = t([[12, 0],[13, 0],[14, 164],[15, 163],[16, 0],[17, 0],[18, 154],[19, 155],[20, 154],[21, 155],[22, 154],[23, 163],[24, 162],[25, 164],[26, 163],[27, 155]]) as Theme

export const dark_orange_SwitchThumb = n143 as Theme
const n144 = t([[12, 162],[13, 56],[14, 161],[15, 159],[16, 163],[17, 164],[18, 154],[19, 155],[20, 154],[21, 155],[22, 155],[23, 159],[24, 158],[25, 161],[26, 159],[27, 159]]) as Theme

export const dark_orange_SliderTrackActive = n144 as Theme
const n145 = t([[12, 164],[13, 163],[14, 162],[15, 56],[16, 0],[17, 226],[18, 154],[19, 155],[20, 154],[21, 155],[22, 225],[23, 56],[24, 161],[25, 162],[26, 56],[27, 157]]) as Theme

export const dark_orange_SliderThumb = n145 as Theme
export const dark_orange_Tooltip = n145 as Theme
export const dark_orange_ProgressIndicator = n145 as Theme
const n146 = t([[12, 200],[13, 201],[14, 202],[15, 203],[16, 199],[17, 198],[18, 0],[19, 208],[20, 0],[21, 208],[22, 0],[23, 203],[24, 205],[25, 202],[26, 203],[27, 104]]) as Theme

export const dark_yellow_Card = n146 as Theme
export const dark_yellow_DrawerFrame = n146 as Theme
export const dark_yellow_Progress = n146 as Theme
export const dark_yellow_TooltipArrow = n146 as Theme
const n147 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 0],[19, 208],[20, 0],[21, 208],[22, 208],[23, 241],[24, 241],[25, 203],[26, 205],[27, 205]]) as Theme

export const dark_yellow_Button = n147 as Theme
const n148 = t([[12, 199],[13, 200],[14, 201],[15, 202],[16, 198],[17, 227],[18, 0],[19, 208],[20, 0],[21, 208],[22, 228],[23, 205],[24, 104],[25, 203],[26, 205],[27, 206]]) as Theme

export const dark_yellow_Checkbox = n148 as Theme
export const dark_yellow_RadioGroupItem = n148 as Theme
export const dark_yellow_Input = n148 as Theme
export const dark_yellow_TextArea = n148 as Theme
const n149 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 0],[19, 208],[20, 0],[21, 208],[22, 208],[23, 205],[24, 104],[25, 203],[26, 205],[27, 205]]) as Theme

export const dark_yellow_Switch = n149 as Theme
export const dark_yellow_TooltipContent = n149 as Theme
export const dark_yellow_SliderTrack = n149 as Theme
const n150 = t([[12, 0],[13, 0],[14, 208],[15, 207],[16, 0],[17, 0],[18, 198],[19, 199],[20, 198],[21, 199],[22, 198],[23, 207],[24, 206],[25, 208],[26, 207],[27, 199]]) as Theme

export const dark_yellow_SwitchThumb = n150 as Theme
const n151 = t([[12, 206],[13, 104],[14, 205],[15, 203],[16, 207],[17, 208],[18, 198],[19, 199],[20, 198],[21, 199],[22, 199],[23, 203],[24, 202],[25, 205],[26, 203],[27, 203]]) as Theme

export const dark_yellow_SliderTrackActive = n151 as Theme
const n152 = t([[12, 208],[13, 207],[14, 206],[15, 104],[16, 0],[17, 228],[18, 198],[19, 199],[20, 198],[21, 199],[22, 227],[23, 104],[24, 205],[25, 206],[26, 104],[27, 201]]) as Theme

export const dark_yellow_SliderThumb = n152 as Theme
export const dark_yellow_Tooltip = n152 as Theme
export const dark_yellow_ProgressIndicator = n152 as Theme
const n153 = t([[12, 145],[13, 146],[14, 147],[15, 148],[16, 144],[17, 143],[18, 0],[19, 153],[20, 0],[21, 153],[22, 0],[23, 148],[24, 150],[25, 147],[26, 148],[27, 44]]) as Theme

export const dark_green_Card = n153 as Theme
export const dark_green_DrawerFrame = n153 as Theme
export const dark_green_Progress = n153 as Theme
export const dark_green_TooltipArrow = n153 as Theme
const n154 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 0],[19, 153],[20, 0],[21, 153],[22, 153],[23, 241],[24, 241],[25, 148],[26, 150],[27, 150]]) as Theme

export const dark_green_Button = n154 as Theme
const n155 = t([[12, 144],[13, 145],[14, 146],[15, 147],[16, 143],[17, 229],[18, 0],[19, 153],[20, 0],[21, 153],[22, 230],[23, 150],[24, 44],[25, 148],[26, 150],[27, 151]]) as Theme

export const dark_green_Checkbox = n155 as Theme
export const dark_green_RadioGroupItem = n155 as Theme
export const dark_green_Input = n155 as Theme
export const dark_green_TextArea = n155 as Theme
const n156 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 0],[19, 153],[20, 0],[21, 153],[22, 153],[23, 150],[24, 44],[25, 148],[26, 150],[27, 150]]) as Theme

export const dark_green_Switch = n156 as Theme
export const dark_green_TooltipContent = n156 as Theme
export const dark_green_SliderTrack = n156 as Theme
const n157 = t([[12, 0],[13, 0],[14, 153],[15, 152],[16, 0],[17, 0],[18, 143],[19, 144],[20, 143],[21, 144],[22, 143],[23, 152],[24, 151],[25, 153],[26, 152],[27, 144]]) as Theme

export const dark_green_SwitchThumb = n157 as Theme
const n158 = t([[12, 151],[13, 44],[14, 150],[15, 148],[16, 152],[17, 153],[18, 143],[19, 144],[20, 143],[21, 144],[22, 144],[23, 148],[24, 147],[25, 150],[26, 148],[27, 148]]) as Theme

export const dark_green_SliderTrackActive = n158 as Theme
const n159 = t([[12, 153],[13, 152],[14, 151],[15, 44],[16, 0],[17, 230],[18, 143],[19, 144],[20, 143],[21, 144],[22, 229],[23, 44],[24, 150],[25, 151],[26, 44],[27, 146]]) as Theme

export const dark_green_SliderThumb = n159 as Theme
export const dark_green_Tooltip = n159 as Theme
export const dark_green_ProgressIndicator = n159 as Theme
const n160 = t([[12, 123],[13, 124],[14, 125],[15, 126],[16, 122],[17, 121],[18, 0],[19, 131],[20, 0],[21, 131],[22, 0],[23, 126],[24, 128],[25, 125],[26, 126],[27, 22]]) as Theme

export const dark_blue_Card = n160 as Theme
export const dark_blue_DrawerFrame = n160 as Theme
export const dark_blue_Progress = n160 as Theme
export const dark_blue_TooltipArrow = n160 as Theme
const n161 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 0],[19, 131],[20, 0],[21, 131],[22, 131],[23, 241],[24, 241],[25, 126],[26, 128],[27, 128]]) as Theme

export const dark_blue_Button = n161 as Theme
const n162 = t([[12, 122],[13, 123],[14, 124],[15, 125],[16, 121],[17, 231],[18, 0],[19, 131],[20, 0],[21, 131],[22, 232],[23, 128],[24, 22],[25, 126],[26, 128],[27, 129]]) as Theme

export const dark_blue_Checkbox = n162 as Theme
export const dark_blue_RadioGroupItem = n162 as Theme
export const dark_blue_Input = n162 as Theme
export const dark_blue_TextArea = n162 as Theme
const n163 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 0],[19, 131],[20, 0],[21, 131],[22, 131],[23, 128],[24, 22],[25, 126],[26, 128],[27, 128]]) as Theme

export const dark_blue_Switch = n163 as Theme
export const dark_blue_TooltipContent = n163 as Theme
export const dark_blue_SliderTrack = n163 as Theme
const n164 = t([[12, 0],[13, 0],[14, 131],[15, 130],[16, 0],[17, 0],[18, 121],[19, 122],[20, 121],[21, 122],[22, 121],[23, 130],[24, 129],[25, 131],[26, 130],[27, 122]]) as Theme

export const dark_blue_SwitchThumb = n164 as Theme
const n165 = t([[12, 129],[13, 22],[14, 128],[15, 126],[16, 130],[17, 131],[18, 121],[19, 122],[20, 121],[21, 122],[22, 122],[23, 126],[24, 125],[25, 128],[26, 126],[27, 126]]) as Theme

export const dark_blue_SliderTrackActive = n165 as Theme
const n166 = t([[12, 131],[13, 130],[14, 129],[15, 22],[16, 0],[17, 232],[18, 121],[19, 122],[20, 121],[21, 122],[22, 231],[23, 22],[24, 128],[25, 129],[26, 22],[27, 124]]) as Theme

export const dark_blue_SliderThumb = n166 as Theme
export const dark_blue_Tooltip = n166 as Theme
export const dark_blue_ProgressIndicator = n166 as Theme
const n167 = t([[12, 178],[13, 179],[14, 180],[15, 181],[16, 177],[17, 176],[18, 0],[19, 186],[20, 0],[21, 186],[22, 0],[23, 181],[24, 183],[25, 180],[26, 181],[27, 80]]) as Theme

export const dark_purple_Card = n167 as Theme
export const dark_purple_DrawerFrame = n167 as Theme
export const dark_purple_Progress = n167 as Theme
export const dark_purple_TooltipArrow = n167 as Theme
const n168 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 0],[19, 186],[20, 0],[21, 186],[22, 186],[23, 241],[24, 241],[25, 181],[26, 183],[27, 183]]) as Theme

export const dark_purple_Button = n168 as Theme
const n169 = t([[12, 177],[13, 178],[14, 179],[15, 180],[16, 176],[17, 233],[18, 0],[19, 186],[20, 0],[21, 186],[22, 234],[23, 183],[24, 80],[25, 181],[26, 183],[27, 184]]) as Theme

export const dark_purple_Checkbox = n169 as Theme
export const dark_purple_RadioGroupItem = n169 as Theme
export const dark_purple_Input = n169 as Theme
export const dark_purple_TextArea = n169 as Theme
const n170 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 0],[19, 186],[20, 0],[21, 186],[22, 186],[23, 183],[24, 80],[25, 181],[26, 183],[27, 183]]) as Theme

export const dark_purple_Switch = n170 as Theme
export const dark_purple_TooltipContent = n170 as Theme
export const dark_purple_SliderTrack = n170 as Theme
const n171 = t([[12, 0],[13, 0],[14, 186],[15, 185],[16, 0],[17, 0],[18, 176],[19, 177],[20, 176],[21, 177],[22, 176],[23, 185],[24, 184],[25, 186],[26, 185],[27, 177]]) as Theme

export const dark_purple_SwitchThumb = n171 as Theme
const n172 = t([[12, 184],[13, 80],[14, 183],[15, 181],[16, 185],[17, 186],[18, 176],[19, 177],[20, 176],[21, 177],[22, 177],[23, 181],[24, 180],[25, 183],[26, 181],[27, 181]]) as Theme

export const dark_purple_SliderTrackActive = n172 as Theme
const n173 = t([[12, 186],[13, 185],[14, 184],[15, 80],[16, 0],[17, 234],[18, 176],[19, 177],[20, 176],[21, 177],[22, 233],[23, 80],[24, 183],[25, 184],[26, 80],[27, 179]]) as Theme

export const dark_purple_SliderThumb = n173 as Theme
export const dark_purple_Tooltip = n173 as Theme
export const dark_purple_ProgressIndicator = n173 as Theme
const n174 = t([[12, 167],[13, 168],[14, 169],[15, 170],[16, 166],[17, 165],[18, 0],[19, 175],[20, 0],[21, 175],[22, 0],[23, 170],[24, 172],[25, 169],[26, 170],[27, 68]]) as Theme

export const dark_pink_Card = n174 as Theme
export const dark_pink_DrawerFrame = n174 as Theme
export const dark_pink_Progress = n174 as Theme
export const dark_pink_TooltipArrow = n174 as Theme
const n175 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 0],[19, 175],[20, 0],[21, 175],[22, 175],[23, 241],[24, 241],[25, 170],[26, 172],[27, 172]]) as Theme

export const dark_pink_Button = n175 as Theme
const n176 = t([[12, 166],[13, 167],[14, 168],[15, 169],[16, 165],[17, 235],[18, 0],[19, 175],[20, 0],[21, 175],[22, 236],[23, 172],[24, 68],[25, 170],[26, 172],[27, 173]]) as Theme

export const dark_pink_Checkbox = n176 as Theme
export const dark_pink_RadioGroupItem = n176 as Theme
export const dark_pink_Input = n176 as Theme
export const dark_pink_TextArea = n176 as Theme
const n177 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 0],[19, 175],[20, 0],[21, 175],[22, 175],[23, 172],[24, 68],[25, 170],[26, 172],[27, 172]]) as Theme

export const dark_pink_Switch = n177 as Theme
export const dark_pink_TooltipContent = n177 as Theme
export const dark_pink_SliderTrack = n177 as Theme
const n178 = t([[12, 0],[13, 0],[14, 175],[15, 174],[16, 0],[17, 0],[18, 165],[19, 166],[20, 165],[21, 166],[22, 165],[23, 174],[24, 173],[25, 175],[26, 174],[27, 166]]) as Theme

export const dark_pink_SwitchThumb = n178 as Theme
const n179 = t([[12, 173],[13, 68],[14, 172],[15, 170],[16, 174],[17, 175],[18, 165],[19, 166],[20, 165],[21, 166],[22, 166],[23, 170],[24, 169],[25, 172],[26, 170],[27, 170]]) as Theme

export const dark_pink_SliderTrackActive = n179 as Theme
const n180 = t([[12, 175],[13, 174],[14, 173],[15, 68],[16, 0],[17, 236],[18, 165],[19, 166],[20, 165],[21, 166],[22, 235],[23, 68],[24, 172],[25, 173],[26, 68],[27, 168]]) as Theme

export const dark_pink_SliderThumb = n180 as Theme
export const dark_pink_Tooltip = n180 as Theme
export const dark_pink_ProgressIndicator = n180 as Theme
const n181 = t([[12, 189],[13, 190],[14, 191],[15, 192],[16, 188],[17, 187],[18, 0],[19, 197],[20, 0],[21, 197],[22, 0],[23, 192],[24, 194],[25, 191],[26, 192],[27, 92]]) as Theme

export const dark_red_Card = n181 as Theme
export const dark_red_DrawerFrame = n181 as Theme
export const dark_red_Progress = n181 as Theme
export const dark_red_TooltipArrow = n181 as Theme
const n182 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 0],[19, 197],[20, 0],[21, 197],[22, 197],[23, 241],[24, 241],[25, 192],[26, 194],[27, 194]]) as Theme

export const dark_red_Button = n182 as Theme
const n183 = t([[12, 188],[13, 189],[14, 190],[15, 191],[16, 187],[17, 237],[18, 0],[19, 197],[20, 0],[21, 197],[22, 238],[23, 194],[24, 92],[25, 192],[26, 194],[27, 195]]) as Theme

export const dark_red_Checkbox = n183 as Theme
export const dark_red_RadioGroupItem = n183 as Theme
export const dark_red_Input = n183 as Theme
export const dark_red_TextArea = n183 as Theme
const n184 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 0],[19, 197],[20, 0],[21, 197],[22, 197],[23, 194],[24, 92],[25, 192],[26, 194],[27, 194]]) as Theme

export const dark_red_Switch = n184 as Theme
export const dark_red_TooltipContent = n184 as Theme
export const dark_red_SliderTrack = n184 as Theme
const n185 = t([[12, 0],[13, 0],[14, 197],[15, 196],[16, 0],[17, 0],[18, 187],[19, 188],[20, 187],[21, 188],[22, 187],[23, 196],[24, 195],[25, 197],[26, 196],[27, 188]]) as Theme

export const dark_red_SwitchThumb = n185 as Theme
const n186 = t([[12, 195],[13, 92],[14, 194],[15, 192],[16, 196],[17, 197],[18, 187],[19, 188],[20, 187],[21, 188],[22, 188],[23, 192],[24, 191],[25, 194],[26, 192],[27, 192]]) as Theme

export const dark_red_SliderTrackActive = n186 as Theme
const n187 = t([[12, 197],[13, 196],[14, 195],[15, 92],[16, 0],[17, 238],[18, 187],[19, 188],[20, 187],[21, 188],[22, 237],[23, 92],[24, 194],[25, 195],[26, 92],[27, 190]]) as Theme

export const dark_red_SliderThumb = n187 as Theme
export const dark_red_Tooltip = n187 as Theme
export const dark_red_ProgressIndicator = n187 as Theme
const n188 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 4],[24, 5],[25, 3],[26, 4],[27, 8]]) as Theme

export const light_alt1_ListItem = n188 as Theme
const n189 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 10],[19, 9],[20, 10],[21, 9],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]]) as Theme

export const light_alt1_Card = n189 as Theme
export const light_alt1_DrawerFrame = n189 as Theme
export const light_alt1_Progress = n189 as Theme
export const light_alt1_TooltipArrow = n189 as Theme
const n190 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 10],[19, 9],[20, 10],[21, 9],[22, 9],[23, 241],[24, 241],[25, 6],[26, 7],[27, 5]]) as Theme

export const light_alt1_Button = n190 as Theme
const n191 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 7],[24, 8],[25, 6],[26, 7],[27, 7]]) as Theme

export const light_alt1_Checkbox = n191 as Theme
export const light_alt1_RadioGroupItem = n191 as Theme
export const light_alt1_Input = n191 as Theme
export const light_alt1_TextArea = n191 as Theme
const n192 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 10],[19, 9],[20, 10],[21, 9],[22, 9],[23, 7],[24, 8],[25, 6],[26, 7],[27, 5]]) as Theme

export const light_alt1_Switch = n192 as Theme
export const light_alt1_TooltipContent = n192 as Theme
export const light_alt1_SliderTrack = n192 as Theme
const n193 = t([[12, 11],[13, 10],[14, 9],[15, 8],[16, 11],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 8],[24, 7],[25, 9],[26, 8],[27, 2]]) as Theme

export const light_alt1_SwitchThumb = n193 as Theme
const n194 = t([[12, 7],[13, 6],[14, 5],[15, 4],[16, 8],[17, 9],[18, 1],[19, 2],[20, 1],[21, 2],[22, 2],[23, 4],[24, 3],[25, 5],[26, 4],[27, 6]]) as Theme

export const light_alt1_SliderTrackActive = n194 as Theme
const n195 = t([[12, 9],[13, 8],[14, 7],[15, 6],[16, 10],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 6],[24, 5],[25, 7],[26, 6],[27, 4]]) as Theme

export const light_alt1_SliderThumb = n195 as Theme
export const light_alt1_Tooltip = n195 as Theme
export const light_alt1_ProgressIndicator = n195 as Theme
const n196 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 9],[19, 8],[20, 9],[21, 8],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7]]) as Theme

export const light_alt2_ListItem = n196 as Theme
const n197 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 9],[19, 8],[20, 9],[21, 8],[22, 9],[23, 7],[24, 8],[25, 6],[26, 7],[27, 5]]) as Theme

export const light_alt2_Card = n197 as Theme
export const light_alt2_DrawerFrame = n197 as Theme
export const light_alt2_Progress = n197 as Theme
export const light_alt2_TooltipArrow = n197 as Theme
const n198 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[18, 9],[19, 8],[20, 9],[21, 8],[22, 8],[23, 241],[24, 241],[25, 7],[26, 8],[27, 4]]) as Theme

export const light_alt2_Button = n198 as Theme
const n199 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 8],[24, 9],[25, 7],[26, 8],[27, 6]]) as Theme

export const light_alt2_Checkbox = n199 as Theme
export const light_alt2_RadioGroupItem = n199 as Theme
export const light_alt2_Input = n199 as Theme
export const light_alt2_TextArea = n199 as Theme
const n200 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[18, 9],[19, 8],[20, 9],[21, 8],[22, 8],[23, 8],[24, 9],[25, 7],[26, 8],[27, 4]]) as Theme

export const light_alt2_Switch = n200 as Theme
export const light_alt2_TooltipContent = n200 as Theme
export const light_alt2_SliderTrack = n200 as Theme
const n201 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 11],[18, 2],[19, 3],[20, 2],[21, 3],[22, 0],[23, 7],[24, 6],[25, 8],[26, 7],[27, 3]]) as Theme

export const light_alt2_SwitchThumb = n201 as Theme
const n202 = t([[12, 6],[13, 5],[14, 4],[15, 3],[16, 7],[17, 8],[18, 2],[19, 3],[20, 2],[21, 3],[22, 3],[23, 3],[24, 2],[25, 4],[26, 3],[27, 7]]) as Theme

export const light_alt2_SliderTrackActive = n202 as Theme
const n203 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 2],[19, 3],[20, 2],[21, 3],[22, 1],[23, 5],[24, 4],[25, 6],[26, 5],[27, 5]]) as Theme

export const light_alt2_SliderThumb = n203 as Theme
export const light_alt2_Tooltip = n203 as Theme
export const light_alt2_ProgressIndicator = n203 as Theme
const n204 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[19, 7],[20, 8],[21, 7],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]]) as Theme

export const light_active_ListItem = n204 as Theme
const n205 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[19, 7],[20, 8],[21, 7],[22, 8],[23, 8],[24, 9],[25, 7],[26, 8],[27, 4]]) as Theme

export const light_active_Card = n205 as Theme
export const light_active_DrawerFrame = n205 as Theme
export const light_active_Progress = n205 as Theme
export const light_active_TooltipArrow = n205 as Theme
const n206 = t([[12, 6],[13, 7],[14, 8],[15, 9],[16, 5],[17, 4],[19, 7],[20, 8],[21, 7],[22, 7],[23, 241],[24, 241],[25, 8],[26, 9],[27, 3]]) as Theme

export const light_active_Button = n206 as Theme
const n207 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 9],[24, 10],[25, 8],[26, 9],[27, 5]]) as Theme

export const light_active_Checkbox = n207 as Theme
export const light_active_RadioGroupItem = n207 as Theme
export const light_active_Input = n207 as Theme
export const light_active_TextArea = n207 as Theme
const n208 = t([[12, 6],[13, 7],[14, 8],[15, 9],[16, 5],[17, 4],[19, 7],[20, 8],[21, 7],[22, 7],[23, 9],[24, 10],[25, 8],[26, 9],[27, 3]]) as Theme

export const light_active_Switch = n208 as Theme
export const light_active_TooltipContent = n208 as Theme
export const light_active_SliderTrack = n208 as Theme
const n209 = t([[12, 9],[13, 8],[14, 7],[15, 6],[16, 10],[17, 11],[19, 4],[20, 3],[21, 4],[22, 0],[23, 6],[24, 5],[25, 7],[26, 6],[27, 4]]) as Theme

export const light_active_SwitchThumb = n209 as Theme
const n210 = t([[12, 5],[13, 4],[14, 3],[15, 2],[16, 6],[17, 7],[19, 4],[20, 3],[21, 4],[22, 4],[23, 2],[24, 1],[25, 3],[26, 2],[27, 8]]) as Theme

export const light_active_SliderTrackActive = n210 as Theme
const n211 = t([[12, 7],[13, 6],[14, 5],[15, 4],[16, 8],[17, 9],[19, 4],[20, 3],[21, 4],[22, 2],[23, 4],[24, 3],[25, 5],[26, 4],[27, 6]]) as Theme

export const light_active_SliderThumb = n211 as Theme
export const light_active_Tooltip = n211 as Theme
export const light_active_ProgressIndicator = n211 as Theme
const n212 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 120],[19, 119],[20, 120],[21, 119],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116]]) as Theme

export const dark_alt1_Card = n212 as Theme
export const dark_alt1_DrawerFrame = n212 as Theme
export const dark_alt1_Progress = n212 as Theme
export const dark_alt1_TooltipArrow = n212 as Theme
const n213 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 120],[19, 119],[20, 120],[21, 119],[22, 119],[23, 241],[24, 241],[25, 116],[26, 117],[27, 115]]) as Theme

export const dark_alt1_Button = n213 as Theme
const n214 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 117],[24, 118],[25, 116],[26, 117],[27, 117]]) as Theme

export const dark_alt1_Checkbox = n214 as Theme
export const dark_alt1_RadioGroupItem = n214 as Theme
export const dark_alt1_Input = n214 as Theme
export const dark_alt1_TextArea = n214 as Theme
const n215 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 120],[19, 119],[20, 120],[21, 119],[22, 119],[23, 117],[24, 118],[25, 116],[26, 117],[27, 115]]) as Theme

export const dark_alt1_Switch = n215 as Theme
export const dark_alt1_TooltipContent = n215 as Theme
export const dark_alt1_SliderTrack = n215 as Theme
const n216 = t([[12, 0],[13, 120],[14, 119],[15, 118],[16, 0],[17, 0],[18, 111],[19, 112],[20, 111],[21, 112],[22, 110],[23, 118],[24, 117],[25, 119],[26, 118],[27, 112]]) as Theme

export const dark_alt1_SwitchThumb = n216 as Theme
const n217 = t([[12, 117],[13, 116],[14, 115],[15, 114],[16, 118],[17, 119],[18, 111],[19, 112],[20, 111],[21, 112],[22, 112],[23, 114],[24, 113],[25, 115],[26, 114],[27, 116]]) as Theme

export const dark_alt1_SliderTrackActive = n217 as Theme
const n218 = t([[12, 119],[13, 118],[14, 117],[15, 116],[16, 120],[17, 0],[18, 111],[19, 112],[20, 111],[21, 112],[22, 110],[23, 116],[24, 115],[25, 117],[26, 116],[27, 114]]) as Theme

export const dark_alt1_SliderThumb = n218 as Theme
export const dark_alt1_Tooltip = n218 as Theme
export const dark_alt1_ProgressIndicator = n218 as Theme
const n219 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 119],[19, 118],[20, 119],[21, 118],[22, 119],[23, 117],[24, 118],[25, 116],[26, 117],[27, 115]]) as Theme

export const dark_alt2_Card = n219 as Theme
export const dark_alt2_DrawerFrame = n219 as Theme
export const dark_alt2_Progress = n219 as Theme
export const dark_alt2_TooltipArrow = n219 as Theme
const n220 = t([[12, 115],[13, 116],[14, 117],[15, 118],[16, 114],[17, 113],[18, 119],[19, 118],[20, 119],[21, 118],[22, 118],[23, 241],[24, 241],[25, 117],[26, 118],[27, 114]]) as Theme

export const dark_alt2_Button = n220 as Theme
const n221 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 118],[24, 119],[25, 117],[26, 118],[27, 116]]) as Theme

export const dark_alt2_Checkbox = n221 as Theme
export const dark_alt2_RadioGroupItem = n221 as Theme
export const dark_alt2_Input = n221 as Theme
export const dark_alt2_TextArea = n221 as Theme
const n222 = t([[12, 115],[13, 116],[14, 117],[15, 118],[16, 114],[17, 113],[18, 119],[19, 118],[20, 119],[21, 118],[22, 118],[23, 118],[24, 119],[25, 117],[26, 118],[27, 114]]) as Theme

export const dark_alt2_Switch = n222 as Theme
export const dark_alt2_TooltipContent = n222 as Theme
export const dark_alt2_SliderTrack = n222 as Theme
const n223 = t([[12, 120],[13, 119],[14, 118],[15, 117],[16, 0],[17, 0],[18, 112],[19, 113],[20, 112],[21, 113],[22, 110],[23, 117],[24, 116],[25, 118],[26, 117],[27, 113]]) as Theme

export const dark_alt2_SwitchThumb = n223 as Theme
const n224 = t([[12, 116],[13, 115],[14, 114],[15, 113],[16, 117],[17, 118],[18, 112],[19, 113],[20, 112],[21, 113],[22, 113],[23, 113],[24, 112],[25, 114],[26, 113],[27, 117]]) as Theme

export const dark_alt2_SliderTrackActive = n224 as Theme
const n225 = t([[12, 118],[13, 117],[14, 116],[15, 115],[16, 119],[17, 120],[18, 112],[19, 113],[20, 112],[21, 113],[22, 111],[23, 115],[24, 114],[25, 116],[26, 115],[27, 115]]) as Theme

export const dark_alt2_SliderThumb = n225 as Theme
export const dark_alt2_Tooltip = n225 as Theme
export const dark_alt2_ProgressIndicator = n225 as Theme
const n226 = t([[12, 115],[13, 116],[14, 117],[15, 118],[16, 114],[17, 113],[19, 117],[20, 118],[21, 117],[22, 118],[23, 118],[24, 119],[25, 117],[26, 118],[27, 114]]) as Theme

export const dark_active_Card = n226 as Theme
export const dark_active_DrawerFrame = n226 as Theme
export const dark_active_Progress = n226 as Theme
export const dark_active_TooltipArrow = n226 as Theme
const n227 = t([[12, 116],[13, 117],[14, 118],[15, 119],[16, 115],[17, 114],[19, 117],[20, 118],[21, 117],[22, 117],[23, 241],[24, 241],[25, 118],[26, 119],[27, 113]]) as Theme

export const dark_active_Button = n227 as Theme
const n228 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 119],[24, 120],[25, 118],[26, 119],[27, 115]]) as Theme

export const dark_active_Checkbox = n228 as Theme
export const dark_active_RadioGroupItem = n228 as Theme
export const dark_active_Input = n228 as Theme
export const dark_active_TextArea = n228 as Theme
const n229 = t([[12, 116],[13, 117],[14, 118],[15, 119],[16, 115],[17, 114],[19, 117],[20, 118],[21, 117],[22, 117],[23, 119],[24, 120],[25, 118],[26, 119],[27, 113]]) as Theme

export const dark_active_Switch = n229 as Theme
export const dark_active_TooltipContent = n229 as Theme
export const dark_active_SliderTrack = n229 as Theme
const n230 = t([[12, 119],[13, 118],[14, 117],[15, 116],[16, 120],[17, 0],[19, 114],[20, 113],[21, 114],[22, 110],[23, 116],[24, 115],[25, 117],[26, 116],[27, 114]]) as Theme

export const dark_active_SwitchThumb = n230 as Theme
const n231 = t([[12, 115],[13, 114],[14, 113],[15, 112],[16, 116],[17, 117],[19, 114],[20, 113],[21, 114],[22, 114],[23, 112],[24, 111],[25, 113],[26, 112],[27, 118]]) as Theme

export const dark_active_SliderTrackActive = n231 as Theme
const n232 = t([[12, 117],[13, 116],[14, 115],[15, 114],[16, 118],[17, 119],[19, 114],[20, 113],[21, 114],[22, 112],[23, 114],[24, 113],[25, 115],[26, 114],[27, 116]]) as Theme

export const dark_active_SliderThumb = n232 as Theme
export const dark_active_Tooltip = n232 as Theme
export const dark_active_ProgressIndicator = n232 as Theme
const n233 = t([[12, 49],[13, 50],[14, 51],[15, 52],[16, 48],[17, 48],[18, 59],[19, 58],[20, 59],[21, 58],[22, 11],[23, 51],[24, 52],[25, 51],[26, 51],[27, 57]]) as Theme

export const light_orange_alt1_ListItem = n233 as Theme
const n234 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 59],[19, 58],[20, 59],[21, 58],[22, 59],[23, 53],[24, 55],[25, 53],[26, 53],[27, 55]]) as Theme

export const light_orange_alt1_Card = n234 as Theme
export const light_orange_alt1_DrawerFrame = n234 as Theme
export const light_orange_alt1_Progress = n234 as Theme
export const light_orange_alt1_TooltipArrow = n234 as Theme
const n235 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[18, 59],[19, 58],[20, 59],[21, 58],[22, 58],[23, 241],[24, 241],[25, 55],[26, 55],[27, 53]]) as Theme

export const light_orange_alt1_Button = n235 as Theme
const n236 = t([[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 59],[19, 58],[20, 59],[21, 58],[22, 11],[23, 55],[24, 56],[25, 55],[26, 55],[27, 56]]) as Theme

export const light_orange_alt1_Checkbox = n236 as Theme
export const light_orange_alt1_RadioGroupItem = n236 as Theme
export const light_orange_alt1_Input = n236 as Theme
export const light_orange_alt1_TextArea = n236 as Theme
const n237 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[18, 59],[19, 58],[20, 59],[21, 58],[22, 58],[23, 55],[24, 56],[25, 55],[26, 55],[27, 53]]) as Theme

export const light_orange_alt1_Switch = n237 as Theme
export const light_orange_alt1_TooltipContent = n237 as Theme
export const light_orange_alt1_SliderTrack = n237 as Theme
const n238 = t([[12, 11],[13, 59],[14, 58],[15, 57],[16, 11],[17, 11],[18, 49],[19, 50],[20, 49],[21, 50],[22, 48],[23, 58],[24, 57],[25, 58],[26, 58],[27, 50]]) as Theme

export const light_orange_alt1_SwitchThumb = n238 as Theme
const n239 = t([[12, 56],[13, 55],[14, 53],[15, 52],[16, 57],[17, 58],[18, 49],[19, 50],[20, 49],[21, 50],[22, 50],[23, 53],[24, 52],[25, 53],[26, 53],[27, 55]]) as Theme

export const light_orange_alt1_SliderTrackActive = n239 as Theme
const n240 = t([[12, 58],[13, 57],[14, 56],[15, 55],[16, 59],[17, 11],[18, 49],[19, 50],[20, 49],[21, 50],[22, 48],[23, 56],[24, 55],[25, 56],[26, 56],[27, 52]]) as Theme

export const light_orange_alt1_SliderThumb = n240 as Theme
export const light_orange_alt1_Tooltip = n240 as Theme
export const light_orange_alt1_ProgressIndicator = n240 as Theme
const n241 = t([[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 58],[19, 57],[20, 58],[21, 57],[22, 11],[23, 52],[24, 53],[25, 52],[26, 52],[27, 56]]) as Theme

export const light_orange_alt2_ListItem = n241 as Theme
const n242 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[18, 58],[19, 57],[20, 58],[21, 57],[22, 58],[23, 55],[24, 56],[25, 55],[26, 55],[27, 53]]) as Theme

export const light_orange_alt2_Card = n242 as Theme
export const light_orange_alt2_DrawerFrame = n242 as Theme
export const light_orange_alt2_Progress = n242 as Theme
export const light_orange_alt2_TooltipArrow = n242 as Theme
const n243 = t([[12, 53],[13, 55],[14, 56],[15, 57],[16, 52],[17, 51],[18, 58],[19, 57],[20, 58],[21, 57],[22, 57],[23, 241],[24, 241],[25, 56],[26, 56],[27, 52]]) as Theme

export const light_orange_alt2_Button = n243 as Theme
const n244 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 58],[19, 57],[20, 58],[21, 57],[22, 59],[23, 56],[24, 57],[25, 56],[26, 56],[27, 55]]) as Theme

export const light_orange_alt2_Checkbox = n244 as Theme
export const light_orange_alt2_RadioGroupItem = n244 as Theme
export const light_orange_alt2_Input = n244 as Theme
export const light_orange_alt2_TextArea = n244 as Theme
const n245 = t([[12, 53],[13, 55],[14, 56],[15, 57],[16, 52],[17, 51],[18, 58],[19, 57],[20, 58],[21, 57],[22, 57],[23, 56],[24, 57],[25, 56],[26, 56],[27, 52]]) as Theme

export const light_orange_alt2_Switch = n245 as Theme
export const light_orange_alt2_TooltipContent = n245 as Theme
export const light_orange_alt2_SliderTrack = n245 as Theme
const n246 = t([[12, 59],[13, 58],[14, 57],[15, 56],[16, 11],[17, 11],[18, 50],[19, 51],[20, 50],[21, 51],[22, 48],[23, 57],[24, 56],[25, 57],[26, 57],[27, 51]]) as Theme

export const light_orange_alt2_SwitchThumb = n246 as Theme
const n247 = t([[12, 55],[13, 53],[14, 52],[15, 51],[16, 56],[17, 57],[18, 50],[19, 51],[20, 50],[21, 51],[22, 51],[23, 52],[24, 51],[25, 52],[26, 52],[27, 56]]) as Theme

export const light_orange_alt2_SliderTrackActive = n247 as Theme
const n248 = t([[12, 57],[13, 56],[14, 55],[15, 53],[16, 58],[17, 59],[18, 50],[19, 51],[20, 50],[21, 51],[22, 49],[23, 55],[24, 53],[25, 55],[26, 55],[27, 53]]) as Theme

export const light_orange_alt2_SliderThumb = n248 as Theme
export const light_orange_alt2_Tooltip = n248 as Theme
export const light_orange_alt2_ProgressIndicator = n248 as Theme
const n249 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[19, 56],[20, 57],[21, 56],[22, 59],[23, 53],[24, 55],[25, 53],[26, 53],[27, 55]]) as Theme

export const light_orange_active_ListItem = n249 as Theme
const n250 = t([[12, 53],[13, 55],[14, 56],[15, 57],[16, 52],[17, 51],[19, 56],[20, 57],[21, 56],[22, 57],[23, 56],[24, 57],[25, 56],[26, 56],[27, 52]]) as Theme

export const light_orange_active_Card = n250 as Theme
export const light_orange_active_DrawerFrame = n250 as Theme
export const light_orange_active_Progress = n250 as Theme
export const light_orange_active_TooltipArrow = n250 as Theme
const n251 = t([[12, 55],[13, 56],[14, 57],[15, 58],[16, 53],[17, 52],[19, 56],[20, 57],[21, 56],[22, 56],[23, 241],[24, 241],[25, 57],[26, 57],[27, 51]]) as Theme

export const light_orange_active_Button = n251 as Theme
const n252 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[19, 56],[20, 57],[21, 56],[22, 58],[23, 57],[24, 58],[25, 57],[26, 57],[27, 53]]) as Theme

export const light_orange_active_Checkbox = n252 as Theme
export const light_orange_active_RadioGroupItem = n252 as Theme
export const light_orange_active_Input = n252 as Theme
export const light_orange_active_TextArea = n252 as Theme
const n253 = t([[12, 55],[13, 56],[14, 57],[15, 58],[16, 53],[17, 52],[19, 56],[20, 57],[21, 56],[22, 56],[23, 57],[24, 58],[25, 57],[26, 57],[27, 51]]) as Theme

export const light_orange_active_Switch = n253 as Theme
export const light_orange_active_TooltipContent = n253 as Theme
export const light_orange_active_SliderTrack = n253 as Theme
const n254 = t([[12, 58],[13, 57],[14, 56],[15, 55],[16, 59],[17, 11],[19, 52],[20, 51],[21, 52],[22, 48],[23, 56],[24, 55],[25, 56],[26, 56],[27, 52]]) as Theme

export const light_orange_active_SwitchThumb = n254 as Theme
const n255 = t([[12, 53],[13, 52],[14, 51],[15, 50],[16, 55],[17, 56],[19, 52],[20, 51],[21, 52],[22, 52],[23, 51],[24, 50],[25, 51],[26, 51],[27, 57]]) as Theme

export const light_orange_active_SliderTrackActive = n255 as Theme
const n256 = t([[12, 56],[13, 55],[14, 53],[15, 52],[16, 57],[17, 58],[19, 52],[20, 51],[21, 52],[22, 50],[23, 53],[24, 52],[25, 53],[26, 53],[27, 55]]) as Theme

export const light_orange_active_SliderThumb = n256 as Theme
export const light_orange_active_Tooltip = n256 as Theme
export const light_orange_active_ProgressIndicator = n256 as Theme
const n257 = t([[12, 97],[13, 98],[14, 99],[15, 100],[16, 96],[17, 96],[18, 107],[19, 106],[20, 107],[21, 106],[22, 11],[23, 99],[24, 100],[25, 99],[26, 99],[27, 105]]) as Theme

export const light_yellow_alt1_ListItem = n257 as Theme
const n258 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 107],[19, 106],[20, 107],[21, 106],[22, 107],[23, 101],[24, 103],[25, 101],[26, 101],[27, 103]]) as Theme

export const light_yellow_alt1_Card = n258 as Theme
export const light_yellow_alt1_DrawerFrame = n258 as Theme
export const light_yellow_alt1_Progress = n258 as Theme
export const light_yellow_alt1_TooltipArrow = n258 as Theme
const n259 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[18, 107],[19, 106],[20, 107],[21, 106],[22, 106],[23, 241],[24, 241],[25, 103],[26, 103],[27, 101]]) as Theme

export const light_yellow_alt1_Button = n259 as Theme
const n260 = t([[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 107],[19, 106],[20, 107],[21, 106],[22, 11],[23, 103],[24, 104],[25, 103],[26, 103],[27, 104]]) as Theme

export const light_yellow_alt1_Checkbox = n260 as Theme
export const light_yellow_alt1_RadioGroupItem = n260 as Theme
export const light_yellow_alt1_Input = n260 as Theme
export const light_yellow_alt1_TextArea = n260 as Theme
const n261 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[18, 107],[19, 106],[20, 107],[21, 106],[22, 106],[23, 103],[24, 104],[25, 103],[26, 103],[27, 101]]) as Theme

export const light_yellow_alt1_Switch = n261 as Theme
export const light_yellow_alt1_TooltipContent = n261 as Theme
export const light_yellow_alt1_SliderTrack = n261 as Theme
const n262 = t([[12, 11],[13, 107],[14, 106],[15, 105],[16, 11],[17, 11],[18, 97],[19, 98],[20, 97],[21, 98],[22, 96],[23, 106],[24, 105],[25, 106],[26, 106],[27, 98]]) as Theme

export const light_yellow_alt1_SwitchThumb = n262 as Theme
const n263 = t([[12, 104],[13, 103],[14, 101],[15, 100],[16, 105],[17, 106],[18, 97],[19, 98],[20, 97],[21, 98],[22, 98],[23, 101],[24, 100],[25, 101],[26, 101],[27, 103]]) as Theme

export const light_yellow_alt1_SliderTrackActive = n263 as Theme
const n264 = t([[12, 106],[13, 105],[14, 104],[15, 103],[16, 107],[17, 11],[18, 97],[19, 98],[20, 97],[21, 98],[22, 96],[23, 104],[24, 103],[25, 104],[26, 104],[27, 100]]) as Theme

export const light_yellow_alt1_SliderThumb = n264 as Theme
export const light_yellow_alt1_Tooltip = n264 as Theme
export const light_yellow_alt1_ProgressIndicator = n264 as Theme
const n265 = t([[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 106],[19, 105],[20, 106],[21, 105],[22, 11],[23, 100],[24, 101],[25, 100],[26, 100],[27, 104]]) as Theme

export const light_yellow_alt2_ListItem = n265 as Theme
const n266 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[18, 106],[19, 105],[20, 106],[21, 105],[22, 106],[23, 103],[24, 104],[25, 103],[26, 103],[27, 101]]) as Theme

export const light_yellow_alt2_Card = n266 as Theme
export const light_yellow_alt2_DrawerFrame = n266 as Theme
export const light_yellow_alt2_Progress = n266 as Theme
export const light_yellow_alt2_TooltipArrow = n266 as Theme
const n267 = t([[12, 101],[13, 103],[14, 104],[15, 105],[16, 100],[17, 99],[18, 106],[19, 105],[20, 106],[21, 105],[22, 105],[23, 241],[24, 241],[25, 104],[26, 104],[27, 100]]) as Theme

export const light_yellow_alt2_Button = n267 as Theme
const n268 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 106],[19, 105],[20, 106],[21, 105],[22, 107],[23, 104],[24, 105],[25, 104],[26, 104],[27, 103]]) as Theme

export const light_yellow_alt2_Checkbox = n268 as Theme
export const light_yellow_alt2_RadioGroupItem = n268 as Theme
export const light_yellow_alt2_Input = n268 as Theme
export const light_yellow_alt2_TextArea = n268 as Theme
const n269 = t([[12, 101],[13, 103],[14, 104],[15, 105],[16, 100],[17, 99],[18, 106],[19, 105],[20, 106],[21, 105],[22, 105],[23, 104],[24, 105],[25, 104],[26, 104],[27, 100]]) as Theme

export const light_yellow_alt2_Switch = n269 as Theme
export const light_yellow_alt2_TooltipContent = n269 as Theme
export const light_yellow_alt2_SliderTrack = n269 as Theme
const n270 = t([[12, 107],[13, 106],[14, 105],[15, 104],[16, 11],[17, 11],[18, 98],[19, 99],[20, 98],[21, 99],[22, 96],[23, 105],[24, 104],[25, 105],[26, 105],[27, 99]]) as Theme

export const light_yellow_alt2_SwitchThumb = n270 as Theme
const n271 = t([[12, 103],[13, 101],[14, 100],[15, 99],[16, 104],[17, 105],[18, 98],[19, 99],[20, 98],[21, 99],[22, 99],[23, 100],[24, 99],[25, 100],[26, 100],[27, 104]]) as Theme

export const light_yellow_alt2_SliderTrackActive = n271 as Theme
const n272 = t([[12, 105],[13, 104],[14, 103],[15, 101],[16, 106],[17, 107],[18, 98],[19, 99],[20, 98],[21, 99],[22, 97],[23, 103],[24, 101],[25, 103],[26, 103],[27, 101]]) as Theme

export const light_yellow_alt2_SliderThumb = n272 as Theme
export const light_yellow_alt2_Tooltip = n272 as Theme
export const light_yellow_alt2_ProgressIndicator = n272 as Theme
const n273 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[19, 104],[20, 105],[21, 104],[22, 107],[23, 101],[24, 103],[25, 101],[26, 101],[27, 103]]) as Theme

export const light_yellow_active_ListItem = n273 as Theme
const n274 = t([[12, 101],[13, 103],[14, 104],[15, 105],[16, 100],[17, 99],[19, 104],[20, 105],[21, 104],[22, 105],[23, 104],[24, 105],[25, 104],[26, 104],[27, 100]]) as Theme

export const light_yellow_active_Card = n274 as Theme
export const light_yellow_active_DrawerFrame = n274 as Theme
export const light_yellow_active_Progress = n274 as Theme
export const light_yellow_active_TooltipArrow = n274 as Theme
const n275 = t([[12, 103],[13, 104],[14, 105],[15, 106],[16, 101],[17, 100],[19, 104],[20, 105],[21, 104],[22, 104],[23, 241],[24, 241],[25, 105],[26, 105],[27, 99]]) as Theme

export const light_yellow_active_Button = n275 as Theme
const n276 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[19, 104],[20, 105],[21, 104],[22, 106],[23, 105],[24, 106],[25, 105],[26, 105],[27, 101]]) as Theme

export const light_yellow_active_Checkbox = n276 as Theme
export const light_yellow_active_RadioGroupItem = n276 as Theme
export const light_yellow_active_Input = n276 as Theme
export const light_yellow_active_TextArea = n276 as Theme
const n277 = t([[12, 103],[13, 104],[14, 105],[15, 106],[16, 101],[17, 100],[19, 104],[20, 105],[21, 104],[22, 104],[23, 105],[24, 106],[25, 105],[26, 105],[27, 99]]) as Theme

export const light_yellow_active_Switch = n277 as Theme
export const light_yellow_active_TooltipContent = n277 as Theme
export const light_yellow_active_SliderTrack = n277 as Theme
const n278 = t([[12, 106],[13, 105],[14, 104],[15, 103],[16, 107],[17, 11],[19, 100],[20, 99],[21, 100],[22, 96],[23, 104],[24, 103],[25, 104],[26, 104],[27, 100]]) as Theme

export const light_yellow_active_SwitchThumb = n278 as Theme
const n279 = t([[12, 101],[13, 100],[14, 99],[15, 98],[16, 103],[17, 104],[19, 100],[20, 99],[21, 100],[22, 100],[23, 99],[24, 98],[25, 99],[26, 99],[27, 105]]) as Theme

export const light_yellow_active_SliderTrackActive = n279 as Theme
const n280 = t([[12, 104],[13, 103],[14, 101],[15, 100],[16, 105],[17, 106],[19, 100],[20, 99],[21, 100],[22, 98],[23, 101],[24, 100],[25, 101],[26, 101],[27, 103]]) as Theme

export const light_yellow_active_SliderThumb = n280 as Theme
export const light_yellow_active_Tooltip = n280 as Theme
export const light_yellow_active_ProgressIndicator = n280 as Theme
const n281 = t([[12, 37],[13, 38],[14, 39],[15, 40],[16, 36],[17, 36],[18, 47],[19, 46],[20, 47],[21, 46],[22, 11],[23, 39],[24, 40],[25, 39],[26, 39],[27, 45]]) as Theme

export const light_green_alt1_ListItem = n281 as Theme
const n282 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 47],[19, 46],[20, 47],[21, 46],[22, 47],[23, 41],[24, 43],[25, 41],[26, 41],[27, 43]]) as Theme

export const light_green_alt1_Card = n282 as Theme
export const light_green_alt1_DrawerFrame = n282 as Theme
export const light_green_alt1_Progress = n282 as Theme
export const light_green_alt1_TooltipArrow = n282 as Theme
const n283 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[18, 47],[19, 46],[20, 47],[21, 46],[22, 46],[23, 241],[24, 241],[25, 43],[26, 43],[27, 41]]) as Theme

export const light_green_alt1_Button = n283 as Theme
const n284 = t([[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 47],[19, 46],[20, 47],[21, 46],[22, 11],[23, 43],[24, 44],[25, 43],[26, 43],[27, 44]]) as Theme

export const light_green_alt1_Checkbox = n284 as Theme
export const light_green_alt1_RadioGroupItem = n284 as Theme
export const light_green_alt1_Input = n284 as Theme
export const light_green_alt1_TextArea = n284 as Theme
const n285 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[18, 47],[19, 46],[20, 47],[21, 46],[22, 46],[23, 43],[24, 44],[25, 43],[26, 43],[27, 41]]) as Theme

export const light_green_alt1_Switch = n285 as Theme
export const light_green_alt1_TooltipContent = n285 as Theme
export const light_green_alt1_SliderTrack = n285 as Theme
const n286 = t([[12, 11],[13, 47],[14, 46],[15, 45],[16, 11],[17, 11],[18, 37],[19, 38],[20, 37],[21, 38],[22, 36],[23, 46],[24, 45],[25, 46],[26, 46],[27, 38]]) as Theme

export const light_green_alt1_SwitchThumb = n286 as Theme
const n287 = t([[12, 44],[13, 43],[14, 41],[15, 40],[16, 45],[17, 46],[18, 37],[19, 38],[20, 37],[21, 38],[22, 38],[23, 41],[24, 40],[25, 41],[26, 41],[27, 43]]) as Theme

export const light_green_alt1_SliderTrackActive = n287 as Theme
const n288 = t([[12, 46],[13, 45],[14, 44],[15, 43],[16, 47],[17, 11],[18, 37],[19, 38],[20, 37],[21, 38],[22, 36],[23, 44],[24, 43],[25, 44],[26, 44],[27, 40]]) as Theme

export const light_green_alt1_SliderThumb = n288 as Theme
export const light_green_alt1_Tooltip = n288 as Theme
export const light_green_alt1_ProgressIndicator = n288 as Theme
const n289 = t([[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 46],[19, 45],[20, 46],[21, 45],[22, 11],[23, 40],[24, 41],[25, 40],[26, 40],[27, 44]]) as Theme

export const light_green_alt2_ListItem = n289 as Theme
const n290 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[18, 46],[19, 45],[20, 46],[21, 45],[22, 46],[23, 43],[24, 44],[25, 43],[26, 43],[27, 41]]) as Theme

export const light_green_alt2_Card = n290 as Theme
export const light_green_alt2_DrawerFrame = n290 as Theme
export const light_green_alt2_Progress = n290 as Theme
export const light_green_alt2_TooltipArrow = n290 as Theme
const n291 = t([[12, 41],[13, 43],[14, 44],[15, 45],[16, 40],[17, 39],[18, 46],[19, 45],[20, 46],[21, 45],[22, 45],[23, 241],[24, 241],[25, 44],[26, 44],[27, 40]]) as Theme

export const light_green_alt2_Button = n291 as Theme
const n292 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 46],[19, 45],[20, 46],[21, 45],[22, 47],[23, 44],[24, 45],[25, 44],[26, 44],[27, 43]]) as Theme

export const light_green_alt2_Checkbox = n292 as Theme
export const light_green_alt2_RadioGroupItem = n292 as Theme
export const light_green_alt2_Input = n292 as Theme
export const light_green_alt2_TextArea = n292 as Theme
const n293 = t([[12, 41],[13, 43],[14, 44],[15, 45],[16, 40],[17, 39],[18, 46],[19, 45],[20, 46],[21, 45],[22, 45],[23, 44],[24, 45],[25, 44],[26, 44],[27, 40]]) as Theme

export const light_green_alt2_Switch = n293 as Theme
export const light_green_alt2_TooltipContent = n293 as Theme
export const light_green_alt2_SliderTrack = n293 as Theme
const n294 = t([[12, 47],[13, 46],[14, 45],[15, 44],[16, 11],[17, 11],[18, 38],[19, 39],[20, 38],[21, 39],[22, 36],[23, 45],[24, 44],[25, 45],[26, 45],[27, 39]]) as Theme

export const light_green_alt2_SwitchThumb = n294 as Theme
const n295 = t([[12, 43],[13, 41],[14, 40],[15, 39],[16, 44],[17, 45],[18, 38],[19, 39],[20, 38],[21, 39],[22, 39],[23, 40],[24, 39],[25, 40],[26, 40],[27, 44]]) as Theme

export const light_green_alt2_SliderTrackActive = n295 as Theme
const n296 = t([[12, 45],[13, 44],[14, 43],[15, 41],[16, 46],[17, 47],[18, 38],[19, 39],[20, 38],[21, 39],[22, 37],[23, 43],[24, 41],[25, 43],[26, 43],[27, 41]]) as Theme

export const light_green_alt2_SliderThumb = n296 as Theme
export const light_green_alt2_Tooltip = n296 as Theme
export const light_green_alt2_ProgressIndicator = n296 as Theme
const n297 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[19, 44],[20, 45],[21, 44],[22, 47],[23, 41],[24, 43],[25, 41],[26, 41],[27, 43]]) as Theme

export const light_green_active_ListItem = n297 as Theme
const n298 = t([[12, 41],[13, 43],[14, 44],[15, 45],[16, 40],[17, 39],[19, 44],[20, 45],[21, 44],[22, 45],[23, 44],[24, 45],[25, 44],[26, 44],[27, 40]]) as Theme

export const light_green_active_Card = n298 as Theme
export const light_green_active_DrawerFrame = n298 as Theme
export const light_green_active_Progress = n298 as Theme
export const light_green_active_TooltipArrow = n298 as Theme
const n299 = t([[12, 43],[13, 44],[14, 45],[15, 46],[16, 41],[17, 40],[19, 44],[20, 45],[21, 44],[22, 44],[23, 241],[24, 241],[25, 45],[26, 45],[27, 39]]) as Theme

export const light_green_active_Button = n299 as Theme
const n300 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[19, 44],[20, 45],[21, 44],[22, 46],[23, 45],[24, 46],[25, 45],[26, 45],[27, 41]]) as Theme

export const light_green_active_Checkbox = n300 as Theme
export const light_green_active_RadioGroupItem = n300 as Theme
export const light_green_active_Input = n300 as Theme
export const light_green_active_TextArea = n300 as Theme
const n301 = t([[12, 43],[13, 44],[14, 45],[15, 46],[16, 41],[17, 40],[19, 44],[20, 45],[21, 44],[22, 44],[23, 45],[24, 46],[25, 45],[26, 45],[27, 39]]) as Theme

export const light_green_active_Switch = n301 as Theme
export const light_green_active_TooltipContent = n301 as Theme
export const light_green_active_SliderTrack = n301 as Theme
const n302 = t([[12, 46],[13, 45],[14, 44],[15, 43],[16, 47],[17, 11],[19, 40],[20, 39],[21, 40],[22, 36],[23, 44],[24, 43],[25, 44],[26, 44],[27, 40]]) as Theme

export const light_green_active_SwitchThumb = n302 as Theme
const n303 = t([[12, 41],[13, 40],[14, 39],[15, 38],[16, 43],[17, 44],[19, 40],[20, 39],[21, 40],[22, 40],[23, 39],[24, 38],[25, 39],[26, 39],[27, 45]]) as Theme

export const light_green_active_SliderTrackActive = n303 as Theme
const n304 = t([[12, 44],[13, 43],[14, 41],[15, 40],[16, 45],[17, 46],[19, 40],[20, 39],[21, 40],[22, 38],[23, 41],[24, 40],[25, 41],[26, 41],[27, 43]]) as Theme

export const light_green_active_SliderThumb = n304 as Theme
export const light_green_active_Tooltip = n304 as Theme
export const light_green_active_ProgressIndicator = n304 as Theme
const n305 = t([[12, 15],[13, 16],[14, 17],[15, 18],[16, 14],[17, 14],[18, 25],[19, 24],[20, 25],[21, 24],[22, 11],[23, 17],[24, 18],[25, 17],[26, 17],[27, 23]]) as Theme

export const light_blue_alt1_ListItem = n305 as Theme
const n306 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 25],[19, 24],[20, 25],[21, 24],[22, 25],[23, 19],[24, 21],[25, 19],[26, 19],[27, 21]]) as Theme

export const light_blue_alt1_Card = n306 as Theme
export const light_blue_alt1_DrawerFrame = n306 as Theme
export const light_blue_alt1_Progress = n306 as Theme
export const light_blue_alt1_TooltipArrow = n306 as Theme
const n307 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[18, 25],[19, 24],[20, 25],[21, 24],[22, 24],[23, 241],[24, 241],[25, 21],[26, 21],[27, 19]]) as Theme

export const light_blue_alt1_Button = n307 as Theme
const n308 = t([[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 25],[19, 24],[20, 25],[21, 24],[22, 11],[23, 21],[24, 22],[25, 21],[26, 21],[27, 22]]) as Theme

export const light_blue_alt1_Checkbox = n308 as Theme
export const light_blue_alt1_RadioGroupItem = n308 as Theme
export const light_blue_alt1_Input = n308 as Theme
export const light_blue_alt1_TextArea = n308 as Theme
const n309 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[18, 25],[19, 24],[20, 25],[21, 24],[22, 24],[23, 21],[24, 22],[25, 21],[26, 21],[27, 19]]) as Theme

export const light_blue_alt1_Switch = n309 as Theme
export const light_blue_alt1_TooltipContent = n309 as Theme
export const light_blue_alt1_SliderTrack = n309 as Theme
const n310 = t([[12, 11],[13, 25],[14, 24],[15, 23],[16, 11],[17, 11],[18, 15],[19, 16],[20, 15],[21, 16],[22, 14],[23, 24],[24, 23],[25, 24],[26, 24],[27, 16]]) as Theme

export const light_blue_alt1_SwitchThumb = n310 as Theme
const n311 = t([[12, 22],[13, 21],[14, 19],[15, 18],[16, 23],[17, 24],[18, 15],[19, 16],[20, 15],[21, 16],[22, 16],[23, 19],[24, 18],[25, 19],[26, 19],[27, 21]]) as Theme

export const light_blue_alt1_SliderTrackActive = n311 as Theme
const n312 = t([[12, 24],[13, 23],[14, 22],[15, 21],[16, 25],[17, 11],[18, 15],[19, 16],[20, 15],[21, 16],[22, 14],[23, 22],[24, 21],[25, 22],[26, 22],[27, 18]]) as Theme

export const light_blue_alt1_SliderThumb = n312 as Theme
export const light_blue_alt1_Tooltip = n312 as Theme
export const light_blue_alt1_ProgressIndicator = n312 as Theme
const n313 = t([[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 24],[19, 23],[20, 24],[21, 23],[22, 11],[23, 18],[24, 19],[25, 18],[26, 18],[27, 22]]) as Theme

export const light_blue_alt2_ListItem = n313 as Theme
const n314 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[18, 24],[19, 23],[20, 24],[21, 23],[22, 24],[23, 21],[24, 22],[25, 21],[26, 21],[27, 19]]) as Theme

export const light_blue_alt2_Card = n314 as Theme
export const light_blue_alt2_DrawerFrame = n314 as Theme
export const light_blue_alt2_Progress = n314 as Theme
export const light_blue_alt2_TooltipArrow = n314 as Theme
const n315 = t([[12, 19],[13, 21],[14, 22],[15, 23],[16, 18],[17, 17],[18, 24],[19, 23],[20, 24],[21, 23],[22, 23],[23, 241],[24, 241],[25, 22],[26, 22],[27, 18]]) as Theme

export const light_blue_alt2_Button = n315 as Theme
const n316 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 24],[19, 23],[20, 24],[21, 23],[22, 25],[23, 22],[24, 23],[25, 22],[26, 22],[27, 21]]) as Theme

export const light_blue_alt2_Checkbox = n316 as Theme
export const light_blue_alt2_RadioGroupItem = n316 as Theme
export const light_blue_alt2_Input = n316 as Theme
export const light_blue_alt2_TextArea = n316 as Theme
const n317 = t([[12, 19],[13, 21],[14, 22],[15, 23],[16, 18],[17, 17],[18, 24],[19, 23],[20, 24],[21, 23],[22, 23],[23, 22],[24, 23],[25, 22],[26, 22],[27, 18]]) as Theme

export const light_blue_alt2_Switch = n317 as Theme
export const light_blue_alt2_TooltipContent = n317 as Theme
export const light_blue_alt2_SliderTrack = n317 as Theme
const n318 = t([[12, 25],[13, 24],[14, 23],[15, 22],[16, 11],[17, 11],[18, 16],[19, 17],[20, 16],[21, 17],[22, 14],[23, 23],[24, 22],[25, 23],[26, 23],[27, 17]]) as Theme

export const light_blue_alt2_SwitchThumb = n318 as Theme
const n319 = t([[12, 21],[13, 19],[14, 18],[15, 17],[16, 22],[17, 23],[18, 16],[19, 17],[20, 16],[21, 17],[22, 17],[23, 18],[24, 17],[25, 18],[26, 18],[27, 22]]) as Theme

export const light_blue_alt2_SliderTrackActive = n319 as Theme
const n320 = t([[12, 23],[13, 22],[14, 21],[15, 19],[16, 24],[17, 25],[18, 16],[19, 17],[20, 16],[21, 17],[22, 15],[23, 21],[24, 19],[25, 21],[26, 21],[27, 19]]) as Theme

export const light_blue_alt2_SliderThumb = n320 as Theme
export const light_blue_alt2_Tooltip = n320 as Theme
export const light_blue_alt2_ProgressIndicator = n320 as Theme
const n321 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[19, 22],[20, 23],[21, 22],[22, 25],[23, 19],[24, 21],[25, 19],[26, 19],[27, 21]]) as Theme

export const light_blue_active_ListItem = n321 as Theme
const n322 = t([[12, 19],[13, 21],[14, 22],[15, 23],[16, 18],[17, 17],[19, 22],[20, 23],[21, 22],[22, 23],[23, 22],[24, 23],[25, 22],[26, 22],[27, 18]]) as Theme

export const light_blue_active_Card = n322 as Theme
export const light_blue_active_DrawerFrame = n322 as Theme
export const light_blue_active_Progress = n322 as Theme
export const light_blue_active_TooltipArrow = n322 as Theme
const n323 = t([[12, 21],[13, 22],[14, 23],[15, 24],[16, 19],[17, 18],[19, 22],[20, 23],[21, 22],[22, 22],[23, 241],[24, 241],[25, 23],[26, 23],[27, 17]]) as Theme

export const light_blue_active_Button = n323 as Theme
const n324 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[19, 22],[20, 23],[21, 22],[22, 24],[23, 23],[24, 24],[25, 23],[26, 23],[27, 19]]) as Theme

export const light_blue_active_Checkbox = n324 as Theme
export const light_blue_active_RadioGroupItem = n324 as Theme
export const light_blue_active_Input = n324 as Theme
export const light_blue_active_TextArea = n324 as Theme
const n325 = t([[12, 21],[13, 22],[14, 23],[15, 24],[16, 19],[17, 18],[19, 22],[20, 23],[21, 22],[22, 22],[23, 23],[24, 24],[25, 23],[26, 23],[27, 17]]) as Theme

export const light_blue_active_Switch = n325 as Theme
export const light_blue_active_TooltipContent = n325 as Theme
export const light_blue_active_SliderTrack = n325 as Theme
const n326 = t([[12, 24],[13, 23],[14, 22],[15, 21],[16, 25],[17, 11],[19, 18],[20, 17],[21, 18],[22, 14],[23, 22],[24, 21],[25, 22],[26, 22],[27, 18]]) as Theme

export const light_blue_active_SwitchThumb = n326 as Theme
const n327 = t([[12, 19],[13, 18],[14, 17],[15, 16],[16, 21],[17, 22],[19, 18],[20, 17],[21, 18],[22, 18],[23, 17],[24, 16],[25, 17],[26, 17],[27, 23]]) as Theme

export const light_blue_active_SliderTrackActive = n327 as Theme
const n328 = t([[12, 22],[13, 21],[14, 19],[15, 18],[16, 23],[17, 24],[19, 18],[20, 17],[21, 18],[22, 16],[23, 19],[24, 18],[25, 19],[26, 19],[27, 21]]) as Theme

export const light_blue_active_SliderThumb = n328 as Theme
export const light_blue_active_Tooltip = n328 as Theme
export const light_blue_active_ProgressIndicator = n328 as Theme
const n329 = t([[12, 73],[13, 74],[14, 75],[15, 76],[16, 72],[17, 72],[18, 83],[19, 82],[20, 83],[21, 82],[22, 11],[23, 75],[24, 76],[25, 75],[26, 75],[27, 81]]) as Theme

export const light_purple_alt1_ListItem = n329 as Theme
const n330 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 83],[19, 82],[20, 83],[21, 82],[22, 83],[23, 77],[24, 79],[25, 77],[26, 77],[27, 79]]) as Theme

export const light_purple_alt1_Card = n330 as Theme
export const light_purple_alt1_DrawerFrame = n330 as Theme
export const light_purple_alt1_Progress = n330 as Theme
export const light_purple_alt1_TooltipArrow = n330 as Theme
const n331 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[18, 83],[19, 82],[20, 83],[21, 82],[22, 82],[23, 241],[24, 241],[25, 79],[26, 79],[27, 77]]) as Theme

export const light_purple_alt1_Button = n331 as Theme
const n332 = t([[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 83],[19, 82],[20, 83],[21, 82],[22, 11],[23, 79],[24, 80],[25, 79],[26, 79],[27, 80]]) as Theme

export const light_purple_alt1_Checkbox = n332 as Theme
export const light_purple_alt1_RadioGroupItem = n332 as Theme
export const light_purple_alt1_Input = n332 as Theme
export const light_purple_alt1_TextArea = n332 as Theme
const n333 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[18, 83],[19, 82],[20, 83],[21, 82],[22, 82],[23, 79],[24, 80],[25, 79],[26, 79],[27, 77]]) as Theme

export const light_purple_alt1_Switch = n333 as Theme
export const light_purple_alt1_TooltipContent = n333 as Theme
export const light_purple_alt1_SliderTrack = n333 as Theme
const n334 = t([[12, 11],[13, 83],[14, 82],[15, 81],[16, 11],[17, 11],[18, 73],[19, 74],[20, 73],[21, 74],[22, 72],[23, 82],[24, 81],[25, 82],[26, 82],[27, 74]]) as Theme

export const light_purple_alt1_SwitchThumb = n334 as Theme
const n335 = t([[12, 80],[13, 79],[14, 77],[15, 76],[16, 81],[17, 82],[18, 73],[19, 74],[20, 73],[21, 74],[22, 74],[23, 77],[24, 76],[25, 77],[26, 77],[27, 79]]) as Theme

export const light_purple_alt1_SliderTrackActive = n335 as Theme
const n336 = t([[12, 82],[13, 81],[14, 80],[15, 79],[16, 83],[17, 11],[18, 73],[19, 74],[20, 73],[21, 74],[22, 72],[23, 80],[24, 79],[25, 80],[26, 80],[27, 76]]) as Theme

export const light_purple_alt1_SliderThumb = n336 as Theme
export const light_purple_alt1_Tooltip = n336 as Theme
export const light_purple_alt1_ProgressIndicator = n336 as Theme
const n337 = t([[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 82],[19, 81],[20, 82],[21, 81],[22, 11],[23, 76],[24, 77],[25, 76],[26, 76],[27, 80]]) as Theme

export const light_purple_alt2_ListItem = n337 as Theme
const n338 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[18, 82],[19, 81],[20, 82],[21, 81],[22, 82],[23, 79],[24, 80],[25, 79],[26, 79],[27, 77]]) as Theme

export const light_purple_alt2_Card = n338 as Theme
export const light_purple_alt2_DrawerFrame = n338 as Theme
export const light_purple_alt2_Progress = n338 as Theme
export const light_purple_alt2_TooltipArrow = n338 as Theme
const n339 = t([[12, 77],[13, 79],[14, 80],[15, 81],[16, 76],[17, 75],[18, 82],[19, 81],[20, 82],[21, 81],[22, 81],[23, 241],[24, 241],[25, 80],[26, 80],[27, 76]]) as Theme

export const light_purple_alt2_Button = n339 as Theme
const n340 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 82],[19, 81],[20, 82],[21, 81],[22, 83],[23, 80],[24, 81],[25, 80],[26, 80],[27, 79]]) as Theme

export const light_purple_alt2_Checkbox = n340 as Theme
export const light_purple_alt2_RadioGroupItem = n340 as Theme
export const light_purple_alt2_Input = n340 as Theme
export const light_purple_alt2_TextArea = n340 as Theme
const n341 = t([[12, 77],[13, 79],[14, 80],[15, 81],[16, 76],[17, 75],[18, 82],[19, 81],[20, 82],[21, 81],[22, 81],[23, 80],[24, 81],[25, 80],[26, 80],[27, 76]]) as Theme

export const light_purple_alt2_Switch = n341 as Theme
export const light_purple_alt2_TooltipContent = n341 as Theme
export const light_purple_alt2_SliderTrack = n341 as Theme
const n342 = t([[12, 83],[13, 82],[14, 81],[15, 80],[16, 11],[17, 11],[18, 74],[19, 75],[20, 74],[21, 75],[22, 72],[23, 81],[24, 80],[25, 81],[26, 81],[27, 75]]) as Theme

export const light_purple_alt2_SwitchThumb = n342 as Theme
const n343 = t([[12, 79],[13, 77],[14, 76],[15, 75],[16, 80],[17, 81],[18, 74],[19, 75],[20, 74],[21, 75],[22, 75],[23, 76],[24, 75],[25, 76],[26, 76],[27, 80]]) as Theme

export const light_purple_alt2_SliderTrackActive = n343 as Theme
const n344 = t([[12, 81],[13, 80],[14, 79],[15, 77],[16, 82],[17, 83],[18, 74],[19, 75],[20, 74],[21, 75],[22, 73],[23, 79],[24, 77],[25, 79],[26, 79],[27, 77]]) as Theme

export const light_purple_alt2_SliderThumb = n344 as Theme
export const light_purple_alt2_Tooltip = n344 as Theme
export const light_purple_alt2_ProgressIndicator = n344 as Theme
const n345 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[19, 80],[20, 81],[21, 80],[22, 83],[23, 77],[24, 79],[25, 77],[26, 77],[27, 79]]) as Theme

export const light_purple_active_ListItem = n345 as Theme
const n346 = t([[12, 77],[13, 79],[14, 80],[15, 81],[16, 76],[17, 75],[19, 80],[20, 81],[21, 80],[22, 81],[23, 80],[24, 81],[25, 80],[26, 80],[27, 76]]) as Theme

export const light_purple_active_Card = n346 as Theme
export const light_purple_active_DrawerFrame = n346 as Theme
export const light_purple_active_Progress = n346 as Theme
export const light_purple_active_TooltipArrow = n346 as Theme
const n347 = t([[12, 79],[13, 80],[14, 81],[15, 82],[16, 77],[17, 76],[19, 80],[20, 81],[21, 80],[22, 80],[23, 241],[24, 241],[25, 81],[26, 81],[27, 75]]) as Theme

export const light_purple_active_Button = n347 as Theme
const n348 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[19, 80],[20, 81],[21, 80],[22, 82],[23, 81],[24, 82],[25, 81],[26, 81],[27, 77]]) as Theme

export const light_purple_active_Checkbox = n348 as Theme
export const light_purple_active_RadioGroupItem = n348 as Theme
export const light_purple_active_Input = n348 as Theme
export const light_purple_active_TextArea = n348 as Theme
const n349 = t([[12, 79],[13, 80],[14, 81],[15, 82],[16, 77],[17, 76],[19, 80],[20, 81],[21, 80],[22, 80],[23, 81],[24, 82],[25, 81],[26, 81],[27, 75]]) as Theme

export const light_purple_active_Switch = n349 as Theme
export const light_purple_active_TooltipContent = n349 as Theme
export const light_purple_active_SliderTrack = n349 as Theme
const n350 = t([[12, 82],[13, 81],[14, 80],[15, 79],[16, 83],[17, 11],[19, 76],[20, 75],[21, 76],[22, 72],[23, 80],[24, 79],[25, 80],[26, 80],[27, 76]]) as Theme

export const light_purple_active_SwitchThumb = n350 as Theme
const n351 = t([[12, 77],[13, 76],[14, 75],[15, 74],[16, 79],[17, 80],[19, 76],[20, 75],[21, 76],[22, 76],[23, 75],[24, 74],[25, 75],[26, 75],[27, 81]]) as Theme

export const light_purple_active_SliderTrackActive = n351 as Theme
const n352 = t([[12, 80],[13, 79],[14, 77],[15, 76],[16, 81],[17, 82],[19, 76],[20, 75],[21, 76],[22, 74],[23, 77],[24, 76],[25, 77],[26, 77],[27, 79]]) as Theme

export const light_purple_active_SliderThumb = n352 as Theme
export const light_purple_active_Tooltip = n352 as Theme
export const light_purple_active_ProgressIndicator = n352 as Theme
const n353 = t([[12, 61],[13, 62],[14, 63],[15, 64],[16, 60],[17, 60],[18, 71],[19, 70],[20, 71],[21, 70],[22, 11],[23, 63],[24, 64],[25, 63],[26, 63],[27, 69]]) as Theme

export const light_pink_alt1_ListItem = n353 as Theme
const n354 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 71],[19, 70],[20, 71],[21, 70],[22, 71],[23, 65],[24, 67],[25, 65],[26, 65],[27, 67]]) as Theme

export const light_pink_alt1_Card = n354 as Theme
export const light_pink_alt1_DrawerFrame = n354 as Theme
export const light_pink_alt1_Progress = n354 as Theme
export const light_pink_alt1_TooltipArrow = n354 as Theme
const n355 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[18, 71],[19, 70],[20, 71],[21, 70],[22, 70],[23, 241],[24, 241],[25, 67],[26, 67],[27, 65]]) as Theme

export const light_pink_alt1_Button = n355 as Theme
const n356 = t([[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 71],[19, 70],[20, 71],[21, 70],[22, 11],[23, 67],[24, 68],[25, 67],[26, 67],[27, 68]]) as Theme

export const light_pink_alt1_Checkbox = n356 as Theme
export const light_pink_alt1_RadioGroupItem = n356 as Theme
export const light_pink_alt1_Input = n356 as Theme
export const light_pink_alt1_TextArea = n356 as Theme
const n357 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[18, 71],[19, 70],[20, 71],[21, 70],[22, 70],[23, 67],[24, 68],[25, 67],[26, 67],[27, 65]]) as Theme

export const light_pink_alt1_Switch = n357 as Theme
export const light_pink_alt1_TooltipContent = n357 as Theme
export const light_pink_alt1_SliderTrack = n357 as Theme
const n358 = t([[12, 11],[13, 71],[14, 70],[15, 69],[16, 11],[17, 11],[18, 61],[19, 62],[20, 61],[21, 62],[22, 60],[23, 70],[24, 69],[25, 70],[26, 70],[27, 62]]) as Theme

export const light_pink_alt1_SwitchThumb = n358 as Theme
const n359 = t([[12, 68],[13, 67],[14, 65],[15, 64],[16, 69],[17, 70],[18, 61],[19, 62],[20, 61],[21, 62],[22, 62],[23, 65],[24, 64],[25, 65],[26, 65],[27, 67]]) as Theme

export const light_pink_alt1_SliderTrackActive = n359 as Theme
const n360 = t([[12, 70],[13, 69],[14, 68],[15, 67],[16, 71],[17, 11],[18, 61],[19, 62],[20, 61],[21, 62],[22, 60],[23, 68],[24, 67],[25, 68],[26, 68],[27, 64]]) as Theme

export const light_pink_alt1_SliderThumb = n360 as Theme
export const light_pink_alt1_Tooltip = n360 as Theme
export const light_pink_alt1_ProgressIndicator = n360 as Theme
const n361 = t([[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 70],[19, 69],[20, 70],[21, 69],[22, 11],[23, 64],[24, 65],[25, 64],[26, 64],[27, 68]]) as Theme

export const light_pink_alt2_ListItem = n361 as Theme
const n362 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[18, 70],[19, 69],[20, 70],[21, 69],[22, 70],[23, 67],[24, 68],[25, 67],[26, 67],[27, 65]]) as Theme

export const light_pink_alt2_Card = n362 as Theme
export const light_pink_alt2_DrawerFrame = n362 as Theme
export const light_pink_alt2_Progress = n362 as Theme
export const light_pink_alt2_TooltipArrow = n362 as Theme
const n363 = t([[12, 65],[13, 67],[14, 68],[15, 69],[16, 64],[17, 63],[18, 70],[19, 69],[20, 70],[21, 69],[22, 69],[23, 241],[24, 241],[25, 68],[26, 68],[27, 64]]) as Theme

export const light_pink_alt2_Button = n363 as Theme
const n364 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 70],[19, 69],[20, 70],[21, 69],[22, 71],[23, 68],[24, 69],[25, 68],[26, 68],[27, 67]]) as Theme

export const light_pink_alt2_Checkbox = n364 as Theme
export const light_pink_alt2_RadioGroupItem = n364 as Theme
export const light_pink_alt2_Input = n364 as Theme
export const light_pink_alt2_TextArea = n364 as Theme
const n365 = t([[12, 65],[13, 67],[14, 68],[15, 69],[16, 64],[17, 63],[18, 70],[19, 69],[20, 70],[21, 69],[22, 69],[23, 68],[24, 69],[25, 68],[26, 68],[27, 64]]) as Theme

export const light_pink_alt2_Switch = n365 as Theme
export const light_pink_alt2_TooltipContent = n365 as Theme
export const light_pink_alt2_SliderTrack = n365 as Theme
const n366 = t([[12, 71],[13, 70],[14, 69],[15, 68],[16, 11],[17, 11],[18, 62],[19, 63],[20, 62],[21, 63],[22, 60],[23, 69],[24, 68],[25, 69],[26, 69],[27, 63]]) as Theme

export const light_pink_alt2_SwitchThumb = n366 as Theme
const n367 = t([[12, 67],[13, 65],[14, 64],[15, 63],[16, 68],[17, 69],[18, 62],[19, 63],[20, 62],[21, 63],[22, 63],[23, 64],[24, 63],[25, 64],[26, 64],[27, 68]]) as Theme

export const light_pink_alt2_SliderTrackActive = n367 as Theme
const n368 = t([[12, 69],[13, 68],[14, 67],[15, 65],[16, 70],[17, 71],[18, 62],[19, 63],[20, 62],[21, 63],[22, 61],[23, 67],[24, 65],[25, 67],[26, 67],[27, 65]]) as Theme

export const light_pink_alt2_SliderThumb = n368 as Theme
export const light_pink_alt2_Tooltip = n368 as Theme
export const light_pink_alt2_ProgressIndicator = n368 as Theme
const n369 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[19, 68],[20, 69],[21, 68],[22, 71],[23, 65],[24, 67],[25, 65],[26, 65],[27, 67]]) as Theme

export const light_pink_active_ListItem = n369 as Theme
const n370 = t([[12, 65],[13, 67],[14, 68],[15, 69],[16, 64],[17, 63],[19, 68],[20, 69],[21, 68],[22, 69],[23, 68],[24, 69],[25, 68],[26, 68],[27, 64]]) as Theme

export const light_pink_active_Card = n370 as Theme
export const light_pink_active_DrawerFrame = n370 as Theme
export const light_pink_active_Progress = n370 as Theme
export const light_pink_active_TooltipArrow = n370 as Theme
const n371 = t([[12, 67],[13, 68],[14, 69],[15, 70],[16, 65],[17, 64],[19, 68],[20, 69],[21, 68],[22, 68],[23, 241],[24, 241],[25, 69],[26, 69],[27, 63]]) as Theme

export const light_pink_active_Button = n371 as Theme
const n372 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[19, 68],[20, 69],[21, 68],[22, 70],[23, 69],[24, 70],[25, 69],[26, 69],[27, 65]]) as Theme

export const light_pink_active_Checkbox = n372 as Theme
export const light_pink_active_RadioGroupItem = n372 as Theme
export const light_pink_active_Input = n372 as Theme
export const light_pink_active_TextArea = n372 as Theme
const n373 = t([[12, 67],[13, 68],[14, 69],[15, 70],[16, 65],[17, 64],[19, 68],[20, 69],[21, 68],[22, 68],[23, 69],[24, 70],[25, 69],[26, 69],[27, 63]]) as Theme

export const light_pink_active_Switch = n373 as Theme
export const light_pink_active_TooltipContent = n373 as Theme
export const light_pink_active_SliderTrack = n373 as Theme
const n374 = t([[12, 70],[13, 69],[14, 68],[15, 67],[16, 71],[17, 11],[19, 64],[20, 63],[21, 64],[22, 60],[23, 68],[24, 67],[25, 68],[26, 68],[27, 64]]) as Theme

export const light_pink_active_SwitchThumb = n374 as Theme
const n375 = t([[12, 65],[13, 64],[14, 63],[15, 62],[16, 67],[17, 68],[19, 64],[20, 63],[21, 64],[22, 64],[23, 63],[24, 62],[25, 63],[26, 63],[27, 69]]) as Theme

export const light_pink_active_SliderTrackActive = n375 as Theme
const n376 = t([[12, 68],[13, 67],[14, 65],[15, 64],[16, 69],[17, 70],[19, 64],[20, 63],[21, 64],[22, 62],[23, 65],[24, 64],[25, 65],[26, 65],[27, 67]]) as Theme

export const light_pink_active_SliderThumb = n376 as Theme
export const light_pink_active_Tooltip = n376 as Theme
export const light_pink_active_ProgressIndicator = n376 as Theme
const n377 = t([[12, 85],[13, 86],[14, 87],[15, 88],[16, 84],[17, 84],[18, 95],[19, 94],[20, 95],[21, 94],[22, 11],[23, 87],[24, 88],[25, 87],[26, 87],[27, 93]]) as Theme

export const light_red_alt1_ListItem = n377 as Theme
const n378 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 95],[19, 94],[20, 95],[21, 94],[22, 95],[23, 89],[24, 91],[25, 89],[26, 89],[27, 91]]) as Theme

export const light_red_alt1_Card = n378 as Theme
export const light_red_alt1_DrawerFrame = n378 as Theme
export const light_red_alt1_Progress = n378 as Theme
export const light_red_alt1_TooltipArrow = n378 as Theme
const n379 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[18, 95],[19, 94],[20, 95],[21, 94],[22, 94],[23, 241],[24, 241],[25, 91],[26, 91],[27, 89]]) as Theme

export const light_red_alt1_Button = n379 as Theme
const n380 = t([[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 95],[19, 94],[20, 95],[21, 94],[22, 11],[23, 91],[24, 92],[25, 91],[26, 91],[27, 92]]) as Theme

export const light_red_alt1_Checkbox = n380 as Theme
export const light_red_alt1_RadioGroupItem = n380 as Theme
export const light_red_alt1_Input = n380 as Theme
export const light_red_alt1_TextArea = n380 as Theme
const n381 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[18, 95],[19, 94],[20, 95],[21, 94],[22, 94],[23, 91],[24, 92],[25, 91],[26, 91],[27, 89]]) as Theme

export const light_red_alt1_Switch = n381 as Theme
export const light_red_alt1_TooltipContent = n381 as Theme
export const light_red_alt1_SliderTrack = n381 as Theme
const n382 = t([[12, 11],[13, 95],[14, 94],[15, 93],[16, 11],[17, 11],[18, 85],[19, 86],[20, 85],[21, 86],[22, 84],[23, 94],[24, 93],[25, 94],[26, 94],[27, 86]]) as Theme

export const light_red_alt1_SwitchThumb = n382 as Theme
const n383 = t([[12, 92],[13, 91],[14, 89],[15, 88],[16, 93],[17, 94],[18, 85],[19, 86],[20, 85],[21, 86],[22, 86],[23, 89],[24, 88],[25, 89],[26, 89],[27, 91]]) as Theme

export const light_red_alt1_SliderTrackActive = n383 as Theme
const n384 = t([[12, 94],[13, 93],[14, 92],[15, 91],[16, 95],[17, 11],[18, 85],[19, 86],[20, 85],[21, 86],[22, 84],[23, 92],[24, 91],[25, 92],[26, 92],[27, 88]]) as Theme

export const light_red_alt1_SliderThumb = n384 as Theme
export const light_red_alt1_Tooltip = n384 as Theme
export const light_red_alt1_ProgressIndicator = n384 as Theme
const n385 = t([[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 94],[19, 93],[20, 94],[21, 93],[22, 11],[23, 88],[24, 89],[25, 88],[26, 88],[27, 92]]) as Theme

export const light_red_alt2_ListItem = n385 as Theme
const n386 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[18, 94],[19, 93],[20, 94],[21, 93],[22, 94],[23, 91],[24, 92],[25, 91],[26, 91],[27, 89]]) as Theme

export const light_red_alt2_Card = n386 as Theme
export const light_red_alt2_DrawerFrame = n386 as Theme
export const light_red_alt2_Progress = n386 as Theme
export const light_red_alt2_TooltipArrow = n386 as Theme
const n387 = t([[12, 89],[13, 91],[14, 92],[15, 93],[16, 88],[17, 87],[18, 94],[19, 93],[20, 94],[21, 93],[22, 93],[23, 241],[24, 241],[25, 92],[26, 92],[27, 88]]) as Theme

export const light_red_alt2_Button = n387 as Theme
const n388 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 94],[19, 93],[20, 94],[21, 93],[22, 95],[23, 92],[24, 93],[25, 92],[26, 92],[27, 91]]) as Theme

export const light_red_alt2_Checkbox = n388 as Theme
export const light_red_alt2_RadioGroupItem = n388 as Theme
export const light_red_alt2_Input = n388 as Theme
export const light_red_alt2_TextArea = n388 as Theme
const n389 = t([[12, 89],[13, 91],[14, 92],[15, 93],[16, 88],[17, 87],[18, 94],[19, 93],[20, 94],[21, 93],[22, 93],[23, 92],[24, 93],[25, 92],[26, 92],[27, 88]]) as Theme

export const light_red_alt2_Switch = n389 as Theme
export const light_red_alt2_TooltipContent = n389 as Theme
export const light_red_alt2_SliderTrack = n389 as Theme
const n390 = t([[12, 95],[13, 94],[14, 93],[15, 92],[16, 11],[17, 11],[18, 86],[19, 87],[20, 86],[21, 87],[22, 84],[23, 93],[24, 92],[25, 93],[26, 93],[27, 87]]) as Theme

export const light_red_alt2_SwitchThumb = n390 as Theme
const n391 = t([[12, 91],[13, 89],[14, 88],[15, 87],[16, 92],[17, 93],[18, 86],[19, 87],[20, 86],[21, 87],[22, 87],[23, 88],[24, 87],[25, 88],[26, 88],[27, 92]]) as Theme

export const light_red_alt2_SliderTrackActive = n391 as Theme
const n392 = t([[12, 93],[13, 92],[14, 91],[15, 89],[16, 94],[17, 95],[18, 86],[19, 87],[20, 86],[21, 87],[22, 85],[23, 91],[24, 89],[25, 91],[26, 91],[27, 89]]) as Theme

export const light_red_alt2_SliderThumb = n392 as Theme
export const light_red_alt2_Tooltip = n392 as Theme
export const light_red_alt2_ProgressIndicator = n392 as Theme
const n393 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[19, 92],[20, 93],[21, 92],[22, 95],[23, 89],[24, 91],[25, 89],[26, 89],[27, 91]]) as Theme

export const light_red_active_ListItem = n393 as Theme
const n394 = t([[12, 89],[13, 91],[14, 92],[15, 93],[16, 88],[17, 87],[19, 92],[20, 93],[21, 92],[22, 93],[23, 92],[24, 93],[25, 92],[26, 92],[27, 88]]) as Theme

export const light_red_active_Card = n394 as Theme
export const light_red_active_DrawerFrame = n394 as Theme
export const light_red_active_Progress = n394 as Theme
export const light_red_active_TooltipArrow = n394 as Theme
const n395 = t([[12, 91],[13, 92],[14, 93],[15, 94],[16, 89],[17, 88],[19, 92],[20, 93],[21, 92],[22, 92],[23, 241],[24, 241],[25, 93],[26, 93],[27, 87]]) as Theme

export const light_red_active_Button = n395 as Theme
const n396 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[19, 92],[20, 93],[21, 92],[22, 94],[23, 93],[24, 94],[25, 93],[26, 93],[27, 89]]) as Theme

export const light_red_active_Checkbox = n396 as Theme
export const light_red_active_RadioGroupItem = n396 as Theme
export const light_red_active_Input = n396 as Theme
export const light_red_active_TextArea = n396 as Theme
const n397 = t([[12, 91],[13, 92],[14, 93],[15, 94],[16, 89],[17, 88],[19, 92],[20, 93],[21, 92],[22, 92],[23, 93],[24, 94],[25, 93],[26, 93],[27, 87]]) as Theme

export const light_red_active_Switch = n397 as Theme
export const light_red_active_TooltipContent = n397 as Theme
export const light_red_active_SliderTrack = n397 as Theme
const n398 = t([[12, 94],[13, 93],[14, 92],[15, 91],[16, 95],[17, 11],[19, 88],[20, 87],[21, 88],[22, 84],[23, 92],[24, 91],[25, 92],[26, 92],[27, 88]]) as Theme

export const light_red_active_SwitchThumb = n398 as Theme
const n399 = t([[12, 89],[13, 88],[14, 87],[15, 86],[16, 91],[17, 92],[19, 88],[20, 87],[21, 88],[22, 88],[23, 87],[24, 86],[25, 87],[26, 87],[27, 93]]) as Theme

export const light_red_active_SliderTrackActive = n399 as Theme
const n400 = t([[12, 92],[13, 91],[14, 89],[15, 88],[16, 93],[17, 94],[19, 88],[20, 87],[21, 88],[22, 86],[23, 89],[24, 88],[25, 89],[26, 89],[27, 91]]) as Theme

export const light_red_active_SliderThumb = n400 as Theme
export const light_red_active_Tooltip = n400 as Theme
export const light_red_active_ProgressIndicator = n400 as Theme
const n401 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 164],[19, 163],[20, 164],[21, 163],[22, 164],[23, 161],[24, 56],[25, 159],[26, 161],[27, 161]]) as Theme

export const dark_orange_alt1_Card = n401 as Theme
export const dark_orange_alt1_DrawerFrame = n401 as Theme
export const dark_orange_alt1_Progress = n401 as Theme
export const dark_orange_alt1_TooltipArrow = n401 as Theme
const n402 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[18, 164],[19, 163],[20, 164],[21, 163],[22, 163],[23, 241],[24, 241],[25, 161],[26, 56],[27, 159]]) as Theme

export const dark_orange_alt1_Button = n402 as Theme
const n403 = t([[12, 156],[13, 157],[14, 158],[15, 159],[16, 155],[17, 154],[18, 164],[19, 163],[20, 164],[21, 163],[22, 0],[23, 56],[24, 162],[25, 161],[26, 56],[27, 56]]) as Theme

export const dark_orange_alt1_Checkbox = n403 as Theme
export const dark_orange_alt1_RadioGroupItem = n403 as Theme
export const dark_orange_alt1_Input = n403 as Theme
export const dark_orange_alt1_TextArea = n403 as Theme
const n404 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[18, 164],[19, 163],[20, 164],[21, 163],[22, 163],[23, 56],[24, 162],[25, 161],[26, 56],[27, 159]]) as Theme

export const dark_orange_alt1_Switch = n404 as Theme
export const dark_orange_alt1_TooltipContent = n404 as Theme
export const dark_orange_alt1_SliderTrack = n404 as Theme
const n405 = t([[12, 0],[13, 164],[14, 163],[15, 162],[16, 0],[17, 0],[18, 155],[19, 156],[20, 155],[21, 156],[22, 154],[23, 162],[24, 56],[25, 163],[26, 162],[27, 156]]) as Theme

export const dark_orange_alt1_SwitchThumb = n405 as Theme
const n406 = t([[12, 56],[13, 161],[14, 159],[15, 158],[16, 162],[17, 163],[18, 155],[19, 156],[20, 155],[21, 156],[22, 156],[23, 158],[24, 157],[25, 159],[26, 158],[27, 161]]) as Theme

export const dark_orange_alt1_SliderTrackActive = n406 as Theme
const n407 = t([[12, 163],[13, 162],[14, 56],[15, 161],[16, 164],[17, 0],[18, 155],[19, 156],[20, 155],[21, 156],[22, 154],[23, 161],[24, 159],[25, 56],[26, 161],[27, 158]]) as Theme

export const dark_orange_alt1_SliderThumb = n407 as Theme
export const dark_orange_alt1_Tooltip = n407 as Theme
export const dark_orange_alt1_ProgressIndicator = n407 as Theme
const n408 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[18, 163],[19, 162],[20, 163],[21, 162],[22, 163],[23, 56],[24, 162],[25, 161],[26, 56],[27, 159]]) as Theme

export const dark_orange_alt2_Card = n408 as Theme
export const dark_orange_alt2_DrawerFrame = n408 as Theme
export const dark_orange_alt2_Progress = n408 as Theme
export const dark_orange_alt2_TooltipArrow = n408 as Theme
const n409 = t([[12, 159],[13, 161],[14, 56],[15, 162],[16, 158],[17, 157],[18, 163],[19, 162],[20, 163],[21, 162],[22, 162],[23, 241],[24, 241],[25, 56],[26, 162],[27, 158]]) as Theme

export const dark_orange_alt2_Button = n409 as Theme
const n410 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 163],[19, 162],[20, 163],[21, 162],[22, 164],[23, 162],[24, 163],[25, 56],[26, 162],[27, 161]]) as Theme

export const dark_orange_alt2_Checkbox = n410 as Theme
export const dark_orange_alt2_RadioGroupItem = n410 as Theme
export const dark_orange_alt2_Input = n410 as Theme
export const dark_orange_alt2_TextArea = n410 as Theme
const n411 = t([[12, 159],[13, 161],[14, 56],[15, 162],[16, 158],[17, 157],[18, 163],[19, 162],[20, 163],[21, 162],[22, 162],[23, 162],[24, 163],[25, 56],[26, 162],[27, 158]]) as Theme

export const dark_orange_alt2_Switch = n411 as Theme
export const dark_orange_alt2_TooltipContent = n411 as Theme
export const dark_orange_alt2_SliderTrack = n411 as Theme
const n412 = t([[12, 164],[13, 163],[14, 162],[15, 56],[16, 0],[17, 0],[18, 156],[19, 157],[20, 156],[21, 157],[22, 154],[23, 56],[24, 161],[25, 162],[26, 56],[27, 157]]) as Theme

export const dark_orange_alt2_SwitchThumb = n412 as Theme
const n413 = t([[12, 161],[13, 159],[14, 158],[15, 157],[16, 56],[17, 162],[18, 156],[19, 157],[20, 156],[21, 157],[22, 157],[23, 157],[24, 156],[25, 158],[26, 157],[27, 56]]) as Theme

export const dark_orange_alt2_SliderTrackActive = n413 as Theme
const n414 = t([[12, 162],[13, 56],[14, 161],[15, 159],[16, 163],[17, 164],[18, 156],[19, 157],[20, 156],[21, 157],[22, 155],[23, 159],[24, 158],[25, 161],[26, 159],[27, 159]]) as Theme

export const dark_orange_alt2_SliderThumb = n414 as Theme
export const dark_orange_alt2_Tooltip = n414 as Theme
export const dark_orange_alt2_ProgressIndicator = n414 as Theme
const n415 = t([[12, 159],[13, 161],[14, 56],[15, 162],[16, 158],[17, 157],[19, 56],[20, 162],[21, 56],[22, 162],[23, 162],[24, 163],[25, 56],[26, 162],[27, 158]]) as Theme

export const dark_orange_active_Card = n415 as Theme
export const dark_orange_active_DrawerFrame = n415 as Theme
export const dark_orange_active_Progress = n415 as Theme
export const dark_orange_active_TooltipArrow = n415 as Theme
const n416 = t([[12, 161],[13, 56],[14, 162],[15, 163],[16, 159],[17, 158],[19, 56],[20, 162],[21, 56],[22, 56],[23, 241],[24, 241],[25, 162],[26, 163],[27, 157]]) as Theme

export const dark_orange_active_Button = n416 as Theme
const n417 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[19, 56],[20, 162],[21, 56],[22, 163],[23, 163],[24, 164],[25, 162],[26, 163],[27, 159]]) as Theme

export const dark_orange_active_Checkbox = n417 as Theme
export const dark_orange_active_RadioGroupItem = n417 as Theme
export const dark_orange_active_Input = n417 as Theme
export const dark_orange_active_TextArea = n417 as Theme
const n418 = t([[12, 161],[13, 56],[14, 162],[15, 163],[16, 159],[17, 158],[19, 56],[20, 162],[21, 56],[22, 56],[23, 163],[24, 164],[25, 162],[26, 163],[27, 157]]) as Theme

export const dark_orange_active_Switch = n418 as Theme
export const dark_orange_active_TooltipContent = n418 as Theme
export const dark_orange_active_SliderTrack = n418 as Theme
const n419 = t([[12, 163],[13, 162],[14, 56],[15, 161],[16, 164],[17, 0],[19, 158],[20, 157],[21, 158],[22, 154],[23, 161],[24, 159],[25, 56],[26, 161],[27, 158]]) as Theme

export const dark_orange_active_SwitchThumb = n419 as Theme
const n420 = t([[12, 159],[13, 158],[14, 157],[15, 156],[16, 161],[17, 56],[19, 158],[20, 157],[21, 158],[22, 158],[23, 156],[24, 155],[25, 157],[26, 156],[27, 162]]) as Theme

export const dark_orange_active_SliderTrackActive = n420 as Theme
const n421 = t([[12, 56],[13, 161],[14, 159],[15, 158],[16, 162],[17, 163],[19, 158],[20, 157],[21, 158],[22, 156],[23, 158],[24, 157],[25, 159],[26, 158],[27, 161]]) as Theme

export const dark_orange_active_SliderThumb = n421 as Theme
export const dark_orange_active_Tooltip = n421 as Theme
export const dark_orange_active_ProgressIndicator = n421 as Theme
const n422 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 208],[19, 207],[20, 208],[21, 207],[22, 208],[23, 205],[24, 104],[25, 203],[26, 205],[27, 205]]) as Theme

export const dark_yellow_alt1_Card = n422 as Theme
export const dark_yellow_alt1_DrawerFrame = n422 as Theme
export const dark_yellow_alt1_Progress = n422 as Theme
export const dark_yellow_alt1_TooltipArrow = n422 as Theme
const n423 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[18, 208],[19, 207],[20, 208],[21, 207],[22, 207],[23, 241],[24, 241],[25, 205],[26, 104],[27, 203]]) as Theme

export const dark_yellow_alt1_Button = n423 as Theme
const n424 = t([[12, 200],[13, 201],[14, 202],[15, 203],[16, 199],[17, 198],[18, 208],[19, 207],[20, 208],[21, 207],[22, 0],[23, 104],[24, 206],[25, 205],[26, 104],[27, 104]]) as Theme

export const dark_yellow_alt1_Checkbox = n424 as Theme
export const dark_yellow_alt1_RadioGroupItem = n424 as Theme
export const dark_yellow_alt1_Input = n424 as Theme
export const dark_yellow_alt1_TextArea = n424 as Theme
const n425 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[18, 208],[19, 207],[20, 208],[21, 207],[22, 207],[23, 104],[24, 206],[25, 205],[26, 104],[27, 203]]) as Theme

export const dark_yellow_alt1_Switch = n425 as Theme
export const dark_yellow_alt1_TooltipContent = n425 as Theme
export const dark_yellow_alt1_SliderTrack = n425 as Theme
const n426 = t([[12, 0],[13, 208],[14, 207],[15, 206],[16, 0],[17, 0],[18, 199],[19, 200],[20, 199],[21, 200],[22, 198],[23, 206],[24, 104],[25, 207],[26, 206],[27, 200]]) as Theme

export const dark_yellow_alt1_SwitchThumb = n426 as Theme
const n427 = t([[12, 104],[13, 205],[14, 203],[15, 202],[16, 206],[17, 207],[18, 199],[19, 200],[20, 199],[21, 200],[22, 200],[23, 202],[24, 201],[25, 203],[26, 202],[27, 205]]) as Theme

export const dark_yellow_alt1_SliderTrackActive = n427 as Theme
const n428 = t([[12, 207],[13, 206],[14, 104],[15, 205],[16, 208],[17, 0],[18, 199],[19, 200],[20, 199],[21, 200],[22, 198],[23, 205],[24, 203],[25, 104],[26, 205],[27, 202]]) as Theme

export const dark_yellow_alt1_SliderThumb = n428 as Theme
export const dark_yellow_alt1_Tooltip = n428 as Theme
export const dark_yellow_alt1_ProgressIndicator = n428 as Theme
const n429 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[18, 207],[19, 206],[20, 207],[21, 206],[22, 207],[23, 104],[24, 206],[25, 205],[26, 104],[27, 203]]) as Theme

export const dark_yellow_alt2_Card = n429 as Theme
export const dark_yellow_alt2_DrawerFrame = n429 as Theme
export const dark_yellow_alt2_Progress = n429 as Theme
export const dark_yellow_alt2_TooltipArrow = n429 as Theme
const n430 = t([[12, 203],[13, 205],[14, 104],[15, 206],[16, 202],[17, 201],[18, 207],[19, 206],[20, 207],[21, 206],[22, 206],[23, 241],[24, 241],[25, 104],[26, 206],[27, 202]]) as Theme

export const dark_yellow_alt2_Button = n430 as Theme
const n431 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 207],[19, 206],[20, 207],[21, 206],[22, 208],[23, 206],[24, 207],[25, 104],[26, 206],[27, 205]]) as Theme

export const dark_yellow_alt2_Checkbox = n431 as Theme
export const dark_yellow_alt2_RadioGroupItem = n431 as Theme
export const dark_yellow_alt2_Input = n431 as Theme
export const dark_yellow_alt2_TextArea = n431 as Theme
const n432 = t([[12, 203],[13, 205],[14, 104],[15, 206],[16, 202],[17, 201],[18, 207],[19, 206],[20, 207],[21, 206],[22, 206],[23, 206],[24, 207],[25, 104],[26, 206],[27, 202]]) as Theme

export const dark_yellow_alt2_Switch = n432 as Theme
export const dark_yellow_alt2_TooltipContent = n432 as Theme
export const dark_yellow_alt2_SliderTrack = n432 as Theme
const n433 = t([[12, 208],[13, 207],[14, 206],[15, 104],[16, 0],[17, 0],[18, 200],[19, 201],[20, 200],[21, 201],[22, 198],[23, 104],[24, 205],[25, 206],[26, 104],[27, 201]]) as Theme

export const dark_yellow_alt2_SwitchThumb = n433 as Theme
const n434 = t([[12, 205],[13, 203],[14, 202],[15, 201],[16, 104],[17, 206],[18, 200],[19, 201],[20, 200],[21, 201],[22, 201],[23, 201],[24, 200],[25, 202],[26, 201],[27, 104]]) as Theme

export const dark_yellow_alt2_SliderTrackActive = n434 as Theme
const n435 = t([[12, 206],[13, 104],[14, 205],[15, 203],[16, 207],[17, 208],[18, 200],[19, 201],[20, 200],[21, 201],[22, 199],[23, 203],[24, 202],[25, 205],[26, 203],[27, 203]]) as Theme

export const dark_yellow_alt2_SliderThumb = n435 as Theme
export const dark_yellow_alt2_Tooltip = n435 as Theme
export const dark_yellow_alt2_ProgressIndicator = n435 as Theme
const n436 = t([[12, 203],[13, 205],[14, 104],[15, 206],[16, 202],[17, 201],[19, 104],[20, 206],[21, 104],[22, 206],[23, 206],[24, 207],[25, 104],[26, 206],[27, 202]]) as Theme

export const dark_yellow_active_Card = n436 as Theme
export const dark_yellow_active_DrawerFrame = n436 as Theme
export const dark_yellow_active_Progress = n436 as Theme
export const dark_yellow_active_TooltipArrow = n436 as Theme
const n437 = t([[12, 205],[13, 104],[14, 206],[15, 207],[16, 203],[17, 202],[19, 104],[20, 206],[21, 104],[22, 104],[23, 241],[24, 241],[25, 206],[26, 207],[27, 201]]) as Theme

export const dark_yellow_active_Button = n437 as Theme
const n438 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[19, 104],[20, 206],[21, 104],[22, 207],[23, 207],[24, 208],[25, 206],[26, 207],[27, 203]]) as Theme

export const dark_yellow_active_Checkbox = n438 as Theme
export const dark_yellow_active_RadioGroupItem = n438 as Theme
export const dark_yellow_active_Input = n438 as Theme
export const dark_yellow_active_TextArea = n438 as Theme
const n439 = t([[12, 205],[13, 104],[14, 206],[15, 207],[16, 203],[17, 202],[19, 104],[20, 206],[21, 104],[22, 104],[23, 207],[24, 208],[25, 206],[26, 207],[27, 201]]) as Theme

export const dark_yellow_active_Switch = n439 as Theme
export const dark_yellow_active_TooltipContent = n439 as Theme
export const dark_yellow_active_SliderTrack = n439 as Theme
const n440 = t([[12, 207],[13, 206],[14, 104],[15, 205],[16, 208],[17, 0],[19, 202],[20, 201],[21, 202],[22, 198],[23, 205],[24, 203],[25, 104],[26, 205],[27, 202]]) as Theme

export const dark_yellow_active_SwitchThumb = n440 as Theme
const n441 = t([[12, 203],[13, 202],[14, 201],[15, 200],[16, 205],[17, 104],[19, 202],[20, 201],[21, 202],[22, 202],[23, 200],[24, 199],[25, 201],[26, 200],[27, 206]]) as Theme

export const dark_yellow_active_SliderTrackActive = n441 as Theme
const n442 = t([[12, 104],[13, 205],[14, 203],[15, 202],[16, 206],[17, 207],[19, 202],[20, 201],[21, 202],[22, 200],[23, 202],[24, 201],[25, 203],[26, 202],[27, 205]]) as Theme

export const dark_yellow_active_SliderThumb = n442 as Theme
export const dark_yellow_active_Tooltip = n442 as Theme
export const dark_yellow_active_ProgressIndicator = n442 as Theme
const n443 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 153],[19, 152],[20, 153],[21, 152],[22, 153],[23, 150],[24, 44],[25, 148],[26, 150],[27, 150]]) as Theme

export const dark_green_alt1_Card = n443 as Theme
export const dark_green_alt1_DrawerFrame = n443 as Theme
export const dark_green_alt1_Progress = n443 as Theme
export const dark_green_alt1_TooltipArrow = n443 as Theme
const n444 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[18, 153],[19, 152],[20, 153],[21, 152],[22, 152],[23, 241],[24, 241],[25, 150],[26, 44],[27, 148]]) as Theme

export const dark_green_alt1_Button = n444 as Theme
const n445 = t([[12, 145],[13, 146],[14, 147],[15, 148],[16, 144],[17, 143],[18, 153],[19, 152],[20, 153],[21, 152],[22, 0],[23, 44],[24, 151],[25, 150],[26, 44],[27, 44]]) as Theme

export const dark_green_alt1_Checkbox = n445 as Theme
export const dark_green_alt1_RadioGroupItem = n445 as Theme
export const dark_green_alt1_Input = n445 as Theme
export const dark_green_alt1_TextArea = n445 as Theme
const n446 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[18, 153],[19, 152],[20, 153],[21, 152],[22, 152],[23, 44],[24, 151],[25, 150],[26, 44],[27, 148]]) as Theme

export const dark_green_alt1_Switch = n446 as Theme
export const dark_green_alt1_TooltipContent = n446 as Theme
export const dark_green_alt1_SliderTrack = n446 as Theme
const n447 = t([[12, 0],[13, 153],[14, 152],[15, 151],[16, 0],[17, 0],[18, 144],[19, 145],[20, 144],[21, 145],[22, 143],[23, 151],[24, 44],[25, 152],[26, 151],[27, 145]]) as Theme

export const dark_green_alt1_SwitchThumb = n447 as Theme
const n448 = t([[12, 44],[13, 150],[14, 148],[15, 147],[16, 151],[17, 152],[18, 144],[19, 145],[20, 144],[21, 145],[22, 145],[23, 147],[24, 146],[25, 148],[26, 147],[27, 150]]) as Theme

export const dark_green_alt1_SliderTrackActive = n448 as Theme
const n449 = t([[12, 152],[13, 151],[14, 44],[15, 150],[16, 153],[17, 0],[18, 144],[19, 145],[20, 144],[21, 145],[22, 143],[23, 150],[24, 148],[25, 44],[26, 150],[27, 147]]) as Theme

export const dark_green_alt1_SliderThumb = n449 as Theme
export const dark_green_alt1_Tooltip = n449 as Theme
export const dark_green_alt1_ProgressIndicator = n449 as Theme
const n450 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[18, 152],[19, 151],[20, 152],[21, 151],[22, 152],[23, 44],[24, 151],[25, 150],[26, 44],[27, 148]]) as Theme

export const dark_green_alt2_Card = n450 as Theme
export const dark_green_alt2_DrawerFrame = n450 as Theme
export const dark_green_alt2_Progress = n450 as Theme
export const dark_green_alt2_TooltipArrow = n450 as Theme
const n451 = t([[12, 148],[13, 150],[14, 44],[15, 151],[16, 147],[17, 146],[18, 152],[19, 151],[20, 152],[21, 151],[22, 151],[23, 241],[24, 241],[25, 44],[26, 151],[27, 147]]) as Theme

export const dark_green_alt2_Button = n451 as Theme
const n452 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 152],[19, 151],[20, 152],[21, 151],[22, 153],[23, 151],[24, 152],[25, 44],[26, 151],[27, 150]]) as Theme

export const dark_green_alt2_Checkbox = n452 as Theme
export const dark_green_alt2_RadioGroupItem = n452 as Theme
export const dark_green_alt2_Input = n452 as Theme
export const dark_green_alt2_TextArea = n452 as Theme
const n453 = t([[12, 148],[13, 150],[14, 44],[15, 151],[16, 147],[17, 146],[18, 152],[19, 151],[20, 152],[21, 151],[22, 151],[23, 151],[24, 152],[25, 44],[26, 151],[27, 147]]) as Theme

export const dark_green_alt2_Switch = n453 as Theme
export const dark_green_alt2_TooltipContent = n453 as Theme
export const dark_green_alt2_SliderTrack = n453 as Theme
const n454 = t([[12, 153],[13, 152],[14, 151],[15, 44],[16, 0],[17, 0],[18, 145],[19, 146],[20, 145],[21, 146],[22, 143],[23, 44],[24, 150],[25, 151],[26, 44],[27, 146]]) as Theme

export const dark_green_alt2_SwitchThumb = n454 as Theme
const n455 = t([[12, 150],[13, 148],[14, 147],[15, 146],[16, 44],[17, 151],[18, 145],[19, 146],[20, 145],[21, 146],[22, 146],[23, 146],[24, 145],[25, 147],[26, 146],[27, 44]]) as Theme

export const dark_green_alt2_SliderTrackActive = n455 as Theme
const n456 = t([[12, 151],[13, 44],[14, 150],[15, 148],[16, 152],[17, 153],[18, 145],[19, 146],[20, 145],[21, 146],[22, 144],[23, 148],[24, 147],[25, 150],[26, 148],[27, 148]]) as Theme

export const dark_green_alt2_SliderThumb = n456 as Theme
export const dark_green_alt2_Tooltip = n456 as Theme
export const dark_green_alt2_ProgressIndicator = n456 as Theme
const n457 = t([[12, 148],[13, 150],[14, 44],[15, 151],[16, 147],[17, 146],[19, 44],[20, 151],[21, 44],[22, 151],[23, 151],[24, 152],[25, 44],[26, 151],[27, 147]]) as Theme

export const dark_green_active_Card = n457 as Theme
export const dark_green_active_DrawerFrame = n457 as Theme
export const dark_green_active_Progress = n457 as Theme
export const dark_green_active_TooltipArrow = n457 as Theme
const n458 = t([[12, 150],[13, 44],[14, 151],[15, 152],[16, 148],[17, 147],[19, 44],[20, 151],[21, 44],[22, 44],[23, 241],[24, 241],[25, 151],[26, 152],[27, 146]]) as Theme

export const dark_green_active_Button = n458 as Theme
const n459 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[19, 44],[20, 151],[21, 44],[22, 152],[23, 152],[24, 153],[25, 151],[26, 152],[27, 148]]) as Theme

export const dark_green_active_Checkbox = n459 as Theme
export const dark_green_active_RadioGroupItem = n459 as Theme
export const dark_green_active_Input = n459 as Theme
export const dark_green_active_TextArea = n459 as Theme
const n460 = t([[12, 150],[13, 44],[14, 151],[15, 152],[16, 148],[17, 147],[19, 44],[20, 151],[21, 44],[22, 44],[23, 152],[24, 153],[25, 151],[26, 152],[27, 146]]) as Theme

export const dark_green_active_Switch = n460 as Theme
export const dark_green_active_TooltipContent = n460 as Theme
export const dark_green_active_SliderTrack = n460 as Theme
const n461 = t([[12, 152],[13, 151],[14, 44],[15, 150],[16, 153],[17, 0],[19, 147],[20, 146],[21, 147],[22, 143],[23, 150],[24, 148],[25, 44],[26, 150],[27, 147]]) as Theme

export const dark_green_active_SwitchThumb = n461 as Theme
const n462 = t([[12, 148],[13, 147],[14, 146],[15, 145],[16, 150],[17, 44],[19, 147],[20, 146],[21, 147],[22, 147],[23, 145],[24, 144],[25, 146],[26, 145],[27, 151]]) as Theme

export const dark_green_active_SliderTrackActive = n462 as Theme
const n463 = t([[12, 44],[13, 150],[14, 148],[15, 147],[16, 151],[17, 152],[19, 147],[20, 146],[21, 147],[22, 145],[23, 147],[24, 146],[25, 148],[26, 147],[27, 150]]) as Theme

export const dark_green_active_SliderThumb = n463 as Theme
export const dark_green_active_Tooltip = n463 as Theme
export const dark_green_active_ProgressIndicator = n463 as Theme
const n464 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 131],[19, 130],[20, 131],[21, 130],[22, 131],[23, 128],[24, 22],[25, 126],[26, 128],[27, 128]]) as Theme

export const dark_blue_alt1_Card = n464 as Theme
export const dark_blue_alt1_DrawerFrame = n464 as Theme
export const dark_blue_alt1_Progress = n464 as Theme
export const dark_blue_alt1_TooltipArrow = n464 as Theme
const n465 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[18, 131],[19, 130],[20, 131],[21, 130],[22, 130],[23, 241],[24, 241],[25, 128],[26, 22],[27, 126]]) as Theme

export const dark_blue_alt1_Button = n465 as Theme
const n466 = t([[12, 123],[13, 124],[14, 125],[15, 126],[16, 122],[17, 121],[18, 131],[19, 130],[20, 131],[21, 130],[22, 0],[23, 22],[24, 129],[25, 128],[26, 22],[27, 22]]) as Theme

export const dark_blue_alt1_Checkbox = n466 as Theme
export const dark_blue_alt1_RadioGroupItem = n466 as Theme
export const dark_blue_alt1_Input = n466 as Theme
export const dark_blue_alt1_TextArea = n466 as Theme
const n467 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[18, 131],[19, 130],[20, 131],[21, 130],[22, 130],[23, 22],[24, 129],[25, 128],[26, 22],[27, 126]]) as Theme

export const dark_blue_alt1_Switch = n467 as Theme
export const dark_blue_alt1_TooltipContent = n467 as Theme
export const dark_blue_alt1_SliderTrack = n467 as Theme
const n468 = t([[12, 0],[13, 131],[14, 130],[15, 129],[16, 0],[17, 0],[18, 122],[19, 123],[20, 122],[21, 123],[22, 121],[23, 129],[24, 22],[25, 130],[26, 129],[27, 123]]) as Theme

export const dark_blue_alt1_SwitchThumb = n468 as Theme
const n469 = t([[12, 22],[13, 128],[14, 126],[15, 125],[16, 129],[17, 130],[18, 122],[19, 123],[20, 122],[21, 123],[22, 123],[23, 125],[24, 124],[25, 126],[26, 125],[27, 128]]) as Theme

export const dark_blue_alt1_SliderTrackActive = n469 as Theme
const n470 = t([[12, 130],[13, 129],[14, 22],[15, 128],[16, 131],[17, 0],[18, 122],[19, 123],[20, 122],[21, 123],[22, 121],[23, 128],[24, 126],[25, 22],[26, 128],[27, 125]]) as Theme

export const dark_blue_alt1_SliderThumb = n470 as Theme
export const dark_blue_alt1_Tooltip = n470 as Theme
export const dark_blue_alt1_ProgressIndicator = n470 as Theme
const n471 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[18, 130],[19, 129],[20, 130],[21, 129],[22, 130],[23, 22],[24, 129],[25, 128],[26, 22],[27, 126]]) as Theme

export const dark_blue_alt2_Card = n471 as Theme
export const dark_blue_alt2_DrawerFrame = n471 as Theme
export const dark_blue_alt2_Progress = n471 as Theme
export const dark_blue_alt2_TooltipArrow = n471 as Theme
const n472 = t([[12, 126],[13, 128],[14, 22],[15, 129],[16, 125],[17, 124],[18, 130],[19, 129],[20, 130],[21, 129],[22, 129],[23, 241],[24, 241],[25, 22],[26, 129],[27, 125]]) as Theme

export const dark_blue_alt2_Button = n472 as Theme
const n473 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 130],[19, 129],[20, 130],[21, 129],[22, 131],[23, 129],[24, 130],[25, 22],[26, 129],[27, 128]]) as Theme

export const dark_blue_alt2_Checkbox = n473 as Theme
export const dark_blue_alt2_RadioGroupItem = n473 as Theme
export const dark_blue_alt2_Input = n473 as Theme
export const dark_blue_alt2_TextArea = n473 as Theme
const n474 = t([[12, 126],[13, 128],[14, 22],[15, 129],[16, 125],[17, 124],[18, 130],[19, 129],[20, 130],[21, 129],[22, 129],[23, 129],[24, 130],[25, 22],[26, 129],[27, 125]]) as Theme

export const dark_blue_alt2_Switch = n474 as Theme
export const dark_blue_alt2_TooltipContent = n474 as Theme
export const dark_blue_alt2_SliderTrack = n474 as Theme
const n475 = t([[12, 131],[13, 130],[14, 129],[15, 22],[16, 0],[17, 0],[18, 123],[19, 124],[20, 123],[21, 124],[22, 121],[23, 22],[24, 128],[25, 129],[26, 22],[27, 124]]) as Theme

export const dark_blue_alt2_SwitchThumb = n475 as Theme
const n476 = t([[12, 128],[13, 126],[14, 125],[15, 124],[16, 22],[17, 129],[18, 123],[19, 124],[20, 123],[21, 124],[22, 124],[23, 124],[24, 123],[25, 125],[26, 124],[27, 22]]) as Theme

export const dark_blue_alt2_SliderTrackActive = n476 as Theme
const n477 = t([[12, 129],[13, 22],[14, 128],[15, 126],[16, 130],[17, 131],[18, 123],[19, 124],[20, 123],[21, 124],[22, 122],[23, 126],[24, 125],[25, 128],[26, 126],[27, 126]]) as Theme

export const dark_blue_alt2_SliderThumb = n477 as Theme
export const dark_blue_alt2_Tooltip = n477 as Theme
export const dark_blue_alt2_ProgressIndicator = n477 as Theme
const n478 = t([[12, 126],[13, 128],[14, 22],[15, 129],[16, 125],[17, 124],[19, 22],[20, 129],[21, 22],[22, 129],[23, 129],[24, 130],[25, 22],[26, 129],[27, 125]]) as Theme

export const dark_blue_active_Card = n478 as Theme
export const dark_blue_active_DrawerFrame = n478 as Theme
export const dark_blue_active_Progress = n478 as Theme
export const dark_blue_active_TooltipArrow = n478 as Theme
const n479 = t([[12, 128],[13, 22],[14, 129],[15, 130],[16, 126],[17, 125],[19, 22],[20, 129],[21, 22],[22, 22],[23, 241],[24, 241],[25, 129],[26, 130],[27, 124]]) as Theme

export const dark_blue_active_Button = n479 as Theme
const n480 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[19, 22],[20, 129],[21, 22],[22, 130],[23, 130],[24, 131],[25, 129],[26, 130],[27, 126]]) as Theme

export const dark_blue_active_Checkbox = n480 as Theme
export const dark_blue_active_RadioGroupItem = n480 as Theme
export const dark_blue_active_Input = n480 as Theme
export const dark_blue_active_TextArea = n480 as Theme
const n481 = t([[12, 128],[13, 22],[14, 129],[15, 130],[16, 126],[17, 125],[19, 22],[20, 129],[21, 22],[22, 22],[23, 130],[24, 131],[25, 129],[26, 130],[27, 124]]) as Theme

export const dark_blue_active_Switch = n481 as Theme
export const dark_blue_active_TooltipContent = n481 as Theme
export const dark_blue_active_SliderTrack = n481 as Theme
const n482 = t([[12, 130],[13, 129],[14, 22],[15, 128],[16, 131],[17, 0],[19, 125],[20, 124],[21, 125],[22, 121],[23, 128],[24, 126],[25, 22],[26, 128],[27, 125]]) as Theme

export const dark_blue_active_SwitchThumb = n482 as Theme
const n483 = t([[12, 126],[13, 125],[14, 124],[15, 123],[16, 128],[17, 22],[19, 125],[20, 124],[21, 125],[22, 125],[23, 123],[24, 122],[25, 124],[26, 123],[27, 129]]) as Theme

export const dark_blue_active_SliderTrackActive = n483 as Theme
const n484 = t([[12, 22],[13, 128],[14, 126],[15, 125],[16, 129],[17, 130],[19, 125],[20, 124],[21, 125],[22, 123],[23, 125],[24, 124],[25, 126],[26, 125],[27, 128]]) as Theme

export const dark_blue_active_SliderThumb = n484 as Theme
export const dark_blue_active_Tooltip = n484 as Theme
export const dark_blue_active_ProgressIndicator = n484 as Theme
const n485 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 186],[19, 185],[20, 186],[21, 185],[22, 186],[23, 183],[24, 80],[25, 181],[26, 183],[27, 183]]) as Theme

export const dark_purple_alt1_Card = n485 as Theme
export const dark_purple_alt1_DrawerFrame = n485 as Theme
export const dark_purple_alt1_Progress = n485 as Theme
export const dark_purple_alt1_TooltipArrow = n485 as Theme
const n486 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[18, 186],[19, 185],[20, 186],[21, 185],[22, 185],[23, 241],[24, 241],[25, 183],[26, 80],[27, 181]]) as Theme

export const dark_purple_alt1_Button = n486 as Theme
const n487 = t([[12, 178],[13, 179],[14, 180],[15, 181],[16, 177],[17, 176],[18, 186],[19, 185],[20, 186],[21, 185],[22, 0],[23, 80],[24, 184],[25, 183],[26, 80],[27, 80]]) as Theme

export const dark_purple_alt1_Checkbox = n487 as Theme
export const dark_purple_alt1_RadioGroupItem = n487 as Theme
export const dark_purple_alt1_Input = n487 as Theme
export const dark_purple_alt1_TextArea = n487 as Theme
const n488 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[18, 186],[19, 185],[20, 186],[21, 185],[22, 185],[23, 80],[24, 184],[25, 183],[26, 80],[27, 181]]) as Theme

export const dark_purple_alt1_Switch = n488 as Theme
export const dark_purple_alt1_TooltipContent = n488 as Theme
export const dark_purple_alt1_SliderTrack = n488 as Theme
const n489 = t([[12, 0],[13, 186],[14, 185],[15, 184],[16, 0],[17, 0],[18, 177],[19, 178],[20, 177],[21, 178],[22, 176],[23, 184],[24, 80],[25, 185],[26, 184],[27, 178]]) as Theme

export const dark_purple_alt1_SwitchThumb = n489 as Theme
const n490 = t([[12, 80],[13, 183],[14, 181],[15, 180],[16, 184],[17, 185],[18, 177],[19, 178],[20, 177],[21, 178],[22, 178],[23, 180],[24, 179],[25, 181],[26, 180],[27, 183]]) as Theme

export const dark_purple_alt1_SliderTrackActive = n490 as Theme
const n491 = t([[12, 185],[13, 184],[14, 80],[15, 183],[16, 186],[17, 0],[18, 177],[19, 178],[20, 177],[21, 178],[22, 176],[23, 183],[24, 181],[25, 80],[26, 183],[27, 180]]) as Theme

export const dark_purple_alt1_SliderThumb = n491 as Theme
export const dark_purple_alt1_Tooltip = n491 as Theme
export const dark_purple_alt1_ProgressIndicator = n491 as Theme
const n492 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[18, 185],[19, 184],[20, 185],[21, 184],[22, 185],[23, 80],[24, 184],[25, 183],[26, 80],[27, 181]]) as Theme

export const dark_purple_alt2_Card = n492 as Theme
export const dark_purple_alt2_DrawerFrame = n492 as Theme
export const dark_purple_alt2_Progress = n492 as Theme
export const dark_purple_alt2_TooltipArrow = n492 as Theme
const n493 = t([[12, 181],[13, 183],[14, 80],[15, 184],[16, 180],[17, 179],[18, 185],[19, 184],[20, 185],[21, 184],[22, 184],[23, 241],[24, 241],[25, 80],[26, 184],[27, 180]]) as Theme

export const dark_purple_alt2_Button = n493 as Theme
const n494 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 185],[19, 184],[20, 185],[21, 184],[22, 186],[23, 184],[24, 185],[25, 80],[26, 184],[27, 183]]) as Theme

export const dark_purple_alt2_Checkbox = n494 as Theme
export const dark_purple_alt2_RadioGroupItem = n494 as Theme
export const dark_purple_alt2_Input = n494 as Theme
export const dark_purple_alt2_TextArea = n494 as Theme
const n495 = t([[12, 181],[13, 183],[14, 80],[15, 184],[16, 180],[17, 179],[18, 185],[19, 184],[20, 185],[21, 184],[22, 184],[23, 184],[24, 185],[25, 80],[26, 184],[27, 180]]) as Theme

export const dark_purple_alt2_Switch = n495 as Theme
export const dark_purple_alt2_TooltipContent = n495 as Theme
export const dark_purple_alt2_SliderTrack = n495 as Theme
const n496 = t([[12, 186],[13, 185],[14, 184],[15, 80],[16, 0],[17, 0],[18, 178],[19, 179],[20, 178],[21, 179],[22, 176],[23, 80],[24, 183],[25, 184],[26, 80],[27, 179]]) as Theme

export const dark_purple_alt2_SwitchThumb = n496 as Theme
const n497 = t([[12, 183],[13, 181],[14, 180],[15, 179],[16, 80],[17, 184],[18, 178],[19, 179],[20, 178],[21, 179],[22, 179],[23, 179],[24, 178],[25, 180],[26, 179],[27, 80]]) as Theme

export const dark_purple_alt2_SliderTrackActive = n497 as Theme
const n498 = t([[12, 184],[13, 80],[14, 183],[15, 181],[16, 185],[17, 186],[18, 178],[19, 179],[20, 178],[21, 179],[22, 177],[23, 181],[24, 180],[25, 183],[26, 181],[27, 181]]) as Theme

export const dark_purple_alt2_SliderThumb = n498 as Theme
export const dark_purple_alt2_Tooltip = n498 as Theme
export const dark_purple_alt2_ProgressIndicator = n498 as Theme
const n499 = t([[12, 181],[13, 183],[14, 80],[15, 184],[16, 180],[17, 179],[19, 80],[20, 184],[21, 80],[22, 184],[23, 184],[24, 185],[25, 80],[26, 184],[27, 180]]) as Theme

export const dark_purple_active_Card = n499 as Theme
export const dark_purple_active_DrawerFrame = n499 as Theme
export const dark_purple_active_Progress = n499 as Theme
export const dark_purple_active_TooltipArrow = n499 as Theme
const n500 = t([[12, 183],[13, 80],[14, 184],[15, 185],[16, 181],[17, 180],[19, 80],[20, 184],[21, 80],[22, 80],[23, 241],[24, 241],[25, 184],[26, 185],[27, 179]]) as Theme

export const dark_purple_active_Button = n500 as Theme
const n501 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[19, 80],[20, 184],[21, 80],[22, 185],[23, 185],[24, 186],[25, 184],[26, 185],[27, 181]]) as Theme

export const dark_purple_active_Checkbox = n501 as Theme
export const dark_purple_active_RadioGroupItem = n501 as Theme
export const dark_purple_active_Input = n501 as Theme
export const dark_purple_active_TextArea = n501 as Theme
const n502 = t([[12, 183],[13, 80],[14, 184],[15, 185],[16, 181],[17, 180],[19, 80],[20, 184],[21, 80],[22, 80],[23, 185],[24, 186],[25, 184],[26, 185],[27, 179]]) as Theme

export const dark_purple_active_Switch = n502 as Theme
export const dark_purple_active_TooltipContent = n502 as Theme
export const dark_purple_active_SliderTrack = n502 as Theme
const n503 = t([[12, 185],[13, 184],[14, 80],[15, 183],[16, 186],[17, 0],[19, 180],[20, 179],[21, 180],[22, 176],[23, 183],[24, 181],[25, 80],[26, 183],[27, 180]]) as Theme

export const dark_purple_active_SwitchThumb = n503 as Theme
const n504 = t([[12, 181],[13, 180],[14, 179],[15, 178],[16, 183],[17, 80],[19, 180],[20, 179],[21, 180],[22, 180],[23, 178],[24, 177],[25, 179],[26, 178],[27, 184]]) as Theme

export const dark_purple_active_SliderTrackActive = n504 as Theme
const n505 = t([[12, 80],[13, 183],[14, 181],[15, 180],[16, 184],[17, 185],[19, 180],[20, 179],[21, 180],[22, 178],[23, 180],[24, 179],[25, 181],[26, 180],[27, 183]]) as Theme

export const dark_purple_active_SliderThumb = n505 as Theme
export const dark_purple_active_Tooltip = n505 as Theme
export const dark_purple_active_ProgressIndicator = n505 as Theme
const n506 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 175],[19, 174],[20, 175],[21, 174],[22, 175],[23, 172],[24, 68],[25, 170],[26, 172],[27, 172]]) as Theme

export const dark_pink_alt1_Card = n506 as Theme
export const dark_pink_alt1_DrawerFrame = n506 as Theme
export const dark_pink_alt1_Progress = n506 as Theme
export const dark_pink_alt1_TooltipArrow = n506 as Theme
const n507 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[18, 175],[19, 174],[20, 175],[21, 174],[22, 174],[23, 241],[24, 241],[25, 172],[26, 68],[27, 170]]) as Theme

export const dark_pink_alt1_Button = n507 as Theme
const n508 = t([[12, 167],[13, 168],[14, 169],[15, 170],[16, 166],[17, 165],[18, 175],[19, 174],[20, 175],[21, 174],[22, 0],[23, 68],[24, 173],[25, 172],[26, 68],[27, 68]]) as Theme

export const dark_pink_alt1_Checkbox = n508 as Theme
export const dark_pink_alt1_RadioGroupItem = n508 as Theme
export const dark_pink_alt1_Input = n508 as Theme
export const dark_pink_alt1_TextArea = n508 as Theme
const n509 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[18, 175],[19, 174],[20, 175],[21, 174],[22, 174],[23, 68],[24, 173],[25, 172],[26, 68],[27, 170]]) as Theme

export const dark_pink_alt1_Switch = n509 as Theme
export const dark_pink_alt1_TooltipContent = n509 as Theme
export const dark_pink_alt1_SliderTrack = n509 as Theme
const n510 = t([[12, 0],[13, 175],[14, 174],[15, 173],[16, 0],[17, 0],[18, 166],[19, 167],[20, 166],[21, 167],[22, 165],[23, 173],[24, 68],[25, 174],[26, 173],[27, 167]]) as Theme

export const dark_pink_alt1_SwitchThumb = n510 as Theme
const n511 = t([[12, 68],[13, 172],[14, 170],[15, 169],[16, 173],[17, 174],[18, 166],[19, 167],[20, 166],[21, 167],[22, 167],[23, 169],[24, 168],[25, 170],[26, 169],[27, 172]]) as Theme

export const dark_pink_alt1_SliderTrackActive = n511 as Theme
const n512 = t([[12, 174],[13, 173],[14, 68],[15, 172],[16, 175],[17, 0],[18, 166],[19, 167],[20, 166],[21, 167],[22, 165],[23, 172],[24, 170],[25, 68],[26, 172],[27, 169]]) as Theme

export const dark_pink_alt1_SliderThumb = n512 as Theme
export const dark_pink_alt1_Tooltip = n512 as Theme
export const dark_pink_alt1_ProgressIndicator = n512 as Theme
const n513 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[18, 174],[19, 173],[20, 174],[21, 173],[22, 174],[23, 68],[24, 173],[25, 172],[26, 68],[27, 170]]) as Theme

export const dark_pink_alt2_Card = n513 as Theme
export const dark_pink_alt2_DrawerFrame = n513 as Theme
export const dark_pink_alt2_Progress = n513 as Theme
export const dark_pink_alt2_TooltipArrow = n513 as Theme
const n514 = t([[12, 170],[13, 172],[14, 68],[15, 173],[16, 169],[17, 168],[18, 174],[19, 173],[20, 174],[21, 173],[22, 173],[23, 241],[24, 241],[25, 68],[26, 173],[27, 169]]) as Theme

export const dark_pink_alt2_Button = n514 as Theme
const n515 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 174],[19, 173],[20, 174],[21, 173],[22, 175],[23, 173],[24, 174],[25, 68],[26, 173],[27, 172]]) as Theme

export const dark_pink_alt2_Checkbox = n515 as Theme
export const dark_pink_alt2_RadioGroupItem = n515 as Theme
export const dark_pink_alt2_Input = n515 as Theme
export const dark_pink_alt2_TextArea = n515 as Theme
const n516 = t([[12, 170],[13, 172],[14, 68],[15, 173],[16, 169],[17, 168],[18, 174],[19, 173],[20, 174],[21, 173],[22, 173],[23, 173],[24, 174],[25, 68],[26, 173],[27, 169]]) as Theme

export const dark_pink_alt2_Switch = n516 as Theme
export const dark_pink_alt2_TooltipContent = n516 as Theme
export const dark_pink_alt2_SliderTrack = n516 as Theme
const n517 = t([[12, 175],[13, 174],[14, 173],[15, 68],[16, 0],[17, 0],[18, 167],[19, 168],[20, 167],[21, 168],[22, 165],[23, 68],[24, 172],[25, 173],[26, 68],[27, 168]]) as Theme

export const dark_pink_alt2_SwitchThumb = n517 as Theme
const n518 = t([[12, 172],[13, 170],[14, 169],[15, 168],[16, 68],[17, 173],[18, 167],[19, 168],[20, 167],[21, 168],[22, 168],[23, 168],[24, 167],[25, 169],[26, 168],[27, 68]]) as Theme

export const dark_pink_alt2_SliderTrackActive = n518 as Theme
const n519 = t([[12, 173],[13, 68],[14, 172],[15, 170],[16, 174],[17, 175],[18, 167],[19, 168],[20, 167],[21, 168],[22, 166],[23, 170],[24, 169],[25, 172],[26, 170],[27, 170]]) as Theme

export const dark_pink_alt2_SliderThumb = n519 as Theme
export const dark_pink_alt2_Tooltip = n519 as Theme
export const dark_pink_alt2_ProgressIndicator = n519 as Theme
const n520 = t([[12, 170],[13, 172],[14, 68],[15, 173],[16, 169],[17, 168],[19, 68],[20, 173],[21, 68],[22, 173],[23, 173],[24, 174],[25, 68],[26, 173],[27, 169]]) as Theme

export const dark_pink_active_Card = n520 as Theme
export const dark_pink_active_DrawerFrame = n520 as Theme
export const dark_pink_active_Progress = n520 as Theme
export const dark_pink_active_TooltipArrow = n520 as Theme
const n521 = t([[12, 172],[13, 68],[14, 173],[15, 174],[16, 170],[17, 169],[19, 68],[20, 173],[21, 68],[22, 68],[23, 241],[24, 241],[25, 173],[26, 174],[27, 168]]) as Theme

export const dark_pink_active_Button = n521 as Theme
const n522 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[19, 68],[20, 173],[21, 68],[22, 174],[23, 174],[24, 175],[25, 173],[26, 174],[27, 170]]) as Theme

export const dark_pink_active_Checkbox = n522 as Theme
export const dark_pink_active_RadioGroupItem = n522 as Theme
export const dark_pink_active_Input = n522 as Theme
export const dark_pink_active_TextArea = n522 as Theme
const n523 = t([[12, 172],[13, 68],[14, 173],[15, 174],[16, 170],[17, 169],[19, 68],[20, 173],[21, 68],[22, 68],[23, 174],[24, 175],[25, 173],[26, 174],[27, 168]]) as Theme

export const dark_pink_active_Switch = n523 as Theme
export const dark_pink_active_TooltipContent = n523 as Theme
export const dark_pink_active_SliderTrack = n523 as Theme
const n524 = t([[12, 174],[13, 173],[14, 68],[15, 172],[16, 175],[17, 0],[19, 169],[20, 168],[21, 169],[22, 165],[23, 172],[24, 170],[25, 68],[26, 172],[27, 169]]) as Theme

export const dark_pink_active_SwitchThumb = n524 as Theme
const n525 = t([[12, 170],[13, 169],[14, 168],[15, 167],[16, 172],[17, 68],[19, 169],[20, 168],[21, 169],[22, 169],[23, 167],[24, 166],[25, 168],[26, 167],[27, 173]]) as Theme

export const dark_pink_active_SliderTrackActive = n525 as Theme
const n526 = t([[12, 68],[13, 172],[14, 170],[15, 169],[16, 173],[17, 174],[19, 169],[20, 168],[21, 169],[22, 167],[23, 169],[24, 168],[25, 170],[26, 169],[27, 172]]) as Theme

export const dark_pink_active_SliderThumb = n526 as Theme
export const dark_pink_active_Tooltip = n526 as Theme
export const dark_pink_active_ProgressIndicator = n526 as Theme
const n527 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 197],[19, 196],[20, 197],[21, 196],[22, 197],[23, 194],[24, 92],[25, 192],[26, 194],[27, 194]]) as Theme

export const dark_red_alt1_Card = n527 as Theme
export const dark_red_alt1_DrawerFrame = n527 as Theme
export const dark_red_alt1_Progress = n527 as Theme
export const dark_red_alt1_TooltipArrow = n527 as Theme
const n528 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[18, 197],[19, 196],[20, 197],[21, 196],[22, 196],[23, 241],[24, 241],[25, 194],[26, 92],[27, 192]]) as Theme

export const dark_red_alt1_Button = n528 as Theme
const n529 = t([[12, 189],[13, 190],[14, 191],[15, 192],[16, 188],[17, 187],[18, 197],[19, 196],[20, 197],[21, 196],[22, 0],[23, 92],[24, 195],[25, 194],[26, 92],[27, 92]]) as Theme

export const dark_red_alt1_Checkbox = n529 as Theme
export const dark_red_alt1_RadioGroupItem = n529 as Theme
export const dark_red_alt1_Input = n529 as Theme
export const dark_red_alt1_TextArea = n529 as Theme
const n530 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[18, 197],[19, 196],[20, 197],[21, 196],[22, 196],[23, 92],[24, 195],[25, 194],[26, 92],[27, 192]]) as Theme

export const dark_red_alt1_Switch = n530 as Theme
export const dark_red_alt1_TooltipContent = n530 as Theme
export const dark_red_alt1_SliderTrack = n530 as Theme
const n531 = t([[12, 0],[13, 197],[14, 196],[15, 195],[16, 0],[17, 0],[18, 188],[19, 189],[20, 188],[21, 189],[22, 187],[23, 195],[24, 92],[25, 196],[26, 195],[27, 189]]) as Theme

export const dark_red_alt1_SwitchThumb = n531 as Theme
const n532 = t([[12, 92],[13, 194],[14, 192],[15, 191],[16, 195],[17, 196],[18, 188],[19, 189],[20, 188],[21, 189],[22, 189],[23, 191],[24, 190],[25, 192],[26, 191],[27, 194]]) as Theme

export const dark_red_alt1_SliderTrackActive = n532 as Theme
const n533 = t([[12, 196],[13, 195],[14, 92],[15, 194],[16, 197],[17, 0],[18, 188],[19, 189],[20, 188],[21, 189],[22, 187],[23, 194],[24, 192],[25, 92],[26, 194],[27, 191]]) as Theme

export const dark_red_alt1_SliderThumb = n533 as Theme
export const dark_red_alt1_Tooltip = n533 as Theme
export const dark_red_alt1_ProgressIndicator = n533 as Theme
const n534 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[18, 196],[19, 195],[20, 196],[21, 195],[22, 196],[23, 92],[24, 195],[25, 194],[26, 92],[27, 192]]) as Theme

export const dark_red_alt2_Card = n534 as Theme
export const dark_red_alt2_DrawerFrame = n534 as Theme
export const dark_red_alt2_Progress = n534 as Theme
export const dark_red_alt2_TooltipArrow = n534 as Theme
const n535 = t([[12, 192],[13, 194],[14, 92],[15, 195],[16, 191],[17, 190],[18, 196],[19, 195],[20, 196],[21, 195],[22, 195],[23, 241],[24, 241],[25, 92],[26, 195],[27, 191]]) as Theme

export const dark_red_alt2_Button = n535 as Theme
const n536 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 196],[19, 195],[20, 196],[21, 195],[22, 197],[23, 195],[24, 196],[25, 92],[26, 195],[27, 194]]) as Theme

export const dark_red_alt2_Checkbox = n536 as Theme
export const dark_red_alt2_RadioGroupItem = n536 as Theme
export const dark_red_alt2_Input = n536 as Theme
export const dark_red_alt2_TextArea = n536 as Theme
const n537 = t([[12, 192],[13, 194],[14, 92],[15, 195],[16, 191],[17, 190],[18, 196],[19, 195],[20, 196],[21, 195],[22, 195],[23, 195],[24, 196],[25, 92],[26, 195],[27, 191]]) as Theme

export const dark_red_alt2_Switch = n537 as Theme
export const dark_red_alt2_TooltipContent = n537 as Theme
export const dark_red_alt2_SliderTrack = n537 as Theme
const n538 = t([[12, 197],[13, 196],[14, 195],[15, 92],[16, 0],[17, 0],[18, 189],[19, 190],[20, 189],[21, 190],[22, 187],[23, 92],[24, 194],[25, 195],[26, 92],[27, 190]]) as Theme

export const dark_red_alt2_SwitchThumb = n538 as Theme
const n539 = t([[12, 194],[13, 192],[14, 191],[15, 190],[16, 92],[17, 195],[18, 189],[19, 190],[20, 189],[21, 190],[22, 190],[23, 190],[24, 189],[25, 191],[26, 190],[27, 92]]) as Theme

export const dark_red_alt2_SliderTrackActive = n539 as Theme
const n540 = t([[12, 195],[13, 92],[14, 194],[15, 192],[16, 196],[17, 197],[18, 189],[19, 190],[20, 189],[21, 190],[22, 188],[23, 192],[24, 191],[25, 194],[26, 192],[27, 192]]) as Theme

export const dark_red_alt2_SliderThumb = n540 as Theme
export const dark_red_alt2_Tooltip = n540 as Theme
export const dark_red_alt2_ProgressIndicator = n540 as Theme
const n541 = t([[12, 192],[13, 194],[14, 92],[15, 195],[16, 191],[17, 190],[19, 92],[20, 195],[21, 92],[22, 195],[23, 195],[24, 196],[25, 92],[26, 195],[27, 191]]) as Theme

export const dark_red_active_Card = n541 as Theme
export const dark_red_active_DrawerFrame = n541 as Theme
export const dark_red_active_Progress = n541 as Theme
export const dark_red_active_TooltipArrow = n541 as Theme
const n542 = t([[12, 194],[13, 92],[14, 195],[15, 196],[16, 192],[17, 191],[19, 92],[20, 195],[21, 92],[22, 92],[23, 241],[24, 241],[25, 195],[26, 196],[27, 190]]) as Theme

export const dark_red_active_Button = n542 as Theme
const n543 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[19, 92],[20, 195],[21, 92],[22, 196],[23, 196],[24, 197],[25, 195],[26, 196],[27, 192]]) as Theme

export const dark_red_active_Checkbox = n543 as Theme
export const dark_red_active_RadioGroupItem = n543 as Theme
export const dark_red_active_Input = n543 as Theme
export const dark_red_active_TextArea = n543 as Theme
const n544 = t([[12, 194],[13, 92],[14, 195],[15, 196],[16, 192],[17, 191],[19, 92],[20, 195],[21, 92],[22, 92],[23, 196],[24, 197],[25, 195],[26, 196],[27, 190]]) as Theme

export const dark_red_active_Switch = n544 as Theme
export const dark_red_active_TooltipContent = n544 as Theme
export const dark_red_active_SliderTrack = n544 as Theme
const n545 = t([[12, 196],[13, 195],[14, 92],[15, 194],[16, 197],[17, 0],[19, 191],[20, 190],[21, 191],[22, 187],[23, 194],[24, 192],[25, 92],[26, 194],[27, 191]]) as Theme

export const dark_red_active_SwitchThumb = n545 as Theme
const n546 = t([[12, 192],[13, 191],[14, 190],[15, 189],[16, 194],[17, 92],[19, 191],[20, 190],[21, 191],[22, 191],[23, 189],[24, 188],[25, 190],[26, 189],[27, 195]]) as Theme

export const dark_red_active_SliderTrackActive = n546 as Theme
const n547 = t([[12, 92],[13, 194],[14, 192],[15, 191],[16, 195],[17, 196],[19, 191],[20, 190],[21, 191],[22, 189],[23, 191],[24, 190],[25, 192],[26, 191],[27, 194]]) as Theme

export const dark_red_active_SliderThumb = n547 as Theme
export const dark_red_active_Tooltip = n547 as Theme
export const dark_red_active_ProgressIndicator = n547 as Theme