import { CheckCircle, XCircle } from '@tamagui/local-icons'
import { getContrast } from 'color2k'
import { memo } from 'react'
import {
  Input,
  Label,
  Paragraph,
  Separator,
  Spacer,
  Square,
  XStack,
  YStack,
} from 'tamagui'
import { Button } from '~/components/Button'

import { SidebarPanel, SidebarRight } from '../components/Sidebar'
import { colorsStore } from '../state/ColorsStore'
import { rootStore } from '../state/RootStore'
import { useGlobalState } from '../state/useGlobalState'
import { Color } from './Color'
import { colorToHex, getColor, getAccentScore } from './helpers'

export const ColorsSidebarRight = memo(function ColorsSidebarRight() {
  const state = useGlobalState()
  const { scheme: paletteId, scaleId } = state.colors
  const palette = state.colors.palette
  const scale = state.colors.scale
  const focusedHex = state.colors.focusedHex
  const index = state.colors.selectedIndex

  if (!scale) {
    return null
  }

  const selectedColorContents = Boolean(index) && (
    <>
      <Separator />

      <Color paletteId={paletteId} scaleId={scaleId} index={index} />

      <Separator />

      <SidebarPanel title={`Accent of ${scale.name}.${index}`}>
        <YStack render="ul" gap="0-5">
          {[
            {
              name: 'bg',
              hex: palette?.backgroundColor,
              accent:
                palette.backgroundColor && palette.backgroundColor !== 'transparent'
                  ? getContrast(palette?.backgroundColor, focusedHex || '')
                  : 1,
            },
            ...scale.colors
              .map((_, i) => {
                try {
                  const hex = colorToHex(getColor(palette.curves, scale, i))
                  const accent = getContrast(hex, focusedHex || '')
                  return {
                    name: `${scale.name}.${i}`,
                    hex,
                    accent,
                  }
                } catch (error) {
                  return {
                    error,
                  }
                }
              })
              .filter((_, i) => i !== Number(index)),
          ].map((result, i) => {
            if ('error' in result) {
              return null
            }

            const { name, hex, accent } = result

            return (
              <XStack key={`${name}${i}`} overflow="hidden" items="center">
                <XStack items="center" flex={1000} gap="1-5">
                  <Square
                    aria-hidden
                    size="8"
                    rounded="2"
                    borderWidth={1}
                    borderColor="border-color"
                    bg={hex as any}
                  >
                    <Paragraph size="2" color={focusedHex as any}>
                      Aa
                    </Paragraph>
                  </Square>
                  <Paragraph size="2" ellipsis>
                    on {name}
                  </Paragraph>
                </XStack>
                <Spacer flex={1} />
                <XStack overflow="hidden" flex={1} gap="1-5" items="center">
                  <Paragraph size="2" mr="1-5">
                    {accent.toFixed(2)}
                  </Paragraph>
                  <Paragraph size="2" ellipsis fontWeight="800">
                    {getAccentScore(getContrast(hex, focusedHex || ''))}{' '}
                  </Paragraph>
                  {getAccentScore(getContrast(hex, focusedHex || '')) === 'Fail' ? (
                    <XCircle size={16} />
                  ) : (
                    <CheckCircle size={16} />
                  )}
                </XStack>
              </XStack>
            )
          })}
        </YStack>
      </SidebarPanel>
    </>
  )

  return (
    <SidebarRight>
      <SidebarPanel title={`Palette`}>
        <YStack gap="1-5">
          <YStack gap="0-5">
            <Label size="2" htmlFor="scale-name">
              Name
            </Label>
            <Input
              size="xs"
              id="scale-name"
              aria-label="Scale name"
              value={scale.name}
              onChange={(e) => colorsStore.changeScaleName(e.target?.value ?? '')}
            />
          </YStack>
          <Button
            size="xs"
            onPress={async () => {
              const confirmed = await rootStore.confirmDialog('confirm-delete', {
                thingName: `palette`,
              })
              if (confirmed) {
                state.colors.deleteScale()
              }
            }}
          >
            Delete palette
          </Button>
        </YStack>
      </SidebarPanel>

      <Separator />

      {selectedColorContents}
    </SidebarRight>
  )
})
