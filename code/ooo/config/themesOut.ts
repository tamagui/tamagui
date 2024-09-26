type Theme = {
  accentBackground: string;
  accentColor: string;
  background0: string;
  background025: string;
  background05: string;
  background075: string;
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
  color0: string;
  color025: string;
  color05: string;
  color075: string;
  background: string;
  backgroundHover: string;
  backgroundPress: string;
  backgroundFocus: string;
  borderColor: string;
  borderColorHover: string;
  borderColorPress: string;
  borderColorFocus: string;
  color: string;
  colorHover: string;
  colorPress: string;
  colorFocus: string;
  colorTransparent: string;
  placeholderColor: string;
  outlineColor: string;
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
  yellow13: string;
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
  blue: string;
  green: string;
  red: string;
  purple: string;
  pink: string;
  blueFg: string;
  greenFg: string;
  redFg: string;
  purpleFg: string;
  pinkFg: string;
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
  'hsl(50, 89.4%, 72.1%)',
  'hsl(49, 70%, 14.3%)',
  'rgba(255,255,255,0)',
  'rgba(255,255,255,0.25)',
  'rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.75)',
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
  'rgba(10,10,10,0)',
  'rgba(10,10,10,0.25)',
  'rgba(10,10,10,0.5)',
  'rgba(10,10,10,0.75)',
  '#000',
  'hsl(60, 54.0%, 98.5%)',
  'hsl(52, 100%, 93.5%)',
  'hsl(55, 100%, 88.9%)',
  'hsl(54, 100%, 83.6%)',
  'hsl(52, 97.9%, 78.0%)',
  'hsl(47, 80.4%, 60.0%)',
  'hsl(48, 100%, 46.1%)',
  'hsl(53, 92.0%, 50.0%)',
  'hsl(50, 100%, 48.5%)',
  'hsl(42, 90%, 34.0%)',
  'hsl(40, 55.0%, 13.5%)',
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
  'hsla(210, 60%, 80%, 0.6)',
  'hsla(120, 60%, 80%, 0.7)',
  'hsla(0, 60%, 80%, 0.6)',
  'hsla(270, 60%, 80%, 0.6)',
  'hsla(330, 60%, 80%, 0.6)',
  'hsl(210, 60%, 10%)',
  'hsl(120, 60%, 10%)',
  'hsl(0, 60%, 10%)',
  'hsl(270, 60%, 10%)',
  'hsl(330, 60%, 10%)',
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
  'hsl(45, 50%, 4%)',
  'hsl(46, 60%, 6.7%)',
  'hsl(45, 70%, 8.7%)',
  'hsl(45, 70%, 10.4%)',
  'hsl(47, 70%, 12.1%)',
  'hsl(49, 90.3%, 18.4%)',
  'hsl(53, 100%, 25.0%)',
  'hsl(53, 92.0%, 40.0%)',
  'hsl(54, 100%, 60.0%)',
  'hsl(48, 100%, 80.0%)',
  'hsl(53, 100%, 91.0%)',
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
  'hsla(210, 60%, 40%, 0.7)',
  'hsla(120, 60%, 40%, 0.7)',
  'hsla(0, 60%, 40%, 0.7)',
  'hsla(270, 60%, 40%, 0.7)',
  'hsla(330, 60%, 40%, 0.7)',
  'hsl(210, 60%, 90%)',
  'hsl(120, 60%, 90%)',
  'hsl(0, 60%, 90%)',
  'hsl(270, 60%, 90%)',
  'hsl(330, 60%, 90%)',
  'rgba(0,0,0,0.3)',
  'rgba(0,0,0,0.2)',
  'hsla(60, 54.0%, 98.5%, 0)',
  'hsla(60, 54.0%, 98.5%, 0.25)',
  'hsla(60, 54.0%, 98.5%, 0.5)',
  'hsla(60, 54.0%, 98.5%, 0.75)',
  'hsla(50, 100%, 48.5%, 0)',
  'hsla(50, 100%, 48.5%, 0.25)',
  'hsla(50, 100%, 48.5%, 0.5)',
  'hsla(50, 100%, 48.5%, 0.75)',
  'hsla(45, 50%, 4%, 0)',
  'hsla(45, 50%, 4%, 0.25)',
  'hsla(45, 50%, 4%, 0.5)',
  'hsla(45, 50%, 4%, 0.75)',
  'hsla(54, 100%, 60.0%, 0)',
  'hsla(54, 100%, 60.0%, 0.25)',
  'hsla(54, 100%, 60.0%, 0.5)',
  'hsla(54, 100%, 60.0%, 0.75)',
]

