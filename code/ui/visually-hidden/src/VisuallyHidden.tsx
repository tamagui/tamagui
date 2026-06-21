import { isAndroid, isWeb } from '@tamagui/constants'
import {
  type TamaDefer,
  type TamaguiComponent,
  type TamaguiTextElement,
  Text,
  type TextNonStyleProps,
  type TextStylePropsBase,
  styled,
} from '@tamagui/web'

// Standard "sr-only" visually-hidden style block:
// - position: absolute + 1x1 clipped box so it consumes no layout
// - overflow: hidden + clip so the content isn't painted
// - margin: -1 + border: 0 to neutralize the 1x1 box visually
// - whiteSpace: nowrap so wrapped text doesn't fight the 1x1 width
//
// We intentionally do NOT use display: none, visibility: hidden, or opacity: 0,
// because each of those also hides the content from assistive tech on web.
const VisuallyHiddenFrame = styled(Text, {
  name: 'VisuallyHidden',

  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  borderWidth: 0,
  zIndex: -10000,
  overflow: 'hidden',
  pointerEvents: 'none',

  ...(isWeb && {
    // sr-only style block; clipPath is the modern replacement for clip
    // and is what tailwind's sr-only uses.
    clip: 'rect(0, 0, 0, 0)' as any,
    clipPath: 'inset(50%)' as any,
    whiteSpace: 'nowrap' as any,
    wordWrap: 'normal' as any,
  }),

  variants: {
    preserveDimensions: {
      true: {
        position: 'relative',
        width: 'auto',
        height: 'auto',
      },
    },

    // Escape hatch to fully reveal the element (the old "not-sr-only").
    visible: {
      true: {
        position: 'relative',
        width: 'auto',
        height: 'auto',
        margin: 0,
        padding: 0,
        zIndex: 1,
        overflow: 'visible',
        opacity: 1,
        pointerEvents: 'auto',
        ...(isWeb && {
          clip: 'auto' as any,
          clipPath: 'none' as any,
          whiteSpace: 'normal' as any,
        }),
      },
    },
  } as const,
})

export const VisuallyHidden: TamaguiComponent<
  TamaDefer,
  TamaguiTextElement,
  TextNonStyleProps,
  TextStylePropsBase,
  {
    visible?: boolean | undefined
    preserveDimensions?: boolean | undefined
  }
> = VisuallyHiddenFrame.styleable(function VisuallyHidden(props, forwardedRef) {
  const { visible, ...rest } = props as any

  // When `visible` is true the user opted out of hiding entirely — pass through.
  if (visible) {
    return <VisuallyHiddenFrame ref={forwardedRef} visible {...rest} />
  }

  // a11y semantics: visually hidden but still announced.
  // - web: aria-hidden=false so the SR reads the content
  // - native: accessible=true to ensure the SR focuses the node
  // - android: importantForAccessibility="yes" to override any ancestor "no-hide-descendants"
  const a11yProps = isWeb
    ? ({ 'aria-hidden': false } as any)
    : ({
        accessible: true,
        ...(isAndroid && { importantForAccessibility: 'yes' as const }),
      } as any)

  return <VisuallyHiddenFrame ref={forwardedRef} {...a11yProps} {...rest} />
}) as any

// @tamgui/core checks for this in spacing
;(VisuallyHidden as any)['isVisuallyHidden'] = true
