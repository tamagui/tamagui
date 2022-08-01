import { ChevronDown } from '@tamagui/feather-icons'
import { Sheet } from '@tamagui/sheet'
import React, { useState } from 'react'
import { Button, Circle, Paragraph, XStack, YStack, isWeb } from 'tamagui'

export const SheetDemo = () => {
  const [position, setPosition] = useState(0)
  const [open, setOpen] = useState(true)
  const [modal, setModal] = useState(true)

  return (
    <>
      <XStack space>
        <Button onPress={() => setOpen(true)}>Open</Button>
        {isWeb && <Button onPress={() => setModal((x) => !x)}>{modal ? 'Modal' : 'Inline'}</Button>}
      </XStack>

      <Sheet
        modal={modal}
        open={open}
        onChangeOpen={setOpen}
        snapPoints={[85, 50, 25]}
        dismissOnSnapToBottom
        position={position}
        onChangePosition={setPosition}
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame ai="center" jc="center">
          <Sheet.ScrollView>
            <YStack p="$4" ai="center">
              <Button
                size="$6"
                circular
                icon={ChevronDown}
                onPress={() => {
                  setOpen(false)
                }}
              />

              <Paragraph>
                lVoluptate aute pariatur occaecat ex excepteur tempor. Qui voluptate cupidatat sint
                incididunt excepteur officia nostrud ex minim. Sint ipsum nisi sunt do eiusmod velit
                sit sit occaecat sunt mollit ut minim. Sit officia mollit anim ea voluptate duis.
                Non laborum commodo eiusmod sint occaecat. Irure ad quis id duis anim eiusmod
                voluptate proident amet voluptate amet eu excepteur. Pariatur in incididunt quis
                reprehenderit aute anim enim commodo.
              </Paragraph>

              <Paragraph>
                lVoluptate aute pariatur occaecat ex excepteur tempor. Qui voluptate cupidatat sint
                incididunt excepteur officia nostrud ex minim. Sint ipsum nisi sunt do eiusmod velit
                sit sit occaecat sunt mollit ut minim. Sit officia mollit anim ea voluptate duis.
                Non laborum commodo eiusmod sint occaecat. Irure ad quis id duis anim eiusmod
                voluptate proident amet voluptate amet eu excepteur. Pariatur in incididunt quis
                reprehenderit aute anim enim commodo.
              </Paragraph>

              <Paragraph>
                lVoluptate aute pariatur occaecat ex excepteur tempor. Qui voluptate cupidatat sint
                incididunt excepteur officia nostrud ex minim. Sint ipsum nisi sunt do eiusmod velit
                sit sit occaecat sunt mollit ut minim. Sit officia mollit anim ea voluptate duis.
                Non laborum commodo eiusmod sint occaecat. Irure ad quis id duis anim eiusmod
                voluptate proident amet voluptate amet eu excepteur. Pariatur in incididunt quis
                reprehenderit aute anim enim commodo.
              </Paragraph>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
