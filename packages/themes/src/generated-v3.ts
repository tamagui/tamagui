type Theme = {
  color1: string
  color2: string
  color3: string
  color4: string
  color5: string
  color6: string
  color7: string
  color8: string
  color9: string
  color10: string
  color11: string
  color12: string
  background: string
  backgroundHover: string
  backgroundPress: string
  backgroundFocus: string
  backgroundStrong: string
  backgroundTransparent: string
  color: string
  colorHover: string
  colorPress: string
  colorFocus: string
  colorTransparent: string
  borderColor: string
  borderColorHover: string
  borderColorFocus: string
  borderColorPress: string
  placeholderColor: string
  outlineColor: string
  blue1: string
  blue2: string
  blue3: string
  blue4: string
  blue5: string
  blue6: string
  blue7: string
  blue8: string
  blue9: string
  blue10: string
  blue11: string
  blue12: string
  gray1: string
  gray2: string
  gray3: string
  gray4: string
  gray5: string
  gray6: string
  gray7: string
  gray8: string
  gray9: string
  gray10: string
  gray11: string
  gray12: string
  green1: string
  green2: string
  green3: string
  green4: string
  green5: string
  green6: string
  green7: string
  green8: string
  green9: string
  green10: string
  green11: string
  green12: string
  orange1: string
  orange2: string
  orange3: string
  orange4: string
  orange5: string
  orange6: string
  orange7: string
  orange8: string
  orange9: string
  orange10: string
  orange11: string
  orange12: string
  pink1: string
  pink2: string
  pink3: string
  pink4: string
  pink5: string
  pink6: string
  pink7: string
  pink8: string
  pink9: string
  pink10: string
  pink11: string
  pink12: string
  purple1: string
  purple2: string
  purple3: string
  purple4: string
  purple5: string
  purple6: string
  purple7: string
  purple8: string
  purple9: string
  purple10: string
  purple11: string
  purple12: string
  red1: string
  red2: string
  red3: string
  red4: string
  red5: string
  red6: string
  red7: string
  red8: string
  red9: string
  red10: string
  red11: string
  red12: string
  yellow1: string
  yellow2: string
  yellow3: string
  yellow4: string
  yellow5: string
  yellow6: string
  yellow7: string
  yellow8: string
  yellow9: string
  yellow10: string
  yellow11: string
  yellow12: string
  shadowColor: string
  shadowColorHover: string
  shadowColorPress: string
  shadowColorFocus: string
}

function t(a: [number, number][]) {
  let res: Record<string, string> = {}
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
  'shadowColorFocus',
]

const n1 = t([
  [0, 0],
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 7],
  [8, 8],
  [9, 9],
  [10, 10],
  [11, 11],
  [12, 1],
  [13, 2],
  [14, 3],
  [15, 4],
  [16, 0],
  [17, 12],
  [18, 11],
  [19, 10],
  [20, 11],
  [21, 10],
  [22, 13],
  [23, 4],
  [24, 5],
  [25, 3],
  [26, 4],
  [27, 8],
  [28, 4],
  [29, 14],
  [30, 15],
  [31, 16],
  [32, 17],
  [33, 18],
  [34, 19],
  [35, 20],
  [36, 21],
  [37, 22],
  [38, 23],
  [39, 24],
  [40, 25],
  [41, 26],
  [42, 27],
  [43, 28],
  [44, 29],
  [45, 30],
  [46, 31],
  [47, 32],
  [48, 33],
  [49, 8],
  [50, 34],
  [51, 35],
  [52, 11],
  [53, 36],
  [54, 37],
  [55, 38],
  [56, 39],
  [57, 40],
  [58, 41],
  [59, 42],
  [60, 43],
  [61, 44],
  [62, 45],
  [63, 46],
  [64, 47],
  [65, 48],
  [66, 49],
  [67, 50],
  [68, 51],
  [69, 52],
  [70, 53],
  [71, 54],
  [72, 55],
  [73, 56],
  [74, 57],
  [75, 58],
  [76, 59],
  [77, 60],
  [78, 61],
  [79, 62],
  [80, 63],
  [81, 64],
  [82, 65],
  [83, 66],
  [84, 67],
  [85, 68],
  [86, 69],
  [87, 70],
  [88, 71],
  [89, 72],
  [90, 73],
  [91, 74],
  [92, 75],
  [93, 76],
  [94, 77],
  [95, 78],
  [96, 79],
  [97, 80],
  [98, 81],
  [99, 82],
  [100, 83],
  [101, 84],
  [102, 85],
  [103, 86],
  [104, 87],
  [105, 88],
  [106, 89],
  [107, 90],
  [108, 91],
  [109, 92],
  [110, 93],
  [111, 94],
  [112, 95],
  [113, 96],
  [114, 97],
  [115, 98],
  [116, 99],
  [117, 100],
  [118, 101],
  [119, 102],
  [120, 103],
  [121, 104],
  [122, 105],
  [123, 106],
  [124, 107],
  [125, 108],
  [126, 108],
  [127, 109],
  [128, 109],
])

export const light = n1
const n2 = t([
  [0, 110],
  [1, 111],
  [2, 112],
  [3, 113],
  [4, 114],
  [5, 115],
  [6, 116],
  [7, 117],
  [8, 118],
  [9, 119],
  [10, 120],
  [11, 0],
  [12, 111],
  [13, 112],
  [14, 113],
  [15, 114],
  [16, 110],
  [17, 13],
  [18, 0],
  [19, 120],
  [20, 0],
  [21, 120],
  [22, 12],
  [23, 114],
  [24, 115],
  [25, 113],
  [26, 114],
  [27, 118],
  [28, 114],
  [29, 121],
  [30, 122],
  [31, 123],
  [32, 124],
  [33, 125],
  [34, 126],
  [35, 127],
  [36, 128],
  [37, 22],
  [38, 129],
  [39, 130],
  [40, 131],
  [41, 132],
  [42, 133],
  [43, 134],
  [44, 135],
  [45, 136],
  [46, 137],
  [47, 138],
  [48, 139],
  [49, 140],
  [50, 141],
  [51, 142],
  [52, 29],
  [53, 143],
  [54, 144],
  [55, 145],
  [56, 146],
  [57, 147],
  [58, 148],
  [59, 149],
  [60, 150],
  [61, 44],
  [62, 151],
  [63, 152],
  [64, 153],
  [65, 154],
  [66, 155],
  [67, 156],
  [68, 157],
  [69, 158],
  [70, 159],
  [71, 160],
  [72, 161],
  [73, 56],
  [74, 162],
  [75, 163],
  [76, 164],
  [77, 165],
  [78, 166],
  [79, 167],
  [80, 168],
  [81, 169],
  [82, 170],
  [83, 171],
  [84, 172],
  [85, 68],
  [86, 173],
  [87, 174],
  [88, 175],
  [89, 176],
  [90, 177],
  [91, 178],
  [92, 179],
  [93, 180],
  [94, 181],
  [95, 182],
  [96, 183],
  [97, 80],
  [98, 184],
  [99, 185],
  [100, 186],
  [101, 187],
  [102, 188],
  [103, 189],
  [104, 190],
  [105, 191],
  [106, 192],
  [107, 193],
  [108, 194],
  [109, 92],
  [110, 195],
  [111, 196],
  [112, 197],
  [113, 198],
  [114, 199],
  [115, 200],
  [116, 201],
  [117, 202],
  [118, 203],
  [119, 204],
  [120, 205],
  [121, 104],
  [122, 206],
  [123, 207],
  [124, 208],
  [125, 209],
  [126, 209],
  [127, 210],
  [128, 210],
])

export const dark = n2
const n3 = t([
  [0, 0],
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 7],
  [8, 8],
  [9, 9],
  [10, 10],
  [11, 11],
  [12, 1],
  [13, 2],
  [14, 3],
  [15, 4],
  [16, 0],
  [17, 12],
  [18, 11],
  [19, 10],
  [20, 11],
  [21, 10],
  [22, 13],
  [23, 4],
  [24, 5],
  [25, 3],
  [26, 4],
  [27, 8],
  [28, 4],
])

export const light_orange = n3
export const light_yellow = n3
export const light_green = n3
export const light_blue = n3
export const light_purple = n3
export const light_pink = n3
export const light_red = n3
export const light_gray = n3
const n4 = t([
  [0, 110],
  [1, 111],
  [2, 112],
  [3, 113],
  [4, 114],
  [5, 115],
  [6, 116],
  [7, 117],
  [8, 118],
  [9, 119],
  [10, 120],
  [11, 0],
  [12, 111],
  [13, 112],
  [14, 113],
  [15, 114],
  [16, 110],
  [17, 13],
  [18, 0],
  [19, 120],
  [20, 0],
  [21, 120],
  [22, 12],
  [23, 114],
  [24, 115],
  [25, 113],
  [26, 114],
  [27, 118],
  [28, 114],
])

export const dark_orange = n4
export const dark_yellow = n4
export const dark_green = n4
export const dark_blue = n4
export const dark_purple = n4
export const dark_pink = n4
export const dark_red = n4
export const dark_gray = n4
const n5 = t([
  [12, 2],
  [13, 3],
  [14, 4],
  [15, 5],
  [16, 1],
  [23, 5],
  [24, 6],
  [25, 4],
  [26, 5],
  [28, 5],
])

export const light_alt1 = n5
export const light_ListItem = n5
export const light_Card = n5
export const light_DrawerFrame = n5
export const light_Progress = n5
export const light_TooltipArrow = n5
export const light_SliderTrack = n5
export const light_alt1_ListItem = n5
export const light_alt1_Card = n5
export const light_alt1_DrawerFrame = n5
export const light_alt1_Progress = n5
export const light_alt1_TooltipArrow = n5
export const light_alt1_SliderTrack = n5
export const light_alt2_ListItem = n5
export const light_alt2_Card = n5
export const light_alt2_DrawerFrame = n5
export const light_alt2_Progress = n5
export const light_alt2_TooltipArrow = n5
export const light_alt2_SliderTrack = n5
export const light_active_ListItem = n5
export const light_active_Card = n5
export const light_active_DrawerFrame = n5
export const light_active_Progress = n5
export const light_active_TooltipArrow = n5
export const light_active_SliderTrack = n5
const n6 = t([
  [12, 3],
  [13, 4],
  [14, 5],
  [15, 6],
  [16, 2],
  [23, 6],
  [24, 7],
  [25, 5],
  [26, 6],
  [28, 6],
])

export const light_alt2 = n6
export const light_Button = n6
export const light_Checkbox = n6
export const light_Switch = n6
export const light_TooltipContent = n6
export const light_RadioGroupItem = n6
export const light_Input = n6
export const light_TextArea = n6
export const light_alt1_Button = n6
export const light_alt1_Checkbox = n6
export const light_alt1_Switch = n6
export const light_alt1_TooltipContent = n6
export const light_alt1_RadioGroupItem = n6
export const light_alt1_Input = n6
export const light_alt1_TextArea = n6
export const light_alt2_Button = n6
export const light_alt2_Checkbox = n6
export const light_alt2_Switch = n6
export const light_alt2_TooltipContent = n6
export const light_alt2_RadioGroupItem = n6
export const light_alt2_Input = n6
export const light_alt2_TextArea = n6
export const light_active_Button = n6
export const light_active_Checkbox = n6
export const light_active_Switch = n6
export const light_active_TooltipContent = n6
export const light_active_RadioGroupItem = n6
export const light_active_Input = n6
export const light_active_TextArea = n6
const n7 = t([
  [12, 4],
  [13, 5],
  [14, 6],
  [15, 7],
  [16, 3],
  [23, 7],
  [24, 8],
  [25, 6],
  [26, 7],
  [28, 7],
])

export const light_active = n7
export const light_SliderTrackActive = n7
export const light_alt1_SliderTrackActive = n7
export const light_alt2_SliderTrackActive = n7
export const light_active_SliderTrackActive = n7
const n8 = t([
  [12, 112],
  [13, 113],
  [14, 114],
  [15, 115],
  [16, 111],
  [23, 115],
  [24, 116],
  [25, 114],
  [26, 115],
  [28, 115],
])

export const dark_alt1 = n8
export const dark_ListItem = n8
export const dark_Card = n8
export const dark_DrawerFrame = n8
export const dark_Progress = n8
export const dark_TooltipArrow = n8
export const dark_SliderTrack = n8
export const dark_alt1_ListItem = n8
export const dark_alt1_Card = n8
export const dark_alt1_DrawerFrame = n8
export const dark_alt1_Progress = n8
export const dark_alt1_TooltipArrow = n8
export const dark_alt1_SliderTrack = n8
export const dark_alt2_ListItem = n8
export const dark_alt2_Card = n8
export const dark_alt2_DrawerFrame = n8
export const dark_alt2_Progress = n8
export const dark_alt2_TooltipArrow = n8
export const dark_alt2_SliderTrack = n8
export const dark_active_ListItem = n8
export const dark_active_Card = n8
export const dark_active_DrawerFrame = n8
export const dark_active_Progress = n8
export const dark_active_TooltipArrow = n8
export const dark_active_SliderTrack = n8
const n9 = t([
  [12, 113],
  [13, 114],
  [14, 115],
  [15, 116],
  [16, 112],
  [23, 116],
  [24, 117],
  [25, 115],
  [26, 116],
  [28, 116],
])

