'use client'

import { memo } from 'react'
import {
  Button,
  Label,
  Separator,
  SizableText,
  Spacer,
  Tabs,
  XStack,
  YStack,
} from 'tamagui'

import { SidebarLeft, SidebarPanel, SidebarPanelUnpad } from '../components/Sidebar'
import { colorsStore } from '../state/ColorsStore'
import { useGlobalState } from '../state/useGlobalState'
import { ColorPaletteListItem } from './ColorPaletteListItem'
import { ColorPicker } from './ColorPicker'

const ColorsSidebarPalettes = () => {
  const state = useGlobalState()
  const palette = state.colors.palette

  return (
    <SidebarPanel title="Palettes">
      <SidebarPanelUnpad>
        <XStack ai="center" jc="center">
          <Tabs
            value={state.colors.scheme}
            onValueChange={(v) => state.colors.setScheme(v)}
            size="$3"
          >
            <Tabs.List disablePassBorderRadius backgroundColor="transparent" space="$3">
              {Object.values(state.colors.palettesByScheme).map(({ id, name }) => (
                <Tabs.Tab br="$2" value={id} key={id}>
                  <SizableText size="$3" color="$color">
                    {name}
                  </SizableText>
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </XStack>

        <Spacer />

        <YStack>
          {Object.values(palette.scales).map((scale) => {
            const isActive = scale.name === state.colors.scaleId
            return (
              <YStack
                key={scale.name}
                onPress={() => {
                  colorsStore.setScale(scale.name)
                }}
              >
                <ColorPaletteListItem
                  isActive={isActive}
                  scale={scale}
                  palette={palette}
                />
              </YStack>
            )
          })}
        </YStack>
      </SidebarPanelUnpad>
      <Button
        size="$3"
        style={{ marginTop: 16, width: '100%' }}
        onPress={() => {
          state.colors.createScale()
        }}
      >
        New Palette
      </Button>
    </SidebarPanel>
  )
}

export const ColorsSidebarLeft = memo(function ColorsSidebarLeft() {
  const state = useGlobalState()
  const palette = state.colors.palette

  return (
    <>
      <SidebarLeft>
        <SidebarPanel>
          <YStack space="$3">
            <XStack space="$2" ai="center">
              <ColorPicker
                value={palette?.backgroundColor}
                onChange={(color) => {
                  state.colors.setBackgroundColor(color)
                }}
              />
              <Label ellipse size="$3" htmlFor="bg-color">
                Background
              </Label>
            </XStack>
          </YStack>
        </SidebarPanel>

        <Separator />

        <ColorsSidebarPalettes />
        <Separator />

        {/* <SidebarPanel title="Curves">
          <YStack space="$3">
            {Object.values(palette.curves).map((curve) => (
              <YStack
                key={curve.id}
                onPress={() => {
                  setGlobalState((state) => {
                    state.colors.curveId = curve.id
                  })
                }}
                // to={`curve/${curve.id}`}
                // style={{
                //   color: 'inherit',
                //   fontSize: 14,
                //   textDecoration: 'none',
                // }}
              >
                <YStack space="$2">
                  <span>{curve.name}</span>
                  <div
                    style={{
                      display: 'flex',
                      height: 24,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    {curve.values.map((value, idx) => {
                      let color: Color

                      switch (curve.type) {
                        case 'hue':
                          color = {
                            hue: value,
                            saturation: 100,
                            lightness: 50,
                          }
                          break

                        case 'saturation':
                          color = {
                            hue: 0,
                            saturation: 0,
                            lightness: 100 - value,
                          }
                          break

                        case 'lightness':
                          color = { hue: 0, saturation: 0, lightness: value }
                          break
                      }

                      return (
                        <div
                          key={idx}
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: colorToHex(color),
                          }}
                        />
                      )
                    })}
                  </div>
                </YStack>
              </YStack>
            ))}
          </YStack>
        </SidebarPanel> */}
      </SidebarLeft>
    </>
  )
})
