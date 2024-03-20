import { ColorTokens, SizeTokens, createStyledContext } from '@tamagui/web/types'

export type ContextProps = {
  size?: SizeTokens
  color?: ColorTokens
  unstyled?: boolean
}
export const ListStyledContext = createStyledContext<ContextProps>({
  color: '$color',
  size: '$true',
  unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
})
