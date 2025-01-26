import { useState } from 'react'
import { FlatList } from 'react-native'
import { Avatar, Button, Image, Paragraph, Separator, Text, View, styled } from 'tamagui'
import { useContainerDim } from '../../hooks/useContainerDim'

const items = Array.from({ length: 100 }).map((_, index) => index)

const List = styled(FlatList<number>, {})

const renderItem = ({
  item,
  index,
}: {
  item: number
  index: number
}) => {
  return <Item data={{ index }} key={item} />
}
export function FlatGrid() {
  const [baseWidth, setBaseWidth] = useState(300)
  const [padding, setPadding] = useState(20)

  const { width: deviceWidth, height: deviceHeight } = useContainerDim('window')

  const numberOfColumns = Math.round((deviceWidth - padding) / baseWidth)

  return (
    <List
      {...(numberOfColumns > 1 && {
        columnWrapperStyle: {
          gap: 22,
        },
      })}
      $group-window-gtXs={{
        padding,
        height: 700,
      }}
      contentContainerStyle={{
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
      numColumns={numberOfColumns}
      key={numberOfColumns}
      data={items}
      renderItem={renderItem}
    />
  )
}

FlatGrid.fileName = 'FlatGrid'

function Item({ data }: { data: { index: number } }) {
  const { index } = data
  const PADDING = 16
  return (
    <View
      flexDirection="column"
      backgroundColor="$background"
      overflow="hidden"
      borderRadius="$9"
      borderWidth={1}
      borderColor="$borderColor"
      padding={PADDING}
      gap="$3"
      flexShrink={1}
      flexGrow={1}
      elevation={1}
      hoverStyle={{
        shadowColor: '$shadowColor',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: '$4',
        //@ts-ignore
        elevationAndroid: 8,
      }}
      // marginBottom={12}
    >
      {/* minus margin can cancel padding */}
      <View height="$14" marginHorizontal={-PADDING} marginTop={-PADDING}>
        <Image
          width="100%"
          height="100%"
          backgroundColor="$backgroundPress"
          source={{ uri: `https://random.imagecdn.app/250/${150 + index}` }}
        />
      </View>
      <Paragraph size="$2" lh="$1" theme="alt1">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla nesciunt
        asperiores corrupti! Optio soluta excepturi aut sint nam vero, libero at
        repellendus
      </Paragraph>
      <Separator marginHorizontal={-PADDING} />
      <View flexDirection="row" alignItems="center" gap="$4" padding="$2">
        <Button size="$3" circular chromeless>
          <Avatar circular>
            <Avatar.Image accessibilityLabel="Cam" src={`/avatars/300 (1).jpeg`} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
        </Button>
        <View gap="$1" flexDirection="column">
          <Text fontSize="$3" fontWeight="$8">
            Photo posted by
          </Text>
          <Text color="$color9" fontSize="$3">
            someperson@something.com
          </Text>
        </View>
      </View>
    </View>
  )
}
