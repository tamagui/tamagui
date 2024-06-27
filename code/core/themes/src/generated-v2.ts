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
  outlineColor: string;
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

function t(a: [number, number][]) {
  let res: Record<string,string> = {}
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = vs[vi] as string
  }
  return res as Theme
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
  'hsla(0, 0%, 99.0%, 0)',
  'hsla(0, 0%, 9.0%, 0)',
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
  'hsla(0, 0%, 8.5%, 0)',
  'hsla(0, 0%, 93.0%, 0)',
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.9)',
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
'outlineColor',
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


const n1 = t([[0, 0],[1, 1],[2, 2],[3, 3],[4, 4],[5, 5],[6, 6],[7, 7],[8, 8],[9, 9],[10, 10],[11, 11],[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 4],[24, 5],[25, 3],[26, 4],[27, 8],[28, 8],[29, 14],[30, 15],[31, 16],[32, 17],[33, 18],[34, 19],[35, 20],[36, 21],[37, 22],[38, 23],[39, 24],[40, 25],[41, 26],[42, 27],[43, 28],[44, 29],[45, 30],[46, 31],[47, 32],[48, 33],[49, 8],[50, 34],[51, 35],[52, 11],[53, 36],[54, 37],[55, 38],[56, 39],[57, 40],[58, 41],[59, 42],[60, 43],[61, 44],[62, 45],[63, 46],[64, 47],[65, 48],[66, 49],[67, 50],[68, 51],[69, 52],[70, 53],[71, 54],[72, 55],[73, 56],[74, 57],[75, 58],[76, 59],[77, 60],[78, 61],[79, 62],[80, 63],[81, 64],[82, 65],[83, 66],[84, 67],[85, 68],[86, 69],[87, 70],[88, 71],[89, 72],[90, 73],[91, 74],[92, 75],[93, 76],[94, 77],[95, 78],[96, 79],[97, 80],[98, 81],[99, 82],[100, 83],[101, 84],[102, 85],[103, 86],[104, 87],[105, 88],[106, 89],[107, 90],[108, 91],[109, 92],[110, 93],[111, 94],[112, 95],[113, 96],[114, 97],[115, 98],[116, 99],[117, 100],[118, 101],[119, 102],[120, 103],[121, 104],[122, 105],[123, 106],[124, 107],[125, 108],[126, 108],[127, 109],[128, 109]])

export const light = n1
const n2 = t([[0, 110],[1, 111],[2, 112],[3, 113],[4, 114],[5, 115],[6, 116],[7, 117],[8, 118],[9, 119],[10, 120],[11, 0],[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 114],[24, 115],[25, 113],[26, 114],[27, 118],[28, 118],[29, 121],[30, 122],[31, 123],[32, 124],[33, 125],[34, 126],[35, 127],[36, 128],[37, 22],[38, 129],[39, 130],[40, 131],[41, 132],[42, 133],[43, 134],[44, 135],[45, 136],[46, 137],[47, 138],[48, 139],[49, 140],[50, 141],[51, 142],[52, 29],[53, 143],[54, 144],[55, 145],[56, 146],[57, 147],[58, 148],[59, 149],[60, 150],[61, 44],[62, 151],[63, 152],[64, 153],[65, 154],[66, 155],[67, 156],[68, 157],[69, 158],[70, 159],[71, 160],[72, 161],[73, 56],[74, 162],[75, 163],[76, 164],[77, 165],[78, 166],[79, 167],[80, 168],[81, 169],[82, 170],[83, 171],[84, 172],[85, 68],[86, 173],[87, 174],[88, 175],[89, 176],[90, 177],[91, 178],[92, 179],[93, 180],[94, 181],[95, 182],[96, 183],[97, 80],[98, 184],[99, 185],[100, 186],[101, 187],[102, 188],[103, 189],[104, 190],[105, 191],[106, 192],[107, 193],[108, 194],[109, 92],[110, 195],[111, 196],[112, 197],[113, 198],[114, 199],[115, 200],[116, 201],[117, 202],[118, 203],[119, 204],[120, 205],[121, 104],[122, 206],[123, 207],[124, 208],[125, 209],[126, 209],[127, 210],[128, 210]])

export const dark = n2
const n3 = t([[0, 48],[1, 49],[2, 50],[3, 51],[4, 52],[5, 53],[6, 55],[7, 56],[8, 57],[9, 58],[10, 59],[11, 11],[12, 49],[13, 50],[14, 51],[15, 52],[16, 48],[17, 211],[18, 11],[19, 59],[20, 11],[21, 59],[22, 212],[23, 51],[24, 52],[25, 51],[26, 51],[27, 57],[28, 57]])

export const light_orange = n3
const n4 = t([[0, 96],[1, 97],[2, 98],[3, 99],[4, 100],[5, 101],[6, 103],[7, 104],[8, 105],[9, 106],[10, 107],[11, 11],[12, 97],[13, 98],[14, 99],[15, 100],[16, 96],[17, 213],[18, 11],[19, 107],[20, 11],[21, 107],[22, 214],[23, 99],[24, 100],[25, 99],[26, 99],[27, 105],[28, 105]])

export const light_yellow = n4
const n5 = t([[0, 36],[1, 37],[2, 38],[3, 39],[4, 40],[5, 41],[6, 43],[7, 44],[8, 45],[9, 46],[10, 47],[11, 11],[12, 37],[13, 38],[14, 39],[15, 40],[16, 36],[17, 215],[18, 11],[19, 47],[20, 11],[21, 47],[22, 216],[23, 39],[24, 40],[25, 39],[26, 39],[27, 45],[28, 45]])

export const light_green = n5
const n6 = t([[0, 14],[1, 15],[2, 16],[3, 17],[4, 18],[5, 19],[6, 21],[7, 22],[8, 23],[9, 24],[10, 25],[11, 11],[12, 15],[13, 16],[14, 17],[15, 18],[16, 14],[17, 217],[18, 11],[19, 25],[20, 11],[21, 25],[22, 218],[23, 17],[24, 18],[25, 17],[26, 17],[27, 23],[28, 23]])

export const light_blue = n6
const n7 = t([[0, 72],[1, 73],[2, 74],[3, 75],[4, 76],[5, 77],[6, 79],[7, 80],[8, 81],[9, 82],[10, 83],[11, 11],[12, 73],[13, 74],[14, 75],[15, 76],[16, 72],[17, 219],[18, 11],[19, 83],[20, 11],[21, 83],[22, 220],[23, 75],[24, 76],[25, 75],[26, 75],[27, 81],[28, 81]])

export const light_purple = n7
const n8 = t([[0, 60],[1, 61],[2, 62],[3, 63],[4, 64],[5, 65],[6, 67],[7, 68],[8, 69],[9, 70],[10, 71],[11, 11],[12, 61],[13, 62],[14, 63],[15, 64],[16, 60],[17, 221],[18, 11],[19, 71],[20, 11],[21, 71],[22, 222],[23, 63],[24, 64],[25, 63],[26, 63],[27, 69],[28, 69]])

export const light_pink = n8
const n9 = t([[0, 84],[1, 85],[2, 86],[3, 87],[4, 88],[5, 89],[6, 91],[7, 92],[8, 93],[9, 94],[10, 95],[11, 11],[12, 85],[13, 86],[14, 87],[15, 88],[16, 84],[17, 223],[18, 11],[19, 95],[20, 11],[21, 95],[22, 224],[23, 87],[24, 88],[25, 87],[26, 87],[27, 93],[28, 93]])

export const light_red = n9
const n10 = t([[0, 26],[1, 27],[2, 28],[3, 29],[4, 30],[5, 31],[6, 33],[7, 8],[8, 34],[9, 35],[10, 11],[11, 11],[12, 27],[13, 28],[14, 29],[15, 30],[16, 26],[17, 225],[18, 11],[19, 11],[20, 11],[21, 11],[22, 226],[23, 29],[24, 30],[25, 29],[26, 29],[27, 34],[28, 34]])

export const light_gray = n10
const n11 = t([[0, 154],[1, 155],[2, 156],[3, 157],[4, 158],[5, 159],[6, 161],[7, 56],[8, 162],[9, 163],[10, 164],[11, 0],[12, 155],[13, 156],[14, 157],[15, 158],[16, 154],[17, 227],[18, 0],[19, 164],[20, 0],[21, 164],[22, 228],[23, 158],[24, 159],[25, 157],[26, 158],[27, 162],[28, 162]])

export const dark_orange = n11
const n12 = t([[0, 198],[1, 199],[2, 200],[3, 201],[4, 202],[5, 203],[6, 205],[7, 104],[8, 206],[9, 207],[10, 208],[11, 0],[12, 199],[13, 200],[14, 201],[15, 202],[16, 198],[17, 229],[18, 0],[19, 208],[20, 0],[21, 208],[22, 230],[23, 202],[24, 203],[25, 201],[26, 202],[27, 206],[28, 206]])

export const dark_yellow = n12
const n13 = t([[0, 143],[1, 144],[2, 145],[3, 146],[4, 147],[5, 148],[6, 150],[7, 44],[8, 151],[9, 152],[10, 153],[11, 0],[12, 144],[13, 145],[14, 146],[15, 147],[16, 143],[17, 231],[18, 0],[19, 153],[20, 0],[21, 153],[22, 232],[23, 147],[24, 148],[25, 146],[26, 147],[27, 151],[28, 151]])

export const dark_green = n13
const n14 = t([[0, 121],[1, 122],[2, 123],[3, 124],[4, 125],[5, 126],[6, 128],[7, 22],[8, 129],[9, 130],[10, 131],[11, 0],[12, 122],[13, 123],[14, 124],[15, 125],[16, 121],[17, 233],[18, 0],[19, 131],[20, 0],[21, 131],[22, 234],[23, 125],[24, 126],[25, 124],[26, 125],[27, 129],[28, 129]])

export const dark_blue = n14
const n15 = t([[0, 176],[1, 177],[2, 178],[3, 179],[4, 180],[5, 181],[6, 183],[7, 80],[8, 184],[9, 185],[10, 186],[11, 0],[12, 177],[13, 178],[14, 179],[15, 180],[16, 176],[17, 235],[18, 0],[19, 186],[20, 0],[21, 186],[22, 236],[23, 180],[24, 181],[25, 179],[26, 180],[27, 184],[28, 184]])

export const dark_purple = n15
const n16 = t([[0, 165],[1, 166],[2, 167],[3, 168],[4, 169],[5, 170],[6, 172],[7, 68],[8, 173],[9, 174],[10, 175],[11, 0],[12, 166],[13, 167],[14, 168],[15, 169],[16, 165],[17, 237],[18, 0],[19, 175],[20, 0],[21, 175],[22, 238],[23, 169],[24, 170],[25, 168],[26, 169],[27, 173],[28, 173]])

export const dark_pink = n16
const n17 = t([[0, 187],[1, 188],[2, 189],[3, 190],[4, 191],[5, 192],[6, 194],[7, 92],[8, 195],[9, 196],[10, 197],[11, 0],[12, 188],[13, 189],[14, 190],[15, 191],[16, 187],[17, 239],[18, 0],[19, 197],[20, 0],[21, 197],[22, 240],[23, 191],[24, 192],[25, 190],[26, 191],[27, 195],[28, 195]])

export const dark_red = n17
const n18 = t([[0, 132],[1, 133],[2, 134],[3, 135],[4, 136],[5, 137],[6, 139],[7, 140],[8, 141],[9, 142],[10, 29],[11, 0],[12, 133],[13, 134],[14, 135],[15, 136],[16, 132],[17, 241],[18, 0],[19, 29],[20, 0],[21, 29],[22, 242],[23, 136],[24, 137],[25, 135],[26, 136],[27, 141],[28, 141]])

export const dark_gray = n18
const n19 = t([[12, 243]])

export const light_SheetOverlay = n19
export const light_DialogOverlay = n19
export const light_ModalOverlay = n19
export const light_orange_SheetOverlay = n19
export const light_orange_DialogOverlay = n19
export const light_orange_ModalOverlay = n19
export const light_yellow_SheetOverlay = n19
export const light_yellow_DialogOverlay = n19
export const light_yellow_ModalOverlay = n19
export const light_green_SheetOverlay = n19
export const light_green_DialogOverlay = n19
export const light_green_ModalOverlay = n19
export const light_blue_SheetOverlay = n19
export const light_blue_DialogOverlay = n19
export const light_blue_ModalOverlay = n19
export const light_purple_SheetOverlay = n19
export const light_purple_DialogOverlay = n19
export const light_purple_ModalOverlay = n19
export const light_pink_SheetOverlay = n19
export const light_pink_DialogOverlay = n19
export const light_pink_ModalOverlay = n19
export const light_red_SheetOverlay = n19
export const light_red_DialogOverlay = n19
export const light_red_ModalOverlay = n19
export const light_gray_SheetOverlay = n19
export const light_gray_DialogOverlay = n19
export const light_gray_ModalOverlay = n19
export const light_alt1_SheetOverlay = n19
export const light_alt1_DialogOverlay = n19
export const light_alt1_ModalOverlay = n19
export const light_alt2_SheetOverlay = n19
export const light_alt2_DialogOverlay = n19
export const light_alt2_ModalOverlay = n19
export const light_active_SheetOverlay = n19
export const light_active_DialogOverlay = n19
export const light_active_ModalOverlay = n19
export const light_orange_alt1_SheetOverlay = n19
export const light_orange_alt1_DialogOverlay = n19
export const light_orange_alt1_ModalOverlay = n19
export const light_orange_alt2_SheetOverlay = n19
export const light_orange_alt2_DialogOverlay = n19
export const light_orange_alt2_ModalOverlay = n19
export const light_orange_active_SheetOverlay = n19
export const light_orange_active_DialogOverlay = n19
export const light_orange_active_ModalOverlay = n19
export const light_yellow_alt1_SheetOverlay = n19
export const light_yellow_alt1_DialogOverlay = n19
export const light_yellow_alt1_ModalOverlay = n19
export const light_yellow_alt2_SheetOverlay = n19
export const light_yellow_alt2_DialogOverlay = n19
export const light_yellow_alt2_ModalOverlay = n19
export const light_yellow_active_SheetOverlay = n19
export const light_yellow_active_DialogOverlay = n19
export const light_yellow_active_ModalOverlay = n19
export const light_green_alt1_SheetOverlay = n19
export const light_green_alt1_DialogOverlay = n19
export const light_green_alt1_ModalOverlay = n19
export const light_green_alt2_SheetOverlay = n19
export const light_green_alt2_DialogOverlay = n19
export const light_green_alt2_ModalOverlay = n19
export const light_green_active_SheetOverlay = n19
export const light_green_active_DialogOverlay = n19
export const light_green_active_ModalOverlay = n19
export const light_blue_alt1_SheetOverlay = n19
export const light_blue_alt1_DialogOverlay = n19
export const light_blue_alt1_ModalOverlay = n19
export const light_blue_alt2_SheetOverlay = n19
export const light_blue_alt2_DialogOverlay = n19
export const light_blue_alt2_ModalOverlay = n19
export const light_blue_active_SheetOverlay = n19
export const light_blue_active_DialogOverlay = n19
export const light_blue_active_ModalOverlay = n19
export const light_purple_alt1_SheetOverlay = n19
export const light_purple_alt1_DialogOverlay = n19
export const light_purple_alt1_ModalOverlay = n19
export const light_purple_alt2_SheetOverlay = n19
export const light_purple_alt2_DialogOverlay = n19
export const light_purple_alt2_ModalOverlay = n19
export const light_purple_active_SheetOverlay = n19
export const light_purple_active_DialogOverlay = n19
export const light_purple_active_ModalOverlay = n19
export const light_pink_alt1_SheetOverlay = n19
export const light_pink_alt1_DialogOverlay = n19
export const light_pink_alt1_ModalOverlay = n19
export const light_pink_alt2_SheetOverlay = n19
export const light_pink_alt2_DialogOverlay = n19
export const light_pink_alt2_ModalOverlay = n19
export const light_pink_active_SheetOverlay = n19
export const light_pink_active_DialogOverlay = n19
export const light_pink_active_ModalOverlay = n19
export const light_red_alt1_SheetOverlay = n19
export const light_red_alt1_DialogOverlay = n19
export const light_red_alt1_ModalOverlay = n19
export const light_red_alt2_SheetOverlay = n19
export const light_red_alt2_DialogOverlay = n19
export const light_red_alt2_ModalOverlay = n19
export const light_red_active_SheetOverlay = n19
export const light_red_active_DialogOverlay = n19
export const light_red_active_ModalOverlay = n19
export const light_gray_alt1_SheetOverlay = n19
export const light_gray_alt1_DialogOverlay = n19
export const light_gray_alt1_ModalOverlay = n19
export const light_gray_alt2_SheetOverlay = n19
export const light_gray_alt2_DialogOverlay = n19
export const light_gray_alt2_ModalOverlay = n19
export const light_gray_active_SheetOverlay = n19
export const light_gray_active_DialogOverlay = n19
export const light_gray_active_ModalOverlay = n19
const n20 = t([[12, 244]])

export const dark_SheetOverlay = n20
export const dark_DialogOverlay = n20
export const dark_ModalOverlay = n20
export const dark_orange_SheetOverlay = n20
export const dark_orange_DialogOverlay = n20
export const dark_orange_ModalOverlay = n20
export const dark_yellow_SheetOverlay = n20
export const dark_yellow_DialogOverlay = n20
export const dark_yellow_ModalOverlay = n20
export const dark_green_SheetOverlay = n20
export const dark_green_DialogOverlay = n20
export const dark_green_ModalOverlay = n20
export const dark_blue_SheetOverlay = n20
export const dark_blue_DialogOverlay = n20
export const dark_blue_ModalOverlay = n20
export const dark_purple_SheetOverlay = n20
export const dark_purple_DialogOverlay = n20
export const dark_purple_ModalOverlay = n20
export const dark_pink_SheetOverlay = n20
export const dark_pink_DialogOverlay = n20
export const dark_pink_ModalOverlay = n20
export const dark_red_SheetOverlay = n20
export const dark_red_DialogOverlay = n20
export const dark_red_ModalOverlay = n20
export const dark_gray_SheetOverlay = n20
export const dark_gray_DialogOverlay = n20
export const dark_gray_ModalOverlay = n20
export const dark_alt1_SheetOverlay = n20
export const dark_alt1_DialogOverlay = n20
export const dark_alt1_ModalOverlay = n20
export const dark_alt2_SheetOverlay = n20
export const dark_alt2_DialogOverlay = n20
export const dark_alt2_ModalOverlay = n20
export const dark_active_SheetOverlay = n20
export const dark_active_DialogOverlay = n20
export const dark_active_ModalOverlay = n20
export const dark_orange_alt1_SheetOverlay = n20
export const dark_orange_alt1_DialogOverlay = n20
export const dark_orange_alt1_ModalOverlay = n20
export const dark_orange_alt2_SheetOverlay = n20
export const dark_orange_alt2_DialogOverlay = n20
export const dark_orange_alt2_ModalOverlay = n20
export const dark_orange_active_SheetOverlay = n20
export const dark_orange_active_DialogOverlay = n20
export const dark_orange_active_ModalOverlay = n20
export const dark_yellow_alt1_SheetOverlay = n20
export const dark_yellow_alt1_DialogOverlay = n20
export const dark_yellow_alt1_ModalOverlay = n20
export const dark_yellow_alt2_SheetOverlay = n20
export const dark_yellow_alt2_DialogOverlay = n20
export const dark_yellow_alt2_ModalOverlay = n20
export const dark_yellow_active_SheetOverlay = n20
export const dark_yellow_active_DialogOverlay = n20
export const dark_yellow_active_ModalOverlay = n20
export const dark_green_alt1_SheetOverlay = n20
export const dark_green_alt1_DialogOverlay = n20
export const dark_green_alt1_ModalOverlay = n20
export const dark_green_alt2_SheetOverlay = n20
export const dark_green_alt2_DialogOverlay = n20
export const dark_green_alt2_ModalOverlay = n20
export const dark_green_active_SheetOverlay = n20
export const dark_green_active_DialogOverlay = n20
export const dark_green_active_ModalOverlay = n20
export const dark_blue_alt1_SheetOverlay = n20
export const dark_blue_alt1_DialogOverlay = n20
export const dark_blue_alt1_ModalOverlay = n20
export const dark_blue_alt2_SheetOverlay = n20
export const dark_blue_alt2_DialogOverlay = n20
export const dark_blue_alt2_ModalOverlay = n20
export const dark_blue_active_SheetOverlay = n20
export const dark_blue_active_DialogOverlay = n20
export const dark_blue_active_ModalOverlay = n20
export const dark_purple_alt1_SheetOverlay = n20
export const dark_purple_alt1_DialogOverlay = n20
export const dark_purple_alt1_ModalOverlay = n20
export const dark_purple_alt2_SheetOverlay = n20
export const dark_purple_alt2_DialogOverlay = n20
export const dark_purple_alt2_ModalOverlay = n20
export const dark_purple_active_SheetOverlay = n20
export const dark_purple_active_DialogOverlay = n20
export const dark_purple_active_ModalOverlay = n20
export const dark_pink_alt1_SheetOverlay = n20
export const dark_pink_alt1_DialogOverlay = n20
export const dark_pink_alt1_ModalOverlay = n20
export const dark_pink_alt2_SheetOverlay = n20
export const dark_pink_alt2_DialogOverlay = n20
export const dark_pink_alt2_ModalOverlay = n20
export const dark_pink_active_SheetOverlay = n20
export const dark_pink_active_DialogOverlay = n20
export const dark_pink_active_ModalOverlay = n20
export const dark_red_alt1_SheetOverlay = n20
export const dark_red_alt1_DialogOverlay = n20
export const dark_red_alt1_ModalOverlay = n20
export const dark_red_alt2_SheetOverlay = n20
export const dark_red_alt2_DialogOverlay = n20
export const dark_red_alt2_ModalOverlay = n20
export const dark_red_active_SheetOverlay = n20
export const dark_red_active_DialogOverlay = n20
export const dark_red_active_ModalOverlay = n20
export const dark_gray_alt1_SheetOverlay = n20
export const dark_gray_alt1_DialogOverlay = n20
export const dark_gray_alt1_ModalOverlay = n20
export const dark_gray_alt2_SheetOverlay = n20
export const dark_gray_alt2_DialogOverlay = n20
export const dark_gray_alt2_ModalOverlay = n20
export const dark_gray_active_SheetOverlay = n20
export const dark_gray_active_DialogOverlay = n20
export const dark_gray_active_ModalOverlay = n20
const n21 = t([[0, 1],[1, 2],[2, 3],[3, 4],[4, 5],[5, 6],[6, 7],[7, 8],[8, 9],[9, 10],[10, 11],[11, 11],[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7],[28, 9]])

export const light_alt1 = n21
const n22 = t([[0, 2],[1, 3],[2, 4],[3, 5],[4, 6],[5, 7],[6, 8],[7, 9],[8, 10],[9, 11],[10, 11],[11, 11],[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 5],[24, 6],[25, 4],[26, 5],[27, 6],[28, 10]])

export const light_alt2 = n22
const n23 = t([[0, 3],[1, 4],[2, 5],[3, 6],[4, 7],[5, 8],[6, 9],[7, 10],[8, 11],[9, 13],[10, 13],[11, 13],[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 6],[24, 7],[25, 5],[26, 6],[27, 5],[28, 11]])

export const light_active = n23
const n24 = t([[0, 111],[1, 112],[2, 113],[3, 114],[4, 115],[5, 116],[6, 117],[7, 118],[8, 119],[9, 120],[10, 0],[11, 0],[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117],[28, 119]])

export const dark_alt1 = n24
const n25 = t([[0, 112],[1, 113],[2, 114],[3, 115],[4, 116],[5, 117],[6, 118],[7, 119],[8, 120],[9, 0],[10, 0],[11, 0],[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 115],[24, 116],[25, 114],[26, 115],[27, 116],[28, 120]])

export const dark_alt2 = n25
const n26 = t([[0, 113],[1, 114],[2, 115],[3, 116],[4, 117],[5, 118],[6, 119],[7, 120],[8, 0],[9, 12],[10, 12],[11, 12],[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 116],[24, 117],[25, 115],[26, 116],[27, 115],[28, 0]])

export const dark_active = n26
const n27 = t([[0, 49],[1, 50],[2, 51],[3, 52],[4, 53],[5, 55],[6, 56],[7, 57],[8, 58],[9, 59],[10, 11],[11, 11],[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 59],[19, 58],[20, 59],[21, 58],[22, 11],[23, 52],[24, 53],[25, 52],[26, 52],[27, 56],[28, 58]])

export const light_orange_alt1 = n27
const n28 = t([[0, 50],[1, 51],[2, 52],[3, 53],[4, 55],[5, 56],[6, 57],[7, 58],[8, 59],[9, 11],[10, 11],[11, 11],[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 58],[19, 57],[20, 58],[21, 57],[22, 59],[23, 52],[24, 53],[25, 52],[26, 52],[27, 55],[28, 59]])

