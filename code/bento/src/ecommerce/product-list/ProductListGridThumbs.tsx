import { useEffect, useState } from 'react'
import { Anchor, H2, Image, Text, View, XStack, styled } from 'tamagui'
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
    <Link
      grow={1}
      shrink={0}
      borderBottomWidth={1}
      borderRightWidth={1}
      borderColor="color-5"
      bg="background"
      height={250}
      flexBasis={150}
      p="4"
      textDecorationColor="transparent"
      href="#"
    >
      <View pb="2" gap="2" render="article">
        <View overflow="hidden" width="100%" height={100}>
          <Image src={item.image} height="100%" width="100%" objectFit="cover" />
        </View>
        <View>
          <H2 size="1">{item.name}</H2>
          <XStack gap="3">
            <StyledText fontSize="1" lineHeight="1" fontWeight="bold">
              ${item.price}
            </StyledText>
          </XStack>
        </View>
      </View>
    </Link>
  )
}

// spacers are a method to avoid streteched items at the end
const someSpacers = Array.from({ length: 5 }).map((_c, index) => (
  <View key={index + 'sp'} flexBasis={300} grow={1} shrink={1} />
))
/**
 *  Note: if you have a lot of items, you can use a FlatList instead, Flatlist are more performant
 *        we also have a FlatGrid component that uses FlatList check that
 *
 */

/** ------ EXAMPLE ------ */
export function ProductListGridThumbs() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    setProducts(getProducts())
  }, [])
  return (
    <XStack maxW="100%" bg="color-1" flexWrap="wrap">
      {products.map((item) => (
        <Item key={item.id} item={item} />
      ))}
      {someSpacers}
    </XStack>
  )
}

ProductListGridThumbs.fileName = 'ProductListGridThumbs'
