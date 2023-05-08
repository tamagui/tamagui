import { ButtonLink } from 'app/Link'
import { H4, Image, Paragraph, XStack, YStack } from 'tamagui'

export type MergeItemProps = {
  title: string
  price: string
  isAvailable: boolean
  url: string
  image: string
}

export const MerchItem = ({ title, price, isAvailable, url, image }: MergeItemProps) => {
  return (
    <YStack
      borderRadius="$8"
      borderWidth="$0.5"
      borderColor="$color5"
      fs={0}
      fg={0}
      fb={0}
      minWidth={340}
      p="$4"
      gap="$4"
    >
      <YStack fullscreen className="bg-grid" />

      <Image
      margin="$4"
        borderRadius="$8"
        resizeMode="contain"
        alignSelf="center"
        source={{
          width: 250,
          height: 250,
          uri: image,
        }}
      />
      <YStack>
        <H4>{title}</H4>
        {isAvailable ? (
          <Paragraph theme="alt2">Now available</Paragraph>
        ) : (
          <Paragraph theme="red_alt2">Out of stock</Paragraph>
        )}

        <XStack>
          <XStack flex={1} />
          <ButtonLink themeInverse href={url} borderRadius="$10">
            {price}
          </ButtonLink>
        </XStack>
      </YStack>
    </YStack>
  )
}
