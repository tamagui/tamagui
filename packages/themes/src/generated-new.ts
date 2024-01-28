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
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.9)',
  'transparent',
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


const n1 = t([[0, 0],[1, 1],[2, 2],[3, 3],[4, 4],[5, 5],[6, 6],[7, 7],[8, 8],[9, 9],[10, 10],[11, 11],[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 4],[24, 5],[25, 3],[26, 4],[27, 8],[28, 14],[29, 15],[30, 16],[31, 17],[32, 18],[33, 19],[34, 20],[35, 21],[36, 22],[37, 23],[38, 24],[39, 25],[40, 26],[41, 27],[42, 28],[43, 29],[44, 30],[45, 31],[46, 32],[47, 33],[48, 8],[49, 34],[50, 35],[51, 11],[52, 36],[53, 37],[54, 38],[55, 39],[56, 40],[57, 41],[58, 42],[59, 43],[60, 44],[61, 45],[62, 46],[63, 47],[64, 48],[65, 49],[66, 50],[67, 51],[68, 52],[69, 53],[70, 54],[71, 55],[72, 56],[73, 57],[74, 58],[75, 59],[76, 60],[77, 61],[78, 62],[79, 63],[80, 64],[81, 65],[82, 66],[83, 67],[84, 68],[85, 69],[86, 70],[87, 71],[88, 72],[89, 73],[90, 74],[91, 75],[92, 76],[93, 77],[94, 78],[95, 79],[96, 80],[97, 81],[98, 82],[99, 83],[100, 84],[101, 85],[102, 86],[103, 87],[104, 88],[105, 89],[106, 90],[107, 91],[108, 92],[109, 93],[110, 94],[111, 95],[112, 96],[113, 97],[114, 98],[115, 99],[116, 100],[117, 101],[118, 102],[119, 103],[120, 104],[121, 105],[122, 106],[123, 107],[124, 108],[125, 108],[126, 109],[127, 109]])

export const light = n1
const n2 = t([[0, 110],[1, 111],[2, 112],[3, 113],[4, 114],[5, 115],[6, 116],[7, 117],[8, 118],[9, 119],[10, 120],[11, 0],[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 114],[24, 115],[25, 113],[26, 114],[27, 118],[28, 121],[29, 122],[30, 123],[31, 124],[32, 125],[33, 126],[34, 127],[35, 128],[36, 22],[37, 129],[38, 130],[39, 131],[40, 132],[41, 133],[42, 134],[43, 135],[44, 136],[45, 137],[46, 138],[47, 139],[48, 140],[49, 141],[50, 142],[51, 29],[52, 143],[53, 144],[54, 145],[55, 146],[56, 147],[57, 148],[58, 149],[59, 150],[60, 44],[61, 151],[62, 152],[63, 153],[64, 154],[65, 155],[66, 156],[67, 157],[68, 158],[69, 159],[70, 160],[71, 161],[72, 56],[73, 162],[74, 163],[75, 164],[76, 165],[77, 166],[78, 167],[79, 168],[80, 169],[81, 170],[82, 171],[83, 172],[84, 68],[85, 173],[86, 174],[87, 175],[88, 176],[89, 177],[90, 178],[91, 179],[92, 180],[93, 181],[94, 182],[95, 183],[96, 80],[97, 184],[98, 185],[99, 186],[100, 187],[101, 188],[102, 189],[103, 190],[104, 191],[105, 192],[106, 193],[107, 194],[108, 92],[109, 195],[110, 196],[111, 197],[112, 198],[113, 199],[114, 200],[115, 201],[116, 202],[117, 203],[118, 204],[119, 205],[120, 104],[121, 206],[122, 207],[123, 208],[124, 209],[125, 209],[126, 210],[127, 210]])

export const dark = n2
const n3 = t([[0, 0],[1, 1],[2, 2],[3, 3],[4, 4],[5, 5],[6, 6],[7, 7],[8, 8],[9, 9],[10, 10],[11, 11],[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 3],[24, 4],[25, 3],[26, 3],[27, 8]])

export const light_orange = n3
export const light_yellow = n3
export const light_green = n3
export const light_blue = n3
export const light_purple = n3
export const light_pink = n3
export const light_red = n3
const n4 = t([[0, 110],[1, 111],[2, 112],[3, 113],[4, 114],[5, 115],[6, 116],[7, 117],[8, 118],[9, 119],[10, 120],[11, 0],[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 114],[24, 115],[25, 113],[26, 114],[27, 118]])

export const dark_orange = n4
export const dark_yellow = n4
export const dark_green = n4
export const dark_blue = n4
export const dark_purple = n4
export const dark_pink = n4
export const dark_red = n4
const n5 = t([[12, 211]])

export const light_SheetOverlay = n5
export const light_DialogOverlay = n5
export const light_ModalOverlay = n5
export const light_orange_SheetOverlay = n5
export const light_orange_DialogOverlay = n5
export const light_orange_ModalOverlay = n5
export const light_yellow_SheetOverlay = n5
export const light_yellow_DialogOverlay = n5
export const light_yellow_ModalOverlay = n5
export const light_green_SheetOverlay = n5
export const light_green_DialogOverlay = n5
export const light_green_ModalOverlay = n5
export const light_blue_SheetOverlay = n5
export const light_blue_DialogOverlay = n5
export const light_blue_ModalOverlay = n5
export const light_purple_SheetOverlay = n5
export const light_purple_DialogOverlay = n5
export const light_purple_ModalOverlay = n5
export const light_pink_SheetOverlay = n5
export const light_pink_DialogOverlay = n5
export const light_pink_ModalOverlay = n5
export const light_red_SheetOverlay = n5
export const light_red_DialogOverlay = n5
export const light_red_ModalOverlay = n5
export const light_alt1_SheetOverlay = n5
export const light_alt1_DialogOverlay = n5
export const light_alt1_ModalOverlay = n5
export const light_alt2_SheetOverlay = n5
export const light_alt2_DialogOverlay = n5
export const light_alt2_ModalOverlay = n5
export const light_active_SheetOverlay = n5
export const light_active_DialogOverlay = n5
export const light_active_ModalOverlay = n5
export const light_orange_alt1_SheetOverlay = n5
export const light_orange_alt1_DialogOverlay = n5
export const light_orange_alt1_ModalOverlay = n5
export const light_orange_alt2_SheetOverlay = n5
export const light_orange_alt2_DialogOverlay = n5
export const light_orange_alt2_ModalOverlay = n5
export const light_orange_active_SheetOverlay = n5
export const light_orange_active_DialogOverlay = n5
export const light_orange_active_ModalOverlay = n5
export const light_yellow_alt1_SheetOverlay = n5
export const light_yellow_alt1_DialogOverlay = n5
export const light_yellow_alt1_ModalOverlay = n5
export const light_yellow_alt2_SheetOverlay = n5
export const light_yellow_alt2_DialogOverlay = n5
export const light_yellow_alt2_ModalOverlay = n5
export const light_yellow_active_SheetOverlay = n5
export const light_yellow_active_DialogOverlay = n5
export const light_yellow_active_ModalOverlay = n5
export const light_green_alt1_SheetOverlay = n5
export const light_green_alt1_DialogOverlay = n5
export const light_green_alt1_ModalOverlay = n5
export const light_green_alt2_SheetOverlay = n5
export const light_green_alt2_DialogOverlay = n5
export const light_green_alt2_ModalOverlay = n5
export const light_green_active_SheetOverlay = n5
export const light_green_active_DialogOverlay = n5
export const light_green_active_ModalOverlay = n5
export const light_blue_alt1_SheetOverlay = n5
export const light_blue_alt1_DialogOverlay = n5
export const light_blue_alt1_ModalOverlay = n5
export const light_blue_alt2_SheetOverlay = n5
export const light_blue_alt2_DialogOverlay = n5
export const light_blue_alt2_ModalOverlay = n5
export const light_blue_active_SheetOverlay = n5
export const light_blue_active_DialogOverlay = n5
export const light_blue_active_ModalOverlay = n5
export const light_purple_alt1_SheetOverlay = n5
export const light_purple_alt1_DialogOverlay = n5
export const light_purple_alt1_ModalOverlay = n5
export const light_purple_alt2_SheetOverlay = n5
export const light_purple_alt2_DialogOverlay = n5
export const light_purple_alt2_ModalOverlay = n5
export const light_purple_active_SheetOverlay = n5
export const light_purple_active_DialogOverlay = n5
export const light_purple_active_ModalOverlay = n5
export const light_pink_alt1_SheetOverlay = n5
export const light_pink_alt1_DialogOverlay = n5
export const light_pink_alt1_ModalOverlay = n5
export const light_pink_alt2_SheetOverlay = n5
export const light_pink_alt2_DialogOverlay = n5
export const light_pink_alt2_ModalOverlay = n5
export const light_pink_active_SheetOverlay = n5
export const light_pink_active_DialogOverlay = n5
export const light_pink_active_ModalOverlay = n5
export const light_red_alt1_SheetOverlay = n5
export const light_red_alt1_DialogOverlay = n5
export const light_red_alt1_ModalOverlay = n5
export const light_red_alt2_SheetOverlay = n5
export const light_red_alt2_DialogOverlay = n5
export const light_red_alt2_ModalOverlay = n5
export const light_red_active_SheetOverlay = n5
export const light_red_active_DialogOverlay = n5
export const light_red_active_ModalOverlay = n5
const n6 = t([[12, 212]])

