import { getEffectiveAnimation, normalizeTransition } from '@tamagui/animation-helpers'
import { ResetPresence, usePresence } from '@tamagui/use-presence'
import {
  type AnimatedNumberStrategy,
  type AnimationDriver,
  fixStyles,
  getConfig,
  getSplitStyles,
  hooks,
  normalizeValueWithProperty,
  type OnTransition,
  styleToCSS,
  Text,
  TransitionProp,
  type UniversalAnimatedNumber,
  useComposedRefs,
  useIsomorphicLayoutEffect,
  useThemeWithState,
  View,
  createRefComponent,
  transformsToString,
} from '@tamagui/web'
import {
  animate as animateMotionValue,
  type AnimationOptions,
  type AnimationPlaybackControlsWithThen,
  motionValue,
  type MotionValue,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  type ValueTransition,
} from 'motion/react'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

const isServer = typeof window === 'undefined'

// SSR-safe wrapper: framer-motion's useAnimate imports its own React copy in
// Vite SSR bundles which causes "Invalid hook call" errors. during SSR we
// don't need animations so we return a no-op scope/animate pair.
function useAnimateSSRSafe() {
  if (isServer) {
    return [useRef(null), (() => {}) as any] as unknown as ReturnType<typeof useAnimate>
  }
  return useAnimate()
}

type MotionAnimatedNumber = MotionValue<number>
type AnimationConfig = ValueTransition

type MotionAnimatedNumberStyle = {
  getStyle: (...args: any[]) => Record<string, unknown>
  motionValue?: MotionValue<number>
  motionValues?: MotionValue<number>[]
}

const asStyleRecord = (style: unknown): Record<string, unknown> =>
  style && typeof style === 'object' && !Array.isArray(style)
    ? (style as Record<string, unknown>)
    : {}

// raw CSSOM assignment (unlike React's style prop) silently ignores unitless
// numbers, and the core hands the inline-output driver RN-format numeric
// values — suffix px the way React would before writing
function assignInlineStyles(node: HTMLElement, styles: Record<string, unknown>) {
  for (const key in styles) {
    node.style[key] = normalizeValueWithProperty(styles[key], key)
  }
}

/**
 * Animation options with optional default and per-property configs.
 * This extends AnimationOptions to support the default key.
 */
type TransitionAnimationOptions = AnimationOptions & {
  default?: ValueTransition
  [propertyName: string]: ValueTransition | undefined
}

const MotionValueStrategy = new WeakMap<MotionValue, AnimatedNumberStrategy>()

// pending setValue onFinish callbacks, keyed by motion value. setValue stores
// the callback here; the change handler in the animated component's useEffect
// consumes it by chaining to the DOM-level animate() controls so onFinish
// fires when the *visible* animation actually completes.
const PendingMotionOnFinish = new WeakMap<MotionValue, () => void>()

function settlePendingMotionOnFinish(
  mv: MotionValue,
  controls: AnimationPlaybackControlsWithThen
) {
  const onFinish = PendingMotionOnFinish.get(mv)
  if (!onFinish) return
  PendingMotionOnFinish.delete(mv)
  // chain to the DOM animation's completion. settle on both resolve and
  // reject — a rejection means the animation was cancelled by a later
  // setValue, and the caller still needs a completion signal. use the
  // real Promise interface (.then().catch()) because framer-motion types
  // the .then() callbacks as VoidFunction with no error arg.
  controls.then(() => onFinish()).catch(() => onFinish())
}

type AnimationProps = {
  doAnimate?: Record<string, unknown>
  dontAnimate?: Record<string, unknown>
  animationOptions?: AnimationOptions
}

// popper position (data-popper-animate-position) transform animation state.
// position retargets constantly while the pointer crosses triggers — WAAPI
// can only cancel + restart from rest each time, which freezes the element
// for a frame and zeroes velocity (the tooltip visibly stutters and falls
// behind). driving translate x/y through motion values instead gives spring
// retargeting with velocity continuity: each new target continues from the
// live position AND live velocity.
type PopperPositionAnim = {
  x: MotionValue<number>
  y: MotionValue<number>
  stop: (() => void) | null
}
const PopperPositionAnims = new WeakMap<HTMLElement, PopperPositionAnim>()

// parse a css transform into translate x/y. returns null when the transform
// has non-translate components (rotate/scale/skew) — those fall back to the
// WAAPI path since we can't losslessly re-compose them per-frame.
function parseTranslate(transform: string | undefined): { x: number; y: number } | null {
  if (!transform || transform === 'none') return { x: 0, y: 0 }
  try {
    const m = new DOMMatrixReadOnly(transform)
    if (!m.is2D || m.a !== 1 || m.b !== 0 || m.c !== 0 || m.d !== 1) return null
    return { x: m.e, y: m.f }
  } catch {
    return null
  }
}

// internal refs consolidated into a single object
type MotionRefs = {
  isFirstRender: boolean
  lastDoAnimate: Record<string, unknown> | null
  lastDontAnimate: Record<string, unknown> | null
  controls: AnimationPlaybackControlsWithThen | null
  lastAnimateAt: number
  disposed: boolean
  wasExiting: boolean
  isExiting: boolean
  sendExitComplete: (() => void) | null | undefined
  animationState: 'enter' | 'exit' | 'default'
  frozenExitTarget: Record<string, unknown> | null
  exitCompleteScheduled: boolean
  enterCompleteScheduled: boolean
  disableAnimation: boolean
  wasEntering: boolean
  wasDisabled: boolean
  onTransition: OnTransition | null | undefined
  enterStarted: boolean
  exitStarted: boolean
  updateInFlight: boolean
  updateControls: AnimationPlaybackControlsWithThen | null
  wasNoClass: boolean
}

