import { useCallback, useMemo, useRef, type RefObject } from 'react'
import { getGestureHandlerState, isGestureHandlerEnabled } from './gestureState'
import type { ScrollBridge } from './types'

// threshold in pixels for considering sheet "at top" position
// allows for small measurement variations
const AT_TOP_THRESHOLD = 5

interface GesturePanConfig {
  positions: number[]
  frameSize: number
  setPosition: (pos: number) => void
  animateTo: (pos: number) => void
  stopSpring: () => void
  scrollBridge: ScrollBridge
  setIsDragging: (val: boolean) => void
  getCurrentPosition: () => number
  resisted: (val: number, minY: number) => number
  disableDrag?: boolean
  isShowingInnerSheet?: boolean
  // set the animated position directly (for smooth dragging)
  setAnimatedPosition: (val: number) => void
  // ref to scroll gesture for simultaneousWithExternalGesture
  scrollGestureRef?: RefObject<any> | null
}

interface GesturePanResult {
  panGesture: any | null
  panGestureRef: RefObject<any>
  gestureHandlerEnabled: boolean
}

/**
 * Hook that creates a Gesture.Pan() handler for use with react-native-gesture-handler.
 * This provides native-quality gesture coordination between Sheet and ScrollView.
 *
 * Uses state-based decision pattern (like gorhom/bottom-sheet and react-native-actions-sheet):
 * - Both pan and scroll gestures run simultaneously
 * - In onChange, we decide whether to process pan or let scroll handle it
 * - scrollBridge.setScrollEnabled toggles scroll on/off as needed
 *
 * Decision matrix:
 * 1. Sheet not fully open + swiping up -> pan handles (disable scroll)
 * 2. Sheet fully open + swiping up -> scroll handles (blockPan)
 * 3. Sheet not fully open + swiping down -> pan handles (unless scrolled)
 * 4. Sheet fully open + swiping down + scrollY=0 -> pan handles
 * 5. Sheet fully open + swiping down + scrollY>0 -> scroll handles (blockPan)
 *
 * Returns null for the gesture if RNGH is not available or drag is disabled.
 */
