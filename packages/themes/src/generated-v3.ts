type Theme = {
  background0: string
  background025: string
  background05: string
  background075: string
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
  color0: string
  color025: string
  color05: string
  color075: string
  background: string
  backgroundHover: string
  backgroundPress: string
  backgroundFocus: string
  borderColor: string
  borderColorHover: string
  borderColorFocus: string
  borderColorPress: string
  color: string
  colorHover: string
  colorPress: string
  colorFocus: string
  colorTransparent: string
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
  'hsla(24, 70.0%, 99.0%, 0.25)',
  'hsla(24, 70.0%, 99.0%, 0.5)',
  'hsla(24, 70.0%, 99.0%, 0.75)',
  'hsla(24, 94.0%, 50.0%, 0)',
  'hsla(24, 94.0%, 50.0%, 0.25)',
  'hsla(24, 94.0%, 50.0%, 0.5)',
  'hsla(24, 94.0%, 50.0%, 0.75)',
  'hsla(60, 54.0%, 98.5%, 0)',
  'hsla(60, 54.0%, 98.5%, 0.25)',
  'hsla(60, 54.0%, 98.5%, 0.5)',
  'hsla(60, 54.0%, 98.5%, 0.75)',
  'hsla(53, 92.0%, 50.0%, 0)',
  'hsla(53, 92.0%, 50.0%, 0.25)',
  'hsla(53, 92.0%, 50.0%, 0.5)',
  'hsla(53, 92.0%, 50.0%, 0.75)',
  'hsla(136, 50.0%, 98.9%, 0)',
  'hsla(136, 50.0%, 98.9%, 0.25)',
  'hsla(136, 50.0%, 98.9%, 0.5)',
  'hsla(136, 50.0%, 98.9%, 0.75)',
  'hsla(151, 55.0%, 41.5%, 0)',
  'hsla(151, 55.0%, 41.5%, 0.25)',
  'hsla(151, 55.0%, 41.5%, 0.5)',
  'hsla(151, 55.0%, 41.5%, 0.75)',
  'hsla(206, 100%, 99.2%, 0)',
  'hsla(206, 100%, 99.2%, 0.25)',
  'hsla(206, 100%, 99.2%, 0.5)',
  'hsla(206, 100%, 99.2%, 0.75)',
  'hsla(206, 100%, 50.0%, 0)',
  'hsla(206, 100%, 50.0%, 0.25)',
  'hsla(206, 100%, 50.0%, 0.5)',
  'hsla(206, 100%, 50.0%, 0.75)',
  'hsla(280, 65.0%, 99.4%, 0)',
  'hsla(280, 65.0%, 99.4%, 0.25)',
  'hsla(280, 65.0%, 99.4%, 0.5)',
  'hsla(280, 65.0%, 99.4%, 0.75)',
  'hsla(272, 51.0%, 54.0%, 0)',
  'hsla(272, 51.0%, 54.0%, 0.25)',
  'hsla(272, 51.0%, 54.0%, 0.5)',
  'hsla(272, 51.0%, 54.0%, 0.75)',
  'hsla(322, 100%, 99.4%, 0)',
  'hsla(322, 100%, 99.4%, 0.25)',
  'hsla(322, 100%, 99.4%, 0.5)',
  'hsla(322, 100%, 99.4%, 0.75)',
  'hsla(322, 65.0%, 54.5%, 0)',
  'hsla(322, 65.0%, 54.5%, 0.25)',
  'hsla(322, 65.0%, 54.5%, 0.5)',
  'hsla(322, 65.0%, 54.5%, 0.75)',
  'hsla(359, 100%, 99.4%, 0)',
  'hsla(359, 100%, 99.4%, 0.25)',
  'hsla(359, 100%, 99.4%, 0.5)',
  'hsla(359, 100%, 99.4%, 0.75)',
  'hsla(358, 75.0%, 59.0%, 0)',
  'hsla(358, 75.0%, 59.0%, 0.25)',
  'hsla(358, 75.0%, 59.0%, 0.5)',
  'hsla(358, 75.0%, 59.0%, 0.75)',
  'hsla(0, 0%, 99.0%, 0)',
  'hsla(0, 0%, 99.0%, 0.25)',
  'hsla(0, 0%, 99.0%, 0.5)',
  'hsla(0, 0%, 99.0%, 0.75)',
  'hsla(0, 0%, 56.1%, 0)',
  'hsla(0, 0%, 56.1%, 0.25)',
  'hsla(0, 0%, 56.1%, 0.5)',
  'hsla(0, 0%, 56.1%, 0.75)',
  'hsla(30, 70.0%, 7.2%, 0)',
  'hsla(30, 70.0%, 7.2%, 0.25)',
  'hsla(30, 70.0%, 7.2%, 0.5)',
  'hsla(30, 70.0%, 7.2%, 0.75)',
  'hsla(45, 100%, 5.5%, 0)',
  'hsla(45, 100%, 5.5%, 0.25)',
  'hsla(45, 100%, 5.5%, 0.5)',
  'hsla(45, 100%, 5.5%, 0.75)',
  'hsla(146, 30.0%, 7.4%, 0)',
  'hsla(146, 30.0%, 7.4%, 0.25)',
  'hsla(146, 30.0%, 7.4%, 0.5)',
  'hsla(146, 30.0%, 7.4%, 0.75)',
  'hsla(212, 35.0%, 9.2%, 0)',
  'hsla(212, 35.0%, 9.2%, 0.25)',
  'hsla(212, 35.0%, 9.2%, 0.5)',
  'hsla(212, 35.0%, 9.2%, 0.75)',
  'hsla(284, 20.0%, 9.6%, 0)',
  'hsla(284, 20.0%, 9.6%, 0.25)',
  'hsla(284, 20.0%, 9.6%, 0.5)',
  'hsla(284, 20.0%, 9.6%, 0.75)',
  'hsla(318, 25.0%, 9.6%, 0)',
  'hsla(318, 25.0%, 9.6%, 0.25)',
  'hsla(318, 25.0%, 9.6%, 0.5)',
  'hsla(318, 25.0%, 9.6%, 0.75)',
  'hsla(353, 23.0%, 9.8%, 0)',
  'hsla(353, 23.0%, 9.8%, 0.25)',
  'hsla(353, 23.0%, 9.8%, 0.5)',
  'hsla(353, 23.0%, 9.8%, 0.75)',
  'hsla(0, 0%, 8.5%, 0)',
  'hsla(0, 0%, 8.5%, 0.25)',
  'hsla(0, 0%, 8.5%, 0.5)',
  'hsla(0, 0%, 8.5%, 0.75)',
  'hsla(0, 0%, 43.9%, 0)',
  'hsla(0, 0%, 43.9%, 0.25)',
  'hsla(0, 0%, 43.9%, 0.5)',
  'hsla(0, 0%, 43.9%, 0.75)',
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.9)',
]

const ks = [
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
  'borderColorFocus',
  'borderColorPress',
  'color',
  'colorHover',
  'colorPress',
  'colorFocus',
  'colorTransparent',
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
  [12, 12],
  [13, 13],
  [14, 14],
  [15, 15],
  [16, 16],
  [17, 17],
  [18, 18],
  [19, 19],
  [20, 4],
  [21, 5],
  [22, 6],
  [23, 4],
  [24, 7],
  [25, 8],
  [26, 5],
  [27, 7],
  [28, 15],
  [29, 14],
  [30, 15],
  [31, 14],
  [32, 16],
  [33, 12],
  [34, 17],
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
  [49, 34],
  [50, 35],
  [51, 36],
  [52, 37],
  [53, 38],
  [54, 39],
  [55, 12],
  [56, 40],
  [57, 41],
  [58, 15],
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
  [126, 109],
  [127, 110],
  [128, 111],
  [129, 112],
  [130, 113],
  [131, 114],
  [132, 114],
  [133, 115],
  [134, 115],
])

export const light = n1
const n2 = t([
  [0, 16],
  [1, 17],
  [2, 18],
  [3, 19],
  [4, 116],
  [5, 117],
  [6, 118],
  [7, 119],
  [8, 120],
  [9, 121],
  [10, 122],
  [11, 123],
  [12, 124],
  [13, 125],
  [14, 126],
  [15, 4],
  [16, 0],
  [17, 1],
  [18, 2],
  [19, 3],
  [20, 116],
  [21, 117],
  [22, 118],
  [23, 116],
  [24, 119],
  [25, 120],
  [26, 117],
  [27, 119],
  [28, 4],
  [29, 126],
  [30, 4],
  [31, 126],
  [32, 0],
  [33, 124],
  [34, 1],
  [35, 127],
  [36, 128],
  [37, 129],
  [38, 130],
  [39, 131],
  [40, 132],
  [41, 133],
  [42, 134],
  [43, 28],
  [44, 135],
  [45, 136],
  [46, 137],
  [47, 138],
  [48, 139],
  [49, 140],
  [50, 141],
  [51, 142],
  [52, 143],
  [53, 144],
  [54, 145],
  [55, 146],
  [56, 147],
  [57, 148],
  [58, 35],
  [59, 149],
  [60, 150],
  [61, 151],
  [62, 152],
  [63, 153],
  [64, 154],
  [65, 155],
  [66, 156],
  [67, 50],
  [68, 157],
  [69, 158],
  [70, 159],
  [71, 160],
  [72, 161],
  [73, 162],
  [74, 163],
  [75, 164],
  [76, 165],
  [77, 166],
  [78, 167],
  [79, 62],
  [80, 168],
  [81, 169],
  [82, 170],
  [83, 171],
  [84, 172],
  [85, 173],
  [86, 174],
  [87, 175],
  [88, 176],
  [89, 177],
  [90, 178],
  [91, 74],
  [92, 179],
  [93, 180],
  [94, 181],
  [95, 182],
  [96, 183],
  [97, 184],
  [98, 185],
  [99, 186],
  [100, 187],
  [101, 188],
  [102, 189],
  [103, 86],
  [104, 190],
  [105, 191],
  [106, 192],
  [107, 193],
  [108, 194],
  [109, 195],
  [110, 196],
  [111, 197],
  [112, 198],
  [113, 199],
  [114, 200],
  [115, 98],
  [116, 201],
  [117, 202],
  [118, 203],
  [119, 204],
  [120, 205],
  [121, 206],
  [122, 207],
  [123, 208],
  [124, 209],
  [125, 210],
  [126, 211],
  [127, 110],
  [128, 212],
  [129, 213],
  [130, 214],
  [131, 215],
  [132, 215],
  [133, 216],
  [134, 216],
])

