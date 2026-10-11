import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Animated stand-in
//
// react-native's own Animated is Flow source vitest cannot parse, and the
// repo's fake exposes only createAnimatedComponent, so the graph this driver
// builds has nowhere to live. What follows is that graph's algebra and nothing
// more: value nodes, a multiplication node, and a linear solver on an explicit
// clock. Every decision under test — which keys get nodes, what each node is
// animated toward, and what the painted leading is wired to — is the driver's,
// and the assertions read real numbers back out of the nodes it built.
// ---------------------------------------------------------------------------

type Running = {
  value: AnimatedValue
  from: number
  to: number
  duration: number
  elapsed: number
  done?: (result: { finished: boolean }) => void
}

const running: Running[] = []

// every animation the driver has started since the last render, including the
// ones that have already finished. `useNativeDriver` is the node-wide decision
// under test in the acceleration controls: react-native cannot mix drivers
// inside one node's graph, so a single JS-driven key takes the whole node off
// native acceleration.
const started: Array<{ value: AnimatedValue; to: number; useNativeDriver: boolean }> = []

const stepClock = (ms: number) => {
  for (const anim of running.slice()) {
    anim.elapsed = Math.min(anim.elapsed + ms, anim.duration)
    const progress = anim.duration === 0 ? 1 : anim.elapsed / anim.duration
    anim.value.setValue(anim.from + (anim.to - anim.from) * progress)
    if (anim.elapsed >= anim.duration) {
      running.splice(running.indexOf(anim), 1)
      anim.done?.({ finished: true })
    }
  }
}

class AnimatedValue {
  _value: number
  _listeners = new Map<string, (v: { value: number }) => void>()
  constructor(value: number) {
    this._value = value
  }
  __getValue() {
    return this._value
  }
  setValue(next: number) {
    this._value = next
    for (const listener of this._listeners.values()) listener({ value: next })
  }
  stopAnimation() {
    const index = running.findIndex((anim) => anim.value === this)
    if (index >= 0) running.splice(index, 1)
  }
  addListener(cb: (v: { value: number }) => void) {
    const id = String(this._listeners.size)
    this._listeners.set(id, cb)
    return id
  }
  removeListener(id: string) {
    this._listeners.delete(id)
  }
  // colors reach this; the driver never interpolates a numeric text metric
  interpolate(config: { outputRange: unknown[] }) {
    return {
      __isInterpolation: true,
      __getValue: () => config.outputRange[config.outputRange.length - 1],
    }
  }
}

// react-native's own multiply takes a node or a plain number on either side
class AnimatedMultiplication {
  constructor(
    public a: { __getValue(): number } | number,
    public b: { __getValue(): number } | number
  ) {}
  __getValue() {
    const value = (operand: { __getValue(): number } | number) =>
      typeof operand === 'number' ? operand : operand.__getValue()
    return value(this.a) * value(this.b)
  }
}

const timing = (
  value: AnimatedValue,
  config: { toValue: number; duration?: number; useNativeDriver?: boolean }
) => ({
  start(done?: (result: { finished: boolean }) => void) {
    started.push({
      value,
      to: config.toValue,
      useNativeDriver: config.useNativeDriver === true,
    })
    running.push({
      value,
      from: value.__getValue(),
      to: config.toValue,
      duration: config.duration ?? 0,
      elapsed: 0,
      done,
    })
    if ((config.duration ?? 0) === 0) stepClock(0)
  },
  stop() {
    value.stopAnimation()
  },
})

const hostComponent = (name: string) =>
  React.forwardRef((props: any, ref: any) => React.createElement(name, { ...props, ref }))

vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<Record<string, any>>()
  const Animated = {
    Value: AnimatedValue,
    View: hostComponent('AnimatedView'),
    Text: hostComponent('AnimatedText'),
    createAnimatedComponent: (component: any) => component,
    multiply: (a: any, b: any) => new AnimatedMultiplication(a, b),
    timing,
    // every transition in this file is a timing entry, and an uncovered key
    // gets the driver's own `{ type: 'timing', duration: 0 }` snap. a spring
    // here would mean the test lost track of which entry applies.
    spring: () => {
      throw new Error('unexpected spring in a timing-only test')
    },
    sequence: () => {
      throw new Error('unexpected sequence: no transition here declares a delay')
    },
    delay: () => {
      throw new Error('unexpected delay')
    },
  }
  return {
    ...actual,
    Animated,
    Easing: { bezier: () => (t: number) => t },
  }
})

// the driver reads isDark through the theme runtime, which resolves to a
// different @tamagui/web instance than @tamagui/core/native-test in this
// environment and would report "Missing theme". the scheme is unrelated to
// anything under test here.
vi.mock('@tamagui/web/internal-runtime', async (importOriginal) => ({
  ...(await importOriginal<Record<string, any>>()),
  useThemeWithState: () => [null, { scheme: 'light', name: 'light' }],
}))

const { createAnimations } = await import('@tamagui/animations-react-native')
const { TamaguiProvider, Text, createTamagui } = await import('@tamagui/core')

const timings = { slow: 'ease 400ms', quick: 'ease 100ms' }

const config = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  animations: createAnimations(timings),
} as any)

// the driver offers native acceleration only when the config asks for it or it
// detects Fabric, which it cannot under vitest. the acceleration controls need
// a driver that can say true, or "did it stay on the native driver" is a
// question with one possible answer.
const acceleratedConfig = createTamagui({
  ...getDefaultTamaguiConfig('native'),
  animations: createAnimations(timings, { useNativeDriver: true }),
} as any)

let rendered: TestRenderer.ReactTestRenderer | null = null
let activeConfig: any = config

const render = async (element: React.ReactElement, withConfig: any = config) => {
  activeConfig = withConfig
  await act(async () => {
    rendered = TestRenderer.create(
      <TamaguiProvider config={activeConfig} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })
}

const update = async (element: React.ReactElement) => {
  await act(async () => {
    rendered!.update(
      <TamaguiProvider config={activeConfig} defaultTheme="light">
        {element}
      </TamaguiProvider>
    )
  })
}

// the driver returns `style: [nonAnimatedStyle, animatedStyle]`, and the
// inherited binding appends its own entry to whatever the host already had
const flattenStyle = (style: any) => {
  const parts = (value: any): any[] =>
    Array.isArray(value) ? value.flatMap(parts) : [value]
  return Object.assign({}, ...parts(style).filter(Boolean))
}

const paintedStyle = (index = 0) =>
  flattenStyle(rendered!.root.findAllByType('AnimatedText' as any)[index].props.style)

const read = (value: any) =>
  value && typeof value === 'object' && '__getValue' in value ? value.__getValue() : value

const painted = (key: string) => read(paintedStyle()[key])

// the ancestor renders first, so index 1 is the bound descendant
const paintedChild = (key: string) => read(paintedStyle(1)[key])

beforeEach(() => {
  running.length = 0
  started.length = 0
  activeConfig = config
})

afterEach(() => {
  rendered?.unmount()
  rendered = null
})

// two entries that disagree. an independently animated leading reaches 48 on
// its own 100ms clock and then paints it over a font size still climbing for
// another 300ms; the product cannot, because there is only one font size.
const SPLIT = 'fontSize 400ms, lineHeight 100ms'

test('a ratio leading is the product of the font size being animated, frame by frame', async () => {
  await render(
    <Text fontSize={16} lineHeight={1.5} transition={SPLIT}>
      hi
    </Text>
  )
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 16,
    lineHeight: 24,
  })

  await update(
    <Text fontSize={32} lineHeight={1.5} transition={SPLIT}>
      hi
    </Text>
  )

  // sample the running animation rather than its endpoints: a leading with a
  // timeline of its own lands on 48 too, it just paints the wrong leading for
  // most of the way there.
  const samples: Array<[number, number]> = []
  for (let frame = 0; frame < 4; frame++) {
    await act(async () => {
      stepClock(100)
    })
    samples.push([painted('fontSize'), painted('lineHeight')])
  }

  expect(samples).toEqual([
    [20, 30],
    [24, 36],
    [28, 42],
    [32, 48],
  ])
})