export const dark_SheetOverlay = n6
export const dark_DialogOverlay = n6
export const dark_ModalOverlay = n6
export const dark_orange_SheetOverlay = n6
export const dark_orange_DialogOverlay = n6
export const dark_orange_ModalOverlay = n6
export const dark_yellow_SheetOverlay = n6
export const dark_yellow_DialogOverlay = n6
export const dark_yellow_ModalOverlay = n6
export const dark_green_SheetOverlay = n6
export const dark_green_DialogOverlay = n6
export const dark_green_ModalOverlay = n6
export const dark_blue_SheetOverlay = n6
export const dark_blue_DialogOverlay = n6
export const dark_blue_ModalOverlay = n6
export const dark_purple_SheetOverlay = n6
export const dark_purple_DialogOverlay = n6
export const dark_purple_ModalOverlay = n6
export const dark_pink_SheetOverlay = n6
export const dark_pink_DialogOverlay = n6
export const dark_pink_ModalOverlay = n6
export const dark_red_SheetOverlay = n6
export const dark_red_DialogOverlay = n6
export const dark_red_ModalOverlay = n6
export const dark_alt1_SheetOverlay = n6
export const dark_alt1_DialogOverlay = n6
export const dark_alt1_ModalOverlay = n6
export const dark_alt2_SheetOverlay = n6
export const dark_alt2_DialogOverlay = n6
export const dark_alt2_ModalOverlay = n6
export const dark_active_SheetOverlay = n6
export const dark_active_DialogOverlay = n6
export const dark_active_ModalOverlay = n6
export const dark_orange_alt1_SheetOverlay = n6
export const dark_orange_alt1_DialogOverlay = n6
export const dark_orange_alt1_ModalOverlay = n6
export const dark_orange_alt2_SheetOverlay = n6
export const dark_orange_alt2_DialogOverlay = n6
export const dark_orange_alt2_ModalOverlay = n6
export const dark_orange_active_SheetOverlay = n6
export const dark_orange_active_DialogOverlay = n6
export const dark_orange_active_ModalOverlay = n6
export const dark_yellow_alt1_SheetOverlay = n6
export const dark_yellow_alt1_DialogOverlay = n6
export const dark_yellow_alt1_ModalOverlay = n6
export const dark_yellow_alt2_SheetOverlay = n6
export const dark_yellow_alt2_DialogOverlay = n6
export const dark_yellow_alt2_ModalOverlay = n6
export const dark_yellow_active_SheetOverlay = n6
export const dark_yellow_active_DialogOverlay = n6
export const dark_yellow_active_ModalOverlay = n6
export const dark_green_alt1_SheetOverlay = n6
export const dark_green_alt1_DialogOverlay = n6
export const dark_green_alt1_ModalOverlay = n6
export const dark_green_alt2_SheetOverlay = n6
export const dark_green_alt2_DialogOverlay = n6
export const dark_green_alt2_ModalOverlay = n6
export const dark_green_active_SheetOverlay = n6
export const dark_green_active_DialogOverlay = n6
export const dark_green_active_ModalOverlay = n6
export const dark_blue_alt1_SheetOverlay = n6
export const dark_blue_alt1_DialogOverlay = n6
export const dark_blue_alt1_ModalOverlay = n6
export const dark_blue_alt2_SheetOverlay = n6
export const dark_blue_alt2_DialogOverlay = n6
export const dark_blue_alt2_ModalOverlay = n6
export const dark_blue_active_SheetOverlay = n6
export const dark_blue_active_DialogOverlay = n6
export const dark_blue_active_ModalOverlay = n6
export const dark_purple_alt1_SheetOverlay = n6
export const dark_purple_alt1_DialogOverlay = n6
export const dark_purple_alt1_ModalOverlay = n6
export const dark_purple_alt2_SheetOverlay = n6
export const dark_purple_alt2_DialogOverlay = n6
export const dark_purple_alt2_ModalOverlay = n6
export const dark_purple_active_SheetOverlay = n6
export const dark_purple_active_DialogOverlay = n6
export const dark_purple_active_ModalOverlay = n6
export const dark_pink_alt1_SheetOverlay = n6
export const dark_pink_alt1_DialogOverlay = n6
export const dark_pink_alt1_ModalOverlay = n6
export const dark_pink_alt2_SheetOverlay = n6
export const dark_pink_alt2_DialogOverlay = n6
export const dark_pink_alt2_ModalOverlay = n6
export const dark_pink_active_SheetOverlay = n6
export const dark_pink_active_DialogOverlay = n6
export const dark_pink_active_ModalOverlay = n6
export const dark_red_alt1_SheetOverlay = n6
export const dark_red_alt1_DialogOverlay = n6
export const dark_red_alt1_ModalOverlay = n6
export const dark_red_alt2_SheetOverlay = n6
export const dark_red_alt2_DialogOverlay = n6
export const dark_red_alt2_ModalOverlay = n6
export const dark_red_active_SheetOverlay = n6
export const dark_red_active_DialogOverlay = n6
export const dark_red_active_ModalOverlay = n6
const n7 = t([[0, 1],[1, 2],[2, 3],[3, 4],[4, 5],[5, 6],[6, 7],[7, 8],[8, 9],[9, 10],[10, 11],[11, 11],[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7]])

export const light_alt1 = n7
const n8 = t([[0, 2],[1, 3],[2, 4],[3, 5],[4, 6],[5, 7],[6, 8],[7, 9],[8, 10],[9, 11],[10, 11],[11, 11],[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]])

export const light_alt2 = n8
const n9 = t([[0, 3],[1, 4],[2, 5],[3, 6],[4, 7],[5, 8],[6, 9],[7, 10],[8, 11],[9, 13],[10, 13],[11, 13],[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 7],[24, 8],[25, 6],[26, 7],[27, 5]])

export const light_active = n9
const n10 = t([[0, 111],[1, 112],[2, 113],[3, 114],[4, 115],[5, 116],[6, 117],[7, 118],[8, 119],[9, 120],[10, 0],[11, 0],[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117]])

export const dark_alt1 = n10
export const dark_orange_alt1 = n10
export const dark_yellow_alt1 = n10
export const dark_green_alt1 = n10
export const dark_blue_alt1 = n10
export const dark_purple_alt1 = n10
export const dark_pink_alt1 = n10
export const dark_red_alt1 = n10
const n11 = t([[0, 112],[1, 113],[2, 114],[3, 115],[4, 116],[5, 117],[6, 118],[7, 119],[8, 120],[9, 0],[10, 0],[11, 0],[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116]])

export const dark_alt2 = n11
export const dark_orange_alt2 = n11
export const dark_yellow_alt2 = n11
export const dark_green_alt2 = n11
export const dark_blue_alt2 = n11
export const dark_purple_alt2 = n11
export const dark_pink_alt2 = n11
export const dark_red_alt2 = n11
const n12 = t([[0, 113],[1, 114],[2, 115],[3, 116],[4, 117],[5, 118],[6, 119],[7, 120],[8, 0],[9, 12],[10, 12],[11, 12],[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 117],[24, 118],[25, 116],[26, 117],[27, 115]])

export const dark_active = n12
export const dark_orange_active = n12
export const dark_yellow_active = n12
export const dark_green_active = n12
export const dark_blue_active = n12
export const dark_purple_active = n12
export const dark_pink_active = n12
export const dark_red_active = n12
const n13 = t([[0, 1],[1, 2],[2, 3],[3, 4],[4, 5],[5, 6],[6, 7],[7, 8],[8, 9],[9, 10],[10, 11],[11, 11],[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 4],[24, 5],[25, 4],[26, 4],[27, 7]])

export const light_orange_alt1 = n13
export const light_yellow_alt1 = n13
export const light_green_alt1 = n13
export const light_blue_alt1 = n13
export const light_purple_alt1 = n13
export const light_pink_alt1 = n13
export const light_red_alt1 = n13
const n14 = t([[0, 2],[1, 3],[2, 4],[3, 5],[4, 6],[5, 7],[6, 8],[7, 9],[8, 10],[9, 11],[10, 11],[11, 11],[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 5],[24, 6],[25, 5],[26, 5],[27, 6]])

export const light_orange_alt2 = n14
export const light_yellow_alt2 = n14
export const light_green_alt2 = n14
export const light_blue_alt2 = n14
export const light_purple_alt2 = n14
export const light_pink_alt2 = n14
export const light_red_alt2 = n14
const n15 = t([[0, 3],[1, 4],[2, 5],[3, 6],[4, 7],[5, 8],[6, 9],[7, 10],[8, 11],[9, 13],[10, 13],[11, 13],[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 6],[24, 7],[25, 6],[26, 6],[27, 5]])

export const light_orange_active = n15
export const light_yellow_active = n15
export const light_green_active = n15
export const light_blue_active = n15
export const light_purple_active = n15
export const light_pink_active = n15
export const light_red_active = n15
const n16 = t([[12, 0],[13, 1],[14, 2],[15, 3],[16, 0],[17, 0],[18, 11],[19, 10],[20, 11],[21, 10],[22, 11],[23, 3],[24, 4],[25, 2],[26, 3],[27, 9]])

export const light_ListItem = n16
const n17 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 11],[19, 10],[20, 11],[21, 10],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7]])

export const light_Card = n17
export const light_DrawerFrame = n17
export const light_Progress = n17
export const light_TooltipArrow = n17
const n18 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 11],[19, 10],[20, 11],[21, 10],[22, 10],[23, 213],[24, 213],[25, 5],[26, 6],[27, 6]])

export const light_Button = n18
const n19 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 6],[24, 7],[25, 5],[26, 6],[27, 8]])

export const light_Checkbox = n19
export const light_RadioGroupItem = n19
export const light_Input = n19
export const light_TextArea = n19
const n20 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 11],[19, 10],[20, 11],[21, 10],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]])

export const light_Switch = n20
export const light_TooltipContent = n20
export const light_SliderTrack = n20
const n21 = t([[12, 11],[13, 11],[14, 10],[15, 9],[16, 11],[17, 11],[18, 0],[19, 1],[20, 0],[21, 1],[22, 0],[23, 9],[24, 8],[25, 10],[26, 9],[27, 1]])

export const light_SwitchThumb = n21
const n22 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 0],[19, 1],[20, 0],[21, 1],[22, 1],[23, 5],[24, 4],[25, 6],[26, 5],[27, 5]])

export const light_SliderTrackActive = n22
const n23 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 13],[18, 0],[19, 1],[20, 0],[21, 1],[22, 12],[23, 7],[24, 6],[25, 8],[26, 7],[27, 3]])

export const light_SliderThumb = n23
export const light_Tooltip = n23
export const light_ProgressIndicator = n23
const n24 = t([[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 114],[24, 115],[25, 113],[26, 114],[27, 118]])

export const dark_ListItem = n24
export const dark_orange_ListItem = n24
export const dark_yellow_ListItem = n24
export const dark_green_ListItem = n24
export const dark_blue_ListItem = n24
export const dark_purple_ListItem = n24
export const dark_pink_ListItem = n24
export const dark_red_ListItem = n24
const n25 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 0],[19, 120],[20, 0],[21, 120],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117]])

export const dark_Card = n25
export const dark_DrawerFrame = n25
export const dark_Progress = n25
export const dark_TooltipArrow = n25
export const dark_orange_Card = n25
export const dark_orange_DrawerFrame = n25
export const dark_orange_Progress = n25
export const dark_orange_TooltipArrow = n25
export const dark_yellow_Card = n25
export const dark_yellow_DrawerFrame = n25
export const dark_yellow_Progress = n25
export const dark_yellow_TooltipArrow = n25
export const dark_green_Card = n25
export const dark_green_DrawerFrame = n25
export const dark_green_Progress = n25
export const dark_green_TooltipArrow = n25
export const dark_blue_Card = n25
export const dark_blue_DrawerFrame = n25
export const dark_blue_Progress = n25
export const dark_blue_TooltipArrow = n25
export const dark_purple_Card = n25
export const dark_purple_DrawerFrame = n25
export const dark_purple_Progress = n25
export const dark_purple_TooltipArrow = n25
export const dark_pink_Card = n25
export const dark_pink_DrawerFrame = n25
export const dark_pink_Progress = n25
export const dark_pink_TooltipArrow = n25
export const dark_red_Card = n25
export const dark_red_DrawerFrame = n25
export const dark_red_Progress = n25
export const dark_red_TooltipArrow = n25
const n26 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 0],[19, 120],[20, 0],[21, 120],[22, 120],[23, 213],[24, 213],[25, 115],[26, 116],[27, 116]])

export const dark_Button = n26
export const dark_orange_Button = n26
export const dark_yellow_Button = n26
export const dark_green_Button = n26
export const dark_blue_Button = n26
export const dark_purple_Button = n26
export const dark_pink_Button = n26
export const dark_red_Button = n26
const n27 = t([[12, 111],[13, 112],[14, 113],[15, 114],[16, 110],[17, 13],[18, 0],[19, 120],[20, 0],[21, 120],[22, 12],[23, 116],[24, 117],[25, 115],[26, 116],[27, 118]])

