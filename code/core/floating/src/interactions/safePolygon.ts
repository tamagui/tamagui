import type { HandleCloseFn, SafePolygonOptions } from './types'
import { clearTimeoutIfSet, contains, getTarget } from './utils'

type Point = [number, number]
type Polygon = Point[]
type Side = 'top' | 'bottom' | 'left' | 'right'
type Rect = { x: number; y: number; width: number; height: number }

function isPointInPolygon(point: Point, polygon: Polygon) {
  const [x, y] = point
  let isInside = false
  const length = polygon.length
  for (let i = 0, j = length - 1; i < length; j = i++) {
    const [xi, yi] = polygon[i] || [0, 0]
    const [xj, yj] = polygon[j] || [0, 0]
    const intersect = yi >= y !== yj >= y && x <= ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) {
      isInside = !isInside
    }
  }
  return isInside
}

function isInside(point: Point, rect: Rect) {
  return (
    point[0] >= rect.x &&
    point[0] <= rect.x + rect.width &&
    point[1] >= rect.y &&
    point[1] <= rect.y + rect.height
  )
}

export type { SafePolygonOptions }

// generates a safe polygon area that the user can traverse without closing the
// floating element once leaving the reference element.
// ported from @floating-ui/react with full polygon geometry.
//
// the returned HandleCloseFn is a closure factory: called once on mouseleave
// with the leave position (x, y), it returns a handler that runs on each
// subsequent document mousemove. the original leave position is baked into
// the closure so the polygon anchor stays fixed.
//
// unlike @floating-ui/react, we do NOT add a documentElement mouseleave
// listener, which fixes the window-blur-closing-popover bug.
// debug overlay — renders polygon + trough as SVG on top of everything
let debugSvg: SVGSVGElement | null = null
function debugDrawPolygon(
  polygon: Point[],
  trough: Point[],
  cursor: Point,
  anchor: Point
) {
  if (!debugSvg) {
    debugSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    debugSvg.id = '__safe-polygon-debug'
    Object.assign(debugSvg.style, {
      position: 'fixed',
      inset: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '999999',
    })
    document.body.appendChild(debugSvg)
  }
  debugSvg.innerHTML = ''

  // trough rectangle (blue)
  if (trough.length) {
    const troughEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    troughEl.setAttribute('points', trough.map((p) => p.join(',')).join(' '))
    troughEl.setAttribute('fill', 'rgba(0,100,255,0.15)')
    troughEl.setAttribute('stroke', 'rgba(0,100,255,0.6)')
    troughEl.setAttribute('stroke-width', '1')
    debugSvg.appendChild(troughEl)
  }

  // safe polygon (red)
  if (polygon.length) {
    const polyEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polyEl.setAttribute('points', polygon.map((p) => p.join(',')).join(' '))
    polyEl.setAttribute('fill', 'rgba(255,50,50,0.2)')
    polyEl.setAttribute('stroke', 'rgba(255,50,50,0.8)')
    polyEl.setAttribute('stroke-width', '1.5')
    debugSvg.appendChild(polyEl)
  }

  // anchor point (green circle)
  const anchorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  anchorCircle.setAttribute('cx', String(anchor[0]))
  anchorCircle.setAttribute('cy', String(anchor[1]))
  anchorCircle.setAttribute('r', '5')
  anchorCircle.setAttribute('fill', 'lime')
  anchorCircle.setAttribute('stroke', 'darkgreen')
  anchorCircle.setAttribute('stroke-width', '1.5')
  debugSvg.appendChild(anchorCircle)

  // cursor point (yellow circle)
  const cursorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  cursorCircle.setAttribute('cx', String(cursor[0]))
  cursorCircle.setAttribute('cy', String(cursor[1]))
  cursorCircle.setAttribute('r', '4')
  cursorCircle.setAttribute('fill', 'yellow')
  cursorCircle.setAttribute('stroke', 'orange')
  cursorCircle.setAttribute('stroke-width', '1.5')
  debugSvg.appendChild(cursorCircle)
}

function debugClear() {
  if (debugSvg) {
    debugSvg.remove()
    debugSvg = null
  }
}