test('a ratio and a font size moving on different clocks stay one ratio throughout', async () => {
  await render(
    <Text fontSize={20} lineHeight={1} transition={SPLIT}>
      hi
    </Text>
  )
  await update(
    <Text fontSize={40} lineHeight={2} transition={SPLIT}>
      hi
    </Text>
  )

  // the ratio finishes first (100ms), the font size is a quarter of the way
  // through its own 400ms: 25 * 2. the leading is never anything but the font
  // size on screen times a ratio between the two authored ones.
  await act(async () => {
    stepClock(100)
  })
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 25,
    lineHeight: 50,
  })

  await act(async () => {
    stepClock(300)
  })
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 40,
    lineHeight: 80,
  })
})

test('a leading the transition names alone does not drift from a font size that snapped', async () => {
  await render(
    <Text fontSize={16} lineHeight={1.5} transition="lineHeight 400ms">
      hi
    </Text>
  )
  await update(
    <Text fontSize={32} lineHeight={1.5} transition="lineHeight 400ms">
      hi
    </Text>
  )

  // fontSize is not in the property list, so it snaps. the ratio did not
  // change, so there is nothing left for the leading to animate: 32 * 1.5 from
  // the first frame. a leading animated as a length would spend 400ms climbing
  // 24 -> 48 under a font size that already arrived.
  await act(async () => {
    stepClock(200)
  })
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 32,
    lineHeight: 48,
  })
})

test('the leading follows a font size the transition names alone', async () => {
  await render(
    <Text fontSize={16} lineHeight={1.5} transition="fontSize 400ms">
      hi
    </Text>
  )
  await update(
    <Text fontSize={32} lineHeight={1.5} transition="fontSize 400ms">
      hi
    </Text>
  )

  await act(async () => {
    stepClock(200)
  })

  // `lineHeight` is not in the property list, so on its own it would take the
  // driver's zero-duration snap and paint 48 over a font size still at 24.
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 24,
    lineHeight: 36,
  })
})

test('an absolute leading keeps its own value while the font size animates', async () => {
  await render(
    <Text fontSize={16} lineHeight="30px" transition="slow">
      hi
    </Text>
  )
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 16,
    lineHeight: 30,
  })

  await update(
    <Text fontSize={32} lineHeight="30px" transition="slow">
      hi
    </Text>
  )

  await act(async () => {
    stepClock(200)
  })

  // a length is a length: it does not scale with the font size it sits next to
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 24,
    lineHeight: 30,
  })
})

test('a changing ratio moves the leading over a font size that is standing still', async () => {
  await render(
    <Text fontSize={20} lineHeight={1} transition="slow">
      hi
    </Text>
  )
  await update(
    <Text fontSize={20} lineHeight={2} transition="slow">
      hi
    </Text>
  )

  await act(async () => {
    stepClock(200)
  })

  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 20,
    lineHeight: 30,
  })
})

// ---------------------------------------------------------------------------
// inherited font size
//
// react-native has no text inheritance for a descendant that is not a Text
// child of the same host, and no inheritance at all for TextInput, so core
// normally copies the resolved font size down. Under an animation that copy is
// a destination, one number for the whole 400ms. These cover the binding that
// replaces it: the descendant reads the ANCESTOR'S live node, so its own
// leading is that node times its own ratio.
// ---------------------------------------------------------------------------

