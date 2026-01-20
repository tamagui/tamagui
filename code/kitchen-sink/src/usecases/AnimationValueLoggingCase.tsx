import { useRef, useState, useEffect } from 'react'
import { Button, Paragraph, Square, XStack, YStack, View } from 'tamagui'

/**
 * Test case for verifying animation values through console logging
 * This allows Playwright tests to capture actual animation value changes
 * and verify that animations are working correctly.
 *
 * Log format: [ANIM_LOG] id:<testId> prop:<property> value:<value> time:<timestamp>
 */

export function AnimationValueLoggingCase() {
  return (
    <YStack gap="$4" padding="$4" flex={1}>
      <Paragraph>Animation Value Logging Tests</Paragraph>
      <Paragraph size="$2" color="$color10">
        Open browser console to see [ANIM_LOG] entries
      </Paragraph>

      {/* Test 1: Basic opacity animation */}
      <OpacityAnimationTest />

      {/* Test 2: Transform scale animation */}
      <ScaleAnimationTest />

      {/* Test 3: Transform translate animation */}
      <TranslateAnimationTest />

      {/* Test 4: Enter/Exit animation with presence */}
      <EnterExitAnimationTest />

      {/* Test 5: Color animation */}
      <ColorAnimationTest />

      {/* Test 6: Animation config override test */}
      <AnimationConfigTest />
    </YStack>
  )
}

/**
 * Test 1: Opacity Animation
 * Toggles opacity from 1 to 0.2 and back
 */
function OpacityAnimationTest() {
  const [faded, setFaded] = useState(false)
  const lastOpacityRef = useRef<number | null>(null)
  const testId = 'opacity-test'

  // Create a MutationObserver to track style changes
  const squareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!squareRef.current) return

    const logOpacity = () => {
      const element = squareRef.current
      if (!element) return

      const style = getComputedStyle(element)
      const opacity = parseFloat(style.opacity)

      if (lastOpacityRef.current !== opacity) {
        console.log(`[ANIM_LOG] id:${testId} prop:opacity value:${opacity.toFixed(4)} time:${Date.now()}`)
        lastOpacityRef.current = opacity
      }
    }

    // Use requestAnimationFrame loop to capture animation values
    let rafId: number
    let running = true

    const tick = () => {
      if (!running) return
      logOpacity()
      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <XStack gap="$4" alignItems="center">
      <Button
        size="$3"
        onPress={() => setFaded(!faded)}
        testID={`${testId}-trigger`}
        data-testid={`${testId}-trigger`}
      >
        Toggle Opacity
      </Button>
      <Square
        ref={squareRef as any}
        transition="quick"
        size={60}
        backgroundColor="$blue10"
        opacity={faded ? 0.2 : 1}
        testID={`${testId}-square`}
        data-testid={`${testId}-square`}
      />
      <Paragraph size="$2" testID={`${testId}-state`} data-testid={`${testId}-state`}>
        {faded ? 'faded' : 'visible'}
      </Paragraph>
    </XStack>
  )
}

/**
 * Test 2: Scale Animation
 * Toggles scale from 1 to 1.5
 */
function ScaleAnimationTest() {
  const [scaled, setScaled] = useState(false)
  const lastScaleRef = useRef<number | null>(null)
  const testId = 'scale-test'
  const squareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!squareRef.current) return

    let rafId: number
    let running = true

    const logScale = () => {
      const element = squareRef.current
      if (!element) return

      const style = getComputedStyle(element)
      const transform = style.transform

      // Parse scale from transform matrix: matrix(scaleX, ...)
      let scale = 1
      if (transform && transform !== 'none') {
        const match = transform.match(/matrix\(([^,]+),/)
        if (match && match[1]) {
          const parsed = parseFloat(match[1])
          if (Number.isFinite(parsed)) {
            scale = parsed
          }
        }
      }

      if (lastScaleRef.current !== scale) {
        console.log(`[ANIM_LOG] id:${testId} prop:scale value:${scale.toFixed(4)} time:${Date.now()}`)
        lastScaleRef.current = scale
      }
    }

    const tick = () => {
      if (!running) return
      logScale()
      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <XStack gap="$4" alignItems="center">
      <Button
        size="$3"
        onPress={() => setScaled(!scaled)}
        testID={`${testId}-trigger`}
        data-testid={`${testId}-trigger`}
      >
        Toggle Scale
      </Button>
      <Square
        ref={squareRef as any}
        transition="quick"
        size={60}
        backgroundColor="$green10"
        scale={scaled ? 1.5 : 1}
        testID={`${testId}-square`}
        data-testid={`${testId}-square`}
      />
      <Paragraph size="$2" testID={`${testId}-state`} data-testid={`${testId}-state`}>
        {scaled ? 'scaled' : 'normal'}
      </Paragraph>
    </XStack>
  )
}

