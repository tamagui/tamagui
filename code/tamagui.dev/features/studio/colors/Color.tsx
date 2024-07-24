'use client'

import { toHsla, toRgba } from 'color2k'
import { Button, Input, Label, Paragraph, XStack, YStack, styled } from 'tamagui'
import { SidebarPanel } from '../components/Sidebar'
import { useGlobalState } from '../state/useGlobalState'
import { getColor, colorToHex } from './helpers'

export function Color({
  paletteId = '',
  scaleId = '',
  index = '',
}: {
  paletteId: string
  scaleId: string
  index: string
}) {
  const state = useGlobalState()
  const palette = state.colors.palettesByScheme[paletteId]
  const scale = palette.scales[scaleId]
  const indexAsNumber = parseInt(index, 10)
  const color = scale.colors[indexAsNumber]

  if (!color) {
    return null
  }

  const computedColor = getColor(palette.curves, scale, indexAsNumber)
  const hex = colorToHex(computedColor)

  return (
    <SidebarPanel title={`${scale.name}.${index}`}>
      <YStack space="$3">
        <YStack bw={1} bc="$borderColor" w="100%" h={48} bg={hex as any} br="$2" />
        <XStack ov="hidden" f={1} space="$2">
          <XStack ai="center" space="$2">
            <Label size="$2" htmlFor="color-hue">
              {scale.curves.hue ? 'H offset' : 'H'}
            </Label>
            <Input
              maw={55}
              size="$2"
              id="color-hue"
              // type="number" // min={0} // max={360}
              value={color.hue as any}
              onChangeText={(text) => {
                state.colors.changeColorValue({
                  index: indexAsNumber,
                  value: {
                    hue: Number(text),
                  },
                })
              }}
            />
          </XStack>
          <XStack ai="center" space="$2">
            <Label size="$2" htmlFor="color-saturation">
              {scale.curves.saturation ? 'S offset' : 'S'}
            </Label>
            <Input
              maw={55}
              size="$2"
              id="color-saturation"
              // type="number" // min={0} // max={360}
              value={color.saturation as any}
              onChangeText={(text) => {
                state.colors.changeColorValue({
                  index: indexAsNumber,
                  value: {
                    saturation: Number(text),
                  },
                })
              }}
            />
          </XStack>
          <XStack ai="center" space="$2">
            <Label size="$2" htmlFor="color-lightness">
              {scale.curves.lightness ? 'L offset' : 'L'}
            </Label>
            <Input
              maw={55}
              size="$2"
              id="color-lightness"
              // type="number" // min={0} // max={360}
              value={color.lightness as any}
              onChangeText={(text) => {
                state.colors.changeColorValue({
                  index: indexAsNumber,
                  value: {
                    lightness: Number(text),
                  },
                })
              }}
            />
          </XStack>
        </XStack>

        <Code>
          hsluv({computedColor.hue}, {computedColor.saturation}%,{' '}
          {computedColor.lightness}%)
        </Code>

        <Code>{hex}</Code>

        <Code>{toRgba(hex)}</Code>

        <Code>{toHsla(hex)}</Code>

        <Button
          size="$2"
          onPress={() => {
            state.colors.deleteColor(parseInt(index))
          }}
        >
          Delete color
        </Button>
      </YStack>
    </SidebarPanel>
  )
}

const Code = styled(Paragraph, {
  fontFamily: '$mono',
  size: '$3',
})
