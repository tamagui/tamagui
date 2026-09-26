// Media subscriptions are indexed by the media key a component actually reads,
// so a breakpoint change reaches only the components that read that breakpoint.
//
// This fixture counts two different things and never conflates them:
//
//   - CALLBACKS: subscriber callbacks the publish actually invoked
//     (_mediaListenerStats.notified). This is the number the keyed index moves.
//   - COMMITTED RENDERS: a no-dep useEffect, which runs once per commit.
//     Render-function invocations are counted separately again, because React
//     can discard a render or double-invoke it without committing.
//
// Before the keyed index, a single flat listener Set meant one breakpoint
// change woke EVERY media subscriber on the page; each one then re-read its own
// snapshot and bailed out. So the committed-render numbers were already correct
// and the callback numbers were not — which is exactly why this fixture asserts
// both, and why asserting only renders would have measured nothing.
process.env.TAMAGUI_TARGET = 'web'

import { act, fireEvent, render } from '@testing-library/react'
import { memo, useEffect, useState } from 'react'
import { beforeEach, describe, expect, test } from 'vitest'
import config from '../config-default'
import {
  TamaguiProvider,
  Theme,
  View,
  _mediaListenerStats,
  createTamagui,
  setMediaState,
  updateMediaListeners,
  useMedia,
  useTheme,
} from '../web/src'

const conf = createTamagui(config.getDefaultTamaguiConfig())

const ALL_OFF = {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false,
  gtXs: false,
  gtSm: false,
  gtMd: false,
  gtLg: false,
  short: false,
  tall: false,
  hoverNone: false,
  pointerCoarse: false,
} as any

type Counter = { rendered: number; committed: number }
const counter = (): Counter => ({ rendered: 0, committed: 0 })

// `rendered` counts render-function calls, `committed` counts commits. they are
// different numbers and the assertions below never treat one as the other.
function useCounted(c: Counter) {
  c.rendered += 1
  useEffect(() => {
    c.committed += 1
  })
}

// memo so a parent re-render alone never moves these counts: only a
// subscription-driven update does.
const KeyReader = memo(function KeyReader({
  count,
  mediaKey,
  testID,
}: {
  count: Counter
  mediaKey: 'sm' | 'md' | 'lg' | 'gtLg'
  testID: string
}) {
  useCounted(count)
  const media = useMedia()
  return <span data-testid={testID} data-active={String(media[mediaKey])} />
})

const MultiKeyReader = memo(function MultiKeyReader({ count }: { count: Counter }) {
  useCounted(count)
  const media = useMedia()
  // read both unconditionally — `media.sm && media.gtLg` would short-circuit and
  // leave gtLg untracked, which is a real way to author a missed subscription
  const sm = media.sm
  const gtLg = media.gtLg
  return <span data-testid="multi" data-active={`${sm}/${gtLg}`} />
})

// subscribes to media but never reads a key. the runtime equivalent is any
// tamagui component that read a theme variable (which sets shouldListenForMedia)
// without authoring a media clause — the largest group on a real page.
const NoKeyReader = memo(function NoKeyReader({ count }: { count: Counter }) {
  useCounted(count)
  useMedia()
  return <span data-testid="nokey" />
})

const NonSubscriber = memo(function NonSubscriber({ count }: { count: Counter }) {
  useCounted(count)
  return <span data-testid="static" />
})

const ThemeReader = memo(function ThemeReader({ count }: { count: Counter }) {
  useCounted(count)
  const theme = useTheme()
  return <span data-testid="theme" data-bg={String(theme?.background?.val)} />
})

function readStats() {
  return { ..._mediaListenerStats }
}

function flip(next: Record<string, boolean>) {
  act(() => {
    setMediaState({ ...ALL_OFF, ...next })
    updateMediaListeners()
  })
}

