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
// import { CurveEditor } from './CurveEditor'
import { getColor, colorToHex, getAccentScore, getRange } from './helpers'

const ColorCanvasFrame = ({ children }) => {
  const palette = useObserve(() => colorsStore.palette)
  return (
    <Canvas backgroundColor={(palette.backgroundColor as any) || 'transparent'}>
      {children}
    </Canvas>
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
      <XStack p="$2" space pos="relative">
        <Unspaced>
          <YStack fullscreen zi={0} bg="$background" o={0.5} />
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

      <ZStack f={1} m="$5">
        <XStack maw="100%" h="100%" px="$2">
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
                f={1}
                w={barWidth as any}
                maw={barWidth as any}
                miw={barWidth as any}
                zi={isActive ? 1 : 0}
                my="$4"
                scale={isActive ? 1.02 : 1}
                ov="hidden"
                backgroundColor={hex as any}
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
                <YStack ml="auto" ai="flex-end" pos="relative" br="$4" ov="hidden" p="$2">
                  <YStack
                    zi={-1}
                    fullscreen
                    bg={
                      isActive
                        ? color.lightness > 50
                          ? 'rgba(0,0,0,0.85)'
                          : 'rgba(255,255,255,0.85)'
                        : undefined
                    }
                    o={0.2}
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
                    ta="right"
                    color={labelColor as any}
                    als="flex-end"
                  >
                    {accentScore !== 'Fail' ? <>{accentScore}</> : <>Fail</>}
                  </Paragraph>
                </YStack>
              </YStack>
            )
          })}
        </XStack>
        {(Object.entries(scale.curves) as [Curve['type'], string | undefined][])
          .filter(([type]) => visibleCurves[type])
          .map(([type, curveId]) => {
            if (!curveId) return null

            return null
            // return (
            //   <CurveEditor
            //     labelColor={readableLabelColor}
            //     key={curveId}
            //     values={palette.curves[curveId].values}
            //     {...getRange(type)}
            //     disabled
            //     label={`${type[0].toUpperCase()}`}
            //   />
            // )
          })}
        {(['hue', 'saturation', 'lightness'] as const)
          .filter((type) => visibleCurves[type])
          .map((type) => {
            return null
            // return (
            //   <CurveEditor
            //     labelColor={readableLabelColor}
            //     key={`${type}-${scale.name}-${scale.colors.length}-${Object.keys(
            //       scale.curves
            //     ).join(',')}`}
            //     values={scale.colors.map(
            //       (color, index) => getColor(palette.curves, scale, index)[type]
            //     )}
            //     {...getRange(type)}
            //     label={`${type[0].toUpperCase()}`}
            //     onFocus={(index) => state.colors.setColorIndex(String(index))}
            //     onChange={(values, shiftKey, index) => {
            //       if (shiftKey && scale.curves[type]) {
            //         state.colors.changeCurveValues({
            //           curveId: scale.curves[type] ?? '',
            //           values: values.map(
            //             (value, index) => value - scale.colors[index][type]
            //           ),
            //         })
            //       } else {
            //         state.colors.changeScaleColors(
            //           scale.colors.map((color, index) => ({
            //             ...color,
            //             [type]:
            //               values[index] -
            //               (palette.curves[scale.curves[type] ?? '']?.values[index] ?? 0),
            //           }))
            //         )
            //       }
            //     }}
            //   />
            // )
          })}
      </ZStack>

      <XStack height={48}>
        {index ? (
          <>
            {Object.values(palette.scales)
              .filter((scale) => scale.colors.length > parseInt(index))
              .map((currentScale, i) => {
                const numScales = Object.values(palette.scales).filter(
                  (scale) => scale.colors.length > parseInt(index)
                ).length
                return (
                  <YStack
                    key={currentScale.name}
                    // as={Link}
                    aria-label={`Go to ${currentScale.name} scale`}
                    // to={`${routePrefix}/local/${paletteId}/scale/${currentScale.id}`}
                    f={1}
                    backgroundColor={
                      colorToHex(
                        getColor(palette.curves, currentScale, parseInt(index))
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