export const dark_alt2 = n9
export const dark_Button = n9
export const dark_Checkbox = n9
export const dark_Switch = n9
export const dark_TooltipContent = n9
export const dark_RadioGroupItem = n9
export const dark_Input = n9
export const dark_TextArea = n9
export const dark_alt1_Button = n9
export const dark_alt1_Checkbox = n9
export const dark_alt1_Switch = n9
export const dark_alt1_TooltipContent = n9
export const dark_alt1_RadioGroupItem = n9
export const dark_alt1_Input = n9
export const dark_alt1_TextArea = n9
export const dark_alt2_Button = n9
export const dark_alt2_Checkbox = n9
export const dark_alt2_Switch = n9
export const dark_alt2_TooltipContent = n9
export const dark_alt2_RadioGroupItem = n9
export const dark_alt2_Input = n9
export const dark_alt2_TextArea = n9
export const dark_active_Button = n9
export const dark_active_Checkbox = n9
export const dark_active_Switch = n9
export const dark_active_TooltipContent = n9
export const dark_active_RadioGroupItem = n9
export const dark_active_Input = n9
export const dark_active_TextArea = n9
const n10 = t([
  [12, 114],
  [13, 115],
  [14, 116],
  [15, 117],
  [16, 113],
  [23, 117],
  [24, 118],
  [25, 116],
  [26, 117],
  [28, 117],
])

export const dark_active = n10
export const dark_SliderTrackActive = n10
export const dark_alt1_SliderTrackActive = n10
export const dark_alt2_SliderTrackActive = n10
export const dark_active_SliderTrackActive = n10
const n11 = t([
  [12, 50],
  [13, 51],
  [14, 52],
  [15, 53],
  [16, 49],
  [23, 53],
  [24, 55],
  [25, 52],
  [26, 53],
  [28, 53],
])

export const light_orange_alt1 = n11
export const light_orange_ListItem = n11
export const light_orange_Card = n11
export const light_orange_DrawerFrame = n11
export const light_orange_Progress = n11
export const light_orange_TooltipArrow = n11
export const light_orange_SliderTrack = n11
export const light_orange_alt1_ListItem = n11
export const light_orange_alt1_Card = n11
export const light_orange_alt1_DrawerFrame = n11
export const light_orange_alt1_Progress = n11
export const light_orange_alt1_TooltipArrow = n11
export const light_orange_alt1_SliderTrack = n11
export const light_orange_alt2_ListItem = n11
export const light_orange_alt2_Card = n11
export const light_orange_alt2_DrawerFrame = n11
export const light_orange_alt2_Progress = n11
export const light_orange_alt2_TooltipArrow = n11
export const light_orange_alt2_SliderTrack = n11
export const light_orange_active_ListItem = n11
export const light_orange_active_Card = n11
export const light_orange_active_DrawerFrame = n11
export const light_orange_active_Progress = n11
export const light_orange_active_TooltipArrow = n11
export const light_orange_active_SliderTrack = n11
const n12 = t([
  [12, 51],
  [13, 52],
  [14, 53],
  [15, 55],
  [16, 50],
  [23, 55],
  [24, 56],
  [25, 53],
  [26, 55],
  [28, 55],
])

export const light_orange_alt2 = n12
export const light_orange_Button = n12
export const light_orange_Checkbox = n12
export const light_orange_Switch = n12
export const light_orange_TooltipContent = n12
export const light_orange_RadioGroupItem = n12
export const light_orange_Input = n12
export const light_orange_TextArea = n12
export const light_orange_alt1_Button = n12
export const light_orange_alt1_Checkbox = n12
export const light_orange_alt1_Switch = n12
export const light_orange_alt1_TooltipContent = n12
export const light_orange_alt1_RadioGroupItem = n12
export const light_orange_alt1_Input = n12
export const light_orange_alt1_TextArea = n12
export const light_orange_alt2_Button = n12
export const light_orange_alt2_Checkbox = n12
export const light_orange_alt2_Switch = n12
export const light_orange_alt2_TooltipContent = n12
export const light_orange_alt2_RadioGroupItem = n12
export const light_orange_alt2_Input = n12
export const light_orange_alt2_TextArea = n12
export const light_orange_active_Button = n12
export const light_orange_active_Checkbox = n12
export const light_orange_active_Switch = n12
export const light_orange_active_TooltipContent = n12
export const light_orange_active_RadioGroupItem = n12
export const light_orange_active_Input = n12
export const light_orange_active_TextArea = n12
const n13 = t([
  [12, 52],
  [13, 53],
  [14, 55],
  [15, 56],
  [16, 51],
  [23, 56],
  [24, 57],
  [25, 55],
  [26, 56],
  [28, 56],
])

export const light_orange_active = n13
export const light_orange_SliderTrackActive = n13
export const light_orange_alt1_SliderTrackActive = n13
export const light_orange_alt2_SliderTrackActive = n13
export const light_orange_active_SliderTrackActive = n13
const n14 = t([
  [12, 98],
  [13, 99],
  [14, 100],
  [15, 101],
  [16, 97],
  [23, 101],
  [24, 103],
  [25, 100],
  [26, 101],
  [28, 101],
])

export const light_yellow_alt1 = n14
export const light_yellow_ListItem = n14
export const light_yellow_Card = n14
export const light_yellow_DrawerFrame = n14
export const light_yellow_Progress = n14
export const light_yellow_TooltipArrow = n14
export const light_yellow_SliderTrack = n14
export const light_yellow_alt1_ListItem = n14
export const light_yellow_alt1_Card = n14
export const light_yellow_alt1_DrawerFrame = n14
export const light_yellow_alt1_Progress = n14
export const light_yellow_alt1_TooltipArrow = n14
export const light_yellow_alt1_SliderTrack = n14
export const light_yellow_alt2_ListItem = n14
export const light_yellow_alt2_Card = n14
export const light_yellow_alt2_DrawerFrame = n14
export const light_yellow_alt2_Progress = n14
export const light_yellow_alt2_TooltipArrow = n14
export const light_yellow_alt2_SliderTrack = n14
export const light_yellow_active_ListItem = n14
export const light_yellow_active_Card = n14
export const light_yellow_active_DrawerFrame = n14
export const light_yellow_active_Progress = n14
export const light_yellow_active_TooltipArrow = n14
export const light_yellow_active_SliderTrack = n14
const n15 = t([
  [12, 99],
  [13, 100],
  [14, 101],
  [15, 103],
  [16, 98],
  [23, 103],
  [24, 104],
  [25, 101],
  [26, 103],
  [28, 103],
])

export const light_yellow_alt2 = n15
export const light_yellow_Button = n15
export const light_yellow_Checkbox = n15
export const light_yellow_Switch = n15
export const light_yellow_TooltipContent = n15
export const light_yellow_RadioGroupItem = n15
export const light_yellow_Input = n15
export const light_yellow_TextArea = n15
export const light_yellow_alt1_Button = n15
export const light_yellow_alt1_Checkbox = n15
export const light_yellow_alt1_Switch = n15
export const light_yellow_alt1_TooltipContent = n15
export const light_yellow_alt1_RadioGroupItem = n15
export const light_yellow_alt1_Input = n15
export const light_yellow_alt1_TextArea = n15
export const light_yellow_alt2_Button = n15
export const light_yellow_alt2_Checkbox = n15
export const light_yellow_alt2_Switch = n15
export const light_yellow_alt2_TooltipContent = n15
export const light_yellow_alt2_RadioGroupItem = n15
export const light_yellow_alt2_Input = n15
export const light_yellow_alt2_TextArea = n15
export const light_yellow_active_Button = n15
export const light_yellow_active_Checkbox = n15
export const light_yellow_active_Switch = n15
export const light_yellow_active_TooltipContent = n15
export const light_yellow_active_RadioGroupItem = n15
export const light_yellow_active_Input = n15
export const light_yellow_active_TextArea = n15
const n16 = t([
  [12, 100],
  [13, 101],
  [14, 103],
  [15, 104],
  [16, 99],
  [23, 104],
  [24, 105],
  [25, 103],
  [26, 104],
  [28, 104],
])

export const light_yellow_active = n16
export const light_yellow_SliderTrackActive = n16
export const light_yellow_alt1_SliderTrackActive = n16
export const light_yellow_alt2_SliderTrackActive = n16
export const light_yellow_active_SliderTrackActive = n16
const n17 = t([
  [12, 38],
  [13, 39],
  [14, 40],
  [15, 41],
  [16, 37],
  [23, 41],
  [24, 43],
  [25, 40],
  [26, 41],
  [28, 41],
])

export const light_green_alt1 = n17
export const light_green_ListItem = n17
export const light_green_Card = n17
export const light_green_DrawerFrame = n17
export const light_green_Progress = n17
export const light_green_TooltipArrow = n17
export const light_green_SliderTrack = n17
export const light_green_alt1_ListItem = n17
export const light_green_alt1_Card = n17
export const light_green_alt1_DrawerFrame = n17
export const light_green_alt1_Progress = n17
export const light_green_alt1_TooltipArrow = n17
export const light_green_alt1_SliderTrack = n17
export const light_green_alt2_ListItem = n17
export const light_green_alt2_Card = n17
export const light_green_alt2_DrawerFrame = n17
export const light_green_alt2_Progress = n17
export const light_green_alt2_TooltipArrow = n17
export const light_green_alt2_SliderTrack = n17
export const light_green_active_ListItem = n17
export const light_green_active_Card = n17
export const light_green_active_DrawerFrame = n17
export const light_green_active_Progress = n17
export const light_green_active_TooltipArrow = n17
export const light_green_active_SliderTrack = n17
const n18 = t([
  [12, 39],
  [13, 40],
  [14, 41],
  [15, 43],
  [16, 38],
  [23, 43],
  [24, 44],
  [25, 41],
  [26, 43],
  [28, 43],
])

export const light_green_alt2 = n18
export const light_green_Button = n18
export const light_green_Checkbox = n18
export const light_green_Switch = n18
export const light_green_TooltipContent = n18
export const light_green_RadioGroupItem = n18
export const light_green_Input = n18
export const light_green_TextArea = n18
export const light_green_alt1_Button = n18
export const light_green_alt1_Checkbox = n18
export const light_green_alt1_Switch = n18
export const light_green_alt1_TooltipContent = n18
export const light_green_alt1_RadioGroupItem = n18
export const light_green_alt1_Input = n18
export const light_green_alt1_TextArea = n18
export const light_green_alt2_Button = n18
export const light_green_alt2_Checkbox = n18
export const light_green_alt2_Switch = n18
export const light_green_alt2_TooltipContent = n18
export const light_green_alt2_RadioGroupItem = n18
export const light_green_alt2_Input = n18
export const light_green_alt2_TextArea = n18
export const light_green_active_Button = n18
export const light_green_active_Checkbox = n18
export const light_green_active_Switch = n18
export const light_green_active_TooltipContent = n18
export const light_green_active_RadioGroupItem = n18
export const light_green_active_Input = n18
export const light_green_active_TextArea = n18
const n19 = t([
  [12, 40],
  [13, 41],
  [14, 43],
  [15, 44],
  [16, 39],
  [23, 44],
  [24, 45],
  [25, 43],
  [26, 44],
  [28, 44],
])

export const light_green_active = n19
export const light_green_SliderTrackActive = n19
export const light_green_alt1_SliderTrackActive = n19
export const light_green_alt2_SliderTrackActive = n19
export const light_green_active_SliderTrackActive = n19
const n20 = t([
  [12, 16],
  [13, 17],
  [14, 18],
  [15, 19],
  [16, 15],
  [23, 19],
  [24, 21],
  [25, 18],
  [26, 19],
  [28, 19],
])

export const light_blue_alt1 = n20
export const light_blue_ListItem = n20
export const light_blue_Card = n20
export const light_blue_DrawerFrame = n20
export const light_blue_Progress = n20
export const light_blue_TooltipArrow = n20
export const light_blue_SliderTrack = n20
export const light_blue_alt1_ListItem = n20
export const light_blue_alt1_Card = n20
export const light_blue_alt1_DrawerFrame = n20
export const light_blue_alt1_Progress = n20
export const light_blue_alt1_TooltipArrow = n20
export const light_blue_alt1_SliderTrack = n20
export const light_blue_alt2_ListItem = n20
export const light_blue_alt2_Card = n20
export const light_blue_alt2_DrawerFrame = n20
export const light_blue_alt2_Progress = n20
export const light_blue_alt2_TooltipArrow = n20
export const light_blue_alt2_SliderTrack = n20
export const light_blue_active_ListItem = n20
export const light_blue_active_Card = n20
export const light_blue_active_DrawerFrame = n20
export const light_blue_active_Progress = n20
export const light_blue_active_TooltipArrow = n20
export const light_blue_active_SliderTrack = n20
const n21 = t([
  [12, 17],
  [13, 18],
  [14, 19],
  [15, 21],
  [16, 16],
  [23, 21],
  [24, 22],
  [25, 19],
  [26, 21],
  [28, 21],
])