describe('media subscriptions are keyed by the media key a component reads', () => {
  beforeEach(() => {
    // known baseline so each test's publish diff starts from all-off
    setMediaState({ ...ALL_OFF })
    updateMediaListeners()
  })

  test('a breakpoint change wakes only the readers of that breakpoint', () => {
    const sm = counter()
    const md = counter()
    const lg = counter()
    const multi = counter()
    const nokey = counter()
    const inert = counter()

    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <KeyReader count={sm} mediaKey="sm" testID="sm" />
        <KeyReader count={md} mediaKey="md" testID="md" />
        <KeyReader count={lg} mediaKey="lg" testID="lg" />
        <MultiKeyReader count={multi} />
        <NoKeyReader count={nokey} />
        <NonSubscriber count={inert} />
      </TamaguiProvider>
    )

    // five components subscribed to media here: sm, md, lg, multi, nokey.
    const base = {
      sm: { ...sm },
      md: { ...md },
      lg: { ...lg },
      multi: { ...multi },
      nokey: { ...nokey },
      inert: { ...inert },
    }
    const statsBefore = readStats()

    flip({ sm: true })

    const woken = readStats().notified - statsBefore.notified

    // CALLBACKS: only the two components that read `sm`. before the keyed
    // index this was 5 — every media subscriber, including the three that
    // cannot be affected by `sm` at all.
    expect(woken).toBe(2)

    // COMMITTED RENDERS: counted separately, and only the sm readers commit.
    expect(sm.committed).toBe(base.sm.committed + 1)
    expect(multi.committed).toBe(base.multi.committed + 1)
    expect(md.committed).toBe(base.md.committed)
    expect(lg.committed).toBe(base.lg.committed)
    expect(nokey.committed).toBe(base.nokey.committed)
    expect(inert.committed).toBe(base.inert.committed)

    // and the render function ran exactly as often as it committed here, so a
    // discarded or double-invoked render is not hiding inside the numbers
    expect(sm.rendered - base.sm.rendered).toBe(1)
    expect(md.rendered - base.md.rendered).toBe(0)

    // CORRECTNESS: the value the readers see is the new one
    expect(getByTestId('sm').getAttribute('data-active')).toBe('true')
    expect(getByTestId('multi').getAttribute('data-active')).toBe('true/false')
    expect(getByTestId('md').getAttribute('data-active')).toBe('false')
  })

  test('every keyed reader still updates when its own key changes', () => {
    const sm = counter()
    const md = counter()
    const lg = counter()
    const multi = counter()

    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <KeyReader count={sm} mediaKey="sm" testID="sm" />
        <KeyReader count={md} mediaKey="md" testID="md" />
        <KeyReader count={lg} mediaKey="lg" testID="lg" />
        <MultiKeyReader count={multi} />
      </TamaguiProvider>
    )

    for (const [key, own] of [
      ['md', md],
      ['lg', lg],
      ['sm', sm],
    ] as const) {
      const before = { ...own }
      const statsBefore = readStats()

      flip({ [key]: true })

      expect(readStats().notified - statsBefore.notified).toBe(
        // sm is also read by MultiKeyReader
        key === 'sm' ? 2 : 1
      )
      expect(own.committed).toBe(before.committed + 1)
      expect(getByTestId(key).getAttribute('data-active')).toBe('true')

      flip({})
      expect(getByTestId(key).getAttribute('data-active')).toBe('false')
    }
  })

  test('a component reading several keys updates for each of them', () => {
    const multi = counter()
    const sm = counter()

    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <MultiKeyReader count={multi} />
        <KeyReader count={sm} mediaKey="sm" testID="sm" />
      </TamaguiProvider>
    )

    let before = { ...multi }
    flip({ gtLg: true })
    expect(multi.committed).toBe(before.committed + 1)
    expect(getByTestId('multi').getAttribute('data-active')).toBe('false/true')
    // the sm-only reader is untouched by a gtLg change
    expect(getByTestId('sm').getAttribute('data-active')).toBe('false')

    before = { ...multi }
    const statsBefore = readStats()
    flip({ gtLg: true, sm: true })
    // both of its keys moved in one publish, but it is woken once, not twice
    expect(readStats().notified - statsBefore.notified).toBe(2)
    expect(multi.committed).toBe(before.committed + 1)
    expect(getByTestId('multi').getAttribute('data-active')).toBe('true/true')
  })

  test('a component that starts reading a new key gets subscribed to it', () => {
    const count = counter()
    let setKey: (k: 'sm' | 'md') => void = () => {}

    const Switcher = memo(function Switcher() {
      useCounted(count)
      const [key, set] = useState<'sm' | 'md'>('sm')
      setKey = set
      const media = useMedia()
      return <span data-testid="switch" data-active={String(media[key])} />
    })

    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Switcher />
      </TamaguiProvider>
    )

    act(() => setKey('md'))
    expect(getByTestId('switch').getAttribute('data-active')).toBe('false')

    const before = { ...count }
    const statsBefore = readStats()
    flip({ md: true })
    expect(readStats().notified - statsBefore.notified).toBe(1)
    expect(count.committed).toBe(before.committed + 1)
    expect(getByTestId('switch').getAttribute('data-active')).toBe('true')

    // and it no longer answers to the key it stopped reading
    const afterMd = { ...count }
    const statsAfterMd = readStats()
    flip({ md: true, sm: true })
    expect(readStats().notified - statsAfterMd.notified).toBe(0)
    expect(count.committed).toBe(afterMd.committed)
  })

  test('an unmounted reader is removed from its key bucket', () => {
    const sm = counter()
    let setShown: (v: boolean) => void = () => {}

    function App() {
      const [shown, set] = useState(true)
      setShown = set
      return (
        <TamaguiProvider config={conf} defaultTheme="light">
          {shown ? <KeyReader count={sm} mediaKey="sm" testID="sm" /> : null}
        </TamaguiProvider>
      )
    }

    render(<App />)

    let statsBefore = readStats()
    flip({ sm: true })
    expect(readStats().notified - statsBefore.notified).toBe(1)

    act(() => setShown(false))

    statsBefore = readStats()
    flip({ sm: false })
    expect(readStats().notified - statsBefore.notified).toBe(0)
  })

  test('tamagui components with a media clause subscribe by that clause', async () => {
    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        {/* disableClassName forces runtime media evaluation, which is what
            registers a component as needing media updates */}
        <View data-testid="sm-view" disableClassName backgroundColor="blue sm:red" />
        <View
          data-testid="gtlg-view"
          disableClassName
          backgroundColor="blue gtLg:green"
        />
        {/* reads a theme variable, authors no media clause: subscribed, but
            belongs in no key bucket */}
        <View data-testid="themed-view" disableClassName backgroundColor="$background" />
      </TamaguiProvider>
    )

    // let the enter state machine settle (disableClassName defers noClass until
    // unmounted flips false, behind a double requestAnimationFrame)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60))
    })

    const statsBefore = readStats()
    flip({ sm: true })

    expect(readStats().notified - statsBefore.notified).toBe(1)
    expect(getByTestId('sm-view').style.backgroundColor).toBe('red')
    expect(getByTestId('gtlg-view').style.backgroundColor).toBe('blue')
  })
})

