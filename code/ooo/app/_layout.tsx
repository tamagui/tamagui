import './app.css'
import './fonts.css'
import './syntax-highlight.css'
import './tamagui.css'

import { MetaTheme, SchemeProvider, useColorScheme } from '@vxrn/color-scheme'
import { useEffect } from 'react'
import { TamaguiProvider, Theme, useTheme } from 'tamagui'
import { LoadProgressBar, Slot, usePathname } from 'one'
import config from '~/config/tamagui.config'
import { useIsScrolled } from '~/features/site/useIsScrolled'
import { LayoutDecorativeStripe } from '~/features/site/LayoutDecorativeStripe'
import { headerColors } from '~/features/site/headerColors'

export default function Layout() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta property="og:image" content={`${process.env.ONE_SERVER_URL}/og.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content={`${process.env.ONE_SERVER_URL}/og.jpg`} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <link rel="icon" href="/favicon.svg" />

      <LoadProgressBar startDelay={1_000} />

      <SchemeProvider>
        <ThemeProvider>
          <LayoutDecorativeStripe />
          <Theme name="yellow">
            <ThemeMetaTag />
            <Slot />
          </Theme>
        </ThemeProvider>
      </SchemeProvider>
    </>
  )
}

const ThemeProvider = ({ children }) => {
  const [scheme] = useColorScheme()

  return (
    <>
      <TamaguiProvider disableInjectCSS config={config} defaultTheme={scheme}>
        {children}
      </TamaguiProvider>
    </>
  )
}

const ThemeMetaTag = () => {
  const [scheme] = useColorScheme()
  const theme = useTheme()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isScrolled = useIsScrolled()
  let color = headerColors[scheme]
  if (isHome && isScrolled) {
    color = theme.color1.val
  }

  useEffect(() => {
    document.body.style.background = color
  }, [color])

  return <MetaTheme color={color} darkColor={headerColors.dark} lightColor={headerColors.light} />
}