export const light_blue_alt2 = n21
export const light_blue_Button = n21
export const light_blue_Checkbox = n21
export const light_blue_Switch = n21
export const light_blue_TooltipContent = n21
export const light_blue_RadioGroupItem = n21
export const light_blue_Input = n21
export const light_blue_TextArea = n21
export const light_blue_alt1_Button = n21
export const light_blue_alt1_Checkbox = n21
export const light_blue_alt1_Switch = n21
export const light_blue_alt1_TooltipContent = n21
export const light_blue_alt1_RadioGroupItem = n21
export const light_blue_alt1_Input = n21
export const light_blue_alt1_TextArea = n21
export const light_blue_alt2_Button = n21
export const light_blue_alt2_Checkbox = n21
export const light_blue_alt2_Switch = n21
export const light_blue_alt2_TooltipContent = n21
export const light_blue_alt2_RadioGroupItem = n21
export const light_blue_alt2_Input = n21
export const light_blue_alt2_TextArea = n21
export const light_blue_active_Button = n21
export const light_blue_active_Checkbox = n21
export const light_blue_active_Switch = n21
export const light_blue_active_TooltipContent = n21
export const light_blue_active_RadioGroupItem = n21
export const light_blue_active_Input = n21
export const light_blue_active_TextArea = n21
const n22 = t([
  [12, 18],
  [13, 19],
  [14, 21],
  [15, 22],
  [16, 17],
  [23, 22],
  [24, 23],
  [25, 21],
  [26, 22],
  [28, 22],
])

export const light_blue_active = n22
export const light_blue_SliderTrackActive = n22
export const light_blue_alt1_SliderTrackActive = n22
export const light_blue_alt2_SliderTrackActive = n22
export const light_blue_active_SliderTrackActive = n22
const n23 = t([
  [12, 74],
  [13, 75],
  [14, 76],
  [15, 77],
  [16, 73],
  [23, 77],
  [24, 79],
  [25, 76],
  [26, 77],
  [28, 77],
])

export const light_purple_alt1 = n23
export const light_purple_ListItem = n23
export const light_purple_Card = n23
export const light_purple_DrawerFrame = n23
export const light_purple_Progress = n23
export const light_purple_TooltipArrow = n23
export const light_purple_SliderTrack = n23
export const light_purple_alt1_ListItem = n23
export const light_purple_alt1_Card = n23
export const light_purple_alt1_DrawerFrame = n23
export const light_purple_alt1_Progress = n23
export const light_purple_alt1_TooltipArrow = n23
export const light_purple_alt1_SliderTrack = n23
export const light_purple_alt2_ListItem = n23
export const light_purple_alt2_Card = n23
export const light_purple_alt2_DrawerFrame = n23
export const light_purple_alt2_Progress = n23
export const light_purple_alt2_TooltipArrow = n23
export const light_purple_alt2_SliderTrack = n23
export const light_purple_active_ListItem = n23
export const light_purple_active_Card = n23
export const light_purple_active_DrawerFrame = n23
export const light_purple_active_Progress = n23
export const light_purple_active_TooltipArrow = n23
export const light_purple_active_SliderTrack = n23
const n24 = t([
  [12, 75],
  [13, 76],
  [14, 77],
  [15, 79],
  [16, 74],
  [23, 79],
  [24, 80],
  [25, 77],
  [26, 79],
  [28, 79],
])

export const light_purple_alt2 = n24
export const light_purple_Button = n24
export const light_purple_Checkbox = n24
export const light_purple_Switch = n24
export const light_purple_TooltipContent = n24
export const light_purple_RadioGroupItem = n24
export const light_purple_Input = n24
export const light_purple_TextArea = n24
export const light_purple_alt1_Button = n24
export const light_purple_alt1_Checkbox = n24
export const light_purple_alt1_Switch = n24
export const light_purple_alt1_TooltipContent = n24
export const light_purple_alt1_RadioGroupItem = n24
export const light_purple_alt1_Input = n24
export const light_purple_alt1_TextArea = n24
export const light_purple_alt2_Button = n24
export const light_purple_alt2_Checkbox = n24
export const light_purple_alt2_Switch = n24
export const light_purple_alt2_TooltipContent = n24
export const light_purple_alt2_RadioGroupItem = n24
export const light_purple_alt2_Input = n24
export const light_purple_alt2_TextArea = n24
export const light_purple_active_Button = n24
export const light_purple_active_Checkbox = n24
export const light_purple_active_Switch = n24
export const light_purple_active_TooltipContent = n24
export const light_purple_active_RadioGroupItem = n24
export const light_purple_active_Input = n24
export const light_purple_active_TextArea = n24
const n25 = t([
  [12, 76],
  [13, 77],
  [14, 79],
  [15, 80],
  [16, 75],
  [23, 80],
  [24, 81],
  [25, 79],
  [26, 80],
  [28, 80],
])

export const light_purple_active = n25
export const light_purple_SliderTrackActive = n25
export const light_purple_alt1_SliderTrackActive = n25
export const light_purple_alt2_SliderTrackActive = n25
export const light_purple_active_SliderTrackActive = n25
const n26 = t([
  [12, 62],
  [13, 63],
  [14, 64],
  [15, 65],
  [16, 61],
  [23, 65],
  [24, 67],
  [25, 64],
  [26, 65],
  [28, 65],
])

export const light_pink_alt1 = n26
export const light_pink_ListItem = n26
export const light_pink_Card = n26
export const light_pink_DrawerFrame = n26
export const light_pink_Progress = n26
export const light_pink_TooltipArrow = n26
export const light_pink_SliderTrack = n26
export const light_pink_alt1_ListItem = n26
export const light_pink_alt1_Card = n26
export const light_pink_alt1_DrawerFrame = n26
export const light_pink_alt1_Progress = n26
export const light_pink_alt1_TooltipArrow = n26
export const light_pink_alt1_SliderTrack = n26
export const light_pink_alt2_ListItem = n26
export const light_pink_alt2_Card = n26
export const light_pink_alt2_DrawerFrame = n26
export const light_pink_alt2_Progress = n26
export const light_pink_alt2_TooltipArrow = n26
export const light_pink_alt2_SliderTrack = n26
export const light_pink_active_ListItem = n26
export const light_pink_active_Card = n26
export const light_pink_active_DrawerFrame = n26
export const light_pink_active_Progress = n26
export const light_pink_active_TooltipArrow = n26
export const light_pink_active_SliderTrack = n26
const n27 = t([
  [12, 63],
  [13, 64],
  [14, 65],
  [15, 67],
  [16, 62],
  [23, 67],
  [24, 68],
  [25, 65],
  [26, 67],
  [28, 67],
])

export const light_pink_alt2 = n27
export const light_pink_Button = n27
export const light_pink_Checkbox = n27
export const light_pink_Switch = n27
export const light_pink_TooltipContent = n27
export const light_pink_RadioGroupItem = n27
export const light_pink_Input = n27
export const light_pink_TextArea = n27
export const light_pink_alt1_Button = n27
export const light_pink_alt1_Checkbox = n27
export const light_pink_alt1_Switch = n27
export const light_pink_alt1_TooltipContent = n27
export const light_pink_alt1_RadioGroupItem = n27
export const light_pink_alt1_Input = n27
export const light_pink_alt1_TextArea = n27
export const light_pink_alt2_Button = n27
export const light_pink_alt2_Checkbox = n27
export const light_pink_alt2_Switch = n27
export const light_pink_alt2_TooltipContent = n27
export const light_pink_alt2_RadioGroupItem = n27
export const light_pink_alt2_Input = n27
export const light_pink_alt2_TextArea = n27
export const light_pink_active_Button = n27
export const light_pink_active_Checkbox = n27
export const light_pink_active_Switch = n27
export const light_pink_active_TooltipContent = n27
export const light_pink_active_RadioGroupItem = n27
export const light_pink_active_Input = n27
export const light_pink_active_TextArea = n27
const n28 = t([
  [12, 64],
  [13, 65],
  [14, 67],
  [15, 68],
  [16, 63],
  [23, 68],
  [24, 69],
  [25, 67],
  [26, 68],
  [28, 68],
])

export const light_pink_active = n28
export const light_pink_SliderTrackActive = n28
export const light_pink_alt1_SliderTrackActive = n28
export const light_pink_alt2_SliderTrackActive = n28
export const light_pink_active_SliderTrackActive = n28
const n29 = t([
  [12, 86],
  [13, 87],
  [14, 88],
  [15, 89],
  [16, 85],
  [23, 89],
  [24, 91],
  [25, 88],
  [26, 89],
  [28, 89],
])

export const light_red_alt1 = n29
export const light_red_ListItem = n29
export const light_red_Card = n29
export const light_red_DrawerFrame = n29
export const light_red_Progress = n29
export const light_red_TooltipArrow = n29
export const light_red_SliderTrack = n29
export const light_red_alt1_ListItem = n29
export const light_red_alt1_Card = n29
export const light_red_alt1_DrawerFrame = n29
export const light_red_alt1_Progress = n29
export const light_red_alt1_TooltipArrow = n29
export const light_red_alt1_SliderTrack = n29
export const light_red_alt2_ListItem = n29
export const light_red_alt2_Card = n29
export const light_red_alt2_DrawerFrame = n29
export const light_red_alt2_Progress = n29
export const light_red_alt2_TooltipArrow = n29
export const light_red_alt2_SliderTrack = n29
export const light_red_active_ListItem = n29
export const light_red_active_Card = n29
export const light_red_active_DrawerFrame = n29
export const light_red_active_Progress = n29
export const light_red_active_TooltipArrow = n29
export const light_red_active_SliderTrack = n29
const n30 = t([
  [12, 87],
  [13, 88],
  [14, 89],
  [15, 91],
  [16, 86],
  [23, 91],
  [24, 92],
  [25, 89],
  [26, 91],
  [28, 91],
])

export const light_red_alt2 = n30
export const light_red_Button = n30
export const light_red_Checkbox = n30
export const light_red_Switch = n30
export const light_red_TooltipContent = n30
export const light_red_RadioGroupItem = n30
export const light_red_Input = n30
export const light_red_TextArea = n30
export const light_red_alt1_Button = n30
export const light_red_alt1_Checkbox = n30
export const light_red_alt1_Switch = n30
export const light_red_alt1_TooltipContent = n30
export const light_red_alt1_RadioGroupItem = n30
export const light_red_alt1_Input = n30
export const light_red_alt1_TextArea = n30
export const light_red_alt2_Button = n30
export const light_red_alt2_Checkbox = n30
export const light_red_alt2_Switch = n30
export const light_red_alt2_TooltipContent = n30
export const light_red_alt2_RadioGroupItem = n30
export const light_red_alt2_Input = n30
export const light_red_alt2_TextArea = n30
export const light_red_active_Button = n30
export const light_red_active_Checkbox = n30
export const light_red_active_Switch = n30
export const light_red_active_TooltipContent = n30
export const light_red_active_RadioGroupItem = n30
export const light_red_active_Input = n30
export const light_red_active_TextArea = n30
const n31 = t([
  [12, 88],
  [13, 89],
  [14, 91],
  [15, 92],
  [16, 87],
  [23, 92],
  [24, 93],
  [25, 91],
  [26, 92],
  [28, 92],
])

export const light_red_active = n31
export const light_red_SliderTrackActive = n31
export const light_red_alt1_SliderTrackActive = n31
export const light_red_alt2_SliderTrackActive = n31
export const light_red_active_SliderTrackActive = n31
const n32 = t([
  [12, 28],
  [13, 29],
  [14, 30],
  [15, 31],
  [16, 27],
  [23, 31],
  [24, 33],
  [25, 30],
  [26, 31],
  [28, 31],
])

export const light_gray_alt1 = n32
export const light_gray_ListItem = n32
export const light_gray_Card = n32
export const light_gray_DrawerFrame = n32
export const light_gray_Progress = n32
export const light_gray_TooltipArrow = n32
export const light_gray_SliderTrack = n32
export const light_gray_alt1_ListItem = n32
export const light_gray_alt1_Card = n32
export const light_gray_alt1_DrawerFrame = n32
export const light_gray_alt1_Progress = n32
export const light_gray_alt1_TooltipArrow = n32
export const light_gray_alt1_SliderTrack = n32
export const light_gray_alt2_ListItem = n32
export const light_gray_alt2_Card = n32
export const light_gray_alt2_DrawerFrame = n32
export const light_gray_alt2_Progress = n32
export const light_gray_alt2_TooltipArrow = n32
export const light_gray_alt2_SliderTrack = n32
export const light_gray_active_ListItem = n32
export const light_gray_active_Card = n32
export const light_gray_active_DrawerFrame = n32
export const light_gray_active_Progress = n32
export const light_gray_active_TooltipArrow = n32
export const light_gray_active_SliderTrack = n32
const n33 = t([
  [12, 29],
  [13, 30],
  [14, 31],
  [15, 33],
  [16, 28],
  [23, 33],
  [24, 8],
  [25, 31],
  [26, 33],
  [28, 33],
])

