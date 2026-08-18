import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { styled, View } from 'tamagui'

/**
 * Static component transitions without a component animation runtime.
 *
 * `transition="medium"` is a configured preset, so the compiler has to resolve
 * it against the config's CSS animations and emit the transition in CSS. The
 * toggle swaps between two literal widths, which lower to two class sets, so
 * the browser interpolates between them with no driver, no presence and no
 * per-component animation hook in the graph.
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

function StaticTransition() {
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

createRoot(document.getElementById('root')!).render(<StaticTransition />)
