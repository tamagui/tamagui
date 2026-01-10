import { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Paragraph, Square, XStack, YStack, View, Text, styled, Circle } from 'tamagui'

/**
 * COMPREHENSIVE ANIMATION TEST SUITE
 *
 * 30+ test scenarios covering all animation types, configurations, and edge cases.
 * Each test logs EVERY frame of animation with full details for analysis.
 *
 * Log format: [ANIM_FRAME] scenario:<id> frame:<n> prop:<property> value:<value> time:<ms> delta:<ms>
 */

// Types for animation logging
interface FrameLog {
  scenario: string
  frame: number
  prop: string
  value: string | number
  time: number
  delta: number
}

// Global frame logging system
const useAnimationLogger = (scenarioId: string, elementRef: React.RefObject<HTMLElement | null>, properties: string[]) => {
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(0)
  const lastValuesRef = useRef<Record<string, string>>({})
  const isLoggingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  const startLogging = useCallback(() => {
    if (isLoggingRef.current) return
    isLoggingRef.current = true
    frameCountRef.current = 0
    lastTimeRef.current = performance.now()
    lastValuesRef.current = {}

    console.log(`[ANIM_START] scenario:${scenarioId} time:${Date.now()}`)

    const logFrame = () => {
      if (!isLoggingRef.current || !elementRef.current) return

      const now = performance.now()
      const delta = now - lastTimeRef.current
      const style = getComputedStyle(elementRef.current)

      let hasChanges = false

      for (const prop of properties) {
        let value: string

        if (prop === 'transform') {
          value = style.transform
        } else if (prop === 'opacity') {
          value = style.opacity
        } else if (prop === 'backgroundColor') {
          value = style.backgroundColor
        } else if (prop === 'width') {
          value = style.width
        } else if (prop === 'height') {
          value = style.height
        } else if (prop === 'borderRadius') {
          value = style.borderRadius
        } else if (prop === 'color') {
          value = style.color
        } else if (prop === 'left') {
          value = style.left
        } else if (prop === 'top') {
          value = style.top
        } else {
          value = (style as any)[prop] || ''
        }

        if (lastValuesRef.current[prop] !== value) {
          hasChanges = true
          console.log(`[ANIM_FRAME] scenario:${scenarioId} frame:${frameCountRef.current} prop:${prop} value:${value} time:${Math.round(now)} delta:${Math.round(delta)}`)
          lastValuesRef.current[prop] = value
        }
      }

      if (hasChanges) {
        frameCountRef.current++
        lastTimeRef.current = now
      }

      rafIdRef.current = requestAnimationFrame(logFrame)
    }

    rafIdRef.current = requestAnimationFrame(logFrame)
  }, [scenarioId, properties])

  const stopLogging = useCallback(() => {
    isLoggingRef.current = false
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }
    console.log(`[ANIM_END] scenario:${scenarioId} totalFrames:${frameCountRef.current} time:${Date.now()}`)
  }, [scenarioId])

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return { startLogging, stopLogging, frameCount: frameCountRef.current }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AnimationComprehensiveCase() {
  return (
    <YStack gap="$2" padding="$2" flex={1} overflow="scroll">
      <Paragraph fontWeight="bold" fontSize="$5">Comprehensive Animation Test Suite (30+ Scenarios)</Paragraph>
      <Paragraph size="$2" color="$color10">Open console to see [ANIM_FRAME] logs</Paragraph>

      {/* SECTION 1: Basic Property Animations */}
      <SectionHeader>1. Basic Property Animations</SectionHeader>
      <Scenario01_OpacityBasic />
      <Scenario02_ScaleBasic />
      <Scenario03_TranslateX />
      <Scenario04_TranslateY />
      <Scenario05_Rotate />
      <Scenario06_MultipleTransforms />

      {/* SECTION 2: Dimension Animations */}
      <SectionHeader>2. Dimension Animations</SectionHeader>
      <Scenario07_Width />
      <Scenario08_Height />
      <Scenario09_WidthAndHeight />
      <Scenario10_BorderRadius />

      {/* SECTION 3: Color Animations */}
      <SectionHeader>3. Color Animations</SectionHeader>
      <Scenario11_BackgroundColor />
      <Scenario12_TextColor />
      <Scenario13_BorderColor />

      {/* SECTION 4: Spring Physics Variations */}
      <SectionHeader>4. Spring Physics Variations</SectionHeader>
      <Scenario14_SpringBouncy />
      <Scenario15_SpringLazy />
      <Scenario16_SpringQuick />
      <Scenario17_SpringCustom />

      {/* SECTION 5: Timing Animations */}
      <SectionHeader>5. Timing Animations</SectionHeader>
      <Scenario18_Timing100ms />
      <Scenario19_Timing200ms />
      <Scenario20_TimingWithDelay />

      {/* SECTION 6: Enter/Exit Animations */}
      <SectionHeader>6. Enter/Exit Animations</SectionHeader>
      <Scenario21_EnterStyle />
      <Scenario22_ExitStyle />
      <Scenario23_EnterExitCombined />

      {/* SECTION 7: Edge Cases */}
      <SectionHeader>7. Edge Cases</SectionHeader>
      <Scenario24_RapidToggle />
      <Scenario25_Interruption />
      <Scenario26_AnimateOnly />
      <Scenario27_AnimationConfig />

      {/* SECTION 8: Complex Animations */}
      <SectionHeader>8. Complex Animations</SectionHeader>
      <Scenario28_MultiProperty />
      <Scenario29_NestedAnimations />
      <Scenario30_HoverAnimation />

      {/* SECTION 9: Per-Property Animation Configs (Critical Tests) */}
      <SectionHeader>9. Per-Property Animation Configs</SectionHeader>
      <Scenario31_PerPropertyConfigs />
      <Scenario32_PerPropertyWithInterruption />
      <Scenario33_MixedSpringTiming />
      <Scenario34_ComplexObjectManyProps />
      <Scenario35_RapidPerPropertyChanges />
    </YStack>
  )
}

