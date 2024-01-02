import * as sections from '@tamagui/bento'
import { ButtonDemo, InputsDemo, SelectDemo } from '@tamagui/demos'
import {
  Anchor,
  Button,
  Card,
  H1,
  H2,
  H4,
  H5,
  Image,
  Paragraph,
  Separator,
  Spacer,
  Text,
  Theme,
  XStack,
  YStack,
  useThemeName,
} from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

function Gradient() {
  const theme = useThemeName()
  return (
    <LinearGradient
      colors={
        theme === 'light'
          ? ['#e5fafa', '#edf8fc', '#e8e2f7']
          : ['#1a202c', '#2d3748', '#4a5568']
      }
      start={[0, 1]}
      end={[0, 0]}
      fullscreen
    />
  )
}

export default function _page() {
  return (
    <YStack p={28} f={1} bc="transparent">
      <XStack m={-24}>
        <XStack gap="$6" p={24} bc="transparent" py="$10" jc="space-between" w={'100%'}>
          <Gradient />
          <YStack zi={100} bc="transparent" jc="space-between" fs={1} ai="flex-start">
            <H1 fontWeight={'600'} fontSize={'$10'}>
              Beautiful CrossPlafrom
              <br />
              UI Components
              <br />
              <Text fontSize={'$9'} color={'$blue10'}>
                Ready for React and React Native
              </Text>
            </H1>
            <Paragraph fontWeight={'300'} color="$gray11" fontSize={'$6'}>
              Well designed, beautiful, responsive and accessible cross-platform UI
              components for React and React Native
            </Paragraph>

            <XStack gap="$3">
              <Theme name={'light'}>
                <Button
                  bc="#fff"
                  boc="$gray7"
                  hoverStyle={{
                    bc: '$gray2',
                  }}
                  pressStyle={{
                    bc: '$gray1',
                    boc: '$gray12',
                  }}
                >
                  <Button.Text>Getting Started</Button.Text>
                </Button>
              </Theme>
              <Button
                color={'#fff'}
                bc="$blue9Dark"
                boc="$blue5"
                hoverStyle={{
                  bc: '$blue10Dark',
                  boc: '$blue5',
                }}
                pressStyle={{
                  bc: '$blue9Dark',
                  boc: '$blue5',
                }}
              >
                <Button.Text>Make it yours</Button.Text>
              </Button>
            </XStack>
          </YStack>
          <XStack zi={100} gap="$2">
            <Card elevate bc="#fff">
              <ButtonDemo />
            </Card>
            <Card elevate bc="#fff">
              <InputsDemo />
            </Card>
            <Card p="$4" elevate bc="#fff">
              <SelectDemo />
            </Card>
          </XStack>
        </XStack>
      </XStack>
      <Spacer size={'$8'} />
      <H2>Sections</H2>
      <Paragraph size={'$5'} color={'$gray11'}>
        components are divided into multiple sections and each section has multiple group
        of related components
      </Paragraph>
      <Spacer size={'$8'} />
      <YStack gap="$12">
        {sections.listingData.sections.map(({ sectionName, parts }) => {
          return (
            <YStack gap="$4" jc={'space-between'}>
              <H2 fontSize={'$8'} f={2}>
                {sectionName}
              </H2>
              <Separator />
              <XStack gap={'$6'} f={4} fw="wrap" fs={1}>
                {parts.map(({ name: partsName, numberOfComponents, route }) => (
                  <ComponentGroupsBanner
                    path={route}
                    name={partsName}
                    numberOfComponents={numberOfComponents}
                  />
                ))}
              </XStack>
            </YStack>
          )
        })}
      </YStack>
    </YStack>
  )
}

function ComponentGroupsBanner({
  name,
  numberOfComponents,
  path,
}: {
  name: string
  numberOfComponents: number
  path: string
}) {
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
      href={BASE_PATH + path}
    >
      <Image bc="$background" w={200} h={200} source={{ uri: '' }} />
      <YStack px="$4" py="$2">
        <H4 fontWeight={'normal'} fontSize="$4">
          {name}
        </H4>
        <H5 fontWeight={'normal'} fontSize={'$2'}>
          {numberOfComponents} components
        </H5>
      </YStack>
    </Anchor>
  )
}

const BASE_PATH = ' /bento'