export const light_gray_alt2 = n33
export const light_gray_Button = n33
export const light_gray_Checkbox = n33
export const light_gray_Switch = n33
export const light_gray_TooltipContent = n33
export const light_gray_RadioGroupItem = n33
export const light_gray_Input = n33
export const light_gray_TextArea = n33
export const light_gray_alt1_Button = n33
export const light_gray_alt1_Checkbox = n33
export const light_gray_alt1_Switch = n33
export const light_gray_alt1_TooltipContent = n33
export const light_gray_alt1_RadioGroupItem = n33
export const light_gray_alt1_Input = n33
export const light_gray_alt1_TextArea = n33
export const light_gray_alt2_Button = n33
export const light_gray_alt2_Checkbox = n33
export const light_gray_alt2_Switch = n33
export const light_gray_alt2_TooltipContent = n33
export const light_gray_alt2_RadioGroupItem = n33
export const light_gray_alt2_Input = n33
export const light_gray_alt2_TextArea = n33
export const light_gray_active_Button = n33
export const light_gray_active_Checkbox = n33
export const light_gray_active_Switch = n33
export const light_gray_active_TooltipContent = n33
export const light_gray_active_RadioGroupItem = n33
export const light_gray_active_Input = n33
export const light_gray_active_TextArea = n33
const n34 = t([
  [12, 30],
  [13, 31],
  [14, 33],
  [15, 8],
  [16, 29],
  [23, 8],
  [24, 34],
  [25, 33],
  [26, 8],
  [28, 8],
])

export const light_gray_active = n34
export const light_gray_SliderTrackActive = n34
export const light_gray_alt1_SliderTrackActive = n34
export const light_gray_alt2_SliderTrackActive = n34
export const light_gray_active_SliderTrackActive = n34
const n35 = t([
  [12, 156],
  [13, 157],
  [14, 158],
  [15, 159],
  [16, 155],
  [23, 159],
  [24, 161],
  [25, 158],
  [26, 159],
  [28, 159],
])

export const dark_orange_alt1 = n35
export const dark_orange_ListItem = n35
export const dark_orange_Card = n35
export const dark_orange_DrawerFrame = n35
export const dark_orange_Progress = n35
export const dark_orange_TooltipArrow = n35
export const dark_orange_SliderTrack = n35
export const dark_orange_alt1_ListItem = n35
export const dark_orange_alt1_Card = n35
export const dark_orange_alt1_DrawerFrame = n35
export const dark_orange_alt1_Progress = n35
export const dark_orange_alt1_TooltipArrow = n35
export const dark_orange_alt1_SliderTrack = n35
export const dark_orange_alt2_ListItem = n35
export const dark_orange_alt2_Card = n35
export const dark_orange_alt2_DrawerFrame = n35
export const dark_orange_alt2_Progress = n35
export const dark_orange_alt2_TooltipArrow = n35
export const dark_orange_alt2_SliderTrack = n35
export const dark_orange_active_ListItem = n35
export const dark_orange_active_Card = n35
export const dark_orange_active_DrawerFrame = n35
export const dark_orange_active_Progress = n35
export const dark_orange_active_TooltipArrow = n35
export const dark_orange_active_SliderTrack = n35
const n36 = t([
  [12, 157],
  [13, 158],
  [14, 159],
  [15, 161],
  [16, 156],
  [23, 161],
  [24, 56],
  [25, 159],
  [26, 161],
  [28, 161],
])

export const dark_orange_alt2 = n36
export const dark_orange_Button = n36
export const dark_orange_Checkbox = n36
export const dark_orange_Switch = n36
export const dark_orange_TooltipContent = n36
export const dark_orange_RadioGroupItem = n36
export const dark_orange_Input = n36
export const dark_orange_TextArea = n36
export const dark_orange_alt1_Button = n36
export const dark_orange_alt1_Checkbox = n36
export const dark_orange_alt1_Switch = n36
export const dark_orange_alt1_TooltipContent = n36
export const dark_orange_alt1_RadioGroupItem = n36
export const dark_orange_alt1_Input = n36
export const dark_orange_alt1_TextArea = n36
export const dark_orange_alt2_Button = n36
export const dark_orange_alt2_Checkbox = n36
export const dark_orange_alt2_Switch = n36
export const dark_orange_alt2_TooltipContent = n36
export const dark_orange_alt2_RadioGroupItem = n36
export const dark_orange_alt2_Input = n36
export const dark_orange_alt2_TextArea = n36
export const dark_orange_active_Button = n36
export const dark_orange_active_Checkbox = n36
export const dark_orange_active_Switch = n36
export const dark_orange_active_TooltipContent = n36
export const dark_orange_active_RadioGroupItem = n36
export const dark_orange_active_Input = n36
export const dark_orange_active_TextArea = n36
const n37 = t([
  [12, 158],
  [13, 159],
  [14, 161],
  [15, 56],
  [16, 157],
  [23, 56],
  [24, 162],
  [25, 161],
  [26, 56],
  [28, 56],
])

export const dark_orange_active = n37
export const dark_orange_SliderTrackActive = n37
export const dark_orange_alt1_SliderTrackActive = n37
export const dark_orange_alt2_SliderTrackActive = n37
export const dark_orange_active_SliderTrackActive = n37
const n38 = t([
  [12, 200],
  [13, 201],
  [14, 202],
  [15, 203],
  [16, 199],
  [23, 203],
  [24, 205],
  [25, 202],
  [26, 203],
  [28, 203],
])

export const dark_yellow_alt1 = n38
export const dark_yellow_ListItem = n38
export const dark_yellow_Card = n38
export const dark_yellow_DrawerFrame = n38
export const dark_yellow_Progress = n38
export const dark_yellow_TooltipArrow = n38
export const dark_yellow_SliderTrack = n38
export const dark_yellow_alt1_ListItem = n38
export const dark_yellow_alt1_Card = n38
export const dark_yellow_alt1_DrawerFrame = n38
export const dark_yellow_alt1_Progress = n38
export const dark_yellow_alt1_TooltipArrow = n38
export const dark_yellow_alt1_SliderTrack = n38
export const dark_yellow_alt2_ListItem = n38
export const dark_yellow_alt2_Card = n38
export const dark_yellow_alt2_DrawerFrame = n38
export const dark_yellow_alt2_Progress = n38
export const dark_yellow_alt2_TooltipArrow = n38
export const dark_yellow_alt2_SliderTrack = n38
export const dark_yellow_active_ListItem = n38
export const dark_yellow_active_Card = n38
export const dark_yellow_active_DrawerFrame = n38
export const dark_yellow_active_Progress = n38
export const dark_yellow_active_TooltipArrow = n38
export const dark_yellow_active_SliderTrack = n38
const n39 = t([
  [12, 201],
  [13, 202],
  [14, 203],
  [15, 205],
  [16, 200],
  [23, 205],
  [24, 104],
  [25, 203],
  [26, 205],
  [28, 205],
])

export const dark_yellow_alt2 = n39
export const dark_yellow_Button = n39
export const dark_yellow_Checkbox = n39
export const dark_yellow_Switch = n39
export const dark_yellow_TooltipContent = n39
export const dark_yellow_RadioGroupItem = n39
export const dark_yellow_Input = n39
export const dark_yellow_TextArea = n39
export const dark_yellow_alt1_Button = n39
export const dark_yellow_alt1_Checkbox = n39
export const dark_yellow_alt1_Switch = n39
export const dark_yellow_alt1_TooltipContent = n39
export const dark_yellow_alt1_RadioGroupItem = n39
export const dark_yellow_alt1_Input = n39
export const dark_yellow_alt1_TextArea = n39
export const dark_yellow_alt2_Button = n39
export const dark_yellow_alt2_Checkbox = n39
export const dark_yellow_alt2_Switch = n39
export const dark_yellow_alt2_TooltipContent = n39
export const dark_yellow_alt2_RadioGroupItem = n39
export const dark_yellow_alt2_Input = n39
export const dark_yellow_alt2_TextArea = n39
export const dark_yellow_active_Button = n39
export const dark_yellow_active_Checkbox = n39
export const dark_yellow_active_Switch = n39
export const dark_yellow_active_TooltipContent = n39
export const dark_yellow_active_RadioGroupItem = n39
export const dark_yellow_active_Input = n39
export const dark_yellow_active_TextArea = n39
const n40 = t([
  [12, 202],
  [13, 203],
  [14, 205],
  [15, 104],
  [16, 201],
  [23, 104],
  [24, 206],
  [25, 205],
  [26, 104],
  [28, 104],
])

export const dark_yellow_active = n40
export const dark_yellow_SliderTrackActive = n40
export const dark_yellow_alt1_SliderTrackActive = n40
export const dark_yellow_alt2_SliderTrackActive = n40
export const dark_yellow_active_SliderTrackActive = n40
const n41 = t([
  [12, 145],
  [13, 146],
  [14, 147],
  [15, 148],
  [16, 144],
  [23, 148],
  [24, 150],
  [25, 147],
  [26, 148],
  [28, 148],
])

export const dark_green_alt1 = n41
export const dark_green_ListItem = n41
export const dark_green_Card = n41
export const dark_green_DrawerFrame = n41
export const dark_green_Progress = n41
export const dark_green_TooltipArrow = n41
export const dark_green_SliderTrack = n41
export const dark_green_alt1_ListItem = n41
export const dark_green_alt1_Card = n41
export const dark_green_alt1_DrawerFrame = n41
export const dark_green_alt1_Progress = n41
export const dark_green_alt1_TooltipArrow = n41
export const dark_green_alt1_SliderTrack = n41
export const dark_green_alt2_ListItem = n41
export const dark_green_alt2_Card = n41
export const dark_green_alt2_DrawerFrame = n41
export const dark_green_alt2_Progress = n41
export const dark_green_alt2_TooltipArrow = n41
export const dark_green_alt2_SliderTrack = n41
export const dark_green_active_ListItem = n41
export const dark_green_active_Card = n41
export const dark_green_active_DrawerFrame = n41
export const dark_green_active_Progress = n41
export const dark_green_active_TooltipArrow = n41
export const dark_green_active_SliderTrack = n41
const n42 = t([
  [12, 146],
  [13, 147],
  [14, 148],
  [15, 150],
  [16, 145],
  [23, 150],
  [24, 44],
  [25, 148],
  [26, 150],
  [28, 150],
])

export const dark_green_alt2 = n42
export const dark_green_Button = n42
export const dark_green_Checkbox = n42
export const dark_green_Switch = n42
export const dark_green_TooltipContent = n42
export const dark_green_RadioGroupItem = n42
export const dark_green_Input = n42
export const dark_green_TextArea = n42
export const dark_green_alt1_Button = n42
export const dark_green_alt1_Checkbox = n42
export const dark_green_alt1_Switch = n42
export const dark_green_alt1_TooltipContent = n42
export const dark_green_alt1_RadioGroupItem = n42
export const dark_green_alt1_Input = n42
export const dark_green_alt1_TextArea = n42
export const dark_green_alt2_Button = n42
export const dark_green_alt2_Checkbox = n42
export const dark_green_alt2_Switch = n42
export const dark_green_alt2_TooltipContent = n42
export const dark_green_alt2_RadioGroupItem = n42
export const dark_green_alt2_Input = n42
export const dark_green_alt2_TextArea = n42
export const dark_green_active_Button = n42
export const dark_green_active_Checkbox = n42
export const dark_green_active_Switch = n42
export const dark_green_active_TooltipContent = n42
export const dark_green_active_RadioGroupItem = n42
export const dark_green_active_Input = n42
export const dark_green_active_TextArea = n42
const n43 = t([
  [12, 147],
  [13, 148],
  [14, 150],
  [15, 44],
  [16, 146],
  [23, 44],
  [24, 151],
  [25, 150],
  [26, 44],
  [28, 44],
])

export const dark_green_active = n43
export const dark_green_SliderTrackActive = n43
export const dark_green_alt1_SliderTrackActive = n43
export const dark_green_alt2_SliderTrackActive = n43
export const dark_green_active_SliderTrackActive = n43
const n44 = t([
  [12, 123],
  [13, 124],
  [14, 125],
  [15, 126],
  [16, 122],
  [23, 126],
  [24, 128],
  [25, 125],
  [26, 126],
  [28, 126],
])

export const dark_blue_alt1 = n44
export const dark_blue_ListItem = n44
export const dark_blue_Card = n44
export const dark_blue_DrawerFrame = n44
export const dark_blue_Progress = n44
export const dark_blue_TooltipArrow = n44
export const dark_blue_SliderTrack = n44
export const dark_blue_alt1_ListItem = n44
export const dark_blue_alt1_Card = n44
export const dark_blue_alt1_DrawerFrame = n44
export const dark_blue_alt1_Progress = n44
export const dark_blue_alt1_TooltipArrow = n44
export const dark_blue_alt1_SliderTrack = n44
export const dark_blue_alt2_ListItem = n44
export const dark_blue_alt2_Card = n44
export const dark_blue_alt2_DrawerFrame = n44
export const dark_blue_alt2_Progress = n44
export const dark_blue_alt2_TooltipArrow = n44
export const dark_blue_alt2_SliderTrack = n44
export const dark_blue_active_ListItem = n44
export const dark_blue_active_Card = n44
export const dark_blue_active_DrawerFrame = n44
export const dark_blue_active_Progress = n44
export const dark_blue_active_TooltipArrow = n44
export const dark_blue_active_SliderTrack = n44
const n45 = t([
  [12, 124],
  [13, 125],
  [14, 126],
  [15, 128],
  [16, 123],
  [23, 128],
  [24, 22],
  [25, 126],
  [26, 128],
  [28, 128],
])

