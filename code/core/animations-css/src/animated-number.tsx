import type {
  AnimatedNumberStrategy,
  UniversalAnimatedNumber,
  UseAnimatedNumberReaction,
  UseAnimatedNumberStyle,
  UseAnimatedNumbersStyle,
} from '@tamagui/web'
import React from 'react'
import { unstable_batchedUpdates } from 'react-dom'

/**
 * The optional animated-number leaf.
 *
 * Zero-runtime mode rewrites the four public animated-number imports here, so
 * this module must reach the config, the provider and the component runtime
 * through nothing but types. It owns the CSS driver's rAF timing and spring
 * engine, cancellation, completion callbacks, listener notification and the
 * linked-style render. The `/extras` factory composes these functions onto the
 * core transition driver.
 */

// rAF-driven animated number is browser-only. read (don't call) at module scope
// so ssr never touches requestAnimationFrame.
const hasRAF = typeof requestAnimationFrame !== 'undefined'

type CSSAnimatedNumberInstance = {
  current: number
  target: number
  listeners: Set<(value: number) => void>
  styleHost: object | null
  raf: number | null
  finish: (() => void) | null
  renderTarget: () => void
  cancel: () => void
}

type CSSAnimatedNumber = UniversalAnimatedNumber<CSSAnimatedNumberInstance>

function notifyAnimatedNumber(instance: CSSAnimatedNumberInstance, value: number) {
  instance.current = value
  if (instance.listeners.size === 0) return
  unstable_batchedUpdates(() => {
    for (const listener of instance.listeners) listener(value)
  })
}

function useAnimatedNumberStyles(
  values: CSSAnimatedNumber[],
  getStyle: (...current: number[]) => any
) {
  const token = React.useRef<object>(null)
  token.current ||= {}
  const [, renderLinkedValue] = React.useReducer((value) => value + 1, 0)
  const instances = values.map((value) => value.getInstance())
  for (const instance of instances) {
    if (!instance.styleHost) instance.styleHost = token.current
  }

  React.useEffect(() => {
    const listener = () => renderLinkedValue()
    for (const instance of instances) {
      if (instance.styleHost !== token.current) instance.listeners.add(listener)
    }
    return () => {
      for (const instance of instances) {
        instance.listeners.delete(listener)
        if (instance.styleHost === token.current) instance.styleHost = null
      }
    }
  }, instances)

  return getStyle(
    ...instances.map((instance) =>
      instance.styleHost === token.current ? instance.target : instance.current
    )
  )
}

