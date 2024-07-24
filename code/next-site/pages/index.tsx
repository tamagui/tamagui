import { ThemeTint } from '@tamagui/logo'
import { HeroTypography } from '../components/HeroTypography'
import { SectionTinted, TintSection } from '../components/TintSection'

export default function Home() {
  return (
    <>
      <ThemeTint>
        <TintSection index={8} my="$-4" p={0} zIndex={100}>
          <SectionTinted zi={1000} bubble gradient>
            <HeroTypography />
          </SectionTinted>
        </TintSection>
      </ThemeTint>
    </>
  )
}