export const dark_blue_alt2 = n45
export const dark_blue_Button = n45
export const dark_blue_Checkbox = n45
export const dark_blue_Switch = n45
export const dark_blue_TooltipContent = n45
export const dark_blue_RadioGroupItem = n45
export const dark_blue_Input = n45
export const dark_blue_TextArea = n45
export const dark_blue_alt1_Button = n45
export const dark_blue_alt1_Checkbox = n45
export const dark_blue_alt1_Switch = n45
export const dark_blue_alt1_TooltipContent = n45
export const dark_blue_alt1_RadioGroupItem = n45
export const dark_blue_alt1_Input = n45
export const dark_blue_alt1_TextArea = n45
export const dark_blue_alt2_Button = n45
export const dark_blue_alt2_Checkbox = n45
export const dark_blue_alt2_Switch = n45
export const dark_blue_alt2_TooltipContent = n45
export const dark_blue_alt2_RadioGroupItem = n45
export const dark_blue_alt2_Input = n45
export const dark_blue_alt2_TextArea = n45
export const dark_blue_active_Button = n45
export const dark_blue_active_Checkbox = n45
export const dark_blue_active_Switch = n45
export const dark_blue_active_TooltipContent = n45
export const dark_blue_active_RadioGroupItem = n45
export const dark_blue_active_Input = n45
export const dark_blue_active_TextArea = n45
const n46 = t([
  [12, 125],
  [13, 126],
  [14, 128],
  [15, 22],
  [16, 124],
  [23, 22],
  [24, 129],
  [25, 128],
  [26, 22],
  [28, 22],
])

export const dark_blue_active = n46
export const dark_blue_SliderTrackActive = n46
export const dark_blue_alt1_SliderTrackActive = n46
export const dark_blue_alt2_SliderTrackActive = n46
export const dark_blue_active_SliderTrackActive = n46
const n47 = t([
  [12, 178],
  [13, 179],
  [14, 180],
  [15, 181],
  [16, 177],
  [23, 181],
  [24, 183],
  [25, 180],
  [26, 181],
  [28, 181],
])

export const dark_purple_alt1 = n47
export const dark_purple_ListItem = n47
export const dark_purple_Card = n47
export const dark_purple_DrawerFrame = n47
export const dark_purple_Progress = n47
export const dark_purple_TooltipArrow = n47
export const dark_purple_SliderTrack = n47
export const dark_purple_alt1_ListItem = n47
export const dark_purple_alt1_Card = n47
export const dark_purple_alt1_DrawerFrame = n47
export const dark_purple_alt1_Progress = n47
export const dark_purple_alt1_TooltipArrow = n47
export const dark_purple_alt1_SliderTrack = n47
export const dark_purple_alt2_ListItem = n47
export const dark_purple_alt2_Card = n47
export const dark_purple_alt2_DrawerFrame = n47
export const dark_purple_alt2_Progress = n47
export const dark_purple_alt2_TooltipArrow = n47
export const dark_purple_alt2_SliderTrack = n47
export const dark_purple_active_ListItem = n47
export const dark_purple_active_Card = n47
export const dark_purple_active_DrawerFrame = n47
export const dark_purple_active_Progress = n47
export const dark_purple_active_TooltipArrow = n47
export const dark_purple_active_SliderTrack = n47
const n48 = t([
  [12, 179],
  [13, 180],
  [14, 181],
  [15, 183],
  [16, 178],
  [23, 183],
  [24, 80],
  [25, 181],
  [26, 183],
  [28, 183],
])

export const dark_purple_alt2 = n48
export const dark_purple_Button = n48
export const dark_purple_Checkbox = n48
export const dark_purple_Switch = n48
export const dark_purple_TooltipContent = n48
export const dark_purple_RadioGroupItem = n48
export const dark_purple_Input = n48
export const dark_purple_TextArea = n48
export const dark_purple_alt1_Button = n48
export const dark_purple_alt1_Checkbox = n48
export const dark_purple_alt1_Switch = n48
export const dark_purple_alt1_TooltipContent = n48
export const dark_purple_alt1_RadioGroupItem = n48
export const dark_purple_alt1_Input = n48
export const dark_purple_alt1_TextArea = n48
export const dark_purple_alt2_Button = n48
export const dark_purple_alt2_Checkbox = n48
export const dark_purple_alt2_Switch = n48
export const dark_purple_alt2_TooltipContent = n48
export const dark_purple_alt2_RadioGroupItem = n48
export const dark_purple_alt2_Input = n48
export const dark_purple_alt2_TextArea = n48
export const dark_purple_active_Button = n48
export const dark_purple_active_Checkbox = n48
export const dark_purple_active_Switch = n48
export const dark_purple_active_TooltipContent = n48
export const dark_purple_active_RadioGroupItem = n48
export const dark_purple_active_Input = n48
export const dark_purple_active_TextArea = n48
const n49 = t([
  [12, 180],
  [13, 181],
  [14, 183],
  [15, 80],
  [16, 179],
  [23, 80],
  [24, 184],
  [25, 183],
  [26, 80],
  [28, 80],
])

export const dark_purple_active = n49
export const dark_purple_SliderTrackActive = n49
export const dark_purple_alt1_SliderTrackActive = n49
export const dark_purple_alt2_SliderTrackActive = n49
export const dark_purple_active_SliderTrackActive = n49
const n50 = t([
  [12, 167],
  [13, 168],
  [14, 169],
  [15, 170],
  [16, 166],
  [23, 170],
  [24, 172],
  [25, 169],
  [26, 170],
  [28, 170],
])

export const dark_pink_alt1 = n50
export const dark_pink_ListItem = n50
export const dark_pink_Card = n50
export const dark_pink_DrawerFrame = n50
export const dark_pink_Progress = n50
export const dark_pink_TooltipArrow = n50
export const dark_pink_SliderTrack = n50
export const dark_pink_alt1_ListItem = n50
export const dark_pink_alt1_Card = n50
export const dark_pink_alt1_DrawerFrame = n50
export const dark_pink_alt1_Progress = n50
export const dark_pink_alt1_TooltipArrow = n50
export const dark_pink_alt1_SliderTrack = n50
export const dark_pink_alt2_ListItem = n50
export const dark_pink_alt2_Card = n50
export const dark_pink_alt2_DrawerFrame = n50
export const dark_pink_alt2_Progress = n50
export const dark_pink_alt2_TooltipArrow = n50
export const dark_pink_alt2_SliderTrack = n50
export const dark_pink_active_ListItem = n50
export const dark_pink_active_Card = n50
export const dark_pink_active_DrawerFrame = n50
export const dark_pink_active_Progress = n50
export const dark_pink_active_TooltipArrow = n50
export const dark_pink_active_SliderTrack = n50
const n51 = t([
  [12, 168],
  [13, 169],
  [14, 170],
  [15, 172],
  [16, 167],
  [23, 172],
  [24, 68],
  [25, 170],
  [26, 172],
  [28, 172],
])

export const dark_pink_alt2 = n51
export const dark_pink_Button = n51
export const dark_pink_Checkbox = n51
export const dark_pink_Switch = n51
export const dark_pink_TooltipContent = n51
export const dark_pink_RadioGroupItem = n51
export const dark_pink_Input = n51
export const dark_pink_TextArea = n51
export const dark_pink_alt1_Button = n51
export const dark_pink_alt1_Checkbox = n51
export const dark_pink_alt1_Switch = n51
export const dark_pink_alt1_TooltipContent = n51
export const dark_pink_alt1_RadioGroupItem = n51
export const dark_pink_alt1_Input = n51
export const dark_pink_alt1_TextArea = n51
export const dark_pink_alt2_Button = n51
export const dark_pink_alt2_Checkbox = n51
export const dark_pink_alt2_Switch = n51
export const dark_pink_alt2_TooltipContent = n51
export const dark_pink_alt2_RadioGroupItem = n51
export const dark_pink_alt2_Input = n51
export const dark_pink_alt2_TextArea = n51
export const dark_pink_active_Button = n51
export const dark_pink_active_Checkbox = n51
export const dark_pink_active_Switch = n51
export const dark_pink_active_TooltipContent = n51
export const dark_pink_active_RadioGroupItem = n51
export const dark_pink_active_Input = n51
export const dark_pink_active_TextArea = n51
const n52 = t([
  [12, 169],
  [13, 170],
  [14, 172],
  [15, 68],
  [16, 168],
  [23, 68],
  [24, 173],
  [25, 172],
  [26, 68],
  [28, 68],
])

export const dark_pink_active = n52
export const dark_pink_SliderTrackActive = n52
export const dark_pink_alt1_SliderTrackActive = n52
export const dark_pink_alt2_SliderTrackActive = n52
export const dark_pink_active_SliderTrackActive = n52
const n53 = t([
  [12, 189],
  [13, 190],
  [14, 191],
  [15, 192],
  [16, 188],
  [23, 192],
  [24, 194],
  [25, 191],
  [26, 192],
  [28, 192],
])

export const dark_red_alt1 = n53
export const dark_red_ListItem = n53
export const dark_red_Card = n53
export const dark_red_DrawerFrame = n53
export const dark_red_Progress = n53
export const dark_red_TooltipArrow = n53
export const dark_red_SliderTrack = n53
export const dark_red_alt1_ListItem = n53
export const dark_red_alt1_Card = n53
export const dark_red_alt1_DrawerFrame = n53
export const dark_red_alt1_Progress = n53
export const dark_red_alt1_TooltipArrow = n53
export const dark_red_alt1_SliderTrack = n53
export const dark_red_alt2_ListItem = n53
export const dark_red_alt2_Card = n53
export const dark_red_alt2_DrawerFrame = n53
export const dark_red_alt2_Progress = n53
export const dark_red_alt2_TooltipArrow = n53
export const dark_red_alt2_SliderTrack = n53
export const dark_red_active_ListItem = n53
export const dark_red_active_Card = n53
export const dark_red_active_DrawerFrame = n53
export const dark_red_active_Progress = n53
export const dark_red_active_TooltipArrow = n53
export const dark_red_active_SliderTrack = n53
const n54 = t([
  [12, 190],
  [13, 191],
  [14, 192],
  [15, 194],
  [16, 189],
  [23, 194],
  [24, 92],
  [25, 192],
  [26, 194],
  [28, 194],
])

export const dark_red_alt2 = n54
export const dark_red_Button = n54
export const dark_red_Checkbox = n54
export const dark_red_Switch = n54
export const dark_red_TooltipContent = n54
export const dark_red_RadioGroupItem = n54
export const dark_red_Input = n54
export const dark_red_TextArea = n54
export const dark_red_alt1_Button = n54
export const dark_red_alt1_Checkbox = n54
export const dark_red_alt1_Switch = n54
export const dark_red_alt1_TooltipContent = n54
export const dark_red_alt1_RadioGroupItem = n54
export const dark_red_alt1_Input = n54
export const dark_red_alt1_TextArea = n54
export const dark_red_alt2_Button = n54
export const dark_red_alt2_Checkbox = n54
export const dark_red_alt2_Switch = n54
export const dark_red_alt2_TooltipContent = n54
export const dark_red_alt2_RadioGroupItem = n54
export const dark_red_alt2_Input = n54
export const dark_red_alt2_TextArea = n54
export const dark_red_active_Button = n54
export const dark_red_active_Checkbox = n54
export const dark_red_active_Switch = n54
export const dark_red_active_TooltipContent = n54
export const dark_red_active_RadioGroupItem = n54
export const dark_red_active_Input = n54
export const dark_red_active_TextArea = n54
const n55 = t([
  [12, 191],
  [13, 192],
  [14, 194],
  [15, 92],
  [16, 190],
  [23, 92],
  [24, 195],
  [25, 194],
  [26, 92],
  [28, 92],
])

export const dark_red_active = n55
export const dark_red_SliderTrackActive = n55
export const dark_red_alt1_SliderTrackActive = n55
export const dark_red_alt2_SliderTrackActive = n55
export const dark_red_active_SliderTrackActive = n55
const n56 = t([
  [12, 134],
  [13, 135],
  [14, 136],
  [15, 137],
  [16, 133],
  [23, 137],
  [24, 139],
  [25, 136],
  [26, 137],
  [28, 137],
])

export const dark_gray_alt1 = n56
export const dark_gray_ListItem = n56
export const dark_gray_Card = n56
export const dark_gray_DrawerFrame = n56
export const dark_gray_Progress = n56
export const dark_gray_TooltipArrow = n56
export const dark_gray_SliderTrack = n56
export const dark_gray_alt1_ListItem = n56
export const dark_gray_alt1_Card = n56
export const dark_gray_alt1_DrawerFrame = n56
export const dark_gray_alt1_Progress = n56
export const dark_gray_alt1_TooltipArrow = n56
export const dark_gray_alt1_SliderTrack = n56
export const dark_gray_alt2_ListItem = n56
export const dark_gray_alt2_Card = n56
export const dark_gray_alt2_DrawerFrame = n56
export const dark_gray_alt2_Progress = n56
export const dark_gray_alt2_TooltipArrow = n56
export const dark_gray_alt2_SliderTrack = n56
export const dark_gray_active_ListItem = n56
export const dark_gray_active_Card = n56
export const dark_gray_active_DrawerFrame = n56
export const dark_gray_active_Progress = n56
export const dark_gray_active_TooltipArrow = n56
export const dark_gray_active_SliderTrack = n56
const n57 = t([
  [12, 135],
  [13, 136],
  [14, 137],
  [15, 139],
  [16, 134],
  [23, 139],
  [24, 140],
  [25, 137],
  [26, 139],
  [28, 139],
])