export const dark_Checkbox = n27
export const dark_RadioGroupItem = n27
export const dark_Input = n27
export const dark_TextArea = n27
export const dark_orange_Checkbox = n27
export const dark_orange_RadioGroupItem = n27
export const dark_orange_Input = n27
export const dark_orange_TextArea = n27
export const dark_yellow_Checkbox = n27
export const dark_yellow_RadioGroupItem = n27
export const dark_yellow_Input = n27
export const dark_yellow_TextArea = n27
export const dark_green_Checkbox = n27
export const dark_green_RadioGroupItem = n27
export const dark_green_Input = n27
export const dark_green_TextArea = n27
export const dark_blue_Checkbox = n27
export const dark_blue_RadioGroupItem = n27
export const dark_blue_Input = n27
export const dark_blue_TextArea = n27
export const dark_purple_Checkbox = n27
export const dark_purple_RadioGroupItem = n27
export const dark_purple_Input = n27
export const dark_purple_TextArea = n27
export const dark_pink_Checkbox = n27
export const dark_pink_RadioGroupItem = n27
export const dark_pink_Input = n27
export const dark_pink_TextArea = n27
export const dark_red_Checkbox = n27
export const dark_red_RadioGroupItem = n27
export const dark_red_Input = n27
export const dark_red_TextArea = n27
const n28 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 0],[19, 120],[20, 0],[21, 120],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116]])

export const dark_Switch = n28
export const dark_TooltipContent = n28
export const dark_SliderTrack = n28
export const dark_orange_Switch = n28
export const dark_orange_TooltipContent = n28
export const dark_orange_SliderTrack = n28
export const dark_yellow_Switch = n28
export const dark_yellow_TooltipContent = n28
export const dark_yellow_SliderTrack = n28
export const dark_green_Switch = n28
export const dark_green_TooltipContent = n28
export const dark_green_SliderTrack = n28
export const dark_blue_Switch = n28
export const dark_blue_TooltipContent = n28
export const dark_blue_SliderTrack = n28
export const dark_purple_Switch = n28
export const dark_purple_TooltipContent = n28
export const dark_purple_SliderTrack = n28
export const dark_pink_Switch = n28
export const dark_pink_TooltipContent = n28
export const dark_pink_SliderTrack = n28
export const dark_red_Switch = n28
export const dark_red_TooltipContent = n28
export const dark_red_SliderTrack = n28
const n29 = t([[12, 0],[13, 0],[14, 120],[15, 119],[16, 0],[17, 0],[18, 110],[19, 111],[20, 110],[21, 111],[22, 110],[23, 119],[24, 118],[25, 120],[26, 119],[27, 111]])

export const dark_SwitchThumb = n29
export const dark_orange_SwitchThumb = n29
export const dark_yellow_SwitchThumb = n29
export const dark_green_SwitchThumb = n29
export const dark_blue_SwitchThumb = n29
export const dark_purple_SwitchThumb = n29
export const dark_pink_SwitchThumb = n29
export const dark_red_SwitchThumb = n29
const n30 = t([[12, 118],[13, 117],[14, 116],[15, 115],[16, 119],[17, 120],[18, 110],[19, 111],[20, 110],[21, 111],[22, 111],[23, 115],[24, 114],[25, 116],[26, 115],[27, 115]])

export const dark_SliderTrackActive = n30
export const dark_orange_SliderTrackActive = n30
export const dark_yellow_SliderTrackActive = n30
export const dark_green_SliderTrackActive = n30
export const dark_blue_SliderTrackActive = n30
export const dark_purple_SliderTrackActive = n30
export const dark_pink_SliderTrackActive = n30
export const dark_red_SliderTrackActive = n30
const n31 = t([[12, 120],[13, 119],[14, 118],[15, 117],[16, 0],[17, 12],[18, 110],[19, 111],[20, 110],[21, 111],[22, 13],[23, 117],[24, 116],[25, 118],[26, 117],[27, 113]])

export const dark_SliderThumb = n31
export const dark_Tooltip = n31
export const dark_ProgressIndicator = n31
export const dark_orange_SliderThumb = n31
export const dark_orange_Tooltip = n31
export const dark_orange_ProgressIndicator = n31
export const dark_yellow_SliderThumb = n31
export const dark_yellow_Tooltip = n31
export const dark_yellow_ProgressIndicator = n31
export const dark_green_SliderThumb = n31
export const dark_green_Tooltip = n31
export const dark_green_ProgressIndicator = n31
export const dark_blue_SliderThumb = n31
export const dark_blue_Tooltip = n31
export const dark_blue_ProgressIndicator = n31
export const dark_purple_SliderThumb = n31
export const dark_purple_Tooltip = n31
export const dark_purple_ProgressIndicator = n31
export const dark_pink_SliderThumb = n31
export const dark_pink_Tooltip = n31
export const dark_pink_ProgressIndicator = n31
export const dark_red_SliderThumb = n31
export const dark_red_Tooltip = n31
export const dark_red_ProgressIndicator = n31
const n32 = t([[12, 0],[13, 1],[14, 2],[15, 3],[16, 0],[17, 0],[18, 11],[19, 10],[20, 11],[21, 10],[22, 11],[23, 2],[24, 3],[25, 2],[26, 2],[27, 9]])

export const light_orange_ListItem = n32
export const light_yellow_ListItem = n32
export const light_green_ListItem = n32
export const light_blue_ListItem = n32
export const light_purple_ListItem = n32
export const light_pink_ListItem = n32
export const light_red_ListItem = n32
const n33 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 11],[19, 10],[20, 11],[21, 10],[22, 11],[23, 4],[24, 5],[25, 4],[26, 4],[27, 7]])

export const light_orange_Card = n33
export const light_orange_DrawerFrame = n33
export const light_orange_Progress = n33
export const light_orange_TooltipArrow = n33
export const light_yellow_Card = n33
export const light_yellow_DrawerFrame = n33
export const light_yellow_Progress = n33
export const light_yellow_TooltipArrow = n33
export const light_green_Card = n33
export const light_green_DrawerFrame = n33
export const light_green_Progress = n33
export const light_green_TooltipArrow = n33
export const light_blue_Card = n33
export const light_blue_DrawerFrame = n33
export const light_blue_Progress = n33
export const light_blue_TooltipArrow = n33
export const light_purple_Card = n33
export const light_purple_DrawerFrame = n33
export const light_purple_Progress = n33
export const light_purple_TooltipArrow = n33
export const light_pink_Card = n33
export const light_pink_DrawerFrame = n33
export const light_pink_Progress = n33
export const light_pink_TooltipArrow = n33
export const light_red_Card = n33
export const light_red_DrawerFrame = n33
export const light_red_Progress = n33
export const light_red_TooltipArrow = n33
const n34 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 11],[19, 10],[20, 11],[21, 10],[22, 10],[23, 213],[24, 213],[25, 5],[26, 5],[27, 6]])

export const light_orange_Button = n34
export const light_yellow_Button = n34
export const light_green_Button = n34
export const light_blue_Button = n34
export const light_purple_Button = n34
export const light_pink_Button = n34
export const light_red_Button = n34
const n35 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 12],[18, 11],[19, 10],[20, 11],[21, 10],[22, 13],[23, 5],[24, 6],[25, 5],[26, 5],[27, 8]])

export const light_orange_Checkbox = n35
export const light_orange_RadioGroupItem = n35
export const light_orange_Input = n35
export const light_orange_TextArea = n35
export const light_yellow_Checkbox = n35
export const light_yellow_RadioGroupItem = n35
export const light_yellow_Input = n35
export const light_yellow_TextArea = n35
export const light_green_Checkbox = n35
export const light_green_RadioGroupItem = n35
export const light_green_Input = n35
export const light_green_TextArea = n35
export const light_blue_Checkbox = n35
export const light_blue_RadioGroupItem = n35
export const light_blue_Input = n35
export const light_blue_TextArea = n35
export const light_purple_Checkbox = n35
export const light_purple_RadioGroupItem = n35
export const light_purple_Input = n35
export const light_purple_TextArea = n35
export const light_pink_Checkbox = n35
export const light_pink_RadioGroupItem = n35
export const light_pink_Input = n35
export const light_pink_TextArea = n35
export const light_red_Checkbox = n35
export const light_red_RadioGroupItem = n35
export const light_red_Input = n35
export const light_red_TextArea = n35
const n36 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 11],[19, 10],[20, 11],[21, 10],[22, 10],[23, 5],[24, 6],[25, 5],[26, 5],[27, 6]])

export const light_orange_Switch = n36
export const light_orange_TooltipContent = n36
export const light_orange_SliderTrack = n36
export const light_yellow_Switch = n36
export const light_yellow_TooltipContent = n36
export const light_yellow_SliderTrack = n36
export const light_green_Switch = n36
export const light_green_TooltipContent = n36
export const light_green_SliderTrack = n36
export const light_blue_Switch = n36
export const light_blue_TooltipContent = n36
export const light_blue_SliderTrack = n36
export const light_purple_Switch = n36
export const light_purple_TooltipContent = n36
export const light_purple_SliderTrack = n36
export const light_pink_Switch = n36
export const light_pink_TooltipContent = n36
export const light_pink_SliderTrack = n36
export const light_red_Switch = n36
export const light_red_TooltipContent = n36
export const light_red_SliderTrack = n36
const n37 = t([[12, 11],[13, 11],[14, 10],[15, 9],[16, 11],[17, 11],[18, 0],[19, 1],[20, 0],[21, 1],[22, 0],[23, 10],[24, 9],[25, 10],[26, 10],[27, 1]])

export const light_orange_SwitchThumb = n37
export const light_yellow_SwitchThumb = n37
export const light_green_SwitchThumb = n37
export const light_blue_SwitchThumb = n37
export const light_purple_SwitchThumb = n37
export const light_pink_SwitchThumb = n37
export const light_red_SwitchThumb = n37
const n38 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 0],[19, 1],[20, 0],[21, 1],[22, 1],[23, 6],[24, 5],[25, 6],[26, 6],[27, 5]])

export const light_orange_SliderTrackActive = n38
export const light_yellow_SliderTrackActive = n38
export const light_green_SliderTrackActive = n38
export const light_blue_SliderTrackActive = n38
export const light_purple_SliderTrackActive = n38
export const light_pink_SliderTrackActive = n38
export const light_red_SliderTrackActive = n38
const n39 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 13],[18, 0],[19, 1],[20, 0],[21, 1],[22, 12],[23, 8],[24, 7],[25, 8],[26, 8],[27, 3]])

export const light_orange_SliderThumb = n39
export const light_orange_Tooltip = n39
export const light_orange_ProgressIndicator = n39
export const light_yellow_SliderThumb = n39
export const light_yellow_Tooltip = n39
export const light_yellow_ProgressIndicator = n39
export const light_green_SliderThumb = n39
export const light_green_Tooltip = n39
export const light_green_ProgressIndicator = n39
export const light_blue_SliderThumb = n39
export const light_blue_Tooltip = n39
export const light_blue_ProgressIndicator = n39
export const light_purple_SliderThumb = n39
export const light_purple_Tooltip = n39
export const light_purple_ProgressIndicator = n39
export const light_pink_SliderThumb = n39
export const light_pink_Tooltip = n39
export const light_pink_ProgressIndicator = n39
export const light_red_SliderThumb = n39
export const light_red_Tooltip = n39
export const light_red_ProgressIndicator = n39
const n40 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 4],[24, 5],[25, 3],[26, 4],[27, 8]])

