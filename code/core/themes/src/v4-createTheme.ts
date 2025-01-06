import { createThemeBuilder } from '@tamagui/theme-builder'
import { parseToHsla } from 'color2k'
import { getThemeSuitePalettes } from './getThemeSuitePalettes'
import type { BuildPalettes, BuildTemplates, BuildThemeSuiteProps } from './types'
import { defaultTemplates } from './v4-defaultTemplates'

export { getThemeSuitePalettes, PALETTE_BACKGROUND_OFFSET } from './getThemeSuitePalettes'
export type * from './types'
export { defaultTemplates } from './v4-defaultTemplates'

type SimpleThemeDefinition = { colors?: ColorDefs; template?: string }
type BaseThemeDefinition = { colors: ColorDefs; template?: string }

type SimpleThemesDefinition = Record<string, SimpleThemeDefinition>
type SimplePaletteDefinitions = Record<string, string[]>

type Colors = string[]
type ColorsByScheme = { light: Colors; dark: Colors }
type ColorDefs = Colors | ColorsByScheme

export type CreateThemesProps<
  SubThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition = SimpleThemesDefinition,
> = {
  base: BaseThemeDefinition
  accent: BaseThemeDefinition
  subThemes?: SubThemes
  templates?: BuildTemplates
  componentThemes?: ComponentThemes
  colorsToTheme?: (props: {
    colors: string[]
    name: string
    scheme?: 'light' | 'dark'
  }) => Record<string, string>
}

export function createThemesWithSubThemes<
  SubThemes extends SimpleThemesDefinition,
  ComponentThemes extends SimpleThemesDefinition,
>(props: CreateThemesProps<SubThemes, ComponentThemes>) {
  const {
    subThemes,
    templates,
    componentThemes = defaultComponentThemes as unknown as any,
  } = props

  const builder = createBuilder({
    componentThemes,
    palettes: createPalettes(getThemesPalettes(props)),
    templates,
    subThemes: Object.fromEntries(
      Object.entries(subThemes || {}).map(([name, value]) => {
        return [
          name,
          {
            palette: name,
            template: value.template || 'base',
          },
        ]
      })
    ) as Record<keyof SubThemes, any>,
  })

  return builder
}

// for studio
export function createThemes(props: CreateThemesProps) {
  return createThemesWithSubThemes(props).build()
}

function getColorsByScheme(colors: Colors): ColorsByScheme {
  return {
    light: colors,
    dark: colors.toReversed(),
  }
}

function getAnchors(colorsByScheme: ColorsByScheme) {
  return colorsByScheme.light.map((lcolor, index) => {
    const dcolor = colorsByScheme.dark[index]
    const [lhue, lsat, llum] = parseToHsla(lcolor)
    const [dhue, dsat, dlum] = parseToHsla(dcolor)
    return {
      index,
      hue: { light: lhue, dark: dhue },
      sat: { light: lsat, dark: dsat },
      lum: { light: llum, dark: dlum },
    } as const
  })
}

const coerceToScheme = (def: ColorDefs) => {
  return Array.isArray(def) ? getColorsByScheme(def) : def
}

function getThemesPalettes(props: CreateThemesProps): BuildPalettes {
  const base = coerceToScheme(props.base.colors)
  const accent = coerceToScheme(props.accent.colors)

  const baseAnchors = getAnchors(base)

  return {
    base: {
      name: 'base',
      anchors: baseAnchors,
    },
    ...(accent && {
      accent: {
        name: 'accent',
        anchors: getAnchors(accent),
      },
    }),
    ...(props.subThemes &&
      Object.fromEntries(
        Object.entries(props.subThemes).map(([key, value]) => {
          return [
            key,
            {
              name: key,
              anchors: value.colors
                ? getAnchors(coerceToScheme(value.colors))
                : baseAnchors,
            },
          ]
        })
      )),
  }
}

// allows more detailed configuration, used by studio
// eventually we should merge this down into simple and have it handle what we need
export function createThemesFromStudio(props: BuildThemeSuiteProps) {
  const palettes = createPalettes(props.palettes)
  const themeBuilder = createBuilder({
    palettes,
    templates: props.templates,
    componentThemes: defaultComponentThemes,
  })
  return {
    themeBuilder,
    themes: themeBuilder.build(),
  }
}

