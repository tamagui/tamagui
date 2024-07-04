import { Hero } from '@components/Hero'
import { getDefaultLayout } from '@lib/getDefaultLayout'
import { YStack } from 'tamagui'

import { ThemeTint } from '@tamagui/logo'
import { HeroTypography } from '../components/HeroTypography'
import { SectionTinted, TintSection } from '../components/TintSection'

export default function Home() {
  return (
    <>
      <ThemeTint>
        <YStack
          fullscreen
          className="grain"
          o={0.2}
          style={{
            mixBlendMode: 'hard-light',
            maskImage: `linear-gradient(transparent, rgba(0, 0, 0, 1) 100px)`,
          }}
          // o={0}
        />
        <TintSection index={0} p={0}>
          <Hero />
        </TintSection>
        <TintSection index={8} my="$-4" p={0} zIndex={100}>
          <SectionTinted zi={1000} bubble gradient>
            <HeroTypography />
          </SectionTinted>
        </TintSection>
      </ThemeTint>
    </>
  )
}

Home.getLayout = getDefaultLayout
