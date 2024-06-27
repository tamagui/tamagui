// forked from radix https://github.com/radix-ui/primitives/blob/main/packages/react/avatar/src/Avatar.tsx

import type { GetProps, SizeTokens, TamaguiElement } from '@tamagui/core'
import { getTokens, getVariableValue, styled } from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { withStaticProperties } from '@tamagui/helpers'
import type { ImageProps } from '@tamagui/image'
import { Image } from '@tamagui/image'
import { Square, getShapeSize } from '@tamagui/shapes'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'

const AVATAR_NAME = 'Avatar'

type ScopedProps<P> = P & { __scopeAvatar?: Scope }
const [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME)

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

type AvatarContextValue = {
  size: SizeTokens
  imageLoadingStatus: ImageLoadingStatus
  onImageLoadingStatusChange(status: ImageLoadingStatus): void
}

const [AvatarProvider, useAvatarContext] =
  createAvatarContext<AvatarContextValue>(AVATAR_NAME)

/* -------------------------------------------------------------------------------------------------
 * AvatarImage
 * -----------------------------------------------------------------------------------------------*/

const IMAGE_NAME = 'AvatarImage'

type AvatarImageProps = Partial<ImageProps> & {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void
}

const AvatarImage = React.forwardRef<TamaguiElement, AvatarImageProps>(
  (props: ScopedProps<AvatarImageProps>, forwardedRef) => {
    const { __scopeAvatar, src, onLoadingStatusChange = () => {}, ...imageProps } = props
    const context = useAvatarContext(IMAGE_NAME, __scopeAvatar)
    const [status, setStatus] = React.useState<ImageLoadingStatus>('idle')
    const shapeSize = getVariableValue(
      getShapeSize(
        context.size,
        // @ts-expect-error
        { tokens: getTokens() }
      )?.width
    ) as number

    React.useEffect(() => {
      setStatus('idle')
    }, [JSON.stringify(src)])

    React.useEffect(() => {
      onLoadingStatusChange(status)
      context.onImageLoadingStatusChange(status)
    }, [status])

    return (
      <YStack fullscreen zIndex={1}>
        <Image
          fullscreen
          {...(typeof shapeSize === 'number' &&
            !Number.isNaN(shapeSize) && {
              width: shapeSize,
              height: shapeSize,
            })}
          {...imageProps}
          // @ts-ignore
          ref={forwardedRef}
          // @ts-ignore
          src={src}
          // onLoadStart={() => {
          //   // setStatus('loading')
          // }}
          onError={() => {
            setStatus('error')
          }}
          onLoad={() => {
            setStatus('loaded')
          }}
        />
      </YStack>
    )
  }
)

AvatarImage.displayName = IMAGE_NAME

/* -------------------------------------------------------------------------------------------------
 * AvatarFallback
 * -----------------------------------------------------------------------------------------------*/

const FALLBACK_NAME = 'AvatarFallback'

export const AvatarFallbackFrame = styled(YStack, {
  name: FALLBACK_NAME,
  position: 'absolute',
  fullscreen: true,
  zIndex: 0,
})

type AvatarFallbackProps = GetProps<typeof AvatarFallbackFrame> & {
  delayMs?: number
}

const AvatarFallback = AvatarFallbackFrame.extractable(
  React.forwardRef<TamaguiElement, AvatarFallbackProps>(
    (props: ScopedProps<AvatarFallbackProps>, forwardedRef) => {
      const { __scopeAvatar, delayMs, ...fallbackProps } = props
      const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar)
      const [canRender, setCanRender] = React.useState(delayMs === undefined)

      React.useEffect(() => {
        if (delayMs !== undefined) {
          const timerId = setTimeout(() => setCanRender(true), delayMs)
          return () => clearTimeout(timerId)
        }
      }, [delayMs])

      return canRender && context.imageLoadingStatus !== 'loaded' ? (
        <AvatarFallbackFrame {...fallbackProps} ref={forwardedRef} />
      ) : null
    }
  )
)

AvatarFallback.displayName = FALLBACK_NAME

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

export const AvatarFrame = styled(Square, {
  name: AVATAR_NAME,
  position: 'relative',
  overflow: 'hidden',
})

type AvatarProps = GetProps<typeof AvatarFrame>

const Avatar = withStaticProperties(
  React.forwardRef<TamaguiElement, AvatarProps>(
    (props: ScopedProps<AvatarProps>, forwardedRef) => {
      const { __scopeAvatar, size = '$true', ...avatarProps } = props
      const [imageLoadingStatus, setImageLoadingStatus] =
        React.useState<ImageLoadingStatus>('idle')
      return (
        <AvatarProvider
          size={size}
          scope={__scopeAvatar}
          imageLoadingStatus={imageLoadingStatus}
          onImageLoadingStatusChange={setImageLoadingStatus}
        >
          <AvatarFrame size={size} {...avatarProps} ref={forwardedRef} />
        </AvatarProvider>
      )
    }
  ),
  {
    Image: AvatarImage,
    Fallback: AvatarFallback,
  }
)

Avatar.displayName = AVATAR_NAME

export { createAvatarScope, Avatar, AvatarImage, AvatarFallback }
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps }
