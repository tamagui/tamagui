import { ButtonDemo, CardDemo } from '@tamagui/demos'
import {
  Anchor,
  Button,
  H1,
  H2,
  H4,
  H5,
  Image,
  Paragraph,
  Separator,
  Spacer,
  XStack,
  YStack,
} from 'tamagui'

export default function page() {
  return (
    <YStack p={'$6'} f={1} bc="$blue1">
      <XStack jc="space-between" w={'100%'}>
        <YStack jc="space-between" fs={1} ai="flex-start">
          <H1>Beatiful, Responsive, And CrossPlatform UI Components</H1>
          <Button boc="$blue5">
            <Button.Text>Documentation</Button.Text>
          </Button>
        </YStack>
        <XStack>
          <CardDemo />
          <ButtonDemo />
        </XStack>
      </XStack>
      <Spacer size={'$8'} />
      <Separator />
      <Spacer size={'$4'} />
      <H2>Sections</H2>
      <Paragraph size={'$5'} color={'$gray11'}>
        components are divided into multiple sections and each section has multiple group
        of related components
      </Paragraph>
      <Spacer size={'$8'} />
      <Separator />
      <Spacer size={'$4'} />
      <YStack>
        <XStack jc={'space-between'}>
          <H2 fontSize={'$8'} f={2} flexBasis={0}>
            Forms
          </H2>
          <XStack gap={'$6'} f={4} flexBasis={0} fw="wrap" fs={1}>
            {Array(9)
              .fill(0)
              .map(() => (
                <ComponentGropusBanner />
              ))}
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  )
}

function ComponentGropusBanner() {
  return (
    <Anchor
      hoverStyle={{
        borderColor: '$blue5',
      }}
      bw={1}
      boc="$gray2"
      br="$2"
      ov="hidden"
      accessible
      cursor="pointer"
      href="#"
    >
      <Image width={200} height={200} source={{ uri: './bento/sections/comp.png' }} />
      <YStack px="$4" py="$2">
        <H4 fontWeight={'normal'} fontSize="$4">
          Select Menus
        </H4>
        <H5 fontWeight={'normal'} fontSize={'$2'}>
          5 components
        </H5>
      </YStack>
    </Anchor>
  )
}
