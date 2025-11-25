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
        <XStack items="center" justify="center">
          <Tabs
            value={state.colors.scheme}
            onValueChange={(v) => state.colors.setScheme(v)}
            size="$3"
          >
            <Tabs.List disablePassBorderRadius bg="transparent" gap="$3">
              {Object.values(state.colors.palettesByScheme).map(({ id, name }) => (
                <Tabs.Tab rounded="$2" value={id} key={id}>
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
          <YStack gap="$3">
            <XStack gap="$2" items="center">
              <ColorPicker
                value={palette?.backgroundColor}
                onChange={(color) => {
                  state.colors.setBackgroundColor(color)
                }}
              />
              <Label ellipsis size="$3" htmlFor="bg-color">
                Background
              </Label>
            </XStack>
          </YStack>
        </SidebarPanel>

        <Separator />

        <ColorsSidebarPalettes />
        <Separator />
      </SidebarLeft>
    </>
  )
})