export const light_orange_alt2 = n28
const n29 = t([[0, 51],[1, 52],[2, 53],[3, 55],[4, 56],[5, 57],[6, 58],[7, 59],[8, 11],[9, 212],[10, 212],[11, 212],[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[19, 56],[20, 57],[21, 56],[22, 58],[23, 53],[24, 55],[25, 53],[26, 53],[27, 53],[28, 11]])

export const light_orange_active = n29
const n30 = t([[0, 97],[1, 98],[2, 99],[3, 100],[4, 101],[5, 103],[6, 104],[7, 105],[8, 106],[9, 107],[10, 11],[11, 11],[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 107],[19, 106],[20, 107],[21, 106],[22, 11],[23, 100],[24, 101],[25, 100],[26, 100],[27, 104],[28, 106]])

export const light_yellow_alt1 = n30
const n31 = t([[0, 98],[1, 99],[2, 100],[3, 101],[4, 103],[5, 104],[6, 105],[7, 106],[8, 107],[9, 11],[10, 11],[11, 11],[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 106],[19, 105],[20, 106],[21, 105],[22, 107],[23, 100],[24, 101],[25, 100],[26, 100],[27, 103],[28, 107]])

export const light_yellow_alt2 = n31
const n32 = t([[0, 99],[1, 100],[2, 101],[3, 103],[4, 104],[5, 105],[6, 106],[7, 107],[8, 11],[9, 214],[10, 214],[11, 214],[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[19, 104],[20, 105],[21, 104],[22, 106],[23, 101],[24, 103],[25, 101],[26, 101],[27, 101],[28, 11]])

export const light_yellow_active = n32
const n33 = t([[0, 37],[1, 38],[2, 39],[3, 40],[4, 41],[5, 43],[6, 44],[7, 45],[8, 46],[9, 47],[10, 11],[11, 11],[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 47],[19, 46],[20, 47],[21, 46],[22, 11],[23, 40],[24, 41],[25, 40],[26, 40],[27, 44],[28, 46]])

export const light_green_alt1 = n33
const n34 = t([[0, 38],[1, 39],[2, 40],[3, 41],[4, 43],[5, 44],[6, 45],[7, 46],[8, 47],[9, 11],[10, 11],[11, 11],[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 46],[19, 45],[20, 46],[21, 45],[22, 47],[23, 40],[24, 41],[25, 40],[26, 40],[27, 43],[28, 47]])

export const light_green_alt2 = n34
const n35 = t([[0, 39],[1, 40],[2, 41],[3, 43],[4, 44],[5, 45],[6, 46],[7, 47],[8, 11],[9, 216],[10, 216],[11, 216],[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[19, 44],[20, 45],[21, 44],[22, 46],[23, 41],[24, 43],[25, 41],[26, 41],[27, 41],[28, 11]])

export const light_green_active = n35
const n36 = t([[0, 15],[1, 16],[2, 17],[3, 18],[4, 19],[5, 21],[6, 22],[7, 23],[8, 24],[9, 25],[10, 11],[11, 11],[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 25],[19, 24],[20, 25],[21, 24],[22, 11],[23, 18],[24, 19],[25, 18],[26, 18],[27, 22],[28, 24]])

export const light_blue_alt1 = n36
const n37 = t([[0, 16],[1, 17],[2, 18],[3, 19],[4, 21],[5, 22],[6, 23],[7, 24],[8, 25],[9, 11],[10, 11],[11, 11],[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 24],[19, 23],[20, 24],[21, 23],[22, 25],[23, 18],[24, 19],[25, 18],[26, 18],[27, 21],[28, 25]])

export const light_blue_alt2 = n37
const n38 = t([[0, 17],[1, 18],[2, 19],[3, 21],[4, 22],[5, 23],[6, 24],[7, 25],[8, 11],[9, 218],[10, 218],[11, 218],[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[19, 22],[20, 23],[21, 22],[22, 24],[23, 19],[24, 21],[25, 19],[26, 19],[27, 19],[28, 11]])

export const light_blue_active = n38
const n39 = t([[0, 73],[1, 74],[2, 75],[3, 76],[4, 77],[5, 79],[6, 80],[7, 81],[8, 82],[9, 83],[10, 11],[11, 11],[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 83],[19, 82],[20, 83],[21, 82],[22, 11],[23, 76],[24, 77],[25, 76],[26, 76],[27, 80],[28, 82]])

export const light_purple_alt1 = n39
const n40 = t([[0, 74],[1, 75],[2, 76],[3, 77],[4, 79],[5, 80],[6, 81],[7, 82],[8, 83],[9, 11],[10, 11],[11, 11],[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 82],[19, 81],[20, 82],[21, 81],[22, 83],[23, 76],[24, 77],[25, 76],[26, 76],[27, 79],[28, 83]])

export const light_purple_alt2 = n40
const n41 = t([[0, 75],[1, 76],[2, 77],[3, 79],[4, 80],[5, 81],[6, 82],[7, 83],[8, 11],[9, 220],[10, 220],[11, 220],[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[19, 80],[20, 81],[21, 80],[22, 82],[23, 77],[24, 79],[25, 77],[26, 77],[27, 77],[28, 11]])

export const light_purple_active = n41
const n42 = t([[0, 61],[1, 62],[2, 63],[3, 64],[4, 65],[5, 67],[6, 68],[7, 69],[8, 70],[9, 71],[10, 11],[11, 11],[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 71],[19, 70],[20, 71],[21, 70],[22, 11],[23, 64],[24, 65],[25, 64],[26, 64],[27, 68],[28, 70]])

export const light_pink_alt1 = n42
const n43 = t([[0, 62],[1, 63],[2, 64],[3, 65],[4, 67],[5, 68],[6, 69],[7, 70],[8, 71],[9, 11],[10, 11],[11, 11],[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 70],[19, 69],[20, 70],[21, 69],[22, 71],[23, 64],[24, 65],[25, 64],[26, 64],[27, 67],[28, 71]])

export const light_pink_alt2 = n43
const n44 = t([[0, 63],[1, 64],[2, 65],[3, 67],[4, 68],[5, 69],[6, 70],[7, 71],[8, 11],[9, 222],[10, 222],[11, 222],[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[19, 68],[20, 69],[21, 68],[22, 70],[23, 65],[24, 67],[25, 65],[26, 65],[27, 65],[28, 11]])

export const light_pink_active = n44
const n45 = t([[0, 85],[1, 86],[2, 87],[3, 88],[4, 89],[5, 91],[6, 92],[7, 93],[8, 94],[9, 95],[10, 11],[11, 11],[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 95],[19, 94],[20, 95],[21, 94],[22, 11],[23, 88],[24, 89],[25, 88],[26, 88],[27, 92],[28, 94]])

export const light_red_alt1 = n45
const n46 = t([[0, 86],[1, 87],[2, 88],[3, 89],[4, 91],[5, 92],[6, 93],[7, 94],[8, 95],[9, 11],[10, 11],[11, 11],[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 94],[19, 93],[20, 94],[21, 93],[22, 95],[23, 88],[24, 89],[25, 88],[26, 88],[27, 91],[28, 95]])

export const light_red_alt2 = n46
const n47 = t([[0, 87],[1, 88],[2, 89],[3, 91],[4, 92],[5, 93],[6, 94],[7, 95],[8, 11],[9, 224],[10, 224],[11, 224],[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[19, 92],[20, 93],[21, 92],[22, 94],[23, 89],[24, 91],[25, 89],[26, 89],[27, 89],[28, 11]])

export const light_red_active = n47
const n48 = t([[0, 27],[1, 28],[2, 29],[3, 30],[4, 31],[5, 33],[6, 8],[7, 34],[8, 35],[9, 11],[10, 11],[11, 11],[12, 28],[13, 29],[14, 30],[15, 31],[16, 27],[17, 26],[18, 11],[19, 35],[20, 11],[21, 35],[22, 11],[23, 30],[24, 31],[25, 30],[26, 30],[27, 8],[28, 35]])

export const light_gray_alt1 = n48
const n49 = t([[0, 28],[1, 29],[2, 30],[3, 31],[4, 33],[5, 8],[6, 34],[7, 35],[8, 11],[9, 11],[10, 11],[11, 11],[12, 29],[13, 30],[14, 31],[15, 33],[16, 28],[17, 27],[18, 35],[19, 34],[20, 35],[21, 34],[22, 11],[23, 30],[24, 31],[25, 30],[26, 30],[27, 33],[28, 11]])

export const light_gray_alt2 = n49
const n50 = t([[0, 29],[1, 30],[2, 31],[3, 33],[4, 8],[5, 34],[6, 35],[7, 11],[8, 11],[9, 226],[10, 226],[11, 226],[12, 30],[13, 31],[14, 33],[15, 8],[16, 29],[17, 28],[19, 8],[20, 34],[21, 8],[22, 35],[23, 31],[24, 33],[25, 31],[26, 31],[27, 31],[28, 11]])

export const light_gray_active = n50
const n51 = t([[0, 155],[1, 156],[2, 157],[3, 158],[4, 159],[5, 161],[6, 56],[7, 162],[8, 163],[9, 164],[10, 0],[11, 0],[12, 156],[13, 157],[14, 158],[15, 159],[16, 155],[17, 154],[18, 164],[19, 163],[20, 164],[21, 163],[22, 0],[23, 159],[24, 161],[25, 158],[26, 159],[27, 56],[28, 163]])

export const dark_orange_alt1 = n51
const n52 = t([[0, 156],[1, 157],[2, 158],[3, 159],[4, 161],[5, 56],[6, 162],[7, 163],[8, 164],[9, 0],[10, 0],[11, 0],[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 163],[19, 162],[20, 163],[21, 162],[22, 164],[23, 159],[24, 161],[25, 158],[26, 159],[27, 161],[28, 164]])

export const dark_orange_alt2 = n52
const n53 = t([[0, 157],[1, 158],[2, 159],[3, 161],[4, 56],[5, 162],[6, 163],[7, 164],[8, 0],[9, 228],[10, 228],[11, 228],[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[19, 56],[20, 162],[21, 56],[22, 163],[23, 161],[24, 56],[25, 159],[26, 161],[27, 159],[28, 0]])

export const dark_orange_active = n53
const n54 = t([[0, 199],[1, 200],[2, 201],[3, 202],[4, 203],[5, 205],[6, 104],[7, 206],[8, 207],[9, 208],[10, 0],[11, 0],[12, 200],[13, 201],[14, 202],[15, 203],[16, 199],[17, 198],[18, 208],[19, 207],[20, 208],[21, 207],[22, 0],[23, 203],[24, 205],[25, 202],[26, 203],[27, 104],[28, 207]])

export const dark_yellow_alt1 = n54
const n55 = t([[0, 200],[1, 201],[2, 202],[3, 203],[4, 205],[5, 104],[6, 206],[7, 207],[8, 208],[9, 0],[10, 0],[11, 0],[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 207],[19, 206],[20, 207],[21, 206],[22, 208],[23, 203],[24, 205],[25, 202],[26, 203],[27, 205],[28, 208]])

export const dark_yellow_alt2 = n55
const n56 = t([[0, 201],[1, 202],[2, 203],[3, 205],[4, 104],[5, 206],[6, 207],[7, 208],[8, 0],[9, 230],[10, 230],[11, 230],[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[19, 104],[20, 206],[21, 104],[22, 207],[23, 205],[24, 104],[25, 203],[26, 205],[27, 203],[28, 0]])

export const dark_yellow_active = n56
const n57 = t([[0, 144],[1, 145],[2, 146],[3, 147],[4, 148],[5, 150],[6, 44],[7, 151],[8, 152],[9, 153],[10, 0],[11, 0],[12, 145],[13, 146],[14, 147],[15, 148],[16, 144],[17, 143],[18, 153],[19, 152],[20, 153],[21, 152],[22, 0],[23, 148],[24, 150],[25, 147],[26, 148],[27, 44],[28, 152]])

export const dark_green_alt1 = n57
const n58 = t([[0, 145],[1, 146],[2, 147],[3, 148],[4, 150],[5, 44],[6, 151],[7, 152],[8, 153],[9, 0],[10, 0],[11, 0],[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 152],[19, 151],[20, 152],[21, 151],[22, 153],[23, 148],[24, 150],[25, 147],[26, 148],[27, 150],[28, 153]])

export const dark_green_alt2 = n58
const n59 = t([[0, 146],[1, 147],[2, 148],[3, 150],[4, 44],[5, 151],[6, 152],[7, 153],[8, 0],[9, 232],[10, 232],[11, 232],[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[19, 44],[20, 151],[21, 44],[22, 152],[23, 150],[24, 44],[25, 148],[26, 150],[27, 148],[28, 0]])

export const dark_green_active = n59
const n60 = t([[0, 122],[1, 123],[2, 124],[3, 125],[4, 126],[5, 128],[6, 22],[7, 129],[8, 130],[9, 131],[10, 0],[11, 0],[12, 123],[13, 124],[14, 125],[15, 126],[16, 122],[17, 121],[18, 131],[19, 130],[20, 131],[21, 130],[22, 0],[23, 126],[24, 128],[25, 125],[26, 126],[27, 22],[28, 130]])

export const dark_blue_alt1 = n60
const n61 = t([[0, 123],[1, 124],[2, 125],[3, 126],[4, 128],[5, 22],[6, 129],[7, 130],[8, 131],[9, 0],[10, 0],[11, 0],[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 130],[19, 129],[20, 130],[21, 129],[22, 131],[23, 126],[24, 128],[25, 125],[26, 126],[27, 128],[28, 131]])

export const dark_blue_alt2 = n61
const n62 = t([[0, 124],[1, 125],[2, 126],[3, 128],[4, 22],[5, 129],[6, 130],[7, 131],[8, 0],[9, 234],[10, 234],[11, 234],[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[19, 22],[20, 129],[21, 22],[22, 130],[23, 128],[24, 22],[25, 126],[26, 128],[27, 126],[28, 0]])

export const dark_blue_active = n62
const n63 = t([[0, 177],[1, 178],[2, 179],[3, 180],[4, 181],[5, 183],[6, 80],[7, 184],[8, 185],[9, 186],[10, 0],[11, 0],[12, 178],[13, 179],[14, 180],[15, 181],[16, 177],[17, 176],[18, 186],[19, 185],[20, 186],[21, 185],[22, 0],[23, 181],[24, 183],[25, 180],[26, 181],[27, 80],[28, 185]])

export const dark_purple_alt1 = n63
const n64 = t([[0, 178],[1, 179],[2, 180],[3, 181],[4, 183],[5, 80],[6, 184],[7, 185],[8, 186],[9, 0],[10, 0],[11, 0],[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 185],[19, 184],[20, 185],[21, 184],[22, 186],[23, 181],[24, 183],[25, 180],[26, 181],[27, 183],[28, 186]])

export const dark_purple_alt2 = n64
const n65 = t([[0, 179],[1, 180],[2, 181],[3, 183],[4, 80],[5, 184],[6, 185],[7, 186],[8, 0],[9, 236],[10, 236],[11, 236],[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[19, 80],[20, 184],[21, 80],[22, 185],[23, 183],[24, 80],[25, 181],[26, 183],[27, 181],[28, 0]])

export const dark_purple_active = n65
const n66 = t([[0, 166],[1, 167],[2, 168],[3, 169],[4, 170],[5, 172],[6, 68],[7, 173],[8, 174],[9, 175],[10, 0],[11, 0],[12, 167],[13, 168],[14, 169],[15, 170],[16, 166],[17, 165],[18, 175],[19, 174],[20, 175],[21, 174],[22, 0],[23, 170],[24, 172],[25, 169],[26, 170],[27, 68],[28, 174]])

export const dark_pink_alt1 = n66
const n67 = t([[0, 167],[1, 168],[2, 169],[3, 170],[4, 172],[5, 68],[6, 173],[7, 174],[8, 175],[9, 0],[10, 0],[11, 0],[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 174],[19, 173],[20, 174],[21, 173],[22, 175],[23, 170],[24, 172],[25, 169],[26, 170],[27, 172],[28, 175]])

export const dark_pink_alt2 = n67
const n68 = t([[0, 168],[1, 169],[2, 170],[3, 172],[4, 68],[5, 173],[6, 174],[7, 175],[8, 0],[9, 238],[10, 238],[11, 238],[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[19, 68],[20, 173],[21, 68],[22, 174],[23, 172],[24, 68],[25, 170],[26, 172],[27, 170],[28, 0]])

export const dark_pink_active = n68
const n69 = t([[0, 188],[1, 189],[2, 190],[3, 191],[4, 192],[5, 194],[6, 92],[7, 195],[8, 196],[9, 197],[10, 0],[11, 0],[12, 189],[13, 190],[14, 191],[15, 192],[16, 188],[17, 187],[18, 197],[19, 196],[20, 197],[21, 196],[22, 0],[23, 192],[24, 194],[25, 191],[26, 192],[27, 92],[28, 196]])

export const dark_red_alt1 = n69
const n70 = t([[0, 189],[1, 190],[2, 191],[3, 192],[4, 194],[5, 92],[6, 195],[7, 196],[8, 197],[9, 0],[10, 0],[11, 0],[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 196],[19, 195],[20, 196],[21, 195],[22, 197],[23, 192],[24, 194],[25, 191],[26, 192],[27, 194],[28, 197]])

export const dark_red_alt2 = n70
const n71 = t([[0, 190],[1, 191],[2, 192],[3, 194],[4, 92],[5, 195],[6, 196],[7, 197],[8, 0],[9, 240],[10, 240],[11, 240],[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[19, 92],[20, 195],[21, 92],[22, 196],[23, 194],[24, 92],[25, 192],[26, 194],[27, 192],[28, 0]])

export const dark_red_active = n71
const n72 = t([[0, 133],[1, 134],[2, 135],[3, 136],[4, 137],[5, 139],[6, 140],[7, 141],[8, 142],[9, 29],[10, 0],[11, 0],[12, 134],[13, 135],[14, 136],[15, 137],[16, 133],[17, 132],[18, 29],[19, 142],[20, 29],[21, 142],[22, 0],[23, 137],[24, 139],[25, 136],[26, 137],[27, 140],[28, 142]])

export const dark_gray_alt1 = n72
const n73 = t([[0, 134],[1, 135],[2, 136],[3, 137],[4, 139],[5, 140],[6, 141],[7, 142],[8, 29],[9, 0],[10, 0],[11, 0],[12, 135],[13, 136],[14, 137],[15, 139],[16, 134],[17, 133],[18, 142],[19, 141],[20, 142],[21, 141],[22, 29],[23, 137],[24, 139],[25, 136],[26, 137],[27, 139],[28, 29]])

export const dark_gray_alt2 = n73
const n74 = t([[0, 135],[1, 136],[2, 137],[3, 139],[4, 140],[5, 141],[6, 142],[7, 29],[8, 0],[9, 242],[10, 242],[11, 242],[12, 136],[13, 137],[14, 139],[15, 140],[16, 135],[17, 134],[19, 140],[20, 141],[21, 140],[22, 142],[23, 139],[24, 140],[25, 137],[26, 139],[27, 137],[28, 0]])

export const dark_gray_active = n74
const n75 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 4],[24, 5],[25, 3],[26, 4],[27, 8],[28, 8]])

export const light_ListItem = n75
const n76 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 11],[19, 10],[20, 11],[21, 10],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7],[28, 9]])

export const light_Card = n76
export const light_DrawerFrame = n76
export const light_Progress = n76
export const light_TooltipArrow = n76
const n77 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 11],[19, 10],[20, 11],[21, 10],[22, 10],[23, 5],[24, 6],[25, 4],[26, 5],[27, 6],[28, 10]])

export const light_Button = n77
export const light_Switch = n77
export const light_TooltipContent = n77
export const light_SliderTrack = n77
const n78 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 6],[24, 7],[25, 5],[26, 6],[27, 8],[28, 8]])

export const light_Checkbox = n78
export const light_RadioGroupItem = n78
export const light_Input = n78
export const light_TextArea = n78
const n79 = t([[12, 11],[13, 11],[14, 10],[15, 9],[16, 11],[17, 11],[18, 0],[19, 1],[20, 0],[21, 1],[22, 0],[23, 9],[24, 8],[25, 10],[26, 9],[27, 1],[28, 5]])

export const light_SwitchThumb = n79
const n80 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 0],[19, 1],[20, 0],[21, 1],[22, 1],[23, 5],[24, 4],[25, 6],[26, 5],[27, 5],[28, 1]])

export const light_SliderTrackActive = n80
const n81 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 13],[18, 0],[19, 1],[20, 0],[21, 1],[22, 12],[23, 7],[24, 6],[25, 8],[26, 7],[27, 3],[28, 3]])

export const light_SliderThumb = n81
export const light_Tooltip = n81
export const light_ProgressIndicator = n81
const n82 = t([[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 114],[24, 115],[25, 113],[26, 114],[27, 118],[28, 118]])

export const dark_ListItem = n82
const n83 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 0],[19, 120],[20, 0],[21, 120],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117],[28, 119]])

export const dark_Card = n83
export const dark_DrawerFrame = n83
export const dark_Progress = n83
export const dark_TooltipArrow = n83
const n84 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 0],[19, 120],[20, 0],[21, 120],[22, 120],[23, 115],[24, 116],[25, 114],[26, 115],[27, 116],[28, 120]])

export const dark_Button = n84
export const dark_Switch = n84
export const dark_TooltipContent = n84
export const dark_SliderTrack = n84
const n85 = t([[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 116],[24, 117],[25, 115],[26, 116],[27, 118],[28, 118]])

export const dark_Checkbox = n85
export const dark_RadioGroupItem = n85
export const dark_Input = n85
export const dark_TextArea = n85
const n86 = t([[12, 0],[13, 0],[14, 120],[15, 119],[16, 0],[17, 0],[18, 110],[19, 111],[20, 110],[21, 111],[22, 110],[23, 119],[24, 118],[25, 120],[26, 119],[27, 111],[28, 115]])

export const dark_SwitchThumb = n86
const n87 = t([[12, 118],[13, 117],[14, 116],[15, 115],[16, 119],[17, 120],[18, 110],[19, 111],[20, 110],[21, 111],[22, 111],[23, 115],[24, 114],[25, 116],[26, 115],[27, 115],[28, 111]])

export const dark_SliderTrackActive = n87
const n88 = t([[12, 120],[13, 119],[14, 118],[15, 117],[16, 0],[17, 12],[18, 110],[19, 111],[20, 110],[21, 111],[22, 13],[23, 117],[24, 116],[25, 118],[26, 117],[27, 113],[28, 113]])

export const dark_SliderThumb = n88
export const dark_Tooltip = n88
export const dark_ProgressIndicator = n88
const n89 = t([[12, 49],[13, 50],[14, 51],[15, 52],[16, 48],[17, 211],[18, 11],[19, 59],[20, 11],[21, 59],[22, 212],[23, 51],[24, 52],[25, 51],[26, 51],[27, 57],[28, 57]])

export const light_orange_ListItem = n89
const n90 = t([[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 11],[19, 59],[20, 11],[21, 59],[22, 11],[23, 52],[24, 53],[25, 52],[26, 52],[27, 56],[28, 58]])

export const light_orange_Card = n90
export const light_orange_DrawerFrame = n90
export const light_orange_Progress = n90
export const light_orange_TooltipArrow = n90
const n91 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 11],[19, 59],[20, 11],[21, 59],[22, 59],[23, 52],[24, 53],[25, 52],[26, 52],[27, 55],[28, 59]])

export const light_orange_Button = n91
export const light_orange_Switch = n91
export const light_orange_TooltipContent = n91
export const light_orange_SliderTrack = n91
const n92 = t([[12, 49],[13, 50],[14, 51],[15, 52],[16, 48],[17, 211],[18, 11],[19, 59],[20, 11],[21, 59],[22, 212],[23, 53],[24, 55],[25, 53],[26, 53],[27, 57],[28, 57]])

export const light_orange_Checkbox = n92
export const light_orange_RadioGroupItem = n92
export const light_orange_Input = n92
export const light_orange_TextArea = n92
const n93 = t([[12, 11],[13, 11],[14, 59],[15, 58],[16, 11],[17, 11],[18, 48],[19, 49],[20, 48],[21, 49],[22, 48],[23, 59],[24, 58],[25, 59],[26, 59],[27, 49],[28, 53]])

export const light_orange_SwitchThumb = n93
const n94 = t([[12, 57],[13, 56],[14, 55],[15, 53],[16, 58],[17, 59],[18, 48],[19, 49],[20, 48],[21, 49],[22, 49],[23, 55],[24, 53],[25, 55],[26, 55],[27, 53],[28, 49]])

export const light_orange_SliderTrackActive = n94
const n95 = t([[12, 59],[13, 58],[14, 57],[15, 56],[16, 11],[17, 212],[18, 48],[19, 49],[20, 48],[21, 49],[22, 211],[23, 57],[24, 56],[25, 57],[26, 57],[27, 51],[28, 51]])

export const light_orange_SliderThumb = n95
export const light_orange_Tooltip = n95
export const light_orange_ProgressIndicator = n95
const n96 = t([[12, 97],[13, 98],[14, 99],[15, 100],[16, 96],[17, 213],[18, 11],[19, 107],[20, 11],[21, 107],[22, 214],[23, 99],[24, 100],[25, 99],[26, 99],[27, 105],[28, 105]])

