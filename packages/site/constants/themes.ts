import {
  blue,
  colorNames,
  colorObjects,
  colors400,
  getColorsForColor,
  getColorsForIndex,
} from './colors'

export type MyTheme = typeof dark
export type MyThemes = typeof themes

const entries = colorNames.flatMap((name) => {
  return [50, 100, 200, 300, 400, 500, 600, 700, 800].map((weight, index) => {
    const colors = getColorsForColor(name)
    return [`${name}${index}`, colors[`color${weight}`]]
  })
})
const base = Object.fromEntries(entries)

const lightBase = {
  ...base,
  bg: '#ffffff',
  bg2: '#f2f2f2',
  bg3: '#e9e9e9',
  bg4: '#d9d9d9',
  bgDarker: '#f6f6f6',
  bgTransparent: 'rgba(255,255,255,0)',
  borderColor: '#f2f2f2',
  borderColorHover: '#eeeeee',
  cardBg: '#ffffff',
  color: '#111111',
  color2: '#444444',
  color3: '#777777',
  color4: '#aaaaaa',
  shadowColor: `rgba(0,0,0,0.1)`,
  shadowColorLighter: `rgba(0,0,0,0.02)`,
}

const darkBase = {
  ...base,
  bg: '#262626',
  bg4: '#454545',
  bg2: '#353535',
  bg3: '#444444',
  bgDarker: '#161616',
  bgTransparent: 'rgba(25,25,25,0)',
  borderColor: '#333333',
  borderColorHover: '#33333355',
  cardBg: '#292929',
  color: '#fefefe',
  color2: '#dddddd',
  color3: '#aaaaaa',
  color4: '#999999',
  shadowColor: `rgba(0,0,0,0.4)`,
  shadowColorLighter: `rgba(0,0,0,0.15)`,
}

const light: MyTheme = {
  name: 'light',
  ...lightBase,
}

const dark = {
  name: 'dark',
  ...darkBase,
}

const active: MyTheme = {
  name: 'active',
  ...lightBase,
  color: '#ffffff',
  color2: '#ffffff',
  bg: blue,
  bg2: blue,
  bg3: `${blue}99`,
  bg4: `${blue}77`,
  borderColor: blue,
  borderColorHover: blue,
}

const error: MyTheme = {
  name: 'error',
  ...lightBase,
  bg: 'rgb(245, 38, 102)',
  bg2: 'rgb(245, 38, 102)',
  bg3: 'rgba(245, 38, 102, 0.85)',
  bg4: 'rgba(245, 38, 102, 0.7)',
  borderColor: 'rgb(205, 28, 92)',
  borderColorHover: 'rgb(205, 28, 92)',
}

const colorThemes: { [key: string]: MyTheme } = {}

export type ColorShades = ReturnType<typeof getColorsForIndex>

for (const [index, name] of colorNames.entries()) {
  const color = colors400[index]
  const colors = getColorsForColor(color)
  colorThemes[name] = {
    name,
    ...darkBase,
    color: colors.color600,
    color2: colors.color400,
    color3: `${colors.color400}99`,
    color4: `#00000055`,
    cardBg: colors.color100,
    bg: colors.color100,
    bg2: colors.color200,
    bg3: colors.color300,
    bg4: colors.color400,
    borderColor: colors.color200,
  }
  const lightName = `${name}-light`
  colorThemes[lightName] = {
    name: lightName,
    ...lightBase,
    color: colors.color700,
    color2: colors.color600,
    color3: colors.color500,
    color4: colors.color400,
    cardBg: '#fff',
    bg: colors.color25,
    bg2: colors.color50,
    bg3: colors.color100,
    bg4: colors.color200,
    borderColor: colors.color100,
  }
  const darkName = `${name}-dark`
  colorThemes[darkName] = {
    name: darkName,
    ...darkBase,
    color: colors.color50,
    color2: colors.color100,
    color3: colors.color200,
    color4: colors.color300,
    cardBg: colors.color600,
    bg: colors.color800,
    bg2: colors.color700,
    bg3: colors.color600,
    bg4: colors.color500,
    borderColor: colors.color600,
  }
}

const themes = {
  dark,
  light,
  active,
  error,
  ...colorThemes,
}

if (typeof window !== 'undefined') {
  window['themes'] = window['themes'] || themes
}

export default themes