export const light_alt1_ListItem = n40
const n41 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 10],[19, 9],[20, 10],[21, 9],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]])

export const light_alt1_Card = n41
export const light_alt1_DrawerFrame = n41
export const light_alt1_Progress = n41
export const light_alt1_TooltipArrow = n41
const n42 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 10],[19, 9],[20, 10],[21, 9],[22, 9],[23, 213],[24, 213],[25, 6],[26, 7],[27, 5]])

export const light_alt1_Button = n42
const n43 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 7],[24, 8],[25, 6],[26, 7],[27, 7]])

export const light_alt1_Checkbox = n43
export const light_alt1_RadioGroupItem = n43
export const light_alt1_Input = n43
export const light_alt1_TextArea = n43
const n44 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 10],[19, 9],[20, 10],[21, 9],[22, 9],[23, 7],[24, 8],[25, 6],[26, 7],[27, 5]])

export const light_alt1_Switch = n44
export const light_alt1_TooltipContent = n44
export const light_alt1_SliderTrack = n44
const n45 = t([[12, 11],[13, 10],[14, 9],[15, 8],[16, 11],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 8],[24, 7],[25, 9],[26, 8],[27, 2]])

export const light_alt1_SwitchThumb = n45
const n46 = t([[12, 7],[13, 6],[14, 5],[15, 4],[16, 8],[17, 9],[18, 1],[19, 2],[20, 1],[21, 2],[22, 2],[23, 4],[24, 3],[25, 5],[26, 4],[27, 6]])

export const light_alt1_SliderTrackActive = n46
const n47 = t([[12, 9],[13, 8],[14, 7],[15, 6],[16, 10],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 6],[24, 5],[25, 7],[26, 6],[27, 4]])

export const light_alt1_SliderThumb = n47
export const light_alt1_Tooltip = n47
export const light_alt1_ProgressIndicator = n47
const n48 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 9],[19, 8],[20, 9],[21, 8],[22, 11],[23, 5],[24, 6],[25, 4],[26, 5],[27, 7]])

export const light_alt2_ListItem = n48
const n49 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 9],[19, 8],[20, 9],[21, 8],[22, 9],[23, 7],[24, 8],[25, 6],[26, 7],[27, 5]])

export const light_alt2_Card = n49
export const light_alt2_DrawerFrame = n49
export const light_alt2_Progress = n49
export const light_alt2_TooltipArrow = n49
const n50 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[18, 9],[19, 8],[20, 9],[21, 8],[22, 8],[23, 213],[24, 213],[25, 7],[26, 8],[27, 4]])

export const light_alt2_Button = n50
const n51 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 8],[24, 9],[25, 7],[26, 8],[27, 6]])

export const light_alt2_Checkbox = n51
export const light_alt2_RadioGroupItem = n51
export const light_alt2_Input = n51
export const light_alt2_TextArea = n51
const n52 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[18, 9],[19, 8],[20, 9],[21, 8],[22, 8],[23, 8],[24, 9],[25, 7],[26, 8],[27, 4]])

export const light_alt2_Switch = n52
export const light_alt2_TooltipContent = n52
export const light_alt2_SliderTrack = n52
const n53 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 11],[18, 2],[19, 3],[20, 2],[21, 3],[22, 0],[23, 7],[24, 6],[25, 8],[26, 7],[27, 3]])

export const light_alt2_SwitchThumb = n53
const n54 = t([[12, 6],[13, 5],[14, 4],[15, 3],[16, 7],[17, 8],[18, 2],[19, 3],[20, 2],[21, 3],[22, 3],[23, 3],[24, 2],[25, 4],[26, 3],[27, 7]])

export const light_alt2_SliderTrackActive = n54
const n55 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 2],[19, 3],[20, 2],[21, 3],[22, 1],[23, 5],[24, 4],[25, 6],[26, 5],[27, 5]])

export const light_alt2_SliderThumb = n55
export const light_alt2_Tooltip = n55
export const light_alt2_ProgressIndicator = n55
const n56 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[19, 7],[20, 8],[21, 7],[22, 10],[23, 6],[24, 7],[25, 5],[26, 6],[27, 6]])

export const light_active_ListItem = n56
const n57 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[19, 7],[20, 8],[21, 7],[22, 8],[23, 8],[24, 9],[25, 7],[26, 8],[27, 4]])

export const light_active_Card = n57
export const light_active_DrawerFrame = n57
export const light_active_Progress = n57
export const light_active_TooltipArrow = n57
const n58 = t([[12, 6],[13, 7],[14, 8],[15, 9],[16, 5],[17, 4],[19, 7],[20, 8],[21, 7],[22, 7],[23, 213],[24, 213],[25, 8],[26, 9],[27, 3]])

export const light_active_Button = n58
const n59 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 9],[24, 10],[25, 8],[26, 9],[27, 5]])

export const light_active_Checkbox = n59
export const light_active_RadioGroupItem = n59
export const light_active_Input = n59
export const light_active_TextArea = n59
const n60 = t([[12, 6],[13, 7],[14, 8],[15, 9],[16, 5],[17, 4],[19, 7],[20, 8],[21, 7],[22, 7],[23, 9],[24, 10],[25, 8],[26, 9],[27, 3]])

export const light_active_Switch = n60
export const light_active_TooltipContent = n60
export const light_active_SliderTrack = n60
const n61 = t([[12, 9],[13, 8],[14, 7],[15, 6],[16, 10],[17, 11],[19, 4],[20, 3],[21, 4],[22, 0],[23, 6],[24, 5],[25, 7],[26, 6],[27, 4]])

export const light_active_SwitchThumb = n61
const n62 = t([[12, 5],[13, 4],[14, 3],[15, 2],[16, 6],[17, 7],[19, 4],[20, 3],[21, 4],[22, 4],[23, 2],[24, 1],[25, 3],[26, 2],[27, 8]])

export const light_active_SliderTrackActive = n62
const n63 = t([[12, 7],[13, 6],[14, 5],[15, 4],[16, 8],[17, 9],[19, 4],[20, 3],[21, 4],[22, 2],[23, 4],[24, 3],[25, 5],[26, 4],[27, 6]])

export const light_active_SliderThumb = n63
export const light_active_Tooltip = n63
export const light_active_ProgressIndicator = n63
const n64 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 115],[24, 116],[25, 114],[26, 115],[27, 117]])

export const dark_alt1_ListItem = n64
export const dark_orange_alt1_ListItem = n64
export const dark_yellow_alt1_ListItem = n64
export const dark_green_alt1_ListItem = n64
export const dark_blue_alt1_ListItem = n64
export const dark_purple_alt1_ListItem = n64
export const dark_pink_alt1_ListItem = n64
export const dark_red_alt1_ListItem = n64
const n65 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 120],[19, 119],[20, 120],[21, 119],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116]])

export const dark_alt1_Card = n65
export const dark_alt1_DrawerFrame = n65
export const dark_alt1_Progress = n65
export const dark_alt1_TooltipArrow = n65
export const dark_orange_alt1_Card = n65
export const dark_orange_alt1_DrawerFrame = n65
export const dark_orange_alt1_Progress = n65
export const dark_orange_alt1_TooltipArrow = n65
export const dark_yellow_alt1_Card = n65
export const dark_yellow_alt1_DrawerFrame = n65
export const dark_yellow_alt1_Progress = n65
export const dark_yellow_alt1_TooltipArrow = n65
export const dark_green_alt1_Card = n65
export const dark_green_alt1_DrawerFrame = n65
export const dark_green_alt1_Progress = n65
export const dark_green_alt1_TooltipArrow = n65
export const dark_blue_alt1_Card = n65
export const dark_blue_alt1_DrawerFrame = n65
export const dark_blue_alt1_Progress = n65
export const dark_blue_alt1_TooltipArrow = n65
export const dark_purple_alt1_Card = n65
export const dark_purple_alt1_DrawerFrame = n65
export const dark_purple_alt1_Progress = n65
export const dark_purple_alt1_TooltipArrow = n65
export const dark_pink_alt1_Card = n65
export const dark_pink_alt1_DrawerFrame = n65
export const dark_pink_alt1_Progress = n65
export const dark_pink_alt1_TooltipArrow = n65
export const dark_red_alt1_Card = n65
export const dark_red_alt1_DrawerFrame = n65
export const dark_red_alt1_Progress = n65
export const dark_red_alt1_TooltipArrow = n65
const n66 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 120],[19, 119],[20, 120],[21, 119],[22, 119],[23, 213],[24, 213],[25, 116],[26, 117],[27, 115]])

export const dark_alt1_Button = n66
export const dark_orange_alt1_Button = n66
export const dark_yellow_alt1_Button = n66
export const dark_green_alt1_Button = n66
export const dark_blue_alt1_Button = n66
export const dark_purple_alt1_Button = n66
export const dark_pink_alt1_Button = n66
export const dark_red_alt1_Button = n66
const n67 = t([[12, 112],[13, 113],[14, 114],[15, 115],[16, 111],[17, 110],[18, 120],[19, 119],[20, 120],[21, 119],[22, 0],[23, 117],[24, 118],[25, 116],[26, 117],[27, 117]])

export const dark_alt1_Checkbox = n67
export const dark_alt1_RadioGroupItem = n67
export const dark_alt1_Input = n67
export const dark_alt1_TextArea = n67
export const dark_orange_alt1_Checkbox = n67
export const dark_orange_alt1_RadioGroupItem = n67
export const dark_orange_alt1_Input = n67
export const dark_orange_alt1_TextArea = n67
export const dark_yellow_alt1_Checkbox = n67
export const dark_yellow_alt1_RadioGroupItem = n67
export const dark_yellow_alt1_Input = n67
export const dark_yellow_alt1_TextArea = n67
export const dark_green_alt1_Checkbox = n67
export const dark_green_alt1_RadioGroupItem = n67
export const dark_green_alt1_Input = n67
export const dark_green_alt1_TextArea = n67
export const dark_blue_alt1_Checkbox = n67
export const dark_blue_alt1_RadioGroupItem = n67
export const dark_blue_alt1_Input = n67
export const dark_blue_alt1_TextArea = n67
export const dark_purple_alt1_Checkbox = n67
export const dark_purple_alt1_RadioGroupItem = n67
export const dark_purple_alt1_Input = n67
export const dark_purple_alt1_TextArea = n67
export const dark_pink_alt1_Checkbox = n67
export const dark_pink_alt1_RadioGroupItem = n67
export const dark_pink_alt1_Input = n67
export const dark_pink_alt1_TextArea = n67
export const dark_red_alt1_Checkbox = n67
export const dark_red_alt1_RadioGroupItem = n67
export const dark_red_alt1_Input = n67
export const dark_red_alt1_TextArea = n67
const n68 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 120],[19, 119],[20, 120],[21, 119],[22, 119],[23, 117],[24, 118],[25, 116],[26, 117],[27, 115]])