export function createAnimations<A extends Record<string, AnimationConfig>>(
  animations: A
): AnimationDriver<A> {
  let isHydratingGlobal: boolean | undefined
  const hydratingComponents = new Set<Function>()

  return {
    View: MotionView,
    Text: MotionText,
    isReactNative: false,
    inputStyle: 'css',
    outputStyle: 'inline',
    avoidReRenders: true,
    animations,
    usePresence,
    ResetPresence,

    onMount() {
      isHydratingGlobal = false
      hydratingComponents.forEach((cb) => cb())
    },

    useAnimations: (animationProps) => {
      if (isHydratingGlobal === undefined && !getConfig().settings.disableSSR) {
        isHydratingGlobal = true
      }

      const {
        props,
        style,
        componentState,
        stateRef,
        useStyleEmitter,
        presence,
        onTransition,
        styleProps,
      } = animationProps

      const animationKey = Array.isArray(props.transition)
        ? props.transition[0]
        : props.transition

      const isComponentHydrating = componentState.unmounted === true
      const isMounting = componentState.unmounted === 'should-enter'
      const isEntering = !!componentState.unmounted
      const isExiting = presence?.[0] === false
      const sendExitComplete = presence?.[1]

      // single consolidated ref with lazy init
      const refs = useRef<MotionRefs>(null!)
      if (!refs.current) {
        refs.current = {
          isFirstRender: true,
          lastDoAnimate: null,
          lastDontAnimate: null,
          controls: null,
          lastAnimateAt: 0,
          disposed: false,
          wasExiting: false,
          isExiting: false,
          sendExitComplete: undefined,
          animationState: 'default',
          frozenExitTarget: null,
          exitCompleteScheduled: false,
          enterCompleteScheduled: false,
          disableAnimation: true,
          wasEntering: false,
          wasDisabled: false,
          onTransition: undefined,
          enterStarted: false,
          exitStarted: false,
          updateInFlight: false,
          updateControls: null,
          wasNoClass: !!styleProps.noClass,
        }
      }

      const emit = (
        phase: 'start' | 'end',
        cause: 'enter' | 'exit' | 'update',
        finished?: boolean
      ) => {
        refs.current.onTransition?.(
          phase === 'end' ? { phase, cause, finished } : { phase, cause }
        )
      }

      // track entering state transitions
      const justFinishedEntering = refs.current.wasEntering && !isEntering
      useEffect(() => {
        refs.current.wasEntering = isEntering
      })

      // determine animation state for enter/exit transitions
      const animationState: 'enter' | 'exit' | 'default' = isExiting
        ? 'exit'
        : isMounting || justFinishedEntering
          ? 'enter'
          : 'default'

      // disable animation during hydration and mounting (prevents "flying across the page")
      const disableAnimation = isComponentHydrating || isMounting || !animationKey

      const [scope] = useAnimateSSRSafe()

      // sync ref values for reliable access from callbacks
      refs.current.isExiting = isExiting
      refs.current.sendExitComplete = sendExitComplete
      refs.current.animationState = animationState
      refs.current.disableAnimation = disableAnimation
      refs.current.onTransition = onTransition

      // detect transition into exiting state
      const justStartedExiting = isExiting && !refs.current.wasExiting
      const justStoppedExiting = !isExiting && refs.current.wasExiting

      // freeze exit animation target so direction changes don't reverse mid-exit
      if (justStartedExiting || justStoppedExiting) {
        refs.current.frozenExitTarget = null
        refs.current.exitCompleteScheduled = false
        refs.current.enterCompleteScheduled = false
      }

      // track previous exiting state
      useEffect(() => {
        refs.current.wasExiting = isExiting
      })

      // exit interrupted by a re-enter: emit a finished:false end for it
      useIsomorphicLayoutEffect(() => {
        if (justStoppedExiting && refs.current.exitStarted) {
          refs.current.exitStarted = false
          emit('end', 'exit', false)
        }
      }, [justStoppedExiting])

      const {
        dontAnimate = {},
        doAnimate,
        animationOptions,
      } = getMotionAnimatedProps(props as any, style, disableAnimation, animationState)

      const [firstRenderStyle] = useState(style)

      // avoid first render returning wrong styles - always render all, after that we can just mutate
      if (refs.current.isFirstRender) {
        refs.current.lastDontAnimate = firstRenderStyle
      }
      const [isHydrating, setIsHydrating] = useState(isHydratingGlobal)

      useLayoutEffect(() => {
        if (isHydratingGlobal) {
          hydratingComponents.add(() => {
            setIsHydrating(false)
          })
        }
        return () => {
          refs.current.disposed = true
        }
      }, [])

      const flushAnimation = ({
        doAnimate: doAnimateRaw = {},
        animationOptions: passedOptions = {},
        dontAnimate,
      }: AnimationProps) => {
        // track whether THIS flush starts a new animation (vs using stale controls)
        let startedControls: AnimationPlaybackControlsWithThen | null = null

        // read current state from refs (closure variables can be stale)
        const isCurrentlyExiting = refs.current.isExiting
        const currentSendExitComplete = refs.current.sendExitComplete
        const currentAnimationState = refs.current.animationState

        // freeze exit target: once the first exit animation starts, subsequent
        // renders (e.g. direction change) should not reverse the exit animation.
        let doAnimate = doAnimateRaw
        if (isCurrentlyExiting && refs.current.frozenExitTarget) {
          doAnimate = refs.current.frozenExitTarget
        }

        // only recompute animation options for exit animations to avoid stale state.
        const animationOptions =
          isCurrentlyExiting && currentSendExitComplete
            ? getAnimationOptions(props.transition ?? null, 'exit')
            : passedOptions

        try {
          const node = stateRef.current.host

          // on first render, reset stale animation refs - they can persist if component
          // instance is reused (e.g. AnimatePresence keepChildrenMounted)
          if (refs.current.isFirstRender) {
            refs.current.lastDontAnimate = null
            refs.current.lastDoAnimate = null
          }

          if (process.env.NODE_ENV === 'development') {
            if (props['debug'] && props['debug'] !== 'profile') {
              console.groupCollapsed(
                `[motion] animate (${JSON.stringify(getDiff(refs.current.lastDoAnimate, doAnimate), null, 2)})`
              )
              console.info({
                props,
                componentState,
                doAnimate,
                dontAnimate,
                animationOptions,
                animationProps,
                lastDoAnimate: { ...refs.current.lastDoAnimate },
                lastDontAnimate: { ...refs.current.lastDontAnimate },
                isExiting,
                style,
                node,
              })
              console.groupCollapsed(`trace >`)
              console.trace()
              console.groupEnd()
              console.groupEnd()
            }
          }

          if (!(node instanceof HTMLElement)) {
            return
          }

          // handle case where dontAnimate changes
          const prevDont = refs.current.lastDontAnimate
          if (dontAnimate) {
            if (prevDont) {
              removeRemovedStyles(prevDont, dontAnimate, node, doAnimate)
              const changed = getDiff(prevDont, dontAnimate)
              if (changed) {
                assignInlineStyles(node, changed)
              }
            } else {
              assignInlineStyles(node, dontAnimate)
            }
          }

          if (doAnimate) {
            // when a property moves from dontAnimate to doAnimate, preserve
            // the current inline style value so WAAPI starts from the right place
            if (prevDont) {
              for (const key in prevDont) {
                if (key in doAnimate) {
                  node.style[key] = normalizeValueWithProperty(prevDont[key], key)
                  if (refs.current.lastDoAnimate) {
                    refs.current.lastDoAnimate[key] = prevDont[key]
                  }
                }
              }
            }

            const lastAnimated = refs.current.lastDoAnimate
            if (lastAnimated) {
              removeRemovedStyles(lastAnimated, doAnimate, node, dontAnimate)
            }

            const diff = getDiff(refs.current.lastDoAnimate, doAnimate)

            if (diff) {
              // capture frozen exit target on first exit diff
              if (isCurrentlyExiting && !refs.current.frozenExitTarget) {
                refs.current.frozenExitTarget = { ...doAnimate }
              }

              const isPopperPosition = node.hasAttribute('data-popper-animate-position')

              // popper position path: drive translate x/y through motion
              // values (see PopperPositionAnims). retargeting a running spring
              // continues from live position + velocity instead of WAAPI's
              // cancel-freeze-restart-from-rest, which made a shared tooltip
              // stutter and fall behind when the pointer crossed triggers
              // quickly. exit is excluded: the WAAPI exit path owns its frozen
              // target and completion signaling.
              let popperHandledTransform = false
              if (
                isPopperPosition &&
                !isCurrentlyExiting &&
                typeof diff.transform === 'string'
              ) {
                const target = parseTranslate(diff.transform as string)
                if (target) {
                  let entry = PopperPositionAnims.get(node)
                  if (!entry) {
                    // seed from the current visual position so the first
                    // animated move starts where the element actually is
                    let seed = target
                    try {
                      seed = parseTranslate(getComputedStyle(node).transform) ?? target
                    } catch {
                      // getComputedStyle can fail on detached nodes
                    }
                    const x = motionValue(seed.x)
                    const y = motionValue(seed.y)
                    const write = () => {
                      node.style.transform = `translate3d(${x.get()}px, ${y.get()}px, 0)`
                    }
                    x.on('change', write)
                    y.on('change', write)
                    entry = { x, y, stop: null }
                    PopperPositionAnims.set(node, entry)
                  }

                  // if the spring isn't currently running (fresh entry, or a
                  // WAAPI exit owned the transform since), the motion values
                  // are stale — re-seed from the live visual position
                  if (!entry.stop) {
                    try {
                      const live = parseTranslate(getComputedStyle(node).transform)
                      if (live) {
                        entry.x.jump(live.x)
                        entry.y.jump(live.y)
                      }
                    } catch {
                      // getComputedStyle can fail on detached nodes
                    }
                  }

                  // a WAAPI animation still animating transform (e.g. from an
                  // interrupted exit) would override our inline writes —
                  // cancel transform-touching animations only, leaving e.g. an
                  // in-flight enter opacity animation to complete
                  for (const anim of node.getAnimations()) {
                    try {
                      const kf = (anim.effect as KeyframeEffect | null)?.getKeyframes?.()
                      if (kf?.some((k) => 'transform' in k)) {
                        anim.cancel()
                      }
                    } catch {
                      // effect can be disposed mid-iteration
                    }
                  }

                  const opts = animationOptions as TransitionAnimationOptions
                  const positionTransition =
                    opts.transform ?? opts.default ?? animationOptions
                  const cx = animateMotionValue(
                    entry.x,
                    target.x,
                    positionTransition as ValueTransition
                  )
                  const cy = animateMotionValue(
                    entry.y,
                    target.y,
                    positionTransition as ValueTransition
                  )
                  entry.stop = () => {
                    cx.stop()
                    cy.stop()
                  }
                  popperHandledTransform = true
                }
              }

              // when exit takes over the transform, stop the motion-value
              // spring so the WAAPI exit animation owns the property
              if (isCurrentlyExiting) {
                const entry = PopperPositionAnims.get(node)
                if (entry?.stop) {
                  entry.stop()
                  entry.stop = null
                }
              }

              // capture mid-flight values so we can provide explicit [from, to]
              // keyframes to WAAPI, ensuring smooth interpolation from the
              // current visual state.
              //
              // only stop() during exit — for non-exit cases, WAAPI
              // naturally replaces only conflicting property animations,
              // letting non-conflicting ones (like an in-flight enter
              // opacity animation) continue to completion.
              let midFlightValues: Record<string, string> | null = null
              if (refs.current.controls) {
                try {
                  const computed = getComputedStyle(node)
                  midFlightValues = {}
                  for (const key in diff) {
                    const val = (computed as any)[key]
                    if (val !== undefined && val !== '') {
                      midFlightValues[key] = val
                    }
                  }
                } catch {
                  // getComputedStyle can fail on detached nodes
                }

                if (isCurrentlyExiting) {
                  refs.current.controls.stop()
                }

                // write mid-flight values to inline so the 1-frame gap
                // (while motion resolves keyframes) shows the correct
                // position instead of stale inline styles
                if (midFlightValues) {
                  for (const key in midFlightValues) {
                    // the motion-value spring owns transform and is already at
                    // the live value — a stale computed matrix would fight it
                    if (key === 'transform' && popperHandledTransform) continue
                    ;(node.style as any)[key] = midFlightValues[key]
                  }
                }

                // for popper position elements, cancel WAAPI animations
                // directly so motion.dev's internal stop() sees "idle" state
                // and skips commitStyles. without this, commitStyles writes
                // a mid-flight transform that's visible for 1 frame before
                // the new animation starts, causing a flash toward (0,0).
                // skipped when the motion-value path took the transform — it
                // already canceled transform-touching animations and the rest
                // (e.g. enter opacity) should continue.
                if (isPopperPosition && !popperHandledTransform) {
                  const anims = node.getAnimations()
                  for (const anim of anims) {
                    anim.cancel()
                  }
                }
              }

              const fixedDiff = fixTransparentColors(
                diff,
                refs.current.lastDoAnimate,
                doAnimate
              )

              // provide explicit [from, to] keyframe for transforms during
              // mid-flight interruption so motion starts from the right place —
              // but ONLY when we've torn down the previous animation (popper
              // cancel above, or exit stop()). otherwise the prior WAAPI
              // transform animation is still running, and pinning a one-frame-
              // stale `from` matrix makes each new flush re-start the animation
              // from that stale base instead of continuing from the live value.
              // for a plain transition element being interrupted repeatedly
              // (the tamagui.dev logo dot swept back and forth — worse the more
              // concurrent React work the page is doing, since each render flushes
              // again) that reads as a constant stutter/reset instead of a smooth
              // glide. in the un-torn-down case motion's resolver already
              // interpolates from the live value, so leave it alone. (regressed in
              // 9485bcef0e when this keyframe was ungated; covered by
              // LogoDotInterrupt.animated.test.tsx)
              //
              // note: an earlier version also keyframed entering-presence-child
              // interrupts, but enter no longer tears down (see the stop() comment
              // above — WAAPI replaces conflicting props per-property), so those
              // now rely on the same live-value interpolation. covered by
              // PopoverClickDuringEnter / AnimatePresenceEnterExit.
              // the motion-value spring owns transform — keep it out of the
              // WAAPI animation so the two don't double-drive the property
              let waapiDiff = Object.fromEntries(
                Object.entries(fixedDiff).map(([key, value]) => [
                  key,
                  Array.isArray(value)
                    ? value.map((item) => normalizeValueWithProperty(item, key))
                    : normalizeValueWithProperty(value, key),
                ])
              )
              if (popperHandledTransform && 'transform' in waapiDiff) {
                waapiDiff = { ...waapiDiff }
                delete waapiDiff.transform
              }

              if (
                (isPopperPosition || isCurrentlyExiting) &&
                midFlightValues?.transform &&
                waapiDiff.transform
              ) {
                waapiDiff.transform = [midFlightValues.transform, waapiDiff.transform]
              }

              if (Object.keys(waapiDiff).length > 0) {
                startedControls = animateMotionValue(
                  node,
                  waapiDiff,
                  animationOptions
                ) as AnimationPlaybackControlsWithThen
                refs.current.controls = startedControls
              }
              refs.current.lastAnimateAt = Date.now()
            }
          }

          refs.current.lastDontAnimate = dontAnimate ? { ...dontAnimate } : {}
          refs.current.lastDoAnimate = doAnimate ? { ...doAnimate } : {}
        } finally {
          // exit completion: notify AnimatePresence when exit animation finishes
          if (isCurrentlyExiting && currentSendExitComplete) {
            // an enter animation that was still in flight is now interrupted
            if (refs.current.enterStarted) {
              refs.current.enterStarted = false
              emit('end', 'enter', false)
            }
            if (startedControls) {
              // new animation started — attach completion handler
              if (!refs.current.exitStarted) {
                refs.current.exitStarted = true
                emit('start', 'exit')
              }
              refs.current.exitCompleteScheduled = true
              const complete = (finished: boolean) => {
                // guard: only complete if still exiting (prevents stale promise
                // from calling sendExitComplete after a re-entry cancels the exit)
                if (!refs.current.isExiting) return
                if (refs.current.exitStarted) {
                  refs.current.exitStarted = false
                  // exit 'end' fires immediately before presence safeToRemove
                  emit('end', 'exit', finished)
                }
                currentSendExitComplete()
              }
              startedControls.finished
                .then(() => complete(true))
                .catch(() => complete(false))
            } else if (!refs.current.exitCompleteScheduled) {
              // no animation started AND none previously scheduled (e.g. diff=null
              // on re-render mid-exit because frozenExitTarget matches lastDoAnimate)
              // — complete immediately only if we've never started an exit animation
              emit('start', 'exit')
              emit('end', 'exit', true)
              currentSendExitComplete()
            }
            // else: exit animation already scheduled via a previous flush,
            // its .finished promise will call sendExitComplete when done
          } else if (currentAnimationState === 'enter') {
            if (startedControls) {
              if (!refs.current.enterStarted) {
                refs.current.enterStarted = true
                emit('start', 'enter')
              }
              refs.current.enterCompleteScheduled = true
              const complete = (finished: boolean) => {
                if (refs.current.disposed || refs.current.animationState !== 'enter')
                  return
                if (refs.current.enterStarted) {
                  refs.current.enterStarted = false
                  emit('end', 'enter', finished)
                }
              }
              startedControls.finished
                .then(() => complete(true))
                .catch(() => complete(false))
            } else if (
              !refs.current.enterCompleteScheduled &&
              !refs.current.disableAnimation
            ) {
              // no animation needed for this enter (no style diff) — complete
              // immediately. skipped while animation is disabled (mount flushes
              // apply enter styles without animating; completing there would
              // report enter done before the real transition even starts)
              emit('start', 'enter')
              emit('end', 'enter', true)
            }
          } else if (startedControls) {
            // update: a style change while mounted. a new update that supersedes
            // an in-flight one closes it out as finished:false (motion silently
            // replaces the conflicting property animation without settling the
            // old controls, so we can't rely on its promise for the interrupted
            // one). the latest controls reports true on natural completion.
            const controls = startedControls
            if (refs.current.updateInFlight) {
              emit('end', 'update', false)
            }
            refs.current.updateInFlight = true
            refs.current.updateControls = controls
            emit('start', 'update')
            const settle = (finished: boolean) => {
              if (refs.current.updateControls !== controls) return
              refs.current.updateInFlight = false
              refs.current.updateControls = null
              emit('end', 'update', finished)
            }
            controls.finished.then(() => settle(true)).catch(() => settle(false))
          }
        }
      }

      useStyleEmitter?.((nextStyle, effectiveTransition) => {
        const animationProps = getMotionAnimatedProps(
          props as any,
          nextStyle,
          disableAnimation,
          refs.current.animationState,
          effectiveTransition
        )

        flushAnimation(animationProps)
      })

      useIsomorphicLayoutEffect(() => {
        if (refs.current.isFirstRender) {
          refs.current.isFirstRender = false
          refs.current.wasDisabled = disableAnimation

          // during hydration, skip inline style writes entirely — SSR CSS
          // already has the correct values. writing them again as inline
          // styles triggers browser style recalc that causes visible font
          // flashes (fontWeight, fontSize, letterSpacing, lineHeight).
          // we only need to track refs for future animation diffing.
          if (isHydrating) {
            if (doAnimate && Object.keys(doAnimate).length > 0) {
              refs.current.lastDoAnimate = { ...doAnimate }
            } else {
              refs.current.lastDoAnimate = dontAnimate ? { ...dontAnimate } : {}
            }

            refs.current.lastDontAnimate = dontAnimate ? { ...dontAnimate } : {}
            refs.current.lastAnimateAt = Date.now()
            return
          }

          // after hydration, use simpler logic
          refs.current.lastDontAnimate = dontAnimate ? { ...dontAnimate } : {}
          refs.current.lastDoAnimate = doAnimate ? { ...doAnimate } : {}
          return
        }

        // when animations first turn on after the mount/hydration handoff, the
        // element is already at its resting position (SSR atomic class, or the
        // dontAnimate inline styles). animating now would spring from the lost
        // "from" value — which for a transform reads as 0 and flashes the
        // element across the screen (e.g. progress bar flashing full, #4011).
        // jump straight to the resolved styles instead, so it renders at the
        // right place with no enter animation. only real changes after this
        // animate. components with an explicit enter animation still animate.
        const justEnabled = refs.current.wasDisabled && !disableAnimation
        refs.current.wasDisabled = disableAnimation

        // SSR hydration handoff: styleProps.noClass flips false -> true on the
        // render where the core strips the SSR atomic classes and moves every
        // style inline (outputStyle: 'inline'). the style delta is huge but the
        // visual state is unchanged — animating it would spring every property
        // from the stripped (zeroed) computed values, visibly collapsing and
        // re-growing SSR-painted elements right after load. jump instead: the
        // inline writes below run pre-paint, so the strip is never visible.
        const justStrippedClasses = !refs.current.wasNoClass && !!styleProps.noClass
        refs.current.wasNoClass = !!styleProps.noClass

        if ((justEnabled || justStrippedClasses) && animationState !== 'enter') {
          const node = stateRef.current.host
          if (node instanceof HTMLElement) {
            if (dontAnimate) assignInlineStyles(node, dontAnimate)
            if (doAnimate) assignInlineStyles(node, doAnimate)
            // keep the popper position motion values in sync with the direct
            // inline write so a later retarget doesn't start from a stale spot
            const entry = PopperPositionAnims.get(node)
            if (entry) {
              const target = parseTranslate(
                (doAnimate?.transform ?? dontAnimate?.transform) as string | undefined
              )
              if (target) {
                entry.stop?.()
                entry.stop = null
                entry.x.jump(target.x)
                entry.y.jump(target.y)
              }
            }
          }
          refs.current.lastDontAnimate = dontAnimate ? { ...dontAnimate } : {}
          refs.current.lastDoAnimate = doAnimate ? { ...doAnimate } : {}
          return
        }

        flushAnimation({
          doAnimate,
          dontAnimate,
          animationOptions,
        })
      }, [style, isExiting, disableAnimation, styleProps.noClass])

      if (process.env.NODE_ENV === 'development') {
        if (props['debug'] && props['debug'] !== 'profile') {
          console.groupCollapsed(`[motion] render`)
          console.info({
            style,
            doAnimate,
            dontAnimate,
            scope,
            animationOptions,
            isExiting,
            isFirstRender: refs.current.isFirstRender,
            animationProps,
          })
          console.groupEnd()
        }
      }

      return {
        style: firstRenderStyle,
        ref: scope,
        render: 'div',
      }
    },

    useAnimatedNumber(initial): UniversalAnimatedNumber<MotionAnimatedNumber> {
      const motionValue = useMotionValue(initial)

      return React.useMemo(
        () => ({
          getInstance() {
            return motionValue
          },
          getValue() {
            return motionValue.get()
          },
          setValue(next, config = { type: 'spring' }, onFinish) {
            if (config.type === 'direct') {
              MotionValueStrategy.set(motionValue, { type: 'direct' })
              motionValue.set(next)
              onFinish?.()
              return
            }

            MotionValueStrategy.set(motionValue, config)

            // we intentionally DO NOT animate the motion value itself here
            // (via framer-motion's imperative animate(motionValue, next)).
            // doing so drives the JS value over time, which fires a 'change'
            // event per frame, and each change event kicks off a new DOM
            // animate(node, ...) that cancels the previous one — the DOM
            // never reaches the target (double-animation stall).
            //
            // instead we jump the motion value to `next` synchronously. the
            // animated component's change handler receives a single change
            // event, computes the final webStyle, and drives the visible
            // animation via DOM animate(node, webStyle, springConfig). that
            // DOM animation is the real timing source.
            //
            // to make `onFinish` resolve when the VISIBLE animation finishes
            // (not synchronously on the change event), we stash it in
            // PendingMotionOnFinish here and the change handler chains it to
            // the DOM animate() controls.
            if (onFinish) {
              // if a previous setValue is still pending on this motion value,
              // fire it now — the new setValue will cancel the prior DOM
              // animation, and the caller is still owed a completion signal.
              const prior = PendingMotionOnFinish.get(motionValue)
              if (prior) {
                PendingMotionOnFinish.delete(motionValue)
                prior()
              }
              PendingMotionOnFinish.set(motionValue, onFinish)
            }

            motionValue.set(next)
          },
          stop() {
            motionValue.stop()
          },
        }),
        [motionValue]
      )
    },

    useAnimatedNumberReaction({ value }, onValue) {
      const instance = value.getInstance() as MotionValue<number>
      useMotionValueEvent(instance, 'change', onValue)
    },

    useAnimatedNumberStyle(val, getStyleProp) {
      const motionValue = val.getInstance() as MotionValue<number>
      const getStyleRef = useRef<typeof getStyleProp>(getStyleProp)

      // we need to change useAnimatedNumberStyle to have dep args to be concurrent safe
      getStyleRef.current = getStyleProp

      return useMemo(() => {
        return {
          getStyle: (cur) => {
            return getStyleRef.current(cur)
          },
          motionValue,
        } satisfies MotionAnimatedNumberStyle
      }, [])
    },

    useAnimatedNumbersStyle(vals, getStyleProp) {
      const motionValues = vals.map((v) => v.getInstance() as MotionValue<number>)
      const getStyleRef = useRef<typeof getStyleProp>(getStyleProp)
      getStyleRef.current = getStyleProp

      return useMemo(() => {
        return {
          getStyle: (...currentValues: number[]) => getStyleRef.current(...currentValues),
          motionValues,
        } satisfies MotionAnimatedNumberStyle
      }, [])
    },
  }

  function getMotionAnimatedProps(
    props: { transition?: TransitionProp | null; animateOnly?: string[] },
    style: Record<string, unknown>,
    disable: boolean,
    animationState: 'enter' | 'exit' | 'default' = 'default',
    transitionOverride?: TransitionProp | null
  ): AnimationProps {
    if (disable) {
      return {
        dontAnimate: style,
      }
    }

    const animationOptions = getAnimationOptions(
      transitionOverride ?? props.transition ?? null,
      animationState
    )

    let dontAnimate: Record<string, unknown> | undefined
    let doAnimate: Record<string, unknown> | undefined

    const animateOnly = props.animateOnly as string[] | undefined
    for (const key in style) {
      const value = style[key]
      if (disableAnimationProps.has(key) || (animateOnly && !animateOnly.includes(key))) {
        dontAnimate ||= {}
        dontAnimate[key] = value
      } else {
        doAnimate ||= {}
        doAnimate[key] = value
      }
    }

    return {
      dontAnimate,
      doAnimate,
      animationOptions,
    }
  }

  function getAnimationOptions(
    transitionProp: TransitionProp | null,
    animationState: 'enter' | 'exit' | 'default' = 'default'
  ): TransitionAnimationOptions {
    const normalized = normalizeTransition(transitionProp)

    let effectiveKey = getEffectiveAnimation(normalized, animationState)

    // fallback: if we have enter/exit defined but state is 'default' and no default key,
    // use enter timing as fallback to avoid empty animation options
    if (!effectiveKey && animationState === 'default') {
      effectiveKey = normalized.enter || normalized.exit || null
    }

    const globalConfigOverride: Record<string, unknown> | undefined = normalized.config
      ? { ...normalized.config }
      : undefined

    if (
      !effectiveKey &&
      Object.keys(normalized.properties).length === 0 &&
      !globalConfigOverride
    ) {
      return {}
    }

    const defaultConfig = effectiveKey ? withInferredType(animations[effectiveKey]) : null

    const delay = normalized.delay

    // framer motion's animate() expects default config at the TOP LEVEL
    const result: TransitionAnimationOptions = {}

    if (defaultConfig) {
      Object.assign(result, defaultConfig)
    }

    if (globalConfigOverride) {
      Object.assign(result, globalConfigOverride)
      if (
        result.type === undefined &&
        result.duration !== undefined &&
        result.damping === undefined &&
        result.stiffness === undefined &&
        result.mass === undefined
      ) {
        result.type = 'tween'
      }
    }

    if (delay) {
      result.delay = delay
    }

    if (defaultConfig || globalConfigOverride || delay) {
      result.default = {
        ...defaultConfig,
        ...globalConfigOverride,
        ...(delay ? { delay } : null),
      }
    }

    for (const [propName, animationNameOrConfig] of Object.entries(
      normalized.properties
    )) {
      if (typeof animationNameOrConfig === 'string') {
        result[propName] = withInferredType(animations[animationNameOrConfig])
      } else if (animationNameOrConfig && typeof animationNameOrConfig === 'object') {
        const baseConfig = animationNameOrConfig.type
          ? withInferredType(animations[animationNameOrConfig.type])
          : defaultConfig

        result[propName] = {
          ...baseConfig,
          ...animationNameOrConfig,
        } as ValueTransition
      }
    }

    // we standardize to ms across drivers, motion expects s
    convertMsToS(result as ValueTransition)
    convertMsToS(result.default)
    for (const key in result) {
      if (key !== 'default' && typeof result[key] === 'object') {
        convertMsToS(result[key])
      }
    }

    return result
  }
}

