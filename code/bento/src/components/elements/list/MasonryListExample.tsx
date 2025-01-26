import type { FC, ReactElement } from 'react'
import { Image, View, Text, Button, type ThemeName } from 'tamagui'
import { useMemo } from 'react'

import { MasonryList } from './components/MasonryList'
import type { Product } from './data/products'
import { useData } from './data/products'
import { useContainerDim } from '../../hooks/useContainerDim'
import { Hash, MapPin, ShoppingBag } from '@tamagui/lucide-icons'
import { Chip } from '../chips/components/chipsParts'

const colors = ['red', 'green', 'blue', 'purple', 'pink', 'orange']

const ProductItem: FC<{ item: Product }> = ({ item }) => {
  const heightFactor = useMemo(() => Math.random() < 0.5, [])

  return (
    <View flexDirection="column" key={item.id} mb="$6" flex={1} gap="$2.5">
      <View
        flexDirection="column"
        borderRadius="$8"
        shadowColor="$shadowColor"
        shadowRadius={5}
        overflow="hidden"
        animation="quick"
        cursor='pointer'
      >
        <Image
          source={{ uri: item.image }}
          height={heightFactor ? 200 : 350}
          objectFit="cover"
          bg="$backgroundPress"
        />
        <View
          flex={1}
          height="100%"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          borderRadius="$8"
          hoverStyle={{
            backdropFilter: 'blur(15px)',
            backgroundColor: '$background04',
          }}
          pressStyle={{
            backdropFilter: 'blur(15px)',
            backgroundColor: '$background04',
          }}
          animation="medium"
        >
          <Text
            flex={1}
            color="$color12"
            opacity={0}
            hoverStyle={{ opacity: 1 }}
            pressStyle={{ opacity: 1 }}
            animation="medium"
            p={'$4'}
          >
            {item.desc}
          </Text>
        </View>
      </View>

      <View flexDirection="column" gap="$2">
        <Text
          color="$color12"
          fontSize="$4"
          fontWeight="600"
          $gtMd={{
            fontSize: '$8',
            lineHeight: '$6',
          }}
        >
          {item.name}
        </Text>

        <View
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="$2"
        >
          <View f={1} flexDirection="row" alignItems="center" gap="$2" theme="alt1">
            <MapPin size="$1" color="$color10" />
            <Text numberOfLines={2} color="$color10" fontSize="$3">
              {item.city}
            </Text>
          </View>
          <Text
            color="$color11"
            theme="green"
            $gtMd={{
              fontSize: '$6',
              fontWeight: '600',
            }}
          >
            ${Math.floor(Number(item.price) / 10)}
          </Text>
        </View>

        <View
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          gap="$2"
        >
          <Chip
            rounded
            width="auto"
            maxWidth="50%"
            size="$2"
            backgroundColor="$color4"
            theme={`${colors[Math.floor(Math.random() * colors.length)]}` as ThemeName}
          >
            <Chip.Icon color="$color9">
              <Hash />
            </Chip.Icon>
            <Chip.Text numberOfLines={1} color="$color9">
              {item.category}
            </Chip.Text>
          </Chip>

          <Button themeInverse size="$2.5" icon={ShoppingBag}>
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
    i,
  }: {
    item: (typeof data)[0]
    i: number
  }): ReactElement => {
    return <ProductItem item={item} />
  }

  return (
    <View flex={1} $gtMd={{ maxHeight: 800 }}>
      <MasonryList
        flex={1}
        keyExtractor={(item): string => item.id}
        ListHeaderComponent={<View />}
        $gtMd={{ p: '$4' }}
        gap="$4"
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
