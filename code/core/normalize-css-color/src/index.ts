/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export { rgba } from './rgba'

const colorNames =
  'transparent,aliceblue,antiquewhite,aqua,aquamarine,azure,beige,bisque,black,blanchedalmond,blue,blueviolet,brown,burlywood,burntsienna,cadetblue,chartreuse,chocolate,coral,cornflowerblue,cornsilk,crimson,cyan,darkblue,darkcyan,darkgoldenrod,darkgray,darkgreen,darkgrey,darkkhaki,darkmagenta,darkolivegreen,darkorange,darkorchid,darkred,darksalmon,darkseagreen,darkslateblue,darkslategray,darkslategrey,darkturquoise,darkviolet,deeppink,deepskyblue,dimgray,dimgrey,dodgerblue,firebrick,floralwhite,forestgreen,fuchsia,gainsboro,ghostwhite,gold,goldenrod,gray,green,greenyellow,grey,honeydew,hotpink,indianred,indigo,ivory,khaki,lavender,lavenderblush,lawngreen,lemonchiffon,lightblue,lightcoral,lightcyan,lightgoldenrodyellow,lightgray,lightgreen,lightgrey,lightpink,lightsalmon,lightseagreen,lightskyblue,lightslategray,lightslategrey,lightsteelblue,lightyellow,lime,limegreen,linen,magenta,maroon,mediumaquamarine,mediumblue,mediumorchid,mediumpurple,mediumseagreen,mediumslateblue,mediumspringgreen,mediumturquoise,mediumvioletred,midnightblue,mintcream,mistyrose,moccasin,navajowhite,navy,oldlace,olive,olivedrab,orange,orangered,orchid,palegoldenrod,palegreen,paleturquoise,palevioletred,papayawhip,peachpuff,peru,pink,plum,powderblue,purple,rebeccapurple,red,rosybrown,royalblue,saddlebrown,salmon,sandybrown,seagreen,seashell,sienna,silver,skyblue,slateblue,slategray,slategrey,snow,springgreen,steelblue,tan,teal,thistle,tomato,turquoise,violet,wheat,white,whitesmoke,yellow,yellowgreen'
const colorValues =
  '00000000f0f8fffffaebd7ff00ffffff7fffd4fff0fffffff5f5dcffffe4c4ff000000ffffebcdff0000ffff8a2be2ffa52a2affdeb887ffea7e5dff5f9ea0ff7fff00ffd2691effff7f50ff6495edfffff8dcffdc143cff00ffffff00008bff008b8bffb8860bffa9a9a9ff006400ffa9a9a9ffbdb76bff8b008bff556b2fffff8c00ff9932ccff8b0000ffe9967aff8fbc8fff483d8bff2f4f4fff2f4f4fff00ced1ff9400d3ffff1493ff00bfffff696969ff696969ff1e90ffffb22222fffffaf0ff228b22ffff00ffffdcdcdcfff8f8ffffffd700ffdaa520ff808080ff008000ffadff2fff808080fff0fff0ffff69b4ffcd5c5cff4b0082fffffff0fff0e68cffe6e6fafffff0f5ff7cfc00fffffacdffadd8e6fff08080ffe0fffffffafad2ffd3d3d3ff90ee90ffd3d3d3ffffb6c1ffffa07aff20b2aaff87cefaff778899ff778899ffb0c4deffffffe0ff00ff00ff32cd32fffaf0e6ffff00ffff800000ff66cdaaff0000cdffba55d3ff9370dbff3cb371ff7b68eeff00fa9aff48d1ccffc71585ff191970fff5fffaffffe4e1ffffe4b5ffffdeadff000080fffdf5e6ff808000ff6b8e23ffffa500ffff4500ffda70d6ffeee8aaff98fb98ffafeeeeffdb7093ffffefd5ffffdab9ffcd853fffffc0cbffdda0ddffb0e0e6ff800080ff663399ffff0000ffbc8f8fff4169e1ff8b4513fffa8072fff4a460ff2e8b57fffff5eeffa0522dffc0c0c0ff87ceebff6a5acdff708090ff708090fffffafaff00ff7fff4682b4ffd2b48cff008080ffd8bfd8ffff6347ff40e0d0ffee82eefff5deb3fffffffffff5f5f5ffffff00ff9acd32ff'

const number = '[-+]?\\d*\\.?\\d+'
const percentage = `${number}%`
const call = (...args: string[]) => `\\(\\s*(${args.join(')\\s*,?\\s*(')})\\s*\\)`
const callWithSlashSeparator = (...args: string[]) =>
  `\\(\\s*(${args.slice(0, -1).join(')\\s*,?\\s*(')})\\s*\\/\\s*(${args[args.length - 1]})\\s*\\)`
const commaSeparatedCall = (...args: string[]) =>
  `\\(\\s*(${args.join(')\\s*,\\s*(')})\\s*\\)`