export const dark = n2
const n3 = t([
  [0, 217],
  [1, 218],
  [2, 219],
  [3, 220],
  [4, 54],
  [5, 55],
  [6, 56],
  [7, 57],
  [8, 58],
  [9, 59],
  [10, 60],
  [11, 61],
  [12, 62],
  [13, 63],
  [14, 64],
  [15, 65],
  [16, 221],
  [17, 222],
  [18, 223],
  [19, 224],
  [20, 54],
  [21, 55],
  [22, 56],
  [23, 54],
  [24, 57],
  [25, 58],
  [26, 55],
  [27, 57],
  [28, 65],
  [29, 64],
  [30, 65],
  [31, 64],
  [32, 221],
  [33, 62],
  [34, 222],
])

export const light_orange = n3
const n4 = t([
  [0, 225],
  [1, 226],
  [2, 227],
  [3, 228],
  [4, 102],
  [5, 103],
  [6, 104],
  [7, 105],
  [8, 106],
  [9, 107],
  [10, 108],
  [11, 109],
  [12, 110],
  [13, 111],
  [14, 112],
  [15, 113],
  [16, 229],
  [17, 230],
  [18, 231],
  [19, 232],
  [20, 102],
  [21, 103],
  [22, 104],
  [23, 102],
  [24, 105],
  [25, 106],
  [26, 103],
  [27, 105],
  [28, 113],
  [29, 112],
  [30, 113],
  [31, 112],
  [32, 229],
  [33, 110],
  [34, 230],
])

export const light_yellow = n4
const n5 = t([
  [0, 233],
  [1, 234],
  [2, 235],
  [3, 236],
  [4, 42],
  [5, 43],
  [6, 44],
  [7, 45],
  [8, 46],
  [9, 47],
  [10, 48],
  [11, 49],
  [12, 50],
  [13, 51],
  [14, 52],
  [15, 53],
  [16, 237],
  [17, 238],
  [18, 239],
  [19, 240],
  [20, 42],
  [21, 43],
  [22, 44],
  [23, 42],
  [24, 45],
  [25, 46],
  [26, 43],
  [27, 45],
  [28, 53],
  [29, 52],
  [30, 53],
  [31, 52],
  [32, 237],
  [33, 50],
  [34, 238],
])

export const light_green = n5
const n6 = t([
  [0, 241],
  [1, 242],
  [2, 243],
  [3, 244],
  [4, 20],
  [5, 21],
  [6, 22],
  [7, 23],
  [8, 24],
  [9, 25],
  [10, 26],
  [11, 27],
  [12, 28],
  [13, 29],
  [14, 30],
  [15, 31],
  [16, 245],
  [17, 246],
  [18, 247],
  [19, 248],
  [20, 20],
  [21, 21],
  [22, 22],
  [23, 20],
  [24, 23],
  [25, 24],
  [26, 21],
  [27, 23],
  [28, 31],
  [29, 30],
  [30, 31],
  [31, 30],
  [32, 245],
  [33, 28],
  [34, 246],
])

export const light_blue = n6
const n7 = t([
  [0, 249],
  [1, 250],
  [2, 251],
  [3, 252],
  [4, 78],
  [5, 79],
  [6, 80],
  [7, 81],
  [8, 82],
  [9, 83],
  [10, 84],
  [11, 85],
  [12, 86],
  [13, 87],
  [14, 88],
  [15, 89],
  [16, 253],
  [17, 254],
  [18, 255],
  [19, 256],
  [20, 78],
  [21, 79],
  [22, 80],
  [23, 78],
  [24, 81],
  [25, 82],
  [26, 79],
  [27, 81],
  [28, 89],
  [29, 88],
  [30, 89],
  [31, 88],
  [32, 253],
  [33, 86],
  [34, 254],
])

export const light_purple = n7
const n8 = t([
  [0, 257],
  [1, 258],
  [2, 259],
  [3, 260],
  [4, 66],
  [5, 67],
  [6, 68],
  [7, 69],
  [8, 70],
  [9, 71],
  [10, 72],
  [11, 73],
  [12, 74],
  [13, 75],
  [14, 76],
  [15, 77],
  [16, 261],
  [17, 262],
  [18, 263],
  [19, 264],
  [20, 66],
  [21, 67],
  [22, 68],
  [23, 66],
  [24, 69],
  [25, 70],
  [26, 67],
  [27, 69],
  [28, 77],
  [29, 76],
  [30, 77],
  [31, 76],
  [32, 261],
  [33, 74],
  [34, 262],
])

export const light_pink = n8
const n9 = t([
  [0, 265],
  [1, 266],
  [2, 267],
  [3, 268],
  [4, 90],
  [5, 91],
  [6, 92],
  [7, 93],
  [8, 94],
  [9, 95],
  [10, 96],
  [11, 97],
  [12, 98],
  [13, 99],
  [14, 100],
  [15, 101],
  [16, 269],
  [17, 270],
  [18, 271],
  [19, 272],
  [20, 90],
  [21, 91],
  [22, 92],
  [23, 90],
  [24, 93],
  [25, 94],
  [26, 91],
  [27, 93],
  [28, 101],
  [29, 100],
  [30, 101],
  [31, 100],
  [32, 269],
  [33, 98],
  [34, 270],
])

export const light_red = n9
const n10 = t([
  [0, 273],
  [1, 274],
  [2, 275],
  [3, 276],
  [4, 32],
  [5, 33],
  [6, 34],
  [7, 35],
  [8, 36],
  [9, 37],
  [10, 38],
  [11, 39],
  [12, 12],
  [13, 40],
  [14, 41],
  [15, 15],
  [16, 277],
  [17, 278],
  [18, 279],
  [19, 280],
  [20, 32],
  [21, 33],
  [22, 34],
  [23, 32],
  [24, 35],
  [25, 36],
  [26, 33],
  [27, 35],
  [28, 15],
  [29, 41],
  [30, 15],
  [31, 41],
  [32, 277],
  [33, 12],
  [34, 278],
])

export const light_gray = n10
const n11 = t([
  [0, 281],
  [1, 282],
  [2, 283],
  [3, 284],
  [4, 160],
  [5, 161],
  [6, 162],
  [7, 163],
  [8, 164],
  [9, 165],
  [10, 166],
  [11, 167],
  [12, 62],
  [13, 168],
  [14, 169],
  [15, 170],
  [16, 221],
  [17, 222],
  [18, 223],
  [19, 224],
  [20, 160],
  [21, 161],
  [22, 162],
  [23, 160],
  [24, 163],
  [25, 164],
  [26, 161],
  [27, 163],
  [28, 170],
  [29, 169],
  [30, 170],
  [31, 169],
  [32, 221],
  [33, 62],
  [34, 222],
])

export const dark_orange = n11
const n12 = t([
  [0, 285],
  [1, 286],
  [2, 287],
  [3, 288],
  [4, 204],
  [5, 205],
  [6, 206],
  [7, 207],
  [8, 208],
  [9, 209],
  [10, 210],
  [11, 211],
  [12, 110],
  [13, 212],
  [14, 213],
  [15, 214],
  [16, 229],
  [17, 230],
  [18, 231],
  [19, 232],
  [20, 204],
  [21, 205],
  [22, 206],
  [23, 204],
  [24, 207],
  [25, 208],
  [26, 205],
  [27, 207],
  [28, 214],
  [29, 213],
  [30, 214],
  [31, 213],
  [32, 229],
  [33, 110],
  [34, 230],
])

export const dark_yellow = n12
const n13 = t([
  [0, 289],
  [1, 290],
  [2, 291],
  [3, 292],
  [4, 149],
  [5, 150],
  [6, 151],
  [7, 152],
  [8, 153],
  [9, 154],
  [10, 155],
  [11, 156],
  [12, 50],
  [13, 157],
  [14, 158],
  [15, 159],
  [16, 237],
  [17, 238],
  [18, 239],
  [19, 240],
  [20, 149],
  [21, 150],
  [22, 151],
  [23, 149],
  [24, 152],
  [25, 153],
  [26, 150],
  [27, 152],
  [28, 159],
  [29, 158],
  [30, 159],
  [31, 158],
  [32, 237],
  [33, 50],
  [34, 238],
])

export const dark_green = n13
const n14 = t([
  [0, 293],
  [1, 294],
  [2, 295],
  [3, 296],
  [4, 127],
  [5, 128],
  [6, 129],
  [7, 130],
  [8, 131],
  [9, 132],
  [10, 133],
  [11, 134],
  [12, 28],
  [13, 135],
  [14, 136],
  [15, 137],
  [16, 245],
  [17, 246],
  [18, 247],
  [19, 248],
  [20, 127],
  [21, 128],
  [22, 129],
  [23, 127],
  [24, 130],
  [25, 131],
  [26, 128],
  [27, 130],
  [28, 137],
  [29, 136],
  [30, 137],
  [31, 136],
  [32, 245],
  [33, 28],
  [34, 246],
])

export const dark_blue = n14
const n15 = t([
  [0, 297],
  [1, 298],
  [2, 299],
  [3, 300],
  [4, 182],
  [5, 183],
  [6, 184],
  [7, 185],
  [8, 186],
  [9, 187],
  [10, 188],
  [11, 189],
  [12, 86],
  [13, 190],
  [14, 191],
  [15, 192],
  [16, 253],
  [17, 254],
  [18, 255],
  [19, 256],
  [20, 182],
  [21, 183],
  [22, 184],
  [23, 182],
  [24, 185],
  [25, 186],
  [26, 183],
  [27, 185],
  [28, 192],
  [29, 191],
  [30, 192],
  [31, 191],
  [32, 253],
  [33, 86],
  [34, 254],
])

export const dark_purple = n15
const n16 = t([
  [0, 301],
  [1, 302],
  [2, 303],
  [3, 304],
  [4, 171],
  [5, 172],
  [6, 173],
  [7, 174],
  [8, 175],
  [9, 176],
  [10, 177],
  [11, 178],
  [12, 74],
  [13, 179],
  [14, 180],
  [15, 181],
  [16, 261],
  [17, 262],
  [18, 263],
  [19, 264],
  [20, 171],
  [21, 172],
  [22, 173],
  [23, 171],
  [24, 174],
  [25, 175],
  [26, 172],
  [27, 174],
  [28, 181],
  [29, 180],
  [30, 181],
  [31, 180],
  [32, 261],
  [33, 74],
  [34, 262],
])

export const dark_pink = n16
const n17 = t([
  [0, 305],
  [1, 306],
  [2, 307],
  [3, 308],
  [4, 193],
  [5, 194],
  [6, 195],
  [7, 196],
  [8, 197],
  [9, 198],
  [10, 199],
  [11, 200],
  [12, 98],
  [13, 201],
  [14, 202],
  [15, 203],
  [16, 269],
  [17, 270],
  [18, 271],
  [19, 272],
  [20, 193],
  [21, 194],
  [22, 195],
  [23, 193],
  [24, 196],
  [25, 197],
  [26, 194],
  [27, 196],
  [28, 203],
  [29, 202],
  [30, 203],
  [31, 202],
  [32, 269],
  [33, 98],
  [34, 270],
])