test('a descendant with no font size of its own follows the ancestor being animated', async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )
  expect({
    fontSize: paintedChild('fontSize'),
    lineHeight: paintedChild('lineHeight'),
  }).toEqual({ fontSize: 16, lineHeight: 24 })

  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )

  const samples: Array<[number, number]> = []
  for (let frame = 0; frame < 4; frame++) {
    await act(async () => {
      stepClock(100)
    })
    samples.push([paintedChild('fontSize'), paintedChild('lineHeight')])
  }

  // the copied destination would read 32 / 48 on the first of these
  expect(samples).toEqual([
    [20, 30],
    [24, 36],
    [28, 42],
    [32, 48],
  ])
  // and the ancestor is the same node, not a second solver that agrees
  expect(painted('fontSize')).toBe(paintedChild('fontSize'))
})

test('a descendant with its own font size ignores the ancestor', async () => {
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

  await act(async () => {
    stepClock(200)
  })

  // negative control: the child is a plain host again, so `paintedStyle(1)`
  // would be the ancestor itself if the binding had wrapped nothing
  expect(rendered!.root.findAllByType('AnimatedText' as any)).toHaveLength(1)
  const hosts = rendered!.root.findAllByType('Text' as any)
  expect(flattenStyle(hosts[hosts.length - 1].props.style)).toMatchObject({
    fontSize: 10,
    lineHeight: 15,
  })
})

test('an inherited absolute leading still binds the font size it sits next to', async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight="30px">hi</Text>
    </Text>
  )
  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight="30px">hi</Text>
    </Text>
  )

  await act(async () => {
    stepClock(200)
  })

  // the font size is the ancestor's live one; a length is still a length
  expect({
    fontSize: paintedChild('fontSize'),
    lineHeight: paintedChild('lineHeight'),
  }).toEqual({ fontSize: 24, lineHeight: 30 })
})

test('a leading rebinds when it changes from a ratio to a length and back', async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )
  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )
  await act(async () => {
    stepClock(100)
  })
  expect({
    fontSize: paintedChild('fontSize'),
    lineHeight: paintedChild('lineHeight'),
  }).toEqual({ fontSize: 20, lineHeight: 30 })

  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight="30px">hi</Text>
    </Text>
  )
  await act(async () => {
    stepClock(100)
  })
  expect({
    fontSize: paintedChild('fontSize'),
    lineHeight: paintedChild('lineHeight'),
  }).toEqual({ fontSize: 24, lineHeight: 30 })

  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight={2}>hi</Text>
    </Text>
  )
  await act(async () => {
    stepClock(100)
  })
  // back on the product, at the new ratio, over a font size still climbing
  expect({
    fontSize: paintedChild('fontSize'),
    lineHeight: paintedChild('lineHeight'),
  }).toEqual({ fontSize: 28, lineHeight: 56 })
})

// ---------------------------------------------------------------------------
// native acceleration
//
// A text metric has no entry in the native animated module's whitelist, so any
// node animating one runs its WHOLE graph on the JS driver. Nearly every Text
// carries a font size, so being named by a broad transition cannot be enough to
// pull the node off native acceleration: only actually moving can.
// ---------------------------------------------------------------------------

const drivers = () =>
  started.map((animation) => [animation.to, animation.useNativeDriver])

// a descendant that reads an ancestor's live font size is rendered by
// Animated.Text instead of Text. the swap is a remount, so the type has to be
// the same before, during, and after the ancestor's animation.
const hostTypes = () => {
  const types: string[] = []
  const walk = (node: any) => {
    if (!node || typeof node === 'string') return
    types.push(node.type)
    ;(node.children || []).forEach(walk)
  }
  walk(rendered!.toJSON() as any)
  return types
}

