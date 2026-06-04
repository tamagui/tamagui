import { YStack } from 'tamagui'
import { HeadInfo } from '~/components/HeadInfo'
import { Footer } from '~/features/site/Footer'
import { ThemeNameEffect } from '~/features/site/theme/ThemeNameEffect'
import { TailwindComparison } from '~/features/tailwind/TailwindComparison'
import { TailwindConformance } from '~/features/tailwind/TailwindConformance'
import { TailwindExamples } from '~/features/tailwind/TailwindExamples'
import { TailwindHero } from '~/features/tailwind/TailwindHero'

export default function TailwindPage() {
  return (
    <YStack maxW="100%" overflow="hidden">
      <HeadInfo
        title="Tailwind for Native and Web | Tamagui"
        description="Write Tailwind utility classes in Tamagui and render them on iOS and web, pixel-matched to Tailwind v4. Measured at 94% web, 97% iOS conformance."
        openGraph={{ url: '/tailwind' }}
      />
      <ThemeNameEffect colorKey="$color1" />

      <TailwindHero />
      <TailwindConformance />
      <TailwindExamples />
      <TailwindComparison />

      <Footer />
    </YStack>
  )
}