/**
 * Test 3: Translate Y Animation
 * Toggles translateY from 0 to -30
 */
function TranslateAnimationTest() {
  const [moved, setMoved] = useState(false)
  const lastYRef = useRef<number | null>(null)
  const testId = 'translate-test'
  const squareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!squareRef.current) return

    let rafId: number
    let running = true

    const logTranslate = () => {
      const element = squareRef.current
      if (!element) return

      const style = getComputedStyle(element)
      const transform = style.transform

      // Parse translateY from transform matrix: matrix(a, b, c, d, tx, ty) - ty is the 6th value
      let y = 0
      if (transform && transform !== 'none') {
        const match = transform.match(/matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^\)]+)\)/)
        if (match && match[1]) {
          const parsed = parseFloat(match[1])
          if (Number.isFinite(parsed)) {
            y = parsed
          }
        }
      }

      if (lastYRef.current !== y) {
        console.log(`[ANIM_LOG] id:${testId} prop:translateY value:${y.toFixed(4)} time:${Date.now()}`)
        lastYRef.current = y
      }
    }

    const tick = () => {
      if (!running) return
      logTranslate()
      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <XStack gap="$4" alignItems="center">
      <Button
        size="$3"
        onPress={() => setMoved(!moved)}
        testID={`${testId}-trigger`}
        data-testid={`${testId}-trigger`}
      >
        Toggle Y
      </Button>
      <Square
        ref={squareRef as any}
        transition="quick"
        size={60}
        backgroundColor="$blue10"
        y={moved ? -30 : 0}
        testID={`${testId}-square`}
        data-testid={`${testId}-square`}
      />
      <Paragraph size="$2" testID={`${testId}-state`} data-testid={`${testId}-state`}>
        {moved ? 'moved' : 'normal'}
      </Paragraph>
    </XStack>
  )
}

/**
 * Test 4: Enter/Exit Animation with AnimatePresence
 * Tests enterStyle and exitStyle animations
 */