export const dark_gray_alt2 = n57
export const dark_gray_Button = n57
export const dark_gray_Checkbox = n57
export const dark_gray_Switch = n57
export const dark_gray_TooltipContent = n57
export const dark_gray_RadioGroupItem = n57
export const dark_gray_Input = n57
export const dark_gray_TextArea = n57
export const dark_gray_alt1_Button = n57
export const dark_gray_alt1_Checkbox = n57
export const dark_gray_alt1_Switch = n57
export const dark_gray_alt1_TooltipContent = n57
export const dark_gray_alt1_RadioGroupItem = n57
export const dark_gray_alt1_Input = n57
export const dark_gray_alt1_TextArea = n57
export const dark_gray_alt2_Button = n57
export const dark_gray_alt2_Checkbox = n57
export const dark_gray_alt2_Switch = n57
export const dark_gray_alt2_TooltipContent = n57
export const dark_gray_alt2_RadioGroupItem = n57
export const dark_gray_alt2_Input = n57
export const dark_gray_alt2_TextArea = n57
export const dark_gray_active_Button = n57
export const dark_gray_active_Checkbox = n57
export const dark_gray_active_Switch = n57
export const dark_gray_active_TooltipContent = n57
export const dark_gray_active_RadioGroupItem = n57
export const dark_gray_active_Input = n57
export const dark_gray_active_TextArea = n57
const n58 = t([
  [12, 136],
  [13, 137],
  [14, 139],
  [15, 140],
  [16, 135],
  [23, 140],
  [24, 141],
  [25, 139],
  [26, 140],
  [28, 140],
])

export const dark_gray_active = n58
export const dark_gray_SliderTrackActive = n58
export const dark_gray_alt1_SliderTrackActive = n58
export const dark_gray_alt2_SliderTrackActive = n58
export const dark_gray_active_SliderTrackActive = n58
const n59 = t([[12, 211]])

export const light_SheetOverlay = n59
export const light_DialogOverlay = n59
export const light_ModalOverlay = n59
export const light_orange_SheetOverlay = n59
export const light_orange_DialogOverlay = n59
export const light_orange_ModalOverlay = n59
export const light_yellow_SheetOverlay = n59
export const light_yellow_DialogOverlay = n59
export const light_yellow_ModalOverlay = n59
export const light_green_SheetOverlay = n59
export const light_green_DialogOverlay = n59
export const light_green_ModalOverlay = n59
export const light_blue_SheetOverlay = n59
export const light_blue_DialogOverlay = n59
export const light_blue_ModalOverlay = n59
export const light_purple_SheetOverlay = n59
export const light_purple_DialogOverlay = n59
export const light_purple_ModalOverlay = n59
export const light_pink_SheetOverlay = n59
export const light_pink_DialogOverlay = n59
export const light_pink_ModalOverlay = n59
export const light_red_SheetOverlay = n59
export const light_red_DialogOverlay = n59
export const light_red_ModalOverlay = n59
export const light_gray_SheetOverlay = n59
export const light_gray_DialogOverlay = n59
export const light_gray_ModalOverlay = n59
export const light_alt1_SheetOverlay = n59
export const light_alt1_DialogOverlay = n59
export const light_alt1_ModalOverlay = n59
export const light_alt2_SheetOverlay = n59
export const light_alt2_DialogOverlay = n59
export const light_alt2_ModalOverlay = n59
export const light_active_SheetOverlay = n59
export const light_active_DialogOverlay = n59
export const light_active_ModalOverlay = n59
export const light_orange_alt1_SheetOverlay = n59
export const light_orange_alt1_DialogOverlay = n59
export const light_orange_alt1_ModalOverlay = n59
export const light_orange_alt2_SheetOverlay = n59
export const light_orange_alt2_DialogOverlay = n59
export const light_orange_alt2_ModalOverlay = n59
export const light_orange_active_SheetOverlay = n59
export const light_orange_active_DialogOverlay = n59
export const light_orange_active_ModalOverlay = n59
export const light_yellow_alt1_SheetOverlay = n59
export const light_yellow_alt1_DialogOverlay = n59
export const light_yellow_alt1_ModalOverlay = n59
export const light_yellow_alt2_SheetOverlay = n59
export const light_yellow_alt2_DialogOverlay = n59
export const light_yellow_alt2_ModalOverlay = n59
export const light_yellow_active_SheetOverlay = n59
export const light_yellow_active_DialogOverlay = n59
export const light_yellow_active_ModalOverlay = n59
export const light_green_alt1_SheetOverlay = n59
export const light_green_alt1_DialogOverlay = n59
export const light_green_alt1_ModalOverlay = n59
export const light_green_alt2_SheetOverlay = n59
export const light_green_alt2_DialogOverlay = n59
export const light_green_alt2_ModalOverlay = n59
export const light_green_active_SheetOverlay = n59
export const light_green_active_DialogOverlay = n59
export const light_green_active_ModalOverlay = n59
export const light_blue_alt1_SheetOverlay = n59
export const light_blue_alt1_DialogOverlay = n59
export const light_blue_alt1_ModalOverlay = n59
export const light_blue_alt2_SheetOverlay = n59
export const light_blue_alt2_DialogOverlay = n59
export const light_blue_alt2_ModalOverlay = n59
export const light_blue_active_SheetOverlay = n59
export const light_blue_active_DialogOverlay = n59
export const light_blue_active_ModalOverlay = n59
export const light_purple_alt1_SheetOverlay = n59
export const light_purple_alt1_DialogOverlay = n59
export const light_purple_alt1_ModalOverlay = n59
export const light_purple_alt2_SheetOverlay = n59
export const light_purple_alt2_DialogOverlay = n59
export const light_purple_alt2_ModalOverlay = n59
export const light_purple_active_SheetOverlay = n59
export const light_purple_active_DialogOverlay = n59
export const light_purple_active_ModalOverlay = n59
export const light_pink_alt1_SheetOverlay = n59
export const light_pink_alt1_DialogOverlay = n59
export const light_pink_alt1_ModalOverlay = n59
export const light_pink_alt2_SheetOverlay = n59
export const light_pink_alt2_DialogOverlay = n59
export const light_pink_alt2_ModalOverlay = n59
export const light_pink_active_SheetOverlay = n59
export const light_pink_active_DialogOverlay = n59
export const light_pink_active_ModalOverlay = n59
export const light_red_alt1_SheetOverlay = n59
export const light_red_alt1_DialogOverlay = n59
export const light_red_alt1_ModalOverlay = n59
export const light_red_alt2_SheetOverlay = n59
export const light_red_alt2_DialogOverlay = n59
export const light_red_alt2_ModalOverlay = n59
export const light_red_active_SheetOverlay = n59
export const light_red_active_DialogOverlay = n59
export const light_red_active_ModalOverlay = n59
export const light_gray_alt1_SheetOverlay = n59
export const light_gray_alt1_DialogOverlay = n59
export const light_gray_alt1_ModalOverlay = n59
export const light_gray_alt2_SheetOverlay = n59
export const light_gray_alt2_DialogOverlay = n59
export const light_gray_alt2_ModalOverlay = n59
export const light_gray_active_SheetOverlay = n59
export const light_gray_active_DialogOverlay = n59
export const light_gray_active_ModalOverlay = n59
const n60 = t([[12, 212]])

export const dark_SheetOverlay = n60
export const dark_DialogOverlay = n60
export const dark_ModalOverlay = n60
export const dark_orange_SheetOverlay = n60
export const dark_orange_DialogOverlay = n60
export const dark_orange_ModalOverlay = n60
export const dark_yellow_SheetOverlay = n60
export const dark_yellow_DialogOverlay = n60
export const dark_yellow_ModalOverlay = n60
export const dark_green_SheetOverlay = n60
export const dark_green_DialogOverlay = n60
export const dark_green_ModalOverlay = n60
export const dark_blue_SheetOverlay = n60
export const dark_blue_DialogOverlay = n60
export const dark_blue_ModalOverlay = n60
export const dark_purple_SheetOverlay = n60
export const dark_purple_DialogOverlay = n60
export const dark_purple_ModalOverlay = n60
export const dark_pink_SheetOverlay = n60
export const dark_pink_DialogOverlay = n60
export const dark_pink_ModalOverlay = n60
export const dark_red_SheetOverlay = n60
export const dark_red_DialogOverlay = n60
export const dark_red_ModalOverlay = n60
export const dark_gray_SheetOverlay = n60
export const dark_gray_DialogOverlay = n60
export const dark_gray_ModalOverlay = n60
export const dark_alt1_SheetOverlay = n60
export const dark_alt1_DialogOverlay = n60
export const dark_alt1_ModalOverlay = n60
export const dark_alt2_SheetOverlay = n60
export const dark_alt2_DialogOverlay = n60
export const dark_alt2_ModalOverlay = n60
export const dark_active_SheetOverlay = n60
export const dark_active_DialogOverlay = n60
export const dark_active_ModalOverlay = n60
export const dark_orange_alt1_SheetOverlay = n60
export const dark_orange_alt1_DialogOverlay = n60
export const dark_orange_alt1_ModalOverlay = n60
export const dark_orange_alt2_SheetOverlay = n60
export const dark_orange_alt2_DialogOverlay = n60
export const dark_orange_alt2_ModalOverlay = n60
export const dark_orange_active_SheetOverlay = n60
export const dark_orange_active_DialogOverlay = n60
export const dark_orange_active_ModalOverlay = n60
export const dark_yellow_alt1_SheetOverlay = n60
export const dark_yellow_alt1_DialogOverlay = n60
export const dark_yellow_alt1_ModalOverlay = n60
export const dark_yellow_alt2_SheetOverlay = n60
export const dark_yellow_alt2_DialogOverlay = n60
export const dark_yellow_alt2_ModalOverlay = n60
export const dark_yellow_active_SheetOverlay = n60
export const dark_yellow_active_DialogOverlay = n60
export const dark_yellow_active_ModalOverlay = n60
export const dark_green_alt1_SheetOverlay = n60
export const dark_green_alt1_DialogOverlay = n60
export const dark_green_alt1_ModalOverlay = n60
export const dark_green_alt2_SheetOverlay = n60
export const dark_green_alt2_DialogOverlay = n60
export const dark_green_alt2_ModalOverlay = n60
export const dark_green_active_SheetOverlay = n60
export const dark_green_active_DialogOverlay = n60
export const dark_green_active_ModalOverlay = n60
export const dark_blue_alt1_SheetOverlay = n60
export const dark_blue_alt1_DialogOverlay = n60
export const dark_blue_alt1_ModalOverlay = n60
export const dark_blue_alt2_SheetOverlay = n60
export const dark_blue_alt2_DialogOverlay = n60
export const dark_blue_alt2_ModalOverlay = n60
export const dark_blue_active_SheetOverlay = n60
export const dark_blue_active_DialogOverlay = n60
export const dark_blue_active_ModalOverlay = n60
export const dark_purple_alt1_SheetOverlay = n60
export const dark_purple_alt1_DialogOverlay = n60
export const dark_purple_alt1_ModalOverlay = n60
export const dark_purple_alt2_SheetOverlay = n60
export const dark_purple_alt2_DialogOverlay = n60
export const dark_purple_alt2_ModalOverlay = n60
export const dark_purple_active_SheetOverlay = n60
export const dark_purple_active_DialogOverlay = n60
export const dark_purple_active_ModalOverlay = n60
export const dark_pink_alt1_SheetOverlay = n60
export const dark_pink_alt1_DialogOverlay = n60
export const dark_pink_alt1_ModalOverlay = n60
export const dark_pink_alt2_SheetOverlay = n60
export const dark_pink_alt2_DialogOverlay = n60
export const dark_pink_alt2_ModalOverlay = n60
export const dark_pink_active_SheetOverlay = n60
export const dark_pink_active_DialogOverlay = n60
export const dark_pink_active_ModalOverlay = n60
export const dark_red_alt1_SheetOverlay = n60
export const dark_red_alt1_DialogOverlay = n60
export const dark_red_alt1_ModalOverlay = n60
export const dark_red_alt2_SheetOverlay = n60
export const dark_red_alt2_DialogOverlay = n60
export const dark_red_alt2_ModalOverlay = n60
export const dark_red_active_SheetOverlay = n60
export const dark_red_active_DialogOverlay = n60
export const dark_red_active_ModalOverlay = n60
export const dark_gray_alt1_SheetOverlay = n60
export const dark_gray_alt1_DialogOverlay = n60
export const dark_gray_alt1_ModalOverlay = n60
export const dark_gray_alt2_SheetOverlay = n60
export const dark_gray_alt2_DialogOverlay = n60
export const dark_gray_alt2_ModalOverlay = n60
export const dark_gray_active_SheetOverlay = n60
export const dark_gray_active_DialogOverlay = n60
export const dark_gray_active_ModalOverlay = n60
const n61 = t([
  [12, 10],
  [13, 9],
  [14, 8],
  [15, 7],
  [16, 11],
  [17, 13],
  [18, 0],
  [19, 1],
  [20, 0],
  [21, 1],
  [22, 12],
  [23, 7],
  [24, 6],
  [25, 8],
  [26, 7],
  [27, 3],
  [28, 7],
])