test('an opacity animation over an unchanged font size keeps the native driver', async () => {
  await render(
    <Text fontSize={20} lineHeight={1.5} opacity={1} transition="slow">
      hi
    </Text>,
    acceleratedConfig
  )
  await update(
    <Text fontSize={20} lineHeight={1.5} opacity={0.5} transition="slow">
      hi
    </Text>
  )

  // the transition names every key, but the text metrics are not moving, so
  // they stay plain numbers in the style and never enter the Animated graph
  const style = paintedStyle()
  expect({ fontSize: style.fontSize, lineHeight: style.lineHeight }).toEqual({
    fontSize: 20,
    lineHeight: 30,
  })
  // mount seeds the opacity, the update animates it, and both run natively:
  // no font size timing, no ratio timing, on either pass
  expect(drivers()).toEqual([
    [1, true],
    [0.5, true],
  ])

  await act(async () => {
    stepClock(400)
  })
  expect(painted('opacity')).toBe(0.5)
})

test('a font size that is actually changing takes the node to the JS driver', async () => {
  await render(
    <Text fontSize={20} lineHeight={1.5} opacity={1} transition="slow">
      hi
    </Text>,
    acceleratedConfig
  )
  await update(
    <Text fontSize={40} lineHeight={1.5} opacity={0.5} transition="slow">
      hi
    </Text>
  )

  // negative control for the test above: one moving metric, and every animation
  // on the node runs in JS, because they share one graph
  expect(drivers()).toEqual([
    [1, true],
    [0.5, false],
    [40, false],
  ])
  // it moves rather than snapping, even though the metric was out of the graph
  // a moment ago: the value it rejoins with starts at the size last painted
  expect(painted('fontSize')).toBe(20)
  await act(async () => {
    stepClock(200)
  })
  expect({ fontSize: painted('fontSize'), lineHeight: painted('lineHeight') }).toEqual({
    fontSize: 30,
    lineHeight: 45,
  })

  // and once it arrives it leaves the graph again, so the node is natively
  // accelerated for the next opacity animation
  await act(async () => {
    stepClock(200)
  })
  started.length = 0
  await update(
    <Text fontSize={40} lineHeight={1.5} opacity={1} transition="slow">
      hi
    </Text>
  )
  expect(drivers()).toEqual([[1, true]])
  expect(paintedStyle().fontSize).toBe(40)
})

test("a descendant keeps its host component across the ancestor's animation", async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>,
    acceleratedConfig
  )
  // the ancestor's size can move, so the descendant reads it live from the
  // first paint, and nothing animates yet
  expect(hostTypes()).toEqual(['AnimatedText', 'AnimatedText'])
  expect(drivers()).toEqual([])

  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )
  await act(async () => {
    stepClock(200)
  })
  expect(hostTypes()).toEqual(['AnimatedText', 'AnimatedText'])
  expect({
    fontSize: paintedChild('fontSize'),
    lineHeight: paintedChild('lineHeight'),
  }).toEqual({ fontSize: 24, lineHeight: 36 })

  // and it still reads it after the size arrives and leaves the graph
  await act(async () => {
    stepClock(200)
  })
  await update(
    <Text fontSize={32} transition="fontSize 400ms">
      <Text lineHeight={1.5}>hi</Text>
    </Text>
  )
  expect(hostTypes()).toEqual(['AnimatedText', 'AnimatedText'])
  expect({
    fontSize: paintedChild('fontSize'),
    lineHeight: paintedChild('lineHeight'),
  }).toEqual({ fontSize: 32, lineHeight: 48 })
})

test('a leading multiplied off an ancestor keeps the descendant on the JS driver', async () => {
  await render(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight={1.5} opacity={1} transition="slow">
        hi
      </Text>
    </Text>,
    acceleratedConfig
  )
  await update(
    <Text fontSize={16} transition="fontSize 400ms">
      <Text lineHeight={1.5} opacity={0.5} transition="slow">
        hi
      </Text>
    </Text>
  )

  // the descendant's leading is its ratio times a value the ancestor drives in
  // JS. react-native cannot run the opacity on the other driver in the same
  // graph, so this node animates in JS even though its own metrics never move.
  expect(drivers()).toEqual([
    [1, false],
    [0.5, false],
  ])
  expect(paintedChild('lineHeight')).toBe(24)
})
