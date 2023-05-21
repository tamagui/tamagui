import { LogoIcon } from '@tamagui/logo'
import { Play } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Button,
  Circle,
  SizableStack,
  SizableText,
  Square,
  XStack,
  YGroup,
  YStack,
  useControllableState,
  useEvent,
} from 'tamagui'

export function AnimationCSSDriverLayoutDemo(props) {
  const [birds, setBirds] = useState(15)
  const [fd, setFd] = useState<'row' | 'column'>('row')

  const onPress = useEvent(() => {
    setBirds(15)
  })
  return (
    <>
      <XStack
        justifyContent="space-between"
        alignContent="space-between"
        flexWrap="wrap"
        width={400}
        height={350}
        fd={fd}
        gap={5}
      >
        {Array(birds)
          .fill(0)
          .map((_, index) => {
            return (
              <Square
                onPress={() => {
                  setBirds(birds - 1)
                }}
                // don't use index as key
                key={index}
                backgroundColor={'$color9'}
                borderRadius={10}
                animation={'bouncy'}
                layout
                size={50}
              >
                <Circle
                  size={20}
                  backgroundColor={'#fff'}
                  bordered
                  position="absolute"
                  left={-5}
                  top={-5}
                >
                  <SizableText>{index + 1}</SizableText>
                </Circle>
                {props.children || <LogoIcon downscale={1.5} />}
              </Square>
            )
          })}
      </XStack>

      <Button
        position="absolute"
        bottom={20}
        left={'$7'}
        icon={Play}
        theme={props.tint}
        size="$5"
        circular
        onPress={onPress}
      />
      <YStack left={'$5'} bottom={90} position="absolute" space>
        <YStack space>
          <SizableText color="$gray11">Flex Direction</SizableText>
          <YGroup>
            <Button
              onPress={() => {
                setFd('row')
              }}
            >
              Row
            </Button>
            <Button
              onPress={() => {
                setFd('column')
              }}
            >
              Column
            </Button>
          </YGroup>
        </YStack>
        <YStack alignItems="center" space>
          <SizableText color="$gray11">Actions</SizableText>
          <YGroup>
            <Button
              onPress={() => {
                setBirds(birds - 1)
              }}
            >
              Remove
            </Button>
            <Button
              onPress={() => {
                setBirds(birds + 1)
              }}
            >
              Add
            </Button>
          </YGroup>
        </YStack>
      </YStack>
    </>
  )
}