function withInferredType(config: AnimationConfig | undefined): AnimationConfig {
  if (!config) {
    return { type: 'spring' }
  }
  const isTimingBased =
    config.duration !== undefined &&
    config.damping === undefined &&
    config.stiffness === undefined &&
    config.mass === undefined
  return { type: isTimingBased ? 'tween' : 'spring', ...config }
}

function convertMsToS(config: ValueTransition | undefined) {
  if (!config) return
  if (typeof config.delay === 'number') config.delay = config.delay / 1000
  if (typeof config.duration === 'number') {
    const isTimingBased =
      config.type === 'tween' ||
      (config.type === undefined &&
        config.damping === undefined &&
        config.stiffness === undefined &&
        config.mass === undefined)
    if (isTimingBased) {
      config.duration = config.duration / 1000
    }
  }
}

function removeRemovedStyles(
  prev: object,
  next: object,
  node: HTMLElement,
  dontClearIfIn?: object
) {
  for (const key in prev) {
    if (!(key in next)) {
      if (dontClearIfIn && key in dontClearIfIn) {
        continue
      }
      node.style[key] = ''
    }
  }
}

// truly non-animatable CSS properties (discrete, keyword-based, no interpolation)
// properties like margin, maxHeight, zIndex, etc are animatable and intentionally excluded
export const disableAnimationProps: Set<string> = new Set<string>([
  'alignContent',
  'alignItems',
  'boxSizing',
  'contain',
  'containerType',
  'display',
  'flexBasis',
  'flexDirection',
  'fontFamily',
  'justifyContent',
  'overflow',
  'overflowX',
  'overflowY',
  'pointerEvents',
  'position',
  'textWrap',
  'userSelect',
])

