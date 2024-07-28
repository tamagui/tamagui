import { withStaticProperties } from '@tamagui/helpers'
import type {
  TamaguiComponentExpectingVariants,
  TextProps,
  ViewProps,
} from '@tamagui/web'
import { createStyledContext, styled } from '@tamagui/web'

export const createButton = <Variants extends Record<string, any>>(options: {
  Frame: TamaguiComponentExpectingVariants<ViewProps, Variants>
  Text: TamaguiComponentExpectingVariants<TextProps, Variants>
  Icon: TamaguiComponentExpectingVariants<TextProps, Variants>
  defaultVariants?: { [Key in keyof Variants]: Variants[Key] | undefined }
  name?: string
}) => {
  const context = createStyledContext(options.defaultVariants)
  const name = options.name ?? 'button'

  const Frame = styled(options.Frame, {
    context,
    name,
    group: name as any,
    role: 'button',
    tag: 'button',
  })

  const Icon = styled(options.Icon, {
    name,
    context,
  })

  const Text = styled(options.Text, {
    name,
    context,
  })

  return withStaticProperties(Frame, {
    Apply: context.Provider,
    Text,
    Icon,
  })
}
