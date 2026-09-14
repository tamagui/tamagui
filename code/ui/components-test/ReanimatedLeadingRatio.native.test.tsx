import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, expect, test, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Reanimated stand-in for the two solvers
//
// The repo's vitest setup aliases react-native-reanimated to its own mock,
// whose withTiming/withSpring hand back the destination and call back as if the
// animation had already finished, so there are no intermediate values in it to
// read. These replacements return a real animation descriptor, shaped the way
// the driver's applyAnimation expects (onStart substitutes a seed), and carry
// enough to evaluate the value at any point in the animation.
//
// useAnimatedStyle is captured rather than only invoked: on native the mapper
// is a worklet the UI runtime re-runs whenever a snapshot shared value changes,
// and the driver publishes those from a layout effect AFTER the render that
// built them. Calling the captured worklet once per settled commit is what the
// runtime does; reading the React tree alone would only ever show the mount
// pass. Everything under test (which config each key is handed and what start
// value it is seeded with) is the driver's own decision.
// ---------------------------------------------------------------------------

type Descriptor = {
  __kind: 'timing' | 'spring'
  toValue: number
  duration: number
  from?: number
  // reanimated's own animation object carries the live value here, and the
  // driver's publish wrapper reads it to mirror the font size to descendants
  current?: number
  onStart: (animation: Descriptor, value: number, ts: number, prev: unknown) => void
  onFrame: (animation: Descriptor, now: number) => boolean
}

const describeAnimation = (
  kind: 'timing' | 'spring',
  toValue: number,
  duration: number
): Descriptor => {
  const descriptor: Descriptor = {
    __kind: kind,
    toValue,
    duration,
    onStart(animation, value) {
      descriptor.from = value
      animation.current = value
    },
    onFrame(animation, now) {
      animation.current = valueAt(descriptor, now)
      return now >= descriptor.duration
    },
  }
  return descriptor
}

// reanimated seeds an animation from its own per-view history unless the driver
// substitutes a seed through the onStart wrapper, so `history` stands in for the
// value the key last painted.
const start = (descriptor: Descriptor, history: number) => {
  descriptor.onStart(descriptor, history, 0, undefined)
  return descriptor
}

// the ui runtime drives every frame through onFrame, which is where the
// driver's publish wrapper mirrors the value out to descendants
const advance = (descriptor: Descriptor, elapsed: number) => {
  descriptor.onFrame(descriptor, elapsed)
  return descriptor
}

const valueAt = (descriptor: Descriptor, elapsed: number) => {
  const from = descriptor.from ?? descriptor.toValue
  if (descriptor.duration === 0) return descriptor.toValue
  const progress = Math.min(elapsed / descriptor.duration, 1)
  return from + (descriptor.toValue - from) * progress
}

// one entry per useAnimatedStyle call in the last commit, in render order: the
// animated ancestor first, then any descendant the inherited-text binding wraps
let mappers: Array<() => Record<string, any>> = []
let deferMappers = false

// every animation the driver has assigned to a shared value since the last
// commit. the leading's ratio factor is one of these: it is the node's own
// property, so it rides its own entry while the font size stays on its own.
let sharedAnimations: Descriptor[] = []

vi.mock('react-native-reanimated', async (importOriginal) => {
  const reanimated = await importOriginal<Record<string, any>>()
  return {
    ...reanimated,
    withTiming: (toValue: number, config?: { duration?: number }) =>
      describeAnimation('timing', toValue, config?.duration ?? 300),
    // a spring has no duration; this file only declares timing transitions, so
    // a spring reaching here means the test lost track of which entry applies
    withSpring: () => {
      throw new Error('unexpected spring in a timing-only test')
    },
    // reanimated's own useSharedValue is ref-stable. the repo's mock builds a
    // fresh proxy every render, which erases the driver's per-key emit history
    // between commits and makes every re-render look like a first paint, so a
    // key re-seeds from its last target instead of continuing from where it is.
    // one handed an animation reads back that animation's live value, the way
    // reanimated's own valueSetter does, and an interrupting animation starts
    // from wherever the running one had reached.
    useSharedValue: <T,>(initial: T) => {
      const ref = React.useRef<{ value: T } | null>(null)
      if (!ref.current) {
        let stored: any = initial
        let animation: Descriptor | null = null
        ref.current = {
          get value() {
            return animation ? (animation.current as any) : stored
          },
          set value(next: any) {
            if (next && typeof next === 'object' && typeof next.onFrame === 'function') {
              start(next, animation ? animation.current! : stored)
              animation = next
              sharedAnimations.push(next)
              return
            }
            animation = null
            stored = next
          },
          modify(modifier: (value: T) => T) {
            stored = modifier(stored)
          },
        } as { value: T }
      }
      return ref.current
    },
    useAnimatedStyle: (worklet: () => Record<string, any>) => {
      mappers.push(() => {
        const previous = (globalThis as any)._WORKLET
        ;(globalThis as any)._WORKLET = true
        try {
          return worklet()
        } finally {
          ;(globalThis as any)._WORKLET = previous
        }
      })
      return deferMappers ? {} : worklet()
    },
  }
})

