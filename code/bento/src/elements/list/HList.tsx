import { Image, ScrollView, Text, View } from 'tamagui'
import { tone } from '../../tone'

const cities = [
  { image: 'HLIST_1.jpg', title: 'Jakarta', places: 128 },
  { image: 'HLIST_2.jpg', title: 'Bandung', places: 74 },
  { image: 'HLIST_3.jpg', title: 'Saigon', places: 96 },
  { image: 'HLIST_4.jpg', title: 'Tokyo', places: 212 },
  { image: 'HLIST_5.jpg', title: 'Semarang', places: 41 },
  { image: 'HLIST_6.jpg', title: 'Malang', places: 38 },
]

/** ------ EXAMPLE ------ */
export function HList() {
  return (
    <ScrollView
      horizontal
      width="100%"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 24, gap: 16 }}
    >
      {cities.map((city) => (
        <CityCard key={city.title} {...city} />
      ))}
    </ScrollView>
  )
}

function CityCard({ image, title, places }: (typeof cities)[number]) {
  return (
    <View
      tabIndex={0}
      width={200}
      height={260}
      rounded="6"
      overflow="hidden"
      position="relative"
      bg={tone.fill}
      cursor="pointer"
      y="0 hover:-4px"
      boxShadow="(0 1px 3px shadow-color) hover:(0 12px 24px shadow-color)"
      transition="200ms"
    >
      <Image
        src={`/bento/images/hlist/${image}`}
        width="100%"
        height="100%"
        objectFit="cover"
        alt=""
      />
      <View
        position="absolute"
        inset={0}
        justify="flex-end"
        p="4"
        gap="0.5"
        bg="linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 55%)"
      >
        <Text fontFamily="body" fontSize="lg" fontWeight="600" color="white">
          {title}
        </Text>
        <Text fontFamily="body" fontSize="xs" color="rgba(255,255,255,0.8)">
          {places} places
        </Text>
      </View>
    </View>
  )
}
