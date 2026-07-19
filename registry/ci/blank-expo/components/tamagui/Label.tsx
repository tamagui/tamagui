// Styled Label = the unstyled @tamagui/ui Label behavior (label element, flex
// alignment, selection/cursor resets, the size-derived font mechanism, and the
// htmlFor/aria wiring) + the default v2-look skin (theme text color + the press
// color feedback). Single skin definition; the shadcn registry item is generated
// from this file.
import { type GetProps, Label as UiLabel, styled } from '@tamagui/ui'

export const Label = styled(UiLabel, {
  name: 'Label',
  color: '$color',
  pressStyle: { color: '$colorPress' },
})

export type LabelProps = GetProps<typeof Label> & {
  htmlFor?: string
}