export const light_yellow_ListItem = n96
const n97 = t([[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 11],[19, 107],[20, 11],[21, 107],[22, 11],[23, 100],[24, 101],[25, 100],[26, 100],[27, 104],[28, 106]])

export const light_yellow_Card = n97
export const light_yellow_DrawerFrame = n97
export const light_yellow_Progress = n97
export const light_yellow_TooltipArrow = n97
const n98 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 11],[19, 107],[20, 11],[21, 107],[22, 107],[23, 100],[24, 101],[25, 100],[26, 100],[27, 103],[28, 107]])

export const light_yellow_Button = n98
export const light_yellow_Switch = n98
export const light_yellow_TooltipContent = n98
export const light_yellow_SliderTrack = n98
const n99 = t([[12, 97],[13, 98],[14, 99],[15, 100],[16, 96],[17, 213],[18, 11],[19, 107],[20, 11],[21, 107],[22, 214],[23, 101],[24, 103],[25, 101],[26, 101],[27, 105],[28, 105]])

export const light_yellow_Checkbox = n99
export const light_yellow_RadioGroupItem = n99
export const light_yellow_Input = n99
export const light_yellow_TextArea = n99
const n100 = t([[12, 11],[13, 11],[14, 107],[15, 106],[16, 11],[17, 11],[18, 96],[19, 97],[20, 96],[21, 97],[22, 96],[23, 107],[24, 106],[25, 107],[26, 107],[27, 97],[28, 101]])

export const light_yellow_SwitchThumb = n100
const n101 = t([[12, 105],[13, 104],[14, 103],[15, 101],[16, 106],[17, 107],[18, 96],[19, 97],[20, 96],[21, 97],[22, 97],[23, 103],[24, 101],[25, 103],[26, 103],[27, 101],[28, 97]])

export const light_yellow_SliderTrackActive = n101
const n102 = t([[12, 107],[13, 106],[14, 105],[15, 104],[16, 11],[17, 214],[18, 96],[19, 97],[20, 96],[21, 97],[22, 213],[23, 105],[24, 104],[25, 105],[26, 105],[27, 99],[28, 99]])

export const light_yellow_SliderThumb = n102
export const light_yellow_Tooltip = n102
export const light_yellow_ProgressIndicator = n102
const n103 = t([[12, 37],[13, 38],[14, 39],[15, 40],[16, 36],[17, 215],[18, 11],[19, 47],[20, 11],[21, 47],[22, 216],[23, 39],[24, 40],[25, 39],[26, 39],[27, 45],[28, 45]])

export const light_green_ListItem = n103
const n104 = t([[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 11],[19, 47],[20, 11],[21, 47],[22, 11],[23, 40],[24, 41],[25, 40],[26, 40],[27, 44],[28, 46]])

export const light_green_Card = n104
export const light_green_DrawerFrame = n104
export const light_green_Progress = n104
export const light_green_TooltipArrow = n104
const n105 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 11],[19, 47],[20, 11],[21, 47],[22, 47],[23, 40],[24, 41],[25, 40],[26, 40],[27, 43],[28, 47]])

export const light_green_Button = n105
export const light_green_Switch = n105
export const light_green_TooltipContent = n105
export const light_green_SliderTrack = n105
const n106 = t([[12, 37],[13, 38],[14, 39],[15, 40],[16, 36],[17, 215],[18, 11],[19, 47],[20, 11],[21, 47],[22, 216],[23, 41],[24, 43],[25, 41],[26, 41],[27, 45],[28, 45]])

export const light_green_Checkbox = n106
export const light_green_RadioGroupItem = n106
export const light_green_Input = n106
export const light_green_TextArea = n106
const n107 = t([[12, 11],[13, 11],[14, 47],[15, 46],[16, 11],[17, 11],[18, 36],[19, 37],[20, 36],[21, 37],[22, 36],[23, 47],[24, 46],[25, 47],[26, 47],[27, 37],[28, 41]])

export const light_green_SwitchThumb = n107
const n108 = t([[12, 45],[13, 44],[14, 43],[15, 41],[16, 46],[17, 47],[18, 36],[19, 37],[20, 36],[21, 37],[22, 37],[23, 43],[24, 41],[25, 43],[26, 43],[27, 41],[28, 37]])

export const light_green_SliderTrackActive = n108
const n109 = t([[12, 47],[13, 46],[14, 45],[15, 44],[16, 11],[17, 216],[18, 36],[19, 37],[20, 36],[21, 37],[22, 215],[23, 45],[24, 44],[25, 45],[26, 45],[27, 39],[28, 39]])

export const light_green_SliderThumb = n109
export const light_green_Tooltip = n109
export const light_green_ProgressIndicator = n109
const n110 = t([[12, 15],[13, 16],[14, 17],[15, 18],[16, 14],[17, 217],[18, 11],[19, 25],[20, 11],[21, 25],[22, 218],[23, 17],[24, 18],[25, 17],[26, 17],[27, 23],[28, 23]])

export const light_blue_ListItem = n110
const n111 = t([[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 11],[19, 25],[20, 11],[21, 25],[22, 11],[23, 18],[24, 19],[25, 18],[26, 18],[27, 22],[28, 24]])

export const light_blue_Card = n111
export const light_blue_DrawerFrame = n111
export const light_blue_Progress = n111
export const light_blue_TooltipArrow = n111
const n112 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 11],[19, 25],[20, 11],[21, 25],[22, 25],[23, 18],[24, 19],[25, 18],[26, 18],[27, 21],[28, 25]])

export const light_blue_Button = n112
export const light_blue_Switch = n112
export const light_blue_TooltipContent = n112
export const light_blue_SliderTrack = n112
const n113 = t([[12, 15],[13, 16],[14, 17],[15, 18],[16, 14],[17, 217],[18, 11],[19, 25],[20, 11],[21, 25],[22, 218],[23, 19],[24, 21],[25, 19],[26, 19],[27, 23],[28, 23]])

export const light_blue_Checkbox = n113
export const light_blue_RadioGroupItem = n113
export const light_blue_Input = n113
export const light_blue_TextArea = n113
const n114 = t([[12, 11],[13, 11],[14, 25],[15, 24],[16, 11],[17, 11],[18, 14],[19, 15],[20, 14],[21, 15],[22, 14],[23, 25],[24, 24],[25, 25],[26, 25],[27, 15],[28, 19]])

export const light_blue_SwitchThumb = n114
const n115 = t([[12, 23],[13, 22],[14, 21],[15, 19],[16, 24],[17, 25],[18, 14],[19, 15],[20, 14],[21, 15],[22, 15],[23, 21],[24, 19],[25, 21],[26, 21],[27, 19],[28, 15]])

export const light_blue_SliderTrackActive = n115
const n116 = t([[12, 25],[13, 24],[14, 23],[15, 22],[16, 11],[17, 218],[18, 14],[19, 15],[20, 14],[21, 15],[22, 217],[23, 23],[24, 22],[25, 23],[26, 23],[27, 17],[28, 17]])

export const light_blue_SliderThumb = n116
export const light_blue_Tooltip = n116
export const light_blue_ProgressIndicator = n116
const n117 = t([[12, 73],[13, 74],[14, 75],[15, 76],[16, 72],[17, 219],[18, 11],[19, 83],[20, 11],[21, 83],[22, 220],[23, 75],[24, 76],[25, 75],[26, 75],[27, 81],[28, 81]])

export const light_purple_ListItem = n117
const n118 = t([[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 11],[19, 83],[20, 11],[21, 83],[22, 11],[23, 76],[24, 77],[25, 76],[26, 76],[27, 80],[28, 82]])

export const light_purple_Card = n118
export const light_purple_DrawerFrame = n118
export const light_purple_Progress = n118
export const light_purple_TooltipArrow = n118
const n119 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 11],[19, 83],[20, 11],[21, 83],[22, 83],[23, 76],[24, 77],[25, 76],[26, 76],[27, 79],[28, 83]])

export const light_purple_Button = n119
export const light_purple_Switch = n119
export const light_purple_TooltipContent = n119
export const light_purple_SliderTrack = n119
const n120 = t([[12, 73],[13, 74],[14, 75],[15, 76],[16, 72],[17, 219],[18, 11],[19, 83],[20, 11],[21, 83],[22, 220],[23, 77],[24, 79],[25, 77],[26, 77],[27, 81],[28, 81]])

export const light_purple_Checkbox = n120
export const light_purple_RadioGroupItem = n120
export const light_purple_Input = n120
export const light_purple_TextArea = n120
const n121 = t([[12, 11],[13, 11],[14, 83],[15, 82],[16, 11],[17, 11],[18, 72],[19, 73],[20, 72],[21, 73],[22, 72],[23, 83],[24, 82],[25, 83],[26, 83],[27, 73],[28, 77]])

export const light_purple_SwitchThumb = n121
const n122 = t([[12, 81],[13, 80],[14, 79],[15, 77],[16, 82],[17, 83],[18, 72],[19, 73],[20, 72],[21, 73],[22, 73],[23, 79],[24, 77],[25, 79],[26, 79],[27, 77],[28, 73]])

export const light_purple_SliderTrackActive = n122
const n123 = t([[12, 83],[13, 82],[14, 81],[15, 80],[16, 11],[17, 220],[18, 72],[19, 73],[20, 72],[21, 73],[22, 219],[23, 81],[24, 80],[25, 81],[26, 81],[27, 75],[28, 75]])

export const light_purple_SliderThumb = n123
export const light_purple_Tooltip = n123
export const light_purple_ProgressIndicator = n123
const n124 = t([[12, 61],[13, 62],[14, 63],[15, 64],[16, 60],[17, 221],[18, 11],[19, 71],[20, 11],[21, 71],[22, 222],[23, 63],[24, 64],[25, 63],[26, 63],[27, 69],[28, 69]])

export const light_pink_ListItem = n124
const n125 = t([[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 11],[19, 71],[20, 11],[21, 71],[22, 11],[23, 64],[24, 65],[25, 64],[26, 64],[27, 68],[28, 70]])

export const light_pink_Card = n125
export const light_pink_DrawerFrame = n125
export const light_pink_Progress = n125
export const light_pink_TooltipArrow = n125
const n126 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 11],[19, 71],[20, 11],[21, 71],[22, 71],[23, 64],[24, 65],[25, 64],[26, 64],[27, 67],[28, 71]])

export const light_pink_Button = n126
export const light_pink_Switch = n126
export const light_pink_TooltipContent = n126
export const light_pink_SliderTrack = n126
const n127 = t([[12, 61],[13, 62],[14, 63],[15, 64],[16, 60],[17, 221],[18, 11],[19, 71],[20, 11],[21, 71],[22, 222],[23, 65],[24, 67],[25, 65],[26, 65],[27, 69],[28, 69]])

export const light_pink_Checkbox = n127
export const light_pink_RadioGroupItem = n127
export const light_pink_Input = n127
export const light_pink_TextArea = n127
const n128 = t([[12, 11],[13, 11],[14, 71],[15, 70],[16, 11],[17, 11],[18, 60],[19, 61],[20, 60],[21, 61],[22, 60],[23, 71],[24, 70],[25, 71],[26, 71],[27, 61],[28, 65]])

export const light_pink_SwitchThumb = n128
const n129 = t([[12, 69],[13, 68],[14, 67],[15, 65],[16, 70],[17, 71],[18, 60],[19, 61],[20, 60],[21, 61],[22, 61],[23, 67],[24, 65],[25, 67],[26, 67],[27, 65],[28, 61]])

export const light_pink_SliderTrackActive = n129
const n130 = t([[12, 71],[13, 70],[14, 69],[15, 68],[16, 11],[17, 222],[18, 60],[19, 61],[20, 60],[21, 61],[22, 221],[23, 69],[24, 68],[25, 69],[26, 69],[27, 63],[28, 63]])

export const light_pink_SliderThumb = n130
export const light_pink_Tooltip = n130
export const light_pink_ProgressIndicator = n130
const n131 = t([[12, 85],[13, 86],[14, 87],[15, 88],[16, 84],[17, 223],[18, 11],[19, 95],[20, 11],[21, 95],[22, 224],[23, 87],[24, 88],[25, 87],[26, 87],[27, 93],[28, 93]])

export const light_red_ListItem = n131
const n132 = t([[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 11],[19, 95],[20, 11],[21, 95],[22, 11],[23, 88],[24, 89],[25, 88],[26, 88],[27, 92],[28, 94]])

export const light_red_Card = n132
export const light_red_DrawerFrame = n132
export const light_red_Progress = n132
export const light_red_TooltipArrow = n132
const n133 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 11],[19, 95],[20, 11],[21, 95],[22, 95],[23, 88],[24, 89],[25, 88],[26, 88],[27, 91],[28, 95]])

export const light_red_Button = n133
export const light_red_Switch = n133
export const light_red_TooltipContent = n133
export const light_red_SliderTrack = n133
const n134 = t([[12, 85],[13, 86],[14, 87],[15, 88],[16, 84],[17, 223],[18, 11],[19, 95],[20, 11],[21, 95],[22, 224],[23, 89],[24, 91],[25, 89],[26, 89],[27, 93],[28, 93]])

export const light_red_Checkbox = n134
export const light_red_RadioGroupItem = n134
export const light_red_Input = n134
export const light_red_TextArea = n134
const n135 = t([[12, 11],[13, 11],[14, 95],[15, 94],[16, 11],[17, 11],[18, 84],[19, 85],[20, 84],[21, 85],[22, 84],[23, 95],[24, 94],[25, 95],[26, 95],[27, 85],[28, 89]])

export const light_red_SwitchThumb = n135
const n136 = t([[12, 93],[13, 92],[14, 91],[15, 89],[16, 94],[17, 95],[18, 84],[19, 85],[20, 84],[21, 85],[22, 85],[23, 91],[24, 89],[25, 91],[26, 91],[27, 89],[28, 85]])

export const light_red_SliderTrackActive = n136
const n137 = t([[12, 95],[13, 94],[14, 93],[15, 92],[16, 11],[17, 224],[18, 84],[19, 85],[20, 84],[21, 85],[22, 223],[23, 93],[24, 92],[25, 93],[26, 93],[27, 87],[28, 87]])

export const light_red_SliderThumb = n137
export const light_red_Tooltip = n137
export const light_red_ProgressIndicator = n137
const n138 = t([[12, 27],[13, 28],[14, 29],[15, 30],[16, 26],[17, 225],[18, 11],[19, 11],[20, 11],[21, 11],[22, 226],[23, 29],[24, 30],[25, 29],[26, 29],[27, 34],[28, 34]])

export const light_gray_ListItem = n138
const n139 = t([[12, 28],[13, 29],[14, 30],[15, 31],[16, 27],[17, 26],[18, 11],[19, 11],[20, 11],[21, 11],[22, 11],[23, 30],[24, 31],[25, 30],[26, 30],[27, 8],[28, 35]])

export const light_gray_Card = n139
export const light_gray_DrawerFrame = n139
export const light_gray_Progress = n139
export const light_gray_TooltipArrow = n139
const n140 = t([[12, 29],[13, 30],[14, 31],[15, 33],[16, 28],[17, 27],[18, 11],[19, 11],[20, 11],[21, 11],[22, 11],[23, 30],[24, 31],[25, 30],[26, 30],[27, 33],[28, 11]])

export const light_gray_Button = n140
export const light_gray_Switch = n140
export const light_gray_TooltipContent = n140
export const light_gray_SliderTrack = n140
const n141 = t([[12, 27],[13, 28],[14, 29],[15, 30],[16, 26],[17, 225],[18, 11],[19, 11],[20, 11],[21, 11],[22, 226],[23, 31],[24, 33],[25, 31],[26, 31],[27, 34],[28, 34]])

export const light_gray_Checkbox = n141
export const light_gray_RadioGroupItem = n141
export const light_gray_Input = n141
export const light_gray_TextArea = n141
const n142 = t([[12, 11],[13, 11],[14, 11],[15, 35],[16, 11],[17, 11],[18, 26],[19, 27],[20, 26],[21, 27],[22, 26],[23, 11],[24, 35],[25, 11],[26, 11],[27, 27],[28, 31]])

export const light_gray_SwitchThumb = n142
const n143 = t([[12, 34],[13, 8],[14, 33],[15, 31],[16, 35],[17, 11],[18, 26],[19, 27],[20, 26],[21, 27],[22, 27],[23, 33],[24, 31],[25, 33],[26, 33],[27, 31],[28, 27]])

export const light_gray_SliderTrackActive = n143
const n144 = t([[12, 11],[13, 35],[14, 34],[15, 8],[16, 11],[17, 226],[18, 26],[19, 27],[20, 26],[21, 27],[22, 225],[23, 34],[24, 8],[25, 34],[26, 34],[27, 29],[28, 29]])

export const light_gray_SliderThumb = n144
export const light_gray_Tooltip = n144
export const light_gray_ProgressIndicator = n144
const n145 = t([[12, 155],[13, 156],[14, 157],[15, 158],[16, 154],[17, 227],[18, 0],[19, 164],[20, 0],[21, 164],[22, 228],[23, 158],[24, 159],[25, 157],[26, 158],[27, 162],[28, 162]])

export const dark_orange_ListItem = n145
const n146 = t([[12, 156],[13, 157],[14, 158],[15, 159],[16, 155],[17, 154],[18, 0],[19, 164],[20, 0],[21, 164],[22, 0],[23, 159],[24, 161],[25, 158],[26, 159],[27, 56],[28, 163]])

export const dark_orange_Card = n146
export const dark_orange_DrawerFrame = n146
export const dark_orange_Progress = n146
export const dark_orange_TooltipArrow = n146
const n147 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 0],[19, 164],[20, 0],[21, 164],[22, 164],[23, 159],[24, 161],[25, 158],[26, 159],[27, 161],[28, 164]])

export const dark_orange_Button = n147
export const dark_orange_Switch = n147
export const dark_orange_TooltipContent = n147
export const dark_orange_SliderTrack = n147
const n148 = t([[12, 155],[13, 156],[14, 157],[15, 158],[16, 154],[17, 227],[18, 0],[19, 164],[20, 0],[21, 164],[22, 228],[23, 161],[24, 56],[25, 159],[26, 161],[27, 162],[28, 162]])

export const dark_orange_Checkbox = n148
export const dark_orange_RadioGroupItem = n148
export const dark_orange_Input = n148
export const dark_orange_TextArea = n148
const n149 = t([[12, 0],[13, 0],[14, 164],[15, 163],[16, 0],[17, 0],[18, 154],[19, 155],[20, 154],[21, 155],[22, 154],[23, 163],[24, 162],[25, 164],[26, 163],[27, 155],[28, 159]])

export const dark_orange_SwitchThumb = n149
const n150 = t([[12, 162],[13, 56],[14, 161],[15, 159],[16, 163],[17, 164],[18, 154],[19, 155],[20, 154],[21, 155],[22, 155],[23, 159],[24, 158],[25, 161],[26, 159],[27, 159],[28, 155]])

export const dark_orange_SliderTrackActive = n150
const n151 = t([[12, 164],[13, 163],[14, 162],[15, 56],[16, 0],[17, 228],[18, 154],[19, 155],[20, 154],[21, 155],[22, 227],[23, 56],[24, 161],[25, 162],[26, 56],[27, 157],[28, 157]])

export const dark_orange_SliderThumb = n151
export const dark_orange_Tooltip = n151
export const dark_orange_ProgressIndicator = n151
const n152 = t([[12, 199],[13, 200],[14, 201],[15, 202],[16, 198],[17, 229],[18, 0],[19, 208],[20, 0],[21, 208],[22, 230],[23, 202],[24, 203],[25, 201],[26, 202],[27, 206],[28, 206]])

export const dark_yellow_ListItem = n152
const n153 = t([[12, 200],[13, 201],[14, 202],[15, 203],[16, 199],[17, 198],[18, 0],[19, 208],[20, 0],[21, 208],[22, 0],[23, 203],[24, 205],[25, 202],[26, 203],[27, 104],[28, 207]])

export const dark_yellow_Card = n153
export const dark_yellow_DrawerFrame = n153
export const dark_yellow_Progress = n153
export const dark_yellow_TooltipArrow = n153
const n154 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 0],[19, 208],[20, 0],[21, 208],[22, 208],[23, 203],[24, 205],[25, 202],[26, 203],[27, 205],[28, 208]])

export const dark_yellow_Button = n154
export const dark_yellow_Switch = n154
export const dark_yellow_TooltipContent = n154
export const dark_yellow_SliderTrack = n154
const n155 = t([[12, 199],[13, 200],[14, 201],[15, 202],[16, 198],[17, 229],[18, 0],[19, 208],[20, 0],[21, 208],[22, 230],[23, 205],[24, 104],[25, 203],[26, 205],[27, 206],[28, 206]])

export const dark_yellow_Checkbox = n155
export const dark_yellow_RadioGroupItem = n155
export const dark_yellow_Input = n155
export const dark_yellow_TextArea = n155
const n156 = t([[12, 0],[13, 0],[14, 208],[15, 207],[16, 0],[17, 0],[18, 198],[19, 199],[20, 198],[21, 199],[22, 198],[23, 207],[24, 206],[25, 208],[26, 207],[27, 199],[28, 203]])

export const dark_yellow_SwitchThumb = n156
const n157 = t([[12, 206],[13, 104],[14, 205],[15, 203],[16, 207],[17, 208],[18, 198],[19, 199],[20, 198],[21, 199],[22, 199],[23, 203],[24, 202],[25, 205],[26, 203],[27, 203],[28, 199]])

export const dark_yellow_SliderTrackActive = n157
const n158 = t([[12, 208],[13, 207],[14, 206],[15, 104],[16, 0],[17, 230],[18, 198],[19, 199],[20, 198],[21, 199],[22, 229],[23, 104],[24, 205],[25, 206],[26, 104],[27, 201],[28, 201]])

export const dark_yellow_SliderThumb = n158
export const dark_yellow_Tooltip = n158
export const dark_yellow_ProgressIndicator = n158
const n159 = t([[12, 144],[13, 145],[14, 146],[15, 147],[16, 143],[17, 231],[18, 0],[19, 153],[20, 0],[21, 153],[22, 232],[23, 147],[24, 148],[25, 146],[26, 147],[27, 151],[28, 151]])

export const dark_green_ListItem = n159
const n160 = t([[12, 145],[13, 146],[14, 147],[15, 148],[16, 144],[17, 143],[18, 0],[19, 153],[20, 0],[21, 153],[22, 0],[23, 148],[24, 150],[25, 147],[26, 148],[27, 44],[28, 152]])

export const dark_green_Card = n160
export const dark_green_DrawerFrame = n160
export const dark_green_Progress = n160
export const dark_green_TooltipArrow = n160
const n161 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 0],[19, 153],[20, 0],[21, 153],[22, 153],[23, 148],[24, 150],[25, 147],[26, 148],[27, 150],[28, 153]])

export const dark_green_Button = n161
export const dark_green_Switch = n161
export const dark_green_TooltipContent = n161
export const dark_green_SliderTrack = n161
const n162 = t([[12, 144],[13, 145],[14, 146],[15, 147],[16, 143],[17, 231],[18, 0],[19, 153],[20, 0],[21, 153],[22, 232],[23, 150],[24, 44],[25, 148],[26, 150],[27, 151],[28, 151]])

export const dark_green_Checkbox = n162
export const dark_green_RadioGroupItem = n162
export const dark_green_Input = n162
export const dark_green_TextArea = n162
const n163 = t([[12, 0],[13, 0],[14, 153],[15, 152],[16, 0],[17, 0],[18, 143],[19, 144],[20, 143],[21, 144],[22, 143],[23, 152],[24, 151],[25, 153],[26, 152],[27, 144],[28, 148]])

export const dark_green_SwitchThumb = n163
const n164 = t([[12, 151],[13, 44],[14, 150],[15, 148],[16, 152],[17, 153],[18, 143],[19, 144],[20, 143],[21, 144],[22, 144],[23, 148],[24, 147],[25, 150],[26, 148],[27, 148],[28, 144]])

export const dark_green_SliderTrackActive = n164
const n165 = t([[12, 153],[13, 152],[14, 151],[15, 44],[16, 0],[17, 232],[18, 143],[19, 144],[20, 143],[21, 144],[22, 231],[23, 44],[24, 150],[25, 151],[26, 44],[27, 146],[28, 146]])

export const dark_green_SliderThumb = n165
export const dark_green_Tooltip = n165
export const dark_green_ProgressIndicator = n165
const n166 = t([[12, 122],[13, 123],[14, 124],[15, 125],[16, 121],[17, 233],[18, 0],[19, 131],[20, 0],[21, 131],[22, 234],[23, 125],[24, 126],[25, 124],[26, 125],[27, 129],[28, 129]])

export const dark_blue_ListItem = n166
const n167 = t([[12, 123],[13, 124],[14, 125],[15, 126],[16, 122],[17, 121],[18, 0],[19, 131],[20, 0],[21, 131],[22, 0],[23, 126],[24, 128],[25, 125],[26, 126],[27, 22],[28, 130]])

