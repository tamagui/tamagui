import { CheckCircle, XCircle } from '@tamagui/lucide-icons'
import { getContrast } from 'color2k'
import { memo } from 'react'
import {
  Button,
  Input,
  Label,
  Paragraph,
  Separator,
  Spacer,
  Square,
  XStack,
  YStack,
} from 'tamagui'

// import {
//   changeScaleCurve,
//   changeScaleName,
//   createCurveFromScale,
//   deleteScale,
// } from '../actions'
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
        <YStack tag="ul" space="$1">
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
              <XStack key={`${name}${i}`} ov="hidden" ai="center">
                <XStack ai="center" f={1000} space="$2">
                  <Square
                    aria-hidden
                    size="$2.5"
                    br="$2"
                    bw={1}
                    bc="$borderColor"
                    backgroundColor={hex as any}
                  >
                    <Paragraph size="$2" color={focusedHex as any}>
                      Aa
                    </Paragraph>
                  </Square>
                  <Paragraph size="$2" ellipse>
                    on {name}
                  </Paragraph>
                </XStack>
                <Spacer flex />
                <XStack ov="hidden" f={1} space="$2" ai="center">
                  <Paragraph size="$2" mr="$2">
                    {accent.toFixed(2)}
                  </Paragraph>
                  <Paragraph size="$2" ellipse fow="800">
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
        <YStack space="$2">
          <YStack space="$1">
            <Label size="$2" htmlFor="scale-name">
              Name
            </Label>
            <Input
              size="$2"
              id="scale-name"
              aria-label="Scale name"
              value={scale.name}
              onChangeText={colorsStore.changeScaleName}
            />
          </YStack>
          <Button
            size="$2"
            onPress={async () => {
              const confirmed = await rootStore.confirmDialog('confirm-delete', {
                thingName: `palette`,
              })
              if (confirmed) {
                state.colors.deleteScale()
              }
              // navigate(`${routePrefix}/local/${paletteId}`);
            }}
          >
            Delete palette
          </Button>
        </YStack>
      </SidebarPanel>

      <Separator />

      {/* <SidebarPanel title="Linked curves">
        <YStack space="$3">
          <YStack space="$1">
            <Label size="$2" htmlFor="hue-curve">
              Hue curve
            </Label>
            <XStack space="$2">
              <Select
                f={1}
                size="$2"
                key={`${scale.name}-hue-curve`}
                id="hue-curve"
                value={scale.curves.hue}
                onValueChange={(value) =>
                  changeScaleCurve({
                    curveType: 'hue',
                    curveId: value,
                  })
                }
              >
                <Select.Item index={0} value="">
                  None
                </Select.Item>
                {Object.values(palette.curves)
                  .filter((curve) => curve.type === 'hue')
                  .map((curve, i) => (
                    <Select.Item key={curve.id} index={i + 1} value={curve.id}>
                      {curve.name}
                    </Select.Item>
                  ))}
              </Select>
              <Button
                size="$2"
                aria-label="Create hue curve"
                icon={Plus}
                onPress={() => createCurveFromScale('hue')}
              />
            </XStack>
          </YStack>
          <YStack space="$1">
            <Label size="$2" htmlFor="saturation-curve">
              Saturation curve
            </Label>
            <XStack space="$2">
              <Select
                f={1}
                size="$2"
                key={`${scale.name}-saturation-curve`}
                id="hue-curve"
                value={scale.curves.saturation}
                onValueChange={(value) =>
                  changeScaleCurve({
                    curveType: 'saturation',
                    curveId: value,
                  })
                }
              >
                <Select.Item index={0} value="">
                  None
                </Select.Item>
                {Object.values(palette.curves)
                  .filter((curve) => curve.type === 'saturation')
                  .map((curve, i) => (
                    <Select.Item key={curve.id} index={i + 1} value={curve.id}>
                      {curve.name}
                    </Select.Item>
                  ))}
              </Select>
              <Button
                size="$2"
                aria-label="Create saturation curve"
                icon={Plus}
                onPress={() => createCurveFromScale('saturation')}
              />
            </XStack>
          </YStack>
          <YStack space="$1">
            <Label size="$2" htmlFor="lightness-curve">
              Lightness curve
            </Label>
            <XStack space="$2">
              <Select
                f={1}
                size="$2"
                key={`${scale.name}-lightness-curve`}
                id="hue-curve"
                value={scale.curves.lightness}
                onValueChange={(value) =>
                  changeScaleCurve({
                    curveType: 'lightness',
                    curveId: value,
                  })
                }
              >
                <Select.Item index={0} value="">
                  None
                </Select.Item>
                {Object.values(palette.curves)
                  .filter((curve) => curve.type === 'lightness')
                  .map((curve, i) => (
                    <Select.Item key={curve.id} index={i + 1} value={curve.id}>
                      {curve.name}
                    </Select.Item>
                  ))}
              </Select>
              <Button
                size="$2"
                aria-label="Create lightness curve"
                icon={Plus}
                onPress={() => createCurveFromScale('lightness')}
              />
            </XStack>
          </YStack>
        </YStack>
      </SidebarPanel> */}

      {selectedColorContents}
    </SidebarRight>
  )
})
