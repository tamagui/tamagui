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
