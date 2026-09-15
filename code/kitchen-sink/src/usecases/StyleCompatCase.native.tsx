import {
  Configuration,
  Text,
  getConfig,
  getVariableValue,
  styled,
  type AnimationDriver,
} from '@tamagui/core'
import { useState } from 'react'
import {
  PixelRatio,
  Pressable,
  ScrollView,
  Text as NativeText,
  TextInput,
  View,
} from 'react-native'
import { animationsNative, animationsReanimated } from '../tamagui.config'

const Input = styled(TextInput, {}, { isInput: true })
const samples = [
  { name: 'ratio', leading: 1.5, pixels: 30 },
  { name: 'pixels', leading: '24px', pixels: 24 },
  { name: 'font', leading: 'base', pixels: 24 },
  { name: 'large', leading: 24, pixels: 480 },
] as const

export function StyleCompatCase() {
  const fontFamily = getVariableValue(getConfig().fontsParsed.body.family)
  const [heights, setHeights] = useState<Record<string, number>>({})
  const record = (name: string, value: number) => {
    setHeights((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }))
  }
  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      <NativeText testID="native-leading-state">
        {Object.keys(heights).length === 34 ? 'ready' : 'measuring'}
      </NativeText>
      <NativeText testID="native-leading-font-scale">
        {String(PixelRatio.getFontScale())}
      </NativeText>
      <NativeText
        testID="native-leading-measurements"
        allowFontScaling={false}
        numberOfLines={1}
        style={{ fontSize: 8 }}
      >
        {JSON.stringify(heights)}
      </NativeText>
      <ScrollView>
        <NativeLeadingAnimation name="native" driver={animationsNative!} />
        <NativeLeadingAnimation name="reanimated" driver={animationsReanimated} />
        {samples.map(({ name, leading, pixels }) => (
          <View key={name} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text
              fontFamily="body"
              fontSize={20}
              lineHeight={leading}
              onLayout={({ nativeEvent: { layout } }) => record(name, layout.height)}
              onTextLayout={
                name === 'ratio'
                  ? ({ nativeEvent: { lines } }) =>
                      record(`${name}-width`, lines[0].width)
                  : undefined
              }
            >
              {'A\nB'}
            </Text>
            <NativeText
              style={{ fontFamily, fontSize: 20, lineHeight: pixels }}
              onLayout={({ nativeEvent: { layout } }) =>
                record(`${name}-raw`, layout.height)
              }
              onTextLayout={
                name === 'ratio'
                  ? ({ nativeEvent: { lines } }) =>
                      record(`${name}-raw-width`, lines[0].width)
                  : undefined
              }
            >
              {'A\nB'}
            </NativeText>
            <Text
              allowFontScaling={false}
              maxFontSizeMultiplier={1.2}
              fontFamily="body"
              fontSize={20}
              lineHeight={leading}
              onLayout={({ nativeEvent: { layout } }) =>
                record(`${name}-fixed`, layout.height)
              }
              onTextLayout={
                name === 'ratio'
                  ? ({ nativeEvent: { lines } }) =>
                      record(`${name}-fixed-width`, lines[0].width)
                  : undefined
              }
            >
              {'A\nB'}
            </Text>
            <NativeText
              allowFontScaling={false}
              maxFontSizeMultiplier={1.2}
              style={{ fontFamily, fontSize: 20, lineHeight: pixels }}
              onLayout={({ nativeEvent: { layout } }) =>
                record(`${name}-fixed-raw`, layout.height)
              }
              onTextLayout={
                name === 'ratio'
                  ? ({ nativeEvent: { lines } }) =>
                      record(`${name}-fixed-raw-width`, lines[0].width)
                  : undefined
              }
            >
              {'A\nB'}
            </NativeText>
            <Text
              allowFontScaling
              maxFontSizeMultiplier={1.2}
              fontFamily="body"
              fontSize={20}
              lineHeight={leading}
              onLayout={({ nativeEvent: { layout } }) =>
                record(`${name}-capped`, layout.height)
              }
              onTextLayout={
                name === 'ratio'
                  ? ({ nativeEvent: { lines } }) =>
                      record(`${name}-capped-width`, lines[0].width)
                  : undefined
              }
            >
              {'A\nB'}
            </Text>
            <NativeText
              allowFontScaling
              maxFontSizeMultiplier={1.2}
              style={{ fontFamily, fontSize: 20, lineHeight: pixels }}
              onLayout={({ nativeEvent: { layout } }) =>
                record(`${name}-capped-raw`, layout.height)
              }
              onTextLayout={
                name === 'ratio'
                  ? ({ nativeEvent: { lines } }) =>
                      record(`${name}-capped-raw-width`, lines[0].width)
                  : undefined
              }
            >
              {'A\nB'}
            </NativeText>
          </View>
        ))}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Input
            multiline
            value={'A\nB'}
            editable={false}
            fontSize={20}
            lineHeight={1.5}
            padding={0}
            onContentSizeChange={(event) =>
              record('input', event.nativeEvent.contentSize.height)
            }
          />
          <TextInput
            multiline
            value={'A\nB'}
            editable={false}
            style={{ fontSize: 20, lineHeight: 30, padding: 0 }}
            onContentSizeChange={(event) =>
              record('input-raw', event.nativeEvent.contentSize.height)
            }
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text
            fontSize={20}
            lineHeight={1.5}
            onLayout={(event) => record('nested', event.nativeEvent.layout.height)}
          >
            <Text fontSize={10}>{'A\nB'}</Text>
          </Text>
          <NativeText
            style={{ fontSize: 20, lineHeight: 30 }}
            onLayout={(event) => record('nested-raw', event.nativeEvent.layout.height)}
          >
            <NativeText style={{ fontSize: 10, lineHeight: 15 }}>{'A\nB'}</NativeText>
          </NativeText>
        </View>
      </ScrollView>
    </View>
  )
}