// props equality for the getSplitStyles memo: functions and children can't
// affect style output (they pass through), so they don't participate
function motionPropsEqual(a: Record<string, any>, b: Record<string, any>) {
  for (const key in a) {
    if (!(key in b)) return false
  }
  for (const key in b) {
    if (key === 'children') continue
    const av = a[key]
    const bv = b[key]
    if (typeof bv === 'function' && typeof av === 'function') continue
    if (!Object.is(av, bv)) return false
  }
  return true
}

// one-level style object comparison: style arrays are recreated per render
// with usually-identical contents
function motionStylesEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const sa = a[i]
    const sb = b[i]
    if (sa === sb) continue
    if (!sa || !sb) return false
    let aCount = 0
    for (const key in sa) {
      aCount++
      if (!Object.is(sa[key], sb[key])) return false
    }
    let bCount = 0
    for (const _key in sb) {
      bCount++
    }
    if (aCount !== bCount) return false
  }
  return true
}

const MotionView = createMotionView('div')
const MotionText = createMotionView('span')

const transformAliases: Record<string, string> = {
  x: 'translateX',
  y: 'translateY',
  scale: 'scale',
  scaleX: 'scaleX',
  scaleY: 'scaleY',
  rotate: 'rotate',
  rotateX: 'rotateX',
  rotateY: 'rotateY',
  rotateZ: 'rotateZ',
  skewX: 'skewX',
  skewY: 'skewY',
}