function EnterExitAnimationTest() {
  const [visible, setVisible] = useState(true)
  const testId = 'enter-exit-test'
  const squareRef = useRef<HTMLDivElement>(null)
  const lastValuesRef = useRef<{ opacity: number; scale: number } | null>(null)

  useEffect(() => {
    if (!squareRef.current) return

    let rafId: number
    let running = true

    const logValues = () => {
      const element = squareRef.current
      if (!element) return

      const style = getComputedStyle(element)
      const opacity = parseFloat(style.opacity)

      let scale = 1
      const transform = style.transform
      if (transform && transform !== 'none') {
        const match = transform.match(/matrix\(([^,]+),/)
        if (match && match[1]) {
          const parsed = parseFloat(match[1])
          if (Number.isFinite(parsed)) {
            scale = parsed
          }
        }
      }

      const current = { opacity: Number.isFinite(opacity) ? opacity : 1, scale }
      const last = lastValuesRef.current

      if (!last || last.opacity !== current.opacity || last.scale !== current.scale) {
        console.log(`[ANIM_LOG] id:${testId} prop:opacity value:${opacity.toFixed(4)} time:${Date.now()}`)
        console.log(`[ANIM_LOG] id:${testId} prop:scale value:${scale.toFixed(4)} time:${Date.now()}`)
        lastValuesRef.current = current
      }
    }

    const tick = () => {
      if (!running) return
      logValues()
      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <XStack gap="$4" alignItems="center" height={80}>
      <Button
        size="$3"
        onPress={() => setVisible(!visible)}
        testID={`${testId}-trigger`}
        data-testid={`${testId}-trigger`}
      >
        Toggle Presence
      </Button>
      {visible && (
        <Square
          ref={squareRef as any}
          transition="bouncy"
          size={60}
          backgroundColor="$orange10"
          enterStyle={{
            opacity: 0,
            scale: 0.5,
          }}
          exitStyle={{
            opacity: 0,
            scale: 0.5,
          }}
          testID={`${testId}-square`}
          data-testid={`${testId}-square`}
        />
      )}
      <Paragraph size="$2" testID={`${testId}-state`} data-testid={`${testId}-state`}>
        {visible ? 'visible' : 'hidden'}
      </Paragraph>
    </XStack>
  )
}

/**
 * Test 5: Color Animation
 * Toggles background color between two colors
 */
function ColorAnimationTest() {
  const [active, setActive] = useState(false)
  const testId = 'color-test'
  const squareRef = useRef<HTMLDivElement>(null)
  const lastColorRef = useRef<string | null>(null)

  useEffect(() => {
    if (!squareRef.current) return

    let rafId: number
    let running = true

    const logColor = () => {
      const element = squareRef.current
      if (!element) return

      const style = getComputedStyle(element)
      const color = style.backgroundColor

      if (lastColorRef.current !== color) {
        console.log(`[ANIM_LOG] id:${testId} prop:backgroundColor value:${color} time:${Date.now()}`)
        lastColorRef.current = color
      }
    }

    const tick = () => {
      if (!running) return
      logColor()
      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <XStack gap="$4" alignItems="center">
      <Button
        size="$3"
        onPress={() => setActive(!active)}
        testID={`${testId}-trigger`}
        data-testid={`${testId}-trigger`}
      >
        Toggle Color
      </Button>
      <Square
        ref={squareRef as any}
        transition="quick"
        size={60}
        backgroundColor={active ? '$red10' : '$blue10'}
        testID={`${testId}-square`}
        data-testid={`${testId}-square`}
      />
      <Paragraph size="$2" testID={`${testId}-state`} data-testid={`${testId}-state`}>
        {active ? 'red' : 'blue'}
      </Paragraph>
    </XStack>
  )
}

/**
 * Test 6: Animation Config Override
 * Tests that animationConfig properly overrides default animation settings
 */
function AnimationConfigTest() {
  const [expanded, setExpanded] = useState(false)
  const testId = 'config-test'
  const squareRef = useRef<HTMLDivElement>(null)
  const lastWidthRef = useRef<number | null>(null)

  useEffect(() => {
    if (!squareRef.current) return

    let rafId: number
    let running = true

    const logWidth = () => {
      const element = squareRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const width = Math.round(rect.width)

      if (lastWidthRef.current !== width) {
        console.log(`[ANIM_LOG] id:${testId} prop:width value:${width} time:${Date.now()}`)
        lastWidthRef.current = width
      }
    }

    const tick = () => {
      if (!running) return
      logWidth()
      rafId = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <XStack gap="$4" alignItems="center">
      <Button
        size="$3"
        onPress={() => setExpanded(!expanded)}
        testID={`${testId}-trigger`}
        data-testid={`${testId}-trigger`}
      >
        Toggle Width (slow config)
      </Button>
      <View
        ref={squareRef as any}
        transition="quick"
        // @ts-ignore - animationConfig exists but may not be typed
        animationConfig={{
          type: 'spring',
          damping: 15,
          stiffness: 40, // Slow spring - should take longer than default
        }}
        height={60}
        width={expanded ? 150 : 60}
        backgroundColor="$red10"
        testID={`${testId}-square`}
        data-testid={`${testId}-square`}
      />
      <Paragraph size="$2" testID={`${testId}-state`} data-testid={`${testId}-state`}>
        {expanded ? 'expanded' : 'collapsed'}
      </Paragraph>
    </XStack>
  )
}
