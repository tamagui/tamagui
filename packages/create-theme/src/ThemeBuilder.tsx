import { Narrow } from '../../web/types'
import { CreateThemeOptions, createTheme } from './createTheme'
import { objectEntries, objectFromEntries, objectKeys } from './helpers'
import { applyMask, createMask } from './masks'
import { CreateMask, MaskOptions } from './types'

export type Palette = string[]

type GenericTheme = {
  [key: string]: string
}

export type Template = {
  [key: string]: number
}

type ThemeUsingMask<Masks = string> = MaskOptions & {
  mask: Masks
}

type ThemeUsingTemplate = CreateThemeOptions & {
  palette: string
  template: string
}

type ThemePreDefined = {
  theme: GenericTheme
}

export type Theme<Masks = string> =
  | ThemePreDefined
  | ThemeUsingTemplate
  | ThemeUsingMask<Masks>

type ThemeWithParent<Masks = string> = Theme<Masks> & {
  parent: string
}

type PaletteDefinitions = {
  [key: string]: Palette
}

type ThemeDefinition<Masks extends string = string> =
  | Theme<Masks>
  | ThemeWithParent<Masks>[]

type ThemeDefinitions<Masks extends string = string> = {
  [key: string]: ThemeDefinition<Masks>
}

type TemplateDefinitions = {
  [key: string]: Template
}

type MaskDefinitions = {
  [key: string]: CreateMask | CreateMask['mask']
}

type ThemeBuilderState = {
  palettes?: PaletteDefinitions
  templates?: TemplateDefinitions
  themes?: ThemeDefinitions
  masks?: MaskDefinitions
}

type ObjectStringKeys<A extends Object | undefined> = A extends Object
  ? Exclude<keyof A, symbol | number>
  : never

type GetGeneratedThemeFromTemplate<Template> = {
  [key in keyof Template]: string
}

type GetParentTheme<P, Themes extends ThemeDefinitions | undefined> = P extends string
  ? P extends keyof Themes
    ? Themes[P]
    : GetParentName<P> extends keyof Themes
    ? Themes[GetParentName<P>]
    : GetParentName<GetParentName<P>> extends keyof Themes
    ? Themes[GetParentName<GetParentName<P>>]
    : GetParentName<GetParentName<GetParentName<P>>> extends keyof Themes
    ? Themes[GetParentName<GetParentName<GetParentName<P>>>]
    : never
  : never

type GetGeneratedTheme<TD extends any, S extends ThemeBuilderState> = TD extends {
  theme: infer T
}
  ? T
  : TD extends { parent: infer P }
  ? // ? GetGeneratedThemeFromTemplate<GetParentTheme<P, S['templates']>>
    GetGeneratedTheme<GetParentTheme<P, S['themes']>, S>
  : TD extends { template: infer T }
  ? T extends keyof S['templates']
    ? GetGeneratedThemeFromTemplate<S['templates'][T]>
    : TD
  : TD

type GetGeneratedThemes<S extends ThemeBuilderState> = {
  [Key in keyof S['themes']]: GetGeneratedTheme<S['themes'][Key], S>
}

type GetParentName<N extends string> =
  N extends `${infer A}_${infer B}_${infer C}_${infer D}_${string}`
    ? `${A}_${B}_${C}_${D}`
    : N extends `${infer A}_${infer B}_${infer C}_${string}`
    ? `${A}_${B}_${C}`
    : N extends `${infer A}_${infer B}_${string}`
    ? `${A}_${B}`
    : N extends `${infer A}_${string}`
    ? `${A}`
    : never

class ThemeBuilder<State extends ThemeBuilderState> {
  constructor(public state: State) {}

