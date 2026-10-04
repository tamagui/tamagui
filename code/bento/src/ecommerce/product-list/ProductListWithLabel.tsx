import { useEffect, useState } from 'react'
import { Anchor, H2, Image, SizableText, Square, View, XStack, YStack } from 'tamagui'
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
    <Link grow={1} shrink={1} flexBasis={300} href="#" textDecorationColor="transparent">
      <YStack gap="2" position="relative" render="article">
        {showLabel && (
          <Square
            theme={isBestSeller ? 'purple' : 'orange'}
            rotate="45deg"
            width={20}
            height={20}
            bg="color-5"
            l={-3}
            t={34}
            borderWidth={0.4}
            position="absolute"
            z={1}
          />
        )}
        <View z={2} rounded={10} overflow="hidden">
          <View
            style={{ transition: 'transform 150ms ease' }}
            transformOrigin="center center"
            scale="1.1 hover:1"
            width="100%"
            height={300}
          >
            <Image
              bg="gray"
              src={item.image}
              height="100%"
              width="100%"
              objectFit="cover"
            />
          </View>
        </View>
        {showLabel && (
          <YStack
            bg="color-8"
            borderWidth={0.5}
            rounded="2"
            position="absolute"
            l={-7}
            t={18}
            px="3"
            z={2}
            theme={isBestSeller ? 'purple' : 'orange'}
            boxShadow="0 5px 30px shadow-color"
          >
            <SizableText color="#fff">{labelText}</SizableText>
          </YStack>
        )}
        <YStack>
          <H2 size="4">{item.name}</H2>
          <XStack gap="3">
            <SizableText fontWeight="bold">${item.price}</SizableText>
            <SizableText theme="level2" textDecorationLine="line-through">
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
  <YStack key={index + 'sp'} flexBasis={300} grow={1} shrink={1} />
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
      rowGap="8"
      columnGap="5"
      paddingTop="3"
      paddingBottom="3"
      px="6 @max-sm/window:3"
      maxW="100%"
      maxH={700}
    >
      {products.map((item, index) => (
        <Item index={index} key={item.id} item={item} />
      ))}
      {someSpacers}
    </XStack>
  )
}

ProductListWithLabel.fileName = 'ProductListWithLabel'
