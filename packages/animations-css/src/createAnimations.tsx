import { animate, easingStringToCubicBezier } from '@tamagui/cubic-bezier-animator'
import { usePresence } from '@tamagui/use-presence'
import {
  AnimationDriver,
  Stack,
  Text,
  UniversalAnimatedNumber,
  useEvent,
  useIsomorphicLayoutEffect,
  useSafeRef,
} from '@tamagui/web'
import * as React from 'react'

export function createAnimations<A extends Object>(animations: A): AnimationDriver<A> {
  return {
    View: Stack,
    Text: Text,
    animations,
    usePresence,

    useAnimatedNumber(initial): UniversalAnimatedNumber<number> {
      const [val, setVal] = React.useState(initial)

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

    useAnimations: ({ props, presence, style, state, hostRef, childrenRefs, layout }) => {
      const { toggle, trigger } = useLayoutAnimationGroup()
      const prevTrigger = usePrevious(trigger)
      const isEntering = !!state.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]
      const initialPositionRef = useSafeRef<any>(null)
      const animationKey = Array.isArray(props.animation)
        ? props.animation[0]
        : props.animation
      const animation = animations[animationKey as any]

      const isLayoutAnimationInProgress = useSafeRef(false)
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
        if (!hostRef.current || !layout || isLayoutAnimationInProgress.current) {
          return
        }
        // @ts-ignore
        const boundingBox = hostRef.current?.getBoundingClientRect()
        if (isChanged(initialPositionRef.current, boundingBox)) {
          if (toggle && (prevTrigger === 'undefined' || prevTrigger === trigger)) {
            toggle()
          }
          const transform = invert(
            hostRef.current,
            boundingBox,
            initialPositionRef.current
          )

          const [func, time] = animation.split(' ')
          animate({
            from: transform,
            to: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
            duration: time.includes('ms')
              ? Number(time.replace('ms', ''))
              : Number(time.replace('s', '')) * 1000,
            onStart: () => {
              isLayoutAnimationInProgress.current = true
            },
            onUpdate: ({ x, y, scaleX, scaleY }) => {
              if (hostRef.current) {
                // @ts-ignore
                hostRef.current.style.translate = `${x}px ${y}px`
                // @ts-ignore
                hostRef.current.style.scale = `${scaleX} ${scaleY}`
                childrenRefs?.current?.forEach((childRef) => {
                  if (childRef && scaleX !== undefined && scaleY !== undefined) {
                    // @ts-ignore
                    childRef.style.scale = `${1 / scaleX} ${1 / scaleY}`
                  }
                })
              }
            },
            onFinish: () => {
              isLayoutAnimationInProgress.current = false
            },
            cubicBezier: easingStringToCubicBezier(func),
          })
        }
        initialPositionRef.current = boundingBox
      })

      style.transition = `${keys} ${animation} ${
        layout ? ', width, height, translate, scale, padding, margin' : ''
      }`
      if (process.env.NODE_ENV === 'development' && props['debug']) {
        // rome-ignore lint/nursery/noConsoleLog: ok
        console.log('CSS animation', style, { isEntering, isExiting })
      }

      return { style }
    },
    populateChildrenRefsAndPassDisableCssProp: populateChildrenRefsAndPassDisableCssProp,
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

  el.style.translate = `${transform.x}px ${transform.y}px`
  el.style.scale = `${transform.scaleX} ${transform.scaleY}`

  return transform
}

export function populateChildrenRefsAndPassDisableCssProp(children: any, refs: any) {
  if (!children) return children
  return React.Children.map(children, (child, index) => {
    if (child) {
      if (typeof child === 'string') {
        return child
      }
      return React.cloneElement(child, {
        ref: (el) => (refs.current[index] = el),
        disableCSSClasses: true,
      })
    } else {
      return null
    }
  })
}
const LayoutAnimationGroupContext = React.createContext({
  /** it's just to trigger re-render */
  trigger: false,
  toggle: () => {},
})
export function LayoutAnimationGroup({ children }) {
  const [trigger, setTrigger] = React.useState(false)
  const toggle = useEvent(() => setTrigger((prev) => !prev))

  const value = React.useMemo(() => ({ trigger, toggle }), [trigger, toggle])

  return (
    <LayoutAnimationGroupContext.Provider value={value}>
      {children}
    </LayoutAnimationGroupContext.Provider>
  )
}

export function useLayoutAnimationGroup() {
  const context = React.useContext(LayoutAnimationGroupContext)
  return context
}

const usePrevious = (value) => {
  const ref = React.useRef()
  React.useEffect(() => {
    ref.current = value
  })
  return ref.current
}
