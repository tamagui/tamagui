import { createRoot } from 'react-dom/client'
import { StaticTransition } from './transition-tree'

/**
 * Static component transitions without a component animation runtime.
 *
 * `transition="medium"` is a configured preset, so the compiler has to resolve
 * it against the config's CSS animations and emit the transition in CSS. The
 * toggle swaps between two literal widths, which lower to two class sets, so
 * the browser interpolates between them with no driver, no presence and no
 * per-component animation hook in the graph.
 */
createRoot(document.getElementById('root')!).render(<StaticTransition />)