export const dark_red = n17
const n18 = t([
  [0, 309],
  [1, 310],
  [2, 311],
  [3, 312],
  [4, 138],
  [5, 139],
  [6, 140],
  [7, 141],
  [8, 142],
  [9, 143],
  [10, 144],
  [11, 145],
  [12, 146],
  [13, 147],
  [14, 148],
  [15, 35],
  [16, 313],
  [17, 314],
  [18, 315],
  [19, 316],
  [20, 138],
  [21, 139],
  [22, 140],
  [23, 138],
  [24, 141],
  [25, 142],
  [26, 139],
  [27, 141],
  [28, 35],
  [29, 148],
  [30, 35],
  [31, 148],
  [32, 313],
  [33, 146],
  [34, 314],
])

export const dark_gray = n18
const n19 = t([
  [28, 14],
  [29, 13],
  [30, 14],
  [31, 13],
])

export const light_alt1 = n19
const n20 = t([
  [28, 13],
  [29, 12],
  [30, 13],
  [31, 12],
])

export const light_alt2 = n20
const n21 = t([
  [20, 7],
  [21, 8],
  [22, 9],
  [23, 7],
  [24, 10],
  [25, 11],
  [26, 8],
  [27, 10],
])

export const light_active = n21
export const light_surface3 = n21
export const light_Button = n21
export const light_SliderTrackActive = n21
export const light_active_SliderTrackActive = n21
const n22 = t([
  [20, 5],
  [21, 6],
  [22, 7],
  [23, 5],
  [24, 8],
  [25, 9],
  [26, 6],
  [27, 8],
])

export const light_surface1 = n22
export const light_ListItem = n22
export const light_SelectTrigger = n22
export const light_Card = n22
export const light_Progress = n22
export const light_TooltipArrow = n22
export const light_SliderTrack = n22
export const light_Input = n22
export const light_TextArea = n22
export const light_active_ListItem = n22
export const light_active_Progress = n22
export const light_active_TooltipArrow = n22
export const light_active_SliderTrack = n22
const n23 = t([
  [20, 6],
  [21, 7],
  [22, 8],
  [23, 6],
  [24, 9],
  [25, 10],
  [26, 7],
  [27, 9],
])

export const light_surface2 = n23
export const light_Checkbox = n23
export const light_Switch = n23
export const light_TooltipContent = n23
export const light_RadioGroupItem = n23
const n24 = t([
  [20, 9],
  [21, 9],
  [22, 11],
  [23, 9],
  [24, 12],
  [25, 12],
  [26, 10],
  [27, 12],
])

export const light_surface4 = n24
export const light_active_SelectTrigger = n24
export const light_active_Card = n24
export const light_active_Button = n24
export const light_active_Checkbox = n24
export const light_active_Switch = n24
export const light_active_TooltipContent = n24
export const light_active_RadioGroupItem = n24
export const light_active_Input = n24
export const light_active_TextArea = n24
const n25 = t([
  [28, 126],
  [29, 125],
  [30, 126],
  [31, 125],
])

export const dark_alt1 = n25
const n26 = t([
  [28, 125],
  [29, 124],
  [30, 125],
  [31, 124],
])

export const dark_alt2 = n26
const n27 = t([
  [20, 119],
  [21, 120],
  [22, 121],
  [23, 119],
  [24, 122],
  [25, 123],
  [26, 120],
  [27, 122],
])

export const dark_active = n27
export const dark_surface3 = n27
export const dark_Button = n27
export const dark_SliderTrackActive = n27
export const dark_active_SliderTrackActive = n27
const n28 = t([
  [20, 117],
  [21, 118],
  [22, 119],
  [23, 117],
  [24, 120],
  [25, 121],
  [26, 118],
  [27, 120],
])

export const dark_surface1 = n28
export const dark_ListItem = n28
export const dark_SelectTrigger = n28
export const dark_Card = n28
export const dark_Progress = n28
export const dark_TooltipArrow = n28
export const dark_SliderTrack = n28
export const dark_Input = n28
export const dark_TextArea = n28
export const dark_active_ListItem = n28
export const dark_active_Progress = n28
export const dark_active_TooltipArrow = n28
export const dark_active_SliderTrack = n28
const n29 = t([
  [20, 118],
  [21, 119],
  [22, 120],
  [23, 118],
  [24, 121],
  [25, 122],
  [26, 119],
  [27, 121],
])

export const dark_surface2 = n29
export const dark_Checkbox = n29
export const dark_Switch = n29
export const dark_TooltipContent = n29
export const dark_RadioGroupItem = n29
const n30 = t([
  [20, 121],
  [21, 121],
  [22, 123],
  [23, 121],
  [24, 124],
  [25, 124],
  [26, 122],
  [27, 124],
])

export const dark_surface4 = n30
export const dark_active_SelectTrigger = n30
export const dark_active_Card = n30
export const dark_active_Button = n30
export const dark_active_Checkbox = n30
export const dark_active_Switch = n30
export const dark_active_TooltipContent = n30
export const dark_active_RadioGroupItem = n30
export const dark_active_Input = n30
export const dark_active_TextArea = n30
const n31 = t([
  [28, 64],
  [29, 63],
  [30, 64],
  [31, 63],
])

export const light_orange_alt1 = n31
const n32 = t([
  [28, 63],
  [29, 62],
  [30, 63],
  [31, 62],
])

export const light_orange_alt2 = n32
const n33 = t([
  [20, 57],
  [21, 58],
  [22, 59],
  [23, 57],
  [24, 60],
  [25, 61],
  [26, 58],
  [27, 60],
])

export const light_orange_active = n33
export const light_orange_surface3 = n33
export const light_orange_Button = n33
export const light_orange_SliderTrackActive = n33
export const light_orange_active_SliderTrackActive = n33
const n34 = t([
  [20, 55],
  [21, 56],
  [22, 57],
  [23, 55],
  [24, 58],
  [25, 59],
  [26, 56],
  [27, 58],
])

export const light_orange_surface1 = n34
export const light_orange_ListItem = n34
export const light_orange_SelectTrigger = n34
export const light_orange_Card = n34
export const light_orange_Progress = n34
export const light_orange_TooltipArrow = n34
export const light_orange_SliderTrack = n34
export const light_orange_Input = n34
export const light_orange_TextArea = n34
export const light_orange_active_ListItem = n34
export const light_orange_active_Progress = n34
export const light_orange_active_TooltipArrow = n34
export const light_orange_active_SliderTrack = n34
const n35 = t([
  [20, 56],
  [21, 57],
  [22, 58],
  [23, 56],
  [24, 59],
  [25, 60],
  [26, 57],
  [27, 59],
])

export const light_orange_surface2 = n35
export const light_orange_Checkbox = n35
export const light_orange_Switch = n35
export const light_orange_TooltipContent = n35
export const light_orange_RadioGroupItem = n35
const n36 = t([
  [20, 59],
  [21, 59],
  [22, 61],
  [23, 59],
  [24, 62],
  [25, 62],
  [26, 60],
  [27, 62],
])

export const light_orange_surface4 = n36
export const light_orange_active_SelectTrigger = n36
export const light_orange_active_Card = n36
export const light_orange_active_Button = n36
export const light_orange_active_Checkbox = n36
export const light_orange_active_Switch = n36
export const light_orange_active_TooltipContent = n36
export const light_orange_active_RadioGroupItem = n36
export const light_orange_active_Input = n36
export const light_orange_active_TextArea = n36
const n37 = t([
  [28, 112],
  [29, 111],
  [30, 112],
  [31, 111],
])

export const light_yellow_alt1 = n37
const n38 = t([
  [28, 111],
  [29, 110],
  [30, 111],
  [31, 110],
])

export const light_yellow_alt2 = n38
const n39 = t([
  [20, 105],
  [21, 106],
  [22, 107],
  [23, 105],
  [24, 108],
  [25, 109],
  [26, 106],
  [27, 108],
])

export const light_yellow_active = n39
export const light_yellow_surface3 = n39
export const light_yellow_Button = n39
export const light_yellow_SliderTrackActive = n39
export const light_yellow_active_SliderTrackActive = n39
const n40 = t([
  [20, 103],
  [21, 104],
  [22, 105],
  [23, 103],
  [24, 106],
  [25, 107],
  [26, 104],
  [27, 106],
])

export const light_yellow_surface1 = n40
export const light_yellow_ListItem = n40
export const light_yellow_SelectTrigger = n40
export const light_yellow_Card = n40
export const light_yellow_Progress = n40
export const light_yellow_TooltipArrow = n40
export const light_yellow_SliderTrack = n40
export const light_yellow_Input = n40
export const light_yellow_TextArea = n40
export const light_yellow_active_ListItem = n40
export const light_yellow_active_Progress = n40
export const light_yellow_active_TooltipArrow = n40
export const light_yellow_active_SliderTrack = n40
const n41 = t([
  [20, 104],
  [21, 105],
  [22, 106],
  [23, 104],
  [24, 107],
  [25, 108],
  [26, 105],
  [27, 107],
])

export const light_yellow_surface2 = n41
export const light_yellow_Checkbox = n41
export const light_yellow_Switch = n41
export const light_yellow_TooltipContent = n41
export const light_yellow_RadioGroupItem = n41
const n42 = t([
  [20, 107],
  [21, 107],
  [22, 109],
  [23, 107],
  [24, 110],
  [25, 110],
  [26, 108],
  [27, 110],
])

export const light_yellow_surface4 = n42
export const light_yellow_active_SelectTrigger = n42
export const light_yellow_active_Card = n42
export const light_yellow_active_Button = n42
export const light_yellow_active_Checkbox = n42
export const light_yellow_active_Switch = n42
export const light_yellow_active_TooltipContent = n42
export const light_yellow_active_RadioGroupItem = n42
export const light_yellow_active_Input = n42
export const light_yellow_active_TextArea = n42
const n43 = t([
  [28, 52],
  [29, 51],
  [30, 52],
  [31, 51],
])

export const light_green_alt1 = n43
const n44 = t([
  [28, 51],
  [29, 50],
  [30, 51],
  [31, 50],
])

export const light_green_alt2 = n44
const n45 = t([
  [20, 45],
  [21, 46],
  [22, 47],
  [23, 45],
  [24, 48],
  [25, 49],
  [26, 46],
  [27, 48],
])

export const light_green_active = n45
export const light_green_surface3 = n45
export const light_green_Button = n45
export const light_green_SliderTrackActive = n45
export const light_green_active_SliderTrackActive = n45
const n46 = t([
  [20, 43],
  [21, 44],
  [22, 45],
  [23, 43],
  [24, 46],
  [25, 47],
  [26, 44],
  [27, 46],
])

