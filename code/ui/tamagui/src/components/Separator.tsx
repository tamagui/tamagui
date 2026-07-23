// Styled Separator = the unstyled @tamagui/ui Separator behavior (orientation +
// layout + the collapsed 1px rule, transparent by default) + the default v2-look
// skin (theme line color). Single skin definition; the shadcn registry item is
// generated from this file.
import { type GetProps, Separator as UiSeparator, styled } from '@tamagui/ui'

export const Separator = styled(UiSeparator, {
  name: 'Separator',
  borderColor: '$backgroundFocus',
})

export type SeparatorProps = GetProps<typeof Separator>
