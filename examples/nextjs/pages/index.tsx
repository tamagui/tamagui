import dynamic from 'next/dynamic'
import { ThemeProvider, configureThemes } from 'snackui'

import themes from '../theme/exampleThemes'

configureThemes(themes)

// running into a bug with ssr + themes, disabling ssr for now...
// TODO: nextjs requires custom plugin for their styles
// TODO: fix themes + ssr

const NonSSRForNow = dynamic(() => import('../components/NonSSRForNow'), {
  ssr: false,
})

function Home() {
  return (
    <ThemeProvider themes={themes} defaultTheme="light">
      <NonSSRForNow />
    </ThemeProvider>
  )
}

export default Home