const SectionHeader = ({ children }: { children: string }) => (
  <Paragraph fontWeight="bold" fontSize="$3" marginTop="$3" color="$blue10">{children}</Paragraph>
)

// ============================================================================
// SCENARIO 1: Basic Opacity Animation
// ============================================================================
function Scenario01_OpacityBasic() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('01-opacity-basic', ref, ['opacity'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-01-trigger" data-testid="scenario-01-trigger">
        01: Opacity
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$blue10" opacity={active ? 0.2 : 1}
        testID="scenario-01-target" data-testid="scenario-01-target" />
      <Paragraph size="$1">{active ? '0.2' : '1'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 2: Basic Scale Animation
// ============================================================================
function Scenario02_ScaleBasic() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('02-scale-basic', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-02-trigger" data-testid="scenario-02-trigger">
        02: Scale
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$green10" scale={active ? 1.5 : 1}
        testID="scenario-02-target" data-testid="scenario-02-target" />
      <Paragraph size="$1">{active ? '1.5' : '1'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 3: TranslateX Animation
// ============================================================================
function Scenario03_TranslateX() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('03-translateX', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-03-trigger" data-testid="scenario-03-trigger">
        03: TranslateX
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$purple10" x={active ? 50 : 0}
        testID="scenario-03-target" data-testid="scenario-03-target" />
      <Paragraph size="$1">{active ? '50px' : '0'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 4: TranslateY Animation
// ============================================================================
function Scenario04_TranslateY() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('04-translateY', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-04-trigger" data-testid="scenario-04-trigger">
        04: TranslateY
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$orange10" y={active ? -30 : 0}
        testID="scenario-04-target" data-testid="scenario-04-target" />
      <Paragraph size="$1">{active ? '-30px' : '0'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 5: Rotate Animation
// ============================================================================
function Scenario05_Rotate() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('05-rotate', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-05-trigger" data-testid="scenario-05-trigger">
        05: Rotate
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$red10" rotate={active ? '45deg' : '0deg'}
        testID="scenario-05-target" data-testid="scenario-05-target" />
      <Paragraph size="$1">{active ? '45deg' : '0'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 6: Multiple Transforms Combined
// ============================================================================
function Scenario06_MultipleTransforms() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('06-multi-transform', ref, ['transform', 'opacity'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-06-trigger" data-testid="scenario-06-trigger">
        06: Multi-Transform
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$pink10"
        scale={active ? 1.2 : 1} x={active ? 20 : 0} rotate={active ? '15deg' : '0deg'} opacity={active ? 0.7 : 1}
        testID="scenario-06-target" data-testid="scenario-06-target" />
      <Paragraph size="$1">{active ? 'active' : 'default'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 7: Width Animation
// ============================================================================
function Scenario07_Width() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('07-width', ref, ['width'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1500); }}
        testID="scenario-07-trigger" data-testid="scenario-07-trigger">
        07: Width
      </Button>
      <View ref={ref as any} animation="quick" height={40} width={active ? 150 : 40} bg="$blue10"
        testID="scenario-07-target" data-testid="scenario-07-target" />
      <Paragraph size="$1">{active ? '150px' : '40px'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 8: Height Animation
// ============================================================================
function Scenario08_Height() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('08-height', ref, ['height'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1500); }}
        testID="scenario-08-trigger" data-testid="scenario-08-trigger">
        08: Height
      </Button>
      <View ref={ref as any} animation="quick" width={40} height={active ? 80 : 40} bg="$green10"
        testID="scenario-08-target" data-testid="scenario-08-target" />
      <Paragraph size="$1">{active ? '80px' : '40px'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 9: Width AND Height Animation
// ============================================================================
function Scenario09_WidthAndHeight() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('09-width-height', ref, ['width', 'height'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1500); }}
        testID="scenario-09-trigger" data-testid="scenario-09-trigger">
        09: W+H
      </Button>
      <View ref={ref as any} animation="quick" width={active ? 100 : 40} height={active ? 60 : 40} bg="$purple10"
        testID="scenario-09-target" data-testid="scenario-09-target" />
      <Paragraph size="$1">{active ? '100x60' : '40x40'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 10: Border Radius Animation
// ============================================================================
function Scenario10_BorderRadius() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('10-border-radius', ref, ['borderRadius'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-10-trigger" data-testid="scenario-10-trigger">
        10: BorderRadius
      </Button>
      <View ref={ref as any} animation="quick" size={40} bg="$orange10" borderRadius={active ? 20 : 0}
        testID="scenario-10-target" data-testid="scenario-10-target" />
      <Paragraph size="$1">{active ? '20px' : '0'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 11: Background Color Animation
// ============================================================================
function Scenario11_BackgroundColor() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('11-bg-color', ref, ['backgroundColor'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-11-trigger" data-testid="scenario-11-trigger">
        11: BgColor
      </Button>
      <Square ref={ref as any} animation="quick" size={40} backgroundColor={active ? '$red10' : '$blue10'}
        testID="scenario-11-target" data-testid="scenario-11-target" />
      <Paragraph size="$1">{active ? 'red' : 'blue'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 12: Text Color Animation
// ============================================================================
function Scenario12_TextColor() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('12-text-color', ref, ['color'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-12-trigger" data-testid="scenario-12-trigger">
        12: TextColor
      </Button>
      <Text ref={ref as any} animation="quick" fontSize="$5" fontWeight="bold" color={active ? '$red10' : '$blue10'}
        testID="scenario-12-target" data-testid="scenario-12-target">
        ABC
      </Text>
      <Paragraph size="$1">{active ? 'red' : 'blue'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 13: Border Color Animation
// ============================================================================
function Scenario13_BorderColor() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('13-border-color', ref, ['borderColor'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-13-trigger" data-testid="scenario-13-trigger">
        13: BorderColor
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="transparent" borderWidth={3}
        borderColor={active ? '$red10' : '$blue10'}
        testID="scenario-13-target" data-testid="scenario-13-target" />
      <Paragraph size="$1">{active ? 'red' : 'blue'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 14: Spring Bouncy
// ============================================================================
function Scenario14_SpringBouncy() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('14-spring-bouncy', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1500); }}
        testID="scenario-14-trigger" data-testid="scenario-14-trigger">
        14: Bouncy
      </Button>
      <Square ref={ref as any} animation="bouncy" size={40} bg="$blue10" scale={active ? 1.5 : 1}
        testID="scenario-14-target" data-testid="scenario-14-target" />
      <Paragraph size="$1">bouncy spring</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 15: Spring Lazy
// ============================================================================
function Scenario15_SpringLazy() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('15-spring-lazy', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 2000); }}
        testID="scenario-15-trigger" data-testid="scenario-15-trigger">
        15: Lazy
      </Button>
      <Square ref={ref as any} animation="lazy" size={40} bg="$green10" scale={active ? 1.5 : 1}
        testID="scenario-15-target" data-testid="scenario-15-target" />
      <Paragraph size="$1">lazy spring</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 16: Spring Quick
// ============================================================================
function Scenario16_SpringQuick() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('16-spring-quick', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 800); }}
        testID="scenario-16-trigger" data-testid="scenario-16-trigger">
        16: Quick
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$purple10" scale={active ? 1.5 : 1}
        testID="scenario-16-target" data-testid="scenario-16-target" />
      <Paragraph size="$1">quick spring</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 17: Custom Spring Config
// ============================================================================
function Scenario17_SpringCustom() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('17-spring-custom', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1500); }}
        testID="scenario-17-trigger" data-testid="scenario-17-trigger">
        17: Custom
      </Button>
      <Square ref={ref as any} animation="quick"
        // @ts-ignore
        animationConfig={{ type: 'spring', damping: 5, stiffness: 100, mass: 0.5 }}
        size={40} bg="$orange10" scale={active ? 1.5 : 1}
        testID="scenario-17-target" data-testid="scenario-17-target" />
      <Paragraph size="$1">custom spring</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 18: Timing 100ms
// ============================================================================
function Scenario18_Timing100ms() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('18-timing-100ms', ref, ['opacity'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 500); }}
        testID="scenario-18-trigger" data-testid="scenario-18-trigger">
        18: 100ms
      </Button>
      <Square ref={ref as any} animation="100ms" size={40} bg="$blue10" opacity={active ? 0.3 : 1}
        testID="scenario-18-target" data-testid="scenario-18-target" />
      <Paragraph size="$1">timing 100ms</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 19: Timing 200ms
// ============================================================================
function Scenario19_Timing200ms() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('19-timing-200ms', ref, ['opacity'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 600); }}
        testID="scenario-19-trigger" data-testid="scenario-19-trigger">
        19: 200ms
      </Button>
      <Square ref={ref as any} animation="200ms" size={40} bg="$green10" opacity={active ? 0.3 : 1}
        testID="scenario-19-target" data-testid="scenario-19-target" />
      <Paragraph size="$1">timing 200ms</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 20: Timing with Delay
// ============================================================================
function Scenario20_TimingWithDelay() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('20-timing-delay', ref, ['opacity'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-20-trigger" data-testid="scenario-20-trigger">
        20: Delay
      </Button>
      <Square ref={ref as any} animation={['quick', { delay: 300 }]} size={40} bg="$purple10" opacity={active ? 0.3 : 1}
        testID="scenario-20-target" data-testid="scenario-20-target" />
      <Paragraph size="$1">300ms delay</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 21: Enter Style
// ============================================================================
function Scenario21_EnterStyle() {
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('21-enter-style', ref, ['opacity', 'transform'])

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button size="$2" onPress={() => { if (!visible) startLogging(); setVisible(!visible); setTimeout(stopLogging, 1000); }}
        testID="scenario-21-trigger" data-testid="scenario-21-trigger">
        21: EnterStyle
      </Button>
      {visible && (
        <Square ref={ref as any} animation="bouncy" size={40} bg="$blue10"
          enterStyle={{ opacity: 0, scale: 0.5 }}
          testID="scenario-21-target" data-testid="scenario-21-target" />
      )}
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 22: Exit Style
// ============================================================================
function Scenario22_ExitStyle() {
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('22-exit-style', ref, ['opacity', 'transform'])

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button size="$2" onPress={() => { if (visible) startLogging(); setVisible(!visible); setTimeout(stopLogging, 1000); }}
        testID="scenario-22-trigger" data-testid="scenario-22-trigger">
        22: ExitStyle
      </Button>
      {visible && (
        <Square ref={ref as any} animation="bouncy" size={40} bg="$green10"
          exitStyle={{ opacity: 0, scale: 0.5 }}
          testID="scenario-22-target" data-testid="scenario-22-target" />
      )}
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 23: Enter + Exit Combined
// ============================================================================
function Scenario23_EnterExitCombined() {
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('23-enter-exit', ref, ['opacity', 'transform'])

  return (
    <XStack gap="$2" alignItems="center" minHeight={50}>
      <Button size="$2" onPress={() => { startLogging(); setVisible(!visible); setTimeout(stopLogging, 1000); }}
        testID="scenario-23-trigger" data-testid="scenario-23-trigger">
        23: Enter+Exit
      </Button>
      {visible && (
        <Square ref={ref as any} animation="bouncy" size={40} bg="$purple10"
          enterStyle={{ opacity: 0, scale: 0.5, y: -20 }}
          exitStyle={{ opacity: 0, scale: 0.5, y: 20 }}
          testID="scenario-23-target" data-testid="scenario-23-target" />
      )}
      <Paragraph size="$1">{visible ? 'visible' : 'hidden'}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 24: Rapid Toggle (Interruption stress test)
// ============================================================================
function Scenario24_RapidToggle() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('24-rapid-toggle', ref, ['transform'])
  const toggleCountRef = useRef(0)

  const handleRapidToggle = () => {
    startLogging()
    toggleCountRef.current = 0
    const interval = setInterval(() => {
      setActive(v => !v)
      toggleCountRef.current++
      if (toggleCountRef.current >= 6) {
        clearInterval(interval)
        setTimeout(stopLogging, 500)
      }
    }, 100)
  }

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={handleRapidToggle}
        testID="scenario-24-trigger" data-testid="scenario-24-trigger">
        24: Rapid
      </Button>
      <Square ref={ref as any} animation="quick" size={40} bg="$orange10" scale={active ? 1.5 : 1}
        testID="scenario-24-target" data-testid="scenario-24-target" />
      <Paragraph size="$1">6 toggles @ 100ms</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 25: Mid-Animation Interruption
// ============================================================================
function Scenario25_Interruption() {
  const [position, setPosition] = useState(0) // 0, 1, 2
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('25-interruption', ref, ['transform'])

  const handleInterrupt = () => {
    startLogging()
    setPosition(1)
    setTimeout(() => setPosition(2), 150) // Interrupt mid-animation
    setTimeout(stopLogging, 1500)
  }

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={handleInterrupt}
        testID="scenario-25-trigger" data-testid="scenario-25-trigger">
        25: Interrupt
      </Button>
      <Square ref={ref as any} animation="lazy" size={40} bg="$red10"
        x={position === 0 ? 0 : position === 1 ? 50 : 100}
        testID="scenario-25-target" data-testid="scenario-25-target" />
      <Button size="$2" onPress={() => setPosition(0)}>Reset</Button>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 26: animateOnly prop
// ============================================================================
function Scenario26_AnimateOnly() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('26-animate-only', ref, ['opacity', 'transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-26-trigger" data-testid="scenario-26-trigger">
        26: AnimateOnly
      </Button>
      <Square ref={ref as any} animation="quick" animateOnly={['opacity']} size={40} bg="$blue10"
        opacity={active ? 0.3 : 1} scale={active ? 1.5 : 1}
        testID="scenario-26-target" data-testid="scenario-26-target" />
      <Paragraph size="$1">only opacity</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 27: animationConfig override
// ============================================================================
function Scenario27_AnimationConfig() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('27-animation-config', ref, ['transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 2000); }}
        testID="scenario-27-trigger" data-testid="scenario-27-trigger">
        27: Config
      </Button>
      <Square ref={ref as any} animation="quick"
        // @ts-ignore
        animationConfig={{ type: 'spring', damping: 8, stiffness: 80 }}
        size={40} bg="$green10" scale={active ? 1.5 : 1}
        testID="scenario-27-target" data-testid="scenario-27-target" />
      <Paragraph size="$1">config override</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 28: Multiple Properties Simultaneously
// ============================================================================
function Scenario28_MultiProperty() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('28-multi-property', ref, ['opacity', 'transform', 'borderRadius'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 1000); }}
        testID="scenario-28-trigger" data-testid="scenario-28-trigger">
        28: Multi
      </Button>
      <View ref={ref as any} animation="bouncy" size={40} bg="$purple10"
        opacity={active ? 0.5 : 1}
        scale={active ? 1.3 : 1}
        rotate={active ? '30deg' : '0deg'}
        borderRadius={active ? 20 : 4}
        testID="scenario-28-target" data-testid="scenario-28-target" />
      <Paragraph size="$1">4 props</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 29: Nested Animated Elements
// ============================================================================
function Scenario29_NestedAnimations() {
  const [active, setActive] = useState(false)
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const { startLogging: startOuter, stopLogging: stopOuter } = useAnimationLogger('29-nested-outer', outerRef, ['transform'])
  const { startLogging: startInner, stopLogging: stopInner } = useAnimationLogger('29-nested-inner', innerRef, ['opacity'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => {
        startOuter(); startInner();
        setActive(!active);
        setTimeout(() => { stopOuter(); stopInner(); }, 1000);
      }}
        testID="scenario-29-trigger" data-testid="scenario-29-trigger">
        29: Nested
      </Button>
      <View ref={outerRef as any} animation="quick" scale={active ? 1.2 : 1} padding="$1" bg="$blue5"
        testID="scenario-29-outer" data-testid="scenario-29-outer">
        <Square ref={innerRef as any} animation="bouncy" size={30} bg="$blue10" opacity={active ? 0.5 : 1}
          testID="scenario-29-inner" data-testid="scenario-29-inner" />
      </View>
      <Paragraph size="$1">parent+child</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 30: Hover Animation (pseudo state)
// ============================================================================
function Scenario30_HoverAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('30-hover', ref, ['transform', 'backgroundColor'])

  return (
    <XStack gap="$2" alignItems="center">
      <Paragraph size="$1">30: Hover →</Paragraph>
      <Square
        ref={ref as any}
        animation="quick"
        size={40}
        bg="$blue10"
        hoverStyle={{ scale: 1.2, backgroundColor: '$green10' }}
        onHoverIn={startLogging}
        onHoverOut={() => setTimeout(stopLogging, 500)}
        testID="scenario-30-target"
        data-testid="scenario-30-target"
        cursor="pointer"
      />
      <Paragraph size="$1">hover me</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 31: Per-Property Animation Configs
// Tests: animation={['quick', { opacity: 'lazy', scale: 'bouncy' }]}
// Each property should animate with its own timing/spring config
// ============================================================================
function Scenario31_PerPropertyConfigs() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('31-per-prop-configs', ref, ['opacity', 'transform'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 2000); }}
        testID="scenario-31-trigger" data-testid="scenario-31-trigger">
        31: PerProp
      </Button>
      <Square
        ref={ref as any}
        animation={['quick', { opacity: 'lazy', scale: 'bouncy' }] as any}
        size={40}
        bg="$blue10"
        opacity={active ? 0.3 : 1}
        scale={active ? 1.5 : 1}
        testID="scenario-31-target" data-testid="scenario-31-target"
      />
      <Paragraph size="$1">opacity=lazy, scale=bouncy</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 32: Per-Property Configs with Mid-Animation Interruption
// Critical: Tests that per-property configs survive interruptions correctly
// ============================================================================
function Scenario32_PerPropertyWithInterruption() {
  const [state, setState] = useState<0 | 1 | 2>(0)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('32-per-prop-interrupt', ref, ['opacity', 'transform'])

  const handleInterrupt = () => {
    startLogging()
    setState(1)
    // Interrupt at 200ms - well before lazy animation completes
    setTimeout(() => setState(2), 200)
    setTimeout(stopLogging, 3000)
  }

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={handleInterrupt}
        testID="scenario-32-trigger" data-testid="scenario-32-trigger">
        32: Interrupt
      </Button>
      <Square
        ref={ref as any}
        animation={['quick', { opacity: 'lazy', scale: 'bouncy' }] as any}
        size={40}
        bg="$green10"
        opacity={state === 0 ? 1 : state === 1 ? 0.5 : 0.2}
        scale={state === 0 ? 1 : state === 1 ? 1.3 : 1.6}
        x={state === 0 ? 0 : state === 1 ? 30 : 60}
        testID="scenario-32-target" data-testid="scenario-32-target"
      />
      <Button size="$2" onPress={() => setState(0)}>Reset</Button>
      <Paragraph size="$1">state={state}</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 33: Mixed Spring and Timing per Property
// Some properties use spring, others use timing duration
// ============================================================================
function Scenario33_MixedSpringTiming() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('33-mixed-spring-timing', ref, ['opacity', 'transform', 'borderRadius'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 2000); }}
        testID="scenario-33-trigger" data-testid="scenario-33-trigger">
        33: Mixed
      </Button>
      <View
        ref={ref as any}
        animation={['bouncy', { opacity: '200ms', borderRadius: 'lazy' }] as any}
        size={40}
        bg="$purple10"
        opacity={active ? 0.4 : 1}
        scale={active ? 1.4 : 1}
        borderRadius={active ? 20 : 4}
        testID="scenario-33-target" data-testid="scenario-33-target"
      />
      <Paragraph size="$1">scale=bouncy, opacity=200ms, radius=lazy</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 34: Complex Object with Many Properties
// Tests driver handling of large style objects with varied configs
// ============================================================================
function Scenario34_ComplexObjectManyProps() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('34-complex-many-props', ref,
    ['opacity', 'transform', 'width', 'height', 'borderRadius', 'backgroundColor'])

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={() => { startLogging(); setActive(!active); setTimeout(stopLogging, 2500); }}
        testID="scenario-34-trigger" data-testid="scenario-34-trigger">
        34: Complex
      </Button>
      <View
        ref={ref as any}
        animation={['quick', {
          opacity: 'lazy',
          scale: 'bouncy',
          width: 'lazy',
          height: 'lazy',
          borderRadius: 'bouncy',
          backgroundColor: '200ms'
        }] as any}
        width={active ? 80 : 40}
        height={active ? 60 : 40}
        backgroundColor={active ? '$red10' : '$blue10'}
        opacity={active ? 0.7 : 1}
        scale={active ? 1.2 : 1}
        rotate={active ? '15deg' : '0deg'}
        borderRadius={active ? 16 : 4}
        testID="scenario-34-target" data-testid="scenario-34-target"
      />
      <Paragraph size="$1">7 props, 4 configs</Paragraph>
    </XStack>
  )
}

// ============================================================================
// SCENARIO 35: Rapid State Changes with Per-Property Configs
// Stress test: rapid toggles while different properties have different timings
// ============================================================================
function Scenario35_RapidPerPropertyChanges() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { startLogging, stopLogging } = useAnimationLogger('35-rapid-per-prop', ref, ['opacity', 'transform'])
  const toggleCountRef = useRef(0)

  const handleRapid = () => {
    startLogging()
    toggleCountRef.current = 0
    // Toggle every 150ms - fast enough to interrupt lazy animations
    const interval = setInterval(() => {
      setActive(v => !v)
      toggleCountRef.current++
      if (toggleCountRef.current >= 8) {
        clearInterval(interval)
        setTimeout(stopLogging, 2000)
      }
    }, 150)
  }

  return (
    <XStack gap="$2" alignItems="center">
      <Button size="$2" onPress={handleRapid}
        testID="scenario-35-trigger" data-testid="scenario-35-trigger">
        35: Rapid
      </Button>
      <Square
        ref={ref as any}
        animation={['quick', { opacity: 'lazy', scale: 'bouncy' }] as any}
        size={40}
        bg="$orange10"
        opacity={active ? 0.3 : 1}
        scale={active ? 1.5 : 1}
        x={active ? 40 : 0}
        testID="scenario-35-target" data-testid="scenario-35-target"
      />
      <Paragraph size="$1">8 toggles @ 150ms</Paragraph>
    </XStack>
  )
}