export const dark_blue_Card = n167
export const dark_blue_DrawerFrame = n167
export const dark_blue_Progress = n167
export const dark_blue_TooltipArrow = n167
const n168 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 0],[19, 131],[20, 0],[21, 131],[22, 131],[23, 126],[24, 128],[25, 125],[26, 126],[27, 128],[28, 131]])

export const dark_blue_Button = n168
export const dark_blue_Switch = n168
export const dark_blue_TooltipContent = n168
export const dark_blue_SliderTrack = n168
const n169 = t([[12, 122],[13, 123],[14, 124],[15, 125],[16, 121],[17, 233],[18, 0],[19, 131],[20, 0],[21, 131],[22, 234],[23, 128],[24, 22],[25, 126],[26, 128],[27, 129],[28, 129]])

export const dark_blue_Checkbox = n169
export const dark_blue_RadioGroupItem = n169
export const dark_blue_Input = n169
export const dark_blue_TextArea = n169
const n170 = t([[12, 0],[13, 0],[14, 131],[15, 130],[16, 0],[17, 0],[18, 121],[19, 122],[20, 121],[21, 122],[22, 121],[23, 130],[24, 129],[25, 131],[26, 130],[27, 122],[28, 126]])

export const dark_blue_SwitchThumb = n170
const n171 = t([[12, 129],[13, 22],[14, 128],[15, 126],[16, 130],[17, 131],[18, 121],[19, 122],[20, 121],[21, 122],[22, 122],[23, 126],[24, 125],[25, 128],[26, 126],[27, 126],[28, 122]])

export const dark_blue_SliderTrackActive = n171
const n172 = t([[12, 131],[13, 130],[14, 129],[15, 22],[16, 0],[17, 234],[18, 121],[19, 122],[20, 121],[21, 122],[22, 233],[23, 22],[24, 128],[25, 129],[26, 22],[27, 124],[28, 124]])

export const dark_blue_SliderThumb = n172
export const dark_blue_Tooltip = n172
export const dark_blue_ProgressIndicator = n172
const n173 = t([[12, 177],[13, 178],[14, 179],[15, 180],[16, 176],[17, 235],[18, 0],[19, 186],[20, 0],[21, 186],[22, 236],[23, 180],[24, 181],[25, 179],[26, 180],[27, 184],[28, 184]])

export const dark_purple_ListItem = n173
const n174 = t([[12, 178],[13, 179],[14, 180],[15, 181],[16, 177],[17, 176],[18, 0],[19, 186],[20, 0],[21, 186],[22, 0],[23, 181],[24, 183],[25, 180],[26, 181],[27, 80],[28, 185]])

export const dark_purple_Card = n174
export const dark_purple_DrawerFrame = n174
export const dark_purple_Progress = n174
export const dark_purple_TooltipArrow = n174
const n175 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 0],[19, 186],[20, 0],[21, 186],[22, 186],[23, 181],[24, 183],[25, 180],[26, 181],[27, 183],[28, 186]])

export const dark_purple_Button = n175
export const dark_purple_Switch = n175
export const dark_purple_TooltipContent = n175
export const dark_purple_SliderTrack = n175
const n176 = t([[12, 177],[13, 178],[14, 179],[15, 180],[16, 176],[17, 235],[18, 0],[19, 186],[20, 0],[21, 186],[22, 236],[23, 183],[24, 80],[25, 181],[26, 183],[27, 184],[28, 184]])

export const dark_purple_Checkbox = n176
export const dark_purple_RadioGroupItem = n176
export const dark_purple_Input = n176
export const dark_purple_TextArea = n176
const n177 = t([[12, 0],[13, 0],[14, 186],[15, 185],[16, 0],[17, 0],[18, 176],[19, 177],[20, 176],[21, 177],[22, 176],[23, 185],[24, 184],[25, 186],[26, 185],[27, 177],[28, 181]])

export const dark_purple_SwitchThumb = n177
const n178 = t([[12, 184],[13, 80],[14, 183],[15, 181],[16, 185],[17, 186],[18, 176],[19, 177],[20, 176],[21, 177],[22, 177],[23, 181],[24, 180],[25, 183],[26, 181],[27, 181],[28, 177]])

export const dark_purple_SliderTrackActive = n178
const n179 = t([[12, 186],[13, 185],[14, 184],[15, 80],[16, 0],[17, 236],[18, 176],[19, 177],[20, 176],[21, 177],[22, 235],[23, 80],[24, 183],[25, 184],[26, 80],[27, 179],[28, 179]])

export const dark_purple_SliderThumb = n179
export const dark_purple_Tooltip = n179
export const dark_purple_ProgressIndicator = n179
const n180 = t([[12, 166],[13, 167],[14, 168],[15, 169],[16, 165],[17, 237],[18, 0],[19, 175],[20, 0],[21, 175],[22, 238],[23, 169],[24, 170],[25, 168],[26, 169],[27, 173],[28, 173]])

export const dark_pink_ListItem = n180
const n181 = t([[12, 167],[13, 168],[14, 169],[15, 170],[16, 166],[17, 165],[18, 0],[19, 175],[20, 0],[21, 175],[22, 0],[23, 170],[24, 172],[25, 169],[26, 170],[27, 68],[28, 174]])

export const dark_pink_Card = n181
export const dark_pink_DrawerFrame = n181
export const dark_pink_Progress = n181
export const dark_pink_TooltipArrow = n181
const n182 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 0],[19, 175],[20, 0],[21, 175],[22, 175],[23, 170],[24, 172],[25, 169],[26, 170],[27, 172],[28, 175]])

export const dark_pink_Button = n182
export const dark_pink_Switch = n182
export const dark_pink_TooltipContent = n182
export const dark_pink_SliderTrack = n182
const n183 = t([[12, 166],[13, 167],[14, 168],[15, 169],[16, 165],[17, 237],[18, 0],[19, 175],[20, 0],[21, 175],[22, 238],[23, 172],[24, 68],[25, 170],[26, 172],[27, 173],[28, 173]])

export const dark_pink_Checkbox = n183
export const dark_pink_RadioGroupItem = n183
export const dark_pink_Input = n183
export const dark_pink_TextArea = n183
const n184 = t([[12, 0],[13, 0],[14, 175],[15, 174],[16, 0],[17, 0],[18, 165],[19, 166],[20, 165],[21, 166],[22, 165],[23, 174],[24, 173],[25, 175],[26, 174],[27, 166],[28, 170]])

export const dark_pink_SwitchThumb = n184
const n185 = t([[12, 173],[13, 68],[14, 172],[15, 170],[16, 174],[17, 175],[18, 165],[19, 166],[20, 165],[21, 166],[22, 166],[23, 170],[24, 169],[25, 172],[26, 170],[27, 170],[28, 166]])

export const dark_pink_SliderTrackActive = n185
const n186 = t([[12, 175],[13, 174],[14, 173],[15, 68],[16, 0],[17, 238],[18, 165],[19, 166],[20, 165],[21, 166],[22, 237],[23, 68],[24, 172],[25, 173],[26, 68],[27, 168],[28, 168]])

export const dark_pink_SliderThumb = n186
export const dark_pink_Tooltip = n186
export const dark_pink_ProgressIndicator = n186
const n187 = t([[12, 188],[13, 189],[14, 190],[15, 191],[16, 187],[17, 239],[18, 0],[19, 197],[20, 0],[21, 197],[22, 240],[23, 191],[24, 192],[25, 190],[26, 191],[27, 195],[28, 195]])

export const dark_red_ListItem = n187
const n188 = t([[12, 189],[13, 190],[14, 191],[15, 192],[16, 188],[17, 187],[18, 0],[19, 197],[20, 0],[21, 197],[22, 0],[23, 192],[24, 194],[25, 191],[26, 192],[27, 92],[28, 196]])

export const dark_red_Card = n188
export const dark_red_DrawerFrame = n188
export const dark_red_Progress = n188
export const dark_red_TooltipArrow = n188
const n189 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 0],[19, 197],[20, 0],[21, 197],[22, 197],[23, 192],[24, 194],[25, 191],[26, 192],[27, 194],[28, 197]])

export const dark_red_Button = n189
export const dark_red_Switch = n189
export const dark_red_TooltipContent = n189
export const dark_red_SliderTrack = n189
const n190 = t([[12, 188],[13, 189],[14, 190],[15, 191],[16, 187],[17, 239],[18, 0],[19, 197],[20, 0],[21, 197],[22, 240],[23, 194],[24, 92],[25, 192],[26, 194],[27, 195],[28, 195]])

export const dark_red_Checkbox = n190
export const dark_red_RadioGroupItem = n190
export const dark_red_Input = n190
export const dark_red_TextArea = n190
const n191 = t([[12, 0],[13, 0],[14, 197],[15, 196],[16, 0],[17, 0],[18, 187],[19, 188],[20, 187],[21, 188],[22, 187],[23, 196],[24, 195],[25, 197],[26, 196],[27, 188],[28, 192]])

export const dark_red_SwitchThumb = n191
const n192 = t([[12, 195],[13, 92],[14, 194],[15, 192],[16, 196],[17, 197],[18, 187],[19, 188],[20, 187],[21, 188],[22, 188],[23, 192],[24, 191],[25, 194],[26, 192],[27, 192],[28, 188]])

export const dark_red_SliderTrackActive = n192
const n193 = t([[12, 197],[13, 196],[14, 195],[15, 92],[16, 0],[17, 240],[18, 187],[19, 188],[20, 187],[21, 188],[22, 239],[23, 92],[24, 194],[25, 195],[26, 92],[27, 190],[28, 190]])

export const dark_red_SliderThumb = n193
export const dark_red_Tooltip = n193
export const dark_red_ProgressIndicator = n193
const n194 = t([[12, 133],[13, 134],[14, 135],[15, 136],[16, 132],[17, 241],[18, 0],[19, 29],[20, 0],[21, 29],[22, 242],[23, 136],[24, 137],[25, 135],[26, 136],[27, 141],[28, 141]])

export const dark_gray_ListItem = n194
const n195 = t([[12, 134],[13, 135],[14, 136],[15, 137],[16, 133],[17, 132],[18, 0],[19, 29],[20, 0],[21, 29],[22, 0],[23, 137],[24, 139],[25, 136],[26, 137],[27, 140],[28, 142]])

export const dark_gray_Card = n195
export const dark_gray_DrawerFrame = n195
export const dark_gray_Progress = n195
export const dark_gray_TooltipArrow = n195
const n196 = t([[12, 135],[13, 136],[14, 137],[15, 139],[16, 134],[17, 133],[18, 0],[19, 29],[20, 0],[21, 29],[22, 29],[23, 137],[24, 139],[25, 136],[26, 137],[27, 139],[28, 29]])

export const dark_gray_Button = n196
export const dark_gray_Switch = n196
export const dark_gray_TooltipContent = n196
export const dark_gray_SliderTrack = n196
const n197 = t([[12, 133],[13, 134],[14, 135],[15, 136],[16, 132],[17, 241],[18, 0],[19, 29],[20, 0],[21, 29],[22, 242],[23, 139],[24, 140],[25, 137],[26, 139],[27, 141],[28, 141]])

export const dark_gray_Checkbox = n197
export const dark_gray_RadioGroupItem = n197
export const dark_gray_Input = n197
export const dark_gray_TextArea = n197
const n198 = t([[12, 0],[13, 0],[14, 29],[15, 142],[16, 0],[17, 0],[18, 132],[19, 133],[20, 132],[21, 133],[22, 132],[23, 142],[24, 141],[25, 29],[26, 142],[27, 133],[28, 137]])

export const dark_gray_SwitchThumb = n198
const n199 = t([[12, 141],[13, 140],[14, 139],[15, 137],[16, 142],[17, 29],[18, 132],[19, 133],[20, 132],[21, 133],[22, 133],[23, 137],[24, 136],[25, 139],[26, 137],[27, 137],[28, 133]])

export const dark_gray_SliderTrackActive = n199
const n200 = t([[12, 29],[13, 142],[14, 141],[15, 140],[16, 0],[17, 242],[18, 132],[19, 133],[20, 132],[21, 133],[22, 241],[23, 140],[24, 139],[25, 141],[26, 140],[27, 135],[28, 135]])

export const dark_gray_SliderThumb = n200
export const dark_gray_Tooltip = n200
export const dark_gray_ProgressIndicator = n200
const n201 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7],[28, 9]])

export const light_alt1_ListItem = n201
const n202 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 10],[19, 9],[20, 10],[21, 9],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6],[28, 10]])

export const light_alt1_Card = n202
export const light_alt1_DrawerFrame = n202
export const light_alt1_Progress = n202
export const light_alt1_TooltipArrow = n202
const n203 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 10],[19, 9],[20, 10],[21, 9],[22, 9],[23, 6],[24, 7],[25, 5],[26, 6],[27, 5],[28, 11]])

export const light_alt1_Button = n203
export const light_alt1_Switch = n203
export const light_alt1_TooltipContent = n203
export const light_alt1_SliderTrack = n203
const n204 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 7],[24, 8],[25, 6],[26, 7],[27, 7],[28, 9]])

export const light_alt1_Checkbox = n204
export const light_alt1_RadioGroupItem = n204
export const light_alt1_Input = n204
export const light_alt1_TextArea = n204
const n205 = t([[12, 11],[13, 10],[14, 9],[15, 8],[16, 11],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 8],[24, 7],[25, 9],[26, 8],[27, 2],[28, 4]])

export const light_alt1_SwitchThumb = n205
const n206 = t([[12, 7],[13, 6],[14, 5],[15, 4],[16, 8],[17, 9],[18, 1],[19, 2],[20, 1],[21, 2],[22, 2],[23, 4],[24, 3],[25, 5],[26, 4],[27, 6],[28, 0]])

export const light_alt1_SliderTrackActive = n206
const n207 = t([[12, 9],[13, 8],[14, 7],[15, 6],[16, 10],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 6],[24, 5],[25, 7],[26, 6],[27, 4],[28, 2]])

export const light_alt1_SliderThumb = n207
export const light_alt1_Tooltip = n207
export const light_alt1_ProgressIndicator = n207
const n208 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 5],[24, 6],[25, 4],[26, 5],[27, 6],[28, 10]])

export const light_alt2_ListItem = n208
const n209 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 9],[19, 8],[20, 9],[21, 8],[22, 9],[23, 6],[24, 7],[25, 5],[26, 6],[27, 5],[28, 11]])

export const light_alt2_Card = n209
export const light_alt2_DrawerFrame = n209
export const light_alt2_Progress = n209
export const light_alt2_TooltipArrow = n209
const n210 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[18, 9],[19, 8],[20, 9],[21, 8],[22, 8],[23, 6],[24, 7],[25, 5],[26, 6],[27, 4],[28, 11]])

export const light_alt2_Button = n210
export const light_alt2_Switch = n210
export const light_alt2_TooltipContent = n210
export const light_alt2_SliderTrack = n210
const n211 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 7],[24, 8],[25, 6],[26, 7],[27, 6],[28, 10]])

export const light_alt2_Checkbox = n211
export const light_alt2_RadioGroupItem = n211
export const light_alt2_Input = n211
export const light_alt2_TextArea = n211
const n212 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 11],[18, 2],[19, 3],[20, 2],[21, 3],[22, 0],[23, 8],[24, 7],[25, 9],[26, 8],[27, 3],[28, 3]])

export const light_alt2_SwitchThumb = n212
const n213 = t([[12, 6],[13, 5],[14, 4],[15, 3],[16, 7],[17, 8],[18, 2],[19, 3],[20, 2],[21, 3],[22, 3],[23, 4],[24, 3],[25, 5],[26, 4],[27, 7],[28, 0]])

export const light_alt2_SliderTrackActive = n213
const n214 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 2],[19, 3],[20, 2],[21, 3],[22, 1],[23, 6],[24, 5],[25, 7],[26, 6],[27, 5],[28, 1]])

export const light_alt2_SliderThumb = n214
export const light_alt2_Tooltip = n214
export const light_alt2_ProgressIndicator = n214
const n215 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 6],[24, 7],[25, 5],[26, 6],[27, 5],[28, 11]])

export const light_active_ListItem = n215
const n216 = t([[12, 6],[13, 7],[14, 8],[15, 9],[16, 5],[17, 4],[19, 7],[20, 8],[21, 7],[22, 7],[23, 7],[24, 8],[25, 6],[26, 7],[27, 3],[28, 11]])

export const light_active_Button = n216
export const light_active_Switch = n216
const n217 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 8],[24, 9],[25, 7],[26, 8],[27, 5],[28, 11]])

export const light_active_Checkbox = n217
export const light_active_Input = n217
export const light_active_TextArea = n217
const n218 = t([[12, 5],[13, 4],[14, 3],[15, 2],[16, 6],[17, 7],[19, 4],[20, 3],[21, 4],[22, 4],[23, 3],[24, 2],[25, 4],[26, 3],[27, 8],[28, 0]])

export const light_active_SliderTrackActive = n218
const n219 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117],[28, 119]])

export const dark_alt1_ListItem = n219
const n220 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 120],[19, 119],[20, 120],[21, 119],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116],[28, 120]])

export const dark_alt1_Card = n220
export const dark_alt1_DrawerFrame = n220
export const dark_alt1_Progress = n220
export const dark_alt1_TooltipArrow = n220
const n221 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 120],[19, 119],[20, 120],[21, 119],[22, 119],[23, 116],[24, 117],[25, 115],[26, 116],[27, 115],[28, 0]])

export const dark_alt1_Button = n221
export const dark_alt1_Switch = n221
export const dark_alt1_TooltipContent = n221
export const dark_alt1_SliderTrack = n221
const n222 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 117],[24, 118],[25, 116],[26, 117],[27, 117],[28, 119]])

export const dark_alt1_Checkbox = n222
export const dark_alt1_RadioGroupItem = n222
export const dark_alt1_Input = n222
export const dark_alt1_TextArea = n222
const n223 = t([[12, 0],[13, 120],[14, 119],[15, 118],[16, 0],[17, 0],[18, 111],[19, 112],[20, 111],[21, 112],[22, 110],[23, 118],[24, 117],[25, 119],[26, 118],[27, 112],[28, 114]])

export const dark_alt1_SwitchThumb = n223
const n224 = t([[12, 117],[13, 116],[14, 115],[15, 114],[16, 118],[17, 119],[18, 111],[19, 112],[20, 111],[21, 112],[22, 112],[23, 114],[24, 113],[25, 115],[26, 114],[27, 116],[28, 110]])

export const dark_alt1_SliderTrackActive = n224
const n225 = t([[12, 119],[13, 118],[14, 117],[15, 116],[16, 120],[17, 0],[18, 111],[19, 112],[20, 111],[21, 112],[22, 110],[23, 116],[24, 115],[25, 117],[26, 116],[27, 114],[28, 112]])

export const dark_alt1_SliderThumb = n225
export const dark_alt1_Tooltip = n225
export const dark_alt1_ProgressIndicator = n225
const n226 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 115],[24, 116],[25, 114],[26, 115],[27, 116],[28, 120]])

export const dark_alt2_ListItem = n226
const n227 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 119],[19, 118],[20, 119],[21, 118],[22, 119],[23, 116],[24, 117],[25, 115],[26, 116],[27, 115],[28, 0]])

export const dark_alt2_Card = n227
export const dark_alt2_DrawerFrame = n227
export const dark_alt2_Progress = n227
export const dark_alt2_TooltipArrow = n227
const n228 = t([[12, 115],[13, 116],[14, 117],[15, 118],[16, 114],[17, 113],[18, 119],[19, 118],[20, 119],[21, 118],[22, 118],[23, 116],[24, 117],[25, 115],[26, 116],[27, 114],[28, 0]])

export const dark_alt2_Button = n228
export const dark_alt2_Switch = n228
export const dark_alt2_TooltipContent = n228
export const dark_alt2_SliderTrack = n228
const n229 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 117],[24, 118],[25, 116],[26, 117],[27, 116],[28, 120]])

export const dark_alt2_Checkbox = n229
export const dark_alt2_RadioGroupItem = n229
export const dark_alt2_Input = n229
export const dark_alt2_TextArea = n229
const n230 = t([[12, 120],[13, 119],[14, 118],[15, 117],[16, 0],[17, 0],[18, 112],[19, 113],[20, 112],[21, 113],[22, 110],[23, 118],[24, 117],[25, 119],[26, 118],[27, 113],[28, 113]])

export const dark_alt2_SwitchThumb = n230
const n231 = t([[12, 116],[13, 115],[14, 114],[15, 113],[16, 117],[17, 118],[18, 112],[19, 113],[20, 112],[21, 113],[22, 113],[23, 114],[24, 113],[25, 115],[26, 114],[27, 117],[28, 110]])

export const dark_alt2_SliderTrackActive = n231
const n232 = t([[12, 118],[13, 117],[14, 116],[15, 115],[16, 119],[17, 120],[18, 112],[19, 113],[20, 112],[21, 113],[22, 111],[23, 116],[24, 115],[25, 117],[26, 116],[27, 115],[28, 111]])

export const dark_alt2_SliderThumb = n232
export const dark_alt2_Tooltip = n232
export const dark_alt2_ProgressIndicator = n232
const n233 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 116],[24, 117],[25, 115],[26, 116],[27, 115],[28, 0]])

export const dark_active_ListItem = n233
const n234 = t([[12, 116],[13, 117],[14, 118],[15, 119],[16, 115],[17, 114],[19, 117],[20, 118],[21, 117],[22, 117],[23, 117],[24, 118],[25, 116],[26, 117],[27, 113],[28, 0]])

export const dark_active_Button = n234
export const dark_active_Switch = n234
const n235 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 118],[24, 119],[25, 117],[26, 118],[27, 115],[28, 0]])

export const dark_active_Checkbox = n235
export const dark_active_Input = n235
export const dark_active_TextArea = n235
const n236 = t([[12, 115],[13, 114],[14, 113],[15, 112],[16, 116],[17, 117],[19, 114],[20, 113],[21, 114],[22, 114],[23, 113],[24, 112],[25, 114],[26, 113],[27, 118],[28, 110]])

export const dark_active_SliderTrackActive = n236
const n237 = t([[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 59],[19, 58],[20, 59],[21, 58],[22, 11],[23, 52],[24, 53],[25, 52],[26, 52],[27, 56],[28, 58]])

export const light_orange_alt1_ListItem = n237
const n238 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 59],[19, 58],[20, 59],[21, 58],[22, 59],[23, 53],[24, 55],[25, 53],[26, 53],[27, 55],[28, 59]])

export const light_orange_alt1_Card = n238
export const light_orange_alt1_DrawerFrame = n238
export const light_orange_alt1_Progress = n238
export const light_orange_alt1_TooltipArrow = n238
const n239 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[18, 59],[19, 58],[20, 59],[21, 58],[22, 58],[23, 53],[24, 55],[25, 53],[26, 53],[27, 53],[28, 11]])

export const light_orange_alt1_Button = n239
export const light_orange_alt1_Switch = n239
export const light_orange_alt1_TooltipContent = n239
export const light_orange_alt1_SliderTrack = n239
const n240 = t([[12, 50],[13, 51],[14, 52],[15, 53],[16, 49],[17, 48],[18, 59],[19, 58],[20, 59],[21, 58],[22, 11],[23, 55],[24, 56],[25, 55],[26, 55],[27, 56],[28, 58]])

export const light_orange_alt1_Checkbox = n240
export const light_orange_alt1_RadioGroupItem = n240
export const light_orange_alt1_Input = n240
export const light_orange_alt1_TextArea = n240
const n241 = t([[12, 11],[13, 59],[14, 58],[15, 57],[16, 11],[17, 11],[18, 49],[19, 50],[20, 49],[21, 50],[22, 48],[23, 58],[24, 57],[25, 58],[26, 58],[27, 50],[28, 52]])

export const light_orange_alt1_SwitchThumb = n241
const n242 = t([[12, 56],[13, 55],[14, 53],[15, 52],[16, 57],[17, 58],[18, 49],[19, 50],[20, 49],[21, 50],[22, 50],[23, 53],[24, 52],[25, 53],[26, 53],[27, 55],[28, 48]])

export const light_orange_alt1_SliderTrackActive = n242
const n243 = t([[12, 58],[13, 57],[14, 56],[15, 55],[16, 59],[17, 11],[18, 49],[19, 50],[20, 49],[21, 50],[22, 48],[23, 56],[24, 55],[25, 56],[26, 56],[27, 52],[28, 50]])

export const light_orange_alt1_SliderThumb = n243
export const light_orange_alt1_Tooltip = n243
export const light_orange_alt1_ProgressIndicator = n243
const n244 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 58],[19, 57],[20, 58],[21, 57],[22, 59],[23, 52],[24, 53],[25, 52],[26, 52],[27, 55],[28, 59]])

export const light_orange_alt2_ListItem = n244
const n245 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[18, 58],[19, 57],[20, 58],[21, 57],[22, 58],[23, 53],[24, 55],[25, 53],[26, 53],[27, 53],[28, 11]])

