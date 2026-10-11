// Styled Label = the unstyled @tamagui/ui Label behavior (label element, flex
// alignment, selection/cursor resets, the size-derived font mechanism, and the
// htmlFor/aria wiring) + the default v2-look skin (theme text color + the press
// color feedback). Single skin definition; the shadcn registry item is generated
// from this file.
import { type GetProps, styled } from '@tamagui/core'
import { Label as UiLabel } from '@tamagui/label'

export const Label = styled(UiLabel, {
  displayName: 'Label',
  color: 'color press:color-press',
})

export type LabelProps = GetProps<typeof Label> & {
  htmlFor?: string
}
