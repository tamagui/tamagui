import type { ButtonProps } from 'tamagui'

import { getTokenRelative } from '@tamagui/get-token'
import { accentTokenName } from '~/features/studio/accentThemeName'
import type { DemoOptions } from '../theme/constants/demoOptions'

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
      borderWidth:
        demosOptions.borderWidth === 0
          ? 0.5
          : demosOptions.borderWidth === 2
            ? 1
            : demosOptions.borderWidth,
    } as const,

    borderRadiusOuterProps: {
      borderRadius: getTokenRelative('radius', demosOptions.borderRadius as any, {
        shift: 1,
      }),
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
          ? '$color12'
          : demosOptions.textAccent === 'low'
            ? '$color11'
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
        demosOptions.backgroundAccent === 'low' ? '$color1' : '$background02',
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
      borderColor: 'transparent',
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
          ? ('$7' as const)
          : demosOptions.spacing === 'md'
            ? ('$6' as const)
            : ('$5' as const),
    } as const,

    gapPropsMd: {
      gap:
        demosOptions.spacing === 'lg'
          ? ('$4' as const)
          : demosOptions.spacing === 'md'
            ? ('$3' as const)
            : ('$2' as const),
    } as const,

    gapPropsLg: {
      gap:
        demosOptions.spacing === 'lg'
          ? ('$5' as const)
          : demosOptions.spacing === 'md'
            ? ('$4' as const)
            : ('$3' as const),
    } as const,

    // these ones are just common props - nothing to do with the demo options
    panelProps: {
      shadowColor: 'rgba(0,0,0,0.2)',
      bw: '$0.5',
      bc: '$borderColor',
      gap: '$3',
      py: '$4',
      w: '100%',
      h: '100%',
    } as const,

    panelDescriptionProps: {
      color: '$color10',
      size: '$4',
    } as const,
  }
}
