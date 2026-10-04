import { useEffect, useState } from 'react'
import { Anchor, H2, Image, Text, View, XStack, YStack, styled } from 'tamagui'
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
    // Note: you can also use `Link` from solito/link
    <Link grow={1} flexBasis={300} href="#" textDecorationColor="transparent">
      <YStack pb="2" borderWidth={1} borderColor="color-5" gap="2" render="article">
        <View overflow="hidden" width="100%" height={300}>
          <Image src={item.image} height="100%" width="100%" objectFit="cover" />
        </View>
        <YStack>
          <H2 size="4">{item.name}</H2>
          <XStack gap="3">
            <StyledText fontWeight="bold">${item.price}</StyledText>
            <StyledText theme="level2" textDecorationLine="line-through">
              ${item.price}
            </StyledText>
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
/**
 *  Note: if you have a lot of items, you can use a FlatList instead, Flatlist are more performant
 *        we also have a FlatGrid component that uses FlatList check that
 *
 */

/** ------ EXAMPLE ------ */
export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    setProducts(getProducts())
  }, [])
  return (
    <XStack
      maxW="100%"
      flexWrap="wrap"
      rowGap="8"
      columnGap="3"
      paddingTop="3"
      paddingBottom="3"
      px="6 @xs/window:3"
      maxH={900}
    >
      {products.map((item) => (
        <Item key={item.id} item={item} />
      ))}
      {someSpacers}
    </XStack>
  )
}

ProductList.fileName = 'ProductList'