export const dark_alt1_Switch = n68
export const dark_alt1_TooltipContent = n68
export const dark_alt1_SliderTrack = n68
export const dark_orange_alt1_Switch = n68
export const dark_orange_alt1_TooltipContent = n68
export const dark_orange_alt1_SliderTrack = n68
export const dark_yellow_alt1_Switch = n68
export const dark_yellow_alt1_TooltipContent = n68
export const dark_yellow_alt1_SliderTrack = n68
export const dark_green_alt1_Switch = n68
export const dark_green_alt1_TooltipContent = n68
export const dark_green_alt1_SliderTrack = n68
export const dark_blue_alt1_Switch = n68
export const dark_blue_alt1_TooltipContent = n68
export const dark_blue_alt1_SliderTrack = n68
export const dark_purple_alt1_Switch = n68
export const dark_purple_alt1_TooltipContent = n68
export const dark_purple_alt1_SliderTrack = n68
export const dark_pink_alt1_Switch = n68
export const dark_pink_alt1_TooltipContent = n68
export const dark_pink_alt1_SliderTrack = n68
export const dark_red_alt1_Switch = n68
export const dark_red_alt1_TooltipContent = n68
export const dark_red_alt1_SliderTrack = n68
const n69 = t([[12, 0],[13, 120],[14, 119],[15, 118],[16, 0],[17, 0],[18, 111],[19, 112],[20, 111],[21, 112],[22, 110],[23, 118],[24, 117],[25, 119],[26, 118],[27, 112]])

export const dark_alt1_SwitchThumb = n69
export const dark_orange_alt1_SwitchThumb = n69
export const dark_yellow_alt1_SwitchThumb = n69
export const dark_green_alt1_SwitchThumb = n69
export const dark_blue_alt1_SwitchThumb = n69
export const dark_purple_alt1_SwitchThumb = n69
export const dark_pink_alt1_SwitchThumb = n69
export const dark_red_alt1_SwitchThumb = n69
const n70 = t([[12, 117],[13, 116],[14, 115],[15, 114],[16, 118],[17, 119],[18, 111],[19, 112],[20, 111],[21, 112],[22, 112],[23, 114],[24, 113],[25, 115],[26, 114],[27, 116]])

export const dark_alt1_SliderTrackActive = n70
export const dark_orange_alt1_SliderTrackActive = n70
export const dark_yellow_alt1_SliderTrackActive = n70
export const dark_green_alt1_SliderTrackActive = n70
export const dark_blue_alt1_SliderTrackActive = n70
export const dark_purple_alt1_SliderTrackActive = n70
export const dark_pink_alt1_SliderTrackActive = n70
export const dark_red_alt1_SliderTrackActive = n70
const n71 = t([[12, 119],[13, 118],[14, 117],[15, 116],[16, 120],[17, 0],[18, 111],[19, 112],[20, 111],[21, 112],[22, 110],[23, 116],[24, 115],[25, 117],[26, 116],[27, 114]])

export const dark_alt1_SliderThumb = n71
export const dark_alt1_Tooltip = n71
export const dark_alt1_ProgressIndicator = n71
export const dark_orange_alt1_SliderThumb = n71
export const dark_orange_alt1_Tooltip = n71
export const dark_orange_alt1_ProgressIndicator = n71
export const dark_yellow_alt1_SliderThumb = n71
export const dark_yellow_alt1_Tooltip = n71
export const dark_yellow_alt1_ProgressIndicator = n71
export const dark_green_alt1_SliderThumb = n71
export const dark_green_alt1_Tooltip = n71
export const dark_green_alt1_ProgressIndicator = n71
export const dark_blue_alt1_SliderThumb = n71
export const dark_blue_alt1_Tooltip = n71
export const dark_blue_alt1_ProgressIndicator = n71
export const dark_purple_alt1_SliderThumb = n71
export const dark_purple_alt1_Tooltip = n71
export const dark_purple_alt1_ProgressIndicator = n71
export const dark_pink_alt1_SliderThumb = n71
export const dark_pink_alt1_Tooltip = n71
export const dark_pink_alt1_ProgressIndicator = n71
export const dark_red_alt1_SliderThumb = n71
export const dark_red_alt1_Tooltip = n71
export const dark_red_alt1_ProgressIndicator = n71
const n72 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 116],[24, 117],[25, 115],[26, 116],[27, 116]])

export const dark_alt2_ListItem = n72
export const dark_orange_alt2_ListItem = n72
export const dark_yellow_alt2_ListItem = n72
export const dark_green_alt2_ListItem = n72
export const dark_blue_alt2_ListItem = n72
export const dark_purple_alt2_ListItem = n72
export const dark_pink_alt2_ListItem = n72
export const dark_red_alt2_ListItem = n72
const n73 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[18, 119],[19, 118],[20, 119],[21, 118],[22, 119],[23, 117],[24, 118],[25, 116],[26, 117],[27, 115]])

export const dark_alt2_Card = n73
export const dark_alt2_DrawerFrame = n73
export const dark_alt2_Progress = n73
export const dark_alt2_TooltipArrow = n73
export const dark_orange_alt2_Card = n73
export const dark_orange_alt2_DrawerFrame = n73
export const dark_orange_alt2_Progress = n73
export const dark_orange_alt2_TooltipArrow = n73
export const dark_yellow_alt2_Card = n73
export const dark_yellow_alt2_DrawerFrame = n73
export const dark_yellow_alt2_Progress = n73
export const dark_yellow_alt2_TooltipArrow = n73
export const dark_green_alt2_Card = n73
export const dark_green_alt2_DrawerFrame = n73
export const dark_green_alt2_Progress = n73
export const dark_green_alt2_TooltipArrow = n73
export const dark_blue_alt2_Card = n73
export const dark_blue_alt2_DrawerFrame = n73
export const dark_blue_alt2_Progress = n73
export const dark_blue_alt2_TooltipArrow = n73
export const dark_purple_alt2_Card = n73
export const dark_purple_alt2_DrawerFrame = n73
export const dark_purple_alt2_Progress = n73
export const dark_purple_alt2_TooltipArrow = n73
export const dark_pink_alt2_Card = n73
export const dark_pink_alt2_DrawerFrame = n73
export const dark_pink_alt2_Progress = n73
export const dark_pink_alt2_TooltipArrow = n73
export const dark_red_alt2_Card = n73
export const dark_red_alt2_DrawerFrame = n73
export const dark_red_alt2_Progress = n73
export const dark_red_alt2_TooltipArrow = n73
const n74 = t([[12, 115],[13, 116],[14, 117],[15, 118],[16, 114],[17, 113],[18, 119],[19, 118],[20, 119],[21, 118],[22, 118],[23, 213],[24, 213],[25, 117],[26, 118],[27, 114]])

export const dark_alt2_Button = n74
export const dark_orange_alt2_Button = n74
export const dark_yellow_alt2_Button = n74
export const dark_green_alt2_Button = n74
export const dark_blue_alt2_Button = n74
export const dark_purple_alt2_Button = n74
export const dark_pink_alt2_Button = n74
export const dark_red_alt2_Button = n74
const n75 = t([[12, 113],[13, 114],[14, 115],[15, 116],[16, 112],[17, 111],[18, 119],[19, 118],[20, 119],[21, 118],[22, 120],[23, 118],[24, 119],[25, 117],[26, 118],[27, 116]])

export const dark_alt2_Checkbox = n75
export const dark_alt2_RadioGroupItem = n75
export const dark_alt2_Input = n75
export const dark_alt2_TextArea = n75
export const dark_orange_alt2_Checkbox = n75
export const dark_orange_alt2_RadioGroupItem = n75
export const dark_orange_alt2_Input = n75
export const dark_orange_alt2_TextArea = n75
export const dark_yellow_alt2_Checkbox = n75
export const dark_yellow_alt2_RadioGroupItem = n75
export const dark_yellow_alt2_Input = n75
export const dark_yellow_alt2_TextArea = n75
export const dark_green_alt2_Checkbox = n75
export const dark_green_alt2_RadioGroupItem = n75
export const dark_green_alt2_Input = n75
export const dark_green_alt2_TextArea = n75
export const dark_blue_alt2_Checkbox = n75
export const dark_blue_alt2_RadioGroupItem = n75
export const dark_blue_alt2_Input = n75
export const dark_blue_alt2_TextArea = n75
export const dark_purple_alt2_Checkbox = n75
export const dark_purple_alt2_RadioGroupItem = n75
export const dark_purple_alt2_Input = n75
export const dark_purple_alt2_TextArea = n75
export const dark_pink_alt2_Checkbox = n75
export const dark_pink_alt2_RadioGroupItem = n75
export const dark_pink_alt2_Input = n75
export const dark_pink_alt2_TextArea = n75
export const dark_red_alt2_Checkbox = n75
export const dark_red_alt2_RadioGroupItem = n75
export const dark_red_alt2_Input = n75
export const dark_red_alt2_TextArea = n75
const n76 = t([[12, 115],[13, 116],[14, 117],[15, 118],[16, 114],[17, 113],[18, 119],[19, 118],[20, 119],[21, 118],[22, 118],[23, 118],[24, 119],[25, 117],[26, 118],[27, 114]])

export const dark_alt2_Switch = n76
export const dark_alt2_TooltipContent = n76
export const dark_alt2_SliderTrack = n76
export const dark_orange_alt2_Switch = n76
export const dark_orange_alt2_TooltipContent = n76
export const dark_orange_alt2_SliderTrack = n76
export const dark_yellow_alt2_Switch = n76
export const dark_yellow_alt2_TooltipContent = n76
export const dark_yellow_alt2_SliderTrack = n76
export const dark_green_alt2_Switch = n76
export const dark_green_alt2_TooltipContent = n76
export const dark_green_alt2_SliderTrack = n76
export const dark_blue_alt2_Switch = n76
export const dark_blue_alt2_TooltipContent = n76
export const dark_blue_alt2_SliderTrack = n76
export const dark_purple_alt2_Switch = n76
export const dark_purple_alt2_TooltipContent = n76
export const dark_purple_alt2_SliderTrack = n76
export const dark_pink_alt2_Switch = n76
export const dark_pink_alt2_TooltipContent = n76
export const dark_pink_alt2_SliderTrack = n76
export const dark_red_alt2_Switch = n76
export const dark_red_alt2_TooltipContent = n76
export const dark_red_alt2_SliderTrack = n76
const n77 = t([[12, 120],[13, 119],[14, 118],[15, 117],[16, 0],[17, 0],[18, 112],[19, 113],[20, 112],[21, 113],[22, 110],[23, 117],[24, 116],[25, 118],[26, 117],[27, 113]])

export const dark_alt2_SwitchThumb = n77
export const dark_orange_alt2_SwitchThumb = n77
export const dark_yellow_alt2_SwitchThumb = n77
export const dark_green_alt2_SwitchThumb = n77
export const dark_blue_alt2_SwitchThumb = n77
export const dark_purple_alt2_SwitchThumb = n77
export const dark_pink_alt2_SwitchThumb = n77
export const dark_red_alt2_SwitchThumb = n77
const n78 = t([[12, 116],[13, 115],[14, 114],[15, 113],[16, 117],[17, 118],[18, 112],[19, 113],[20, 112],[21, 113],[22, 113],[23, 113],[24, 112],[25, 114],[26, 113],[27, 117]])

