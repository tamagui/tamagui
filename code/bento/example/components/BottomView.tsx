import { Image, Text, type ThemeName, XStack, YStack } from 'tamagui'
import { insets } from '../constant'

type BottomViewProps = {
  title: string
}

const SIZE = 20
const SPACE = 4

export function BottomView({ title }: BottomViewProps) {
  return (
    <YStack pos="absolute" p="$4" pb={insets.paddingBottom} bottom={0} left={0} right={0}>
      <YStack jc="center" ai="center" gap="$3">
        <Text fontWeight="bold" textTransform="uppercase" fontFamily="$silkscreen">
          {title} BY
        </Text>

        <XStack alignSelf="center">
          <XStack
            gap={SPACE}
            data-tauri-drag-region
            position="relative"
            jc="center"
            ai="center"
            mx={SPACE}
          >
            {logoWords.map((image, index) => (
              <ImageWord key={`path-${index}`} image={image} index={index} />
            ))}
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  )
}

const ImageWord = ({ image, index }: { image: string; index: number }) => {
  return <Image objectFit="contain" src={image} width={SIZE} height={SIZE} />
}

const logoWords = [
  require('../assets/T.png'),
  require('../assets/A.png'),
  require('../assets/M.png'),
  require('../assets/A1.png'),
  require('../assets/G.png'),
  require('../assets/U.png'),
  require('../assets/I.png'),
]
