import { LinearGradient } from '@tamagui/linear-gradient'
import { useEffect, useState } from 'react'
import {
  Anchor,
  Button,
  H2,
  Image,
  ScrollView,
  Text,
  View,
  XStack,
  styled,
} from 'tamagui'
import { getProducts } from './data/products'

const Link = Anchor

const StyledText = styled(Text, {
  color: 'color',
  fontSize: '4',
  lineHeight: '4',
})

type Product = ReturnType<typeof getProducts>[0]

function Item({ item }: { item: Product }) {
  return (
    // Note: you can also use `Link` from solito/link
    <Link overflow="hidden" width={300} href="#" textDecorationColor="transparent">
      <View gap="4">
        <View
          height={300}
          overflow="hidden"
          rounded={5}
          pb="2"
          borderColor="color-5"
          gap="2"
          position="relative"
          theme="dark"
          render="article"
        >
          <View overflow="hidden" width="100%" height="100%">
            <Image src={item.image} height="100%" width="100%" objectFit="cover" />
          </View>
          <View gap="2" width="100%" p="4" z={1} b={0} position="absolute" theme="dark">
            <H2 size="4">{item.name}</H2>
            <XStack gap="3">
              <StyledText fontWeight="bold">${item.price}</StyledText>
              <StyledText color="#fff" bg="color-8" px="2" py="1" ml="auto" theme="red">
                {10} %
              </StyledText>
            </XStack>
          </View>
          <LinearGradient
            position="absolute"
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            l={0}
            r={0}
            t={0}
            b={0}
          />
        </View>

        <Button theme="accent" rounded={0}>
          <Button.Text>ORDER NOW</Button.Text>
        </Button>
      </View>
    </Link>
  )
}

/** ------ EXAMPLE ------ */
export function ProductListBestItems() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    setProducts(getProducts())
  }, [])
  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        gap: 24,
        px: 28,
      }}
    >
      {products.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </ScrollView>
  )
}

ProductListBestItems.fileName = 'ProductListBestItems'
