import { MediaPropKeys, ThemeName, useMedia, useThemeName } from '@tamagui/core'
import React, { forwardRef, useImperativeHandle } from 'react'
import { Platform } from 'react-native'

import { VisuallyHidden } from './VisuallyHidden'

export type HiddenProps =
  | {
      // only show for this theme
      theme?: ThemeName
      // one or more platforms to only show on
      platform?: ('ios' | 'web' | 'android')[]
      children?: React.ReactNode
      // defaults to visually-hidden
      strategy?: 'visually-hidden' | 'preserve-dimensions' | 'remove'
    } & (
      | {
          // show only when queries between this and to are active
          from?: MediaPropKeys
          // show only when queries to back to from are active
          to?: MediaPropKeys
        }
      | {
          // exclusively show at these media queries
          only?: MediaPropKeys[]
        }
    )

type HiddenHandle = {
  getIsHidden(): boolean
}

export const Hidden = forwardRef<HiddenHandle, HiddenProps>(
  ({ platform, strategy, theme, children, ...medias }, ref) => {
    const hiddenChildren =
      strategy === 'remove' ? null : (
        <VisuallyHidden preserveDimensions={strategy === 'preserve-dimensions'}>
          {children}
        </VisuallyHidden>
      )

    function getHiddenChild() {
      const themeName = useThemeName()
      if (theme && themeName !== theme) {
        return hiddenChildren
      }

      const isHiddenByPlatform = !platform ? false : platform.includes(Platform.OS as any)
      if (isHiddenByPlatform) {
        return hiddenChildren
      }

      const media = useMedia()
      if ('only' in medias && !medias.only?.some((bp) => media[bp])) {
        return hiddenChildren
      }
      const mediaKeys = Object.keys(media)
      console.log('mediaKeys', mediaKeys, 'todo')
      const activeRange = [
        'from' in medias && medias.from ? mediaKeys.indexOf(medias.from.slice(1)) : 0,
        'to' in medias && medias.to ? mediaKeys.indexOf(medias.to.slice(1)) : mediaKeys.length - 1,
      ]
      console.log('activeRange', activeRange)
      if (!mediaKeys.slice(activeRange[0], activeRange[1]).some((k) => media[k])) {
        return hiddenChildren
      }
    }

    const hiddenChild = getHiddenChild()

    useImperativeHandle(
      ref,
      () => ({
        getIsHidden() {
          return !!hiddenChild
        },
      }),
      [hiddenChild]
    )

    if (hiddenChild) {
      return hiddenChild
    }

    return <>{children}</>
  }
)

// @tamgui/core checks for this in spacing
Hidden['isHidden'] = true