export function useGestureHandlerPan(config: GesturePanConfig): GesturePanResult {
  const {
    positions,
    frameSize,
    setPosition,
    animateTo,
    stopSpring,
    scrollBridge,
    setIsDragging,
    getCurrentPosition,
    resisted,
    disableDrag,
    isShowingInnerSheet,
    setAnimatedPosition,
    scrollGestureRef,
  } = config

  const gestureHandlerEnabled = isGestureHandlerEnabled()
  const panGestureRef = useRef<any>(null)

  // use refs for values that need to persist across gesture lifecycle
  // (useMemo closure variables get reset when gesture is recreated)
  const gestureStateRef = useRef({
    startY: 0,
    // track last translation when pan was active (for position calculation after handoff)
    lastPanTranslationY: 0,
    // accumulated position offset from all pan movements
    accumulatedOffset: 0,
    // track previous translation for direction detection (like actions-sheet)
    prevTranslationY: 0,
    // track if scroll was engaged (scrollY > 0) at some point
    scrollEngaged: false,
  })

  const onStart = useCallback(() => {
    stopSpring()
    setIsDragging(true)
  }, [stopSpring, setIsDragging])

  const onEnd = useCallback(
    (closestPoint: number) => {
      setIsDragging(false)
      scrollBridge.setParentDragging(false)
      // re-enable scroll when gesture ends
      scrollBridge.setScrollEnabled?.(true)
      setPosition(closestPoint)
      animateTo(closestPoint)
    },
    [setIsDragging, scrollBridge, setPosition, animateTo]
  )

  const panGesture = useMemo(() => {
    // don't create gesture if disabled or RNGH not available
    if (!gestureHandlerEnabled || disableDrag || isShowingInnerSheet || !frameSize) {
      return null
    }

    const { Gesture } = getGestureHandlerState()
    if (!Gesture) {
      return null
    }

    const minY = positions[0]
    const gs = gestureStateRef.current // shorthand

    // simultaneousHandlers pattern from react-native-actions-sheet
    // both gestures run simultaneously, we use blockPan to decide who handles
    // console.warn('[RNGH-Pan] CREATING gesture, minY:', minY, 'frameSize:', frameSize)
    const gesture = Gesture.Pan()
      .withRef(panGestureRef)
      // NO manualActivation - let both gestures run via simultaneousHandlers
      .failOffsetX([-20, 20])
      .shouldCancelWhenOutside(false)
      .onBegin(() => {
        // check position at gesture begin - before direction is known
        const pos = getCurrentPosition()
        const atTop = pos <= minY + AT_TOP_THRESHOLD
        const currentScrollY = scrollBridge.y
        // console.warn('[RNGH-Pan] onBegin', { pos, minY, atTop, currentScrollY })
        gs.startY = pos
        gs.lastPanTranslationY = 0
        gs.accumulatedOffset = 0
        gs.prevTranslationY = 0
        gs.scrollEngaged = currentScrollY > 0 // track if scroll is already engaged

        // if sheet not at top, DISABLE SCROLL immediately and lock to 0
        // this prevents scroll from firing before pan takes over
        if (!atTop) {
          scrollBridge.setScrollEnabled?.(false, 0)
        }
      })
      .onStart(() => {
        // console.warn('[RNGH-Pan] onStart', { startY: gs.startY, minY })
        scrollBridge.initialPosition = gs.startY
        // dismiss keyboard when gesture starts for smooth handoff
        scrollBridge.dismissKeyboard?.()
        onStart()
      })
      .onChange((event: { translationY: number; velocityY: number }) => {
        const { translationY } = event

        // determine direction by comparing translations (like react-native-actions-sheet)
        // this is more reliable than velocity which can be noisy during direction changes
        const isSwipingDown = gs.prevTranslationY < translationY
        const deltaY = translationY - gs.prevTranslationY
        gs.prevTranslationY = translationY

        const scrollY = scrollBridge.y
        // track if scroll has been engaged at some point (needed for handoff detection)
        if (scrollY > 0) {
          gs.scrollEngaged = true
        }

        // calculate current sheet position based on accumulated offset
        const currentPos = gs.startY + gs.accumulatedOffset
        const isCurrentlyAtTop = currentPos <= minY + AT_TOP_THRESHOLD
        const nodeIsScrolling = scrollY > 0

        // console.warn('[RNGH-Pan] onChange', { translationY: translationY.toFixed(1), deltaY: deltaY.toFixed(1), currentPos: currentPos.toFixed(1), minY, isCurrentlyAtTop, isSwipingDown, scrollY, scrollEngaged: gs.scrollEngaged })

        // decision matrix (from react-native-actions-sheet pattern)
        // each frame, decide who handles the movement based on current state
        //
        // Key insight: we track accumulated offset separately from translation
        // This allows seamless handoffs between pan and scroll
        let panHandles = false

        // BUG #1 FIX: Check if scroll content is actually scrollable
        // If content doesn't fill the ScrollView, gestures should pass through to sheet
        const hasScrollableContent = scrollBridge.hasScrollableContent !== false

        if (!isCurrentlyAtTop) {
          // sheet not at top position
          if (isSwipingDown) {
            // swiping down while sheet not at top
            // BUG #1 FIX: if content not scrollable, pan always handles
            // only scroll if scrollY > 0 AND content is scrollable, otherwise pan handles
            panHandles = !nodeIsScrolling || !hasScrollableContent
          } else {
            // swiping up while sheet not at top -> pan drags sheet up
            panHandles = true
          }
        } else {
          // sheet is at top position
          if (isSwipingDown) {
            // swiping down at top
            if (nodeIsScrolling && hasScrollableContent) {
              // scroll > 0 and content scrollable, let scroll handle (scroll back towards 0)
              panHandles = false
            } else if (gs.scrollEngaged && hasScrollableContent) {
              // scroll WAS > 0 but now is 0 -> handoff from scroll to pan
              // pan takes over to drag sheet down
              // console.warn('[RNGH-Pan] *** HANDOFF FROM SCROLL TO PAN ***')
              panHandles = true
            } else {
              // scroll never engaged OR content not scrollable, just drag sheet down
              panHandles = true
            }
          } else {
            // swiping up at top
            // if there's scrollable content, let scroll handle so user can scroll into content
            // resistance only applies when there's NO scrollable content
            if (hasScrollableContent) {
              // content is scrollable - let scroll handle (user wants to scroll down into content)
              panHandles = false
            } else {
              // no scrollable content -> pan handles for resistance effect
              panHandles = true
            }
          }
        }

        // console.warn('[RNGH-Pan] decision', { panHandles, isCurrentlyAtTop, isSwipingDown, nodeIsScrolling, scrollEngaged: gs.scrollEngaged, hasScrollableContent, currentPos: currentPos.toFixed(1), minY })

        if (panHandles) {
          // pan handles - disable scroll and move sheet
          // when not at top: lock scroll to 0 (sheet is being dragged)
          // when at top: lock at current position (handoff from scroll to pan)
          const lockTo = isCurrentlyAtTop ? undefined : 0
          scrollBridge.setScrollEnabled?.(false, lockTo)

          // accumulate the delta for position calculation
          gs.accumulatedOffset += deltaY
          const newPosition = resisted(gs.startY + gs.accumulatedOffset, minY)

          // update position
          scrollBridge.paneY = newPosition
          setAnimatedPosition(newPosition)
          scrollBridge.setParentDragging(newPosition > minY)
        } else {
          // scroll handles - enable scroll so it can move freely
          scrollBridge.setScrollEnabled?.(true)
          // don't accumulate offset when scroll is handling
        }
      })
      .onEnd((event: { velocityY: number }) => {
        const { velocityY } = event
        const currentPos = gs.startY + gs.accumulatedOffset

        // console.warn('[RNGH-Pan] onEnd', { velocityY, currentPos, accumulatedOffset: gs.accumulatedOffset, scrollY: scrollBridge.y })

        // clear scroll lock
        scrollBridge.scrollLockY = undefined

        // if sheet is at top and scroll is engaged, just stay at top
        if (currentPos <= minY + AT_TOP_THRESHOLD && scrollBridge.y > 0) {
          onEnd(0)
          return
        }

        // find closest snap point using current position and velocity
        const velocity = velocityY / 1000
        const projectedEnd = currentPos + frameSize * velocity * 0.2

        let closestPoint = 0
        let minDist = Number.POSITIVE_INFINITY

        for (let i = 0; i < positions.length; i++) {
          const pos = positions[i]
          const dist = Math.abs(projectedEnd - pos)
          if (dist < minDist) {
            minDist = dist
            closestPoint = i
          }
        }

        onEnd(closestPoint)
      })
      .onFinalize(() => {
        // console.warn('[RNGH-Pan] onFinalize')
        // clear scroll lock on finalize too (safety)
        scrollBridge.scrollLockY = undefined
      })
      .runOnJS(true)

    // if we have a scroll gesture ref, make pan simultaneous with it
    // this allows both gestures to run and we decide in onChange who handles it
    if (scrollGestureRef?.current) {
      // console.warn('[RNGH-Pan] adding simultaneousWithExternalGesture for scroll')
      return gesture.simultaneousWithExternalGesture(scrollGestureRef.current)
    }

    return gesture
  }, [
    gestureHandlerEnabled,
    disableDrag,
    isShowingInnerSheet,
    frameSize,
    positions,
    scrollBridge,
    getCurrentPosition,
    resisted,
    onStart,
    onEnd,
    setIsDragging,
    setAnimatedPosition,
  ])

  return {
    panGesture,
    panGestureRef,
    gestureHandlerEnabled,
  }
}
