import { animationsCSS } from '@tamagui/config/animations-css'
import { createV6Config } from '@tamagui/config/v6'
import { createTamagui } from 'tamagui'

/**
 * A narrowed config, which is the whole CSS-size lever the mode gives an app.
 * The v6 default pack ships 128 themes and 306 color tokens; this starter
 * declares the two themes and the handful of color tokens it actually uses, and
 * that difference is most of the transferred cost of a zero-runtime build.
 *
 * The CSS animation driver is required: rule 5 rejects any driver whose
 * outputStyle is not 'css', because every other driver needs the component
 * animation runtime this mode removes.
 */
const colorTokens = {
  ink: '#0a0a0a',
  paper: '#fafafa',
  accent: '#2563eb',
  accentSoft: '#dbeafe',
  muted: '#71717a',
}

const themes = {
  light: {
    background: colorTokens.paper,
    backgroundStrong: '#ffffff',
    color: colorTokens.ink,
    colorMuted: colorTokens.muted,
    borderColor: '#e4e4e7',
    accent: colorTokens.accent,
    accentSoft: colorTokens.accentSoft,
  },
  dark: {
    background: colorTokens.ink,
    backgroundStrong: '#18181b',
    color: colorTokens.paper,
    colorMuted: colorTokens.muted,
    borderColor: '#27272a',
    accent: '#60a5fa',
    accentSoft: '#1e3a8a',
  },
}

export const config = createTamagui({
  ...createV6Config({ themes, colorTokens }),
  animations: animationsCSS,
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
