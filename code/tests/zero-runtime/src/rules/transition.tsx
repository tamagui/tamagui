import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'

/**
 * Static component transitions without a component animation runtime.
 *
 * `transition="medium"` is a configured preset, so the compiler has to resolve
 * it against the config's CSS animations and emit the transition in CSS. The
 * toggle swaps between two literal widths, which lower to two class sets, so
 * the browser interpolates between them with no driver, no presence and no
 * per-component animation hook in the graph.
 */
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
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<StaticTransition />)