export const light_orange_alt2_Card = n245
export const light_orange_alt2_DrawerFrame = n245
export const light_orange_alt2_Progress = n245
export const light_orange_alt2_TooltipArrow = n245
const n246 = t([[12, 53],[13, 55],[14, 56],[15, 57],[16, 52],[17, 51],[18, 58],[19, 57],[20, 58],[21, 57],[22, 57],[23, 53],[24, 55],[25, 53],[26, 53],[27, 52],[28, 11]])

export const light_orange_alt2_Button = n246
export const light_orange_alt2_Switch = n246
export const light_orange_alt2_TooltipContent = n246
export const light_orange_alt2_SliderTrack = n246
const n247 = t([[12, 51],[13, 52],[14, 53],[15, 55],[16, 50],[17, 49],[18, 58],[19, 57],[20, 58],[21, 57],[22, 59],[23, 55],[24, 56],[25, 55],[26, 55],[27, 55],[28, 59]])

export const light_orange_alt2_Checkbox = n247
export const light_orange_alt2_RadioGroupItem = n247
export const light_orange_alt2_Input = n247
export const light_orange_alt2_TextArea = n247
const n248 = t([[12, 59],[13, 58],[14, 57],[15, 56],[16, 11],[17, 11],[18, 50],[19, 51],[20, 50],[21, 51],[22, 48],[23, 58],[24, 57],[25, 58],[26, 58],[27, 51],[28, 51]])

export const light_orange_alt2_SwitchThumb = n248
const n249 = t([[12, 55],[13, 53],[14, 52],[15, 51],[16, 56],[17, 57],[18, 50],[19, 51],[20, 50],[21, 51],[22, 51],[23, 53],[24, 52],[25, 53],[26, 53],[27, 56],[28, 48]])

export const light_orange_alt2_SliderTrackActive = n249
const n250 = t([[12, 57],[13, 56],[14, 55],[15, 53],[16, 58],[17, 59],[18, 50],[19, 51],[20, 50],[21, 51],[22, 49],[23, 56],[24, 55],[25, 56],[26, 56],[27, 53],[28, 49]])

export const light_orange_alt2_SliderThumb = n250
export const light_orange_alt2_Tooltip = n250
export const light_orange_alt2_ProgressIndicator = n250
const n251 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[19, 56],[20, 57],[21, 56],[22, 58],[23, 53],[24, 55],[25, 53],[26, 53],[27, 53],[28, 11]])

export const light_orange_active_ListItem = n251
const n252 = t([[12, 55],[13, 56],[14, 57],[15, 58],[16, 53],[17, 52],[19, 56],[20, 57],[21, 56],[22, 56],[23, 55],[24, 56],[25, 55],[26, 55],[27, 51],[28, 11]])

export const light_orange_active_Button = n252
export const light_orange_active_Switch = n252
const n253 = t([[12, 52],[13, 53],[14, 55],[15, 56],[16, 51],[17, 50],[19, 56],[20, 57],[21, 56],[22, 58],[23, 56],[24, 57],[25, 56],[26, 56],[27, 53],[28, 11]])

export const light_orange_active_Checkbox = n253
export const light_orange_active_Input = n253
export const light_orange_active_TextArea = n253
const n254 = t([[12, 53],[13, 52],[14, 51],[15, 50],[16, 55],[17, 56],[19, 52],[20, 51],[21, 52],[22, 52],[23, 52],[24, 51],[25, 52],[26, 52],[27, 57],[28, 48]])

export const light_orange_active_SliderTrackActive = n254
const n255 = t([[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 107],[19, 106],[20, 107],[21, 106],[22, 11],[23, 100],[24, 101],[25, 100],[26, 100],[27, 104],[28, 106]])

export const light_yellow_alt1_ListItem = n255
const n256 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 107],[19, 106],[20, 107],[21, 106],[22, 107],[23, 101],[24, 103],[25, 101],[26, 101],[27, 103],[28, 107]])

export const light_yellow_alt1_Card = n256
export const light_yellow_alt1_DrawerFrame = n256
export const light_yellow_alt1_Progress = n256
export const light_yellow_alt1_TooltipArrow = n256
const n257 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[18, 107],[19, 106],[20, 107],[21, 106],[22, 106],[23, 101],[24, 103],[25, 101],[26, 101],[27, 101],[28, 11]])

export const light_yellow_alt1_Button = n257
export const light_yellow_alt1_Switch = n257
export const light_yellow_alt1_TooltipContent = n257
export const light_yellow_alt1_SliderTrack = n257
const n258 = t([[12, 98],[13, 99],[14, 100],[15, 101],[16, 97],[17, 96],[18, 107],[19, 106],[20, 107],[21, 106],[22, 11],[23, 103],[24, 104],[25, 103],[26, 103],[27, 104],[28, 106]])

export const light_yellow_alt1_Checkbox = n258
export const light_yellow_alt1_RadioGroupItem = n258
export const light_yellow_alt1_Input = n258
export const light_yellow_alt1_TextArea = n258
const n259 = t([[12, 11],[13, 107],[14, 106],[15, 105],[16, 11],[17, 11],[18, 97],[19, 98],[20, 97],[21, 98],[22, 96],[23, 106],[24, 105],[25, 106],[26, 106],[27, 98],[28, 100]])

export const light_yellow_alt1_SwitchThumb = n259
const n260 = t([[12, 104],[13, 103],[14, 101],[15, 100],[16, 105],[17, 106],[18, 97],[19, 98],[20, 97],[21, 98],[22, 98],[23, 101],[24, 100],[25, 101],[26, 101],[27, 103],[28, 96]])

export const light_yellow_alt1_SliderTrackActive = n260
const n261 = t([[12, 106],[13, 105],[14, 104],[15, 103],[16, 107],[17, 11],[18, 97],[19, 98],[20, 97],[21, 98],[22, 96],[23, 104],[24, 103],[25, 104],[26, 104],[27, 100],[28, 98]])

export const light_yellow_alt1_SliderThumb = n261
export const light_yellow_alt1_Tooltip = n261
export const light_yellow_alt1_ProgressIndicator = n261
const n262 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 106],[19, 105],[20, 106],[21, 105],[22, 107],[23, 100],[24, 101],[25, 100],[26, 100],[27, 103],[28, 107]])

export const light_yellow_alt2_ListItem = n262
const n263 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[18, 106],[19, 105],[20, 106],[21, 105],[22, 106],[23, 101],[24, 103],[25, 101],[26, 101],[27, 101],[28, 11]])

export const light_yellow_alt2_Card = n263
export const light_yellow_alt2_DrawerFrame = n263
export const light_yellow_alt2_Progress = n263
export const light_yellow_alt2_TooltipArrow = n263
const n264 = t([[12, 101],[13, 103],[14, 104],[15, 105],[16, 100],[17, 99],[18, 106],[19, 105],[20, 106],[21, 105],[22, 105],[23, 101],[24, 103],[25, 101],[26, 101],[27, 100],[28, 11]])

export const light_yellow_alt2_Button = n264
export const light_yellow_alt2_Switch = n264
export const light_yellow_alt2_TooltipContent = n264
export const light_yellow_alt2_SliderTrack = n264
const n265 = t([[12, 99],[13, 100],[14, 101],[15, 103],[16, 98],[17, 97],[18, 106],[19, 105],[20, 106],[21, 105],[22, 107],[23, 103],[24, 104],[25, 103],[26, 103],[27, 103],[28, 107]])

export const light_yellow_alt2_Checkbox = n265
export const light_yellow_alt2_RadioGroupItem = n265
export const light_yellow_alt2_Input = n265
export const light_yellow_alt2_TextArea = n265
const n266 = t([[12, 107],[13, 106],[14, 105],[15, 104],[16, 11],[17, 11],[18, 98],[19, 99],[20, 98],[21, 99],[22, 96],[23, 106],[24, 105],[25, 106],[26, 106],[27, 99],[28, 99]])

export const light_yellow_alt2_SwitchThumb = n266
const n267 = t([[12, 103],[13, 101],[14, 100],[15, 99],[16, 104],[17, 105],[18, 98],[19, 99],[20, 98],[21, 99],[22, 99],[23, 101],[24, 100],[25, 101],[26, 101],[27, 104],[28, 96]])

export const light_yellow_alt2_SliderTrackActive = n267
const n268 = t([[12, 105],[13, 104],[14, 103],[15, 101],[16, 106],[17, 107],[18, 98],[19, 99],[20, 98],[21, 99],[22, 97],[23, 104],[24, 103],[25, 104],[26, 104],[27, 101],[28, 97]])

export const light_yellow_alt2_SliderThumb = n268
export const light_yellow_alt2_Tooltip = n268
export const light_yellow_alt2_ProgressIndicator = n268
const n269 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[19, 104],[20, 105],[21, 104],[22, 106],[23, 101],[24, 103],[25, 101],[26, 101],[27, 101],[28, 11]])

export const light_yellow_active_ListItem = n269
const n270 = t([[12, 103],[13, 104],[14, 105],[15, 106],[16, 101],[17, 100],[19, 104],[20, 105],[21, 104],[22, 104],[23, 103],[24, 104],[25, 103],[26, 103],[27, 99],[28, 11]])

export const light_yellow_active_Button = n270
export const light_yellow_active_Switch = n270
const n271 = t([[12, 100],[13, 101],[14, 103],[15, 104],[16, 99],[17, 98],[19, 104],[20, 105],[21, 104],[22, 106],[23, 104],[24, 105],[25, 104],[26, 104],[27, 101],[28, 11]])

export const light_yellow_active_Checkbox = n271
export const light_yellow_active_Input = n271
export const light_yellow_active_TextArea = n271
const n272 = t([[12, 101],[13, 100],[14, 99],[15, 98],[16, 103],[17, 104],[19, 100],[20, 99],[21, 100],[22, 100],[23, 100],[24, 99],[25, 100],[26, 100],[27, 105],[28, 96]])

export const light_yellow_active_SliderTrackActive = n272
const n273 = t([[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 47],[19, 46],[20, 47],[21, 46],[22, 11],[23, 40],[24, 41],[25, 40],[26, 40],[27, 44],[28, 46]])

export const light_green_alt1_ListItem = n273
const n274 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 47],[19, 46],[20, 47],[21, 46],[22, 47],[23, 41],[24, 43],[25, 41],[26, 41],[27, 43],[28, 47]])

export const light_green_alt1_Card = n274
export const light_green_alt1_DrawerFrame = n274
export const light_green_alt1_Progress = n274
export const light_green_alt1_TooltipArrow = n274
const n275 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[18, 47],[19, 46],[20, 47],[21, 46],[22, 46],[23, 41],[24, 43],[25, 41],[26, 41],[27, 41],[28, 11]])

export const light_green_alt1_Button = n275
export const light_green_alt1_Switch = n275
export const light_green_alt1_TooltipContent = n275
export const light_green_alt1_SliderTrack = n275
const n276 = t([[12, 38],[13, 39],[14, 40],[15, 41],[16, 37],[17, 36],[18, 47],[19, 46],[20, 47],[21, 46],[22, 11],[23, 43],[24, 44],[25, 43],[26, 43],[27, 44],[28, 46]])

export const light_green_alt1_Checkbox = n276
export const light_green_alt1_RadioGroupItem = n276
export const light_green_alt1_Input = n276
export const light_green_alt1_TextArea = n276
const n277 = t([[12, 11],[13, 47],[14, 46],[15, 45],[16, 11],[17, 11],[18, 37],[19, 38],[20, 37],[21, 38],[22, 36],[23, 46],[24, 45],[25, 46],[26, 46],[27, 38],[28, 40]])

export const light_green_alt1_SwitchThumb = n277
const n278 = t([[12, 44],[13, 43],[14, 41],[15, 40],[16, 45],[17, 46],[18, 37],[19, 38],[20, 37],[21, 38],[22, 38],[23, 41],[24, 40],[25, 41],[26, 41],[27, 43],[28, 36]])

export const light_green_alt1_SliderTrackActive = n278
const n279 = t([[12, 46],[13, 45],[14, 44],[15, 43],[16, 47],[17, 11],[18, 37],[19, 38],[20, 37],[21, 38],[22, 36],[23, 44],[24, 43],[25, 44],[26, 44],[27, 40],[28, 38]])

export const light_green_alt1_SliderThumb = n279
export const light_green_alt1_Tooltip = n279
export const light_green_alt1_ProgressIndicator = n279
const n280 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 46],[19, 45],[20, 46],[21, 45],[22, 47],[23, 40],[24, 41],[25, 40],[26, 40],[27, 43],[28, 47]])

export const light_green_alt2_ListItem = n280
const n281 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[18, 46],[19, 45],[20, 46],[21, 45],[22, 46],[23, 41],[24, 43],[25, 41],[26, 41],[27, 41],[28, 11]])

export const light_green_alt2_Card = n281
export const light_green_alt2_DrawerFrame = n281
export const light_green_alt2_Progress = n281
export const light_green_alt2_TooltipArrow = n281
const n282 = t([[12, 41],[13, 43],[14, 44],[15, 45],[16, 40],[17, 39],[18, 46],[19, 45],[20, 46],[21, 45],[22, 45],[23, 41],[24, 43],[25, 41],[26, 41],[27, 40],[28, 11]])

export const light_green_alt2_Button = n282
export const light_green_alt2_Switch = n282
export const light_green_alt2_TooltipContent = n282
export const light_green_alt2_SliderTrack = n282
const n283 = t([[12, 39],[13, 40],[14, 41],[15, 43],[16, 38],[17, 37],[18, 46],[19, 45],[20, 46],[21, 45],[22, 47],[23, 43],[24, 44],[25, 43],[26, 43],[27, 43],[28, 47]])

export const light_green_alt2_Checkbox = n283
export const light_green_alt2_RadioGroupItem = n283
export const light_green_alt2_Input = n283
export const light_green_alt2_TextArea = n283
const n284 = t([[12, 47],[13, 46],[14, 45],[15, 44],[16, 11],[17, 11],[18, 38],[19, 39],[20, 38],[21, 39],[22, 36],[23, 46],[24, 45],[25, 46],[26, 46],[27, 39],[28, 39]])

export const light_green_alt2_SwitchThumb = n284
const n285 = t([[12, 43],[13, 41],[14, 40],[15, 39],[16, 44],[17, 45],[18, 38],[19, 39],[20, 38],[21, 39],[22, 39],[23, 41],[24, 40],[25, 41],[26, 41],[27, 44],[28, 36]])

export const light_green_alt2_SliderTrackActive = n285
const n286 = t([[12, 45],[13, 44],[14, 43],[15, 41],[16, 46],[17, 47],[18, 38],[19, 39],[20, 38],[21, 39],[22, 37],[23, 44],[24, 43],[25, 44],[26, 44],[27, 41],[28, 37]])

export const light_green_alt2_SliderThumb = n286
export const light_green_alt2_Tooltip = n286
export const light_green_alt2_ProgressIndicator = n286
const n287 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[19, 44],[20, 45],[21, 44],[22, 46],[23, 41],[24, 43],[25, 41],[26, 41],[27, 41],[28, 11]])

export const light_green_active_ListItem = n287
const n288 = t([[12, 43],[13, 44],[14, 45],[15, 46],[16, 41],[17, 40],[19, 44],[20, 45],[21, 44],[22, 44],[23, 43],[24, 44],[25, 43],[26, 43],[27, 39],[28, 11]])

export const light_green_active_Button = n288
export const light_green_active_Switch = n288
const n289 = t([[12, 40],[13, 41],[14, 43],[15, 44],[16, 39],[17, 38],[19, 44],[20, 45],[21, 44],[22, 46],[23, 44],[24, 45],[25, 44],[26, 44],[27, 41],[28, 11]])

export const light_green_active_Checkbox = n289
export const light_green_active_Input = n289
export const light_green_active_TextArea = n289
const n290 = t([[12, 41],[13, 40],[14, 39],[15, 38],[16, 43],[17, 44],[19, 40],[20, 39],[21, 40],[22, 40],[23, 40],[24, 39],[25, 40],[26, 40],[27, 45],[28, 36]])

export const light_green_active_SliderTrackActive = n290
const n291 = t([[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 25],[19, 24],[20, 25],[21, 24],[22, 11],[23, 18],[24, 19],[25, 18],[26, 18],[27, 22],[28, 24]])

export const light_blue_alt1_ListItem = n291
const n292 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 25],[19, 24],[20, 25],[21, 24],[22, 25],[23, 19],[24, 21],[25, 19],[26, 19],[27, 21],[28, 25]])

export const light_blue_alt1_Card = n292
export const light_blue_alt1_DrawerFrame = n292
export const light_blue_alt1_Progress = n292
export const light_blue_alt1_TooltipArrow = n292
const n293 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[18, 25],[19, 24],[20, 25],[21, 24],[22, 24],[23, 19],[24, 21],[25, 19],[26, 19],[27, 19],[28, 11]])

export const light_blue_alt1_Button = n293
export const light_blue_alt1_Switch = n293
export const light_blue_alt1_TooltipContent = n293
export const light_blue_alt1_SliderTrack = n293
const n294 = t([[12, 16],[13, 17],[14, 18],[15, 19],[16, 15],[17, 14],[18, 25],[19, 24],[20, 25],[21, 24],[22, 11],[23, 21],[24, 22],[25, 21],[26, 21],[27, 22],[28, 24]])

export const light_blue_alt1_Checkbox = n294
export const light_blue_alt1_RadioGroupItem = n294
export const light_blue_alt1_Input = n294
export const light_blue_alt1_TextArea = n294
const n295 = t([[12, 11],[13, 25],[14, 24],[15, 23],[16, 11],[17, 11],[18, 15],[19, 16],[20, 15],[21, 16],[22, 14],[23, 24],[24, 23],[25, 24],[26, 24],[27, 16],[28, 18]])

export const light_blue_alt1_SwitchThumb = n295
const n296 = t([[12, 22],[13, 21],[14, 19],[15, 18],[16, 23],[17, 24],[18, 15],[19, 16],[20, 15],[21, 16],[22, 16],[23, 19],[24, 18],[25, 19],[26, 19],[27, 21],[28, 14]])

export const light_blue_alt1_SliderTrackActive = n296
const n297 = t([[12, 24],[13, 23],[14, 22],[15, 21],[16, 25],[17, 11],[18, 15],[19, 16],[20, 15],[21, 16],[22, 14],[23, 22],[24, 21],[25, 22],[26, 22],[27, 18],[28, 16]])

export const light_blue_alt1_SliderThumb = n297
export const light_blue_alt1_Tooltip = n297
export const light_blue_alt1_ProgressIndicator = n297
const n298 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 24],[19, 23],[20, 24],[21, 23],[22, 25],[23, 18],[24, 19],[25, 18],[26, 18],[27, 21],[28, 25]])

export const light_blue_alt2_ListItem = n298
const n299 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[18, 24],[19, 23],[20, 24],[21, 23],[22, 24],[23, 19],[24, 21],[25, 19],[26, 19],[27, 19],[28, 11]])

export const light_blue_alt2_Card = n299
export const light_blue_alt2_DrawerFrame = n299
export const light_blue_alt2_Progress = n299
export const light_blue_alt2_TooltipArrow = n299
const n300 = t([[12, 19],[13, 21],[14, 22],[15, 23],[16, 18],[17, 17],[18, 24],[19, 23],[20, 24],[21, 23],[22, 23],[23, 19],[24, 21],[25, 19],[26, 19],[27, 18],[28, 11]])

export const light_blue_alt2_Button = n300
export const light_blue_alt2_Switch = n300
export const light_blue_alt2_TooltipContent = n300
export const light_blue_alt2_SliderTrack = n300
const n301 = t([[12, 17],[13, 18],[14, 19],[15, 21],[16, 16],[17, 15],[18, 24],[19, 23],[20, 24],[21, 23],[22, 25],[23, 21],[24, 22],[25, 21],[26, 21],[27, 21],[28, 25]])

export const light_blue_alt2_Checkbox = n301
export const light_blue_alt2_RadioGroupItem = n301
export const light_blue_alt2_Input = n301
export const light_blue_alt2_TextArea = n301
const n302 = t([[12, 25],[13, 24],[14, 23],[15, 22],[16, 11],[17, 11],[18, 16],[19, 17],[20, 16],[21, 17],[22, 14],[23, 24],[24, 23],[25, 24],[26, 24],[27, 17],[28, 17]])

export const light_blue_alt2_SwitchThumb = n302
const n303 = t([[12, 21],[13, 19],[14, 18],[15, 17],[16, 22],[17, 23],[18, 16],[19, 17],[20, 16],[21, 17],[22, 17],[23, 19],[24, 18],[25, 19],[26, 19],[27, 22],[28, 14]])

export const light_blue_alt2_SliderTrackActive = n303
const n304 = t([[12, 23],[13, 22],[14, 21],[15, 19],[16, 24],[17, 25],[18, 16],[19, 17],[20, 16],[21, 17],[22, 15],[23, 22],[24, 21],[25, 22],[26, 22],[27, 19],[28, 15]])

export const light_blue_alt2_SliderThumb = n304
export const light_blue_alt2_Tooltip = n304
export const light_blue_alt2_ProgressIndicator = n304
const n305 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[19, 22],[20, 23],[21, 22],[22, 24],[23, 19],[24, 21],[25, 19],[26, 19],[27, 19],[28, 11]])

export const light_blue_active_ListItem = n305
const n306 = t([[12, 21],[13, 22],[14, 23],[15, 24],[16, 19],[17, 18],[19, 22],[20, 23],[21, 22],[22, 22],[23, 21],[24, 22],[25, 21],[26, 21],[27, 17],[28, 11]])

export const light_blue_active_Button = n306
export const light_blue_active_Switch = n306
const n307 = t([[12, 18],[13, 19],[14, 21],[15, 22],[16, 17],[17, 16],[19, 22],[20, 23],[21, 22],[22, 24],[23, 22],[24, 23],[25, 22],[26, 22],[27, 19],[28, 11]])

export const light_blue_active_Checkbox = n307
export const light_blue_active_Input = n307
export const light_blue_active_TextArea = n307
const n308 = t([[12, 19],[13, 18],[14, 17],[15, 16],[16, 21],[17, 22],[19, 18],[20, 17],[21, 18],[22, 18],[23, 18],[24, 17],[25, 18],[26, 18],[27, 23],[28, 14]])

export const light_blue_active_SliderTrackActive = n308
const n309 = t([[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 83],[19, 82],[20, 83],[21, 82],[22, 11],[23, 76],[24, 77],[25, 76],[26, 76],[27, 80],[28, 82]])

export const light_purple_alt1_ListItem = n309
const n310 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 83],[19, 82],[20, 83],[21, 82],[22, 83],[23, 77],[24, 79],[25, 77],[26, 77],[27, 79],[28, 83]])

export const light_purple_alt1_Card = n310
export const light_purple_alt1_DrawerFrame = n310
export const light_purple_alt1_Progress = n310
export const light_purple_alt1_TooltipArrow = n310
const n311 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[18, 83],[19, 82],[20, 83],[21, 82],[22, 82],[23, 77],[24, 79],[25, 77],[26, 77],[27, 77],[28, 11]])

export const light_purple_alt1_Button = n311
export const light_purple_alt1_Switch = n311
export const light_purple_alt1_TooltipContent = n311
export const light_purple_alt1_SliderTrack = n311
const n312 = t([[12, 74],[13, 75],[14, 76],[15, 77],[16, 73],[17, 72],[18, 83],[19, 82],[20, 83],[21, 82],[22, 11],[23, 79],[24, 80],[25, 79],[26, 79],[27, 80],[28, 82]])

export const light_purple_alt1_Checkbox = n312
export const light_purple_alt1_RadioGroupItem = n312
export const light_purple_alt1_Input = n312
export const light_purple_alt1_TextArea = n312
const n313 = t([[12, 11],[13, 83],[14, 82],[15, 81],[16, 11],[17, 11],[18, 73],[19, 74],[20, 73],[21, 74],[22, 72],[23, 82],[24, 81],[25, 82],[26, 82],[27, 74],[28, 76]])

export const light_purple_alt1_SwitchThumb = n313
const n314 = t([[12, 80],[13, 79],[14, 77],[15, 76],[16, 81],[17, 82],[18, 73],[19, 74],[20, 73],[21, 74],[22, 74],[23, 77],[24, 76],[25, 77],[26, 77],[27, 79],[28, 72]])

export const light_purple_alt1_SliderTrackActive = n314
const n315 = t([[12, 82],[13, 81],[14, 80],[15, 79],[16, 83],[17, 11],[18, 73],[19, 74],[20, 73],[21, 74],[22, 72],[23, 80],[24, 79],[25, 80],[26, 80],[27, 76],[28, 74]])

export const light_purple_alt1_SliderThumb = n315
export const light_purple_alt1_Tooltip = n315
export const light_purple_alt1_ProgressIndicator = n315
const n316 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 82],[19, 81],[20, 82],[21, 81],[22, 83],[23, 76],[24, 77],[25, 76],[26, 76],[27, 79],[28, 83]])

export const light_purple_alt2_ListItem = n316
const n317 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[18, 82],[19, 81],[20, 82],[21, 81],[22, 82],[23, 77],[24, 79],[25, 77],[26, 77],[27, 77],[28, 11]])

