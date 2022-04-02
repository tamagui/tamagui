import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { Square, YStack } from 'tamagui'

export default function ResponsiveDemo() {
  return (
    <>
      <TitleAndMetaTags title="Tamagui — Responsive Demo" />
      <YStack>
        <YStack space="$6">
          <Square bc="red" size={100} />
        </YStack>
      </YStack>
    </>
  )
}
