import { useCallback, useRef, useState } from 'react'
import { Button, Text, View, XStack, YStack } from 'tamagui'

type LayoutEvent = any

type LayoutData = {
  x: number
  y: number
  width: number
  height: number
  count: number
}

const empty: LayoutData = { x: 0, y: 0, width: 0, height: 0, count: 0 }

export function OnLayoutCase() {
  const [boxA, setBoxA] = useState<LayoutData>(empty)
  const [boxB, setBoxB] = useState<LayoutData>(empty)
  const [moved, setMoved] = useState(false)
  const [resized, setResized] = useState(false)
  const [parentResized, setParentResized] = useState(false)
  const [mounted, setMounted] = useState(true)
  const [swapped, setSwapped] = useState(false)
  const countA = useRef(0)
  const countB = useRef(0)

  const handleLayoutA = useCallback((e: LayoutEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout
    countA.current++
    setBoxA({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      count: countA.current,
    })
  }, [])

  const handleLayoutB = useCallback((e: LayoutEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout
    countB.current++
    setBoxB({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
      count: countB.current,
    })
  }, [])

  return (
    <YStack padding="$4" gap="$3">
      {/* controls */}
      <XStack gap="$2" flexWrap="wrap">
        <Button testID="btn-move" size="$2" onPress={() => setMoved((v) => !v)}>
          toggle move
        </Button>
        <Button testID="btn-resize" size="$2" onPress={() => setResized((v) => !v)}>
          toggle resize
        </Button>
        <Button
          testID="btn-parent-resize"
          size="$2"
          onPress={() => setParentResized((v) => !v)}
        >
          toggle parent
        </Button>
        <Button testID="btn-toggle-mount" size="$2" onPress={() => setMounted((v) => !v)}>
          toggle mount
        </Button>
        <Button testID="btn-swap" size="$2" onPress={() => setSwapped((v) => !v)}>
          toggle swap
        </Button>
      </XStack>

      {/* readout */}
      <Text testID="layout-a" fontSize={12}>
        {`A:${boxA.width}x${boxA.height}@${boxA.x},${boxA.y}#${boxA.count}`}
      </Text>
      <Text testID="layout-b" fontSize={12}>
        {`B:${boxB.width}x${boxB.height}@${boxB.x},${boxB.y}#${boxB.count}`}
      </Text>

      {/* box A: the main test target */}
      <View
        testID="parent-a"
        width={parentResized ? 300 : 500}
        height={200}
        backgroundColor="$backgroundHover"
        position="relative"
      >
        {mounted &&
          (swapped ? (
            <View
              testID="box-a"
              key="box-a-alt"
              onLayout={handleLayoutA}
              width={resized ? 180 : 120}
              height={resized ? 80 : 60}
              marginLeft={moved ? 100 : 0}
              backgroundColor="$blue8"
            />
          ) : (
            <View
              testID="box-a"
              key="box-a-default"
              onLayout={handleLayoutA}
              width={resized ? 180 : 120}
              height={resized ? 80 : 60}
              marginLeft={moved ? 100 : 0}
              backgroundColor="$red8"
            />
          ))}
      </View>

      {/* box B: second instance for cross-contamination test */}
      <View
        testID="parent-b"
        width={400}
        height={150}
        backgroundColor="$backgroundHover"
        position="relative"
      >
        <View
          testID="box-b"
          onLayout={handleLayoutB}
          width={200}
          height={50}
          backgroundColor="$green8"
        />
      </View>
    </YStack>
  )
}