export const light_green_surface1 = n46
export const light_green_ListItem = n46
export const light_green_SelectTrigger = n46
export const light_green_Card = n46
export const light_green_Progress = n46
export const light_green_TooltipArrow = n46
export const light_green_SliderTrack = n46
export const light_green_Input = n46
export const light_green_TextArea = n46
export const light_green_active_ListItem = n46
export const light_green_active_Progress = n46
export const light_green_active_TooltipArrow = n46
export const light_green_active_SliderTrack = n46
const n47 = t([
  [20, 44],
  [21, 45],
  [22, 46],
  [23, 44],
  [24, 47],
  [25, 48],
  [26, 45],
  [27, 47],
])

export const light_green_surface2 = n47
export const light_green_Checkbox = n47
export const light_green_Switch = n47
export const light_green_TooltipContent = n47
export const light_green_RadioGroupItem = n47
const n48 = t([
  [20, 47],
  [21, 47],
  [22, 49],
  [23, 47],
  [24, 50],
  [25, 50],
  [26, 48],
  [27, 50],
])

export const light_green_surface4 = n48
export const light_green_active_SelectTrigger = n48
export const light_green_active_Card = n48
export const light_green_active_Button = n48
export const light_green_active_Checkbox = n48
export const light_green_active_Switch = n48
export const light_green_active_TooltipContent = n48
export const light_green_active_RadioGroupItem = n48
export const light_green_active_Input = n48
export const light_green_active_TextArea = n48
const n49 = t([
  [28, 30],
  [29, 29],
  [30, 30],
  [31, 29],
])

export const light_blue_alt1 = n49
const n50 = t([
  [28, 29],
  [29, 28],
  [30, 29],
  [31, 28],
])

export const light_blue_alt2 = n50
const n51 = t([
  [20, 23],
  [21, 24],
  [22, 25],
  [23, 23],
  [24, 26],
  [25, 27],
  [26, 24],
  [27, 26],
])

export const light_blue_active = n51
export const light_blue_surface3 = n51
export const light_blue_Button = n51
export const light_blue_SliderTrackActive = n51
export const light_blue_active_SliderTrackActive = n51
const n52 = t([
  [20, 21],
  [21, 22],
  [22, 23],
  [23, 21],
  [24, 24],
  [25, 25],
  [26, 22],
  [27, 24],
])

export const light_blue_surface1 = n52
export const light_blue_ListItem = n52
export const light_blue_SelectTrigger = n52
export const light_blue_Card = n52
export const light_blue_Progress = n52
export const light_blue_TooltipArrow = n52
export const light_blue_SliderTrack = n52
export const light_blue_Input = n52
export const light_blue_TextArea = n52
export const light_blue_active_ListItem = n52
export const light_blue_active_Progress = n52
export const light_blue_active_TooltipArrow = n52
export const light_blue_active_SliderTrack = n52
const n53 = t([
  [20, 22],
  [21, 23],
  [22, 24],
  [23, 22],
  [24, 25],
  [25, 26],
  [26, 23],
  [27, 25],
])

export const light_blue_surface2 = n53
export const light_blue_Checkbox = n53
export const light_blue_Switch = n53
export const light_blue_TooltipContent = n53
export const light_blue_RadioGroupItem = n53
const n54 = t([
  [20, 25],
  [21, 25],
  [22, 27],
  [23, 25],
  [24, 28],
  [25, 28],
  [26, 26],
  [27, 28],
])

export const light_blue_surface4 = n54
export const light_blue_active_SelectTrigger = n54
export const light_blue_active_Card = n54
export const light_blue_active_Button = n54
export const light_blue_active_Checkbox = n54
export const light_blue_active_Switch = n54
export const light_blue_active_TooltipContent = n54
export const light_blue_active_RadioGroupItem = n54
export const light_blue_active_Input = n54
export const light_blue_active_TextArea = n54
const n55 = t([
  [28, 88],
  [29, 87],
  [30, 88],
  [31, 87],
])

export const light_purple_alt1 = n55
const n56 = t([
  [28, 87],
  [29, 86],
  [30, 87],
  [31, 86],
])

export const light_purple_alt2 = n56
const n57 = t([
  [20, 81],
  [21, 82],
  [22, 83],
  [23, 81],
  [24, 84],
  [25, 85],
  [26, 82],
  [27, 84],
])

export const light_purple_active = n57
export const light_purple_surface3 = n57
export const light_purple_Button = n57
export const light_purple_SliderTrackActive = n57
export const light_purple_active_SliderTrackActive = n57
const n58 = t([
  [20, 79],
  [21, 80],
  [22, 81],
  [23, 79],
  [24, 82],
  [25, 83],
  [26, 80],
  [27, 82],
])

export const light_purple_surface1 = n58
export const light_purple_ListItem = n58
export const light_purple_SelectTrigger = n58
export const light_purple_Card = n58
export const light_purple_Progress = n58
export const light_purple_TooltipArrow = n58
export const light_purple_SliderTrack = n58
export const light_purple_Input = n58
export const light_purple_TextArea = n58
export const light_purple_active_ListItem = n58
export const light_purple_active_Progress = n58
export const light_purple_active_TooltipArrow = n58
export const light_purple_active_SliderTrack = n58
const n59 = t([
  [20, 80],
  [21, 81],
  [22, 82],
  [23, 80],
  [24, 83],
  [25, 84],
  [26, 81],
  [27, 83],
])

export const light_purple_surface2 = n59
export const light_purple_Checkbox = n59
export const light_purple_Switch = n59
export const light_purple_TooltipContent = n59
export const light_purple_RadioGroupItem = n59
const n60 = t([
  [20, 83],
  [21, 83],
  [22, 85],
  [23, 83],
  [24, 86],
  [25, 86],
  [26, 84],
  [27, 86],
])

export const light_purple_surface4 = n60
export const light_purple_active_SelectTrigger = n60
export const light_purple_active_Card = n60
export const light_purple_active_Button = n60
export const light_purple_active_Checkbox = n60
export const light_purple_active_Switch = n60
export const light_purple_active_TooltipContent = n60
export const light_purple_active_RadioGroupItem = n60
export const light_purple_active_Input = n60
export const light_purple_active_TextArea = n60
const n61 = t([
  [28, 76],
  [29, 75],
  [30, 76],
  [31, 75],
])

export const light_pink_alt1 = n61
const n62 = t([
  [28, 75],
  [29, 74],
  [30, 75],
  [31, 74],
])

export const light_pink_alt2 = n62
const n63 = t([
  [20, 69],
  [21, 70],
  [22, 71],
  [23, 69],
  [24, 72],
  [25, 73],
  [26, 70],
  [27, 72],
])

export const light_pink_active = n63
export const light_pink_surface3 = n63
export const light_pink_Button = n63
export const light_pink_SliderTrackActive = n63
export const light_pink_active_SliderTrackActive = n63
const n64 = t([
  [20, 67],
  [21, 68],
  [22, 69],
  [23, 67],
  [24, 70],
  [25, 71],
  [26, 68],
  [27, 70],
])

export const light_pink_surface1 = n64
export const light_pink_ListItem = n64
export const light_pink_SelectTrigger = n64
export const light_pink_Card = n64
export const light_pink_Progress = n64
export const light_pink_TooltipArrow = n64
export const light_pink_SliderTrack = n64
export const light_pink_Input = n64
export const light_pink_TextArea = n64
export const light_pink_active_ListItem = n64
export const light_pink_active_Progress = n64
export const light_pink_active_TooltipArrow = n64
export const light_pink_active_SliderTrack = n64
const n65 = t([
  [20, 68],
  [21, 69],
  [22, 70],
  [23, 68],
  [24, 71],
  [25, 72],
  [26, 69],
  [27, 71],
])

export const light_pink_surface2 = n65
export const light_pink_Checkbox = n65
export const light_pink_Switch = n65
export const light_pink_TooltipContent = n65
export const light_pink_RadioGroupItem = n65
const n66 = t([
  [20, 71],
  [21, 71],
  [22, 73],
  [23, 71],
  [24, 74],
  [25, 74],
  [26, 72],
  [27, 74],
])

export const light_pink_surface4 = n66
export const light_pink_active_SelectTrigger = n66
export const light_pink_active_Card = n66
export const light_pink_active_Button = n66
export const light_pink_active_Checkbox = n66
export const light_pink_active_Switch = n66
export const light_pink_active_TooltipContent = n66
export const light_pink_active_RadioGroupItem = n66
export const light_pink_active_Input = n66
export const light_pink_active_TextArea = n66
const n67 = t([
  [28, 100],
  [29, 99],
  [30, 100],
  [31, 99],
])

export const light_red_alt1 = n67
const n68 = t([
  [28, 99],
  [29, 98],
  [30, 99],
  [31, 98],
])

export const light_red_alt2 = n68
const n69 = t([
  [20, 93],
  [21, 94],
  [22, 95],
  [23, 93],
  [24, 96],
  [25, 97],
  [26, 94],
  [27, 96],
])

export const light_red_active = n69
export const light_red_surface3 = n69
export const light_red_Button = n69
export const light_red_SliderTrackActive = n69
export const light_red_active_SliderTrackActive = n69
const n70 = t([
  [20, 91],
  [21, 92],
  [22, 93],
  [23, 91],
  [24, 94],
  [25, 95],
  [26, 92],
  [27, 94],
])

export const light_red_surface1 = n70
export const light_red_ListItem = n70
export const light_red_SelectTrigger = n70
export const light_red_Card = n70
export const light_red_Progress = n70
export const light_red_TooltipArrow = n70
export const light_red_SliderTrack = n70
export const light_red_Input = n70
export const light_red_TextArea = n70
export const light_red_active_ListItem = n70
export const light_red_active_Progress = n70
export const light_red_active_TooltipArrow = n70
export const light_red_active_SliderTrack = n70
const n71 = t([
  [20, 92],
  [21, 93],
  [22, 94],
  [23, 92],
  [24, 95],
  [25, 96],
  [26, 93],
  [27, 95],
])

export const light_red_surface2 = n71
export const light_red_Checkbox = n71
export const light_red_Switch = n71
export const light_red_TooltipContent = n71
export const light_red_RadioGroupItem = n71
const n72 = t([
  [20, 95],
  [21, 95],
  [22, 97],
  [23, 95],
  [24, 98],
  [25, 98],
  [26, 96],
  [27, 98],
])

export const light_red_surface4 = n72
export const light_red_active_SelectTrigger = n72
export const light_red_active_Card = n72
export const light_red_active_Button = n72
export const light_red_active_Checkbox = n72
export const light_red_active_Switch = n72
export const light_red_active_TooltipContent = n72
export const light_red_active_RadioGroupItem = n72
export const light_red_active_Input = n72
export const light_red_active_TextArea = n72
const n73 = t([
  [28, 41],
  [29, 40],
  [30, 41],
  [31, 40],
])

