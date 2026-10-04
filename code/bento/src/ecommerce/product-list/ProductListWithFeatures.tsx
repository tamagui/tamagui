import { useEffect, useState } from 'react'
import { Anchor, Circle, H2, Image, Text, View, XStack, YStack, styled } from 'tamagui'
import { getProducts } from './data/products'

const Link = Anchor

type Product = ReturnType<typeof getProducts>[0]

const StyledText = styled(Text, {
  color: 'color',
  fontSize: '4',
  lineHeight: '4',
})

function Item({ item }: { item: Product }) {
  return (
    <Link grow={1} shrink={1} flexBasis={300} href="#" textDecorationColor="transparent">
      <YStack pb="4" borderBottomWidth={1} borderColor="color-5" gap="2" render="article">
        <View overflow="hidden" width="100%" height={300}>
          <Image src={item.image} height="100%" width="100%" objectFit="cover" />
        </View>
        <YStack>
          <H2 size="4">{item.name}</H2>
          <XStack gap="3">
            <StyledText fontWeight="bold">${item.price}</StyledText>
            <StyledText color="#fff" bg="color-8" px="2" py="1" ml="auto" theme="red">
              {item.discount}%
            </StyledText>
          </XStack>
        </YStack>
        <YStack self="flex-start" gap="2" theme="level2">
          <StyledText>XS | L | XL</StyledText>
          <XStack gap="1">
            <Circle bg="green-9" size={20} />
            <Circle bg="red-9" size={20} />
            <Circle bg="yellow-9" size={20} />
            <Circle bg="violet" size={20} />
            <View rounded={1000_000_000} bg="yellow-9" width={20} height={20} />
          </XStack>
        </YStack>
      </YStack>
    </Link>
  )
}

// spacers are a method to avoid streteched items at the end
const someSpacers = Array.from({ length: 5 }).map((_c, index) => (
  <YStack key={index + 'sp'} flexBasis={300} grow={1} shrink={1} />
))

/** ------ EXAMPLE ------ */
export function ProductListWithFeatures() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    setProducts(getProducts())
  }, [])
  return (
    <XStack
      maxW="100%"
      flexWrap="wrap"
      rowGap="8"
      columnGap="5"
      paddingTop="3"
      paddingBottom="3"
      px="6 @max-sm/window:3"
      maxH={700}
    >
      {products.map((item) => (
        <Item key={item.id} item={item} />
      ))}
      {someSpacers}
    </XStack>
  )
}

ProductListWithFeatures.fileName = 'ProductListWithFeatures'
