import React from 'react'
import { Image } from '@tamagui/image'
import { styled, usePropsAndStyle } from '@tamagui/web'
import { Image as RNImage } from 'react-native'
import { Text, View, XStack, YStack } from 'tamagui'

// Inline v1-style Image using usePropsAndStyle (the old approach)
const StyledImageV1 = styled(RNImage, { name: 'ImageV1' })

const ImageV1 = StyledImageV1.styleable<any>((inProps: any, ref) => {
  const [props, style] = usePropsAndStyle(inProps)
  const { src, source, ...rest } = props
  const finalSource =
    typeof src === 'string'
      ? {
          uri: src,
          width: props.width || style?.width,
          height: props.height || style?.height,
        }
      : (source ?? src)
  return <RNImage ref={ref} source={finalSource} style={style} {...(rest as any)} />
}) as any

const IMG_SRC = 'https://placecats.com/300/300'

const cases = [
  {
    label: 'br="$12"',
    props: { width: 120, height: 120, borderRadius: '$12' as any },
  },
  { label: 'br="$4"', props: { width: 120, height: 120, borderRadius: '$4' as any } },
  { label: 'br={20}', props: { width: 120, height: 120, borderRadius: 20 } },
  { label: 'no br', props: { width: 120, height: 120 } },
  {
    label: 'w/h="$10" br="$2"',
    props: { width: '$10' as any, height: '$10' as any, borderRadius: '$2' as any },
  },
]

export function ImageTokenStyle() {
  return (
    <YStack gap="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$5">
        Issue #3940: Image token styles
      </Text>

      {/* Header row */}
      <XStack gap="$4">
        <View width={140} />
        <View width={130}>
          <Text fontWeight="bold" textAlign="center">
            V2 (current)
          </Text>
        </View>
        <View width={130}>
          <Text fontWeight="bold" textAlign="center">
            V1 (old)
          </Text>
        </View>
        <View width={130}>
          <Text fontWeight="bold" textAlign="center">
            View (ref)
          </Text>
        </View>
      </XStack>

      {cases.map((c, i) => (
        <XStack key={i} gap="$4" alignItems="center">
          <View width={140}>
            <Text fontSize="$2">{c.label}</Text>
          </View>

          {/* V2 Image */}
          <YStack width={130} alignItems="center">
            <Image id={`v2-image-${i}`} src={IMG_SRC} {...c.props} />
          </YStack>

          {/* V1 Image */}
          <YStack width={130} alignItems="center">
            <ImageV1 id={`v1-image-${i}`} src={IMG_SRC} {...c.props} />
          </YStack>

          {/* View reference */}
          <YStack width={130} alignItems="center">
            <View id={`view-ref-${i}`} backgroundColor="$blue10" {...c.props} />
          </YStack>
        </XStack>
      ))}
    </YStack>
  )
}