export function useAnimatedNumber(initial: number): CSSAnimatedNumber {
  const [, renderTarget] = React.useReducer((value) => value + 1, 0)
  const instanceRef = React.useRef<CSSAnimatedNumberInstance>(null)

  if (!instanceRef.current) {
    instanceRef.current = {
      current: initial,
      target: initial,
      listeners: new Set(),
      styleHost: null,
      raf: null,
      finish: null,
      renderTarget,
      cancel() {
        if (this.raf !== null) cancelAnimationFrame(this.raf)
        this.raf = null
        this.finish = null
      },
    }
  }

  const instance = instanceRef.current
  instance.renderTarget = renderTarget
  React.useEffect(() => () => instance.cancel(), [instance])

  return React.useMemo(
    () => ({
      getInstance() {
        return instance
      },
      getValue() {
        return instance.current
      },
      setValue(next, config = { type: 'spring' }, onFinish) {
        instance.cancel()
        const from = instance.current
        instance.target = next
        if (instance.styleHost) instance.renderTarget()

        if (
          !hasRAF ||
          config.type === 'direct' ||
          (config.type === 'timing' && config.duration === 0) ||
          from === next
        ) {
          notifyAnimatedNumber(instance, next)
          onFinish?.()
          return
        }

        // css transitions interpolate the host. js only ticks when a
        // reaction, linked style, or completion callback needs live values.
        if (instance.listeners.size === 0 && !onFinish) {
          instance.current = next
          return
        }

        instance.finish = onFinish ?? null
        const settle = () => {
          instance.raf = null
          notifyAnimatedNumber(instance, next)
          const finish = instance.finish
          instance.finish = null
          finish?.()
        }

        if (config.type === 'timing') {
          const startedAt = performance.now()
          const tick = () => {
            const progress = Math.min(
              1,
              (performance.now() - startedAt) / config.duration
            )
            if (progress === 1) {
              settle()
              return
            }
            notifyAnimatedNumber(instance, from + (next - from) * progress)
            instance.raf = requestAnimationFrame(tick)
          }
          instance.raf = requestAnimationFrame(tick)
          return
        }

        const {
          stiffness = 300,
          damping = 35,
          mass = 1,
          overshootClamping,
          restSpeedThreshold: restSpeed = 0.001,
          restDisplacementThreshold: restDisplacement = 0.001,
        } = config as Extract<AnimatedNumberStrategy, { type: 'spring' }>
        const displacement = from - next
        const decayRate = damping / (2 * mass)
        const naturalFrequency = Math.sqrt(stiffness / mass)
        const startedAt = performance.now()

        const tick = () => {
          const elapsed = (performance.now() - startedAt) / 1000
          let value: number
          let velocity: number
          if (decayRate < naturalFrequency) {
            const dampedFrequency = Math.sqrt(naturalFrequency ** 2 - decayRate ** 2)
            const b = (decayRate * displacement) / dampedFrequency
            const decay = Math.exp(-decayRate * elapsed)
            const cos = Math.cos(dampedFrequency * elapsed)
            const sin = Math.sin(dampedFrequency * elapsed)
            value = next + decay * (displacement * cos + b * sin)
            velocity =
              decay *
              ((-decayRate * displacement + b * dampedFrequency) * cos +
                (-decayRate * b - displacement * dampedFrequency) * sin)
          } else if (decayRate === naturalFrequency) {
            const b = decayRate * displacement
            const decay = Math.exp(-decayRate * elapsed)
            value = next + (displacement + b * elapsed) * decay
            velocity = (b - decayRate * (displacement + b * elapsed)) * decay
          } else {
            const frequency = Math.sqrt(decayRate ** 2 - naturalFrequency ** 2)
            const slowRoot = -decayRate + frequency
            const fastRoot = -decayRate - frequency
            const slowCoefficient = (-fastRoot * displacement) / (slowRoot - fastRoot)
            const fastCoefficient = displacement - slowCoefficient
            value =
              next +
              slowCoefficient * Math.exp(slowRoot * elapsed) +
              fastCoefficient * Math.exp(fastRoot * elapsed)
            velocity =
              slowCoefficient * slowRoot * Math.exp(slowRoot * elapsed) +
              fastCoefficient * fastRoot * Math.exp(fastRoot * elapsed)
          }

          if (
            overshootClamping &&
            ((from < next && value > next) || (from > next && value < next))
          ) {
            value = next
            velocity = 0
          }

          if (
            Math.abs(velocity) <= restSpeed &&
            Math.abs(next - value) <= restDisplacement
          ) {
            settle()
            return
          }

          notifyAnimatedNumber(instance, value)
          instance.raf = requestAnimationFrame(tick)
        }
        instance.raf = requestAnimationFrame(tick)
      },
      stop() {
        instance.cancel()
      },
    }),
    [instance]
  )
}

export const useAnimatedNumberReaction: UseAnimatedNumberReaction = (
  { value },
  onValue
) => {
  const onValueRef = React.useRef(onValue)
  onValueRef.current = onValue
  React.useEffect(() => {
    const instance = value.getInstance() as CSSAnimatedNumberInstance
    const listener = (current: number) => onValueRef.current(current)
    instance.listeners.add(listener)
    return () => {
      instance.listeners.delete(listener)
    }
  }, [value])
}

export const useAnimatedNumberStyle: UseAnimatedNumberStyle = (val, getStyle) =>
  useAnimatedNumberStyles([val as CSSAnimatedNumber], getStyle)

export const useAnimatedNumbersStyle: UseAnimatedNumbersStyle = (vals, getStyle) =>
  useAnimatedNumberStyles(vals as CSSAnimatedNumber[], getStyle)

export type { CSSAnimatedNumber, CSSAnimatedNumberInstance }
