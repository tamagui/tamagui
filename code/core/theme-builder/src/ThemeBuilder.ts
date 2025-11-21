import type {
  MaskDefinitions,
  PaletteDefinitions,
  Template,
  TemplateDefinitions,
  ThemeDefinitions,
  ThemeUsingMask,
} from '@tamagui/create-theme'
import {
  applyMask,
  createMask,
  createThemeWithPalettes,
  objectEntries,
  objectFromEntries,
} from '@tamagui/create-theme'
import type { Narrow } from '@tamagui/web'
import type { GetThemeFn } from './types'

export type ThemeBuilderInternalState = {
  palettes?: PaletteDefinitions
  templates?: TemplateDefinitions
  themes?: ThemeDefinitions
  masks?: MaskDefinitions
}

type ObjectStringKeys<A extends Object | undefined> = A extends Object
  ? Exclude<keyof A, symbol | number>
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

type GetGeneratedTheme<TD, S extends ThemeBuilderInternalState> = TD extends {
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

type ThemeBuilderBuildResult<
  S extends ThemeBuilderInternalState,
  FinalTheme extends Record<string, string | number> = Record<string, string>,
> = Record<string, string> extends FinalTheme
  ? FinalTheme extends Record<string, string>
    ? {
        [Key in keyof S['themes']]: GetGeneratedTheme<S['themes'][Key], S>
      }
    : {
        [Key in keyof S['themes']]: FinalTheme
      }
  : {
      [Key in keyof S['themes']]: FinalTheme
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

// Flatten union types into a single object with optional properties
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

type FlattenUnion<T extends Record<string, string | number>> = Prettify<{
  [K in keyof UnionToIntersection<T>]: UnionToIntersection<T>[K]
}> extends infer R extends Record<string, string | number>
  ? R
  : never

export class ThemeBuilder<
  State extends ThemeBuilderInternalState = ThemeBuilderInternalState,
  FinalTheme extends Record<string, string | number> = Record<string, string>,
> {
  private _getThemeFn?: GetThemeFn<FinalTheme>

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
      },
      FinalTheme
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
      },
      FinalTheme
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
      },
      FinalTheme
    >
  }

  // for dev mode only really
  _addedThemes: { type: 'themes' | 'childThemes'; args: any }[] = []

  addThemes<const T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(
    themes: T
  ) {
    this._addedThemes.push({ type: 'themes', args: [themes] })

    this.state.themes = {
      // as {} prevents generic string key merge messing up types
      ...(this.state.themes as {}),
      ...themes,
    }

    // type TemplateToTheme<X> = State['templates'] extends {}
    //   ? X extends { template: infer Y; nonInheritedValues: infer Z }
    //     ? Y extends keyof State['templates']
    //       ? { theme: Record<keyof State['templates'][Y] | keyof Z, string> }
    //       : X
    //     : X
    //   : X

    return this as any as ThemeBuilder<
      Omit<State, 'themes'> & {
        // lets infer template themes directly onto here to avoid some type nesting issues later one
        // themes: {
        //   [Key in keyof T]: TemplateToTheme<T[Key]>
        // } & State['themes']
        themes: T
      },
      FinalTheme
    >
  }

  // these wont be typed to save some complexity and because they don't need to be typed!
  addComponentThemes<
    CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>,
  >(
    childThemeDefinition: CTD,
    options?: {
      avoidNestingWithin?: string[]
    }
  ) {
    void this.addChildThemes(childThemeDefinition, options)
    return this
  }

  addChildThemes<
    CTD extends Narrow<ThemeDefinitions<ObjectStringKeys<State['masks']>>>,
    const AvoidNestingWithin extends string[] = [],
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

    this._addedThemes.push({ type: 'childThemes', args: [childThemeDefinition, options] })

    // AvoidNestingWithin[number] exclude isn't working here...
    type CurrentNames = Exclude<keyof typeof currentThemes, symbol | number>
    type ChildNames = Exclude<keyof CTD, symbol | number>

    const currentThemeNames = Object.keys(currentThemes) as CurrentNames[]
    const incomingThemeNames = Object.keys(childThemeDefinition) as ChildNames[]

    const namesWithDefinitions = currentThemeNames.flatMap((prefix) => {
      const avoidNestingWithin = options?.avoidNestingWithin
      if (avoidNestingWithin) {
        if (
          avoidNestingWithin.some(
            (avoidName) => prefix.startsWith(avoidName) || prefix.endsWith(avoidName)
          )
        ) {
          return []
        }
      }

      return incomingThemeNames
        .map((subName) => {
          const fullName = `${prefix}_${subName}`
          const definition = childThemeDefinition[subName]

          if ('avoidNestingWithin' in definition) {
            const avoidNest = definition.avoidNestingWithin as string[]
            if (
              avoidNest.some((name) => prefix.startsWith(name) || prefix.endsWith(name))
            ) {
              return null as never
            }
          }

          return [fullName, definition] as const
        })
        .filter(Boolean)
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
      },
      FinalTheme
    >
  }

  getTheme<NewTheme extends Record<string, string | number>>(
    fn: (props: {
      name: string
      theme: GetGeneratedTheme<State['themes'][keyof State['themes']], State>
      scheme?: 'light' | 'dark'
      parentName: string
      parentNames: string[]
      level: number
      palette?: string[]
      template?: Template
    }) => NewTheme
  ) {
    this._getThemeFn = fn as any
    return this as any as ThemeBuilder<State, FlattenUnion<NewTheme>>
  }

  build(): ThemeBuilderBuildResult<State, FinalTheme> {
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
            const found = definitions.find(
              // endWith match stronger than startsWith
              (d) =>
                d.parent
                  ? parentName.endsWith(d.parent!) || parentName.startsWith(d.parent!)
                  : true
            )
            if (!found) {
              return null
            }
            return found
          })()
        : definitions

      if (!themeDefinition) {
        // `No parent for ${themeName}: ${parentName} - Continuing...`
        continue
      }

      if ('theme' in themeDefinition) {
        out[themeName] = themeDefinition.theme
      } else if ('mask' in themeDefinition) {
        maskedThemes.push({ parentName, themeName, mask: themeDefinition })
      } else {
        let {
          palette: paletteName = '',
          template: templateName,
          ...options
        } = themeDefinition

        const parentDefinition = this.state.themes[parentName]

        if (!this.state.palettes) {
          throw new Error(
            `No palettes defined for theme with palette expected: ${themeName}`
          )
        }

        let palette = this.state.palettes[paletteName || '']
        let attemptParentName = `${parentName}_${paletteName}`

        while (!palette && attemptParentName) {
          if (attemptParentName in this.state.palettes) {
            palette = this.state.palettes[attemptParentName]
            paletteName = attemptParentName
          } else {
            attemptParentName = attemptParentName.split('_').slice(0, -1).join('_')
          }
        }

        if (!palette) {
          const msg =
            process.env.NODE_ENV !== 'production'
              ? `: ${themeName}: ${paletteName}
          Definition: ${JSON.stringify(themeDefinition)}
          Parent: ${JSON.stringify(parentDefinition)}
          Potential: (${Object.keys(this.state.palettes).join(', ')})`
              : ``
          throw new Error(`No palette for theme${msg}`)
        }

        const template =
          this.state.templates?.[templateName] ??
          // fall back to finding the scheme specific on if it exists
          this.state.templates?.[`${nameParts[0]}_${templateName}`]

        if (!template) {
          throw new Error(
            `No template for theme ${themeName}: ${templateName} in templates:\n- ${Object.keys(this.state.templates || {}).join('\n - ')}`
          )
        }

        const theme = createThemeWithPalettes(
          this.state.palettes,
          paletteName,
          template,
          options,
          themeName,
          true
        )

        out[themeName] = this._getThemeFn
          ? this._getThemeFn({
              theme,
              name: themeName,
              level: nameParts.length,
              parentName,
              scheme: /^(light|dark)$/.test(nameParts[0])
                ? (nameParts[0] as 'light' | 'dark')
                : undefined,
              parentNames: nameParts.slice(0, -1),
              palette,
              template,
            })
          : theme
      }
    }

    for (const { mask, themeName, parentName } of maskedThemes) {
      const parent = out[parentName]

      if (!parent) {
        // `No parent theme found with name ${parentName} for theme ${themeName} to use as a mask target - Continuing...`
        continue
      }

      const { mask: maskName, ...options } = mask
      let maskFunction = this.state.masks?.[maskName]

      if (!maskFunction) {
        throw new Error(`No mask ${maskName}`)
      }

      const parentTheme = this.state.themes[parentName]

      if (parentTheme && 'childOptions' in parentTheme) {
        const { mask, ...childOpts } = parentTheme.childOptions as any
        if (mask) {
          maskFunction = this.state.masks?.[mask]
        }
        Object.assign(options, childOpts)
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
