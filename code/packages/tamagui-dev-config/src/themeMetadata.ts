const schemes = ['light', 'dark'] as const
const deepGroups = ['base', 'accent', 'brand', 'inverse'] as const
const tintGroups = ['red', 'yellow', 'green', 'blue', 'gray'] as const

const deepLevelSuffixes = [
  '',
  '_level2',
  '_level2_level2',
  '_level2_level2_level2',
  '_level2_level2_level3',
  '_level2_level2_level4',
  '_level2_level3',
  '_level2_level4',
  '_level3',
  '_level3_level2',
  '_level3_level3',
  '_level3_level4',
  '_level4',
] as const

export const themeNames = schemes.flatMap((scheme) => [
  ...deepGroups.flatMap((group) =>
    deepLevelSuffixes.map(
      (suffix) => `${scheme}${group === 'base' ? '' : `_${group}`}${suffix}`
    )
  ),
  ...tintGroups.flatMap((group) =>
    ['', '_level2', '_level3', '_level4'].map((suffix) => `${scheme}_${group}${suffix}`)
  ),
])

export const themeVariableNames = [
  ...Array.from({ length: 11 }, (_, index) => `color${index + 1}`),
  'background',
  'background-hover',
  'background-press',
  'background-focus',
  'border-color',
  'border-color-hover',
  'border-color-press',
  'border-color-focus',
  'color',
  'color-hover',
  'color-press',
  'color-focus',
  'placeholder-color',
  'outline-color',
  'shadow-color',
  'accent-background',
  'accent-color',
]

const variableShape = Object.fromEntries(
  themeVariableNames.map((name) => [name, undefined])
)

/**
 * The flat-value config revision depends on theme and variable names, never
 * their values. Keep those names in the browser config so SSR and hydration
 * produce identical program classes without retaining the full theme payload.
 */
export const clientThemes = Object.fromEntries(
  themeNames.map((name) => [name, variableShape])
)
