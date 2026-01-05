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
  const indexAsNumber = Number.parseInt(index, 10)
  const color = scale.colors[indexAsNumber]

  if (!color) {
    return null
  }

  const computedColor = getColor(palette.curves, scale, indexAsNumber)
  const hex = colorToHex(computedColor)

  return (
    <SidebarPanel title={`${scale.name}.${index}`}>
      <YStack gap="$3">
        <YStack
          borderWidth={1}
          borderColor="$borderColor"
          width="100%"
          height={48}
          bg={hex as any}
          rounded="$2"
        />
        <XStack overflow="hidden" flex={1} gap="$2">
          <XStack items="center" gap="$2">
            <Label size="$2" htmlFor="color-hue">
              {scale.curves.hue ? 'H offset' : 'H'}
            </Label>
            <Input
              maxW={55}
              size="$2"
              id="color-hue"
              // type="number" // min={0} // max={360}
              value={color.hue as any}
              onChange={(e) => {
                const text = e.target?.value ?? ''
                state.colors.changeColorValue({
                  index: indexAsNumber,
                  value: {
                    hue: Number(text),
                  },
                })
              }}
            />
          </XStack>
          <XStack items="center" gap="$2">
            <Label size="$2" htmlFor="color-saturation">
              {scale.curves.saturation ? 'S offset' : 'S'}
            </Label>
            <Input
              maxW={55}
              size="$2"
              id="color-saturation"
              // type="number" // min={0} // max={360}
              value={color.saturation as any}
              onChange={(e) => {
                const text = e.target?.value ?? ''
                state.colors.changeColorValue({
                  index: indexAsNumber,
                  value: {
                    saturation: Number(text),
                  },
                })
              }}
            />
          </XStack>
          <XStack items="center" gap="$2">
            <Label size="$2" htmlFor="color-lightness">
              {scale.curves.lightness ? 'L offset' : 'L'}
            </Label>
            <Input
              maxW={55}
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
            state.colors.deleteColor(Number.parseInt(index))
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
