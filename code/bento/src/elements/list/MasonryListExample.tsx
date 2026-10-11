import { Button, Image, Text, View } from 'tamagui'
import { useContainerDim } from '../../hooks/useContainerDim'
import { MapPin, ShoppingBag } from '../../icons'
import { MasonryList } from './components/MasonryList'
import { type Product, products } from './data/products'

/** ------ EXAMPLE ------ */
export function MasonryListExample() {
  const { width } = useContainerDim('window')
  // about one column per 240px, never fewer than two
  const columns = Math.max(Math.floor(width / 240), 2)

  return (
    <View height={640} width="100%">
      <MasonryList
        key={columns}
        numColumns={columns}
        data={products}
        keyExtractor={(item: Product) => item.id}
        renderItem={({ item }: { item: Product }) => <ProductCard item={item} />}
        refreshControl={false}
        contentContainerStyle={{ padding: 16 }}
        gap="4"
      />
    </View>
  )
}

function ProductCard({ item }: { item: Product }) {
  return (
    <View gap="2" mb="5">
      <View
        position="relative"
        rounded="4"
        overflow="hidden"
        bg="color-3"
        height={item.tall ? 300 : 200}
      >
        <Image src={item.image} width="100%" height="100%" objectFit="cover" />
        <Button
          position="absolute"
          b="2"
          r="2"
          size="sm"
          circular
          aria-label={`Add ${item.name} to bag`}
          icon={ShoppingBag}
        />
      </View>
      <View flexDirection="row" justify="space-between" gap="2">
        <View flex={1} gap="0.5">
          <Text
            fontFamily="body"
            fontSize="sm"
            fontWeight="600"
            color="color-12"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View flexDirection="row" items="center" gap="1">
            <MapPin size={12} color="color-10" />
            <Text fontFamily="body" fontSize="xs" color="color-10">
              {item.city}
            </Text>
          </View>
        </View>
        <Text fontFamily="body" fontSize="sm" fontWeight="600" color="color-12">
          ${item.price}
        </Text>
      </View>
    </View>
  )
}
