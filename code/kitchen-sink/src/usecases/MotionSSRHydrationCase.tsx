import { useEffect, useRef, useState } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { TamaguiProvider, View } from 'tamagui'

import config from '../tamagui.config'

// regression case for SSR hydration with inline-output animation drivers
// (motion). we reproduce real hydration in-page: renderToString the subtree,
// inject it as static HTML, then hydrateRoot over it. useSyncExternalStore
// returns the server snapshot during the hydration render, so the class ->
// inline handoff runs exactly like a server-rendered page. we sample computed
// styles every frame from before hydration until well after.
//
// two elements cover the two SSR contracts:
//
// 1. steady pill (transition, no enterStyle): SSR paints the resting values;
//    the driver must adopt them at hydration. the bug: on the render where
//    useDidFinishSSR flips, the core strips the SSR atomic classes (noClass)
//    and the driver animated the "new" styles from the stripped (zeroed)
//    computed values — the element visibly collapsed and re-grew after load.
//
// 2. enter pill (transition + enterStyle): SSR paints the enterStyle values
//    (opacity 0), and hydration must animate it to resting — not snap, and
//    not lose its other styles along the way.
export function MotionSSRHydrationCase() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState('running')

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const tree = (
      <TamaguiProvider config={config} defaultTheme="light" disableInjectCSS>
        <View
          data-testid="ssr-pill"
          transition="quick"
          width={120}
          height={40}
          borderRadius={1000}
          backgroundColor="rgb(255, 0, 0)"
          opacity={1}
        />
        <View
          data-testid="ssr-enter-pill"
          transition="500ms"
          enterStyle={{ opacity: 0 }}
          width={120}
          height={40}
          borderRadius={1000}
          backgroundColor="rgb(0, 128, 0)"
          opacity={1}
        />
      </TamaguiProvider>
    )

    host.innerHTML = renderToString(tree)
    const pill = host.querySelector('[data-testid="ssr-pill"]') as HTMLElement | null
    const enterPill = host.querySelector(
      '[data-testid="ssr-enter-pill"]'
    ) as HTMLElement | null
    if (!pill || !enterPill) {
      setResult('SSR-RENDER-MISSING-PILL')
      return
    }

    const errors: string[] = []
    const enterOpacities: number[] = []
    let frames = 0
    let rafId = 0
    const sample = () => {
      frames++
      const cs = getComputedStyle(pill)
      if (
        cs.borderTopLeftRadius !== '1000px' ||
        cs.backgroundColor !== 'rgb(255, 0, 0)' ||
        cs.opacity !== '1'
      ) {
        errors.push(
          `steady:${cs.borderTopLeftRadius}|${cs.backgroundColor}|${cs.opacity}`
        )
      }
      const ecs = getComputedStyle(enterPill)
      if (
        ecs.borderTopLeftRadius !== '1000px' ||
        ecs.backgroundColor !== 'rgb(0, 128, 0)'
      ) {
        errors.push(`enter:${ecs.borderTopLeftRadius}|${ecs.backgroundColor}`)
      }
      enterOpacities.push(Number(ecs.opacity))
      rafId = requestAnimationFrame(sample)
    }
    sample()

    // SSR baseline: steady pill fully painted, enter pill at its enterStyle
    if (errors.length || enterOpacities[0] !== 0) {
      cancelAnimationFrame(rafId)
      setResult(`SSR-BASELINE-BAD:${errors[0] ?? `enter-opacity=${enterOpacities[0]}`}`)
      return
    }

    let root: Root | null = hydrateRoot(host, tree)
    const timeout = setTimeout(() => {
      cancelAnimationFrame(rafId)
      const finalOpacity = enterOpacities[enterOpacities.length - 1]
      const sawIntermediate = enterOpacities.some((o) => o > 0.05 && o < 0.95)
      if (finalOpacity !== 1) {
        errors.push(`enter-final-opacity:${finalOpacity}`)
      }
      if (!sawIntermediate) {
        errors.push('enter-never-animated (snapped 0 -> 1)')
      }
      setResult(
        errors.length
          ? `BAD:${errors[0]} (${errors.length} errors, ${frames} frames)`
          : `CLEAN (${frames} frames)`
      )
    }, 1500)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId)
      root?.unmount()
      root = null
    }
  }, [])

  return (
    <>
      <div ref={hostRef} />
      <div data-testid="hydration-result">{result}</div>
    </>
  )
}