export const light_gray_alt1 = n73
const n74 = t([
  [28, 40],
  [29, 12],
  [30, 40],
  [31, 12],
])

export const light_gray_alt2 = n74
const n75 = t([
  [20, 35],
  [21, 36],
  [22, 37],
  [23, 35],
  [24, 38],
  [25, 39],
  [26, 36],
  [27, 38],
])

export const light_gray_active = n75
export const light_gray_surface3 = n75
export const light_gray_Button = n75
export const light_gray_SliderTrackActive = n75
export const light_gray_active_SliderTrackActive = n75
const n76 = t([
  [20, 33],
  [21, 34],
  [22, 35],
  [23, 33],
  [24, 36],
  [25, 37],
  [26, 34],
  [27, 36],
])

export const light_gray_surface1 = n76
export const light_gray_ListItem = n76
export const light_gray_SelectTrigger = n76
export const light_gray_Card = n76
export const light_gray_Progress = n76
export const light_gray_TooltipArrow = n76
export const light_gray_SliderTrack = n76
export const light_gray_Input = n76
export const light_gray_TextArea = n76
export const light_gray_active_ListItem = n76
export const light_gray_active_Progress = n76
export const light_gray_active_TooltipArrow = n76
export const light_gray_active_SliderTrack = n76
const n77 = t([
  [20, 34],
  [21, 35],
  [22, 36],
  [23, 34],
  [24, 37],
  [25, 38],
  [26, 35],
  [27, 37],
])

export const light_gray_surface2 = n77
export const light_gray_Checkbox = n77
export const light_gray_Switch = n77
export const light_gray_TooltipContent = n77
export const light_gray_RadioGroupItem = n77
const n78 = t([
  [20, 37],
  [21, 37],
  [22, 39],
  [23, 37],
  [24, 12],
  [25, 12],
  [26, 38],
  [27, 12],
])

export const light_gray_surface4 = n78
export const light_gray_active_SelectTrigger = n78
export const light_gray_active_Card = n78
export const light_gray_active_Button = n78
export const light_gray_active_Checkbox = n78
export const light_gray_active_Switch = n78
export const light_gray_active_TooltipContent = n78
export const light_gray_active_RadioGroupItem = n78
export const light_gray_active_Input = n78
export const light_gray_active_TextArea = n78
const n79 = t([
  [28, 169],
  [29, 168],
  [30, 169],
  [31, 168],
])

export const dark_orange_alt1 = n79
const n80 = t([
  [28, 168],
  [29, 62],
  [30, 168],
  [31, 62],
])

export const dark_orange_alt2 = n80
const n81 = t([
  [20, 163],
  [21, 164],
  [22, 165],
  [23, 163],
  [24, 166],
  [25, 167],
  [26, 164],
  [27, 166],
])

export const dark_orange_active = n81
export const dark_orange_surface3 = n81
export const dark_orange_Button = n81
export const dark_orange_SliderTrackActive = n81
export const dark_orange_active_SliderTrackActive = n81
const n82 = t([
  [20, 161],
  [21, 162],
  [22, 163],
  [23, 161],
  [24, 164],
  [25, 165],
  [26, 162],
  [27, 164],
])

export const dark_orange_surface1 = n82
export const dark_orange_ListItem = n82
export const dark_orange_SelectTrigger = n82
export const dark_orange_Card = n82
export const dark_orange_Progress = n82
export const dark_orange_TooltipArrow = n82
export const dark_orange_SliderTrack = n82
export const dark_orange_Input = n82
export const dark_orange_TextArea = n82
export const dark_orange_active_ListItem = n82
export const dark_orange_active_Progress = n82
export const dark_orange_active_TooltipArrow = n82
export const dark_orange_active_SliderTrack = n82
const n83 = t([
  [20, 162],
  [21, 163],
  [22, 164],
  [23, 162],
  [24, 165],
  [25, 166],
  [26, 163],
  [27, 165],
])

export const dark_orange_surface2 = n83
export const dark_orange_Checkbox = n83
export const dark_orange_Switch = n83
export const dark_orange_TooltipContent = n83
export const dark_orange_RadioGroupItem = n83
const n84 = t([
  [20, 165],
  [21, 165],
  [22, 167],
  [23, 165],
  [24, 62],
  [25, 62],
  [26, 166],
  [27, 62],
])

export const dark_orange_surface4 = n84
export const dark_orange_active_SelectTrigger = n84
export const dark_orange_active_Card = n84
export const dark_orange_active_Button = n84
export const dark_orange_active_Checkbox = n84
export const dark_orange_active_Switch = n84
export const dark_orange_active_TooltipContent = n84
export const dark_orange_active_RadioGroupItem = n84
export const dark_orange_active_Input = n84
export const dark_orange_active_TextArea = n84
const n85 = t([
  [28, 213],
  [29, 212],
  [30, 213],
  [31, 212],
])

export const dark_yellow_alt1 = n85
const n86 = t([
  [28, 212],
  [29, 110],
  [30, 212],
  [31, 110],
])

export const dark_yellow_alt2 = n86
const n87 = t([
  [20, 207],
  [21, 208],
  [22, 209],
  [23, 207],
  [24, 210],
  [25, 211],
  [26, 208],
  [27, 210],
])

export const dark_yellow_active = n87
export const dark_yellow_surface3 = n87
export const dark_yellow_Button = n87
export const dark_yellow_SliderTrackActive = n87
export const dark_yellow_active_SliderTrackActive = n87
const n88 = t([
  [20, 205],
  [21, 206],
  [22, 207],
  [23, 205],
  [24, 208],
  [25, 209],
  [26, 206],
  [27, 208],
])

export const dark_yellow_surface1 = n88
export const dark_yellow_ListItem = n88
export const dark_yellow_SelectTrigger = n88
export const dark_yellow_Card = n88
export const dark_yellow_Progress = n88
export const dark_yellow_TooltipArrow = n88
export const dark_yellow_SliderTrack = n88
export const dark_yellow_Input = n88
export const dark_yellow_TextArea = n88
export const dark_yellow_active_ListItem = n88
export const dark_yellow_active_Progress = n88
export const dark_yellow_active_TooltipArrow = n88
export const dark_yellow_active_SliderTrack = n88
const n89 = t([
  [20, 206],
  [21, 207],
  [22, 208],
  [23, 206],
  [24, 209],
  [25, 210],
  [26, 207],
  [27, 209],
])

export const dark_yellow_surface2 = n89
export const dark_yellow_Checkbox = n89
export const dark_yellow_Switch = n89
export const dark_yellow_TooltipContent = n89
export const dark_yellow_RadioGroupItem = n89
const n90 = t([
  [20, 209],
  [21, 209],
  [22, 211],
  [23, 209],
  [24, 110],
  [25, 110],
  [26, 210],
  [27, 110],
])

export const dark_yellow_surface4 = n90
export const dark_yellow_active_SelectTrigger = n90
export const dark_yellow_active_Card = n90
export const dark_yellow_active_Button = n90
export const dark_yellow_active_Checkbox = n90
export const dark_yellow_active_Switch = n90
export const dark_yellow_active_TooltipContent = n90
export const dark_yellow_active_RadioGroupItem = n90
export const dark_yellow_active_Input = n90
export const dark_yellow_active_TextArea = n90
const n91 = t([
  [28, 158],
  [29, 157],
  [30, 158],
  [31, 157],
])

export const dark_green_alt1 = n91
const n92 = t([
  [28, 157],
  [29, 50],
  [30, 157],
  [31, 50],
])

export const dark_green_alt2 = n92
const n93 = t([
  [20, 152],
  [21, 153],
  [22, 154],
  [23, 152],
  [24, 155],
  [25, 156],
  [26, 153],
  [27, 155],
])

export const dark_green_active = n93
export const dark_green_surface3 = n93
export const dark_green_Button = n93
export const dark_green_SliderTrackActive = n93
export const dark_green_active_SliderTrackActive = n93
const n94 = t([
  [20, 150],
  [21, 151],
  [22, 152],
  [23, 150],
  [24, 153],
  [25, 154],
  [26, 151],
  [27, 153],
])

export const dark_green_surface1 = n94
export const dark_green_ListItem = n94
export const dark_green_SelectTrigger = n94
export const dark_green_Card = n94
export const dark_green_Progress = n94
export const dark_green_TooltipArrow = n94
export const dark_green_SliderTrack = n94
export const dark_green_Input = n94
export const dark_green_TextArea = n94
export const dark_green_active_ListItem = n94
export const dark_green_active_Progress = n94
export const dark_green_active_TooltipArrow = n94
export const dark_green_active_SliderTrack = n94
const n95 = t([
  [20, 151],
  [21, 152],
  [22, 153],
  [23, 151],
  [24, 154],
  [25, 155],
  [26, 152],
  [27, 154],
])

export const dark_green_surface2 = n95
export const dark_green_Checkbox = n95
export const dark_green_Switch = n95
export const dark_green_TooltipContent = n95
export const dark_green_RadioGroupItem = n95
const n96 = t([
  [20, 154],
  [21, 154],
  [22, 156],
  [23, 154],
  [24, 50],
  [25, 50],
  [26, 155],
  [27, 50],
])

export const dark_green_surface4 = n96
export const dark_green_active_SelectTrigger = n96
export const dark_green_active_Card = n96
export const dark_green_active_Button = n96
export const dark_green_active_Checkbox = n96
export const dark_green_active_Switch = n96
export const dark_green_active_TooltipContent = n96
export const dark_green_active_RadioGroupItem = n96
export const dark_green_active_Input = n96
export const dark_green_active_TextArea = n96
const n97 = t([
  [28, 136],
  [29, 135],
  [30, 136],
  [31, 135],
])

export const dark_blue_alt1 = n97
const n98 = t([
  [28, 135],
  [29, 28],
  [30, 135],
  [31, 28],
])

export const dark_blue_alt2 = n98
const n99 = t([
  [20, 130],
  [21, 131],
  [22, 132],
  [23, 130],
  [24, 133],
  [25, 134],
  [26, 131],
  [27, 133],
])

export const dark_blue_active = n99
export const dark_blue_surface3 = n99
export const dark_blue_Button = n99
export const dark_blue_SliderTrackActive = n99
export const dark_blue_active_SliderTrackActive = n99
const n100 = t([
  [20, 128],
  [21, 129],
  [22, 130],
  [23, 128],
  [24, 131],
  [25, 132],
  [26, 129],
  [27, 131],
])

