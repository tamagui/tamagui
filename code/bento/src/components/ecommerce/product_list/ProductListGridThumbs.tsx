import { useEffect, useState } from 'react'
import { Anchor, H2, Image, Stack, Text, XStack, View, styled } from 'tamagui'
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
    // Note: you can also use `Link` from solito/link
    <Link
      flexGrow={1}
      flexShrink={0}
      borderBottomWidth={1}
      borderRightWidth={1}
      borderColor="$color5"
      backgroundColor="$background"
      height={250}
      flexBasis={150}
      padding={'$4'}
      href="#"
      textDecorationColor="transparent"
    >
      <View paddingBottom="$2" gap="$2" tag="article" role="article">
        <Stack overflow="hidden" width="100%" height={100}>
          <Image
            source={{ uri: item.image }}
            height="100%"
            width="100%"
            resizeMode="cover"
          />
        </Stack>
        <View>
          <H2 size="$1">{item.name}</H2>
          <XStack gap="$3">
            <StyledText fontSize="$1" lineHeight="$1" fontWeight="bold">
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
  <View key={index + 'sp'} flexBasis={300} flexGrow={1} flexShrink={1} />
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
    <XStack maxWidth="100%" backgroundColor="$color1" flexWrap="wrap">
      {products.map((item, index) => (
        <Item key={item.id} item={item} />
      ))}
      {someSpacers}
    </XStack>
  )
}

ProductListGridThumbs.fileName = 'ProductListGridThumbs'