export const light_SwitchThumb = n61
export const light_SliderThumb = n61
export const light_Tooltip = n61
export const light_ProgressIndicator = n61
export const light_orange_SwitchThumb = n61
export const light_orange_SliderThumb = n61
export const light_orange_Tooltip = n61
export const light_orange_ProgressIndicator = n61
export const light_yellow_SwitchThumb = n61
export const light_yellow_SliderThumb = n61
export const light_yellow_Tooltip = n61
export const light_yellow_ProgressIndicator = n61
export const light_green_SwitchThumb = n61
export const light_green_SliderThumb = n61
export const light_green_Tooltip = n61
export const light_green_ProgressIndicator = n61
export const light_blue_SwitchThumb = n61
export const light_blue_SliderThumb = n61
export const light_blue_Tooltip = n61
export const light_blue_ProgressIndicator = n61
export const light_purple_SwitchThumb = n61
export const light_purple_SliderThumb = n61
export const light_purple_Tooltip = n61
export const light_purple_ProgressIndicator = n61
export const light_pink_SwitchThumb = n61
export const light_pink_SliderThumb = n61
export const light_pink_Tooltip = n61
export const light_pink_ProgressIndicator = n61
export const light_red_SwitchThumb = n61
export const light_red_SliderThumb = n61
export const light_red_Tooltip = n61
export const light_red_ProgressIndicator = n61
export const light_gray_SwitchThumb = n61
export const light_gray_SliderThumb = n61
export const light_gray_Tooltip = n61
export const light_gray_ProgressIndicator = n61
const n62 = t([
  [12, 120],
  [13, 119],
  [14, 118],
  [15, 117],
  [16, 0],
  [17, 12],
  [18, 110],
  [19, 111],
  [20, 110],
  [21, 111],
  [22, 13],
  [23, 117],
  [24, 116],
  [25, 118],
  [26, 117],
  [27, 113],
  [28, 117],
])

export const dark_SwitchThumb = n62
export const dark_SliderThumb = n62
export const dark_Tooltip = n62
export const dark_ProgressIndicator = n62
export const dark_orange_SwitchThumb = n62
export const dark_orange_SliderThumb = n62
export const dark_orange_Tooltip = n62
export const dark_orange_ProgressIndicator = n62
export const dark_yellow_SwitchThumb = n62
export const dark_yellow_SliderThumb = n62
export const dark_yellow_Tooltip = n62
export const dark_yellow_ProgressIndicator = n62
export const dark_green_SwitchThumb = n62
export const dark_green_SliderThumb = n62
export const dark_green_Tooltip = n62
export const dark_green_ProgressIndicator = n62
export const dark_blue_SwitchThumb = n62
export const dark_blue_SliderThumb = n62
export const dark_blue_Tooltip = n62
export const dark_blue_ProgressIndicator = n62
export const dark_purple_SwitchThumb = n62
export const dark_purple_SliderThumb = n62
export const dark_purple_Tooltip = n62
export const dark_purple_ProgressIndicator = n62
export const dark_pink_SwitchThumb = n62
export const dark_pink_SliderThumb = n62
export const dark_pink_Tooltip = n62
export const dark_pink_ProgressIndicator = n62
export const dark_red_SwitchThumb = n62
export const dark_red_SliderThumb = n62
export const dark_red_Tooltip = n62
export const dark_red_ProgressIndicator = n62
export const dark_gray_SwitchThumb = n62
export const dark_gray_SliderThumb = n62
export const dark_gray_Tooltip = n62
export const dark_gray_ProgressIndicator = n62
const n63 = t([
  [12, 9],
  [13, 8],
  [14, 7],
  [15, 6],
  [16, 10],
  [23, 6],
  [24, 5],
  [25, 7],
  [26, 6],
  [28, 6],
])

export const light_alt1_SwitchThumb = n63
export const light_alt1_SliderThumb = n63
export const light_alt1_Tooltip = n63
export const light_alt1_ProgressIndicator = n63
const n64 = t([
  [12, 8],
  [13, 7],
  [14, 6],
  [15, 5],
  [16, 9],
  [23, 5],
  [24, 4],
  [25, 6],
  [26, 5],
  [28, 5],
])

export const light_alt2_SwitchThumb = n64
export const light_alt2_SliderThumb = n64
export const light_alt2_Tooltip = n64
export const light_alt2_ProgressIndicator = n64
const n65 = t([
  [12, 7],
  [13, 6],
  [14, 5],
  [15, 4],
  [16, 8],
  [23, 4],
  [24, 3],
  [25, 5],
  [26, 4],
  [28, 4],
])

export const light_active_SwitchThumb = n65
export const light_active_SliderThumb = n65
export const light_active_Tooltip = n65
export const light_active_ProgressIndicator = n65
const n66 = t([
  [12, 119],
  [13, 118],
  [14, 117],
  [15, 116],
  [16, 120],
  [23, 116],
  [24, 115],
  [25, 117],
  [26, 116],
  [28, 116],
])

export const dark_alt1_SwitchThumb = n66
export const dark_alt1_SliderThumb = n66
export const dark_alt1_Tooltip = n66
export const dark_alt1_ProgressIndicator = n66
const n67 = t([
  [12, 118],
  [13, 117],
  [14, 116],
  [15, 115],
  [16, 119],
  [23, 115],
  [24, 114],
  [25, 116],
  [26, 115],
  [28, 115],
])

export const dark_alt2_SwitchThumb = n67
export const dark_alt2_SliderThumb = n67
export const dark_alt2_Tooltip = n67
export const dark_alt2_ProgressIndicator = n67
const n68 = t([
  [12, 117],
  [13, 116],
  [14, 115],
  [15, 114],
  [16, 118],
  [23, 114],
  [24, 113],
  [25, 115],
  [26, 114],
  [28, 114],
])

export const dark_active_SwitchThumb = n68
export const dark_active_SliderThumb = n68
export const dark_active_Tooltip = n68
export const dark_active_ProgressIndicator = n68
const n69 = t([
  [12, 58],
  [13, 57],
  [14, 56],
  [15, 55],
  [16, 59],
  [23, 55],
  [24, 53],
  [25, 56],
  [26, 55],
  [28, 55],
])

export const light_orange_alt1_SwitchThumb = n69
export const light_orange_alt1_SliderThumb = n69
export const light_orange_alt1_Tooltip = n69
export const light_orange_alt1_ProgressIndicator = n69
const n70 = t([
  [12, 57],
  [13, 56],
  [14, 55],
  [15, 53],
  [16, 58],
  [23, 53],
  [24, 52],
  [25, 55],
  [26, 53],
  [28, 53],
])

export const light_orange_alt2_SwitchThumb = n70
export const light_orange_alt2_SliderThumb = n70
export const light_orange_alt2_Tooltip = n70
export const light_orange_alt2_ProgressIndicator = n70
const n71 = t([
  [12, 56],
  [13, 55],
  [14, 53],
  [15, 52],
  [16, 57],
  [23, 52],
  [24, 51],
  [25, 53],
  [26, 52],
  [28, 52],
])

export const light_orange_active_SwitchThumb = n71
export const light_orange_active_SliderThumb = n71
export const light_orange_active_Tooltip = n71
export const light_orange_active_ProgressIndicator = n71
const n72 = t([
  [12, 106],
  [13, 105],
  [14, 104],
  [15, 103],
  [16, 107],
  [23, 103],
  [24, 101],
  [25, 104],
  [26, 103],
  [28, 103],
])

export const light_yellow_alt1_SwitchThumb = n72
export const light_yellow_alt1_SliderThumb = n72
export const light_yellow_alt1_Tooltip = n72
export const light_yellow_alt1_ProgressIndicator = n72
const n73 = t([
  [12, 105],
  [13, 104],
  [14, 103],
  [15, 101],
  [16, 106],
  [23, 101],
  [24, 100],
  [25, 103],
  [26, 101],
  [28, 101],
])

export const light_yellow_alt2_SwitchThumb = n73
export const light_yellow_alt2_SliderThumb = n73
export const light_yellow_alt2_Tooltip = n73
export const light_yellow_alt2_ProgressIndicator = n73
const n74 = t([
  [12, 104],
  [13, 103],
  [14, 101],
  [15, 100],
  [16, 105],
  [23, 100],
  [24, 99],
  [25, 101],
  [26, 100],
  [28, 100],
])

export const light_yellow_active_SwitchThumb = n74
export const light_yellow_active_SliderThumb = n74
export const light_yellow_active_Tooltip = n74
export const light_yellow_active_ProgressIndicator = n74
const n75 = t([
  [12, 46],
  [13, 45],
  [14, 44],
  [15, 43],
  [16, 47],
  [23, 43],
  [24, 41],
  [25, 44],
  [26, 43],
  [28, 43],
])

export const light_green_alt1_SwitchThumb = n75
export const light_green_alt1_SliderThumb = n75
export const light_green_alt1_Tooltip = n75
export const light_green_alt1_ProgressIndicator = n75
const n76 = t([
  [12, 45],
  [13, 44],
  [14, 43],
  [15, 41],
  [16, 46],
  [23, 41],
  [24, 40],
  [25, 43],
  [26, 41],
  [28, 41],
])

export const light_green_alt2_SwitchThumb = n76
export const light_green_alt2_SliderThumb = n76
export const light_green_alt2_Tooltip = n76
export const light_green_alt2_ProgressIndicator = n76
const n77 = t([
  [12, 44],
  [13, 43],
  [14, 41],
  [15, 40],
  [16, 45],
  [23, 40],
  [24, 39],
  [25, 41],
  [26, 40],
  [28, 40],
])

export const light_green_active_SwitchThumb = n77
export const light_green_active_SliderThumb = n77
export const light_green_active_Tooltip = n77
export const light_green_active_ProgressIndicator = n77
const n78 = t([
  [12, 24],
  [13, 23],
  [14, 22],
  [15, 21],
  [16, 25],
  [23, 21],
  [24, 19],
  [25, 22],
  [26, 21],
  [28, 21],
])

export const light_blue_alt1_SwitchThumb = n78
export const light_blue_alt1_SliderThumb = n78
export const light_blue_alt1_Tooltip = n78
export const light_blue_alt1_ProgressIndicator = n78
const n79 = t([
  [12, 23],
  [13, 22],
  [14, 21],
  [15, 19],
  [16, 24],
  [23, 19],
  [24, 18],
  [25, 21],
  [26, 19],
  [28, 19],
])

export const light_blue_alt2_SwitchThumb = n79
export const light_blue_alt2_SliderThumb = n79
export const light_blue_alt2_Tooltip = n79
export const light_blue_alt2_ProgressIndicator = n79
const n80 = t([
  [12, 22],
  [13, 21],
  [14, 19],
  [15, 18],
  [16, 23],
  [23, 18],
  [24, 17],
  [25, 19],
  [26, 18],
  [28, 18],
])

export const light_blue_active_SwitchThumb = n80
export const light_blue_active_SliderThumb = n80
export const light_blue_active_Tooltip = n80
export const light_blue_active_ProgressIndicator = n80
const n81 = t([
  [12, 82],
  [13, 81],
  [14, 80],
  [15, 79],
  [16, 83],
  [23, 79],
  [24, 77],
  [25, 80],
  [26, 79],
  [28, 79],
])

export const light_purple_alt1_SwitchThumb = n81
export const light_purple_alt1_SliderThumb = n81
export const light_purple_alt1_Tooltip = n81
export const light_purple_alt1_ProgressIndicator = n81
const n82 = t([
  [12, 81],
  [13, 80],
  [14, 79],
  [15, 77],
  [16, 82],
  [23, 77],
  [24, 76],
  [25, 79],
  [26, 77],
  [28, 77],
])

export const light_purple_alt2_SwitchThumb = n82
export const light_purple_alt2_SliderThumb = n82
export const light_purple_alt2_Tooltip = n82
export const light_purple_alt2_ProgressIndicator = n82
const n83 = t([
  [12, 80],
  [13, 79],
  [14, 77],
  [15, 76],
  [16, 81],
  [23, 76],
  [24, 75],
  [25, 77],
  [26, 76],
  [28, 76],
])

export const light_purple_active_SwitchThumb = n83
export const light_purple_active_SliderThumb = n83
export const light_purple_active_Tooltip = n83
export const light_purple_active_ProgressIndicator = n83
const n84 = t([
  [12, 70],
  [13, 69],
  [14, 68],
  [15, 67],
  [16, 71],
  [23, 67],
  [24, 65],
  [25, 68],
  [26, 67],
  [28, 67],
])

export const light_pink_alt1_SwitchThumb = n84
export const light_pink_alt1_SliderThumb = n84
export const light_pink_alt1_Tooltip = n84
export const light_pink_alt1_ProgressIndicator = n84
const n85 = t([
  [12, 69],
  [13, 68],
  [14, 67],
  [15, 65],
  [16, 70],
  [23, 65],
  [24, 64],
  [25, 67],
  [26, 65],
  [28, 65],
])

export const light_pink_alt2_SwitchThumb = n85
export const light_pink_alt2_SliderThumb = n85
export const light_pink_alt2_Tooltip = n85
export const light_pink_alt2_ProgressIndicator = n85
const n86 = t([
  [12, 68],
  [13, 67],
  [14, 65],
  [15, 64],
  [16, 69],
  [23, 64],
  [24, 63],
  [25, 65],
  [26, 64],
  [28, 64],
])

