import { Suspense } from 'react'
import { TamaguiProvider, Text, View } from '@tamagui/core'

import config from './tamagui.config'

/**
 * The app behind the streaming SSR fixture.
 *
 * The shell carries a program, and a suspended boundary carries two more: one
 * the shell already used and one it has not. Because the boundary resolves
 * after a delay, the browser receives the shell first and the rest later, over
 * the same response — which is the thing being tested. The values are
 * distinctive so a test can tell them apart from anything else on the page.
 */

const SHELL_BACKGROUND = 'rgb(10, 20, 30) hover:rgb(40, 50, 60)'

let pending: Promise<void> | null = null
let ready = false

/** suspends once, long enough for a browser to paint the shell without it */
function useSlowChunk() {
  if (ready) return
  pending ??= new Promise<void>((resolve) => {
    setTimeout(() => {
      ready = true
      resolve()
    }, 600)
  })
  throw pending
}

function LateChunk() {
  useSlowChunk()
  return (
    <>
      <View
        data-testid="late-shared"
        width={40}
        height={40}
        backgroundColor={SHELL_BACKGROUND}
      />
      <Text data-testid="late-only" color="rgb(70, 80, 90) hover:rgb(100, 110, 120)">
        late
      </Text>
    </>
  )
}

export const StreamingRoot = () => (
  <TamaguiProvider config={config} defaultTheme="light">
    <View data-testid="shell" width={40} height={40} backgroundColor={SHELL_BACKGROUND} />
    <Suspense fallback={<View data-testid="fallback" width={40} height={40} />}>
      <LateChunk />
    </Suspense>
  </TamaguiProvider>
)