const matchers = {
  rgb: new RegExp(`rgb${call(number, number, number)}`),
  rgba: new RegExp(
    `rgba(${commaSeparatedCall(number, number, number, number)}|${callWithSlashSeparator(number, number, number, number)})`
  ),
  hsl: new RegExp(`hsl${call(number, percentage, percentage)}`),
  hsla: new RegExp(
    `hsla(${commaSeparatedCall(number, percentage, percentage, number)}|${callWithSlashSeparator(number, percentage, percentage, number)})`
  ),
  hwb: new RegExp(`hwb${call(number, percentage, percentage)}`),
  hex3: /^#([\da-f])([\da-f])([\da-f])$/i,
  hex4: /^#([\da-f])([\da-f])([\da-f])([\da-f])$/i,
  hex6: /^#([\da-f]{6})$/i,
  hex8: /^#([\da-f]{8})$/i,
}

let colorNameMap: Map<string, number> | undefined

const parse255 = (value: string) => Math.max(0, Math.min(255, Number.parseInt(value, 10)))
const parse360 = (value: string) => (((Number.parseFloat(value) % 360) + 360) % 360) / 360
const parse1 = (value: string) =>
  Math.round(Math.max(0, Math.min(1, Number.parseFloat(value))) * 255)
const parsePercentage = (value: string) =>
  Math.max(0, Math.min(100, Number.parseFloat(value))) / 100

function hue2rgb(p: number, q: number, value: number) {
  let t = value
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

function hslToRgb(h: number, s: number, l: number) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return (
    (Math.round(hue2rgb(p, q, h + 1 / 3) * 255) << 24) |
    (Math.round(hue2rgb(p, q, h) * 255) << 16) |
    (Math.round(hue2rgb(p, q, h - 1 / 3) * 255) << 8)
  )
}

function hwbToRgb(h: number, w: number, b: number) {
  if (w + b >= 1) {
    const gray = Math.round((w * 255) / (w + b))
    return (gray << 24) | (gray << 16) | (gray << 8)
  }
  return (
    (Math.round((hue2rgb(0, 1, h + 1 / 3) * (1 - w - b) + w) * 255) << 24) |
    (Math.round((hue2rgb(0, 1, h) * (1 - w - b) + w) * 255) << 16) |
    (Math.round((hue2rgb(0, 1, h - 1 / 3) * (1 - w - b) + w) * 255) << 8)
  )
}

export function normalizeCSSColor(color: string): number | null {
  if (typeof color !== 'string') return null

  let match = matchers.hex6.exec(color)
  if (match) return Number.parseInt(`${match[1]}ff`, 16) >>> 0

  match = matchers.rgb.exec(color)
  if (match) {
    return (
      ((parse255(match[1]) << 24) |
        (parse255(match[2]) << 16) |
        (parse255(match[3]) << 8) |
        0xff) >>>
      0
    )
  }

  match = matchers.rgba.exec(color)
  if (match) {
    const offset = match[6] === undefined ? 2 : 6
    return (
      ((parse255(match[offset]) << 24) |
        (parse255(match[offset + 1]) << 16) |
        (parse255(match[offset + 2]) << 8) |
        parse1(match[offset + 3])) >>>
      0
    )
  }

  match = matchers.hex3.exec(color)
  if (match) {
    return (
      Number.parseInt(
        `${match[1]}${match[1]}${match[2]}${match[2]}${match[3]}${match[3]}ff`,
        16
      ) >>> 0
    )
  }

  match = matchers.hex8.exec(color)
  if (match) return Number.parseInt(match[1], 16) >>> 0

  match = matchers.hex4.exec(color)
  if (match) {
    return (
      Number.parseInt(
        `${match[1]}${match[1]}${match[2]}${match[2]}${match[3]}${match[3]}${match[4]}${match[4]}`,
        16
      ) >>> 0
    )
  }

  match = matchers.hsl.exec(color)
  if (match) {
    return (
      (hslToRgb(
        parse360(match[1]),
        parsePercentage(match[2]),
        parsePercentage(match[3])
      ) |
        0xff) >>>
      0
    )
  }

  match = matchers.hsla.exec(color)
  if (match) {
    const offset = match[6] === undefined ? 2 : 6
    return (
      (hslToRgb(
        parse360(match[offset]),
        parsePercentage(match[offset + 1]),
        parsePercentage(match[offset + 2])
      ) |
        parse1(match[offset + 3])) >>>
      0
    )
  }

  match = matchers.hwb.exec(color)
  if (match) {
    return (
      (hwbToRgb(
        parse360(match[1]),
        parsePercentage(match[2]),
        parsePercentage(match[3])
      ) |
        0xff) >>>
      0
    )
  }

  const namedColor = getColorNameMap().get(color)
  if (namedColor !== undefined) return namedColor

  return null
}

function getColorNameMap() {
  colorNameMap ||= new Map(
    colorNames
      .split(',')
      .map((name, index) => [
        name,
        Number.parseInt(colorValues.slice(index * 8, index * 8 + 8), 16) >>> 0,
      ])
  )
  return colorNameMap
}

export function isKnownColorName(color: string): boolean {
  return getColorNameMap().has(color)
}

export default normalizeCSSColor