export const dark_alt2_SliderTrackActive = n78
export const dark_orange_alt2_SliderTrackActive = n78
export const dark_yellow_alt2_SliderTrackActive = n78
export const dark_green_alt2_SliderTrackActive = n78
export const dark_blue_alt2_SliderTrackActive = n78
export const dark_purple_alt2_SliderTrackActive = n78
export const dark_pink_alt2_SliderTrackActive = n78
export const dark_red_alt2_SliderTrackActive = n78
const n79 = t([[12, 118],[13, 117],[14, 116],[15, 115],[16, 119],[17, 120],[18, 112],[19, 113],[20, 112],[21, 113],[22, 111],[23, 115],[24, 114],[25, 116],[26, 115],[27, 115]])

export const dark_alt2_SliderThumb = n79
export const dark_alt2_Tooltip = n79
export const dark_alt2_ProgressIndicator = n79
export const dark_orange_alt2_SliderThumb = n79
export const dark_orange_alt2_Tooltip = n79
export const dark_orange_alt2_ProgressIndicator = n79
export const dark_yellow_alt2_SliderThumb = n79
export const dark_yellow_alt2_Tooltip = n79
export const dark_yellow_alt2_ProgressIndicator = n79
export const dark_green_alt2_SliderThumb = n79
export const dark_green_alt2_Tooltip = n79
export const dark_green_alt2_ProgressIndicator = n79
export const dark_blue_alt2_SliderThumb = n79
export const dark_blue_alt2_Tooltip = n79
export const dark_blue_alt2_ProgressIndicator = n79
export const dark_purple_alt2_SliderThumb = n79
export const dark_purple_alt2_Tooltip = n79
export const dark_purple_alt2_ProgressIndicator = n79
export const dark_pink_alt2_SliderThumb = n79
export const dark_pink_alt2_Tooltip = n79
export const dark_pink_alt2_ProgressIndicator = n79
export const dark_red_alt2_SliderThumb = n79
export const dark_red_alt2_Tooltip = n79
export const dark_red_alt2_ProgressIndicator = n79
const n80 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 117],[24, 118],[25, 116],[26, 117],[27, 115]])

export const dark_active_ListItem = n80
export const dark_orange_active_ListItem = n80
export const dark_yellow_active_ListItem = n80
export const dark_green_active_ListItem = n80
export const dark_blue_active_ListItem = n80
export const dark_purple_active_ListItem = n80
export const dark_pink_active_ListItem = n80
export const dark_red_active_ListItem = n80
const n81 = t([[12, 115],[13, 116],[14, 117],[15, 118],[16, 114],[17, 113],[19, 117],[20, 118],[21, 117],[22, 118],[23, 118],[24, 119],[25, 117],[26, 118],[27, 114]])

export const dark_active_Card = n81
export const dark_active_DrawerFrame = n81
export const dark_active_Progress = n81
export const dark_active_TooltipArrow = n81
export const dark_orange_active_Card = n81
export const dark_orange_active_DrawerFrame = n81
export const dark_orange_active_Progress = n81
export const dark_orange_active_TooltipArrow = n81
export const dark_yellow_active_Card = n81
export const dark_yellow_active_DrawerFrame = n81
export const dark_yellow_active_Progress = n81
export const dark_yellow_active_TooltipArrow = n81
export const dark_green_active_Card = n81
export const dark_green_active_DrawerFrame = n81
export const dark_green_active_Progress = n81
export const dark_green_active_TooltipArrow = n81
export const dark_blue_active_Card = n81
export const dark_blue_active_DrawerFrame = n81
export const dark_blue_active_Progress = n81
export const dark_blue_active_TooltipArrow = n81
export const dark_purple_active_Card = n81
export const dark_purple_active_DrawerFrame = n81
export const dark_purple_active_Progress = n81
export const dark_purple_active_TooltipArrow = n81
export const dark_pink_active_Card = n81
export const dark_pink_active_DrawerFrame = n81
export const dark_pink_active_Progress = n81
export const dark_pink_active_TooltipArrow = n81
export const dark_red_active_Card = n81
export const dark_red_active_DrawerFrame = n81
export const dark_red_active_Progress = n81
export const dark_red_active_TooltipArrow = n81
const n82 = t([[12, 116],[13, 117],[14, 118],[15, 119],[16, 115],[17, 114],[19, 117],[20, 118],[21, 117],[22, 117],[23, 213],[24, 213],[25, 118],[26, 119],[27, 113]])

export const dark_active_Button = n82
export const dark_orange_active_Button = n82
export const dark_yellow_active_Button = n82
export const dark_green_active_Button = n82
export const dark_blue_active_Button = n82
export const dark_purple_active_Button = n82
export const dark_pink_active_Button = n82
export const dark_red_active_Button = n82
const n83 = t([[12, 114],[13, 115],[14, 116],[15, 117],[16, 113],[17, 112],[19, 117],[20, 118],[21, 117],[22, 119],[23, 119],[24, 120],[25, 118],[26, 119],[27, 115]])

export const dark_active_Checkbox = n83
export const dark_active_RadioGroupItem = n83
export const dark_active_Input = n83
export const dark_active_TextArea = n83
export const dark_orange_active_Checkbox = n83
export const dark_orange_active_RadioGroupItem = n83
export const dark_orange_active_Input = n83
export const dark_orange_active_TextArea = n83
export const dark_yellow_active_Checkbox = n83
export const dark_yellow_active_RadioGroupItem = n83
export const dark_yellow_active_Input = n83
export const dark_yellow_active_TextArea = n83
export const dark_green_active_Checkbox = n83
export const dark_green_active_RadioGroupItem = n83
export const dark_green_active_Input = n83
export const dark_green_active_TextArea = n83
export const dark_blue_active_Checkbox = n83
export const dark_blue_active_RadioGroupItem = n83
export const dark_blue_active_Input = n83
export const dark_blue_active_TextArea = n83
export const dark_purple_active_Checkbox = n83
export const dark_purple_active_RadioGroupItem = n83
export const dark_purple_active_Input = n83
export const dark_purple_active_TextArea = n83
export const dark_pink_active_Checkbox = n83
export const dark_pink_active_RadioGroupItem = n83
export const dark_pink_active_Input = n83
export const dark_pink_active_TextArea = n83
export const dark_red_active_Checkbox = n83
export const dark_red_active_RadioGroupItem = n83
export const dark_red_active_Input = n83
export const dark_red_active_TextArea = n83
const n84 = t([[12, 116],[13, 117],[14, 118],[15, 119],[16, 115],[17, 114],[19, 117],[20, 118],[21, 117],[22, 117],[23, 119],[24, 120],[25, 118],[26, 119],[27, 113]])

export const dark_active_Switch = n84
export const dark_active_TooltipContent = n84
export const dark_active_SliderTrack = n84
export const dark_orange_active_Switch = n84
export const dark_orange_active_TooltipContent = n84
export const dark_orange_active_SliderTrack = n84
export const dark_yellow_active_Switch = n84
export const dark_yellow_active_TooltipContent = n84
export const dark_yellow_active_SliderTrack = n84
export const dark_green_active_Switch = n84
export const dark_green_active_TooltipContent = n84
export const dark_green_active_SliderTrack = n84
export const dark_blue_active_Switch = n84
export const dark_blue_active_TooltipContent = n84
export const dark_blue_active_SliderTrack = n84
export const dark_purple_active_Switch = n84
export const dark_purple_active_TooltipContent = n84
export const dark_purple_active_SliderTrack = n84
export const dark_pink_active_Switch = n84
export const dark_pink_active_TooltipContent = n84
export const dark_pink_active_SliderTrack = n84
export const dark_red_active_Switch = n84
export const dark_red_active_TooltipContent = n84
export const dark_red_active_SliderTrack = n84
const n85 = t([[12, 119],[13, 118],[14, 117],[15, 116],[16, 120],[17, 0],[19, 114],[20, 113],[21, 114],[22, 110],[23, 116],[24, 115],[25, 117],[26, 116],[27, 114]])

export const dark_active_SwitchThumb = n85
export const dark_orange_active_SwitchThumb = n85
export const dark_yellow_active_SwitchThumb = n85
export const dark_green_active_SwitchThumb = n85
export const dark_blue_active_SwitchThumb = n85
export const dark_purple_active_SwitchThumb = n85
export const dark_pink_active_SwitchThumb = n85
export const dark_red_active_SwitchThumb = n85
const n86 = t([[12, 115],[13, 114],[14, 113],[15, 112],[16, 116],[17, 117],[19, 114],[20, 113],[21, 114],[22, 114],[23, 112],[24, 111],[25, 113],[26, 112],[27, 118]])

export const dark_active_SliderTrackActive = n86
export const dark_orange_active_SliderTrackActive = n86
export const dark_yellow_active_SliderTrackActive = n86
export const dark_green_active_SliderTrackActive = n86
export const dark_blue_active_SliderTrackActive = n86
export const dark_purple_active_SliderTrackActive = n86
export const dark_pink_active_SliderTrackActive = n86
export const dark_red_active_SliderTrackActive = n86
const n87 = t([[12, 117],[13, 116],[14, 115],[15, 114],[16, 118],[17, 119],[19, 114],[20, 113],[21, 114],[22, 112],[23, 114],[24, 113],[25, 115],[26, 114],[27, 116]])

export const dark_active_SliderThumb = n87
export const dark_active_Tooltip = n87
export const dark_active_ProgressIndicator = n87
export const dark_orange_active_SliderThumb = n87
export const dark_orange_active_Tooltip = n87
export const dark_orange_active_ProgressIndicator = n87
export const dark_yellow_active_SliderThumb = n87
export const dark_yellow_active_Tooltip = n87
export const dark_yellow_active_ProgressIndicator = n87
export const dark_green_active_SliderThumb = n87
export const dark_green_active_Tooltip = n87
export const dark_green_active_ProgressIndicator = n87
export const dark_blue_active_SliderThumb = n87
export const dark_blue_active_Tooltip = n87
export const dark_blue_active_ProgressIndicator = n87
export const dark_purple_active_SliderThumb = n87
export const dark_purple_active_Tooltip = n87
export const dark_purple_active_ProgressIndicator = n87
export const dark_pink_active_SliderThumb = n87
export const dark_pink_active_Tooltip = n87
export const dark_pink_active_ProgressIndicator = n87
export const dark_red_active_SliderThumb = n87
export const dark_red_active_Tooltip = n87
export const dark_red_active_ProgressIndicator = n87
const n88 = t([[12, 1],[13, 2],[14, 3],[15, 4],[16, 0],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 3],[24, 4],[25, 3],[26, 3],[27, 8]])

export const light_orange_alt1_ListItem = n88
export const light_yellow_alt1_ListItem = n88
export const light_green_alt1_ListItem = n88
export const light_blue_alt1_ListItem = n88
export const light_purple_alt1_ListItem = n88
export const light_pink_alt1_ListItem = n88
export const light_red_alt1_ListItem = n88
const n89 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 10],[19, 9],[20, 10],[21, 9],[22, 10],[23, 5],[24, 6],[25, 5],[26, 5],[27, 6]])

