import { FlatList } from 'react-native'
import { Button, Image, Paragraph, Separator, Text, View, styled, Avatar } from 'tamagui'
import { useContainerDim } from '../../hooks/useContainerDim'

const items = Array.from({ length: 100 }).map((_, index) => index)

const padding = 20
const baseWidth = 300

const List = styled(FlatList<number>, {})

const renderItem = ({ item, index }: { item: number; index: number }) => {
  return <Item data={{ index }} key={item} />
}
export function FlatGrid() {
  const { width: deviceWidth } = useContainerDim('window')

  const numberOfColumns = Math.round((deviceWidth - padding) / baseWidth)

  return (
    <List
      {...(numberOfColumns > 1 && {
        columnWrapperStyle: {
          gap: 22,
        },
      })}
      p={`@sm/window:${padding}px`}
      height="@sm/window:500px"
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
      bg="background"
      overflow="hidden"
      rounded="9"
      borderWidth={1}
      borderColor="border-color"
      p={PADDING}
      gap="3"
      shrink={1}
      grow={1}
      boxShadow="hover:(0 4px 18px shadow-color)"
    >
      {/* minus margin can cancel padding */}
      <View height="14" mx={-PADDING} mt={-PADDING}>
        <Image
          width="100%"
          height="100%"
          bg="background-press"
          src={`https://picsum.photos/250/${150 + index}`}
        />
      </View>
      <Paragraph size="2" lineHeight="1" theme="level2">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla nesciunt
        asperiores corrupti! Optio soluta excepturi aut sint nam vero, libero at
        repellendus
      </Paragraph>
      <Separator mx={-PADDING} />
      <View flexDirection="row" items="center" gap="4" p="2">
        <Button size="sm" circular variant="quiet">
          <Avatar circular>
            <Avatar.Image
              aria-label="Post author avatar"
              src="https://images.unsplash.com/photo-1588798204072-e5f8e649d269?&w=100"
              objectFit="cover"
            />
            <Avatar.Fallback bg="blue-10" />
          </Avatar>
        </Button>
        <View gap="1" flexDirection="column">
          <Text fontSize="3" fontWeight="800">
            Photo posted by
          </Text>
          <Text color="color-8" fontSize="3">
            someperson@something.com
          </Text>
        </View>
      </View>
    </View>
  )
}
