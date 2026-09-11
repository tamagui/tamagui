import { createPalettes, createSimpleThemeBuilder } from './createThemes'
import { defaultComponentThemes } from './defaultComponentThemes'
import { defaultTemplates } from './defaultTemplates'
import { defaultTemplatesStronger } from './defaultTemplatesStronger'
import { defaultTemplatesStrongest } from './defaultTemplatesStrongest'
import type { BuildThemeSuiteProps } from './types'

// for studio
// allows more detailed configuration, used by studio
// eventually we should merge this down into simple and have it handle what we need

export function createStudioThemes(props: BuildThemeSuiteProps) {
  const palettes = createPalettes(props.palettes)

  const templates =
    props.templateStrategy === 'stronger'
      ? defaultTemplatesStronger
      : props.templateStrategy === 'strongest'
        ? defaultTemplatesStrongest
        : defaultTemplates

  return createSimpleThemeBuilder({
    palettes,
    templates,
    componentThemes: defaultComponentThemes,
    accentTheme: !!props.palettes.accent,
  })
}