export const light_purple_alt2_Card = n317
export const light_purple_alt2_DrawerFrame = n317
export const light_purple_alt2_Progress = n317
export const light_purple_alt2_TooltipArrow = n317
const n318 = t([[12, 77],[13, 79],[14, 80],[15, 81],[16, 76],[17, 75],[18, 82],[19, 81],[20, 82],[21, 81],[22, 81],[23, 77],[24, 79],[25, 77],[26, 77],[27, 76],[28, 11]])

export const light_purple_alt2_Button = n318
export const light_purple_alt2_Switch = n318
export const light_purple_alt2_TooltipContent = n318
export const light_purple_alt2_SliderTrack = n318
const n319 = t([[12, 75],[13, 76],[14, 77],[15, 79],[16, 74],[17, 73],[18, 82],[19, 81],[20, 82],[21, 81],[22, 83],[23, 79],[24, 80],[25, 79],[26, 79],[27, 79],[28, 83]])

export const light_purple_alt2_Checkbox = n319
export const light_purple_alt2_RadioGroupItem = n319
export const light_purple_alt2_Input = n319
export const light_purple_alt2_TextArea = n319
const n320 = t([[12, 83],[13, 82],[14, 81],[15, 80],[16, 11],[17, 11],[18, 74],[19, 75],[20, 74],[21, 75],[22, 72],[23, 82],[24, 81],[25, 82],[26, 82],[27, 75],[28, 75]])

export const light_purple_alt2_SwitchThumb = n320
const n321 = t([[12, 79],[13, 77],[14, 76],[15, 75],[16, 80],[17, 81],[18, 74],[19, 75],[20, 74],[21, 75],[22, 75],[23, 77],[24, 76],[25, 77],[26, 77],[27, 80],[28, 72]])

export const light_purple_alt2_SliderTrackActive = n321
const n322 = t([[12, 81],[13, 80],[14, 79],[15, 77],[16, 82],[17, 83],[18, 74],[19, 75],[20, 74],[21, 75],[22, 73],[23, 80],[24, 79],[25, 80],[26, 80],[27, 77],[28, 73]])

export const light_purple_alt2_SliderThumb = n322
export const light_purple_alt2_Tooltip = n322
export const light_purple_alt2_ProgressIndicator = n322
const n323 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[19, 80],[20, 81],[21, 80],[22, 82],[23, 77],[24, 79],[25, 77],[26, 77],[27, 77],[28, 11]])

export const light_purple_active_ListItem = n323
const n324 = t([[12, 79],[13, 80],[14, 81],[15, 82],[16, 77],[17, 76],[19, 80],[20, 81],[21, 80],[22, 80],[23, 79],[24, 80],[25, 79],[26, 79],[27, 75],[28, 11]])

export const light_purple_active_Button = n324
export const light_purple_active_Switch = n324
const n325 = t([[12, 76],[13, 77],[14, 79],[15, 80],[16, 75],[17, 74],[19, 80],[20, 81],[21, 80],[22, 82],[23, 80],[24, 81],[25, 80],[26, 80],[27, 77],[28, 11]])

export const light_purple_active_Checkbox = n325
export const light_purple_active_Input = n325
export const light_purple_active_TextArea = n325
const n326 = t([[12, 77],[13, 76],[14, 75],[15, 74],[16, 79],[17, 80],[19, 76],[20, 75],[21, 76],[22, 76],[23, 76],[24, 75],[25, 76],[26, 76],[27, 81],[28, 72]])

export const light_purple_active_SliderTrackActive = n326
const n327 = t([[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 71],[19, 70],[20, 71],[21, 70],[22, 11],[23, 64],[24, 65],[25, 64],[26, 64],[27, 68],[28, 70]])

export const light_pink_alt1_ListItem = n327
const n328 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 71],[19, 70],[20, 71],[21, 70],[22, 71],[23, 65],[24, 67],[25, 65],[26, 65],[27, 67],[28, 71]])

export const light_pink_alt1_Card = n328
export const light_pink_alt1_DrawerFrame = n328
export const light_pink_alt1_Progress = n328
export const light_pink_alt1_TooltipArrow = n328
const n329 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[18, 71],[19, 70],[20, 71],[21, 70],[22, 70],[23, 65],[24, 67],[25, 65],[26, 65],[27, 65],[28, 11]])

export const light_pink_alt1_Button = n329
export const light_pink_alt1_Switch = n329
export const light_pink_alt1_TooltipContent = n329
export const light_pink_alt1_SliderTrack = n329
const n330 = t([[12, 62],[13, 63],[14, 64],[15, 65],[16, 61],[17, 60],[18, 71],[19, 70],[20, 71],[21, 70],[22, 11],[23, 67],[24, 68],[25, 67],[26, 67],[27, 68],[28, 70]])

export const light_pink_alt1_Checkbox = n330
export const light_pink_alt1_RadioGroupItem = n330
export const light_pink_alt1_Input = n330
export const light_pink_alt1_TextArea = n330
const n331 = t([[12, 11],[13, 71],[14, 70],[15, 69],[16, 11],[17, 11],[18, 61],[19, 62],[20, 61],[21, 62],[22, 60],[23, 70],[24, 69],[25, 70],[26, 70],[27, 62],[28, 64]])

export const light_pink_alt1_SwitchThumb = n331
const n332 = t([[12, 68],[13, 67],[14, 65],[15, 64],[16, 69],[17, 70],[18, 61],[19, 62],[20, 61],[21, 62],[22, 62],[23, 65],[24, 64],[25, 65],[26, 65],[27, 67],[28, 60]])

export const light_pink_alt1_SliderTrackActive = n332
const n333 = t([[12, 70],[13, 69],[14, 68],[15, 67],[16, 71],[17, 11],[18, 61],[19, 62],[20, 61],[21, 62],[22, 60],[23, 68],[24, 67],[25, 68],[26, 68],[27, 64],[28, 62]])

export const light_pink_alt1_SliderThumb = n333
export const light_pink_alt1_Tooltip = n333
export const light_pink_alt1_ProgressIndicator = n333
const n334 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 70],[19, 69],[20, 70],[21, 69],[22, 71],[23, 64],[24, 65],[25, 64],[26, 64],[27, 67],[28, 71]])

export const light_pink_alt2_ListItem = n334
const n335 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[18, 70],[19, 69],[20, 70],[21, 69],[22, 70],[23, 65],[24, 67],[25, 65],[26, 65],[27, 65],[28, 11]])

export const light_pink_alt2_Card = n335
export const light_pink_alt2_DrawerFrame = n335
export const light_pink_alt2_Progress = n335
export const light_pink_alt2_TooltipArrow = n335
const n336 = t([[12, 65],[13, 67],[14, 68],[15, 69],[16, 64],[17, 63],[18, 70],[19, 69],[20, 70],[21, 69],[22, 69],[23, 65],[24, 67],[25, 65],[26, 65],[27, 64],[28, 11]])

export const light_pink_alt2_Button = n336
export const light_pink_alt2_Switch = n336
export const light_pink_alt2_TooltipContent = n336
export const light_pink_alt2_SliderTrack = n336
const n337 = t([[12, 63],[13, 64],[14, 65],[15, 67],[16, 62],[17, 61],[18, 70],[19, 69],[20, 70],[21, 69],[22, 71],[23, 67],[24, 68],[25, 67],[26, 67],[27, 67],[28, 71]])

export const light_pink_alt2_Checkbox = n337
export const light_pink_alt2_RadioGroupItem = n337
export const light_pink_alt2_Input = n337
export const light_pink_alt2_TextArea = n337
const n338 = t([[12, 71],[13, 70],[14, 69],[15, 68],[16, 11],[17, 11],[18, 62],[19, 63],[20, 62],[21, 63],[22, 60],[23, 70],[24, 69],[25, 70],[26, 70],[27, 63],[28, 63]])

export const light_pink_alt2_SwitchThumb = n338
const n339 = t([[12, 67],[13, 65],[14, 64],[15, 63],[16, 68],[17, 69],[18, 62],[19, 63],[20, 62],[21, 63],[22, 63],[23, 65],[24, 64],[25, 65],[26, 65],[27, 68],[28, 60]])

export const light_pink_alt2_SliderTrackActive = n339
const n340 = t([[12, 69],[13, 68],[14, 67],[15, 65],[16, 70],[17, 71],[18, 62],[19, 63],[20, 62],[21, 63],[22, 61],[23, 68],[24, 67],[25, 68],[26, 68],[27, 65],[28, 61]])

export const light_pink_alt2_SliderThumb = n340
export const light_pink_alt2_Tooltip = n340
export const light_pink_alt2_ProgressIndicator = n340
const n341 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[19, 68],[20, 69],[21, 68],[22, 70],[23, 65],[24, 67],[25, 65],[26, 65],[27, 65],[28, 11]])

export const light_pink_active_ListItem = n341
const n342 = t([[12, 67],[13, 68],[14, 69],[15, 70],[16, 65],[17, 64],[19, 68],[20, 69],[21, 68],[22, 68],[23, 67],[24, 68],[25, 67],[26, 67],[27, 63],[28, 11]])

export const light_pink_active_Button = n342
export const light_pink_active_Switch = n342
const n343 = t([[12, 64],[13, 65],[14, 67],[15, 68],[16, 63],[17, 62],[19, 68],[20, 69],[21, 68],[22, 70],[23, 68],[24, 69],[25, 68],[26, 68],[27, 65],[28, 11]])

export const light_pink_active_Checkbox = n343
export const light_pink_active_Input = n343
export const light_pink_active_TextArea = n343
const n344 = t([[12, 65],[13, 64],[14, 63],[15, 62],[16, 67],[17, 68],[19, 64],[20, 63],[21, 64],[22, 64],[23, 64],[24, 63],[25, 64],[26, 64],[27, 69],[28, 60]])

export const light_pink_active_SliderTrackActive = n344
const n345 = t([[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 95],[19, 94],[20, 95],[21, 94],[22, 11],[23, 88],[24, 89],[25, 88],[26, 88],[27, 92],[28, 94]])

export const light_red_alt1_ListItem = n345
const n346 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 95],[19, 94],[20, 95],[21, 94],[22, 95],[23, 89],[24, 91],[25, 89],[26, 89],[27, 91],[28, 95]])

export const light_red_alt1_Card = n346
export const light_red_alt1_DrawerFrame = n346
export const light_red_alt1_Progress = n346
export const light_red_alt1_TooltipArrow = n346
const n347 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[18, 95],[19, 94],[20, 95],[21, 94],[22, 94],[23, 89],[24, 91],[25, 89],[26, 89],[27, 89],[28, 11]])

export const light_red_alt1_Button = n347
export const light_red_alt1_Switch = n347
export const light_red_alt1_TooltipContent = n347
export const light_red_alt1_SliderTrack = n347
const n348 = t([[12, 86],[13, 87],[14, 88],[15, 89],[16, 85],[17, 84],[18, 95],[19, 94],[20, 95],[21, 94],[22, 11],[23, 91],[24, 92],[25, 91],[26, 91],[27, 92],[28, 94]])

export const light_red_alt1_Checkbox = n348
export const light_red_alt1_RadioGroupItem = n348
export const light_red_alt1_Input = n348
export const light_red_alt1_TextArea = n348
const n349 = t([[12, 11],[13, 95],[14, 94],[15, 93],[16, 11],[17, 11],[18, 85],[19, 86],[20, 85],[21, 86],[22, 84],[23, 94],[24, 93],[25, 94],[26, 94],[27, 86],[28, 88]])

export const light_red_alt1_SwitchThumb = n349
const n350 = t([[12, 92],[13, 91],[14, 89],[15, 88],[16, 93],[17, 94],[18, 85],[19, 86],[20, 85],[21, 86],[22, 86],[23, 89],[24, 88],[25, 89],[26, 89],[27, 91],[28, 84]])

export const light_red_alt1_SliderTrackActive = n350
const n351 = t([[12, 94],[13, 93],[14, 92],[15, 91],[16, 95],[17, 11],[18, 85],[19, 86],[20, 85],[21, 86],[22, 84],[23, 92],[24, 91],[25, 92],[26, 92],[27, 88],[28, 86]])

export const light_red_alt1_SliderThumb = n351
export const light_red_alt1_Tooltip = n351
export const light_red_alt1_ProgressIndicator = n351
const n352 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 94],[19, 93],[20, 94],[21, 93],[22, 95],[23, 88],[24, 89],[25, 88],[26, 88],[27, 91],[28, 95]])

export const light_red_alt2_ListItem = n352
const n353 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[18, 94],[19, 93],[20, 94],[21, 93],[22, 94],[23, 89],[24, 91],[25, 89],[26, 89],[27, 89],[28, 11]])

export const light_red_alt2_Card = n353
export const light_red_alt2_DrawerFrame = n353
export const light_red_alt2_Progress = n353
export const light_red_alt2_TooltipArrow = n353
const n354 = t([[12, 89],[13, 91],[14, 92],[15, 93],[16, 88],[17, 87],[18, 94],[19, 93],[20, 94],[21, 93],[22, 93],[23, 89],[24, 91],[25, 89],[26, 89],[27, 88],[28, 11]])

export const light_red_alt2_Button = n354
export const light_red_alt2_Switch = n354
export const light_red_alt2_TooltipContent = n354
export const light_red_alt2_SliderTrack = n354
const n355 = t([[12, 87],[13, 88],[14, 89],[15, 91],[16, 86],[17, 85],[18, 94],[19, 93],[20, 94],[21, 93],[22, 95],[23, 91],[24, 92],[25, 91],[26, 91],[27, 91],[28, 95]])

export const light_red_alt2_Checkbox = n355
export const light_red_alt2_RadioGroupItem = n355
export const light_red_alt2_Input = n355
export const light_red_alt2_TextArea = n355
const n356 = t([[12, 95],[13, 94],[14, 93],[15, 92],[16, 11],[17, 11],[18, 86],[19, 87],[20, 86],[21, 87],[22, 84],[23, 94],[24, 93],[25, 94],[26, 94],[27, 87],[28, 87]])

export const light_red_alt2_SwitchThumb = n356
const n357 = t([[12, 91],[13, 89],[14, 88],[15, 87],[16, 92],[17, 93],[18, 86],[19, 87],[20, 86],[21, 87],[22, 87],[23, 89],[24, 88],[25, 89],[26, 89],[27, 92],[28, 84]])

export const light_red_alt2_SliderTrackActive = n357
const n358 = t([[12, 93],[13, 92],[14, 91],[15, 89],[16, 94],[17, 95],[18, 86],[19, 87],[20, 86],[21, 87],[22, 85],[23, 92],[24, 91],[25, 92],[26, 92],[27, 89],[28, 85]])

export const light_red_alt2_SliderThumb = n358
export const light_red_alt2_Tooltip = n358
export const light_red_alt2_ProgressIndicator = n358
const n359 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[19, 92],[20, 93],[21, 92],[22, 94],[23, 89],[24, 91],[25, 89],[26, 89],[27, 89],[28, 11]])

export const light_red_active_ListItem = n359
const n360 = t([[12, 91],[13, 92],[14, 93],[15, 94],[16, 89],[17, 88],[19, 92],[20, 93],[21, 92],[22, 92],[23, 91],[24, 92],[25, 91],[26, 91],[27, 87],[28, 11]])

export const light_red_active_Button = n360
export const light_red_active_Switch = n360
const n361 = t([[12, 88],[13, 89],[14, 91],[15, 92],[16, 87],[17, 86],[19, 92],[20, 93],[21, 92],[22, 94],[23, 92],[24, 93],[25, 92],[26, 92],[27, 89],[28, 11]])

export const light_red_active_Checkbox = n361
export const light_red_active_Input = n361
export const light_red_active_TextArea = n361
const n362 = t([[12, 89],[13, 88],[14, 87],[15, 86],[16, 91],[17, 92],[19, 88],[20, 87],[21, 88],[22, 88],[23, 88],[24, 87],[25, 88],[26, 88],[27, 93],[28, 84]])

export const light_red_active_SliderTrackActive = n362
const n363 = t([[12, 28],[13, 29],[14, 30],[15, 31],[16, 27],[17, 26],[18, 11],[19, 35],[20, 11],[21, 35],[22, 11],[23, 30],[24, 31],[25, 30],[26, 30],[27, 8],[28, 35]])

export const light_gray_alt1_ListItem = n363
const n364 = t([[12, 29],[13, 30],[14, 31],[15, 33],[16, 28],[17, 27],[18, 11],[19, 35],[20, 11],[21, 35],[22, 11],[23, 31],[24, 33],[25, 31],[26, 31],[27, 33],[28, 11]])

export const light_gray_alt1_Card = n364
export const light_gray_alt1_DrawerFrame = n364
export const light_gray_alt1_Progress = n364
export const light_gray_alt1_TooltipArrow = n364
const n365 = t([[12, 30],[13, 31],[14, 33],[15, 8],[16, 29],[17, 28],[18, 11],[19, 35],[20, 11],[21, 35],[22, 35],[23, 31],[24, 33],[25, 31],[26, 31],[27, 31],[28, 11]])

export const light_gray_alt1_Button = n365
export const light_gray_alt1_Switch = n365
export const light_gray_alt1_TooltipContent = n365
export const light_gray_alt1_SliderTrack = n365
const n366 = t([[12, 28],[13, 29],[14, 30],[15, 31],[16, 27],[17, 26],[18, 11],[19, 35],[20, 11],[21, 35],[22, 11],[23, 33],[24, 8],[25, 33],[26, 33],[27, 8],[28, 35]])

export const light_gray_alt1_Checkbox = n366
export const light_gray_alt1_RadioGroupItem = n366
export const light_gray_alt1_Input = n366
export const light_gray_alt1_TextArea = n366
const n367 = t([[12, 11],[13, 11],[14, 35],[15, 34],[16, 11],[17, 11],[18, 27],[19, 28],[20, 27],[21, 28],[22, 26],[23, 35],[24, 34],[25, 35],[26, 35],[27, 28],[28, 30]])

export const light_gray_alt1_SwitchThumb = n367
const n368 = t([[12, 8],[13, 33],[14, 31],[15, 30],[16, 34],[17, 35],[18, 27],[19, 28],[20, 27],[21, 28],[22, 28],[23, 31],[24, 30],[25, 31],[26, 31],[27, 33],[28, 26]])

export const light_gray_alt1_SliderTrackActive = n368
const n369 = t([[12, 35],[13, 34],[14, 8],[15, 33],[16, 11],[17, 11],[18, 27],[19, 28],[20, 27],[21, 28],[22, 26],[23, 8],[24, 33],[25, 8],[26, 8],[27, 30],[28, 28]])

export const light_gray_alt1_SliderThumb = n369
export const light_gray_alt1_Tooltip = n369
export const light_gray_alt1_ProgressIndicator = n369
const n370 = t([[12, 29],[13, 30],[14, 31],[15, 33],[16, 28],[17, 27],[18, 35],[19, 34],[20, 35],[21, 34],[22, 11],[23, 30],[24, 31],[25, 30],[26, 30],[27, 33],[28, 11]])

export const light_gray_alt2_ListItem = n370
const n371 = t([[12, 30],[13, 31],[14, 33],[15, 8],[16, 29],[17, 28],[18, 35],[19, 34],[20, 35],[21, 34],[22, 35],[23, 31],[24, 33],[25, 31],[26, 31],[27, 31],[28, 11]])

export const light_gray_alt2_Card = n371
export const light_gray_alt2_DrawerFrame = n371
export const light_gray_alt2_Progress = n371
export const light_gray_alt2_TooltipArrow = n371
const n372 = t([[12, 31],[13, 33],[14, 8],[15, 34],[16, 30],[17, 29],[18, 35],[19, 34],[20, 35],[21, 34],[22, 34],[23, 31],[24, 33],[25, 31],[26, 31],[27, 30],[28, 11]])

export const light_gray_alt2_Button = n372
export const light_gray_alt2_Switch = n372
export const light_gray_alt2_TooltipContent = n372
export const light_gray_alt2_SliderTrack = n372
const n373 = t([[12, 29],[13, 30],[14, 31],[15, 33],[16, 28],[17, 27],[18, 35],[19, 34],[20, 35],[21, 34],[22, 11],[23, 33],[24, 8],[25, 33],[26, 33],[27, 33],[28, 11]])

export const light_gray_alt2_Checkbox = n373
export const light_gray_alt2_RadioGroupItem = n373
export const light_gray_alt2_Input = n373
export const light_gray_alt2_TextArea = n373
const n374 = t([[12, 11],[13, 35],[14, 34],[15, 8],[16, 11],[17, 11],[18, 28],[19, 29],[20, 28],[21, 29],[22, 26],[23, 35],[24, 34],[25, 35],[26, 35],[27, 29],[28, 29]])

export const light_gray_alt2_SwitchThumb = n374
const n375 = t([[12, 33],[13, 31],[14, 30],[15, 29],[16, 8],[17, 34],[18, 28],[19, 29],[20, 28],[21, 29],[22, 29],[23, 31],[24, 30],[25, 31],[26, 31],[27, 8],[28, 26]])

export const light_gray_alt2_SliderTrackActive = n375
const n376 = t([[12, 34],[13, 8],[14, 33],[15, 31],[16, 35],[17, 11],[18, 28],[19, 29],[20, 28],[21, 29],[22, 27],[23, 8],[24, 33],[25, 8],[26, 8],[27, 31],[28, 27]])

export const light_gray_alt2_SliderThumb = n376
export const light_gray_alt2_Tooltip = n376
export const light_gray_alt2_ProgressIndicator = n376
const n377 = t([[12, 30],[13, 31],[14, 33],[15, 8],[16, 29],[17, 28],[19, 8],[20, 34],[21, 8],[22, 35],[23, 31],[24, 33],[25, 31],[26, 31],[27, 31],[28, 11]])

export const light_gray_active_ListItem = n377
const n378 = t([[12, 33],[13, 8],[14, 34],[15, 35],[16, 31],[17, 30],[19, 8],[20, 34],[21, 8],[22, 8],[23, 33],[24, 8],[25, 33],[26, 33],[27, 29],[28, 11]])

export const light_gray_active_Button = n378
export const light_gray_active_Switch = n378
const n379 = t([[12, 30],[13, 31],[14, 33],[15, 8],[16, 29],[17, 28],[19, 8],[20, 34],[21, 8],[22, 35],[23, 8],[24, 34],[25, 8],[26, 8],[27, 31],[28, 11]])

export const light_gray_active_Checkbox = n379
export const light_gray_active_Input = n379
export const light_gray_active_TextArea = n379
const n380 = t([[12, 31],[13, 30],[14, 29],[15, 28],[16, 33],[17, 8],[19, 30],[20, 29],[21, 30],[22, 30],[23, 30],[24, 29],[25, 30],[26, 30],[27, 34],[28, 26]])

export const light_gray_active_SliderTrackActive = n380
const n381 = t([[12, 156],[13, 157],[14, 158],[15, 159],[16, 155],[17, 154],[18, 164],[19, 163],[20, 164],[21, 163],[22, 0],[23, 159],[24, 161],[25, 158],[26, 159],[27, 56],[28, 163]])

export const dark_orange_alt1_ListItem = n381
const n382 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 164],[19, 163],[20, 164],[21, 163],[22, 164],[23, 161],[24, 56],[25, 159],[26, 161],[27, 161],[28, 164]])

export const dark_orange_alt1_Card = n382
export const dark_orange_alt1_DrawerFrame = n382
export const dark_orange_alt1_Progress = n382
export const dark_orange_alt1_TooltipArrow = n382
const n383 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[18, 164],[19, 163],[20, 164],[21, 163],[22, 163],[23, 161],[24, 56],[25, 159],[26, 161],[27, 159],[28, 0]])

export const dark_orange_alt1_Button = n383
export const dark_orange_alt1_Switch = n383
export const dark_orange_alt1_TooltipContent = n383
export const dark_orange_alt1_SliderTrack = n383
const n384 = t([[12, 156],[13, 157],[14, 158],[15, 159],[16, 155],[17, 154],[18, 164],[19, 163],[20, 164],[21, 163],[22, 0],[23, 56],[24, 162],[25, 161],[26, 56],[27, 56],[28, 163]])

export const dark_orange_alt1_Checkbox = n384
export const dark_orange_alt1_RadioGroupItem = n384
export const dark_orange_alt1_Input = n384
export const dark_orange_alt1_TextArea = n384
const n385 = t([[12, 0],[13, 164],[14, 163],[15, 162],[16, 0],[17, 0],[18, 155],[19, 156],[20, 155],[21, 156],[22, 154],[23, 162],[24, 56],[25, 163],[26, 162],[27, 156],[28, 158]])

export const dark_orange_alt1_SwitchThumb = n385
const n386 = t([[12, 56],[13, 161],[14, 159],[15, 158],[16, 162],[17, 163],[18, 155],[19, 156],[20, 155],[21, 156],[22, 156],[23, 158],[24, 157],[25, 159],[26, 158],[27, 161],[28, 154]])

