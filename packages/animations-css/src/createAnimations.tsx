import {
  AnimationDriver,
  Stack,
  Text,
  UniversalAnimatedNumber,
  useIsomorphicLayoutEffect,
  useSafeRef,
} from '@tamagui/core'
import { animate } from '@tamagui/cubic-bezier-animator'
import { usePresence } from '@tamagui/use-presence'
import { useMemo, useState } from 'react'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  return {
    supportsCSSVariables: true,
    View: Stack,
    Text: Text,
    animations,
    usePresence,

    useAnimatedNumber(initial): UniversalAnimatedNumber<number> {
      const [val, setVal] = useState(initial)

      return {
        getInstance() {
          return val
        },
        getValue() {
          return val
        },
        setValue(next) {
          setVal(next)
        },
        stop() {},
      }
    },

    useAnimatedNumberReaction({ hostRef, value }, onValue) {
      // doesn't make much sense given value the animated value is a state in this driver, but this is compatible
      useIsomorphicLayoutEffect(() => {
        if (!hostRef.current) return
        const onTransitionEvent = (e: TransitionEvent) => {
          onValue(value.getValue())
        }

        const node = hostRef.current as HTMLElement
        node.addEventListener('transitionstart', onTransitionEvent)
        node.addEventListener('transitioncancel', onTransitionEvent)
        node.addEventListener('transitionend', onTransitionEvent)
        return () => {
          node.removeEventListener('transitionstart', onTransitionEvent)
          node.removeEventListener('transitioncancel', onTransitionEvent)
          node.removeEventListener('transitionend', onTransitionEvent)
        }
      }, [hostRef, onValue])
    },

    useAnimatedNumberStyle(val, getStyle) {
      return getStyle(val.getValue())
    },

    useAnimations: ({ props, presence, style, state, hostRef }) => {
      const isEntering = !!state.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      const initialPositionRef = useSafeRef<any>(null)
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation
      const animation = animations[animationKey as any]

      const keys = props.animateOnly ? props.animateOnly.join(' ') : 'all'

      useIsomorphicLayoutEffect(() => {
        if (!sendExitComplete || !isExiting || !hostRef.current) return
        const node = hostRef.current as HTMLElement
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

      // layout animations
      useIsomorphicLayoutEffect(() => {
        if (!hostRef.current || !props.layout) {
          return
        }
        // @ts-ignore
        const boundingBox = hostRef.current?.getBoundingClientRect()
        if (isChanged(initialPositionRef.current, boundingBox)) {
          const transform = invert(
            hostRef.current,
            boundingBox,
            initialPositionRef.current
          )

          animate({
            from: transform,
            to: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
            duration: 1000,
            onUpdate: ({ x, y, scaleX, scaleY }) => {
              // @ts-ignore
              hostRef.current.style.transform = `translate(${x}px, ${y}px) scaleX(${scaleX}) scaleY(${scaleY})`
              // TODO: handle childRef inverse scale
              //   childRef.current.style.transform = `scaleX(${1 / scaleX}) scaleY(${
              //     1 / scaleY
              //   })`
            },
            // TODO: extract ease-in from string and convert/map it to a cubicBezier array
            cubicBezier: [0, 1.38, 1, -0.41],
          })
        }
        initialPositionRef.current = boundingBox
      })

      if (!animation) {
        return null
      }

      // add css transition
      // TODO: we disabled the transform transition, because it will create issue for inverse function and animate function
      // for non layout transform properties either use animate function or find a workaround to do it with css
      style.transition = `${keys} ${animation}${
        props.layout ? ',width 0s, height 0s, margin 0s, padding 0s, transform' : ''
      }`

      if (process.env.NODE_ENV === 'development' && props['debug']) {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('CSS animation', style, { isEntering, isExiting })
      }

      return { style }
    },
  }
}

const isChanged = (initialBox: any, finalBox: any) => {
  // we just mounted, so we don't have complete data yet
  if (!initialBox || !finalBox) return false

  // deep compare the two boxes
  return JSON.stringify(initialBox) !== JSON.stringify(finalBox)
}

const invert = (el, from, to) => {
  const { x: fromX, y: fromY, width: fromWidth, height: fromHeight } = from
  const { x, y, width, height } = to

  const transform = {
    x: x - fromX - (fromWidth - width) / 2,
    y: y - fromY - (fromHeight - height) / 2,
    scaleX: width / fromWidth,
    scaleY: height / fromHeight,
  }

  el.style.transform = `translate(${transform.x}px, ${transform.y}px) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})`

  return transform
}
