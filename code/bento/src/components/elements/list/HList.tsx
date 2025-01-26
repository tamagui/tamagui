import { randCity, randImg, randUuid } from '@ngneat/falso'
import type { AnimationProp } from '@tamagui/web'
import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View, YStack, isWeb, styled } from 'tamagui'

const getData = () =>
  Array.from({ length: 50 })
    .fill(0)
    .map(() => ({
      name: randCity(),
      image: `${randImg({
        width: 600,
        height: 600,
      })}?id=${randUuid()}`,
      id: randUuid(),
    }))

type Data = ReturnType<typeof getData>

export function HList() {
  const [data, setData] = useState<Data>([])
  useEffect(() => {
    setData(getData())
  }, [])
  return (
    <View f={1} w="100%" h="100%">
      <ScrollView
        {...(isWeb && {
          ai: 'center',
        })}
        showsHorizontalScrollIndicator={false}
        pl="50%"
        pr="$6"
        horizontal
      >
        <View flexDirection="row" gap="$6" h="100%">
          {data.map((item) => (
            <HListItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

HList.fileName = 'HList'

const animationFast = [
  'quick',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp

const animationMedium = [
  'slow',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp

const animationSlow = [
  'medium',
  {
    opacity: {
      overshootClamping: true,
    },
  },
] as AnimationProp

function HListItem({ item }: { item: Data[number] }) {
  return (
    <HListFrame
      animation={animationFast}
      pressStyle={{
        scale: 0.98,
      }}
    >
      <HListInner containerType="normal" group="listitem" animation="bouncy">
        <View
          flexDirection="column"
          f={1}
          scale={1.2}
          animation={animationMedium}
          $group-listitem-hover={{
            scale: 1.2,
          }}
        >
          <Image
            width="100%"
            height={200}
            source={{ uri: item.image, width: 200, height: 200 }}
            scale={1}
          />
        </View>
        <View
          position="absolute"
          animation={animationMedium}
          bottom={0}
          left={0}
          right={0}
          paddingVertical="$4"
          backgroundColor="rgba(0,0,0,0.25)"
          $group-listitem-hover={{
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <Text
            animation={animationSlow}
            color="#fff"
            marginVertical="auto"
            alignSelf="center"
            y={0}
            textShadowColor="$shadowColor"
            textShadowOffset={{ height: 1, width: 0 }}
            textShadowRadius={0}
            $group-listitem-hover={{
              y: -4,
              scale: 1.075,
              textShadowColor: '$shadowColor',
              textShadowOffset: { height: 2, width: 0 },
              textShadowRadius: 10,
            }}
          >
            {item.name}
          </Text>
        </View>
      </HListInner>
    </HListFrame>
  )
}

const HListFrame = styled(View, {
  width: 200,
  animateOnly: ['borderRadius', 'transform'],
  height: 200,
  borderWidth: 1,
  borderColor: '$color3',
  borderRadius: '$10',
  backgroundColor: '$background',
  shadowColor: '$shadowColor',
  shadowRadius: 3,

  hoverStyle: {
    scale: 1.05,
    borderRadius: '$11',
    shadowColor: '$shadowColor',
    shadowRadius: 20,
  },
})

const HListInner = styled(View, {
  width: 200,
  height: 200,
  ov: 'hidden',
  borderRadius: '$10',

  hoverStyle: {
    borderRadius: '$11',
  },
})
