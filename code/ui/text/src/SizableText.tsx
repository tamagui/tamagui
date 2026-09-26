import { getFontSized } from '@tamagui/get-font-sized'
import type { GetProps } from '@tamagui/web'
import { Text, styled } from '@tamagui/web'

const SizableTextFrame = styled(Text, {
  displayName: 'SizableText',
  fontFamily: 'body',
  color: 'color',
  size: true,
  variants: {
    size: getFontSized,
  },
})

export const SizableText = SizableTextFrame.resolve((props, env) => {
  if (props.fontFamily === 'inherit') {
    return { fontFamily: 'inherit' }
  }

  // This replaces the old `fontFamily: { any: ... }` variant. Only an
  // authored fontFamily prop triggered that variant; running it for the
  // component's inherited base family would let this resolver overwrite a
  // later variant's size (for example H1's unstyled=false -> size=10).
  if (props.fontFamily === undefined) {
    return {}
  }

  const size =
    props.size === true && props.fontSize ? props.fontSize : (props.size ?? true)
  const sized = getFontSized(size as any, env)
  return {
    color: sized?.color,
    fontFamily: sized?.fontFamily,
    fontSize: sized?.fontSize,
    fontStyle: sized?.fontStyle,
    fontWeight: sized?.fontWeight,
    letterSpacing: sized?.letterSpacing,
    lineHeight: sized?.lineHeight,
    textTransform: sized?.textTransform,
  }
})

SizableText.staticConfig.inlineProps = new Set([
  ...(SizableText.staticConfig.inlineProps || []),
  'maxFontSizeMultiplier',
])

export type SizableTextProps = GetProps<typeof SizableText>