function NativeLeadingAnimation({
  name,
  driver,
}: {
  name: string
  driver: AnimationDriver
}) {
  const [expanded, setExpanded] = useState(false)
  const [frames, setFrames] = useState<number[]>([])
  const [target, setTarget] = useState(0)
  const fontFamily = getVariableValue(getConfig().fontsParsed.body.family)
  return (
    <Configuration animationDriver={driver}>
      <Pressable
        testID={`native-leading-${name}-animate`}
        onPress={() => setExpanded(true)}
      >
        <NativeText>{name}</NativeText>
      </Pressable>
      <NativeText
        testID={`native-leading-${name}-animation`}
        allowFontScaling={false}
        numberOfLines={1}
        style={{ fontSize: 8 }}
      >
        {JSON.stringify({ frames, target })}
      </NativeText>
      <NativeText testID={`native-leading-${name}-animation-state`}>
        {expanded && target > 0 && frames.at(-1) === target
          ? 'finished'
          : frames.length && target > 0
            ? 'ready'
            : 'measuring'}
      </NativeText>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text
          allowFontScaling={false}
          fontFamily="body"
          fontSize={expanded ? 40 : 20}
          lineHeight={1.5}
          transition="fontSize 1000ms linear"
          onLayout={({ nativeEvent: { layout } }) =>
            setFrames((previous) =>
              previous.at(-1) === layout.height ? previous : [...previous, layout.height]
            )
          }
        >
          <Text allowFontScaling={false} lineHeight={2}>
            {'A\nB'}
          </Text>
        </Text>
        <NativeText
          allowFontScaling={false}
          style={{ fontFamily, fontSize: 40, lineHeight: 60 }}
          onLayout={({ nativeEvent: { layout } }) => setTarget(layout.height)}
        >
          <NativeText allowFontScaling={false} style={{ lineHeight: 80 }}>
            {'A\nB'}
          </NativeText>
        </NativeText>
      </View>
    </Configuration>
  )
}
