import type { TamaguiInternalConfig } from '../types'

export const TAMAGUI_CSS_LAYER = 'tamagui'

export function isTailwindStyleMode(
  config: Pick<TamaguiInternalConfig, 'settings'> | null | undefined
): boolean {
  return (
    config?.settings?.styleMode === 'tailwind' ||
    config?.settings?.styleMode === 'tamagui-and-tailwind'
  )
}

export function wrapWithTamaguiLayer(css: string): string {
  return css ? `@layer ${TAMAGUI_CSS_LAYER} {\n${css}\n}` : ''
}