export function safePolygon(options: SafePolygonOptions = {}): HandleCloseFn {
  const {
    buffer = 0.5,
    blockPointerEvents = false,
    requireIntent = true,
    __debug = false,
  } = options

  const timeoutRef = { current: -1 }

  let hasLanded = false
  let lastX: number | null = null
  let lastY: number | null = null
  let lastCursorTime = typeof performance !== 'undefined' ? performance.now() : 0

  function getCursorSpeed(x: number, y: number): number | null {
    const currentTime = performance.now()
    const elapsedTime = currentTime - lastCursorTime

    if (lastX === null || lastY === null || elapsedTime === 0) {
      lastX = x
      lastY = y
      lastCursorTime = currentTime
      return null
    }

    const deltaX = x - lastX
    const deltaY = y - lastY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const speed = distance / elapsedTime

    lastX = x
    lastY = y
    lastCursorTime = currentTime

    return speed
  }

  // called once on mouseleave. x, y = cursor position when leaving.
  // returns the mousemove handler that checks each subsequent position
  // against the polygon anchored at (x, y).
  const fn: HandleCloseFn = ({ x, y, placement, elements, onClose }) => {
    // reset on each new handler creation — each leave starts a fresh session
    hasLanded = false
    lastX = null
    lastY = null

    return function onMouseMove(event: MouseEvent) {
      function close() {
        clearTimeoutIfSet(timeoutRef)
        onClose()
      }

      clearTimeoutIfSet(timeoutRef)

      const domReference = elements.domReference ?? elements.reference

      if (
        !domReference ||
        !elements.floating ||
        placement == null ||
        x == null ||
        y == null
      ) {
        return
      }

      const { clientX, clientY } = event
      const clientPoint: Point = [clientX, clientY]
      const target = getTarget(event) as Element | null
      const isLeave = event.type === 'mouseleave'
      const isOverFloatingEl = contains(elements.floating, target)
      const isOverReferenceEl = contains(domReference, target)
      const refRect = domReference.getBoundingClientRect()
      const rect = elements.floating.getBoundingClientRect()
      const side = placement.split('-')[0] as Side

      // x, y are from the closure — the position when cursor LEFT the reference.
      // cursorLeaveFromRight/Bottom determine which side of the floating el
      // the leave point is on, to shape the polygon correctly.
      const cursorLeaveFromRight = x > rect.right - rect.width / 2
      const cursorLeaveFromBottom = y > rect.bottom - rect.height / 2
      const isOverReferenceRect = isInside(clientPoint, refRect)
      const isFloatingWider = rect.width > refRect.width
      const isFloatingTaller = rect.height > refRect.height
      const left = (isFloatingWider ? refRect : rect).left
      const right = (isFloatingWider ? refRect : rect).right
      const top = (isFloatingTaller ? refRect : rect).top
      const bottom = (isFloatingTaller ? refRect : rect).bottom

      if (isOverFloatingEl) {
        hasLanded = true

        if (!isLeave) {
          return
        }
      }

      if (isOverReferenceEl) {
        hasLanded = false
      }

      if (isOverReferenceEl && !isLeave) {
        hasLanded = true
        return
      }

      // cursor in reference bounding box but outside DOM element (rounded corners)
      if (!isOverReferenceEl && isOverReferenceRect && !isLeave) {
        return
      }

      // prevent overlapping floating element from being stuck in an open-close
      // loop: https://github.com/floating-ui/floating-ui/issues/1910
      if (
        isLeave &&
        event.relatedTarget &&
        contains(elements.floating, event.relatedTarget as Element)
      ) {
        return
      }

      // if the pointer is leaving from the opposite side, the "buffer" logic
      // creates a point where the floating element remains open, but should be
      // ignored. a constant of 1 handles floating point rounding errors.
      if (
        (side === 'top' && y >= refRect.bottom - 1) ||
        (side === 'bottom' && y <= refRect.top + 1) ||
        (side === 'left' && x >= refRect.right - 1) ||
        (side === 'right' && x <= refRect.left + 1)
      ) {
        return close()
      }

      // ignore when the cursor is within the rectangular trough between the
      // two elements. since the polygon is created from the cursor point,
      // which can start beyond the ref element's edge, traversing back and
      // forth from the ref to the floating element can cause it to close. this
      // ensures it always remains open in that case.
      let rectPoly: Point[] = []

      switch (side) {
        case 'top':
          rectPoly = [
            [left, refRect.top + 1],
            [left, rect.bottom - 1],
            [right, rect.bottom - 1],
            [right, refRect.top + 1],
          ]
          break
        case 'bottom':
          rectPoly = [
            [left, rect.top + 1],
            [left, refRect.bottom - 1],
            [right, refRect.bottom - 1],
            [right, rect.top + 1],
          ]
          break
        case 'left':
          rectPoly = [
            [rect.right - 1, bottom],
            [rect.right - 1, top],
            [refRect.left + 1, top],
            [refRect.left + 1, bottom],
          ]
          break
        case 'right':
          rectPoly = [
            [refRect.right - 1, bottom],
            [refRect.right - 1, top],
            [rect.left + 1, top],
            [rect.left + 1, bottom],
          ]
          break
      }

      // getPolygon uses the closure's (x, y) — the LEAVE position — as the
      // polygon anchor point, NOT the current cursor position. this creates
      // a stable triangular/trapezoidal safe zone from the leave point toward
      // the floating element's edges.
      function getPolygon([x, y]: Point): Array<Point> {
        switch (side) {
          case 'top': {
            const cursorPointOne: Point = [
              isFloatingWider
                ? x + buffer / 2
                : cursorLeaveFromRight
                  ? x + buffer * 4
                  : x - buffer * 4,
              y + buffer + 1,
            ]
            const cursorPointTwo: Point = [
              isFloatingWider
                ? x - buffer / 2
                : cursorLeaveFromRight
                  ? x + buffer * 4
                  : x - buffer * 4,
              y + buffer + 1,
            ]
            const commonPoints: [Point, Point] = [
              [
                rect.left,
                cursorLeaveFromRight
                  ? rect.bottom - buffer
                  : isFloatingWider
                    ? rect.bottom - buffer
                    : rect.top,
              ],
              [
                rect.right,
                cursorLeaveFromRight
                  ? isFloatingWider
                    ? rect.bottom - buffer
                    : rect.top
                  : rect.bottom - buffer,
              ],
            ]

            return [cursorPointOne, cursorPointTwo, ...commonPoints]
          }
          case 'bottom': {
            const cursorPointOne: Point = [
              isFloatingWider
                ? x + buffer / 2
                : cursorLeaveFromRight
                  ? x + buffer * 4
                  : x - buffer * 4,
              y - buffer,
            ]
            const cursorPointTwo: Point = [
              isFloatingWider
                ? x - buffer / 2
                : cursorLeaveFromRight
                  ? x + buffer * 4
                  : x - buffer * 4,
              y - buffer,
            ]
            const commonPoints: [Point, Point] = [
              [
                rect.left,
                cursorLeaveFromRight
                  ? rect.top + buffer
                  : isFloatingWider
                    ? rect.top + buffer
                    : rect.bottom,
              ],
              [
                rect.right,
                cursorLeaveFromRight
                  ? isFloatingWider
                    ? rect.top + buffer
                    : rect.bottom
                  : rect.top + buffer,
              ],
            ]

            return [cursorPointOne, cursorPointTwo, ...commonPoints]
          }
          case 'left': {
            const cursorPointOne: Point = [
              x + buffer + 1,
              isFloatingTaller
                ? y + buffer / 2
                : cursorLeaveFromBottom
                  ? y + buffer * 4
                  : y - buffer * 4,
            ]
            const cursorPointTwo: Point = [
              x + buffer + 1,
              isFloatingTaller
                ? y - buffer / 2
                : cursorLeaveFromBottom
                  ? y + buffer * 4
                  : y - buffer * 4,
            ]
            const commonPoints: [Point, Point] = [
              [
                cursorLeaveFromBottom
                  ? rect.right - buffer
                  : isFloatingTaller
                    ? rect.right - buffer
                    : rect.left,
                rect.top,
              ],
              [
                cursorLeaveFromBottom
                  ? isFloatingTaller
                    ? rect.right - buffer
                    : rect.left
                  : rect.right - buffer,
                rect.bottom,
              ],
            ]

            return [...commonPoints, cursorPointOne, cursorPointTwo]
          }
          case 'right': {
            const cursorPointOne: Point = [
              x - buffer,
              isFloatingTaller
                ? y + buffer / 2
                : cursorLeaveFromBottom
                  ? y + buffer * 4
                  : y - buffer * 4,
            ]
            const cursorPointTwo: Point = [
              x - buffer,
              isFloatingTaller
                ? y - buffer / 2
                : cursorLeaveFromBottom
                  ? y + buffer * 4
                  : y - buffer * 4,
            ]
            const commonPoints: [Point, Point] = [
              [
                cursorLeaveFromBottom
                  ? rect.left + buffer
                  : isFloatingTaller
                    ? rect.left + buffer
                    : rect.right,
                rect.top,
              ],
              [
                cursorLeaveFromBottom
                  ? isFloatingTaller
                    ? rect.left + buffer
                    : rect.right
                  : rect.left + buffer,
                rect.bottom,
              ],
            ]

            return [cursorPointOne, cursorPointTwo, ...commonPoints]
          }
        }
      }

      const poly = getPolygon([x, y])

      if (__debug) {
        debugDrawPolygon(poly, rectPoly, clientPoint, [x, y])
      }

      if (isPointInPolygon([clientX, clientY], rectPoly)) {
        return
      }

      if (hasLanded && !isOverReferenceRect) {
        if (__debug) debugClear()
        return close()
      }

      // polygon check first — inside polygon = safe.
      // the polygon geometry itself limits the safe zone to valid cursor
      // paths toward the floating element, so no timeout is needed here.
      // a previous 40ms requireIntent timeout caused premature closures
      // during natural mouse pauses (humans routinely pause >40ms while
      // moving diagonally from trigger to content).
      if (isPointInPolygon([clientX, clientY], poly)) {
        return
      }

      // speed check only applies outside polygon
      if (!isLeave && requireIntent) {
        const cursorSpeed = getCursorSpeed(clientX, clientY)
        const cursorSpeedThreshold = 0.1
        if (cursorSpeed !== null && cursorSpeed < cursorSpeedThreshold) {
          if (__debug) debugClear()
          return close()
        }
      }

      // outside polygon — close
      if (__debug) debugClear()
      close()
    }
  }

  fn.__options = {
    blockPointerEvents,
  }

  return fn
}