export const light_orange_alt1_Card = n89
export const light_orange_alt1_DrawerFrame = n89
export const light_orange_alt1_Progress = n89
export const light_orange_alt1_TooltipArrow = n89
export const light_yellow_alt1_Card = n89
export const light_yellow_alt1_DrawerFrame = n89
export const light_yellow_alt1_Progress = n89
export const light_yellow_alt1_TooltipArrow = n89
export const light_green_alt1_Card = n89
export const light_green_alt1_DrawerFrame = n89
export const light_green_alt1_Progress = n89
export const light_green_alt1_TooltipArrow = n89
export const light_blue_alt1_Card = n89
export const light_blue_alt1_DrawerFrame = n89
export const light_blue_alt1_Progress = n89
export const light_blue_alt1_TooltipArrow = n89
export const light_purple_alt1_Card = n89
export const light_purple_alt1_DrawerFrame = n89
export const light_purple_alt1_Progress = n89
export const light_purple_alt1_TooltipArrow = n89
export const light_pink_alt1_Card = n89
export const light_pink_alt1_DrawerFrame = n89
export const light_pink_alt1_Progress = n89
export const light_pink_alt1_TooltipArrow = n89
export const light_red_alt1_Card = n89
export const light_red_alt1_DrawerFrame = n89
export const light_red_alt1_Progress = n89
export const light_red_alt1_TooltipArrow = n89
const n90 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 10],[19, 9],[20, 10],[21, 9],[22, 9],[23, 213],[24, 213],[25, 6],[26, 6],[27, 5]])

export const light_orange_alt1_Button = n90
export const light_yellow_alt1_Button = n90
export const light_green_alt1_Button = n90
export const light_blue_alt1_Button = n90
export const light_purple_alt1_Button = n90
export const light_pink_alt1_Button = n90
export const light_red_alt1_Button = n90
const n91 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 10],[19, 9],[20, 10],[21, 9],[22, 11],[23, 6],[24, 7],[25, 6],[26, 6],[27, 7]])

export const light_orange_alt1_Checkbox = n91
export const light_orange_alt1_RadioGroupItem = n91
export const light_orange_alt1_Input = n91
export const light_orange_alt1_TextArea = n91
export const light_yellow_alt1_Checkbox = n91
export const light_yellow_alt1_RadioGroupItem = n91
export const light_yellow_alt1_Input = n91
export const light_yellow_alt1_TextArea = n91
export const light_green_alt1_Checkbox = n91
export const light_green_alt1_RadioGroupItem = n91
export const light_green_alt1_Input = n91
export const light_green_alt1_TextArea = n91
export const light_blue_alt1_Checkbox = n91
export const light_blue_alt1_RadioGroupItem = n91
export const light_blue_alt1_Input = n91
export const light_blue_alt1_TextArea = n91
export const light_purple_alt1_Checkbox = n91
export const light_purple_alt1_RadioGroupItem = n91
export const light_purple_alt1_Input = n91
export const light_purple_alt1_TextArea = n91
export const light_pink_alt1_Checkbox = n91
export const light_pink_alt1_RadioGroupItem = n91
export const light_pink_alt1_Input = n91
export const light_pink_alt1_TextArea = n91
export const light_red_alt1_Checkbox = n91
export const light_red_alt1_RadioGroupItem = n91
export const light_red_alt1_Input = n91
export const light_red_alt1_TextArea = n91
const n92 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 10],[19, 9],[20, 10],[21, 9],[22, 9],[23, 6],[24, 7],[25, 6],[26, 6],[27, 5]])

export const light_orange_alt1_Switch = n92
export const light_orange_alt1_TooltipContent = n92
export const light_orange_alt1_SliderTrack = n92
export const light_yellow_alt1_Switch = n92
export const light_yellow_alt1_TooltipContent = n92
export const light_yellow_alt1_SliderTrack = n92
export const light_green_alt1_Switch = n92
export const light_green_alt1_TooltipContent = n92
export const light_green_alt1_SliderTrack = n92
export const light_blue_alt1_Switch = n92
export const light_blue_alt1_TooltipContent = n92
export const light_blue_alt1_SliderTrack = n92
export const light_purple_alt1_Switch = n92
export const light_purple_alt1_TooltipContent = n92
export const light_purple_alt1_SliderTrack = n92
export const light_pink_alt1_Switch = n92
export const light_pink_alt1_TooltipContent = n92
export const light_pink_alt1_SliderTrack = n92
export const light_red_alt1_Switch = n92
export const light_red_alt1_TooltipContent = n92
export const light_red_alt1_SliderTrack = n92
const n93 = t([[12, 11],[13, 10],[14, 9],[15, 8],[16, 11],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 9],[24, 8],[25, 9],[26, 9],[27, 2]])

export const light_orange_alt1_SwitchThumb = n93
export const light_yellow_alt1_SwitchThumb = n93
export const light_green_alt1_SwitchThumb = n93
export const light_blue_alt1_SwitchThumb = n93
export const light_purple_alt1_SwitchThumb = n93
export const light_pink_alt1_SwitchThumb = n93
export const light_red_alt1_SwitchThumb = n93
const n94 = t([[12, 7],[13, 6],[14, 5],[15, 4],[16, 8],[17, 9],[18, 1],[19, 2],[20, 1],[21, 2],[22, 2],[23, 5],[24, 4],[25, 5],[26, 5],[27, 6]])

export const light_orange_alt1_SliderTrackActive = n94
export const light_yellow_alt1_SliderTrackActive = n94
export const light_green_alt1_SliderTrackActive = n94
export const light_blue_alt1_SliderTrackActive = n94
export const light_purple_alt1_SliderTrackActive = n94
export const light_pink_alt1_SliderTrackActive = n94
export const light_red_alt1_SliderTrackActive = n94
const n95 = t([[12, 9],[13, 8],[14, 7],[15, 6],[16, 10],[17, 11],[18, 1],[19, 2],[20, 1],[21, 2],[22, 0],[23, 7],[24, 6],[25, 7],[26, 7],[27, 4]])

export const light_orange_alt1_SliderThumb = n95
export const light_orange_alt1_Tooltip = n95
export const light_orange_alt1_ProgressIndicator = n95
export const light_yellow_alt1_SliderThumb = n95
export const light_yellow_alt1_Tooltip = n95
export const light_yellow_alt1_ProgressIndicator = n95
export const light_green_alt1_SliderThumb = n95
export const light_green_alt1_Tooltip = n95
export const light_green_alt1_ProgressIndicator = n95
export const light_blue_alt1_SliderThumb = n95
export const light_blue_alt1_Tooltip = n95
export const light_blue_alt1_ProgressIndicator = n95
export const light_purple_alt1_SliderThumb = n95
export const light_purple_alt1_Tooltip = n95
export const light_purple_alt1_ProgressIndicator = n95
export const light_pink_alt1_SliderThumb = n95
export const light_pink_alt1_Tooltip = n95
export const light_pink_alt1_ProgressIndicator = n95
export const light_red_alt1_SliderThumb = n95
export const light_red_alt1_Tooltip = n95
export const light_red_alt1_ProgressIndicator = n95
const n96 = t([[12, 2],[13, 3],[14, 4],[15, 5],[16, 1],[17, 0],[18, 9],[19, 8],[20, 9],[21, 8],[22, 11],[23, 4],[24, 5],[25, 4],[26, 4],[27, 7]])

export const light_orange_alt2_ListItem = n96
export const light_yellow_alt2_ListItem = n96
export const light_green_alt2_ListItem = n96
export const light_blue_alt2_ListItem = n96
export const light_purple_alt2_ListItem = n96
export const light_pink_alt2_ListItem = n96
export const light_red_alt2_ListItem = n96
const n97 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[18, 9],[19, 8],[20, 9],[21, 8],[22, 9],[23, 6],[24, 7],[25, 6],[26, 6],[27, 5]])

export const light_orange_alt2_Card = n97
export const light_orange_alt2_DrawerFrame = n97
export const light_orange_alt2_Progress = n97
export const light_orange_alt2_TooltipArrow = n97
export const light_yellow_alt2_Card = n97
export const light_yellow_alt2_DrawerFrame = n97
export const light_yellow_alt2_Progress = n97
export const light_yellow_alt2_TooltipArrow = n97
export const light_green_alt2_Card = n97
export const light_green_alt2_DrawerFrame = n97
export const light_green_alt2_Progress = n97
export const light_green_alt2_TooltipArrow = n97
export const light_blue_alt2_Card = n97
export const light_blue_alt2_DrawerFrame = n97
export const light_blue_alt2_Progress = n97
export const light_blue_alt2_TooltipArrow = n97
export const light_purple_alt2_Card = n97
export const light_purple_alt2_DrawerFrame = n97
export const light_purple_alt2_Progress = n97
export const light_purple_alt2_TooltipArrow = n97
export const light_pink_alt2_Card = n97
export const light_pink_alt2_DrawerFrame = n97
export const light_pink_alt2_Progress = n97
export const light_pink_alt2_TooltipArrow = n97
export const light_red_alt2_Card = n97
export const light_red_alt2_DrawerFrame = n97
export const light_red_alt2_Progress = n97
export const light_red_alt2_TooltipArrow = n97
const n98 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[18, 9],[19, 8],[20, 9],[21, 8],[22, 8],[23, 213],[24, 213],[25, 7],[26, 7],[27, 4]])

export const light_orange_alt2_Button = n98
export const light_yellow_alt2_Button = n98
export const light_green_alt2_Button = n98
export const light_blue_alt2_Button = n98
export const light_purple_alt2_Button = n98
export const light_pink_alt2_Button = n98
export const light_red_alt2_Button = n98
const n99 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[18, 9],[19, 8],[20, 9],[21, 8],[22, 10],[23, 7],[24, 8],[25, 7],[26, 7],[27, 6]])

export const light_orange_alt2_Checkbox = n99
export const light_orange_alt2_RadioGroupItem = n99
export const light_orange_alt2_Input = n99
export const light_orange_alt2_TextArea = n99
export const light_yellow_alt2_Checkbox = n99
export const light_yellow_alt2_RadioGroupItem = n99
export const light_yellow_alt2_Input = n99
export const light_yellow_alt2_TextArea = n99
export const light_green_alt2_Checkbox = n99
export const light_green_alt2_RadioGroupItem = n99
export const light_green_alt2_Input = n99
export const light_green_alt2_TextArea = n99
export const light_blue_alt2_Checkbox = n99
export const light_blue_alt2_RadioGroupItem = n99
export const light_blue_alt2_Input = n99
export const light_blue_alt2_TextArea = n99
export const light_purple_alt2_Checkbox = n99
export const light_purple_alt2_RadioGroupItem = n99
export const light_purple_alt2_Input = n99
export const light_purple_alt2_TextArea = n99
export const light_pink_alt2_Checkbox = n99
export const light_pink_alt2_RadioGroupItem = n99
export const light_pink_alt2_Input = n99
export const light_pink_alt2_TextArea = n99
export const light_red_alt2_Checkbox = n99
export const light_red_alt2_RadioGroupItem = n99
export const light_red_alt2_Input = n99
export const light_red_alt2_TextArea = n99
const n100 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[18, 9],[19, 8],[20, 9],[21, 8],[22, 8],[23, 7],[24, 8],[25, 7],[26, 7],[27, 4]])

