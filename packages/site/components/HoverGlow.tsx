import {
  createShallowUpdate,
  useIsMounted,
  useIsomorphicLayoutEffect,
} from '@tamagui/core'
import throttleFn from 'lodash.throttle'
import { HTMLAttributes, RefObject, useEffect, useMemo, useState } from 'react'

const addEvent = <K extends keyof HTMLElementEventMap>(
  disposers: Set<Function>,
  n: HTMLElement | Window,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions | undefined,
) => {
  n.addEventListener(type, listener, options)
  disposers.add(() => {
    n.removeEventListener(type, listener)
  })
}

type BoundedCursorProps = {
  parentRef: RefObject<HTMLElement>
  size?: number
  width?: number
  height?: number
  resist?: number
  boundPct?: number | null
  color?: string
  inverse?: boolean
  full?: boolean
  throttle?: number
  clickable?: false
  clickDuration?: number
  clickScale?: number
  scale?: number
  initialOffset?: { x?: number; y?: number }
}

type DivStyle = HTMLAttributes<HTMLDivElement>['style']

type HoverGlowProps = BoundedCursorProps & {
  background?: string
  opacity?: number
  borderRadius?: number
  style?: DivStyle
  blurPct?: number
  strategy?: 'blur' | 'radial-gradient'
}

export const HoverGlow = (props: HoverGlowProps) => {
  const {
    color = 'red',
    background = 'transparent',
    opacity = 0.025,
    borderRadius = 1000,
    blurPct = 20,
    style,
    strategy = 'radial-gradient',
  } = props
  const { x, y, width, height, mounted } = useBoundedCursor(props)
  // const boxShadow = `${shadowOffsetLeft}px ${shadowOffsetTop}px ${shadowAmt}px ${color}`
  if (!mounted) {
    return null
  }

  return (
    <div
      className="hoverglow"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        opacity,
        ...(strategy === 'radial-gradient' && {
          background: `radial-gradient(${color} ${
            0 + (20 - blurPct)
          }%, ${background} 70%)`,
        }),
        ...(strategy === 'blur' && {
          background: color,
          filter: `blur(${blurPct}px)`,
        }),
        borderRadius,
        height,
        width,
        ...style,
        // opacity: `${glowOpacity(resisted(x), resisted(y), width, height)}`,
        transform: `
            translateX(${x}px)
            translateY(${y}px)
            translateZ(0px)
          `,
      }}
    />
  )
}