  addPalettes<const P extends PaletteDefinitions>(palettes: P) {
    return new ThemeBuilder({
      ...this.state,
      palettes: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.palettes as {}),
        ...palettes,
      },
    } as const)
  }

  addTemplates<const T extends TemplateDefinitions>(templates: T) {
    return new ThemeBuilder({
      ...this.state,
      templates: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.templates as {}),
        ...templates,
      },
    })
  }

  addMasks<const T extends MaskDefinitions>(masks: T) {
    return new ThemeBuilder({
      ...this.state,
      masks: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.masks as {}),
        ...(objectFromEntries(
          objectEntries(masks).map(([key, val]) => [key, createMask(val)])
        ) as T),
      },
    })
  }

  addThemes<const T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(
    themes: T
  ) {
    return new ThemeBuilder({
      ...this.state,
      themes: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.themes as {}),
        ...themes,
      },
    })
  }

  addChildThemes<CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>>(
    childThemeDefinition: CTD,
    options?: {
      avoidNestingWithin?: string[]
    }
  ) {
    const currentThemes = this.state.themes as State['themes']
    if (!currentThemes) {
      throw new Error(
        `No themes defined yet, use addThemes first to set your base themes`
      )
    }

    type CurrentNames = Exclude<keyof typeof currentThemes, symbol | number>
    type ChildNames = Exclude<keyof CTD, symbol | number>

    const currentThemeNames = objectKeys(currentThemes) as CurrentNames[]
    const incomingThemeNames = objectKeys(childThemeDefinition) as ChildNames[]

    const namesWithDefinitions = currentThemeNames.flatMap((prefix) => {
      if (options?.avoidNestingWithin) {
        if (
          options.avoidNestingWithin.some(
            (avoidName) => prefix.startsWith(avoidName) || prefix.endsWith(avoidName)
          )
        ) {
          return []
        }
      }

      return incomingThemeNames.map((subName) => {
        const fullName = `${prefix}_${subName}`
        const definition = childThemeDefinition[subName]
        return [fullName, definition] as const
      })
    })

    const childThemes = objectFromEntries(namesWithDefinitions) as {
      [key in `${CurrentNames}_${ChildNames}`]: CTD & {
        parent: GetParentName<key>
      }
    }

    return new ThemeBuilder({
      ...this.state,
      themes: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.themes as {}),
        ...childThemes,
      },
    })
  }

  build(): GetGeneratedThemes<State> {
    if (!this.state.themes) {
      return {} as any
    }

    const out = {}
    const maskedThemes: {
      parentName: string
      themeName: string
      mask: ThemeUsingMask
    }[] = []

    for (const themeName in this.state.themes) {
      const nameParts = themeName.split('_')
      const parentName = nameParts.slice(0, nameParts.length - 1).join('_')

      const definitions = this.state.themes[themeName]
      const themeDefinition = Array.isArray(definitions)
        ? (() => {
            const found = definitions.find((d) => parentName.startsWith(d.parent!))
            if (!found) {
              throw new Error(`No parent for ${themeName}: ${parentName}`)
            }
            return found
          })()
        : definitions

      if ('theme' in themeDefinition) {
        out[themeName] = themeDefinition.theme
      } else if ('mask' in themeDefinition) {
        maskedThemes.push({ parentName, themeName, mask: themeDefinition })
      } else {
        if (!this.state.palettes) {
          throw new Error(
            `No palettes defined for theme with palette expected: ${themeName}`
          )
        }

        let palette = this.state.palettes[themeDefinition.palette]

        if (!palette) {
          const fullPaletteName = `${parentName}_${themeDefinition.palette}`
          palette = this.state.palettes[fullPaletteName]
          // try using the prefix
        }

        if (!palette) {
          throw new Error(`No palette for theme ${themeName}: ${themeDefinition.palette}`)
        }

        const template = this.state.templates?.[themeDefinition.template]
        if (!template) {
          throw new Error(
            `No template for theme ${themeName}: ${themeDefinition.template}`
          )
        }

        out[themeName] = createTheme(palette, template)
      }
    }

    for (const { mask, themeName, parentName } of maskedThemes) {
      const parent = out[parentName]

      if (!parent) {
        throw new Error(
          `No parent theme found with name ${parentName} for theme ${themeName} to use as a mask target`
        )
      }

      const { mask: maskName, ...options } = mask
      const maskFunction = this.state.masks?.[maskName]

      if (!maskFunction) {
        throw new Error(`No mask ${maskFunction}`)
      }

      out[themeName] = applyMask(parent, maskFunction as any, options)
    }

    return out as any
  }
}

export function createThemeBuilder() {
  return new ThemeBuilder({})
}

// // test types
// let x = createThemeBuilder()
//   .addMasks({
//     test: {
//       name: 'mask',
//       mask: (() => {}) as any,
//     },
//   })
//   .addThemes({
//     light: {
//       template: '',
//       palette: '',
//     },
//     dark: {
//       mask: 'test',
//     },
//   })
//   .addChildThemes({
//     List: [
//       {
//         parent: '',
//         mask: 'test',
//       },
//     ],
//   })

// x

// x.state.themes
// x.state.masks

// let y = x.addChildThemes({
//   blue: {
//     mask: 'ok',
//   },
// })
