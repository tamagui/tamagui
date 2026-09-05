// the integration-owned artifact must be in the document before createTamagui
// evaluates the empty client themes in the config imported below
import '../.tamagui/global/tamagui-global.css'
import {
  config,
  inputThemeNameCount,
  inputThemeValueCount,
} from '../tamagui.global-hydration.config'

/**
 * jsdom cannot host this receipt because scanAllSheets reads real CSSStyleSheet
 * rules and computed custom properties. Keep one scenario per page load because
 * that scan caches each stylesheet.
 */
const themeValues = (themeName: 'light' | 'dark') => ({
  background: `${config.themes[themeName]?.background?.val ?? ''}`,
  color: `${config.themes[themeName]?.color?.val ?? ''}`,
})

const artifactValues = (themeName: 'light' | 'dark') => {
  const probe = document.createElement('div')
  probe.className = `t_${themeName}`
  document.body.appendChild(probe)
  const style = getComputedStyle(probe)
  const values = {
    background: style.getPropertyValue('--background').trim(),
    color: style.getPropertyValue('--color').trim(),
  }
  probe.remove()
  return values
}

;(window as any).__globalHydration = {
  inputThemeNameCount,
  inputThemeValueCount,
  rebuiltThemeNameCount: Object.keys(config.themes).length,
  rebuilt: {
    light: themeValues('light'),
    dark: themeValues('dark'),
  },
  artifact: {
    light: artifactValues('light'),
    dark: artifactValues('dark'),
  },
}

document.title = 'global hydration done'
