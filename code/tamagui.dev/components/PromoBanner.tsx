import { Paragraph, XStack } from 'tamagui'

const bannerEnabled = false

export const bannerHeight = bannerEnabled ? 35 : 0

export const PromoBanner = () => {
  if (!bannerEnabled) {
    return null
  }

  return (
    <XStack bg="$color1" width="100%" py="$1.5" items="center" justify="center">
      <Paragraph size="$3">Black Friday: Takeout and Bento each $50 off.</Paragraph>
    </XStack>
  )
}