export const dark_blue_surface1 = n100
export const dark_blue_ListItem = n100
export const dark_blue_SelectTrigger = n100
export const dark_blue_Card = n100
export const dark_blue_Progress = n100
export const dark_blue_TooltipArrow = n100
export const dark_blue_SliderTrack = n100
export const dark_blue_Input = n100
export const dark_blue_TextArea = n100
export const dark_blue_active_ListItem = n100
export const dark_blue_active_Progress = n100
export const dark_blue_active_TooltipArrow = n100
export const dark_blue_active_SliderTrack = n100
const n101 = t([
  [20, 129],
  [21, 130],
  [22, 131],
  [23, 129],
  [24, 132],
  [25, 133],
  [26, 130],
  [27, 132],
])

export const dark_blue_surface2 = n101
export const dark_blue_Checkbox = n101
export const dark_blue_Switch = n101
export const dark_blue_TooltipContent = n101
export const dark_blue_RadioGroupItem = n101
const n102 = t([
  [20, 132],
  [21, 132],
  [22, 134],
  [23, 132],
  [24, 28],
  [25, 28],
  [26, 133],
  [27, 28],
])

export const dark_blue_surface4 = n102
export const dark_blue_active_SelectTrigger = n102
export const dark_blue_active_Card = n102
export const dark_blue_active_Button = n102
export const dark_blue_active_Checkbox = n102
export const dark_blue_active_Switch = n102
export const dark_blue_active_TooltipContent = n102
export const dark_blue_active_RadioGroupItem = n102
export const dark_blue_active_Input = n102
export const dark_blue_active_TextArea = n102
const n103 = t([
  [28, 191],
  [29, 190],
  [30, 191],
  [31, 190],
])

export const dark_purple_alt1 = n103
const n104 = t([
  [28, 190],
  [29, 86],
  [30, 190],
  [31, 86],
])

export const dark_purple_alt2 = n104
const n105 = t([
  [20, 185],
  [21, 186],
  [22, 187],
  [23, 185],
  [24, 188],
  [25, 189],
  [26, 186],
  [27, 188],
])

export const dark_purple_active = n105
export const dark_purple_surface3 = n105
export const dark_purple_Button = n105
export const dark_purple_SliderTrackActive = n105
export const dark_purple_active_SliderTrackActive = n105
const n106 = t([
  [20, 183],
  [21, 184],
  [22, 185],
  [23, 183],
  [24, 186],
  [25, 187],
  [26, 184],
  [27, 186],
])

export const dark_purple_surface1 = n106
export const dark_purple_ListItem = n106
export const dark_purple_SelectTrigger = n106
export const dark_purple_Card = n106
export const dark_purple_Progress = n106
export const dark_purple_TooltipArrow = n106
export const dark_purple_SliderTrack = n106
export const dark_purple_Input = n106
export const dark_purple_TextArea = n106
export const dark_purple_active_ListItem = n106
export const dark_purple_active_Progress = n106
export const dark_purple_active_TooltipArrow = n106
export const dark_purple_active_SliderTrack = n106
const n107 = t([
  [20, 184],
  [21, 185],
  [22, 186],
  [23, 184],
  [24, 187],
  [25, 188],
  [26, 185],
  [27, 187],
])

export const dark_purple_surface2 = n107
export const dark_purple_Checkbox = n107
export const dark_purple_Switch = n107
export const dark_purple_TooltipContent = n107
export const dark_purple_RadioGroupItem = n107
const n108 = t([
  [20, 187],
  [21, 187],
  [22, 189],
  [23, 187],
  [24, 86],
  [25, 86],
  [26, 188],
  [27, 86],
])

export const dark_purple_surface4 = n108
export const dark_purple_active_SelectTrigger = n108
export const dark_purple_active_Card = n108
export const dark_purple_active_Button = n108
export const dark_purple_active_Checkbox = n108
export const dark_purple_active_Switch = n108
export const dark_purple_active_TooltipContent = n108
export const dark_purple_active_RadioGroupItem = n108
export const dark_purple_active_Input = n108
export const dark_purple_active_TextArea = n108
const n109 = t([
  [28, 180],
  [29, 179],
  [30, 180],
  [31, 179],
])

export const dark_pink_alt1 = n109
const n110 = t([
  [28, 179],
  [29, 74],
  [30, 179],
  [31, 74],
])

export const dark_pink_alt2 = n110
const n111 = t([
  [20, 174],
  [21, 175],
  [22, 176],
  [23, 174],
  [24, 177],
  [25, 178],
  [26, 175],
  [27, 177],
])

export const dark_pink_active = n111
export const dark_pink_surface3 = n111
export const dark_pink_Button = n111
export const dark_pink_SliderTrackActive = n111
export const dark_pink_active_SliderTrackActive = n111
const n112 = t([
  [20, 172],
  [21, 173],
  [22, 174],
  [23, 172],
  [24, 175],
  [25, 176],
  [26, 173],
  [27, 175],
])

export const dark_pink_surface1 = n112
export const dark_pink_ListItem = n112
export const dark_pink_SelectTrigger = n112
export const dark_pink_Card = n112
export const dark_pink_Progress = n112
export const dark_pink_TooltipArrow = n112
export const dark_pink_SliderTrack = n112
export const dark_pink_Input = n112
export const dark_pink_TextArea = n112
export const dark_pink_active_ListItem = n112
export const dark_pink_active_Progress = n112
export const dark_pink_active_TooltipArrow = n112
export const dark_pink_active_SliderTrack = n112
const n113 = t([
  [20, 173],
  [21, 174],
  [22, 175],
  [23, 173],
  [24, 176],
  [25, 177],
  [26, 174],
  [27, 176],
])

export const dark_pink_surface2 = n113
export const dark_pink_Checkbox = n113
export const dark_pink_Switch = n113
export const dark_pink_TooltipContent = n113
export const dark_pink_RadioGroupItem = n113
const n114 = t([
  [20, 176],
  [21, 176],
  [22, 178],
  [23, 176],
  [24, 74],
  [25, 74],
  [26, 177],
  [27, 74],
])

export const dark_pink_surface4 = n114
export const dark_pink_active_SelectTrigger = n114
export const dark_pink_active_Card = n114
export const dark_pink_active_Button = n114
export const dark_pink_active_Checkbox = n114
export const dark_pink_active_Switch = n114
export const dark_pink_active_TooltipContent = n114
export const dark_pink_active_RadioGroupItem = n114
export const dark_pink_active_Input = n114
export const dark_pink_active_TextArea = n114
const n115 = t([
  [28, 202],
  [29, 201],
  [30, 202],
  [31, 201],
])

export const dark_red_alt1 = n115
const n116 = t([
  [28, 201],
  [29, 98],
  [30, 201],
  [31, 98],
])

export const dark_red_alt2 = n116
const n117 = t([
  [20, 196],
  [21, 197],
  [22, 198],
  [23, 196],
  [24, 199],
  [25, 200],
  [26, 197],
  [27, 199],
])

export const dark_red_active = n117
export const dark_red_surface3 = n117
export const dark_red_Button = n117
export const dark_red_SliderTrackActive = n117
export const dark_red_active_SliderTrackActive = n117
const n118 = t([
  [20, 194],
  [21, 195],
  [22, 196],
  [23, 194],
  [24, 197],
  [25, 198],
  [26, 195],
  [27, 197],
])

export const dark_red_surface1 = n118
export const dark_red_ListItem = n118
export const dark_red_SelectTrigger = n118
export const dark_red_Card = n118
export const dark_red_Progress = n118
export const dark_red_TooltipArrow = n118
export const dark_red_SliderTrack = n118
export const dark_red_Input = n118
export const dark_red_TextArea = n118
export const dark_red_active_ListItem = n118
export const dark_red_active_Progress = n118
export const dark_red_active_TooltipArrow = n118
export const dark_red_active_SliderTrack = n118
const n119 = t([
  [20, 195],
  [21, 196],
  [22, 197],
  [23, 195],
  [24, 198],
  [25, 199],
  [26, 196],
  [27, 198],
])

export const dark_red_surface2 = n119
export const dark_red_Checkbox = n119
export const dark_red_Switch = n119
export const dark_red_TooltipContent = n119
export const dark_red_RadioGroupItem = n119
const n120 = t([
  [20, 198],
  [21, 198],
  [22, 200],
  [23, 198],
  [24, 98],
  [25, 98],
  [26, 199],
  [27, 98],
])

export const dark_red_surface4 = n120
export const dark_red_active_SelectTrigger = n120
export const dark_red_active_Card = n120
export const dark_red_active_Button = n120
export const dark_red_active_Checkbox = n120
export const dark_red_active_Switch = n120
export const dark_red_active_TooltipContent = n120
export const dark_red_active_RadioGroupItem = n120
export const dark_red_active_Input = n120
export const dark_red_active_TextArea = n120
const n121 = t([
  [28, 148],
  [29, 147],
  [30, 148],
  [31, 147],
])

export const dark_gray_alt1 = n121
const n122 = t([
  [28, 147],
  [29, 146],
  [30, 147],
  [31, 146],
])

export const dark_gray_alt2 = n122
const n123 = t([
  [20, 141],
  [21, 142],
  [22, 143],
  [23, 141],
  [24, 144],
  [25, 145],
  [26, 142],
  [27, 144],
])

export const dark_gray_active = n123
export const dark_gray_surface3 = n123
export const dark_gray_Button = n123
export const dark_gray_SliderTrackActive = n123
export const dark_gray_active_SliderTrackActive = n123
const n124 = t([
  [20, 139],
  [21, 140],
  [22, 141],
  [23, 139],
  [24, 142],
  [25, 143],
  [26, 140],
  [27, 142],
])

export const dark_gray_surface1 = n124
export const dark_gray_ListItem = n124
export const dark_gray_SelectTrigger = n124
export const dark_gray_Card = n124
export const dark_gray_Progress = n124
export const dark_gray_TooltipArrow = n124
export const dark_gray_SliderTrack = n124
export const dark_gray_Input = n124
export const dark_gray_TextArea = n124
export const dark_gray_active_ListItem = n124
export const dark_gray_active_Progress = n124
export const dark_gray_active_TooltipArrow = n124
export const dark_gray_active_SliderTrack = n124
const n125 = t([
  [20, 140],
  [21, 141],
  [22, 142],
  [23, 140],
  [24, 143],
  [25, 144],
  [26, 141],
  [27, 143],
])

export const dark_gray_surface2 = n125
export const dark_gray_Checkbox = n125
export const dark_gray_Switch = n125
export const dark_gray_TooltipContent = n125
export const dark_gray_RadioGroupItem = n125
const n126 = t([
  [20, 143],
  [21, 143],
  [22, 145],
  [23, 143],
  [24, 146],
  [25, 146],
  [26, 144],
  [27, 146],
])