describe('non-media updates never reach a media subscriber', () => {
  beforeEach(() => {
    setMediaState({ ...ALL_OFF })
    updateMediaListeners()
  })

  test('a theme change publishes nothing to media', () => {
    const themeCount = counter()
    const mediaCount = counter()
    let setName: (n: 'light' | 'dark') => void = () => {}

    function App() {
      const [name, setN] = useState<'light' | 'dark'>('light')
      setName = setN
      return (
        <TamaguiProvider config={conf} defaultTheme="light">
          <Theme name={name}>
            <ThemeReader count={themeCount} />
            <KeyReader count={mediaCount} mediaKey="sm" testID="sm" />
          </Theme>
        </TamaguiProvider>
      )
    }

    render(<App />)

    const themeBefore = { ...themeCount }
    const mediaBefore = { ...mediaCount }
    const statsBefore = readStats()

    act(() => setName('dark'))

    // the control can fail: the theme reader really did commit
    expect(themeCount.committed).toBe(themeBefore.committed + 1)
    expect(readStats().publishes).toBe(statsBefore.publishes)
    expect(readStats().notified).toBe(statsBefore.notified)
    expect(mediaCount.committed).toBe(mediaBefore.committed)
  })

  test('a hover and a group state change publish nothing to media', async () => {
    const mediaCount = counter()

    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <View data-testid="group-parent" disableClassName group="row">
          <View
            data-testid="hover-target"
            disableClassName
            opacity="1 hover:0.5"
            backgroundColor="blue group-hover/row:red"
          />
        </View>
        <KeyReader count={mediaCount} mediaKey="sm" testID="sm" />
      </TamaguiProvider>
    )

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 60))
    })

    const mediaBefore = { ...mediaCount }
    const statsBefore = readStats()

    act(() => {
      fireEvent.mouseEnter(getByTestId('hover-target'))
    })
    // the control can fail: hover really did restyle the element
    expect(getByTestId('hover-target').style.opacity).toBe('0.5')

    act(() => {
      fireEvent.mouseEnter(getByTestId('group-parent'))
    })
    expect(getByTestId('hover-target').style.backgroundColor).toBe('red')

    expect(readStats().publishes).toBe(statsBefore.publishes)
    expect(readStats().notified).toBe(statsBefore.notified)
    expect(mediaCount.committed).toBe(mediaBefore.committed)
  })
})
