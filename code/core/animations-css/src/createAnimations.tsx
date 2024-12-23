import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import type { AnimationDriver, UniversalAnimatedNumber } from '@tamagui/web'
import { transformsToString } from '@tamagui/web'
import React, { useState } from 'react' // import { animate } from '@tamagui/cubic-bezier-animator'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  const reactionListeners = new WeakMap<any, Set<Function>>()

  return {
    animations,
    usePresence,
    ResetPresence,
    supportsCSSVars: true,

    useAnimatedNumber(initial): UniversalAnimatedNumber<Function> {
      const [val, setVal] = React.useState(initial)
      const [onFinish, setOnFinish] = useState<Function | undefined>()

      useIsomorphicLayoutEffect(() => {
        if (onFinish) {
          onFinish?.()
          setOnFinish(undefined)
        }
      }, [onFinish])

      return {
        getInstance() {
          return setVal
        },
        getValue() {
          return val
        },
        setValue(next, config, onFinish) {
          setVal(next)
          setOnFinish(onFinish)
        },
        stop() {},
      }
    },

    useAnimatedNumberReaction({ value }, onValue) {
      React.useEffect(() => {
        const instance = value.getInstance()
        let queue = reactionListeners.get(instance)
        if (!queue) {
          const next = new Set<Function>()
          reactionListeners.set(instance, next)
          queue = next!
        }
        queue.add(onValue)
        return () => {
          queue?.delete(onValue)
        }
      }, [])
    },

    useAnimatedNumberStyle(val, getStyle) {
      return getStyle(val.getValue())
    },

    useAnimations: ({ props, presence, style, componentState, stateRef }) => {
      const isEntering = !!componentState.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      // const initialPositionRef = useRef<any>(null)
      const [animationKey, animationConfig] = Array.isArray(props.animation)
        ? props.animation
        : [props.animation]
      const animation = animations[animationKey]
      const keys = props.animateOnly ?? ['all']

      useIsomorphicLayoutEffect(() => {
        const host = stateRef.current.host
        if (!sendExitComplete || !isExiting || !host) return
        const node = host as HTMLElement
        const onFinishAnimation = () => {
          sendExitComplete?.()
        }
        node.addEventListener('transitionend', onFinishAnimation)
        node.addEventListener('transitioncancel', onFinishAnimation)
        return () => {
          node.removeEventListener('transitionend', onFinishAnimation)
          node.removeEventListener('transitioncancel', onFinishAnimation)
        }
      }, [sendExitComplete, isExiting])

      if (animation) {
        if (Array.isArray(style.transform)) {
          style.transform = transformsToString(style.transform)
        }

        // add css transition
        // TODO: we disabled the transform transition, because it will create issue for inverse function and animate function
        // for non layout transform properties either use animate function or find a workaround to do it with css
        style.transition = keys
          .map((key) => {
            const override = animations[animationConfig?.[key]] ?? animation
            return `${key} ${override}`
          })
          .join(', ')
      }

      if (process.env.NODE_ENV === 'development' && props['debug'] === 'verbose') {
        console.info('CSS animation', {
          props,
          animations,
          animation,
          animationKey,
          style,
          isEntering,
          isExiting,
        })
      }

      if (!animation) {
        return null
      }

      return { style, className: isEntering ? 't_unmounted' : '' }
    },
  }
}

// layout animations
// useIsomorphicLayoutEffect(() => {
//   if (!host || !props.layout) {
//     return
//   }
//   // @ts-ignore
//   const boundingBox = host?.getBoundingClientRect()
//   if (isChanged(initialPositionRef.current, boundingBox)) {
//     const transform = invert(
//       host,
//       boundingBox,
//       initialPositionRef.current
//     )

//     animate({
//       from: transform,
//       to: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
//       duration: 1000,
//       onUpdate: ({ x, y, scaleX, scaleY }) => {
//         // @ts-ignore
//         host.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX}) scaleY(${scaleY})`
//         // TODO: handle childRef inverse scale
//         //   childRef.current.style.transform = `scaleX(${1 / scaleX}) scaleY(${
//         //     1 / scaleY
//         //   })`
//       },
//       // TODO: extract ease-in from string and convert/map it to a cubicBezier array
//       cubicBezier: [0, 1.38, 1, -0.41],
//     })
//   }
//   initialPositionRef.current = boundingBox
// })

// style.transition = `${keys} ${animation}${
//   props.layout ? ',width 0s, height 0s, margin 0s, padding 0s, transform' : ''
// }`

// const isChanged = (initialBox: any, finalBox: any) => {
//   // we just mounted, so we don't have complete data yet
//   if (!initialBox || !finalBox) return false

//   // deep compare the two boxes
//   return JSON.stringify(initialBox) !== JSON.stringify(finalBox)
// }

// const invert = (el, from, to) => {
//   const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from
//   const { x, y, width, height } = to

//   const transform = {
//     x: x - fromX - (fromWidth - width) / 2,
//     y: y - fromY - (fromHeight - height) / 2,
//     scaleX: width / fromWidth,
//     scaleY: height / fromHeight,
//   }

//   el.style.transform = `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`

//   return transform
// }