export const dark_gray_surface4 = n126
export const dark_gray_active_SelectTrigger = n126
export const dark_gray_active_Card = n126
export const dark_gray_active_Button = n126
export const dark_gray_active_Checkbox = n126
export const dark_gray_active_Switch = n126
export const dark_gray_active_TooltipContent = n126
export const dark_gray_active_RadioGroupItem = n126
export const dark_gray_active_Input = n126
export const dark_gray_active_TextArea = n126
const n127 = t([
  [28, 5],
  [29, 6],
  [30, 7],
  [31, 5],
  [20, 15],
  [21, 14],
  [22, 15],
  [23, 14],
  [24, 13],
  [25, 12],
  [26, 11],
  [27, 10],
])

export const light_SwitchThumb = n127
export const light_SliderThumb = n127
export const light_Tooltip = n127
export const light_ProgressIndicator = n127
const n128 = t([[20, 317]])

export const light_SheetOverlay = n128
export const light_DialogOverlay = n128
export const light_ModalOverlay = n128
export const light_orange_SheetOverlay = n128
export const light_orange_DialogOverlay = n128
export const light_orange_ModalOverlay = n128
export const light_yellow_SheetOverlay = n128
export const light_yellow_DialogOverlay = n128
export const light_yellow_ModalOverlay = n128
export const light_green_SheetOverlay = n128
export const light_green_DialogOverlay = n128
export const light_green_ModalOverlay = n128
export const light_blue_SheetOverlay = n128
export const light_blue_DialogOverlay = n128
export const light_blue_ModalOverlay = n128
export const light_purple_SheetOverlay = n128
export const light_purple_DialogOverlay = n128
export const light_purple_ModalOverlay = n128
export const light_pink_SheetOverlay = n128
export const light_pink_DialogOverlay = n128
export const light_pink_ModalOverlay = n128
export const light_red_SheetOverlay = n128
export const light_red_DialogOverlay = n128
export const light_red_ModalOverlay = n128
export const light_gray_SheetOverlay = n128
export const light_gray_DialogOverlay = n128
export const light_gray_ModalOverlay = n128
export const light_active_SheetOverlay = n128
export const light_active_DialogOverlay = n128
export const light_active_ModalOverlay = n128
export const light_orange_active_SheetOverlay = n128
export const light_orange_active_DialogOverlay = n128
export const light_orange_active_ModalOverlay = n128
export const light_yellow_active_SheetOverlay = n128
export const light_yellow_active_DialogOverlay = n128
export const light_yellow_active_ModalOverlay = n128
export const light_green_active_SheetOverlay = n128
export const light_green_active_DialogOverlay = n128
export const light_green_active_ModalOverlay = n128
export const light_blue_active_SheetOverlay = n128
export const light_blue_active_DialogOverlay = n128
export const light_blue_active_ModalOverlay = n128
export const light_purple_active_SheetOverlay = n128
export const light_purple_active_DialogOverlay = n128
export const light_purple_active_ModalOverlay = n128
export const light_pink_active_SheetOverlay = n128
export const light_pink_active_DialogOverlay = n128
export const light_pink_active_ModalOverlay = n128
export const light_red_active_SheetOverlay = n128
export const light_red_active_DialogOverlay = n128
export const light_red_active_ModalOverlay = n128
export const light_gray_active_SheetOverlay = n128
export const light_gray_active_DialogOverlay = n128
export const light_gray_active_ModalOverlay = n128
const n129 = t([
  [28, 117],
  [29, 118],
  [30, 119],
  [31, 117],
  [20, 4],
  [21, 126],
  [22, 4],
  [23, 126],
  [24, 125],
  [25, 124],
  [26, 123],
  [27, 122],
])

export const dark_SwitchThumb = n129
export const dark_SliderThumb = n129
export const dark_Tooltip = n129
export const dark_ProgressIndicator = n129
const n130 = t([[20, 318]])

export const dark_SheetOverlay = n130
export const dark_DialogOverlay = n130
export const dark_ModalOverlay = n130
export const dark_orange_SheetOverlay = n130
export const dark_orange_DialogOverlay = n130
export const dark_orange_ModalOverlay = n130
export const dark_yellow_SheetOverlay = n130
export const dark_yellow_DialogOverlay = n130
export const dark_yellow_ModalOverlay = n130
export const dark_green_SheetOverlay = n130
export const dark_green_DialogOverlay = n130
export const dark_green_ModalOverlay = n130
export const dark_blue_SheetOverlay = n130
export const dark_blue_DialogOverlay = n130
export const dark_blue_ModalOverlay = n130
export const dark_purple_SheetOverlay = n130
export const dark_purple_DialogOverlay = n130
export const dark_purple_ModalOverlay = n130
export const dark_pink_SheetOverlay = n130
export const dark_pink_DialogOverlay = n130
export const dark_pink_ModalOverlay = n130
export const dark_red_SheetOverlay = n130
export const dark_red_DialogOverlay = n130
export const dark_red_ModalOverlay = n130
export const dark_gray_SheetOverlay = n130
export const dark_gray_DialogOverlay = n130
export const dark_gray_ModalOverlay = n130
export const dark_active_SheetOverlay = n130
export const dark_active_DialogOverlay = n130
export const dark_active_ModalOverlay = n130
export const dark_orange_active_SheetOverlay = n130
export const dark_orange_active_DialogOverlay = n130
export const dark_orange_active_ModalOverlay = n130
export const dark_yellow_active_SheetOverlay = n130
export const dark_yellow_active_DialogOverlay = n130
export const dark_yellow_active_ModalOverlay = n130
export const dark_green_active_SheetOverlay = n130
export const dark_green_active_DialogOverlay = n130
export const dark_green_active_ModalOverlay = n130
export const dark_blue_active_SheetOverlay = n130
export const dark_blue_active_DialogOverlay = n130
export const dark_blue_active_ModalOverlay = n130
export const dark_purple_active_SheetOverlay = n130
export const dark_purple_active_DialogOverlay = n130
export const dark_purple_active_ModalOverlay = n130
export const dark_pink_active_SheetOverlay = n130
export const dark_pink_active_DialogOverlay = n130
export const dark_pink_active_ModalOverlay = n130
export const dark_red_active_SheetOverlay = n130
export const dark_red_active_DialogOverlay = n130
export const dark_red_active_ModalOverlay = n130
export const dark_gray_active_SheetOverlay = n130
export const dark_gray_active_DialogOverlay = n130
export const dark_gray_active_ModalOverlay = n130
const n131 = t([
  [28, 55],
  [29, 56],
  [30, 57],
  [31, 55],
  [20, 65],
  [21, 64],
  [22, 65],
  [23, 64],
  [24, 63],
  [25, 62],
  [26, 61],
  [27, 60],
])

export const light_orange_SwitchThumb = n131
export const light_orange_SliderThumb = n131
export const light_orange_Tooltip = n131
export const light_orange_ProgressIndicator = n131
const n132 = t([
  [28, 103],
  [29, 104],
  [30, 105],
  [31, 103],
  [20, 113],
  [21, 112],
  [22, 113],
  [23, 112],
  [24, 111],
  [25, 110],
  [26, 109],
  [27, 108],
])

export const light_yellow_SwitchThumb = n132
export const light_yellow_SliderThumb = n132
export const light_yellow_Tooltip = n132
export const light_yellow_ProgressIndicator = n132
const n133 = t([
  [28, 43],
  [29, 44],
  [30, 45],
  [31, 43],
  [20, 53],
  [21, 52],
  [22, 53],
  [23, 52],
  [24, 51],
  [25, 50],
  [26, 49],
  [27, 48],
])

export const light_green_SwitchThumb = n133
export const light_green_SliderThumb = n133
export const light_green_Tooltip = n133
export const light_green_ProgressIndicator = n133
const n134 = t([
  [28, 21],
  [29, 22],
  [30, 23],
  [31, 21],
  [20, 31],
  [21, 30],
  [22, 31],
  [23, 30],
  [24, 29],
  [25, 28],
  [26, 27],
  [27, 26],
])

export const light_blue_SwitchThumb = n134
export const light_blue_SliderThumb = n134
export const light_blue_Tooltip = n134
export const light_blue_ProgressIndicator = n134
const n135 = t([
  [28, 79],
  [29, 80],
  [30, 81],
  [31, 79],
  [20, 89],
  [21, 88],
  [22, 89],
  [23, 88],
  [24, 87],
  [25, 86],
  [26, 85],
  [27, 84],
])

export const light_purple_SwitchThumb = n135
export const light_purple_SliderThumb = n135
export const light_purple_Tooltip = n135
export const light_purple_ProgressIndicator = n135
const n136 = t([
  [28, 67],
  [29, 68],
  [30, 69],
  [31, 67],
  [20, 77],
  [21, 76],
  [22, 77],
  [23, 76],
  [24, 75],
  [25, 74],
  [26, 73],
  [27, 72],
])

export const light_pink_SwitchThumb = n136
export const light_pink_SliderThumb = n136
export const light_pink_Tooltip = n136
export const light_pink_ProgressIndicator = n136
const n137 = t([
  [28, 91],
  [29, 92],
  [30, 93],
  [31, 91],
  [20, 101],
  [21, 100],
  [22, 101],
  [23, 100],
  [24, 99],
  [25, 98],
  [26, 97],
  [27, 96],
])

export const light_red_SwitchThumb = n137
export const light_red_SliderThumb = n137
export const light_red_Tooltip = n137
export const light_red_ProgressIndicator = n137
const n138 = t([
  [28, 33],
  [29, 34],
  [30, 35],
  [31, 33],
  [20, 15],
  [21, 41],
  [22, 15],
  [23, 41],
  [24, 40],
  [25, 12],
  [26, 39],
  [27, 38],
])

export const light_gray_SwitchThumb = n138
export const light_gray_SliderThumb = n138
export const light_gray_Tooltip = n138
export const light_gray_ProgressIndicator = n138
const n139 = t([
  [28, 161],
  [29, 162],
  [30, 163],
  [31, 161],
  [20, 170],
  [21, 169],
  [22, 170],
  [23, 169],
  [24, 168],
  [25, 62],
  [26, 167],
  [27, 166],
])

export const dark_orange_SwitchThumb = n139
export const dark_orange_SliderThumb = n139
export const dark_orange_Tooltip = n139
export const dark_orange_ProgressIndicator = n139
const n140 = t([
  [28, 205],
  [29, 206],
  [30, 207],
  [31, 205],
  [20, 214],
  [21, 213],
  [22, 214],
  [23, 213],
  [24, 212],
  [25, 110],
  [26, 211],
  [27, 210],
])

export const dark_yellow_SwitchThumb = n140
export const dark_yellow_SliderThumb = n140
export const dark_yellow_Tooltip = n140
export const dark_yellow_ProgressIndicator = n140
const n141 = t([
  [28, 150],
  [29, 151],
  [30, 152],
  [31, 150],
  [20, 159],
  [21, 158],
  [22, 159],
  [23, 158],
  [24, 157],
  [25, 50],
  [26, 156],
  [27, 155],
])