const { createAnimations } = await import('@tamagui/animations-reanimated')
const { TamaguiProvider, Text, createTamagui } = await import('@tamagui/core')

const config = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  animations: createAnimations({}),
} as any)

let rendered: TestRenderer.ReactTestRenderer | null = null

const render = async (element: React.ReactElement) => {
  mappers = []
  sharedAnimations = []
  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={config as any} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })
  // the mount commit's own mapper pass: it publishes the mounted keys as this
  // node's animation history, which is what makes the next pass an animation
  return deferMappers ? {} : mappers[0]!()
}

const update = async (element: React.ReactElement) => {
  mappers = []
  sharedAnimations = []
  await act(async () => {
    rendered!.update(
      <TamaguiProvider config={config as any} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })
  return deferMappers ? {} : mappers[0]!()
}

// the ratio factor of a derived leading, which the last commit put on its own
// entry. exactly one, or the commit did not move the ratio at all.
const ratioAnimation = (): Descriptor => {
  expect(sharedAnimations).toHaveLength(1)
  return sharedAnimations[0]!
}

// the mapper recomputes the derived leading from whatever the two factors read
// right now, so re-running it is how the runtime paints the next frame
const paintedLeading = () => mappers[0]!().lineHeight

const descriptorFor = (style: Record<string, any>, key: string): Descriptor => {
  expect(style[key], `${key} should be an animation descriptor`).toMatchObject({
    __kind: expect.any(String),
  })
  return style[key] as Descriptor
}

afterEach(() => {
  rendered?.unmount()
  rendered = null
  mappers = []
  sharedAnimations = []
  deferMappers = false
})

test('coalesced commits seed a delayed mapper from the font size React painted', async () => {
  deferMappers = true
  const content = (fontSize: number, opacity = 1) => (
    <Text
      fontSize={fontSize}
      lineHeight={1.5}
      opacity={opacity}
      transition="fontSize 1000ms linear"
    >
      <Text lineHeight={2}>text</Text>
    </Text>
  )
  await render(content(20))
  await update(content(40))
  const child = mappers[1]!
  expect(child).toBeTypeOf('function')
  await update(content(40, 0.5))
  const font = start(descriptorFor(mappers[0]!(), 'fontSize'), 20)
  expect(font.from).toBe(20)
  advance(font, 500)
  expect(font.current).toBe(30)
  expect(child()).toMatchObject({ fontSize: 30, lineHeight: 60 })
})

test('coalesced commits retain the painted transform before a mapper starts', async () => {
  deferMappers = true
  const content = (x: number, opacity = 1) => (
    <Text x={x} opacity={opacity} transition="transform 1000ms linear">
      text
    </Text>
  )
  await render(content(20))
  await update(content(40))
  await update(content(40, 0.5))
  const transform = mappers[0]!().transform.find((value: any) => value.translateX)
  const movement = start(descriptorFor(transform, 'translateX'), 20)
  expect(movement.from).toBe(20)
  advance(movement, 500)
  expect(movement.current).toBe(30)
})

// two entries that disagree. the leading has to take the font size's, because
// on its own 100ms clock it would arrive first and then paint a leading the
// font size on screen has not earned for another 300ms.
const SPLIT = 'fontSize 400ms, lineHeight 100ms'

test('a ratio leading is the font size times the ratio, frame for frame', async () => {
  const mounted = await render(
    <Text fontSize={16} lineHeight={1.5} transition={SPLIT}>
      hi
    </Text>
  )
  // the mount pass paints plain values: nothing has been emitted to animate from
  expect(mounted).toMatchObject({ fontSize: 16, lineHeight: 24 })

  const animating = await update(
    <Text fontSize={32} lineHeight={1.5} transition={SPLIT}>
      hi
    </Text>
  )

  // only the font size moves, so the leading is a product with a constant
  // factor. a leading of its own on the 100ms entry would already be at 48 by
  // the second sample, over text still drawn at 20.
  const fontSize = start(descriptorFor(animating, 'fontSize'), 16)
  const samples = [0, 100, 200, 300, 400].map((elapsed) => {
    advance(fontSize, elapsed)
    return [fontSize.current, paintedLeading()]
  })
  expect(samples).toEqual([
    [16, 24],
    [20, 30],
    [24, 36],
    [28, 42],
    [32, 48],
  ])
})

test('a ratio leading follows a font size the transition names alone', async () => {
  await render(
    <Text fontSize={16} lineHeight={1.5} transition="fontSize 400ms">
      hi
    </Text>
  )
  const animating = await update(
    <Text fontSize={32} lineHeight={1.5} transition="fontSize 400ms">
      hi
    </Text>
  )

  // lineHeight is in no entry at all, so a leading of its own would take the
  // driver's zero-duration snap and paint 48 over a font size still at 16
  const fontSize = start(descriptorFor(animating, 'fontSize'), 16)
  advance(fontSize, 200)
  expect([fontSize.current, paintedLeading()]).toEqual([24, 36])
})

test('an absolute leading keeps its own clock', async () => {
  await render(
    <Text fontSize={16} lineHeight="30px" transition={SPLIT}>
      hi
    </Text>
  )
  const animating = await update(
    <Text fontSize={32} lineHeight="30px" transition={SPLIT}>
      hi
    </Text>
  )

  // a length is not a ratio: it keeps the entry that names it, and it does not
  // scale with the font size beside it
  const lineHeight = start(descriptorFor(animating, 'lineHeight'), 30)
  expect({ duration: lineHeight.duration, toValue: lineHeight.toValue }).toEqual({
    duration: 100,
    toValue: 30,
  })
  expect(start(descriptorFor(animating, 'fontSize'), 16).duration).toBe(400)
})

test('a ratio changing over a font size at rest moves on the entry that names it', async () => {
  await render(
    <Text fontSize={32} lineHeight={1.5} transition="lineHeight 100ms">
      hi
    </Text>
  )
  await update(
    <Text fontSize={32} lineHeight={2} transition="lineHeight 100ms">
      hi
    </Text>
  )

  // the font size is at rest, so every intermediate leading here comes from the
  // ratio alone, on the 100ms entry that names lineHeight
  const ratio = ratioAnimation()
  expect(ratio.duration).toBe(100)
  const samples = [0, 50, 100].map((elapsed) => {
    advance(ratio, elapsed)
    return paintedLeading()
  })
  expect(samples).toEqual([48, 56, 64])
})

test('a leading with no painted predecessor starts from the font size it is a ratio of', async () => {
  // `normal` leaves core with no lineHeight at all, so this node has never
  // painted a ratio and there is none to move from
  const mounted = await render(
    <Text fontSize={16} lineHeight="normal" transition="fontSize 400ms">
      hi
    </Text>
  )
  expect(mounted.lineHeight).toBeUndefined()

  const animating = await update(
    <Text fontSize={32} lineHeight={1.5} transition="fontSize 400ms">
      hi
    </Text>
  )

  // the first ratio takes effect at once (a ramp from no ratio at all would
  // start the leading at zero), and the product carries it over the font size
  const fontSize = start(descriptorFor(animating, 'fontSize'), 16)
  expect(sharedAnimations).toHaveLength(0)
  const samples = [0, 200, 400].map((elapsed) => {
    advance(fontSize, elapsed)
    return paintedLeading()
  })
  expect(samples).toEqual([24, 36, 48])
})

// two entries on one clock, so a leading interpolated between its endpoints
// would look plausible and still be wrong everywhere between them
const BOTH = 'fontSize 400ms, lineHeight 400ms'

test('a font size and a ratio changing together paint their true product', async () => {
  await render(
    <Text fontSize={20} lineHeight={1} transition={BOTH}>
      hi
    </Text>
  )
  const animating = await update(
    <Text fontSize={40} lineHeight={2} transition={BOTH}>
      hi
    </Text>
  )

  const fontSize = start(descriptorFor(animating, 'fontSize'), 20)
  const ratio = ratioAnimation()
  const samples = [0, 100, 200, 300, 400].map((elapsed) => {
    advance(fontSize, elapsed)
    advance(ratio, elapsed)
    return [fontSize.current, ratio.current, paintedLeading()]
  })
  // fs(t) * r(t) is quadratic in t. interpolating lineHeight from 20 to 80 over
  // the same clock would paint 35 / 50 / 65 at the three middle samples: the
  // right endpoints, and up to 5px of leading nothing on screen has earned.
  expect(samples).toEqual([
    [20, 1, 20],
    [25, 1.25, 31.25],
    [30, 1.5, 45],
    [35, 1.75, 61.25],
    [40, 2, 80],
  ])
})

test('a ratio interrupted mid-flight keeps the leading continuous', async () => {
  await render(
    <Text fontSize={20} lineHeight={1} transition={BOTH}>
      hi
    </Text>
  )
  const animating = await update(
    <Text fontSize={40} lineHeight={2} transition={BOTH}>
      hi
    </Text>
  )
  const fontSize = start(descriptorFor(animating, 'fontSize'), 20)
  advance(fontSize, 200)
  advance(ratioAnimation(), 200)
  expect(paintedLeading()).toBe(45)

  // the ratio is retargeted halfway through while the font size keeps its own
  // target. reanimated continues a timing whose toValue has not changed, so the
  // font size is still the descriptor above, on its original clock.
  await update(
    <Text fontSize={40} lineHeight={3} transition={BOTH}>
      hi
    </Text>
  )
  const ratio = ratioAnimation()
  expect(ratio.from).toBe(1.5)

  const samples = [0, 100, 200].map((elapsed) => {
    advance(fontSize, 200 + elapsed)
    advance(ratio, elapsed)
    return paintedLeading()
  })
  // no step at the interruption (45 again), and every frame after it is still
  // the product of the two live factors
  expect(samples).toEqual([45, 65.625, 90])
})

// ---------------------------------------------------------------------------
// inherited font size
//
// A descendant with no font size of its own normally gets the ancestor's copied
// down by core as one number, which under an animation is the destination for
// the whole 400ms. The binding replaces that copy: the descendant's worklet
// reads the ANCESTOR'S shared value, the one the ancestor's own fontSize
// animation mirrors into on every frame, so there is one clock for both.
// ---------------------------------------------------------------------------

// mappers[1] is the descendant the binding wrapped, in the same commit as [0]
const childStyle = () => mappers[1]!()

test.each([undefined, 'opacity 400ms'] as const)(
  'a descendant with transition %s reads the ancestor mirror',
  async (transition) => {
    await render(
      <Text fontSize={16} transition="fontSize 400ms">
        <Text lineHeight={1.5} {...(transition ? { transition } : {})}>
          hi
        </Text>
      </Text>
    )
    expect(childStyle().lineHeight).toBe(24)
    if (!transition) expect(childStyle().fontSize).toBe(16)

    const animating = await update(
      <Text fontSize={32} transition="fontSize 400ms">
        <Text lineHeight={1.5} {...(transition ? { transition } : {})}>
          hi
        </Text>
      </Text>
    )
    const fontSize = start(descriptorFor(animating, 'fontSize'), 16)

    // the descendant is not sampling its own animation: it has none. every one of
    // these comes from the ancestor's frame, so a copied destination would read
    // 32 / 48 on the first of them.
    const samples = [0, 100, 200, 300, 400].map((elapsed) => {
      advance(fontSize, elapsed)
      const style = childStyle()
      if (!transition) expect(style.fontSize).toBe(16 + (elapsed * 16) / 400)
      return style.lineHeight
    })
    expect(samples).toEqual([24, 30, 36, 42, 48])
  }
)

test('a descendant with its own font size mounts no binding at all', async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text fontSize={10} lineHeight={1.5}>
        hi
      </Text>
    </Text>
  )
  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text fontSize={10} lineHeight={1.5}>
        hi
      </Text>
    </Text>
  )

  // negative control for the test above: with a font size of its own the
  // descendant is a plain host, so there is no second mapper to read
  expect(mappers).toHaveLength(1)
})

