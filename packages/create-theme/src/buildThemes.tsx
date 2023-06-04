import { objectFromEntries, objectKeys } from './helpers'

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
    }
  | {
      mask: string
    }

type PaletteDefinitions = {
  [key: string]: Palette
}

type ThemeDefinitions = {
  [key: string]: Theme
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

    // return new ThemeBuilder({
    //   ...this.state,
    //   palettes: {
    //     ...this.state.palettes,
    //     ...palettes,
    //   },
    // })
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

    const currentThemeNames = objectKeys(currentThemes)
    const incomingThemeNames = objectKeys(childThemeDefinition)

    type CurrentNames = Exclude<keyof typeof currentThemes, symbol | number>
    type ChildNames = Exclude<keyof CT, symbol | number>

    const names = currentThemeNames.flatMap((prefix) => {
      return incomingThemeNames.map(
        (name) =>
          // @ts-expect-error always strings
          `${prefix}_${name}`
      )
    }) as `${CurrentNames}_${ChildNames}`[]

    const childThemes = objectFromEntries(
      names.map((name) => [name, childThemeDefinition])
    )

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
    return this
  }
}

// -------------------------------------

if (process.env.NODE_ENV === 'development') {
  require('./tests-buildThemes')
}
