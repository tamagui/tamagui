import type { Template } from '@tamagui/theme-builder'
import { createThemeWithPalettes } from '@tamagui/theme-builder'
import { memo } from 'react'
import {
  Input,
  Label,
  XStack,
  YStack,
  getTokenValue,
  styled,
  useDebounce,
  useEvent,
  useThemeName,
} from 'tamagui'
import { ThemeSwitch } from '~/features/studio/bar/StudioBar'
import { useThemeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { StudioPaletteBar } from '../../../StudioPaletteBar'
import { Checkerboard } from '../../../components/Checkerboard'
import { Select } from '../../../components/Select'
import { defaultScaleGrouped } from '../../constants/defaultScaleGrouped'
import { createPalettes } from '@tamagui/theme-builder'
import type { BuildTheme } from '../../types'

export const StepThemeTemplate = memo(({ buildTheme }: { buildTheme: BuildTheme }) => {
  const isDark = useThemeName().startsWith('dark')
  const scheme = isDark ? 'dark' : 'light'
  const themeBuilderStore = useThemeBuilderStore()
  const palettes = createPalettes(themeBuilderStore.palettes)
  const template =
    themeBuilderStore.templates[buildTheme.template || 'base'] ||
    themeBuilderStore.templates.base
  const paletteName = `${scheme}_${buildTheme.palette}`
  const theme = createThemeWithPalettes(palettes, paletteName, template)
  const updateTemplateDebounced = useDebounce(
    useEvent((template: Partial<Template>) =>
      themeBuilderStore.updateTemplate(buildTheme.template, template)
    ),
    1000
  )

  return (
    <YStack>
      <XStack jc="space-between" p="$3" px="$3">
        <XStack gap="$2">
          <Label size="$2">Palette:</Label>
          <Select
            size="$2"
            w={120}
            value={buildTheme.palette}
            theme="alt1"
            onValueChange={(palette) => {
              themeBuilderStore.updateTheme({
                ...buildTheme,
                palette,
              })
            }}
          >
            {Object.entries(themeBuilderStore.palettes).map(([name, palette], idx) => {
              return (
                <Select.Item index={idx} key={name} value={palette.name}>
                  {palette.name}
                </Select.Item>
              )
            })}
          </Select>
        </XStack>

        <XStack ai="center" gap="$2">
          <Label size="$2">Scheme:</Label>
          <ThemeSwitch />
        </XStack>

        {/* <XStack ai="center" gap="$2">
          <Label size="$2">Sync Schemes</Label>
          <Checkbox size="$2">
            <Checkbox.Indicator>
              <Check />
            </Checkbox.Indicator>
          </Checkbox>
        </XStack> */}
      </XStack>

      <YStack mb="$4">
        <StudioPaletteBar
          showIndices
          showNegativeIndices
          colors={themeBuilderStore.palettesBuilt[paletteName]}
        />
      </YStack>

      <YStack
        fw="wrap"
        mah={Math.ceil(Object.keys(template).length / 2) * (getTokenValue('$size.5') + 1)}
        mx="$-3"
        btw={1}
        bc="$color4"
      >
        {Object.entries(theme).map(([name, value], index) => {
          const templateEntry = template[name]
          const item = {
            name: defaultScaleGrouped.find((x) =>
              (x.keys as unknown as string[]).includes(`$${name}`)
            )?.name,
            value,
            keys: [name],
          }
          const templateValue =
            typeof templateEntry === 'string'
              ? templateEntry
              : isNegativeZero(templateEntry)
                ? '-0'
                : `${templateEntry}`

          return (
            <XStack
              miw="50%"
              h="$5"
              key={index}
              ai="center"
              px="$4"
              bbw={1}
              bbc="$color4"
            >
              <CellFrame f={1}>
                <Label y={-6} size="$3" fow="500">
                  {item.keys.join(', ')}
                </Label>

                <Label theme="alt1" mt={-20} size="$2">
                  {item.value}
                </Label>
              </CellFrame>

              <CellFrame ai="flex-end">
                <Input
                  size="$3"
                  bw={0}
                  key={templateValue}
                  defaultValue={templateValue}
                  w={50}
                  onChangeText={(next) => {
                    updateTemplateDebounced({
                      ...template,
                      [name]: !isNaN(parseInt(next)) ? parseInt(next) : next,
                    })
                  }}
                />
              </CellFrame>

              <CellFrame>
                <ColorSquare color={value} />
              </CellFrame>
            </XStack>
          )
        })}
      </YStack>
    </YStack>
  )
})

export const CellFrame = styled(YStack, {
  jc: 'center',
  p: '$1',
})

export const isNegativeZero = (number: number) => {
  const isNegative = 1 / number === -Infinity
  return number === 0 && isNegative
}

export const getFromPalette = (colors: string[], index: number) => {
  const isNegative = 1 / index === -Infinity
  return colors[isNegative ? colors.length - 1 + index : index]
}

export const ColorSquare = ({ color }: { color: string }) => {
  return (
    <XStack h={32} w={32} bw={1} bc="$color9">
      <Checkerboard opacity={0.5} />
      <XStack fullscreen bg={color as any} />
    </XStack>
  )
}