export const light_orange_alt2_Switch = n100
export const light_orange_alt2_TooltipContent = n100
export const light_orange_alt2_SliderTrack = n100
export const light_yellow_alt2_Switch = n100
export const light_yellow_alt2_TooltipContent = n100
export const light_yellow_alt2_SliderTrack = n100
export const light_green_alt2_Switch = n100
export const light_green_alt2_TooltipContent = n100
export const light_green_alt2_SliderTrack = n100
export const light_blue_alt2_Switch = n100
export const light_blue_alt2_TooltipContent = n100
export const light_blue_alt2_SliderTrack = n100
export const light_purple_alt2_Switch = n100
export const light_purple_alt2_TooltipContent = n100
export const light_purple_alt2_SliderTrack = n100
export const light_pink_alt2_Switch = n100
export const light_pink_alt2_TooltipContent = n100
export const light_pink_alt2_SliderTrack = n100
export const light_red_alt2_Switch = n100
export const light_red_alt2_TooltipContent = n100
export const light_red_alt2_SliderTrack = n100
const n101 = t([[12, 10],[13, 9],[14, 8],[15, 7],[16, 11],[17, 11],[18, 2],[19, 3],[20, 2],[21, 3],[22, 0],[23, 8],[24, 7],[25, 8],[26, 8],[27, 3]])

export const light_orange_alt2_SwitchThumb = n101
export const light_yellow_alt2_SwitchThumb = n101
export const light_green_alt2_SwitchThumb = n101
export const light_blue_alt2_SwitchThumb = n101
export const light_purple_alt2_SwitchThumb = n101
export const light_pink_alt2_SwitchThumb = n101
export const light_red_alt2_SwitchThumb = n101
const n102 = t([[12, 6],[13, 5],[14, 4],[15, 3],[16, 7],[17, 8],[18, 2],[19, 3],[20, 2],[21, 3],[22, 3],[23, 4],[24, 3],[25, 4],[26, 4],[27, 7]])

export const light_orange_alt2_SliderTrackActive = n102
export const light_yellow_alt2_SliderTrackActive = n102
export const light_green_alt2_SliderTrackActive = n102
export const light_blue_alt2_SliderTrackActive = n102
export const light_purple_alt2_SliderTrackActive = n102
export const light_pink_alt2_SliderTrackActive = n102
export const light_red_alt2_SliderTrackActive = n102
const n103 = t([[12, 8],[13, 7],[14, 6],[15, 5],[16, 9],[17, 10],[18, 2],[19, 3],[20, 2],[21, 3],[22, 1],[23, 6],[24, 5],[25, 6],[26, 6],[27, 5]])

export const light_orange_alt2_SliderThumb = n103
export const light_orange_alt2_Tooltip = n103
export const light_orange_alt2_ProgressIndicator = n103
export const light_yellow_alt2_SliderThumb = n103
export const light_yellow_alt2_Tooltip = n103
export const light_yellow_alt2_ProgressIndicator = n103
export const light_green_alt2_SliderThumb = n103
export const light_green_alt2_Tooltip = n103
export const light_green_alt2_ProgressIndicator = n103
export const light_blue_alt2_SliderThumb = n103
export const light_blue_alt2_Tooltip = n103
export const light_blue_alt2_ProgressIndicator = n103
export const light_purple_alt2_SliderThumb = n103
export const light_purple_alt2_Tooltip = n103
export const light_purple_alt2_ProgressIndicator = n103
export const light_pink_alt2_SliderThumb = n103
export const light_pink_alt2_Tooltip = n103
export const light_pink_alt2_ProgressIndicator = n103
export const light_red_alt2_SliderThumb = n103
export const light_red_alt2_Tooltip = n103
export const light_red_alt2_ProgressIndicator = n103
const n104 = t([[12, 3],[13, 4],[14, 5],[15, 6],[16, 2],[17, 1],[19, 7],[20, 8],[21, 7],[22, 10],[23, 5],[24, 6],[25, 5],[26, 5],[27, 6]])

export const light_orange_active_ListItem = n104
export const light_yellow_active_ListItem = n104
export const light_green_active_ListItem = n104
export const light_blue_active_ListItem = n104
export const light_purple_active_ListItem = n104
export const light_pink_active_ListItem = n104
export const light_red_active_ListItem = n104
const n105 = t([[12, 5],[13, 6],[14, 7],[15, 8],[16, 4],[17, 3],[19, 7],[20, 8],[21, 7],[22, 8],[23, 7],[24, 8],[25, 7],[26, 7],[27, 4]])

export const light_orange_active_Card = n105
export const light_orange_active_DrawerFrame = n105
export const light_orange_active_Progress = n105
export const light_orange_active_TooltipArrow = n105
export const light_yellow_active_Card = n105
export const light_yellow_active_DrawerFrame = n105
export const light_yellow_active_Progress = n105
export const light_yellow_active_TooltipArrow = n105
export const light_green_active_Card = n105
export const light_green_active_DrawerFrame = n105
export const light_green_active_Progress = n105
export const light_green_active_TooltipArrow = n105
export const light_blue_active_Card = n105
export const light_blue_active_DrawerFrame = n105
export const light_blue_active_Progress = n105
export const light_blue_active_TooltipArrow = n105
export const light_purple_active_Card = n105
export const light_purple_active_DrawerFrame = n105
export const light_purple_active_Progress = n105
export const light_purple_active_TooltipArrow = n105
export const light_pink_active_Card = n105
export const light_pink_active_DrawerFrame = n105
export const light_pink_active_Progress = n105
export const light_pink_active_TooltipArrow = n105
export const light_red_active_Card = n105
export const light_red_active_DrawerFrame = n105
export const light_red_active_Progress = n105
export const light_red_active_TooltipArrow = n105
const n106 = t([[12, 6],[13, 7],[14, 8],[15, 9],[16, 5],[17, 4],[19, 7],[20, 8],[21, 7],[22, 7],[23, 213],[24, 213],[25, 8],[26, 8],[27, 3]])

export const light_orange_active_Button = n106
export const light_yellow_active_Button = n106
export const light_green_active_Button = n106
export const light_blue_active_Button = n106
export const light_purple_active_Button = n106
export const light_pink_active_Button = n106
export const light_red_active_Button = n106
const n107 = t([[12, 4],[13, 5],[14, 6],[15, 7],[16, 3],[17, 2],[19, 7],[20, 8],[21, 7],[22, 9],[23, 8],[24, 9],[25, 8],[26, 8],[27, 5]])

export const light_orange_active_Checkbox = n107
export const light_orange_active_RadioGroupItem = n107
export const light_orange_active_Input = n107
export const light_orange_active_TextArea = n107
export const light_yellow_active_Checkbox = n107
export const light_yellow_active_RadioGroupItem = n107
export const light_yellow_active_Input = n107
export const light_yellow_active_TextArea = n107
export const light_green_active_Checkbox = n107
export const light_green_active_RadioGroupItem = n107
export const light_green_active_Input = n107
export const light_green_active_TextArea = n107
export const light_blue_active_Checkbox = n107
export const light_blue_active_RadioGroupItem = n107
export const light_blue_active_Input = n107
export const light_blue_active_TextArea = n107
export const light_purple_active_Checkbox = n107
export const light_purple_active_RadioGroupItem = n107
export const light_purple_active_Input = n107
export const light_purple_active_TextArea = n107
export const light_pink_active_Checkbox = n107
export const light_pink_active_RadioGroupItem = n107
export const light_pink_active_Input = n107
export const light_pink_active_TextArea = n107
export const light_red_active_Checkbox = n107
export const light_red_active_RadioGroupItem = n107
export const light_red_active_Input = n107
export const light_red_active_TextArea = n107
const n108 = t([[12, 6],[13, 7],[14, 8],[15, 9],[16, 5],[17, 4],[19, 7],[20, 8],[21, 7],[22, 7],[23, 8],[24, 9],[25, 8],[26, 8],[27, 3]])

export const light_orange_active_Switch = n108
export const light_orange_active_TooltipContent = n108
export const light_orange_active_SliderTrack = n108
export const light_yellow_active_Switch = n108
export const light_yellow_active_TooltipContent = n108
export const light_yellow_active_SliderTrack = n108
export const light_green_active_Switch = n108
export const light_green_active_TooltipContent = n108
export const light_green_active_SliderTrack = n108
export const light_blue_active_Switch = n108
export const light_blue_active_TooltipContent = n108
export const light_blue_active_SliderTrack = n108
export const light_purple_active_Switch = n108
export const light_purple_active_TooltipContent = n108
export const light_purple_active_SliderTrack = n108
export const light_pink_active_Switch = n108
export const light_pink_active_TooltipContent = n108
export const light_pink_active_SliderTrack = n108
export const light_red_active_Switch = n108
export const light_red_active_TooltipContent = n108
export const light_red_active_SliderTrack = n108
const n109 = t([[12, 9],[13, 8],[14, 7],[15, 6],[16, 10],[17, 11],[19, 4],[20, 3],[21, 4],[22, 0],[23, 7],[24, 6],[25, 7],[26, 7],[27, 4]])

export const light_orange_active_SwitchThumb = n109
export const light_yellow_active_SwitchThumb = n109
export const light_green_active_SwitchThumb = n109
export const light_blue_active_SwitchThumb = n109
export const light_purple_active_SwitchThumb = n109
export const light_pink_active_SwitchThumb = n109
export const light_red_active_SwitchThumb = n109
const n110 = t([[12, 5],[13, 4],[14, 3],[15, 2],[16, 6],[17, 7],[19, 4],[20, 3],[21, 4],[22, 4],[23, 3],[24, 2],[25, 3],[26, 3],[27, 8]])

export const light_orange_active_SliderTrackActive = n110
export const light_yellow_active_SliderTrackActive = n110
export const light_green_active_SliderTrackActive = n110
export const light_blue_active_SliderTrackActive = n110
export const light_purple_active_SliderTrackActive = n110
export const light_pink_active_SliderTrackActive = n110
export const light_red_active_SliderTrackActive = n110
const n111 = t([[12, 7],[13, 6],[14, 5],[15, 4],[16, 8],[17, 9],[19, 4],[20, 3],[21, 4],[22, 2],[23, 5],[24, 4],[25, 5],[26, 5],[27, 6]])

export const light_orange_active_SliderThumb = n111
export const light_orange_active_Tooltip = n111
export const light_orange_active_ProgressIndicator = n111
export const light_yellow_active_SliderThumb = n111
export const light_yellow_active_Tooltip = n111
export const light_yellow_active_ProgressIndicator = n111
export const light_green_active_SliderThumb = n111
export const light_green_active_Tooltip = n111
export const light_green_active_ProgressIndicator = n111
export const light_blue_active_SliderThumb = n111
export const light_blue_active_Tooltip = n111
export const light_blue_active_ProgressIndicator = n111
export const light_purple_active_SliderThumb = n111
export const light_purple_active_Tooltip = n111
export const light_purple_active_ProgressIndicator = n111
export const light_pink_active_SliderThumb = n111
export const light_pink_active_Tooltip = n111
export const light_pink_active_ProgressIndicator = n111
export const light_red_active_SliderThumb = n111
export const light_red_active_Tooltip = n111
export const light_red_active_ProgressIndicator = n111