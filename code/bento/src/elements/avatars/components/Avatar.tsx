import type { ComponentSize } from '@tamagui/core'
import { forwardRef } from 'react'
import type { ColorTokens, GetProps } from 'tamagui'
import {
  createStyledHOC,
  View,
  Avatar as TAvatar,
  createStyledContext,
  getVariable,
  styled,
  Text,
  useGetThemedIcon,
  useTheme,
  withStaticProperties,
} from 'tamagui'

const AvatarContext = createStyledContext<{
  size: ComponentSize
  color?: ColorTokens | string
}>({
  size: 'md',
  color: undefined,
})

// avatars sit a step above controls: px for the image, text and badge per size
const avatarSizes = {
  xs: { px: 32, fontSize: 'xs' },
  sm: { px: 40, fontSize: 'sm' },
  md: { px: 48, fontSize: 'base' },
  lg: { px: 64, fontSize: 'lg' },
  xl: { px: 80, fontSize: 'xl' },
} as const

const avatarPx = (size: ComponentSize) => (avatarSizes[size] ?? avatarSizes.md).px

const AvatarIconFrame = styled(View, {
  context: AvatarContext,
  rounded: 1000_000_000,
  z: 100,
  borderWidth: '1',
  borderColor: 'color-1',
  position: 'absolute',
  bg: 'color-5',
  items: 'center',
  justify: 'center',
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
    offset: styled.dynamic<number>(),
    size: styled.dynamic<ComponentSize>((val) => {
      const badge = Math.round(avatarPx(val) * 0.33)
      return { width: badge, height: badge }
    }),
  } as const,
  defaultVariants: {
    placement: 'top-right',
  },
}).resolve((props) => {
  const { placement = 'top-right', offset } = props as {
    placement?: string
    offset?: number
  }
  if (!offset) return
  return {
    x: offset * (placement.includes('left') ? -1 : 1),
    y: offset * (placement.includes('top') ? -1 : 1),
  }
})


export const AvatarIcon = createStyledHOC(
  AvatarIconFrame,
  (props: React.PropsWithChildren<{ scaleIcon?: number }>, ref) => {
    const { children, scaleIcon = 1, ...rest } = props
    const { size, color: colorProp } = AvatarContext.useStyledContext()

    const theme = useTheme()
    const color = getVariable(
      colorProp || theme[colorProp as any]?.get('web') || theme['color-9']?.get('web')
    )
    const iconSize = Math.round(avatarPx(size) * 0.33 * 0.6 * scaleIcon)

    const getThemedIcon = useGetThemedIcon({
      size: iconSize,
      color: color as any,
    })
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
    size: styled.dynamic<ComponentSize>(),
  } as const,
})

const AvatarText = styled(Text, {
  context: AvatarContext,
  fontFamily: 'body',
  variants: {
    size: styled.dynamic<ComponentSize>((val) => {
      const { fontSize } = avatarSizes[val] ?? avatarSizes.md
      return { fontSize, lineHeight: fontSize }
    }),
  } as const,
})

const AvatarContent = forwardRef<any, GetProps<typeof TAvatar>>((props, ref) => {
  const { size } = AvatarContext.useStyledContext()
  return (
    <View borderWidth="1" borderColor="color-1" rounded={1_000_000_000}>
      <TAvatar boxShadow="0 2px 15px shadow-color" size={avatarPx(size)} ref={ref} {...props} />
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
