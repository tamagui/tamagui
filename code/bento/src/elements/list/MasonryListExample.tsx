import type { FC, ReactElement } from 'react'
import { useMemo } from 'react'
import { Button, Image, Text, View, type ThemeName } from 'tamagui'

import { Hash, MapPin, ShoppingBag } from '../../icons'
import { useContainerDim } from '../../hooks/useContainerDim'
import { Chip } from '../chips/components/chipsParts'
import { MasonryList } from './components/MasonryList'
import type { Product } from './data/products'
import { useData } from './data/products'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']

const ProductItem: FC<{ item: Product }> = ({ item }) => {
  const heightFactor = useMemo(() => Math.random() < 0.5, [])

  return (
    <View flexDirection="column" mb="6" flex={1} gap="2-5" key={item.id}>
      <View
        flexDirection="column"
        position="relative"
        rounded="8"
        boxShadow="0 0 5px shadow-color"
        overflow="hidden"
        cursor="pointer"
        style={{ transition: 'transform 150ms ease' }}
      >
        <Image
          src={item.image}
          height={heightFactor ? 200 : 350}
          objectFit="cover"
          bg="background-press"
        />
        <View
          flex={1}
          height="100%"
          items="center"
          justify="center"
          position="absolute"
          rounded="8"
          backdropFilter="hover:blur(15px) press:blur(15px)"
          bg="hover:background04 press:background04"
          style={{
            transition: 'background-color 250ms ease, backdrop-filter 250ms ease',
          }}
        >
          <Text
            flex={1}
            color="color-11"
            opacity="0 hover:1 press:1"
            p="4"
            style={{ transition: 'opacity 250ms ease' }}
          >
            {item.desc}
          </Text>
        </View>
      </View>

      <View flexDirection="column" gap="2">
        <Text color="color-11" fontSize="4 lg:8" fontWeight="600" lineHeight="lg:6">
          {item.name}
        </Text>

        <View flexDirection="row" items="center" justify="space-between" gap="2">
          <View flex={1} flexDirection="row" items="center" gap="2" theme="level2">
            <MapPin size="1" color="color-9" />
            <Text numberOfLines={2} color="color-9" fontSize="3">
              {item.city}
            </Text>
          </View>
          <Text color="color-10" fontSize="lg:6" fontWeight="lg:600" theme="green">
            ${Math.floor(Number(item.price) / 10)}
          </Text>
        </View>

        <View
          flexDirection="row"
          flexWrap="wrap"
          items="center"
          justify="space-between"
          gap="2"
        >
          <Chip
            circular
            width="auto"
            maxW="50%"
            bg="color-4"
            size="2"
            theme={`${colors[Math.floor(Math.random() * colors.length)]}` as ThemeName}
          >
            <Chip.Icon color="color-8">
              <Hash />
            </Chip.Icon>
            <Chip.Text numberOfLines={1} color="color-8">
              {item.category}
            </Chip.Text>
          </Chip>

          <Button theme="accent" size="xl" icon={ShoppingBag}>
            Add
          </Button>
        </View>
      </View>
    </View>
  )
}

export const MasonryListExample = () => {
  const { data } = useData()
  const { width: deviceWidth } = useContainerDim('window')
  const numberOfColumns = Math.max(Math.round(deviceWidth / 300), 2)

  const renderItem = ({
    item,
  }: {
    item: (typeof data)[0]
    i: number
  }): ReactElement => {
    return <ProductItem item={item} />
  }

  return (
    <View flex={1} maxH="lg:800px">
      <MasonryList
        flex={1}
        keyExtractor={(item): string => item.id}
        ListHeaderComponent={<View />}
        p="lg:4"
        gap="4"
        key={numberOfColumns}
        numColumns={numberOfColumns}
        data={data}
        //@ts-ignore
        renderItem={renderItem}
      />
    </View>
  )
}

MasonryListExample.fileName = 'MasonryListExample'
