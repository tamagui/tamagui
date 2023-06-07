import { LogoIcon } from '@tamagui/logo'
import { Play } from '@tamagui/lucide-icons'
import { forwardRef, useState } from 'react'
import {
  Button,
  Circle,
  SizableStack,
  SizableText,
  Square,
  Stack,
  XStack,
  YGroup,
  YStack,
  useControllableState,
  useEvent,
} from 'tamagui'

export function AnimationCSSDriverLayoutDemo(props) {
  const [birds, setBirds] = useState(1)
  const [fd, setFd] = useState<'row' | 'column'>('row')

  const onPress = useEvent(() => {
    setBirds(5)
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
            return <Bird index={index} birds={birds} setBirds={setBirds} key={index} />
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

interface PropsBird {
  birds: any
  setBirds: any
  index: any
}
const Bird = forwardRef((props: PropsBird, ref: any) => (
  <YStack
    width={60}
    ref={ref}
    height={60}
    onPress={() => {
      props.setBirds(props.birds - 1)
    }}
    hoverStyle={{
      width: 100,
      height: 100,
    }}
    // don't use index as key
    backgroundColor={'$color9'}
    borderRadius={10}
    animation={'bouncy'}
    layout
  >
    <LogoIcon downscale={1.5} />
  </YStack>
))