export const dark_orange_alt1_SliderTrackActive = n386
const n387 = t([[12, 163],[13, 162],[14, 56],[15, 161],[16, 164],[17, 0],[18, 155],[19, 156],[20, 155],[21, 156],[22, 154],[23, 161],[24, 159],[25, 56],[26, 161],[27, 158],[28, 156]])

export const dark_orange_alt1_SliderThumb = n387
export const dark_orange_alt1_Tooltip = n387
export const dark_orange_alt1_ProgressIndicator = n387
const n388 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 163],[19, 162],[20, 163],[21, 162],[22, 164],[23, 159],[24, 161],[25, 158],[26, 159],[27, 161],[28, 164]])

export const dark_orange_alt2_ListItem = n388
const n389 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[18, 163],[19, 162],[20, 163],[21, 162],[22, 163],[23, 161],[24, 56],[25, 159],[26, 161],[27, 159],[28, 0]])

export const dark_orange_alt2_Card = n389
export const dark_orange_alt2_DrawerFrame = n389
export const dark_orange_alt2_Progress = n389
export const dark_orange_alt2_TooltipArrow = n389
const n390 = t([[12, 159],[13, 161],[14, 56],[15, 162],[16, 158],[17, 157],[18, 163],[19, 162],[20, 163],[21, 162],[22, 162],[23, 161],[24, 56],[25, 159],[26, 161],[27, 158],[28, 0]])

export const dark_orange_alt2_Button = n390
export const dark_orange_alt2_Switch = n390
export const dark_orange_alt2_TooltipContent = n390
export const dark_orange_alt2_SliderTrack = n390
const n391 = t([[12, 157],[13, 158],[14, 159],[15, 161],[16, 156],[17, 155],[18, 163],[19, 162],[20, 163],[21, 162],[22, 164],[23, 56],[24, 162],[25, 161],[26, 56],[27, 161],[28, 164]])

export const dark_orange_alt2_Checkbox = n391
export const dark_orange_alt2_RadioGroupItem = n391
export const dark_orange_alt2_Input = n391
export const dark_orange_alt2_TextArea = n391
const n392 = t([[12, 164],[13, 163],[14, 162],[15, 56],[16, 0],[17, 0],[18, 156],[19, 157],[20, 156],[21, 157],[22, 154],[23, 162],[24, 56],[25, 163],[26, 162],[27, 157],[28, 157]])

export const dark_orange_alt2_SwitchThumb = n392
const n393 = t([[12, 161],[13, 159],[14, 158],[15, 157],[16, 56],[17, 162],[18, 156],[19, 157],[20, 156],[21, 157],[22, 157],[23, 158],[24, 157],[25, 159],[26, 158],[27, 56],[28, 154]])

export const dark_orange_alt2_SliderTrackActive = n393
const n394 = t([[12, 162],[13, 56],[14, 161],[15, 159],[16, 163],[17, 164],[18, 156],[19, 157],[20, 156],[21, 157],[22, 155],[23, 161],[24, 159],[25, 56],[26, 161],[27, 159],[28, 155]])

export const dark_orange_alt2_SliderThumb = n394
export const dark_orange_alt2_Tooltip = n394
export const dark_orange_alt2_ProgressIndicator = n394
const n395 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[19, 56],[20, 162],[21, 56],[22, 163],[23, 161],[24, 56],[25, 159],[26, 161],[27, 159],[28, 0]])

export const dark_orange_active_ListItem = n395
const n396 = t([[12, 161],[13, 56],[14, 162],[15, 163],[16, 159],[17, 158],[19, 56],[20, 162],[21, 56],[22, 56],[23, 56],[24, 162],[25, 161],[26, 56],[27, 157],[28, 0]])

export const dark_orange_active_Button = n396
export const dark_orange_active_Switch = n396
const n397 = t([[12, 158],[13, 159],[14, 161],[15, 56],[16, 157],[17, 156],[19, 56],[20, 162],[21, 56],[22, 163],[23, 162],[24, 163],[25, 56],[26, 162],[27, 159],[28, 0]])

export const dark_orange_active_Checkbox = n397
export const dark_orange_active_Input = n397
export const dark_orange_active_TextArea = n397
const n398 = t([[12, 159],[13, 158],[14, 157],[15, 156],[16, 161],[17, 56],[19, 158],[20, 157],[21, 158],[22, 158],[23, 157],[24, 156],[25, 158],[26, 157],[27, 162],[28, 154]])

export const dark_orange_active_SliderTrackActive = n398
const n399 = t([[12, 200],[13, 201],[14, 202],[15, 203],[16, 199],[17, 198],[18, 208],[19, 207],[20, 208],[21, 207],[22, 0],[23, 203],[24, 205],[25, 202],[26, 203],[27, 104],[28, 207]])

export const dark_yellow_alt1_ListItem = n399
const n400 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 208],[19, 207],[20, 208],[21, 207],[22, 208],[23, 205],[24, 104],[25, 203],[26, 205],[27, 205],[28, 208]])

export const dark_yellow_alt1_Card = n400
export const dark_yellow_alt1_DrawerFrame = n400
export const dark_yellow_alt1_Progress = n400
export const dark_yellow_alt1_TooltipArrow = n400
const n401 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[18, 208],[19, 207],[20, 208],[21, 207],[22, 207],[23, 205],[24, 104],[25, 203],[26, 205],[27, 203],[28, 0]])

export const dark_yellow_alt1_Button = n401
export const dark_yellow_alt1_Switch = n401
export const dark_yellow_alt1_TooltipContent = n401
export const dark_yellow_alt1_SliderTrack = n401
const n402 = t([[12, 200],[13, 201],[14, 202],[15, 203],[16, 199],[17, 198],[18, 208],[19, 207],[20, 208],[21, 207],[22, 0],[23, 104],[24, 206],[25, 205],[26, 104],[27, 104],[28, 207]])

export const dark_yellow_alt1_Checkbox = n402
export const dark_yellow_alt1_RadioGroupItem = n402
export const dark_yellow_alt1_Input = n402
export const dark_yellow_alt1_TextArea = n402
const n403 = t([[12, 0],[13, 208],[14, 207],[15, 206],[16, 0],[17, 0],[18, 199],[19, 200],[20, 199],[21, 200],[22, 198],[23, 206],[24, 104],[25, 207],[26, 206],[27, 200],[28, 202]])

export const dark_yellow_alt1_SwitchThumb = n403
const n404 = t([[12, 104],[13, 205],[14, 203],[15, 202],[16, 206],[17, 207],[18, 199],[19, 200],[20, 199],[21, 200],[22, 200],[23, 202],[24, 201],[25, 203],[26, 202],[27, 205],[28, 198]])

export const dark_yellow_alt1_SliderTrackActive = n404
const n405 = t([[12, 207],[13, 206],[14, 104],[15, 205],[16, 208],[17, 0],[18, 199],[19, 200],[20, 199],[21, 200],[22, 198],[23, 205],[24, 203],[25, 104],[26, 205],[27, 202],[28, 200]])

export const dark_yellow_alt1_SliderThumb = n405
export const dark_yellow_alt1_Tooltip = n405
export const dark_yellow_alt1_ProgressIndicator = n405
const n406 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 207],[19, 206],[20, 207],[21, 206],[22, 208],[23, 203],[24, 205],[25, 202],[26, 203],[27, 205],[28, 208]])

export const dark_yellow_alt2_ListItem = n406
const n407 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[18, 207],[19, 206],[20, 207],[21, 206],[22, 207],[23, 205],[24, 104],[25, 203],[26, 205],[27, 203],[28, 0]])

export const dark_yellow_alt2_Card = n407
export const dark_yellow_alt2_DrawerFrame = n407
export const dark_yellow_alt2_Progress = n407
export const dark_yellow_alt2_TooltipArrow = n407
const n408 = t([[12, 203],[13, 205],[14, 104],[15, 206],[16, 202],[17, 201],[18, 207],[19, 206],[20, 207],[21, 206],[22, 206],[23, 205],[24, 104],[25, 203],[26, 205],[27, 202],[28, 0]])

export const dark_yellow_alt2_Button = n408
export const dark_yellow_alt2_Switch = n408
export const dark_yellow_alt2_TooltipContent = n408
export const dark_yellow_alt2_SliderTrack = n408
const n409 = t([[12, 201],[13, 202],[14, 203],[15, 205],[16, 200],[17, 199],[18, 207],[19, 206],[20, 207],[21, 206],[22, 208],[23, 104],[24, 206],[25, 205],[26, 104],[27, 205],[28, 208]])

export const dark_yellow_alt2_Checkbox = n409
export const dark_yellow_alt2_RadioGroupItem = n409
export const dark_yellow_alt2_Input = n409
export const dark_yellow_alt2_TextArea = n409
const n410 = t([[12, 208],[13, 207],[14, 206],[15, 104],[16, 0],[17, 0],[18, 200],[19, 201],[20, 200],[21, 201],[22, 198],[23, 206],[24, 104],[25, 207],[26, 206],[27, 201],[28, 201]])

export const dark_yellow_alt2_SwitchThumb = n410
const n411 = t([[12, 205],[13, 203],[14, 202],[15, 201],[16, 104],[17, 206],[18, 200],[19, 201],[20, 200],[21, 201],[22, 201],[23, 202],[24, 201],[25, 203],[26, 202],[27, 104],[28, 198]])

export const dark_yellow_alt2_SliderTrackActive = n411
const n412 = t([[12, 206],[13, 104],[14, 205],[15, 203],[16, 207],[17, 208],[18, 200],[19, 201],[20, 200],[21, 201],[22, 199],[23, 205],[24, 203],[25, 104],[26, 205],[27, 203],[28, 199]])

export const dark_yellow_alt2_SliderThumb = n412
export const dark_yellow_alt2_Tooltip = n412
export const dark_yellow_alt2_ProgressIndicator = n412
const n413 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[19, 104],[20, 206],[21, 104],[22, 207],[23, 205],[24, 104],[25, 203],[26, 205],[27, 203],[28, 0]])

export const dark_yellow_active_ListItem = n413
const n414 = t([[12, 205],[13, 104],[14, 206],[15, 207],[16, 203],[17, 202],[19, 104],[20, 206],[21, 104],[22, 104],[23, 104],[24, 206],[25, 205],[26, 104],[27, 201],[28, 0]])

export const dark_yellow_active_Button = n414
export const dark_yellow_active_Switch = n414
const n415 = t([[12, 202],[13, 203],[14, 205],[15, 104],[16, 201],[17, 200],[19, 104],[20, 206],[21, 104],[22, 207],[23, 206],[24, 207],[25, 104],[26, 206],[27, 203],[28, 0]])

export const dark_yellow_active_Checkbox = n415
export const dark_yellow_active_Input = n415
export const dark_yellow_active_TextArea = n415
const n416 = t([[12, 203],[13, 202],[14, 201],[15, 200],[16, 205],[17, 104],[19, 202],[20, 201],[21, 202],[22, 202],[23, 201],[24, 200],[25, 202],[26, 201],[27, 206],[28, 198]])

export const dark_yellow_active_SliderTrackActive = n416
const n417 = t([[12, 145],[13, 146],[14, 147],[15, 148],[16, 144],[17, 143],[18, 153],[19, 152],[20, 153],[21, 152],[22, 0],[23, 148],[24, 150],[25, 147],[26, 148],[27, 44],[28, 152]])

export const dark_green_alt1_ListItem = n417
const n418 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 153],[19, 152],[20, 153],[21, 152],[22, 153],[23, 150],[24, 44],[25, 148],[26, 150],[27, 150],[28, 153]])

export const dark_green_alt1_Card = n418
export const dark_green_alt1_DrawerFrame = n418
export const dark_green_alt1_Progress = n418
export const dark_green_alt1_TooltipArrow = n418
const n419 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[18, 153],[19, 152],[20, 153],[21, 152],[22, 152],[23, 150],[24, 44],[25, 148],[26, 150],[27, 148],[28, 0]])

export const dark_green_alt1_Button = n419
export const dark_green_alt1_Switch = n419
export const dark_green_alt1_TooltipContent = n419
export const dark_green_alt1_SliderTrack = n419
const n420 = t([[12, 145],[13, 146],[14, 147],[15, 148],[16, 144],[17, 143],[18, 153],[19, 152],[20, 153],[21, 152],[22, 0],[23, 44],[24, 151],[25, 150],[26, 44],[27, 44],[28, 152]])

export const dark_green_alt1_Checkbox = n420
export const dark_green_alt1_RadioGroupItem = n420
export const dark_green_alt1_Input = n420
export const dark_green_alt1_TextArea = n420
const n421 = t([[12, 0],[13, 153],[14, 152],[15, 151],[16, 0],[17, 0],[18, 144],[19, 145],[20, 144],[21, 145],[22, 143],[23, 151],[24, 44],[25, 152],[26, 151],[27, 145],[28, 147]])

export const dark_green_alt1_SwitchThumb = n421
const n422 = t([[12, 44],[13, 150],[14, 148],[15, 147],[16, 151],[17, 152],[18, 144],[19, 145],[20, 144],[21, 145],[22, 145],[23, 147],[24, 146],[25, 148],[26, 147],[27, 150],[28, 143]])

export const dark_green_alt1_SliderTrackActive = n422
const n423 = t([[12, 152],[13, 151],[14, 44],[15, 150],[16, 153],[17, 0],[18, 144],[19, 145],[20, 144],[21, 145],[22, 143],[23, 150],[24, 148],[25, 44],[26, 150],[27, 147],[28, 145]])

export const dark_green_alt1_SliderThumb = n423
export const dark_green_alt1_Tooltip = n423
export const dark_green_alt1_ProgressIndicator = n423
const n424 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 152],[19, 151],[20, 152],[21, 151],[22, 153],[23, 148],[24, 150],[25, 147],[26, 148],[27, 150],[28, 153]])

export const dark_green_alt2_ListItem = n424
const n425 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[18, 152],[19, 151],[20, 152],[21, 151],[22, 152],[23, 150],[24, 44],[25, 148],[26, 150],[27, 148],[28, 0]])

export const dark_green_alt2_Card = n425
export const dark_green_alt2_DrawerFrame = n425
export const dark_green_alt2_Progress = n425
export const dark_green_alt2_TooltipArrow = n425
const n426 = t([[12, 148],[13, 150],[14, 44],[15, 151],[16, 147],[17, 146],[18, 152],[19, 151],[20, 152],[21, 151],[22, 151],[23, 150],[24, 44],[25, 148],[26, 150],[27, 147],[28, 0]])

export const dark_green_alt2_Button = n426
export const dark_green_alt2_Switch = n426
export const dark_green_alt2_TooltipContent = n426
export const dark_green_alt2_SliderTrack = n426
const n427 = t([[12, 146],[13, 147],[14, 148],[15, 150],[16, 145],[17, 144],[18, 152],[19, 151],[20, 152],[21, 151],[22, 153],[23, 44],[24, 151],[25, 150],[26, 44],[27, 150],[28, 153]])

export const dark_green_alt2_Checkbox = n427
export const dark_green_alt2_RadioGroupItem = n427
export const dark_green_alt2_Input = n427
export const dark_green_alt2_TextArea = n427
const n428 = t([[12, 153],[13, 152],[14, 151],[15, 44],[16, 0],[17, 0],[18, 145],[19, 146],[20, 145],[21, 146],[22, 143],[23, 151],[24, 44],[25, 152],[26, 151],[27, 146],[28, 146]])

export const dark_green_alt2_SwitchThumb = n428
const n429 = t([[12, 150],[13, 148],[14, 147],[15, 146],[16, 44],[17, 151],[18, 145],[19, 146],[20, 145],[21, 146],[22, 146],[23, 147],[24, 146],[25, 148],[26, 147],[27, 44],[28, 143]])

export const dark_green_alt2_SliderTrackActive = n429
const n430 = t([[12, 151],[13, 44],[14, 150],[15, 148],[16, 152],[17, 153],[18, 145],[19, 146],[20, 145],[21, 146],[22, 144],[23, 150],[24, 148],[25, 44],[26, 150],[27, 148],[28, 144]])

export const dark_green_alt2_SliderThumb = n430
export const dark_green_alt2_Tooltip = n430
export const dark_green_alt2_ProgressIndicator = n430
const n431 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[19, 44],[20, 151],[21, 44],[22, 152],[23, 150],[24, 44],[25, 148],[26, 150],[27, 148],[28, 0]])

export const dark_green_active_ListItem = n431
const n432 = t([[12, 150],[13, 44],[14, 151],[15, 152],[16, 148],[17, 147],[19, 44],[20, 151],[21, 44],[22, 44],[23, 44],[24, 151],[25, 150],[26, 44],[27, 146],[28, 0]])

export const dark_green_active_Button = n432
export const dark_green_active_Switch = n432
const n433 = t([[12, 147],[13, 148],[14, 150],[15, 44],[16, 146],[17, 145],[19, 44],[20, 151],[21, 44],[22, 152],[23, 151],[24, 152],[25, 44],[26, 151],[27, 148],[28, 0]])

export const dark_green_active_Checkbox = n433
export const dark_green_active_Input = n433
export const dark_green_active_TextArea = n433
const n434 = t([[12, 148],[13, 147],[14, 146],[15, 145],[16, 150],[17, 44],[19, 147],[20, 146],[21, 147],[22, 147],[23, 146],[24, 145],[25, 147],[26, 146],[27, 151],[28, 143]])

export const dark_green_active_SliderTrackActive = n434
const n435 = t([[12, 123],[13, 124],[14, 125],[15, 126],[16, 122],[17, 121],[18, 131],[19, 130],[20, 131],[21, 130],[22, 0],[23, 126],[24, 128],[25, 125],[26, 126],[27, 22],[28, 130]])

export const dark_blue_alt1_ListItem = n435
const n436 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 131],[19, 130],[20, 131],[21, 130],[22, 131],[23, 128],[24, 22],[25, 126],[26, 128],[27, 128],[28, 131]])

export const dark_blue_alt1_Card = n436
export const dark_blue_alt1_DrawerFrame = n436
export const dark_blue_alt1_Progress = n436
export const dark_blue_alt1_TooltipArrow = n436
const n437 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[18, 131],[19, 130],[20, 131],[21, 130],[22, 130],[23, 128],[24, 22],[25, 126],[26, 128],[27, 126],[28, 0]])

export const dark_blue_alt1_Button = n437
export const dark_blue_alt1_Switch = n437
export const dark_blue_alt1_TooltipContent = n437
export const dark_blue_alt1_SliderTrack = n437
const n438 = t([[12, 123],[13, 124],[14, 125],[15, 126],[16, 122],[17, 121],[18, 131],[19, 130],[20, 131],[21, 130],[22, 0],[23, 22],[24, 129],[25, 128],[26, 22],[27, 22],[28, 130]])

export const dark_blue_alt1_Checkbox = n438
export const dark_blue_alt1_RadioGroupItem = n438
export const dark_blue_alt1_Input = n438
export const dark_blue_alt1_TextArea = n438
const n439 = t([[12, 0],[13, 131],[14, 130],[15, 129],[16, 0],[17, 0],[18, 122],[19, 123],[20, 122],[21, 123],[22, 121],[23, 129],[24, 22],[25, 130],[26, 129],[27, 123],[28, 125]])

export const dark_blue_alt1_SwitchThumb = n439
const n440 = t([[12, 22],[13, 128],[14, 126],[15, 125],[16, 129],[17, 130],[18, 122],[19, 123],[20, 122],[21, 123],[22, 123],[23, 125],[24, 124],[25, 126],[26, 125],[27, 128],[28, 121]])

export const dark_blue_alt1_SliderTrackActive = n440
const n441 = t([[12, 130],[13, 129],[14, 22],[15, 128],[16, 131],[17, 0],[18, 122],[19, 123],[20, 122],[21, 123],[22, 121],[23, 128],[24, 126],[25, 22],[26, 128],[27, 125],[28, 123]])

export const dark_blue_alt1_SliderThumb = n441
export const dark_blue_alt1_Tooltip = n441
export const dark_blue_alt1_ProgressIndicator = n441
const n442 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 130],[19, 129],[20, 130],[21, 129],[22, 131],[23, 126],[24, 128],[25, 125],[26, 126],[27, 128],[28, 131]])

export const dark_blue_alt2_ListItem = n442
const n443 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[18, 130],[19, 129],[20, 130],[21, 129],[22, 130],[23, 128],[24, 22],[25, 126],[26, 128],[27, 126],[28, 0]])

export const dark_blue_alt2_Card = n443
export const dark_blue_alt2_DrawerFrame = n443
export const dark_blue_alt2_Progress = n443
export const dark_blue_alt2_TooltipArrow = n443
const n444 = t([[12, 126],[13, 128],[14, 22],[15, 129],[16, 125],[17, 124],[18, 130],[19, 129],[20, 130],[21, 129],[22, 129],[23, 128],[24, 22],[25, 126],[26, 128],[27, 125],[28, 0]])

export const dark_blue_alt2_Button = n444
export const dark_blue_alt2_Switch = n444
export const dark_blue_alt2_TooltipContent = n444
export const dark_blue_alt2_SliderTrack = n444
const n445 = t([[12, 124],[13, 125],[14, 126],[15, 128],[16, 123],[17, 122],[18, 130],[19, 129],[20, 130],[21, 129],[22, 131],[23, 22],[24, 129],[25, 128],[26, 22],[27, 128],[28, 131]])

export const dark_blue_alt2_Checkbox = n445
export const dark_blue_alt2_RadioGroupItem = n445
export const dark_blue_alt2_Input = n445
export const dark_blue_alt2_TextArea = n445
const n446 = t([[12, 131],[13, 130],[14, 129],[15, 22],[16, 0],[17, 0],[18, 123],[19, 124],[20, 123],[21, 124],[22, 121],[23, 129],[24, 22],[25, 130],[26, 129],[27, 124],[28, 124]])

export const dark_blue_alt2_SwitchThumb = n446
const n447 = t([[12, 128],[13, 126],[14, 125],[15, 124],[16, 22],[17, 129],[18, 123],[19, 124],[20, 123],[21, 124],[22, 124],[23, 125],[24, 124],[25, 126],[26, 125],[27, 22],[28, 121]])

export const dark_blue_alt2_SliderTrackActive = n447
const n448 = t([[12, 129],[13, 22],[14, 128],[15, 126],[16, 130],[17, 131],[18, 123],[19, 124],[20, 123],[21, 124],[22, 122],[23, 128],[24, 126],[25, 22],[26, 128],[27, 126],[28, 122]])

export const dark_blue_alt2_SliderThumb = n448
export const dark_blue_alt2_Tooltip = n448
export const dark_blue_alt2_ProgressIndicator = n448
const n449 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[19, 22],[20, 129],[21, 22],[22, 130],[23, 128],[24, 22],[25, 126],[26, 128],[27, 126],[28, 0]])

export const dark_blue_active_ListItem = n449
const n450 = t([[12, 128],[13, 22],[14, 129],[15, 130],[16, 126],[17, 125],[19, 22],[20, 129],[21, 22],[22, 22],[23, 22],[24, 129],[25, 128],[26, 22],[27, 124],[28, 0]])

export const dark_blue_active_Button = n450
export const dark_blue_active_Switch = n450
const n451 = t([[12, 125],[13, 126],[14, 128],[15, 22],[16, 124],[17, 123],[19, 22],[20, 129],[21, 22],[22, 130],[23, 129],[24, 130],[25, 22],[26, 129],[27, 126],[28, 0]])

export const dark_blue_active_Checkbox = n451
export const dark_blue_active_Input = n451
export const dark_blue_active_TextArea = n451
const n452 = t([[12, 126],[13, 125],[14, 124],[15, 123],[16, 128],[17, 22],[19, 125],[20, 124],[21, 125],[22, 125],[23, 124],[24, 123],[25, 125],[26, 124],[27, 129],[28, 121]])

export const dark_blue_active_SliderTrackActive = n452
const n453 = t([[12, 178],[13, 179],[14, 180],[15, 181],[16, 177],[17, 176],[18, 186],[19, 185],[20, 186],[21, 185],[22, 0],[23, 181],[24, 183],[25, 180],[26, 181],[27, 80],[28, 185]])

export const dark_purple_alt1_ListItem = n453
const n454 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 186],[19, 185],[20, 186],[21, 185],[22, 186],[23, 183],[24, 80],[25, 181],[26, 183],[27, 183],[28, 186]])

export const dark_purple_alt1_Card = n454
export const dark_purple_alt1_DrawerFrame = n454
export const dark_purple_alt1_Progress = n454
export const dark_purple_alt1_TooltipArrow = n454
const n455 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[18, 186],[19, 185],[20, 186],[21, 185],[22, 185],[23, 183],[24, 80],[25, 181],[26, 183],[27, 181],[28, 0]])

export const dark_purple_alt1_Button = n455
export const dark_purple_alt1_Switch = n455
export const dark_purple_alt1_TooltipContent = n455
export const dark_purple_alt1_SliderTrack = n455
const n456 = t([[12, 178],[13, 179],[14, 180],[15, 181],[16, 177],[17, 176],[18, 186],[19, 185],[20, 186],[21, 185],[22, 0],[23, 80],[24, 184],[25, 183],[26, 80],[27, 80],[28, 185]])

