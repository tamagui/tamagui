import { LinearGradient } from '@tamagui/linear-gradient'
import { useEffect, useState } from 'react'
import {
  Anchor,
  Button,
  H2,
  Image,
  ScrollView,
  Stack,
  Text,
  View,
  XStack,
  styled,
} from 'tamagui'
import { getProducts } from './data/products'

const Link = Anchor

const StyledText = styled(Text, {
  color: '$color',
  fontSize: '$4',
  lineHeight: '$4',
})

type Product = ReturnType<typeof getProducts>[0]

function Item({ item }: { item: Product }) {
  return (
    // Note: you can also use `Link` from solito/link
    <Link overflow="hidden" width={300} href="#" textDecorationColor="transparent">
      <View gap="$4">
        <View
          height={300}
          overflow="hidden"
          borderRadius={5}
          theme="dark"
          paddingBottom="$2"
          borderColor="$color5"
          gap="$2"
          tag="article"
          role="article"
        >
          <Stack overflow="hidden" width="100%" height="100%">
            <Image
              source={{ uri: item.image }}
              height="100%"
              width="100%"
              resizeMode="cover"
            />
          </Stack>
          <View
            gap="$2"
            width="100%"
            padding="$4"
            zIndex={1}
            theme="dark"
            bottom={0}
            position="absolute"
          >
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
                {10} %
              </StyledText>
            </XStack>
          </View>
          <LinearGradient
            position="absolute"
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            left={0}
            right={0}
            top={0}
            bottom={0}
          />
        </View>
        <Button borderRadius={0} themeInverse>
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
        padding: 28,
      }}
    >
      {products.map((item, index) => (
        <Item key={item.id} item={item} />
      ))}
    </ScrollView>
  )
}

ProductListBestItems.fileName = 'ProductListBestItems'
