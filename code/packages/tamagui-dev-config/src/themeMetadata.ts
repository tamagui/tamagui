const schemes = ['light', 'dark']
const colors = ['black', 'white', 'gray', 'blue', 'red', 'yellow', 'green']
const paletteColors = [
  'blue',
  'gray',
  'green',
  'neutral',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
]
export const componentThemes = [
  'Button',
  'Input',
  'Progress',
  'ProgressIndicator',
  'Slider',
  'SliderActive',
  'SliderThumb',
  'Switch',
  'TextArea',
  'Tooltip',
  'SwitchThumb',
]

const numbered = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => `${prefix}${index + 1}`)

const baseThemeNames = schemes.flatMap((scheme) => [
  scheme,
  `${scheme}_accent`,
  `${scheme}_surface1`,
  `${scheme}_surface2`,
  ...colors.flatMap((color) => [
    `${scheme}_${color}`,
    `${scheme}_${color}_accent`,
    `${scheme}_${color}_surface1`,
    `${scheme}_${color}_surface2`,
  ]),
])

const levelThemeNames = baseThemeNames.flatMap((themeName) =>
  themeName.endsWith('_surface1')
    ? [themeName.replace(/_surface1$/, '_level2')]
    : themeName.endsWith('_surface2')
      ? [themeName.replace(/_surface2$/, '_level3')]
      : []
)

const componentThemeNames = [...baseThemeNames, ...levelThemeNames].flatMap((parent) =>
  componentThemes.map((component) => `${parent}_${component}`)
)

export const themeNames = [...baseThemeNames, ...levelThemeNames, ...componentThemeNames]

const alphaSteps = [
  '0',
  '01',
  '02',
  '04',
  '06',
  '08',
  '001',
  '002',
  '0025',
  '005',
  '0075',
]

export const themeVariableNames = [
  'accent-background',
  'accent-color',
  ...numbered('accent', 12),
  'background',
  'background-focus',
  'background-hover',
  'background-press',
  ...alphaSteps.map((step) => `background${step}`),
  'border-color',
  'border-color-focus',
  'border-color-hover',
  'border-color-press',
  'color',
  'color-focus',
  'color-hover',
  'color-press',
  'color-transparent',
  ...alphaSteps.map((step) => `color${step}`),
  ...numbered('color', 12),
  'outline-color',
  'placeholder-color',
  'shadow-color',
  ...['black', 'white'].flatMap((color) => [
    color,
    `${color}0`,
    `${color}02`,
    `${color}04`,
    `${color}06`,
    `${color}08`,
    ...numbered(color, 12),
  ]),
  ...paletteColors.flatMap((color) => numbered(color, 12)),
  ...numbered('highlight', 8),
  ...numbered('shadow', 8),
]

const variableShape = Object.fromEntries(
  themeVariableNames.map((name) => [name, `var(--${name})`])
)

type ClientThemes = {
  [Name in keyof typeof serverThemes]: {
    [Key in keyof (typeof serverThemes)[Name]]: string
  }
}

/**
 * The flat-value config revision depends on theme and variable names, never
 * their values. Keep those names in the browser config so SSR and hydration
 * produce identical program classes without retaining the full theme payload.
 */
export const clientThemes = Object.fromEntries(
  themeNames.map((name) => [name, variableShape])
) as ClientThemes
import type { themes as serverThemes } from './themes'
