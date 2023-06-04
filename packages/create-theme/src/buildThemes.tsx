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

class ThemeBuilder {
  constructor(private state: ThemeBuilderState) {}

  addPalettes<P extends PaletteDefinitions>(palettes: P) {
    this.state.palettes = {
      ...this.state.palettes,
      ...palettes,
    }
    return new ThemeBuilder(this.state)
  }

  addTemplates<T extends TemplateDefinitions>(templates: T) {
    this.state.templates = {
      ...this.state.templates,
      ...templates,
    }
    return new ThemeBuilder(this.state)
  }

  addMasks<T extends TemplateDefinitions>(masks: T) {
    this.state.masks = {
      ...this.state.masks,
      ...masks,
    }
    return new ThemeBuilder(this.state)
  }

  addThemes<T extends ThemeDefinitions>(themes: T) {
    this.state.themes = {
      ...this.state.themes,
      ...themes,
    }
    return new ThemeBuilder(this.state)
  }

  addChildThemes<CT extends ThemeDefinitions>(childThemes: CT) {
    this.state.themes = {
      ...this.state.themes,
      ...childThemes,
    }
    return new ThemeBuilder(this.state)
  }
}

// -------------------------------------

if (process.env.NODE_ENV === 'development') {
  require('./tests-buildThemes')
}