export const useBoundedCursor = ({
  parentRef,
  width: propWidth,
  height: propHeight,
  resist = 0,
  boundPct = null,
  size,
  scale = 1,
  clickScale = 1,
  clickDuration = 150,
  clickable,
  initialOffset,
  full,
  inverse,
  throttle = 16,
}: BoundedCursorProps) => {
  const [state, setState_] = useState(() => ({
    mounted: false,
    position: { x: 0, y: 0 },
    clicked: false,
  }))
  const setState = createShallowUpdate(setState_)
  const isMounted = useIsMounted()
  const bounds = useBounds(parentRef)
  const width = scale * ((full ? bounds.width : size ?? propWidth) ?? 100)
  const height = scale * ((full ? bounds.height : size ?? propHeight) ?? 100)
  const offX = initialOffset?.x || 0
  const offY = initialOffset?.y || 0

  useEffect(() => {
    const parentNode = parentRef.current
    if (!parentNode) return

    const initialPosition = {
      x: bounds.width / 2 - offX,
      y: bounds.height / 2 - offY,
    }

    setState({
      mounted: true,
      position: initialPosition,
    })

    const disposers = new Set<Function>()
    let track = false

    // force re-calc offsets after scrolls
    addEvent(disposers, window, 'scroll', () => {
      parentNode['lastdimensions'] = null
    })
    addEvent(disposers, window, 'resize', () => {
      parentNode['lastdimensions'] = null
    })

    const handleMove = throttleFn((e: MouseEvent) => {
      if (!track) return
      if (!isMounted.current) return
      const [x, y] = offset(e, parentNode)
      setState({
        position: {
          x: x + offX,
          y: y + offY,
        },
      })
    }, throttle)

    const handleClick = () => {
      setState({ clicked: true })
      const tm = setTimeout(() => {
        setState({ clicked: false })
      }, clickDuration)
      disposers.add(() => clearTimeout(tm))
    }

    const trackMouse = (val: boolean) => () => {
      track = val
    }

    addEvent(disposers, parentNode, 'mouseenter', trackMouse(true))
    addEvent(disposers, parentNode, 'mousemove', handleMove)
    addEvent(disposers, parentNode, 'mouseleave', trackMouse(false))

    if (clickable) {
      addEvent(disposers, parentNode, 'click', handleClick)
    }

    return () => {
      ;[...disposers].forEach((d) => d())
    }
  }, [
    bounds.width,
    bounds.height,
    width,
    height,
    clickable,
    parentRef.current,
    offX,
    offY,
  ])

  const { position } = state

  const halfW = width / 2
  const halfH = height / 2

  const doInverse = inversed.bind(null, inverse)
  const doResist = resisted.bind(null, resist)
  const doBound = bounded.bind(null, boundPct)

  let x = position.x
  x = doResist(bounds.width, x)
  x = doBound(bounds.width, width, x)
  x = doInverse(bounds.width, x)
  x = x - halfW

  let y = position.y
  y = doResist(bounds.height, y)
  y = doBound(bounds.height, height, y)
  y = doInverse(bounds.height, y)
  y = y - halfH

  return {
    position,
    bounds,
    mounted: state.mounted,
    x,
    y,
    width,
    height,
  }
}

// resists being moved (towards center)
const resisted = (
  resist: number | undefined,
  parentSize: number,
  coord: number,
) => {
  if (!resist) return coord
  const resistAmt = 1 - resist / 100
  return coord * resistAmt + parentSize / ((100 / resist) * 2)
}

// bounds it within box x% size of parent
const bounded = (
  boundPct: number | undefined | null,
  parentSize: number,
  childSize: number,
  coord: number,
) => {
  if (boundPct == undefined || boundPct === null || boundPct > 100) return coord
  const difference = parentSize - childSize
  const direction = coord / Math.abs(coord)
  const max = (difference * (boundPct / 100)) / 2
  const cur = Math.abs(coord)
  return Math.min(max, cur) * direction
}

const inversed = (
  inverse: boolean | undefined,
  parentSize: number,
  coord: number,
) => {
  if (!inverse) return coord
  return parentSize - coord
}

const glowOpacity = (
  coordX: number,
  coordY: number,
  width: number,
  height: number,
) => {
  const maxX = width / 10
  const maxY = height / 10
  const diffX = maxX - Math.abs(coordX)
  const diffY = maxY - Math.abs(coordY)
  const diff = Math.min(diffX, diffY)
  return diff / 10
}

const offset = (ev: MouseEvent, parentElement?: HTMLElement) => {
  const parent = parentElement || ev.currentTarget
  if (!(parent instanceof HTMLElement)) return [0, 0]
  const cx = ev.clientX || 0
  const cy = ev.clientY || 0
  parent['lastdimensions'] ??= parent.getBoundingClientRect()
  const rect = parent['lastdimensions']
  const xo = cx - rect.left
  const yo = cy - rect.top
  return [xo, yo] as const
}

const useBounds = (ref: RefObject<HTMLElement>) => {
  const [{ width, height }, setState_] = useState({ width: 0, height: 0 })
  const setState = createShallowUpdate(setState_)

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) {
      return
    }

    const rect = node.getBoundingClientRect()
    setState({
      width: rect.width,
      height: rect.height,
    })

    const ro = new ResizeObserver(([{ contentRect }]) => {
      setState({
        width: contentRect.width,
        height: contentRect.height,
      })
    })

    ro.observe(node)

    return () => {
      ro.disconnect()
    }
  }, [ref.current])

  return useMemo(
    () => ({
      width,
      height,
    }),
    [width, height],
  )
}
