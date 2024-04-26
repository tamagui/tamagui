import type { ButtonProps } from 'tamagui'

import { accentTokenName } from '../accentThemeName'
import type { DemoOptions } from '../theme-builder/constants/demoOptions'

export function getDemoProps(demosOptions: DemoOptions, hasAccent = false) {
  const accentToken = hasAccent ? accentTokenName : '$color9'
  const isOutlined = demosOptions.fillStyle === 'outlined'

  const accentColor = hasAccent ? '$accentColor' : '$color1'
  const accentBackground = hasAccent ? accentToken : ('$color11' as const)
  const accentBorder = isOutlined
    ? hasAccent
      ? accentToken
      : '$borderColor'
    : 'transparent'

  const accentStyle = {
    backgroundColor: isOutlined ? 'transparent' : accentToken,
    color: isOutlined ? '$color2' : accentColor,
  } as const

  return {
    borderRadiusProps: {
      borderRadius: demosOptions.borderRadius,
      borderWidth: demosOptions.borderWidth,
    } as const,

    accentColor,
    accentBackground,
    accentStyle,

    headingFontFamilyProps: {
      fontFamily: demosOptions.headingFontFamily,
      fontWeight: '500',
      color:
        demosOptions.textAccent === 'high'
          ? '$color'
          : demosOptions.textAccent === 'low'
            ? '$color10'
            : '$color',
    } as const,

    buttonOutlineProps: {
      variant: isOutlined ? ('outlined' as const) : (undefined as any),
      color: isOutlined ? '$color12' : undefined,
      // ...(hasAccent && accentStyle),
      borderColor: hasAccent ? accentBorder : '$borderColor',
    } as ButtonProps,

    stackOutlineProps: {
      backgroundColor:
        demosOptions.backgroundAccent === 'low' ? '$background' : '$color2',
    } as const,

    chatFrameProps: {
      borderColor: isOutlined ? '$borderColor' : 'transparent',
      backgroundColor: isOutlined
        ? undefined
        : demosOptions.backgroundAccent === 'high'
          ? '$color3'
          : '$color2',
    } as const,

    chatFrameActiveProps: {
      borderColor: accentBorder,
      backgroundColor: isOutlined ? 'transparent' : accentBackground,
    } as const,

    chatTextProps: {} as const,

    chatTextActiveProps: {
      color: isOutlined ? accentBackground : '$color',
    } as const,

    outlineTextProps: {
      color: isOutlined ? '$color11' : '$color1',
    } as const,

    elevationProps: {
      elevation: demosOptions.elevation,
    } as const,

    panelPaddingProps: {
      padding:
        demosOptions.spacing === 'lg'
          ? ('$6' as const)
          : demosOptions.spacing === 'md'
            ? ('$5' as const)
            : ('$4' as const),
    } as const,

    gapPropsMd: {
      gap:
        demosOptions.spacing === 'lg'
          ? ('$2' as const)
          : demosOptions.spacing === 'md'
            ? ('$1.5' as const)
            : ('$1' as const),
    } as const,

    gapPropsLg: {
      gap:
        demosOptions.spacing === 'lg'
          ? ('$4' as const)
          : demosOptions.spacing === 'md'
            ? ('$3' as const)
            : ('$2' as const),
    } as const,

    // these ones are just common props - nothing to do with the demo options
    panelProps: {
      shadowColor: 'black',
      bw: '$0.5',
      bc: '$borderColor',
      gap: '$3',
      p: '$4',
      w: '100%',
      h: '100%',
    } as const,

    panelDescriptionProps: {
      color: '$color11',
      size: '$4',
    } as const,
  }
}