const defaultPalettes: SimplePaletteDefinitions = createPalettes(
  getThemesPalettes({
    base: {
      colors: ['#fff', '#000'],
    },
    accent: {
      colors: ['#ff0000', '#ff9999'],
    },
  })
)

// a simpler API surface
export function createBuilder<
  Templates extends BuildTemplates,
  Palettes extends SimplePaletteDefinitions,
  SubThemes extends Record<
    string,
    {
      template: keyof Templates extends string ? keyof Templates : never
      palette?: string
    }
  >,
  ComponentThemes extends SimpleThemesDefinition,
>({
  subThemes = {} as unknown as SubThemes,
  templates = defaultTemplates as unknown as Templates,
  palettes = defaultPalettes as unknown as Palettes,
  componentThemes = templates === (defaultTemplates as any)
    ? (defaultComponentThemes as unknown as ComponentThemes)
    : undefined,
}: {
  palettes?: Palettes
  templates?: Templates
  subThemes?: SubThemes
  componentThemes?: ComponentThemes
}) {
  // start theme-builder
  const themeBuilder = createThemeBuilder()
    .addPalettes(palettes)
    .addTemplates(templates)
    .addThemes({
      light: {
        template: 'base',
        palette: 'light',
      },
      dark: {
        template: 'base',
        palette: 'dark',
      },
    })
    .addChildThemes(
      palettes.light_accent
        ? {
            accent: [
              {
                parent: 'light',
                template: 'base',
                palette: 'light_accent',
              },
              {
                parent: 'dark',
                template: 'base',
                palette: 'dark_accent',
              },
            ],
          }
        : {}
    )
    .addChildThemes(subThemes, {
      avoidNestingWithin: ['accent'],
    })
    .addComponentThemes(componentThemes ? getComponentThemes(componentThemes) : {}, {
      avoidNestingWithin: Object.keys(subThemes),
    })

  return themeBuilder
}

export const getComponentThemes = (components: SimpleThemesDefinition) => {
  return Object.fromEntries(
    Object.entries(components).map(([componentName, { template }]) => {
      return [
        componentName,
        {
          parent: '',
          template: template || 'base',
        },
      ]
    })
  )
}

export const defaultComponentThemes = {
  ListItem: { template: 'surface1' },
  SelectTrigger: { template: 'surface1' },
  Card: { template: 'surface1' },
  Button: { template: 'surface3' },
  Checkbox: { template: 'surface2' },
  Switch: { template: 'surface2' },
  SwitchThumb: { template: 'inverse' },
  TooltipContent: { template: 'surface2' },
  Progress: { template: 'surface1' },
  RadioGroupItem: { template: 'surface2' },
  TooltipArrow: { template: 'surface1' },
  SliderTrackActive: { template: 'surface3' },
  SliderTrack: { template: 'surface1' },
  SliderThumb: { template: 'inverse' },
  Tooltip: { template: 'inverse' },
  ProgressIndicator: { template: 'inverse' },
  Input: { template: 'surface1' },
  TextArea: { template: 'surface1' },
} satisfies SimpleThemesDefinition

export function createPalettes(palettes: BuildPalettes): SimplePaletteDefinitions {
  const accentPalettes = palettes.accent ? getThemeSuitePalettes(palettes.accent) : null
  const basePalettes = getThemeSuitePalettes(palettes.base)

  const next = Object.fromEntries(
    Object.entries(palettes).flatMap(([name, palette]) => {
      const palettes = getThemeSuitePalettes(palette)
      const isAccent = name.startsWith('accent')
      const oppositePalettes = isAccent ? basePalettes : accentPalettes
      const oppositeLight = oppositePalettes!.light
      const oppositeDark = oppositePalettes!.dark

      const bgOffset = 7

      return [
        [
          name === 'base' ? 'light' : `light_${name}`,
          [
            oppositeLight[bgOffset],
            ...palettes.light,
            oppositeLight[oppositeLight.length - bgOffset - 1],
          ],
        ],
        [
          name === 'base' ? 'dark' : `dark_${name}`,
          [
            oppositeDark[oppositeDark.length - bgOffset - 1],
            ...palettes.dark,
            oppositeDark[bgOffset],
          ],
        ],
      ] as const
    })
  )

  return next as any
}
