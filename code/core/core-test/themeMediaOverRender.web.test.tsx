// Guards the granular re-render contract:
//
//   - Components that read theme tokens (via $-prefixed style props or
//     useTheme().val) MUST re-render when the theme they depend on changes.
//   - Components that DO NOT read theme tokens MUST NOT re-render on a theme
//     change. (the regression that motivated this test: a moonshot that
//     dropped the per-component useSyncExternalStore in favour of putting
//     ThemeState directly into ThemeStateContext caused every consumer to
//     re-render on any theme update, killing toggle perf.)
//
// Same shape for media: components that don't touch a $-prefixed media key
// must not re-render when the media state changes.
process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  Theme,
  createTamagui,
  setMediaState,
  updateMediaListeners,
  useMedia,
  useTheme,
} from '@tamagui/core'
import { act, render } from '@testing-library/react'
import { memo, useState } from 'react'
import { describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

type Counter = { current: number }

// memo wraps so a parent JSX re-render alone doesn't bump count.
// Only context/subscription-driven re-renders should count.
const ThemeReader = memo(function ThemeReader({ counter }: { counter: Counter }) {
  counter.current += 1
  const theme = useTheme()
  // read .val so getThemeProxied tracks 'background' in keys.current
  const bg = theme?.background?.val
  return <span style={{ background: String(bg) }} />
})

const StaticReader = memo(function StaticReader({ counter }: { counter: Counter }) {
  counter.current += 1
  // no theme access — keys.current stays empty
  return <span style={{ background: 'red' }} />
})

const MediaReader = memo(function MediaReader({ counter }: { counter: Counter }) {
  counter.current += 1
  const media = useMedia()
  // touch the sm key to populate keys
  const isSm = media.sm
  return <span data-sm={String(isSm)} />
})

describe('theme/media over-render guard', () => {
  test('theme change re-renders theme readers; static readers stay put', () => {
    const themeReader = { current: 0 }
    const staticReader = { current: 0 }
    let setName: (n: 'light' | 'dark') => void = () => {}

    function ThemedSubtree() {
      const [name, setN] = useState<'light' | 'dark'>('light')
      setName = setN
      return (
        <Theme name={name}>
          <ThemeReader counter={themeReader} />
          <StaticReader counter={staticReader} />
        </Theme>
      )
    }

    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemedSubtree />
      </TamaguiProvider>
    )

    const themeBaseline = themeReader.current
    const staticBaseline = staticReader.current

    act(() => {
      setName('dark')
    })

    expect(themeReader.current).toBeGreaterThan(themeBaseline)
    // CRITICAL: static reader must NOT re-render on a theme change it doesn't depend on
    expect(staticReader.current).toBe(staticBaseline)
  })

  test('media change re-renders media readers; static readers stay put', () => {
    const mediaReader = { current: 0 }
    const staticReader = { current: 0 }

    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <MediaReader counter={mediaReader} />
        <StaticReader counter={staticReader} />
      </TamaguiProvider>
    )

    const mediaBaseline = mediaReader.current
    const staticBaseline = staticReader.current

    act(() => {
      // mediaState tracks boolean active flags per key (not the query config)
      setMediaState({ sm: true, md: false, lg: false, xl: false, xxl: false } as any)
      updateMediaListeners()
    })

    expect(mediaReader.current).toBeGreaterThan(mediaBaseline)
    // CRITICAL: static reader must NOT re-render on a media change it doesn't depend on
    expect(staticReader.current).toBe(staticBaseline)
  })
})

// always calls useTheme (rules of hooks), but only READS a token when asked.
// keys.current stays empty until readTheme flips true, so the subscription must
// be established lazily (the effect re-evaluates shouldSubscribeToTheme every render).
const ConditionalReader = memo(function ConditionalReader({
  counter,
  readTheme,
}: {
  counter: Counter
  readTheme: boolean
}) {
  counter.current += 1
  const theme = useTheme()
  const bg = readTheme ? theme?.background?.val : 'red'
  return <span style={{ background: String(bg) }} />
})

// re-renders whenever `tick` changes (parent-driven), exercising the
// effect cleanup→setup churn that the renderVersion final-unmount guard sits on.
const TickThemeReader = memo(function TickThemeReader({
  counter,
  tick,
}: {
  counter: Counter
  tick: number
}) {
  counter.current += 1
  const theme = useTheme()
  const bg = theme?.background?.val
  return <span data-tick={tick} style={{ background: String(bg) }} />
})