const ks = [
'accentBackground',
'accentColor',
'background0',
'background025',
'background05',
'background075',
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
'color0',
'color025',
'color05',
'color075',
'background',
'backgroundHover',
'backgroundPress',
'backgroundFocus',
'borderColor',
'borderColorHover',
'borderColorPress',
'borderColorFocus',
'color',
'colorHover',
'colorPress',
'colorFocus',
'colorTransparent',
'placeholderColor',
'outlineColor',
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
'yellow13',
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
'blue',
'green',
'red',
'purple',
'pink',
'blueFg',
'greenFg',
'redFg',
'purpleFg',
'pinkFg',
'shadowColor',
'shadowColorHover',
'shadowColorPress',
'shadowColorFocus']


const n1 = t([[0, 0],[1, 1],[2, 2],[3, 3],[4, 4],[5, 5],[6, 6],[7, 7],[8, 8],[9, 9],[10, 10],[11, 11],[12, 12],[13, 13],[14, 14],[15, 15],[16, 16],[17, 17],[18, 18],[19, 19],[20, 20],[21, 21],[22, 6],[23, 5],[24, 7],[25, 7],[26, 9],[27, 8],[28, 10],[29, 9],[30, 22],[31, 17],[32, 22],[33, 17],[34, 18],[35, 15],[36, 19],[37, 23],[38, 24],[39, 25],[40, 26],[41, 27],[42, 0],[43, 28],[44, 29],[45, 30],[46, 31],[47, 32],[48, 33],[49, 22],[50, 34],[51, 35],[52, 36],[53, 37],[54, 38],[55, 39],[56, 40],[57, 41],[58, 14],[59, 42],[60, 43],[61, 17],[62, 44],[63, 45],[64, 46],[65, 47],[66, 48],[67, 49],[68, 50],[69, 51],[70, 52],[71, 53],[72, 54],[73, 54],[74, 55],[75, 55]])

export const light = n1
const n2 = t([[0, 1],[1, 0],[2, 18],[3, 19],[4, 20],[5, 21],[6, 56],[7, 57],[8, 58],[9, 59],[10, 60],[11, 61],[12, 62],[13, 63],[14, 64],[15, 65],[16, 66],[17, 6],[18, 2],[19, 3],[20, 4],[21, 5],[22, 56],[23, 57],[24, 21],[25, 21],[26, 59],[27, 60],[28, 58],[29, 59],[30, 6],[31, 6],[32, 6],[33, 6],[34, 2],[35, 65],[36, 3],[37, 67],[38, 68],[39, 69],[40, 70],[41, 71],[42, 1],[43, 72],[44, 73],[45, 74],[46, 75],[47, 76],[48, 77],[49, 6],[50, 78],[51, 79],[52, 80],[53, 81],[54, 82],[55, 83],[56, 84],[57, 85],[58, 86],[59, 87],[60, 88],[61, 37],[62, 89],[63, 90],[64, 91],[65, 92],[66, 93],[67, 94],[68, 95],[69, 96],[70, 97],[71, 98],[72, 99],[73, 99],[74, 100],[75, 100]])

export const dark = n2
const n3 = t([[0, 34],[1, 17],[2, 101],[3, 102],[4, 103],[5, 104],[6, 23],[7, 24],[8, 25],[9, 26],[10, 27],[11, 0],[12, 28],[13, 29],[14, 30],[15, 31],[16, 32],[17, 33],[18, 105],[19, 106],[20, 107],[21, 108],[22, 23],[23, 104],[24, 24],[25, 24],[26, 26],[27, 25],[28, 27],[29, 26],[30, 22],[31, 33],[32, 22],[33, 33],[34, 105],[35, 31],[36, 106]])

export const light_yellow = n3
const n4 = t([[0, 34],[1, 17],[2, 109],[3, 110],[4, 111],[5, 112],[6, 67],[7, 68],[8, 69],[9, 70],[10, 71],[11, 1],[12, 72],[13, 73],[14, 74],[15, 75],[16, 76],[17, 77],[18, 113],[19, 114],[20, 115],[21, 116],[22, 67],[23, 68],[24, 112],[25, 112],[26, 70],[27, 71],[28, 69],[29, 70],[30, 6],[31, 77],[32, 6],[33, 77],[34, 113],[35, 75],[36, 114]])

export const dark_yellow = n4
const n5 = t([[30, 17],[31, 16],[32, 17],[33, 16]])

export const light_alt1 = n5
const n6 = t([[30, 16],[31, 15],[32, 16],[33, 15]])

export const light_alt2 = n6
const n7 = t([[30, 6],[31, 66],[32, 6],[33, 66]])

export const dark_alt1 = n7
const n8 = t([[30, 66],[31, 65],[32, 66],[33, 65]])

export const dark_alt2 = n8
const n9 = t([[30, 33],[31, 32],[32, 33],[33, 32]])

export const light_yellow_alt1 = n9
const n10 = t([[30, 32],[31, 31],[32, 32],[33, 31]])

export const light_yellow_alt2 = n10
const n11 = t([[30, 77],[31, 76],[32, 77],[33, 76]])

export const dark_yellow_alt1 = n11
const n12 = t([[30, 76],[31, 75],[32, 76],[33, 75]])

export const dark_yellow_alt2 = n12