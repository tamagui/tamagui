import { createRoot } from 'react-dom/client'
import { View } from 'tamagui'
import { Alpha } from './multi/alpha'
import { Beta } from './multi/beta'
import { Delta } from './multi/delta'
import { Epsilon } from './multi/epsilon'
import { Gamma } from './multi/gamma'

// The multi-file fixture. Every violating site in every module is collected
// before the build fails, in one deterministic order.
function Multi() {
  return (
    <View data-testid="zero-root">
      <Alpha />
      <Beta />
      <Gamma />
      <Delta />
      <Epsilon />
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<Multi />)
