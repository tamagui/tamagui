import { objectFromEntries, objectKeys } from './helpers'
import { applyMask } from './masks'

export function buildThemes() {
  return new ThemeBuilder({})
}

type Palette = string[]

type Template = {
  [key: string]: number
}

type Theme =
  | {
      palette: string
      template: string
      parent?: string
    }
  | {
      mask: string
      parent?: string
    }

type PaletteDefinitions = {
  [key: string]: Palette
}

type ThemeDefinitions = {
  [key: string]: Theme | Theme[]
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

  addThemes<T extends ThemeDefinitions>(themes: T) {
    return new ThemeBuilder({
      ...this.state,
      themes: {
        // as {} prevents generic string key merge messing up types
        ...(this.state.themes as {}),
        ...themes,
      },
    })
  }

  addChildThemes<CT extends ThemeDefinitions>(
    childThemeDefinition: CT,
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
    type ChildNames = Exclude<keyof CT, symbol | number>

    const currentThemeNames = objectKeys(currentThemes) as CurrentNames[]
    const incomingThemeNames = objectKeys(childThemeDefinition) as ChildNames[]

    const namesWithDefinitions = currentThemeNames.flatMap((prefix) => {
      return incomingThemeNames.map((subName) => {
        const fullName = `${prefix}_${subName}`
        const definition = childThemeDefinition[subName]
        return [fullName, definition] as const
      })
    }) as any as [`${CurrentNames}_${ChildNames}`, CT][]

    const childThemes = objectFromEntries(namesWithDefinitions)

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

      const parentTheme = this.state.themes[parentName]

      console.log('themeDefinition', themeName, themeDefinition)

      if ('mask' in themeDefinition) {
        out[themeName] = {}
        // ...
        // const next = applyMask()
      } else {
        if (!this.state.palettes) {
          throw new Error(
            `No palettes defined for theme with palette expected: ${themeName}`
          )
        }

        let palette = this.state.palettes[themeDefinition.palette]

        if (!palette) {
          const fullPaletteName = `${parentName}_${themeDefinition.palette}`
          console.log('fullPaletteName', fullPaletteName)
          palette = this.state.palettes[fullPaletteName]
          // try using the prefix
        }

        if (!palette) {
          throw new Error(`No palette for theme ${themeName}: ${themeDefinition.palette}`)
        }

        out[themeName] = { palette, themeDefinition }
      }
    }

    return out
  }
}