export const dark_purple_alt1_Checkbox = n456
export const dark_purple_alt1_RadioGroupItem = n456
export const dark_purple_alt1_Input = n456
export const dark_purple_alt1_TextArea = n456
const n457 = t([[12, 0],[13, 186],[14, 185],[15, 184],[16, 0],[17, 0],[18, 177],[19, 178],[20, 177],[21, 178],[22, 176],[23, 184],[24, 80],[25, 185],[26, 184],[27, 178],[28, 180]])

export const dark_purple_alt1_SwitchThumb = n457
const n458 = t([[12, 80],[13, 183],[14, 181],[15, 180],[16, 184],[17, 185],[18, 177],[19, 178],[20, 177],[21, 178],[22, 178],[23, 180],[24, 179],[25, 181],[26, 180],[27, 183],[28, 176]])

export const dark_purple_alt1_SliderTrackActive = n458
const n459 = t([[12, 185],[13, 184],[14, 80],[15, 183],[16, 186],[17, 0],[18, 177],[19, 178],[20, 177],[21, 178],[22, 176],[23, 183],[24, 181],[25, 80],[26, 183],[27, 180],[28, 178]])

export const dark_purple_alt1_SliderThumb = n459
export const dark_purple_alt1_Tooltip = n459
export const dark_purple_alt1_ProgressIndicator = n459
const n460 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 185],[19, 184],[20, 185],[21, 184],[22, 186],[23, 181],[24, 183],[25, 180],[26, 181],[27, 183],[28, 186]])

export const dark_purple_alt2_ListItem = n460
const n461 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[18, 185],[19, 184],[20, 185],[21, 184],[22, 185],[23, 183],[24, 80],[25, 181],[26, 183],[27, 181],[28, 0]])

export const dark_purple_alt2_Card = n461
export const dark_purple_alt2_DrawerFrame = n461
export const dark_purple_alt2_Progress = n461
export const dark_purple_alt2_TooltipArrow = n461
const n462 = t([[12, 181],[13, 183],[14, 80],[15, 184],[16, 180],[17, 179],[18, 185],[19, 184],[20, 185],[21, 184],[22, 184],[23, 183],[24, 80],[25, 181],[26, 183],[27, 180],[28, 0]])

export const dark_purple_alt2_Button = n462
export const dark_purple_alt2_Switch = n462
export const dark_purple_alt2_TooltipContent = n462
export const dark_purple_alt2_SliderTrack = n462
const n463 = t([[12, 179],[13, 180],[14, 181],[15, 183],[16, 178],[17, 177],[18, 185],[19, 184],[20, 185],[21, 184],[22, 186],[23, 80],[24, 184],[25, 183],[26, 80],[27, 183],[28, 186]])

export const dark_purple_alt2_Checkbox = n463
export const dark_purple_alt2_RadioGroupItem = n463
export const dark_purple_alt2_Input = n463
export const dark_purple_alt2_TextArea = n463
const n464 = t([[12, 186],[13, 185],[14, 184],[15, 80],[16, 0],[17, 0],[18, 178],[19, 179],[20, 178],[21, 179],[22, 176],[23, 184],[24, 80],[25, 185],[26, 184],[27, 179],[28, 179]])

export const dark_purple_alt2_SwitchThumb = n464
const n465 = t([[12, 183],[13, 181],[14, 180],[15, 179],[16, 80],[17, 184],[18, 178],[19, 179],[20, 178],[21, 179],[22, 179],[23, 180],[24, 179],[25, 181],[26, 180],[27, 80],[28, 176]])

export const dark_purple_alt2_SliderTrackActive = n465
const n466 = t([[12, 184],[13, 80],[14, 183],[15, 181],[16, 185],[17, 186],[18, 178],[19, 179],[20, 178],[21, 179],[22, 177],[23, 183],[24, 181],[25, 80],[26, 183],[27, 181],[28, 177]])

export const dark_purple_alt2_SliderThumb = n466
export const dark_purple_alt2_Tooltip = n466
export const dark_purple_alt2_ProgressIndicator = n466
const n467 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[19, 80],[20, 184],[21, 80],[22, 185],[23, 183],[24, 80],[25, 181],[26, 183],[27, 181],[28, 0]])

export const dark_purple_active_ListItem = n467
const n468 = t([[12, 183],[13, 80],[14, 184],[15, 185],[16, 181],[17, 180],[19, 80],[20, 184],[21, 80],[22, 80],[23, 80],[24, 184],[25, 183],[26, 80],[27, 179],[28, 0]])

export const dark_purple_active_Button = n468
export const dark_purple_active_Switch = n468
const n469 = t([[12, 180],[13, 181],[14, 183],[15, 80],[16, 179],[17, 178],[19, 80],[20, 184],[21, 80],[22, 185],[23, 184],[24, 185],[25, 80],[26, 184],[27, 181],[28, 0]])

export const dark_purple_active_Checkbox = n469
export const dark_purple_active_Input = n469
export const dark_purple_active_TextArea = n469
const n470 = t([[12, 181],[13, 180],[14, 179],[15, 178],[16, 183],[17, 80],[19, 180],[20, 179],[21, 180],[22, 180],[23, 179],[24, 178],[25, 180],[26, 179],[27, 184],[28, 176]])

export const dark_purple_active_SliderTrackActive = n470
const n471 = t([[12, 167],[13, 168],[14, 169],[15, 170],[16, 166],[17, 165],[18, 175],[19, 174],[20, 175],[21, 174],[22, 0],[23, 170],[24, 172],[25, 169],[26, 170],[27, 68],[28, 174]])

export const dark_pink_alt1_ListItem = n471
const n472 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 175],[19, 174],[20, 175],[21, 174],[22, 175],[23, 172],[24, 68],[25, 170],[26, 172],[27, 172],[28, 175]])

export const dark_pink_alt1_Card = n472
export const dark_pink_alt1_DrawerFrame = n472
export const dark_pink_alt1_Progress = n472
export const dark_pink_alt1_TooltipArrow = n472
const n473 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[18, 175],[19, 174],[20, 175],[21, 174],[22, 174],[23, 172],[24, 68],[25, 170],[26, 172],[27, 170],[28, 0]])

export const dark_pink_alt1_Button = n473
export const dark_pink_alt1_Switch = n473
export const dark_pink_alt1_TooltipContent = n473
export const dark_pink_alt1_SliderTrack = n473
const n474 = t([[12, 167],[13, 168],[14, 169],[15, 170],[16, 166],[17, 165],[18, 175],[19, 174],[20, 175],[21, 174],[22, 0],[23, 68],[24, 173],[25, 172],[26, 68],[27, 68],[28, 174]])

export const dark_pink_alt1_Checkbox = n474
export const dark_pink_alt1_RadioGroupItem = n474
export const dark_pink_alt1_Input = n474
export const dark_pink_alt1_TextArea = n474
const n475 = t([[12, 0],[13, 175],[14, 174],[15, 173],[16, 0],[17, 0],[18, 166],[19, 167],[20, 166],[21, 167],[22, 165],[23, 173],[24, 68],[25, 174],[26, 173],[27, 167],[28, 169]])

export const dark_pink_alt1_SwitchThumb = n475
const n476 = t([[12, 68],[13, 172],[14, 170],[15, 169],[16, 173],[17, 174],[18, 166],[19, 167],[20, 166],[21, 167],[22, 167],[23, 169],[24, 168],[25, 170],[26, 169],[27, 172],[28, 165]])

export const dark_pink_alt1_SliderTrackActive = n476
const n477 = t([[12, 174],[13, 173],[14, 68],[15, 172],[16, 175],[17, 0],[18, 166],[19, 167],[20, 166],[21, 167],[22, 165],[23, 172],[24, 170],[25, 68],[26, 172],[27, 169],[28, 167]])

export const dark_pink_alt1_SliderThumb = n477
export const dark_pink_alt1_Tooltip = n477
export const dark_pink_alt1_ProgressIndicator = n477
const n478 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 174],[19, 173],[20, 174],[21, 173],[22, 175],[23, 170],[24, 172],[25, 169],[26, 170],[27, 172],[28, 175]])

export const dark_pink_alt2_ListItem = n478
const n479 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[18, 174],[19, 173],[20, 174],[21, 173],[22, 174],[23, 172],[24, 68],[25, 170],[26, 172],[27, 170],[28, 0]])

export const dark_pink_alt2_Card = n479
export const dark_pink_alt2_DrawerFrame = n479
export const dark_pink_alt2_Progress = n479
export const dark_pink_alt2_TooltipArrow = n479
const n480 = t([[12, 170],[13, 172],[14, 68],[15, 173],[16, 169],[17, 168],[18, 174],[19, 173],[20, 174],[21, 173],[22, 173],[23, 172],[24, 68],[25, 170],[26, 172],[27, 169],[28, 0]])

export const dark_pink_alt2_Button = n480
export const dark_pink_alt2_Switch = n480
export const dark_pink_alt2_TooltipContent = n480
export const dark_pink_alt2_SliderTrack = n480
const n481 = t([[12, 168],[13, 169],[14, 170],[15, 172],[16, 167],[17, 166],[18, 174],[19, 173],[20, 174],[21, 173],[22, 175],[23, 68],[24, 173],[25, 172],[26, 68],[27, 172],[28, 175]])

export const dark_pink_alt2_Checkbox = n481
export const dark_pink_alt2_RadioGroupItem = n481
export const dark_pink_alt2_Input = n481
export const dark_pink_alt2_TextArea = n481
const n482 = t([[12, 175],[13, 174],[14, 173],[15, 68],[16, 0],[17, 0],[18, 167],[19, 168],[20, 167],[21, 168],[22, 165],[23, 173],[24, 68],[25, 174],[26, 173],[27, 168],[28, 168]])

export const dark_pink_alt2_SwitchThumb = n482
const n483 = t([[12, 172],[13, 170],[14, 169],[15, 168],[16, 68],[17, 173],[18, 167],[19, 168],[20, 167],[21, 168],[22, 168],[23, 169],[24, 168],[25, 170],[26, 169],[27, 68],[28, 165]])

export const dark_pink_alt2_SliderTrackActive = n483
const n484 = t([[12, 173],[13, 68],[14, 172],[15, 170],[16, 174],[17, 175],[18, 167],[19, 168],[20, 167],[21, 168],[22, 166],[23, 172],[24, 170],[25, 68],[26, 172],[27, 170],[28, 166]])

export const dark_pink_alt2_SliderThumb = n484
export const dark_pink_alt2_Tooltip = n484
export const dark_pink_alt2_ProgressIndicator = n484
const n485 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[19, 68],[20, 173],[21, 68],[22, 174],[23, 172],[24, 68],[25, 170],[26, 172],[27, 170],[28, 0]])

export const dark_pink_active_ListItem = n485
const n486 = t([[12, 172],[13, 68],[14, 173],[15, 174],[16, 170],[17, 169],[19, 68],[20, 173],[21, 68],[22, 68],[23, 68],[24, 173],[25, 172],[26, 68],[27, 168],[28, 0]])

export const dark_pink_active_Button = n486
export const dark_pink_active_Switch = n486
const n487 = t([[12, 169],[13, 170],[14, 172],[15, 68],[16, 168],[17, 167],[19, 68],[20, 173],[21, 68],[22, 174],[23, 173],[24, 174],[25, 68],[26, 173],[27, 170],[28, 0]])

export const dark_pink_active_Checkbox = n487
export const dark_pink_active_Input = n487
export const dark_pink_active_TextArea = n487
const n488 = t([[12, 170],[13, 169],[14, 168],[15, 167],[16, 172],[17, 68],[19, 169],[20, 168],[21, 169],[22, 169],[23, 168],[24, 167],[25, 169],[26, 168],[27, 173],[28, 165]])

export const dark_pink_active_SliderTrackActive = n488
const n489 = t([[12, 189],[13, 190],[14, 191],[15, 192],[16, 188],[17, 187],[18, 197],[19, 196],[20, 197],[21, 196],[22, 0],[23, 192],[24, 194],[25, 191],[26, 192],[27, 92],[28, 196]])

export const dark_red_alt1_ListItem = n489
const n490 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 197],[19, 196],[20, 197],[21, 196],[22, 197],[23, 194],[24, 92],[25, 192],[26, 194],[27, 194],[28, 197]])

export const dark_red_alt1_Card = n490
export const dark_red_alt1_DrawerFrame = n490
export const dark_red_alt1_Progress = n490
export const dark_red_alt1_TooltipArrow = n490
const n491 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[18, 197],[19, 196],[20, 197],[21, 196],[22, 196],[23, 194],[24, 92],[25, 192],[26, 194],[27, 192],[28, 0]])

export const dark_red_alt1_Button = n491
export const dark_red_alt1_Switch = n491
export const dark_red_alt1_TooltipContent = n491
export const dark_red_alt1_SliderTrack = n491
const n492 = t([[12, 189],[13, 190],[14, 191],[15, 192],[16, 188],[17, 187],[18, 197],[19, 196],[20, 197],[21, 196],[22, 0],[23, 92],[24, 195],[25, 194],[26, 92],[27, 92],[28, 196]])

export const dark_red_alt1_Checkbox = n492
export const dark_red_alt1_RadioGroupItem = n492
export const dark_red_alt1_Input = n492
export const dark_red_alt1_TextArea = n492
const n493 = t([[12, 0],[13, 197],[14, 196],[15, 195],[16, 0],[17, 0],[18, 188],[19, 189],[20, 188],[21, 189],[22, 187],[23, 195],[24, 92],[25, 196],[26, 195],[27, 189],[28, 191]])

export const dark_red_alt1_SwitchThumb = n493
const n494 = t([[12, 92],[13, 194],[14, 192],[15, 191],[16, 195],[17, 196],[18, 188],[19, 189],[20, 188],[21, 189],[22, 189],[23, 191],[24, 190],[25, 192],[26, 191],[27, 194],[28, 187]])

export const dark_red_alt1_SliderTrackActive = n494
const n495 = t([[12, 196],[13, 195],[14, 92],[15, 194],[16, 197],[17, 0],[18, 188],[19, 189],[20, 188],[21, 189],[22, 187],[23, 194],[24, 192],[25, 92],[26, 194],[27, 191],[28, 189]])

export const dark_red_alt1_SliderThumb = n495
export const dark_red_alt1_Tooltip = n495
export const dark_red_alt1_ProgressIndicator = n495
const n496 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 196],[19, 195],[20, 196],[21, 195],[22, 197],[23, 192],[24, 194],[25, 191],[26, 192],[27, 194],[28, 197]])

export const dark_red_alt2_ListItem = n496
const n497 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[18, 196],[19, 195],[20, 196],[21, 195],[22, 196],[23, 194],[24, 92],[25, 192],[26, 194],[27, 192],[28, 0]])

export const dark_red_alt2_Card = n497
export const dark_red_alt2_DrawerFrame = n497
export const dark_red_alt2_Progress = n497
export const dark_red_alt2_TooltipArrow = n497
const n498 = t([[12, 192],[13, 194],[14, 92],[15, 195],[16, 191],[17, 190],[18, 196],[19, 195],[20, 196],[21, 195],[22, 195],[23, 194],[24, 92],[25, 192],[26, 194],[27, 191],[28, 0]])

export const dark_red_alt2_Button = n498
export const dark_red_alt2_Switch = n498
export const dark_red_alt2_TooltipContent = n498
export const dark_red_alt2_SliderTrack = n498
const n499 = t([[12, 190],[13, 191],[14, 192],[15, 194],[16, 189],[17, 188],[18, 196],[19, 195],[20, 196],[21, 195],[22, 197],[23, 92],[24, 195],[25, 194],[26, 92],[27, 194],[28, 197]])

export const dark_red_alt2_Checkbox = n499
export const dark_red_alt2_RadioGroupItem = n499
export const dark_red_alt2_Input = n499
export const dark_red_alt2_TextArea = n499
const n500 = t([[12, 197],[13, 196],[14, 195],[15, 92],[16, 0],[17, 0],[18, 189],[19, 190],[20, 189],[21, 190],[22, 187],[23, 195],[24, 92],[25, 196],[26, 195],[27, 190],[28, 190]])

export const dark_red_alt2_SwitchThumb = n500
const n501 = t([[12, 194],[13, 192],[14, 191],[15, 190],[16, 92],[17, 195],[18, 189],[19, 190],[20, 189],[21, 190],[22, 190],[23, 191],[24, 190],[25, 192],[26, 191],[27, 92],[28, 187]])

export const dark_red_alt2_SliderTrackActive = n501
const n502 = t([[12, 195],[13, 92],[14, 194],[15, 192],[16, 196],[17, 197],[18, 189],[19, 190],[20, 189],[21, 190],[22, 188],[23, 194],[24, 192],[25, 92],[26, 194],[27, 192],[28, 188]])

export const dark_red_alt2_SliderThumb = n502
export const dark_red_alt2_Tooltip = n502
export const dark_red_alt2_ProgressIndicator = n502
const n503 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[19, 92],[20, 195],[21, 92],[22, 196],[23, 194],[24, 92],[25, 192],[26, 194],[27, 192],[28, 0]])

export const dark_red_active_ListItem = n503
const n504 = t([[12, 194],[13, 92],[14, 195],[15, 196],[16, 192],[17, 191],[19, 92],[20, 195],[21, 92],[22, 92],[23, 92],[24, 195],[25, 194],[26, 92],[27, 190],[28, 0]])

export const dark_red_active_Button = n504
export const dark_red_active_Switch = n504
const n505 = t([[12, 191],[13, 192],[14, 194],[15, 92],[16, 190],[17, 189],[19, 92],[20, 195],[21, 92],[22, 196],[23, 195],[24, 196],[25, 92],[26, 195],[27, 192],[28, 0]])

export const dark_red_active_Checkbox = n505
export const dark_red_active_Input = n505
export const dark_red_active_TextArea = n505
const n506 = t([[12, 192],[13, 191],[14, 190],[15, 189],[16, 194],[17, 92],[19, 191],[20, 190],[21, 191],[22, 191],[23, 190],[24, 189],[25, 191],[26, 190],[27, 195],[28, 187]])

export const dark_red_active_SliderTrackActive = n506
const n507 = t([[12, 134],[13, 135],[14, 136],[15, 137],[16, 133],[17, 132],[18, 29],[19, 142],[20, 29],[21, 142],[22, 0],[23, 137],[24, 139],[25, 136],[26, 137],[27, 140],[28, 142]])

export const dark_gray_alt1_ListItem = n507
const n508 = t([[12, 135],[13, 136],[14, 137],[15, 139],[16, 134],[17, 133],[18, 29],[19, 142],[20, 29],[21, 142],[22, 29],[23, 139],[24, 140],[25, 137],[26, 139],[27, 139],[28, 29]])

export const dark_gray_alt1_Card = n508
export const dark_gray_alt1_DrawerFrame = n508
export const dark_gray_alt1_Progress = n508
export const dark_gray_alt1_TooltipArrow = n508
const n509 = t([[12, 136],[13, 137],[14, 139],[15, 140],[16, 135],[17, 134],[18, 29],[19, 142],[20, 29],[21, 142],[22, 142],[23, 139],[24, 140],[25, 137],[26, 139],[27, 137],[28, 0]])

export const dark_gray_alt1_Button = n509
export const dark_gray_alt1_Switch = n509
export const dark_gray_alt1_TooltipContent = n509
export const dark_gray_alt1_SliderTrack = n509
const n510 = t([[12, 134],[13, 135],[14, 136],[15, 137],[16, 133],[17, 132],[18, 29],[19, 142],[20, 29],[21, 142],[22, 0],[23, 140],[24, 141],[25, 139],[26, 140],[27, 140],[28, 142]])

export const dark_gray_alt1_Checkbox = n510
export const dark_gray_alt1_RadioGroupItem = n510
export const dark_gray_alt1_Input = n510
export const dark_gray_alt1_TextArea = n510
const n511 = t([[12, 0],[13, 29],[14, 142],[15, 141],[16, 0],[17, 0],[18, 133],[19, 134],[20, 133],[21, 134],[22, 132],[23, 141],[24, 140],[25, 142],[26, 141],[27, 134],[28, 136]])

export const dark_gray_alt1_SwitchThumb = n511
const n512 = t([[12, 140],[13, 139],[14, 137],[15, 136],[16, 141],[17, 142],[18, 133],[19, 134],[20, 133],[21, 134],[22, 134],[23, 136],[24, 135],[25, 137],[26, 136],[27, 139],[28, 132]])

export const dark_gray_alt1_SliderTrackActive = n512
const n513 = t([[12, 142],[13, 141],[14, 140],[15, 139],[16, 29],[17, 0],[18, 133],[19, 134],[20, 133],[21, 134],[22, 132],[23, 139],[24, 137],[25, 140],[26, 139],[27, 136],[28, 134]])

export const dark_gray_alt1_SliderThumb = n513
export const dark_gray_alt1_Tooltip = n513
export const dark_gray_alt1_ProgressIndicator = n513
const n514 = t([[12, 135],[13, 136],[14, 137],[15, 139],[16, 134],[17, 133],[18, 142],[19, 141],[20, 142],[21, 141],[22, 29],[23, 137],[24, 139],[25, 136],[26, 137],[27, 139],[28, 29]])

export const dark_gray_alt2_ListItem = n514
const n515 = t([[12, 136],[13, 137],[14, 139],[15, 140],[16, 135],[17, 134],[18, 142],[19, 141],[20, 142],[21, 141],[22, 142],[23, 139],[24, 140],[25, 137],[26, 139],[27, 137],[28, 0]])

export const dark_gray_alt2_Card = n515
export const dark_gray_alt2_DrawerFrame = n515
export const dark_gray_alt2_Progress = n515
export const dark_gray_alt2_TooltipArrow = n515
const n516 = t([[12, 137],[13, 139],[14, 140],[15, 141],[16, 136],[17, 135],[18, 142],[19, 141],[20, 142],[21, 141],[22, 141],[23, 139],[24, 140],[25, 137],[26, 139],[27, 136],[28, 0]])

export const dark_gray_alt2_Button = n516
export const dark_gray_alt2_Switch = n516
export const dark_gray_alt2_TooltipContent = n516
export const dark_gray_alt2_SliderTrack = n516
const n517 = t([[12, 135],[13, 136],[14, 137],[15, 139],[16, 134],[17, 133],[18, 142],[19, 141],[20, 142],[21, 141],[22, 29],[23, 140],[24, 141],[25, 139],[26, 140],[27, 139],[28, 29]])

export const dark_gray_alt2_Checkbox = n517
export const dark_gray_alt2_RadioGroupItem = n517
export const dark_gray_alt2_Input = n517
export const dark_gray_alt2_TextArea = n517
const n518 = t([[12, 29],[13, 142],[14, 141],[15, 140],[16, 0],[17, 0],[18, 134],[19, 135],[20, 134],[21, 135],[22, 132],[23, 141],[24, 140],[25, 142],[26, 141],[27, 135],[28, 135]])

export const dark_gray_alt2_SwitchThumb = n518
const n519 = t([[12, 139],[13, 137],[14, 136],[15, 135],[16, 140],[17, 141],[18, 134],[19, 135],[20, 134],[21, 135],[22, 135],[23, 136],[24, 135],[25, 137],[26, 136],[27, 140],[28, 132]])

export const dark_gray_alt2_SliderTrackActive = n519
const n520 = t([[12, 141],[13, 140],[14, 139],[15, 137],[16, 142],[17, 29],[18, 134],[19, 135],[20, 134],[21, 135],[22, 133],[23, 139],[24, 137],[25, 140],[26, 139],[27, 137],[28, 133]])

export const dark_gray_alt2_SliderThumb = n520
export const dark_gray_alt2_Tooltip = n520
export const dark_gray_alt2_ProgressIndicator = n520
const n521 = t([[12, 136],[13, 137],[14, 139],[15, 140],[16, 135],[17, 134],[19, 140],[20, 141],[21, 140],[22, 142],[23, 139],[24, 140],[25, 137],[26, 139],[27, 137],[28, 0]])

export const dark_gray_active_ListItem = n521
const n522 = t([[12, 139],[13, 140],[14, 141],[15, 142],[16, 137],[17, 136],[19, 140],[20, 141],[21, 140],[22, 140],[23, 140],[24, 141],[25, 139],[26, 140],[27, 135],[28, 0]])

export const dark_gray_active_Button = n522
export const dark_gray_active_Switch = n522
const n523 = t([[12, 136],[13, 137],[14, 139],[15, 140],[16, 135],[17, 134],[19, 140],[20, 141],[21, 140],[22, 142],[23, 141],[24, 142],[25, 140],[26, 141],[27, 137],[28, 0]])

export const dark_gray_active_Checkbox = n523
export const dark_gray_active_Input = n523
export const dark_gray_active_TextArea = n523
const n524 = t([[12, 137],[13, 136],[14, 135],[15, 134],[16, 139],[17, 140],[19, 136],[20, 135],[21, 136],[22, 136],[23, 135],[24, 134],[25, 136],[26, 135],[27, 141],[28, 132]])

export const dark_gray_active_SliderTrackActive = n524