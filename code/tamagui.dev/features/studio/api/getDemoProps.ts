import type { ButtonProps } from '~/components/Button'

import { accentTokenName } from '~/features/studio/accentThemeName'
import type { DemoOptions } from '../theme/demoOptions'

// the outer border radius is one radius token larger than the inner one
const oneRadiusLarger = (radius: DemoOptions['borderRadius']) => {
  const n = Number(radius)
  return (Number.isNaN(n) ? radius : `${n + 1}`) as DemoOptions['borderRadius']
}

export function getDemoProps(demosOptions: DemoOptions, hasAccent = false) {
  const accentToken = hasAccent ? accentTokenName : 'color-9'
  const isOutlined = demosOptions.fillStyle === 'outlined'

  const accentColor = hasAccent ? 'accent-color' : 'color-1'
  const accentBackground = hasAccent ? accentToken : ('color-11' as const)
  const accentBorder = isOutlined
    ? hasAccent
      ? accentToken
      : 'border-color'
    : 'transparent'

  const accentStyle = {
    backgroundColor: isOutlined ? 'transparent' : accentToken,
    color: isOutlined ? 'color-2' : accentColor,
  } as const

  return {
    borderRadiusProps: {
      borderRadius: demosOptions.borderRadius,
      borderWidth: demosOptions.borderWidth,
    } as const,

    borderRadiusOuterProps: {
      borderRadius: oneRadiusLarger(demosOptions.borderRadius),
      borderWidth: demosOptions.borderWidth,
    } as const,

    accentColor,
    accentBackground,
    accentStyle,

    headingFontFamilyProps: {
      fontFamily: demosOptions.headingFontFamily,
      fontWeight: '500',
      size: '4',
      fontSize: 25,
      color:
        demosOptions.textAccent === 'high'
          ? 'color-11'
          : demosOptions.textAccent === 'low'
            ? 'color-11'
            : 'color',

      ...(demosOptions.headingFontFamily == 'heading' && {
        fontSize: 14,
      }),

      ...(demosOptions.headingFontFamily === 'mono' && {
        fontSize: 16,
      }),
    } as const,

    buttonOutlineProps: {
      variant: isOutlined ? ('outlined' as const) : (undefined as any),
      color: isOutlined ? 'color-10' : undefined,
      // ...(hasAccent && accentStyle),
      borderColor: hasAccent ? accentBorder : 'border-color',
    } as ButtonProps,

    stackOutlineProps: {
      backgroundColor: demosOptions.backgroundAccent === 'low' ? 'color-1' : 'color-2',
    } as const,

    chatFrameProps: {
      borderColor: isOutlined ? 'border-color' : 'transparent',
      backgroundColor: isOutlined
        ? undefined
        : demosOptions.backgroundAccent === 'high'
          ? 'color-3'
          : 'color-2',
    } as const,

    chatFrameActiveProps: {
      borderColor: 'transparent',
      backgroundColor: isOutlined ? 'transparent' : accentBackground,
    } as const,

    chatTextProps: {} as const,

    chatTextActiveProps: {
      color: isOutlined ? 'color-1' : 'color-2',
    } as const,

    outlineTextProps: {
      color: isOutlined ? 'color-11' : 'color-1',
    } as const,

    elevationProps: {
      elevation: demosOptions.elevation,
    } as const,

    panelPaddingProps: {
      padding:
        demosOptions.spacing === 'lg'
          ? ('7' as const)
          : demosOptions.spacing === 'md'
            ? ('5' as const)
            : ('4' as const),
    } as const,

    gapPropsMd: {
      gap:
        demosOptions.spacing === 'lg'
          ? ('4' as const)
          : demosOptions.spacing === 'md'
            ? ('3' as const)
            : ('2' as const),
    } as const,

    gapPropsLg: {
      gap:
        demosOptions.spacing === 'lg'
          ? ('5' as const)
          : demosOptions.spacing === 'md'
            ? ('4' as const)
            : ('3' as const),
    } as const,

    // these ones are just common props - nothing to do with the demo options
    panelProps: {
      shadowColor: 'rgba(0,0,0,0.2)',
      borderWidth: 0.5,
      borderColor: 'color-3',
      gap: '3',
      py: '4',
      width: '100%',
      height: '100%',
    } as const,

    panelDescriptionProps: {
      color: 'color-10',
      size: '4',
    } as const,
  }
}
