/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
import * as React from 'react'
import { StyleSheet } from '@tamagui/react-native-web-internals'

import createElement from '../createElement/index'

const ANIMATION_DURATION = 300

function getAnimationStyle(animationType, visible) {
  if (animationType === 'slide') {
    return visible ? animatedSlideInStyles : animatedSlideOutStyles
  }

  if (animationType === 'fade') {
    return visible ? animatedFadeInStyles : animatedFadeOutStyles
  }

  return visible ? styles.container : styles.hidden
}

function ModalAnimation(props) {
  const animationType = props.animationType
  const children = props.children
  const onDismiss = props.onDismiss
  const onShow = props.onShow
  const visible = props.visible

  const [isRendering, setIsRendering] = React.useState(false)

  const wasVisible = React.useRef(false)
  const isAnimated = animationType && animationType !== 'none'
  const animationEndCallback = React.useCallback(
    (e) => {
      if (e && e.currentTarget !== e.target) {
        // If the event was generated for something NOT this element we
        // should ignore it as it's not relevant to us
        return
      }

      if (visible) {
        if (onShow) {
          onShow()
        }
      } else {
        setIsRendering(false)

        if (onDismiss) {
          onDismiss()
        }
      }
    },
    [onDismiss, onShow, visible]
  )
  React.useEffect(() => {
    if (visible) {
      setIsRendering(true)
    }

    if (visible !== wasVisible.current && !isAnimated) {
      // Manually call `animationEndCallback` if no animation is used
      animationEndCallback()
    }

    wasVisible.current = visible
  }, [isAnimated, visible, animationEndCallback])
  return isRendering || visible
    ? createElement('div', {
        style: isRendering ? getAnimationStyle(animationType, visible) : styles.hidden,
        onAnimationEnd: animationEndCallback,
        children,
      })
    : null
}

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999,
  },
  animatedIn: {
    animationDuration: ANIMATION_DURATION + 'ms',
    animationTimingFunction: 'ease-in',
  },
  animatedOut: {
    pointerEvents: 'none',
    animationDuration: ANIMATION_DURATION + 'ms',
    animationTimingFunction: 'ease-out',
  },
  fadeIn: {
    opacity: 1,
    animationKeyframes: {
      '0%': {
        opacity: 0,
      },
      '100%': {
        opacity: 1,
      },
    },
  },
  fadeOut: {
    opacity: 0,
    animationKeyframes: {
      '0%': {
        opacity: 1,
      },
      '100%': {
        opacity: 0,
      },
    },
  },
  slideIn: {
    transform: [
      {
        translateY: '0%',
      },
    ],
    animationKeyframes: {
      '0%': {
        transform: [
          {
            translateY: '100%',
          },
        ],
      },
      '100%': {
        transform: [
          {
            translateY: '0%',
          },
        ],
      },
    },
  },
  slideOut: {
    transform: [
      {
        translateY: '100%',
      },
    ],
    animationKeyframes: {
      '0%': {
        transform: [
          {
            translateY: '0%',
          },
        ],
      },
      '100%': {
        transform: [
          {
            translateY: '100%',
          },
        ],
      },
    },
  },
  hidden: {
    opacity: 0,
  },
})
const animatedSlideInStyles = [styles.container, styles.animatedIn, styles.slideIn]
const animatedSlideOutStyles = [styles.container, styles.animatedOut, styles.slideOut]
const animatedFadeInStyles = [styles.container, styles.animatedIn, styles.fadeIn]
const animatedFadeOutStyles = [styles.container, styles.animatedOut, styles.fadeOut]
export default ModalAnimation
