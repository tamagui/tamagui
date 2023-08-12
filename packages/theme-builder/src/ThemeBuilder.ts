import {
  MaskDefinitions,
  PaletteDefinitions,
  TemplateDefinitions,
  ThemeDefinitions,
  ThemeUsingMask,
  ThemeUsingTemplate,
  applyMask,
  createMask,
  createTheme,
  objectEntries,
  objectFromEntries,
  objectKeys,
} from '@tamagui/create-theme'
import type { Narrow, ThemeDefinition, UnionableString } from '@tamagui/web'

type ThemeBuilderState = {
  palettes?: PaletteDefinitions
  templates?: TemplateDefinitions
  themes?: ThemeDefinitions
  masks?: MaskDefinitions
}

type ObjectStringKeys<A extends Object | undefined> = A extends Object
  ? Exclude<keyof A, symbol | number>
  : never

type GetNonInheritedKeys<TD> = TD extends { nonInheritedValues: infer X }
  ? X extends { [key: string]: any }
    ? keyof X
    : never
  : never

type GetGeneratedThemeFromTemplate<Template, TD> = {
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

type GetGeneratedTheme<TD, S extends ThemeBuilderState> = TD extends {
  theme: infer T
}
  ? T
  : TD extends { parent: infer P }
  ? GetGeneratedTheme<GetParentTheme<P, S['themes']>, S>
  : TD extends { template: infer T }
  ? T extends keyof S['templates']
    ? GetGeneratedThemeFromTemplate<S['templates'][T], TD>
    : TD
  : TD

type ThemeBuilderBuildResult<S extends ThemeBuilderState> = {
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

export class ThemeBuilder<State extends ThemeBuilderState> {
  constructor(public state: State) {}

  addPalettes<const P extends PaletteDefinitions>(palettes: P) {
    this.state.palettes = {
      // as {} prevents generic string key merge messing up types
      ...(this.state.palettes as {}),
      ...palettes,
    }
    return this as any as ThemeBuilder<
      State & {
        palettes: P
      }
    >
  }

  addTemplates<const T extends TemplateDefinitions>(templates: T) {
    this.state.templates = {
      // as {} prevents generic string key merge messing up types
      ...(this.state.templates as {}),
      ...templates,
    }
    return this as any as ThemeBuilder<
      State & {
        templates: T
      }
    >
  }

  addMasks<const M extends MaskDefinitions>(masks: M) {
    this.state.masks = {
      // as {} prevents generic string key merge messing up types
      ...(this.state.masks as {}),
      ...(objectFromEntries(
        objectEntries(masks).map(([key, val]) => [key, createMask(val)])
      ) as M),
    }
    return this as any as ThemeBuilder<
      State & {
        masks: M
      }
    >
  }

  addThemes<const T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(
    themes: T
  ) {
    this.state.themes = {
      // as {} prevents generic string key merge messing up types
      ...(this.state.themes as {}),
      ...themes,
    }

    type TemplateToTheme<X> = State['templates'] extends {}
      ? X extends { template: infer Y; nonInheritedValues: infer Z }
        ? Y extends keyof State['templates']
          ? { theme: Record<keyof State['templates'][Y] | keyof Z, string> }
          : X
        : X
      : X

    return this as any as ThemeBuilder<
      Omit<State, 'themes'> & {
        // lets infer template themes directly onto here to avoid some type nesting issues later one
        // themes: {
        //   [Key in keyof T]: TemplateToTheme<T[Key]>
        // } & State['themes']
        themes: T
      }
    >
  }

  addChildThemes<
    CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>,
    const AvoidNestingWithin extends string[] = []
  >(
    childThemeDefinition: CTD,
    options?: {
      avoidNestingWithin?: AvoidNestingWithin
    }
  ) {
    const currentThemes = this.state.themes as State['themes']
    if (!currentThemes) {
      throw new Error(
        `No themes defined yet, use addThemes first to set your base themes`
      )
    }

    // AvoidNestingWithin[number] exclude isn't working here...
    type CurrentNames = Exclude<keyof typeof currentThemes, symbol | number>
    type ChildNames = Exclude<keyof CTD, symbol | number>

    const currentThemeNames = Object.keys(currentThemes) as CurrentNames[]
    const incomingThemeNames = Object.keys(childThemeDefinition) as ChildNames[]

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

    type ChildThemes = {
      [key in `${CurrentNames}_${ChildNames}`]: CTD & {
        parent: GetParentName<key>
      }
    }

    const childThemes = Object.fromEntries(namesWithDefinitions) as any as ChildThemes

    const next = {
      // as {} prevents generic string key merge messing up types
      ...(this.state.themes as {}),
      ...childThemes,
    }

    // @ts-ignore
    this.state.themes = next

    return this as any as ThemeBuilder<
      State & {
        themes: ChildThemes
      }
    >
  }

  build(): ThemeBuilderBuildResult<State> {
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
        const {
          palette: paletteName,
          template: templateName,
          ...options
        } = themeDefinition

        if (!this.state.palettes) {
          throw new Error(
            `No palettes defined for theme with palette expected: ${themeName}`
          )
        }

        let palette = this.state.palettes[paletteName]

        if (!palette) {
          const fullPaletteName = `${parentName}_${paletteName}`
          palette = this.state.palettes[fullPaletteName]
          // try using the prefix
        }

        if (!palette) {
          throw new Error(`No palette for theme ${themeName}: ${paletteName}`)
        }

        const template = this.state.templates?.[templateName]
        if (!template) {
          throw new Error(`No template for theme ${themeName}: ${templateName}`)
        }

        out[themeName] = createTheme(palette, template, options, themeName)
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

      out[themeName] = applyMask(
        parent,
        maskFunction as any,
        options,
        parentName,
        themeName
      )
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