export const light_pink_active_SwitchThumb = n86
export const light_pink_active_SliderThumb = n86
export const light_pink_active_Tooltip = n86
export const light_pink_active_ProgressIndicator = n86
const n87 = t([
  [12, 94],
  [13, 93],
  [14, 92],
  [15, 91],
  [16, 95],
  [23, 91],
  [24, 89],
  [25, 92],
  [26, 91],
  [28, 91],
])

export const light_red_alt1_SwitchThumb = n87
export const light_red_alt1_SliderThumb = n87
export const light_red_alt1_Tooltip = n87
export const light_red_alt1_ProgressIndicator = n87
const n88 = t([
  [12, 93],
  [13, 92],
  [14, 91],
  [15, 89],
  [16, 94],
  [23, 89],
  [24, 88],
  [25, 91],
  [26, 89],
  [28, 89],
])

export const light_red_alt2_SwitchThumb = n88
export const light_red_alt2_SliderThumb = n88
export const light_red_alt2_Tooltip = n88
export const light_red_alt2_ProgressIndicator = n88
const n89 = t([
  [12, 92],
  [13, 91],
  [14, 89],
  [15, 88],
  [16, 93],
  [23, 88],
  [24, 87],
  [25, 89],
  [26, 88],
  [28, 88],
])

export const light_red_active_SwitchThumb = n89
export const light_red_active_SliderThumb = n89
export const light_red_active_Tooltip = n89
export const light_red_active_ProgressIndicator = n89
const n90 = t([
  [12, 35],
  [13, 34],
  [14, 8],
  [15, 33],
  [16, 11],
  [23, 33],
  [24, 31],
  [25, 8],
  [26, 33],
  [28, 33],
])

export const light_gray_alt1_SwitchThumb = n90
export const light_gray_alt1_SliderThumb = n90
export const light_gray_alt1_Tooltip = n90
export const light_gray_alt1_ProgressIndicator = n90
const n91 = t([
  [12, 34],
  [13, 8],
  [14, 33],
  [15, 31],
  [16, 35],
  [23, 31],
  [24, 30],
  [25, 33],
  [26, 31],
  [28, 31],
])

export const light_gray_alt2_SwitchThumb = n91
export const light_gray_alt2_SliderThumb = n91
export const light_gray_alt2_Tooltip = n91
export const light_gray_alt2_ProgressIndicator = n91
const n92 = t([
  [12, 8],
  [13, 33],
  [14, 31],
  [15, 30],
  [16, 34],
  [23, 30],
  [24, 29],
  [25, 31],
  [26, 30],
  [28, 30],
])

export const light_gray_active_SwitchThumb = n92
export const light_gray_active_SliderThumb = n92
export const light_gray_active_Tooltip = n92
export const light_gray_active_ProgressIndicator = n92
const n93 = t([
  [12, 163],
  [13, 162],
  [14, 56],
  [15, 161],
  [16, 164],
  [23, 161],
  [24, 159],
  [25, 56],
  [26, 161],
  [28, 161],
])

export const dark_orange_alt1_SwitchThumb = n93
export const dark_orange_alt1_SliderThumb = n93
export const dark_orange_alt1_Tooltip = n93
export const dark_orange_alt1_ProgressIndicator = n93
const n94 = t([
  [12, 162],
  [13, 56],
  [14, 161],
  [15, 159],
  [16, 163],
  [23, 159],
  [24, 158],
  [25, 161],
  [26, 159],
  [28, 159],
])

export const dark_orange_alt2_SwitchThumb = n94
export const dark_orange_alt2_SliderThumb = n94
export const dark_orange_alt2_Tooltip = n94
export const dark_orange_alt2_ProgressIndicator = n94
const n95 = t([
  [12, 56],
  [13, 161],
  [14, 159],
  [15, 158],
  [16, 162],
  [23, 158],
  [24, 157],
  [25, 159],
  [26, 158],
  [28, 158],
])

export const dark_orange_active_SwitchThumb = n95
export const dark_orange_active_SliderThumb = n95
export const dark_orange_active_Tooltip = n95
export const dark_orange_active_ProgressIndicator = n95
const n96 = t([
  [12, 207],
  [13, 206],
  [14, 104],
  [15, 205],
  [16, 208],
  [23, 205],
  [24, 203],
  [25, 104],
  [26, 205],
  [28, 205],
])

export const dark_yellow_alt1_SwitchThumb = n96
export const dark_yellow_alt1_SliderThumb = n96
export const dark_yellow_alt1_Tooltip = n96
export const dark_yellow_alt1_ProgressIndicator = n96
const n97 = t([
  [12, 206],
  [13, 104],
  [14, 205],
  [15, 203],
  [16, 207],
  [23, 203],
  [24, 202],
  [25, 205],
  [26, 203],
  [28, 203],
])

export const dark_yellow_alt2_SwitchThumb = n97
export const dark_yellow_alt2_SliderThumb = n97
export const dark_yellow_alt2_Tooltip = n97
export const dark_yellow_alt2_ProgressIndicator = n97
const n98 = t([
  [12, 104],
  [13, 205],
  [14, 203],
  [15, 202],
  [16, 206],
  [23, 202],
  [24, 201],
  [25, 203],
  [26, 202],
  [28, 202],
])

export const dark_yellow_active_SwitchThumb = n98
export const dark_yellow_active_SliderThumb = n98
export const dark_yellow_active_Tooltip = n98
export const dark_yellow_active_ProgressIndicator = n98
const n99 = t([
  [12, 152],
  [13, 151],
  [14, 44],
  [15, 150],
  [16, 153],
  [23, 150],
  [24, 148],
  [25, 44],
  [26, 150],
  [28, 150],
])

export const dark_green_alt1_SwitchThumb = n99
export const dark_green_alt1_SliderThumb = n99
export const dark_green_alt1_Tooltip = n99
export const dark_green_alt1_ProgressIndicator = n99
const n100 = t([
  [12, 151],
  [13, 44],
  [14, 150],
  [15, 148],
  [16, 152],
  [23, 148],
  [24, 147],
  [25, 150],
  [26, 148],
  [28, 148],
])

export const dark_green_alt2_SwitchThumb = n100
export const dark_green_alt2_SliderThumb = n100
export const dark_green_alt2_Tooltip = n100
export const dark_green_alt2_ProgressIndicator = n100
const n101 = t([
  [12, 44],
  [13, 150],
  [14, 148],
  [15, 147],
  [16, 151],
  [23, 147],
  [24, 146],
  [25, 148],
  [26, 147],
  [28, 147],
])

export const dark_green_active_SwitchThumb = n101
export const dark_green_active_SliderThumb = n101
export const dark_green_active_Tooltip = n101
export const dark_green_active_ProgressIndicator = n101
const n102 = t([
  [12, 130],
  [13, 129],
  [14, 22],
  [15, 128],
  [16, 131],
  [23, 128],
  [24, 126],
  [25, 22],
  [26, 128],
  [28, 128],
])

export const dark_blue_alt1_SwitchThumb = n102
export const dark_blue_alt1_SliderThumb = n102
export const dark_blue_alt1_Tooltip = n102
export const dark_blue_alt1_ProgressIndicator = n102
const n103 = t([
  [12, 129],
  [13, 22],
  [14, 128],
  [15, 126],
  [16, 130],
  [23, 126],
  [24, 125],
  [25, 128],
  [26, 126],
  [28, 126],
])

export const dark_blue_alt2_SwitchThumb = n103
export const dark_blue_alt2_SliderThumb = n103
export const dark_blue_alt2_Tooltip = n103
export const dark_blue_alt2_ProgressIndicator = n103
const n104 = t([
  [12, 22],
  [13, 128],
  [14, 126],
  [15, 125],
  [16, 129],
  [23, 125],
  [24, 124],
  [25, 126],
  [26, 125],
  [28, 125],
])

export const dark_blue_active_SwitchThumb = n104
export const dark_blue_active_SliderThumb = n104
export const dark_blue_active_Tooltip = n104
export const dark_blue_active_ProgressIndicator = n104
const n105 = t([
  [12, 185],
  [13, 184],
  [14, 80],
  [15, 183],
  [16, 186],
  [23, 183],
  [24, 181],
  [25, 80],
  [26, 183],
  [28, 183],
])

export const dark_purple_alt1_SwitchThumb = n105
export const dark_purple_alt1_SliderThumb = n105
export const dark_purple_alt1_Tooltip = n105
export const dark_purple_alt1_ProgressIndicator = n105
const n106 = t([
  [12, 184],
  [13, 80],
  [14, 183],
  [15, 181],
  [16, 185],
  [23, 181],
  [24, 180],
  [25, 183],
  [26, 181],
  [28, 181],
])

export const dark_purple_alt2_SwitchThumb = n106
export const dark_purple_alt2_SliderThumb = n106
export const dark_purple_alt2_Tooltip = n106
export const dark_purple_alt2_ProgressIndicator = n106
const n107 = t([
  [12, 80],
  [13, 183],
  [14, 181],
  [15, 180],
  [16, 184],
  [23, 180],
  [24, 179],
  [25, 181],
  [26, 180],
  [28, 180],
])

export const dark_purple_active_SwitchThumb = n107
export const dark_purple_active_SliderThumb = n107
export const dark_purple_active_Tooltip = n107
export const dark_purple_active_ProgressIndicator = n107
const n108 = t([
  [12, 174],
  [13, 173],
  [14, 68],
  [15, 172],
  [16, 175],
  [23, 172],
  [24, 170],
  [25, 68],
  [26, 172],
  [28, 172],
])

export const dark_pink_alt1_SwitchThumb = n108
export const dark_pink_alt1_SliderThumb = n108
export const dark_pink_alt1_Tooltip = n108
export const dark_pink_alt1_ProgressIndicator = n108
const n109 = t([
  [12, 173],
  [13, 68],
  [14, 172],
  [15, 170],
  [16, 174],
  [23, 170],
  [24, 169],
  [25, 172],
  [26, 170],
  [28, 170],
])

export const dark_pink_alt2_SwitchThumb = n109
export const dark_pink_alt2_SliderThumb = n109
export const dark_pink_alt2_Tooltip = n109
export const dark_pink_alt2_ProgressIndicator = n109
const n110 = t([
  [12, 68],
  [13, 172],
  [14, 170],
  [15, 169],
  [16, 173],
  [23, 169],
  [24, 168],
  [25, 170],
  [26, 169],
  [28, 169],
])

export const dark_pink_active_SwitchThumb = n110
export const dark_pink_active_SliderThumb = n110
export const dark_pink_active_Tooltip = n110
export const dark_pink_active_ProgressIndicator = n110
const n111 = t([
  [12, 196],
  [13, 195],
  [14, 92],
  [15, 194],
  [16, 197],
  [23, 194],
  [24, 192],
  [25, 92],
  [26, 194],
  [28, 194],
])

export const dark_red_alt1_SwitchThumb = n111
export const dark_red_alt1_SliderThumb = n111
export const dark_red_alt1_Tooltip = n111
export const dark_red_alt1_ProgressIndicator = n111
const n112 = t([
  [12, 195],
  [13, 92],
  [14, 194],
  [15, 192],
  [16, 196],
  [23, 192],
  [24, 191],
  [25, 194],
  [26, 192],
  [28, 192],
])

export const dark_red_alt2_SwitchThumb = n112
export const dark_red_alt2_SliderThumb = n112
export const dark_red_alt2_Tooltip = n112
export const dark_red_alt2_ProgressIndicator = n112
const n113 = t([
  [12, 92],
  [13, 194],
  [14, 192],
  [15, 191],
  [16, 195],
  [23, 191],
  [24, 190],
  [25, 192],
  [26, 191],
  [28, 191],
])

export const dark_red_active_SwitchThumb = n113
export const dark_red_active_SliderThumb = n113
export const dark_red_active_Tooltip = n113
export const dark_red_active_ProgressIndicator = n113
const n114 = t([
  [12, 142],
  [13, 141],
  [14, 140],
  [15, 139],
  [16, 29],
  [23, 139],
  [24, 137],
  [25, 140],
  [26, 139],
  [28, 139],
])

export const dark_gray_alt1_SwitchThumb = n114
export const dark_gray_alt1_SliderThumb = n114
export const dark_gray_alt1_Tooltip = n114
export const dark_gray_alt1_ProgressIndicator = n114
const n115 = t([
  [12, 141],
  [13, 140],
  [14, 139],
  [15, 137],
  [16, 142],
  [23, 137],
  [24, 136],
  [25, 139],
  [26, 137],
  [28, 137],
])

export const dark_gray_alt2_SwitchThumb = n115
export const dark_gray_alt2_SliderThumb = n115
export const dark_gray_alt2_Tooltip = n115
export const dark_gray_alt2_ProgressIndicator = n115
const n116 = t([
  [12, 140],
  [13, 139],
  [14, 137],
  [15, 136],
  [16, 141],
  [23, 136],
  [24, 135],
  [25, 137],
  [26, 136],
  [28, 136],
])

export const dark_gray_active_SwitchThumb = n116
export const dark_gray_active_SliderThumb = n116
export const dark_gray_active_Tooltip = n116
export const dark_gray_active_ProgressIndicator = n116
