import { Image, ScrollView, Text, View, isWeb, styled } from 'tamagui'

const data = [
  { uri: 'HLIST_1.jpg', title: 'Jakarta' },
  { uri: 'HLIST_2.jpg', title: 'Bandung' },
  { uri: 'HLIST_3.jpg', title: 'SaiGon' },
  { uri: 'HLIST_4.jpg', title: 'Tokyo' },
  { uri: 'HLIST_5.jpg', title: 'Semarang' },
  { uri: 'HLIST_6.jpg', title: 'Malang' },
]

export function HList() {
  return (
    <View flex={1} width="100%" height="100%">
      <ScrollView
        {...(isWeb && {
          items: 'center',
        })}
        pl="50%"
        pr="6"
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        <View flexDirection="row" gap="6" height="100%">
          {data.map(({ uri, title }) => (
            <HListItem key={uri} uri={uri} title={title} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

HList.fileName = 'HList'

function HListItem({ uri, title }: { uri: string; title: string }) {
  return (
    <HListFrame style={{ transition: 'transform 150ms ease' }} scale="press:0.98">
      <HListInner
        containerType="normal"
        group="item"
        style={{ transition: 'transform 150ms ease' }}
        position="relative"
      >
        <View
          flexDirection="column"
          flex={1}
          scale="1.2 group-hover/item:1.2"
          style={{ transition: 'transform 250ms ease' }}
        >
          <Image
            width="100%"
            height={200}
            objectFit="cover"
            src={`https://tamagui.dev/bento/images/hlist/${uri}`}
            scale={1}
          />
        </View>
        <View
          position="absolute"
          b={0}
          l={0}
          r={0}
          py="4"
          bg="rgba(0,0,0,0.25) group-hover/item:rgba(0,0,0,0.5)"
          style={{ transition: 'background-color 250ms ease' }}
        >
          <Text
            style={{
              transition: 'transform 300ms ease, text-shadow 300ms ease',
            }}
            color="#fff"
            my="auto"
            self="center"
            fontWeight={600}
            y="0 group-hover/item:-4px"
            scale="1 group-hover/item:1.075"
            textShadow="(0 1px 0 shadow-color) group-hover/item:(0 2px 10px shadow-color)"
          >
            {title}
          </Text>
        </View>
      </HListInner>
    </HListFrame>
  )
}

const HListFrame = styled(View, {
  width: 200,
  height: 200,
  borderWidth: 1,
  borderColor: 'color-3',
  rounded: '10 hover:11',
  bg: 'background',
  scale: '1 hover:1.05',
  boxShadow: '(0 0 3px shadow-color) hover:(0 0 20px shadow-color)',
  animateOnly: ['borderRadius', 'transform'],
})

const HListInner = styled(View, {
  width: 200,
  height: 200,
  overflow: 'hidden',
  rounded: '10 hover:11',
})