function compileAnimatedStyle(
  initialSource: Record<string, unknown>,
  initialResolved: Record<string, unknown>
) {
  const shorthands = getConfig().shorthands
  const entries = Object.keys(initialSource).map((source) => ({
    source,
    target: shorthands?.[source] ?? source,
    tokenValue:
      typeof initialSource[source] === 'string' &&
      initialResolved[shorthands?.[source] ?? source] !== initialSource[source]
        ? initialResolved[shorthands?.[source] ?? source]
        : undefined,
  }))

  return (sourceStyle: Record<string, unknown>) => {
    const resolved: Record<string, unknown> = {}
    const transforms: Record<string, unknown>[] = []

    for (const entry of entries) {
      const value = sourceStyle[entry.source]
      if (value === undefined) continue
      if (entry.source === 'transform' && Array.isArray(value)) {
        resolved.transform = transformsToString(value)
      } else if (entry.source in transformAliases) {
        transforms.push({ [transformAliases[entry.source]]: value })
      } else {
        resolved[entry.target] =
          entry.tokenValue ?? normalizeValueWithProperty(value, entry.target)
      }
    }

    if (transforms.length) resolved.transform = transformsToString(transforms)
    return resolved
  }
}

function createMotionView(defaultTag: string) {
  const isText = defaultTag === 'span'

  const Component = createRefComponent((propsIn: any, ref) => {
    const { forwardedRef, animation, render = defaultTag, style, ...propsRest } = propsIn
    const [scope, animate] = useAnimateSSRSafe()
    const hostRef = useRef<HTMLElement>(null)
    const seededNode = useRef<HTMLElement>(null)
    const seededInCurrentFrame = useRef(false)
    const queuedAnimationFrames = useRef(new WeakMap<MotionValue, number>())
    const composedRefs = useComposedRefs(forwardedRef, ref, hostRef, scope)

    const stateRef = useRef<any>(null)
    if (!stateRef.current) {
      stateRef.current = {
        get host() {
          return hostRef.current
        },
      }
    }

    const [_, state] = useThemeWithState({})

    const styles = Array.isArray(style) ? style : [style]

    const [animatedStyle, nonAnimatedStyles] = (() => {
      let animatedStyle: MotionAnimatedNumberStyle | undefined
      const nonAnimatedStyles: typeof styles = []
      for (const style of styles) {
        if (style.getStyle) {
          animatedStyle = style as MotionAnimatedNumberStyle
        } else {
          nonAnimatedStyles.push(style)
        }
      }
      return [animatedStyle, nonAnimatedStyles] as const
    })()

    function getProps(props: any) {
      if (
        process.env.NODE_ENV === 'development' &&
        propsIn.debug === 'profile' &&
        typeof performance !== 'undefined'
      ) {
        performance.mark('tamagui-motion-style-split')
      }
      const out = getSplitStyles(
        props,
        isText ? Text.staticConfig : View.staticConfig,
        state?.theme,
        state?.name,
        {
          unmounted: false,
        },
        {
          isAnimated: false,
          noClass: true,
          resolveValues: 'auto',
        }
      )

      if (!out) {
        return {}
      }

      if (out.viewProps.style) {
        fixStyles(out.viewProps.style)
        styleToCSS(out.viewProps.style)
      }

      return out.viewProps
    }

    const resolvedAnimatedStyle = useMemo(() => {
      if (!animatedStyle) return null
      const currentValues = animatedStyle.motionValues
        ? animatedStyle.motionValues.map((value) => value.get())
        : animatedStyle.motionValue
          ? [animatedStyle.motionValue.get()]
          : []
      const initialSource = animatedStyle.getStyle(...currentValues)
      const initialResolved = asStyleRecord(getProps({ style: initialSource }).style)
      return {
        initial: initialResolved,
        resolve: compileAnimatedStyle(initialSource, initialResolved),
      }
    }, [animatedStyle, state?.theme, state?.name])

    // memoize the full getSplitStyles pass: it costs ~90us per render and its
    // style-affecting inputs are usually unchanged. functions and children
    // pass through getSplitStyles untouched, so they refresh on cache hits
    // without invalidating.
    const memoRef = useRef<null | {
      propsRest: any
      styles: any[]
      theme: any
      themeName: string | undefined
      result: any
    }>(null)

    let props: any
    const cached = memoRef.current
    if (
      cached &&
      cached.theme === state?.theme &&
      cached.themeName === state?.name &&
      motionStylesEqual(cached.styles, nonAnimatedStyles) &&
      motionPropsEqual(cached.propsRest, propsRest)
    ) {
      props = { ...cached.result }
      for (const key in propsRest) {
        const val = propsRest[key]
        if (key === 'children' || typeof val === 'function') {
          props[key] = val
        }
      }
    } else {
      props = getProps({ ...propsRest, style: nonAnimatedStyles })
      memoRef.current = {
        propsRest,
        styles: nonAnimatedStyles,
        theme: state?.theme,
        themeName: state?.name,
        result: props,
      }
    }

    if (resolvedAnimatedStyle) {
      // reassign so the animated initial never leaks into the memo cache
      props = {
        ...props,
        style: {
          ...asStyleRecord(props.style),
          ...resolvedAnimatedStyle.initial,
        },
      }
    }

    const Element = render || 'div'
    const transformedProps = hooks.usePropsTransform?.(render, props, stateRef, false)

    // subscribe before passive effects so a layout effect cannot set a value
    // between this node mounting and its MotionValue subscription.
    useIsomorphicLayoutEffect(() => {
      if (!animatedStyle) return

      const node = hostRef.current
      if (node instanceof HTMLElement && seededNode.current !== node) {
        const currentStyle = animatedStyle.motionValues
          ? animatedStyle.getStyle(
              ...animatedStyle.motionValues.map((value) => value.get())
            )
          : animatedStyle.motionValue
            ? animatedStyle.getStyle(animatedStyle.motionValue.get())
            : null
        const webStyle = currentStyle && resolvedAnimatedStyle?.resolve(currentStyle)
        if (webStyle) {
          assignInlineStyles(node, webStyle)
          seededNode.current = node
          seededInCurrentFrame.current = true
          requestAnimationFrame(() => {
            if (seededNode.current === node) seededInCurrentFrame.current = false
          })
        }
      }

      const toTransition = (
        animationConfig: AnimatedNumberStrategy | undefined
      ): AnimationOptions =>
        animationConfig?.type === 'timing'
          ? { type: 'tween', duration: (animationConfig.duration || 0) / 1000 }
          : animationConfig?.type === 'direct'
            ? { type: 'tween', duration: 0 }
            : { type: 'spring', ...(animationConfig as any) }

      const animateNodeTo = (
        nextStyle: Record<string, unknown>,
        transition: AnimationOptions,
        motionValue: MotionValue
      ) => {
        if (!(node instanceof HTMLElement) || hostRef.current !== node) return
        const webStyle = resolvedAnimatedStyle?.resolve(nextStyle)
        if (!webStyle) return
        settlePendingMotionOnFinish(
          motionValue,
          animate(node, webStyle as any, transition)
        )
      }

      const animateChangedValue = (
        nextStyle: Record<string, unknown>,
        transition: AnimationOptions,
        motionValue: MotionValue
      ) => {
        if (seededInCurrentFrame.current && seededNode.current === node) {
          const queuedFrame = queuedAnimationFrames.current.get(motionValue)
          if (queuedFrame !== undefined) cancelAnimationFrame(queuedFrame)
          const frame = requestAnimationFrame(() => {
            if (queuedAnimationFrames.current.get(motionValue) !== frame) return
            queuedAnimationFrames.current.delete(motionValue)
            if (hostRef.current === node) {
              animateNodeTo(nextStyle, transition, motionValue)
            } else {
              const onFinish = PendingMotionOnFinish.get(motionValue)
              PendingMotionOnFinish.delete(motionValue)
              onFinish?.()
            }
          })
          queuedAnimationFrames.current.set(motionValue, frame)
          return
        }
        animateNodeTo(nextStyle, transition, motionValue)
      }

      // multi-value path: subscribe to all motion values
      if (animatedStyle.motionValues) {
        const mvs = animatedStyle.motionValues
        const styleForAll = () =>
          animatedStyle.getStyle(...mvs.map((value) => value.get()))
        const unsubs = mvs.map((mv) =>
          mv.on('change', () =>
            animateChangedValue(
              styleForAll(),
              toTransition(MotionValueStrategy.get(mv)),
              mv
            )
          )
        )
        return () => unsubs.forEach((fn) => fn())
      }

      // single-value path
      const motionValue = animatedStyle.motionValue
      if (!motionValue) return

      return motionValue.on('change', (value) =>
        animateChangedValue(
          animatedStyle.getStyle(value),
          toTransition(MotionValueStrategy.get(motionValue)),
          motionValue
        )
      )
    }, [animatedStyle, resolvedAnimatedStyle])

    return <Element {...transformedProps} ref={composedRefs} />
  })

  Component['acceptRenderProp'] = true

  return Component
}

function getDiff<T extends Record<string, unknown>>(
  previous: T | null,
  next: T
): Record<string, unknown> | null {
  if (!previous) {
    return next
  }

  let diff: Record<string, unknown> | null = null
  for (const key in next) {
    if (next[key] !== previous[key]) {
      diff ||= {}
      diff[key] = next[key]
    }
  }
  return diff
}

// motion.dev can't animate to "transparent" - convert it to rgba
// try to extract RGB from previous or next value for smooth color transitions
function fixTransparentColors(
  diff: Record<string, unknown>,
  previous: Record<string, unknown> | null,
  next?: Record<string, unknown> | null
): Record<string, unknown> {
  let result = diff
  for (const key in diff) {
    if (diff[key] === 'transparent') {
      let fixed = 'rgba(0, 0, 0, 0)'
      const candidates = [previous?.[key], next?.[key]]
      for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate !== 'transparent') {
          const rgbaMatch = candidate.match(/^rgba?\(([^,]+),\s*([^,]+),\s*([^,)]+)/)
          if (rgbaMatch) {
            fixed = `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, 0)`
            break
          }
        }
      }
      if (result === diff) {
        result = { ...diff }
      }
      result[key] = fixed
    }
  }
  return result
}
