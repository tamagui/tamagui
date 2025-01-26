import { useEffect, useState } from 'react'
import { Anchor, H2, Image, SizableText, Square, Stack, XStack, YStack } from 'tamagui'
import { getProducts } from './data/products'

const Link = Anchor

type Product = ReturnType<typeof getProducts>[0]

const premiums = [3, 6, 12, 15, 20, 25]
const bestSellers = [1, 5, 10, 13, 18, 23]

function Item({ item, index }: { item: Product; index: number }) {
  const isPremium = premiums.includes(index)
  const isBestSeller = bestSellers.includes(index)
  const showLabel = isPremium || isBestSeller
  const labelText = isPremium ? 'Premium' : isBestSeller ? 'Best Seller' : ''
  return (
    <Link
      flexGrow={1}
      flexShrink={1}
      flexBasis={300}
      href="#"
      textDecorationColor="transparent"
    >
      <YStack gap="$2" tag="article" role="article">
        {showLabel && (
          <Square
            theme={isBestSeller ? 'purple' : 'orange'}
            rotate="45deg"
            width={20}
            height={20}
            backgroundColor="$color5"
            left={-3}
            top={34}
            borderWidth={0.4}
            position="absolute"
            zIndex={1}
          />
        )}
        <Stack zIndex={2} borderRadius={10} overflow="hidden">
          <Stack
            animation="quick"
            transformOrigin="center center"
            hoverStyle={{
              scale: 1,
            }}
            scale={1.1}
            width="100%"
            height={300}
          >
            <Image
              backgroundColor="gray"
              source={{ uri: item.image }}
              height="100%"
              width="100%"
              resizeMode="cover"
            />
          </Stack>
        </Stack>
        {showLabel && (
          <YStack
            backgroundColor="$color9"
            borderWidth={0.5}
            theme={isBestSeller ? 'purple' : 'orange'}
            borderTopRightRadius={10}
            borderBottomRightRadius={10}
            position="absolute"
            left={-7}
            top={18}
            paddingHorizontal="$3"
            zIndex={2}
            elevation={10}
          >
            <SizableText color="#fff">{labelText}</SizableText>
          </YStack>
        )}
        <YStack>
          <H2 size="$4">{item.name}</H2>
          <XStack gap="$3">
            <SizableText fontWeight="bold">${item.price}</SizableText>
            <SizableText theme="alt1" textDecorationLine="line-through">
              ${item.price}
            </SizableText>
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
export function ProductListWithLabel() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    setProducts(getProducts())
  }, [])
  return (
    <XStack
      flexWrap="wrap"
      rowGap="$8"
      columnGap="$5"
      padding="$3"
      paddingHorizontal="$6"
      maxWidth="100%"
      maxHeight={700}
      $group-window-xs={{
        paddingHorizontal: '$3',
      }}
    >
      {products.map((item, index) => (
        <Item index={index} key={item.id} item={item} />
      ))}
      {someSpacers}
    </XStack>
  )
}

ProductListWithLabel.fileName = 'ProductListWithLabel'
