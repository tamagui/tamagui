import { useState } from 'react'
import { styled, View } from 'tamagui'

/**
 * The authored tree behind the transition receipts.
 *
 * It lives in its own module because the zero transition receipt and both
 * differential routes render it. `differential.tsx` compiles it and
 * `differential.runtime.tsx` mounts the same component with extraction off, so
 * the browser comparison receives the identical authored tree.
 *
 * Three boxes, one variable: where the transition is written. A preset in a
 * `styled()` definition used to flatten with the prop dropped, so the element
 * shipped with no transition and no diagnostic. Each box uses a different
 * preset, so the duration the browser reports names which of the three places
 * was lowered rather than just that one of them was.
 */
const DefinitionBox = styled(View, {
  transition: 'lazy',
  backgroundColor: '#1d4ed8',
  height: 20,
})

const PlainBox = styled(View, {
  backgroundColor: '#1d4ed8',
  height: 20,
})

export function StaticTransition() {
  const [wide, setWide] = useState(false)

  return (
    <View data-testid="zero-root" padding={24}>
      <button data-testid="transition-toggle" onClick={() => setWide((on) => !on)}>
        toggle
      </button>
      <View
        data-testid="transition-box"
        transition="medium"
        backgroundColor="#1d4ed8"
        height={20}
        width={wide ? 200 : 50}
      />
      <DefinitionBox data-testid="definition-box" width={wide ? 200 : 50} />
      <PlainBox data-testid="call-site-box" transition="quick" width={wide ? 200 : 50} />
    </View>
  )
}