test('an inherited absolute leading binds the font size and keeps its own length', async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight="30px">hi</Text>
    </Text>
  )
  const animating = await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight="30px">hi</Text>
    </Text>
  )
  advance(start(descriptorFor(animating, 'fontSize'), 16), 200)

  // the binding leaves lineHeight alone, so the length core already resolved
  // shows through from the host's own style
  expect(childStyle()).toEqual({ fontSize: 24 })
})

test('a leading rebinds when it changes from a ratio to a length and back', async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )
  let animating = await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )
  advance(start(descriptorFor(animating, 'fontSize'), 16), 100)
  expect(childStyle()).toEqual({ fontSize: 20, lineHeight: 30 })

  // the leading becomes a length while the ancestor moves again
  animating = await update(
    <Text fontSize={48} transition="fontSize 400ms">
      <Text lineHeight="30px">hi</Text>
    </Text>
  )
  // the re-render alone does not snap the descendant: it keeps reading the
  // mirror, which still holds the frame the ancestor last painted
  expect(childStyle()).toEqual({ fontSize: 20 })
  advance(start(descriptorFor(animating, 'fontSize'), 32), 200)
  // still bound to the ancestor, and the leading is the length core resolved
  expect(childStyle()).toEqual({ fontSize: 40 })

  animating = await update(
    <Text fontSize={64} transition="fontSize 400ms">
      <Text lineHeight={2}>hi</Text>
    </Text>
  )
  advance(start(descriptorFor(animating, 'fontSize'), 48), 200)
  // back on the product, at the new ratio, over a font size still climbing
  expect(childStyle()).toEqual({ fontSize: 56, lineHeight: 112 })
})