describe('theme subscription lifecycle', () => {
  // guards the lazy-subscribe path: a component that does not read theme tokens
  // must NOT subscribe, but once it begins reading them it MUST start updating.
  test('a component that begins reading theme mid-life starts subscribing', () => {
    const counter = { current: 0 }
    let setName: (n: 'light' | 'dark') => void = () => {}

    function App({ readTheme }: { readTheme: boolean }) {
      const [name, setN] = useState<'light' | 'dark'>('light')
      setName = setN
      return (
        <Theme name={name}>
          <ConditionalReader counter={counter} readTheme={readTheme} />
        </Theme>
      )
    }

    const { rerender } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <App readTheme={false} />
      </TamaguiProvider>
    )

    // not reading theme yet → a theme change must NOT re-render it
    const beforeRead = counter.current
    act(() => setName('dark'))
    expect(counter.current).toBe(beforeRead)

    // flip to reading theme: prop change re-renders once, populates keys,
    // effect subscribes
    act(() => {
      rerender(
        <TamaguiProvider config={conf} defaultTheme="light">
          <App readTheme={true} />
        </TamaguiProvider>
      )
    })

    const afterRead = counter.current
    // now a theme change MUST re-render it
    act(() => setName('light'))
    expect(counter.current).toBeGreaterThan(afterRead)
  })

  // guards the renderVersion final-unmount guard: parent-driven re-renders run
  // effect cleanup before each new effect; that cleanup must NOT tear down the
  // still-mounted subscription, so theme updates keep arriving after the churn.
  test('a theme reader survives parent re-render churn and still updates on theme change', () => {
    const counter = { current: 0 }
    let setName: (n: 'light' | 'dark') => void = () => {}
    let bump: () => void = () => {}

    function App() {
      const [name, setN] = useState<'light' | 'dark'>('light')
      const [tick, setTick] = useState(0)
      setName = setN
      bump = () => setTick((t) => t + 1)
      return (
        <Theme name={name}>
          <TickThemeReader counter={counter} tick={tick} />
        </Theme>
      )
    }

    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <App />
      </TamaguiProvider>
    )

    // churn: 3 parent-driven re-renders, each running the no-deps effect's
    // cleanup→setup. the subscription must persist across all of them.
    act(() => {
      bump()
      bump()
      bump()
    })

    const afterChurn = counter.current
    act(() => setName('dark'))
    // subscription survived the churn → theme change re-renders it
    expect(counter.current).toBeGreaterThan(afterChurn)
  })

  // guards final-unmount cleanup: unmounting one reader must run its cleanup
  // without disturbing a sibling's still-live subscription.
  test('unmounting a theme reader does not break a sibling subscription', () => {
    const a = { current: 0 }
    const b = { current: 0 }
    let setName: (n: 'light' | 'dark') => void = () => {}
    let setShowA: (v: boolean) => void = () => {}

    function App() {
      const [name, setN] = useState<'light' | 'dark'>('light')
      const [showA, setSA] = useState(true)
      setName = setN
      setShowA = setSA
      return (
        <Theme name={name}>
          {showA ? <ThemeReader counter={a} /> : null}
          <ThemeReader counter={b} />
        </Theme>
      )
    }

    render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <App />
      </TamaguiProvider>
    )

    // unmount A → its effect's final cleanup runs (renderVersion matches)
    act(() => setShowA(false))

    const bBeforeChange = b.current
    act(() => setName('dark'))
    // sibling B's subscription is untouched → it still updates
    expect(b.current).toBeGreaterThan(bBeforeChange)
  })
})

describe('first-render optimization mode', () => {
  test('keeps theme/media values reactive without granular key tracking', () => {
    const defaultConfig = getDefaultTamaguiConfig()
    const firstRenderConfig = createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        optimizeFor: 'first-render',
      },
    })
    const dormantThemeReader = { current: 0 }
    const dormantMediaReader = { current: 0 }
    let setName: (name: 'light' | 'dark') => void = () => {}

    const DormantThemeReader = memo(function DormantThemeReader() {
      dormantThemeReader.current += 1
      useTheme()
      return null
    })

    const DormantMediaReader = memo(function DormantMediaReader() {
      dormantMediaReader.current += 1
      useMedia()
      return null
    })

    function Reader() {
      const theme = useTheme()
      const media = useMedia()
      const background = theme.background.val
      const backgroundAlias = theme.$background

      return (
        <span
          data-testid="first-render-reader"
          data-background={String(background)}
          data-background-alias={String(backgroundAlias.val)}
          data-background-get={String(theme.background.get('web'))}
          data-sm={String(media.sm)}
          style={{ background: String(background) }}
        />
      )
    }

    function App() {
      const [name, setThemeName] = useState<'light' | 'dark'>('light')
      setName = setThemeName

      return (
        <Theme name={name}>
          <Reader />
          <DormantThemeReader />
          <DormantMediaReader />
        </Theme>
      )
    }

    setMediaState({ sm: false, md: false, lg: false, xl: false, xxl: false } as any)

    const { getByTestId } = render(
      <TamaguiProvider config={firstRenderConfig} defaultTheme="light">
        <App />
      </TamaguiProvider>
    )
    const reader = getByTestId('first-render-reader')
    const initialBackground = reader.style.background

    expect(reader.dataset.background).toBe('#fff')
    expect(reader.dataset.backgroundAlias).toBe('#fff')
    expect(reader.dataset.backgroundGet).toContain('var(--')
    expect(reader.dataset.sm).toBe('false')

    const dormantThemeBaseline = dormantThemeReader.current
    act(() => {
      setName('dark')
    })

    expect(reader.dataset.background).toBe('#000')
    expect(reader.style.background).not.toBe(initialBackground)
    expect(dormantThemeReader.current).toBeGreaterThan(dormantThemeBaseline)

    const dormantMediaBaseline = dormantMediaReader.current
    act(() => {
      setMediaState({ sm: true, md: false, lg: false, xl: false, xxl: false } as any)
      updateMediaListeners()
    })

    expect(reader.dataset.sm).toBe('true')
    expect(dormantMediaReader.current).toBeGreaterThan(dormantMediaBaseline)
  })
})
