import { createTheme } from './createTheme'
import { objectFromEntries, objectKeys } from './helpers'
import { applyMask } from './masks'
import { MaskOptions } from './types'

export type Palette = string[]

export type Template = {
  [key: string]: number
}

type ThemeUsingMask<Masks = string> = MaskOptions & {
  mask: Masks
}

type ThemeUsingTemplate = {
  palette: string
  template: string
}

type ThemePreDefined = {
  theme: {
    [key: string]: string
  }
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

type ThemeDefinitions<Masks extends string = string> = {
  [key: string]: Theme<Masks> | ThemeWithParent<Masks>[]
}

type TemplateDefinitions = {
  [key: string]: Template
}

type MaskDefinitions = {
  [key: string]: Function
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

class ThemeBuilder<State extends ThemeBuilderState> {
  constructor(public state: State) {}

  addPalettes<P extends PaletteDefinitions>(palettes: P) {
    return new ThemeBuilder({
      ...this.state,
      palettes: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.palettes as {}),
        ...palettes,
      },
    } as const)
  }

  addTemplates<T extends TemplateDefinitions>(templates: T) {
    return new ThemeBuilder({
      ...this.state,
      templates: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.templates as {}),
        ...templates,
      },
    })
  }

  addMasks<T extends MaskDefinitions>(masks: T) {
    return new ThemeBuilder({
      ...this.state,
      masks: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.masks as {}),
        ...masks,
      },
    })
  }

  addThemes<T extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(themes: T) {
    return new ThemeBuilder({
      ...this.state,
      themes: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.themes as {}),
        ...themes,
      },
    })
  }

  addChildThemes<CTD extends ThemeDefinitions<ObjectStringKeys<State['masks']>>>(
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
      return incomingThemeNames.map((subName) => {
        const fullName = `${prefix}_${subName}`
        const definition = childThemeDefinition[subName]
        return [fullName, definition] as const
      })
    })

    const childThemes = objectFromEntries(namesWithDefinitions) as {
      [key in `${CurrentNames}_${ChildNames}`]: CTD
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

  build() {
    if (!this.state.themes) {
      return {}
    }

    const out = {}
    const maskedThemes: {
      parentName: string
      themeName: string
      mask: ThemeUsingMask['mask']
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
        maskedThemes.push({ parentName, themeName, mask: themeDefinition.mask })
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

        console.log(palette, template)
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

      const maskFunction = this.state.masks?.[mask]

      if (!maskFunction) {
        throw new Error(`No mask ${maskFunction}`)
      }

      console.log('go', themeName, parent)
      out[themeName] = applyMask(parent, maskFunction as any)
    }

    return out as {
      [key in keyof State['themes']]: any
    }
  }
}

export function createThemeBuilder() {
  return new ThemeBuilder({})
}

// // test types
// let x = new ThemeBuilder()
//   .addThemes({
//     light: {
//       template: '',
//       palette: ''
//     }
//   })

//   x.state.themes

// let y = x
//   .addChildThemes({
//     blue: {
//       mask: 'ok'
//     }
//   })