export const dark_green_SwitchThumb = n141
export const dark_green_SliderThumb = n141
export const dark_green_Tooltip = n141
export const dark_green_ProgressIndicator = n141
const n142 = t([
  [28, 128],
  [29, 129],
  [30, 130],
  [31, 128],
  [20, 137],
  [21, 136],
  [22, 137],
  [23, 136],
  [24, 135],
  [25, 28],
  [26, 134],
  [27, 133],
])

export const dark_blue_SwitchThumb = n142
export const dark_blue_SliderThumb = n142
export const dark_blue_Tooltip = n142
export const dark_blue_ProgressIndicator = n142
const n143 = t([
  [28, 183],
  [29, 184],
  [30, 185],
  [31, 183],
  [20, 192],
  [21, 191],
  [22, 192],
  [23, 191],
  [24, 190],
  [25, 86],
  [26, 189],
  [27, 188],
])

export const dark_purple_SwitchThumb = n143
export const dark_purple_SliderThumb = n143
export const dark_purple_Tooltip = n143
export const dark_purple_ProgressIndicator = n143
const n144 = t([
  [28, 172],
  [29, 173],
  [30, 174],
  [31, 172],
  [20, 181],
  [21, 180],
  [22, 181],
  [23, 180],
  [24, 179],
  [25, 74],
  [26, 178],
  [27, 177],
])

export const dark_pink_SwitchThumb = n144
export const dark_pink_SliderThumb = n144
export const dark_pink_Tooltip = n144
export const dark_pink_ProgressIndicator = n144
const n145 = t([
  [28, 194],
  [29, 195],
  [30, 196],
  [31, 194],
  [20, 203],
  [21, 202],
  [22, 203],
  [23, 202],
  [24, 201],
  [25, 98],
  [26, 200],
  [27, 199],
])

export const dark_red_SwitchThumb = n145
export const dark_red_SliderThumb = n145
export const dark_red_Tooltip = n145
export const dark_red_ProgressIndicator = n145
const n146 = t([
  [28, 139],
  [29, 140],
  [30, 141],
  [31, 139],
  [20, 35],
  [21, 148],
  [22, 35],
  [23, 148],
  [24, 147],
  [25, 146],
  [26, 145],
  [27, 144],
])

export const dark_gray_SwitchThumb = n146
export const dark_gray_SliderThumb = n146
export const dark_gray_Tooltip = n146
export const dark_gray_ProgressIndicator = n146
const n147 = t([
  [28, 5],
  [29, 6],
  [30, 7],
  [31, 5],
  [20, 13],
  [21, 12],
  [22, 13],
  [23, 12],
  [24, 11],
  [25, 10],
  [26, 9],
  [27, 8],
])

export const light_active_SwitchThumb = n147
export const light_active_SliderThumb = n147
export const light_active_Tooltip = n147
export const light_active_ProgressIndicator = n147
const n148 = t([
  [28, 117],
  [29, 118],
  [30, 119],
  [31, 117],
  [20, 125],
  [21, 124],
  [22, 125],
  [23, 124],
  [24, 123],
  [25, 122],
  [26, 121],
  [27, 120],
])

export const dark_active_SwitchThumb = n148
export const dark_active_SliderThumb = n148
export const dark_active_Tooltip = n148
export const dark_active_ProgressIndicator = n148
const n149 = t([
  [28, 55],
  [29, 56],
  [30, 57],
  [31, 55],
  [20, 63],
  [21, 62],
  [22, 63],
  [23, 62],
  [24, 61],
  [25, 60],
  [26, 59],
  [27, 58],
])

export const light_orange_active_SwitchThumb = n149
export const light_orange_active_SliderThumb = n149
export const light_orange_active_Tooltip = n149
export const light_orange_active_ProgressIndicator = n149
const n150 = t([
  [28, 103],
  [29, 104],
  [30, 105],
  [31, 103],
  [20, 111],
  [21, 110],
  [22, 111],
  [23, 110],
  [24, 109],
  [25, 108],
  [26, 107],
  [27, 106],
])

export const light_yellow_active_SwitchThumb = n150
export const light_yellow_active_SliderThumb = n150
export const light_yellow_active_Tooltip = n150
export const light_yellow_active_ProgressIndicator = n150
const n151 = t([
  [28, 43],
  [29, 44],
  [30, 45],
  [31, 43],
  [20, 51],
  [21, 50],
  [22, 51],
  [23, 50],
  [24, 49],
  [25, 48],
  [26, 47],
  [27, 46],
])

export const light_green_active_SwitchThumb = n151
export const light_green_active_SliderThumb = n151
export const light_green_active_Tooltip = n151
export const light_green_active_ProgressIndicator = n151
const n152 = t([
  [28, 21],
  [29, 22],
  [30, 23],
  [31, 21],
  [20, 29],
  [21, 28],
  [22, 29],
  [23, 28],
  [24, 27],
  [25, 26],
  [26, 25],
  [27, 24],
])

export const light_blue_active_SwitchThumb = n152
export const light_blue_active_SliderThumb = n152
export const light_blue_active_Tooltip = n152
export const light_blue_active_ProgressIndicator = n152
const n153 = t([
  [28, 79],
  [29, 80],
  [30, 81],
  [31, 79],
  [20, 87],
  [21, 86],
  [22, 87],
  [23, 86],
  [24, 85],
  [25, 84],
  [26, 83],
  [27, 82],
])

export const light_purple_active_SwitchThumb = n153
export const light_purple_active_SliderThumb = n153
export const light_purple_active_Tooltip = n153
export const light_purple_active_ProgressIndicator = n153
const n154 = t([
  [28, 67],
  [29, 68],
  [30, 69],
  [31, 67],
  [20, 75],
  [21, 74],
  [22, 75],
  [23, 74],
  [24, 73],
  [25, 72],
  [26, 71],
  [27, 70],
])

export const light_pink_active_SwitchThumb = n154
export const light_pink_active_SliderThumb = n154
export const light_pink_active_Tooltip = n154
export const light_pink_active_ProgressIndicator = n154
const n155 = t([
  [28, 91],
  [29, 92],
  [30, 93],
  [31, 91],
  [20, 99],
  [21, 98],
  [22, 99],
  [23, 98],
  [24, 97],
  [25, 96],
  [26, 95],
  [27, 94],
])

export const light_red_active_SwitchThumb = n155
export const light_red_active_SliderThumb = n155
export const light_red_active_Tooltip = n155
export const light_red_active_ProgressIndicator = n155
const n156 = t([
  [28, 33],
  [29, 34],
  [30, 35],
  [31, 33],
  [20, 40],
  [21, 12],
  [22, 40],
  [23, 12],
  [24, 39],
  [25, 38],
  [26, 37],
  [27, 36],
])

export const light_gray_active_SwitchThumb = n156
export const light_gray_active_SliderThumb = n156
export const light_gray_active_Tooltip = n156
export const light_gray_active_ProgressIndicator = n156
const n157 = t([
  [28, 161],
  [29, 162],
  [30, 163],
  [31, 161],
  [20, 168],
  [21, 62],
  [22, 168],
  [23, 62],
  [24, 167],
  [25, 166],
  [26, 165],
  [27, 164],
])

export const dark_orange_active_SwitchThumb = n157
export const dark_orange_active_SliderThumb = n157
export const dark_orange_active_Tooltip = n157
export const dark_orange_active_ProgressIndicator = n157
const n158 = t([
  [28, 205],
  [29, 206],
  [30, 207],
  [31, 205],
  [20, 212],
  [21, 110],
  [22, 212],
  [23, 110],
  [24, 211],
  [25, 210],
  [26, 209],
  [27, 208],
])

export const dark_yellow_active_SwitchThumb = n158
export const dark_yellow_active_SliderThumb = n158
export const dark_yellow_active_Tooltip = n158
export const dark_yellow_active_ProgressIndicator = n158
const n159 = t([
  [28, 150],
  [29, 151],
  [30, 152],
  [31, 150],
  [20, 157],
  [21, 50],
  [22, 157],
  [23, 50],
  [24, 156],
  [25, 155],
  [26, 154],
  [27, 153],
])

export const dark_green_active_SwitchThumb = n159
export const dark_green_active_SliderThumb = n159
export const dark_green_active_Tooltip = n159
export const dark_green_active_ProgressIndicator = n159
const n160 = t([
  [28, 128],
  [29, 129],
  [30, 130],
  [31, 128],
  [20, 135],
  [21, 28],
  [22, 135],
  [23, 28],
  [24, 134],
  [25, 133],
  [26, 132],
  [27, 131],
])

export const dark_blue_active_SwitchThumb = n160
export const dark_blue_active_SliderThumb = n160
export const dark_blue_active_Tooltip = n160
export const dark_blue_active_ProgressIndicator = n160
const n161 = t([
  [28, 183],
  [29, 184],
  [30, 185],
  [31, 183],
  [20, 190],
  [21, 86],
  [22, 190],
  [23, 86],
  [24, 189],
  [25, 188],
  [26, 187],
  [27, 186],
])

export const dark_purple_active_SwitchThumb = n161
export const dark_purple_active_SliderThumb = n161
export const dark_purple_active_Tooltip = n161
export const dark_purple_active_ProgressIndicator = n161
const n162 = t([
  [28, 172],
  [29, 173],
  [30, 174],
  [31, 172],
  [20, 179],
  [21, 74],
  [22, 179],
  [23, 74],
  [24, 178],
  [25, 177],
  [26, 176],
  [27, 175],
])

export const dark_pink_active_SwitchThumb = n162
export const dark_pink_active_SliderThumb = n162
export const dark_pink_active_Tooltip = n162
export const dark_pink_active_ProgressIndicator = n162
const n163 = t([
  [28, 194],
  [29, 195],
  [30, 196],
  [31, 194],
  [20, 201],
  [21, 98],
  [22, 201],
  [23, 98],
  [24, 200],
  [25, 199],
  [26, 198],
  [27, 197],
])

export const dark_red_active_SwitchThumb = n163
export const dark_red_active_SliderThumb = n163
export const dark_red_active_Tooltip = n163
export const dark_red_active_ProgressIndicator = n163
const n164 = t([
  [28, 139],
  [29, 140],
  [30, 141],
  [31, 139],
  [20, 147],
  [21, 146],
  [22, 147],
  [23, 146],
  [24, 145],
  [25, 144],
  [26, 143],
  [27, 142],
])

export const dark_gray_active_SwitchThumb = n164
export const dark_gray_active_SliderThumb = n164
export const dark_gray_active_Tooltip = n164
export const dark_gray_active_ProgressIndicator = n164
