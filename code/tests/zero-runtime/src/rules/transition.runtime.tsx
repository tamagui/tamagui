import { createRoot } from 'react-dom/client'
import { TamaguiProvider } from 'tamagui'
import config from '../../tamagui.config'
import { StaticTransition } from './transition-tree'

/**
 * The runtime half of the differential oracle: the same authored tree as
 * `transition.tsx`, built with the compiler off, so every style decision is
 * made by the ordinary runtime instead of at build time. A runtime tier needs
 * the config at runtime, which is the one deliberate difference between the two
 * entries; the tree itself is imported, not copied.
 */
createRoot(document.getElementById('root')!).render(
  <TamaguiProvider config={config} defaultTheme="light">
    <StaticTransition />
  </TamaguiProvider>
)
