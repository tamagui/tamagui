import { useEffect, useState } from 'react'
import {
  Anchor,
  Circle,
  H2,
  Image,
  Stack,
  Text,
  View,
  XStack,
  YStack,
  styled,
} from 'tamagui'
import { getProducts } from './data/products'

const Link = Anchor

type Product = ReturnType<typeof getProducts>[0]

const StyledText = styled(Text, {
  color: '$color',
  fontSize: '$4',
  lineHeight: '$4',
})

function Item({ item }: { item: Product }) {
  return (
    <Link
      flexGrow={1}
      flexShrink={1}
      flexBasis={300}
      href="#"
      textDecorationColor="transparent"
    >
      <YStack
        paddingBottom="$4"
        borderBottomWidth={1}
        borderColor="$color5"
        gap="$2"
        tag="article"
        role="article"
      >
        <Stack overflow="hidden" width="100%" height={300}>
          <Image
            source={{ uri: item.image }}
            height="100%"
            width="100%"
            resizeMode="cover"
          />
        </Stack>
        <YStack>
          <H2 size="$4">{item.name}</H2>
          <XStack gap="$3">
            <StyledText fontWeight="bold">${item.price}</StyledText>
            <StyledText
              color="#fff"
              theme="red"
              backgroundColor="$color9"
              paddingHorizontal="$2"
              paddingVertical="$1"
              marginLeft="auto"
            >
              {item.discount}%
            </StyledText>
          </XStack>
        </YStack>
        <YStack alignSelf="flex-start" theme="alt1" gap="$2">
          <StyledText>XS | L | XL</StyledText>
          <XStack gap="$1">
            <Circle backgroundColor="$green9" size={20} />
            <Circle backgroundColor="$red9" size={20} />
            <Circle backgroundColor="$orange9" size={20} />
            <Circle backgroundColor="$purple9" size={20} />
            <View
              borderRadius={1000_000_000}
              backgroundColor="$yellow9"
              width={20}
              height={20}
            />
          </XStack>
        </YStack>
      </YStack>
    </Link>
  )
}

// spacers are a method to avoid streteched items at the end
const someSpacers = Array.from({ length: 5 }).map((_c, index) => (
  <YStack key={index + 'sp'} flexBasis={300} flexGrow={1} flexShrink={1} />
))

/** ------ EXAMPLE ------ */
export function ProductListWithFeatures() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    setProducts(getProducts())
  }, [])
  return (
    <XStack
      maxWidth="100%"
      flexWrap="wrap"
      rowGap="$8"
      columnGap="$5"
      padding="$3"
      paddingHorizontal="$6"
      maxHeight={700}
      $group-window-xs={{
        paddingHorizontal: '$3',
      }}
    >
      {products.map((item, index) => (
        <Item key={item.id} item={item} />
      ))}
      {someSpacers}
    </XStack>
  )
}

ProductListWithFeatures.fileName = 'ProductListWithFeatures'
