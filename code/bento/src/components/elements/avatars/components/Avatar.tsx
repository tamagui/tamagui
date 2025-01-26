import { getFontSized } from '@tamagui/get-font-sized'
import { forwardRef } from 'react'
import type { ColorTokens, FontSizeTokens, GetProps, SizeTokens } from 'tamagui'
import {
  View,
  Avatar as TAvatar,
  createStyledContext,
  getFontSize,
  getVariable,
  styled,
  Text,
  useGetThemedIcon,
  useTheme,
  withStaticProperties,
} from 'tamagui'

const AvatarContext = createStyledContext<{
  size: SizeTokens
  color?: ColorTokens | string
}>({
  size: '$true',
  color: undefined,
})

const AvatarIconFrame = styled(View, {
  context: AvatarContext,
  borderRadius: 1000_000_000,
  zIndex: 100,
  borderWidth: '$1',
  borderColor: '$color1',
  position: 'absolute',
  backgroundColor: '$color5',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    placement: {
      'top-right': {
        top: 0,
        right: 0,
      },
      'top-left': {
        top: 0,
        left: 0,
      },
      'bottom-right': {
        bottom: 0,
        right: 0,
      },
      'bottom-left': {
        bottom: 0,
        left: 0,
      },
    },
    offset: {
      ':number': (val, { props }) => {
        const placement = (props as any).placement
        const yDir = placement.includes('top') ? -1 : 1
        const xDir = placement.includes('left') ? -1 : 1
        return {
          x: val * xDir,
          y: val * yDir,
        }
      },
    },
    size: {
      '...size': (val, { props, tokens }) => {
        return {
          width: tokens.size[val].val * 0.33,
          height: tokens.size[val].val * 0.33,
        }
      },
    },
  } as const,

  defaultVariants: {
    placement: 'top-right',
  },
})

// aligns icons to natural font size
const getIconSize = (size: FontSizeTokens, scale: number) => {
  return (
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens) * 0.75) *
    scale
  )
}

export const AvatarIcon = AvatarIconFrame.styleable<{ scaleIcon?: number }>(
  (props, ref) => {
    const { children, scaleIcon = 1, ...rest } = props
    const { size, color: colorProp } = AvatarContext.useStyledContext()

    const theme = useTheme()
    const color = getVariable(
      colorProp || theme[colorProp as any]?.get('web') || theme.color10?.get('web')
    )
    const iconSize = getIconSize(size as FontSizeTokens, scaleIcon)

    const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
    return (
      <AvatarIconFrame ref={ref} {...rest}>
        {getThemedIcon(children)}
      </AvatarIconFrame>
    )
  }
)

const AvatarWrapper = styled(View, {
  context: AvatarContext,

  variants: {
    size: {
      '...size': {} as any,
    },
  } as const,
})

const AvatarText = styled(Text, {
  context: AvatarContext,
  fontFamily: '$body',

  variants: {
    size: {
      '...fontSize': getFontSized,
    },
  } as const,

  defaultVariants: {
    size: '$true',
  },
})

const AvatarContent = forwardRef<any, GetProps<typeof TAvatar>>((props, ref) => {
  const { size } = AvatarContext.useStyledContext()
  return (
    <View borderWidth="$1" borderColor="$color1" borderRadius={1_000_000_000}>
      <TAvatar elevation={5} size={size} ref={ref} {...props} />
    </View>
  )
})

export const Avatar = withStaticProperties(AvatarWrapper, {
  Content: AvatarContent,
  Image: TAvatar.Image,
  Fallback: TAvatar.Fallback,
  Icon: AvatarIcon,
  Text: AvatarText,
})
