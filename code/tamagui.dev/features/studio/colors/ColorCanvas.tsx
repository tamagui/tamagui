'use client'

import { CheckCircle, Minus, Plus, XCircle } from '@tamagui/lucide-icons'
import { useObserve } from '@tamagui/use-store'
import { getContrast, readableColor } from 'color2k'
import React, { memo } from 'react'
import {
  Button,
  Paragraph,
  Spacer,
  Unspaced,
  XGroup,
  XStack,
  YStack,
  ZStack,
} from 'tamagui'

import { Canvas } from '../components/Canvas'
import { colorsStore } from '../state/ColorsStore'
import type { Curve } from '../state/types'
import { useGlobalState } from '../state/useGlobalState'
import { getColor, colorToHex, getAccentScore, getRange } from './helpers'

const ColorCanvasFrame = ({ children }) => {
  const palette = useObserve(() => colorsStore.palette)
  return (
    <Canvas bg={(palette.backgroundColor as any) || 'transparent'}>{children}</Canvas>
  )
}

export const ColorCanvas = memo(function ColorCanvas() {
  const state = useGlobalState()
  const palette = useObserve(() => colorsStore.palette)
  const scale = useObserve(() => colorsStore.scale)
  const focusedHex = useObserve(() => colorsStore.focusedHex)
  const index = useObserve(() => colorsStore.selectedIndex)

  const [visibleCurves, setVisibleCurves] = React.useState({
    hue: true,
    saturation: true,
    lightness: true,
  })

  if (!scale) {
    return (
      <>
        <div style={{ padding: 16 }}>
          <p style={{ marginTop: 0 }}>Scale not found</p>
        </div>
      </>
    )
  }

  const barWidth = `${(1 / scale.colors.length) * 100}%`

  const readableLabelColor = scale.colors[0]
    ? readableColor(
        `hsl(${scale.colors[0].hue}, ${scale.colors[0].saturation}%, ${scale.colors[0].lightness}%)`
      )
    : 'var(--background)'

  return (
    <ColorCanvasFrame>
      <XStack p="$2" gap="$4" position="relative">
        <Unspaced>
          <YStack fullscreen z={0} bg="$background" opacity={0.5} />
        </Unspaced>

        <XGroup>
          {Object.entries(visibleCurves).map(([type, isVisible], i) => {
            return (
              <Button
                size="$2"
                px="$3"
                key={`${type}${i}`}
                aria-label={`Toggle ${type} curve visibility`}
                aria-pressed={isVisible}
                onPress={() => setVisibleCurves({ ...visibleCurves, [type]: !isVisible })}
                themeInverse={isVisible}
                opacity={isVisible ? 1 : 0.5}
              >
                {type[0].toUpperCase()}
              </Button>
            )
          })}
        </XGroup>

        <Spacer flex />

        <XGroup>
          <Button
            size="$2"
            px="$3"
            icon={Minus}
            aria-label="Remove color from end of scale"
            onPress={() => state.colors.popColor()}
          />
          <Button
            size="$2"
            px="$3"
            icon={Plus}
            aria-label="Add color to end of scale"
            onPress={() => state.colors.createColor()}
          />
        </XGroup>
      </XStack>

      <ZStack flex={1} m="$5">
        <XStack maxW="100%" height="100%" px="$2">
          {scale.colors.map((_, i) => {
            const color = getColor(palette.curves, scale, i)
            const hex = colorToHex(color)
            const accent = focusedHex ? getContrast(hex, focusedHex) : undefined
            const accentScore = accent ? getAccentScore(accent) : undefined
            const isActive = index === String(i)
            const labelColor = focusedHex
            return (
              <YStack
                key={`${color}${i}`}
                focusable
                onFocus={() => state.colors.setColorIndex(String(i))}
                flex={1}
                width={barWidth as any}
                maxW={barWidth as any}
                minW={barWidth as any}
                z={isActive ? 1 : 0}
                my="$4"
                scale={isActive ? 1.02 : 1}
                overflow="hidden"
                bg={hex as any}
                borderTopLeftRadius={i === 0 ? '$4' : 0}
                borderBottomLeftRadius={i === 0 ? '$4' : 0}
                borderTopRightRadius={i === scale.colors.length - 1 ? '$4' : 0}
                borderBottomRightRadius={i === scale.colors.length - 1 ? '$4' : 0}
                {...(isActive && {
                  borderRadius: '$4',
                  elevation: '$4',
                })}
                position="relative"
                p="$2"
                onPress={() => state.colors.setColorIndex(String(i))}
              >
                <Spacer flex />
                <YStack
                  ml="auto"
                  items="flex-end"
                  position="relative"
                  rounded="$4"
                  overflow="hidden"
                  p="$2"
                >
                  <YStack
                    z={-1}
                    fullscreen
                    bg={
                      isActive
                        ? color.lightness > 50
                          ? 'rgba(0,0,0,0.85)'
                          : 'rgba(255,255,255,0.85)'
                        : undefined
                    }
                    opacity={0.2}
                  />
                  <Paragraph lineHeight={0} color={labelColor as any}>
                    {accentScore !== 'Fail' ? (
                      // @ts-ignore
                      <CheckCircle size={16} color="currentColor" />
                    ) : (
                      // @ts-ignore
                      <XCircle size={16} color="currentColor" />
                    )}
                  </Paragraph>
                  <Paragraph
                    size="$3"
                    text="right"
                    color={labelColor as any}
                    self="flex-end"
                  >
                    {accentScore !== 'Fail' ? <>{accentScore}</> : <>Fail</>}
                  </Paragraph>
                </YStack>
              </YStack>
            )
          })}
        </XStack>
      </ZStack>

      <XStack height={48}>
        {index ? (
          <>
            {Object.values(palette.scales)
              .filter((scale) => scale.colors.length > Number.parseInt(index))
              .map((currentScale, i) => {
                const numScales = Object.values(palette.scales).filter(
                  (scale) => scale.colors.length > Number.parseInt(index)
                ).length
                return (
                  <YStack
                    key={currentScale.name}
                    aria-label={`Go to ${currentScale.name} scale`}
                    flex={1}
                    bg={
                      colorToHex(
                        getColor(palette.curves, currentScale, Number.parseInt(index))
                      ) as any
                    }
                    borderTopLeftRadius={i === 0 ? 2 : 0}
                    borderBottomLeftRadius={i === 0 ? 2 : 0}
                    borderTopRightRadius={i === numScales - 1 ? 2 : 0}
                    borderBottomRightRadius={i === numScales - 1 ? 2 : 0}
                    position="relative"
                  />
                )
              })}
          </>
        ) : null}
      </XStack>
    </ColorCanvasFrame>
  )
})
