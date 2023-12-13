import { ButtonDemo, InputsDemo, SelectDemo } from '@components/demos'
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
} from 'tamagui'
export default function page() {
  return (
    <YStack p={28} f={1} bc="transparent">
      <div
        style={{
          background: 'linear-gradient(120deg, #e5fafa, #edf8fc, #e8e2f7);',
          margin: -24,
        }}
      >
        <XStack gap="$6" p={24} bc="transparent" py="$10" jc="space-between" w={'100%'}>
          <YStack bc="transparent" jc="space-between" fs={1} ai="flex-start">
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
                  boc="$gray12"
                  hoverStyle={{
                    bc: '$gray2',
                    boc: '$gray12',
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
          <XStack gap="$2">
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
      </div>
      <Spacer size={'$8'} />
      <H2>Sections</H2>
      <Paragraph size={'$5'} color={'$gray11'}>
        components are divided into multiple sections and each section has multiple group
        of related components
      </Paragraph>
      <Spacer size={'$8'} />
      <Separator />
      <Spacer size={'$4'} />
      <YStack>
        {data.sections.map(({ name, parts }) => {
          return (
            <XStack jc={'space-between'}>
              <H2 fontSize={'$8'} f={2} flexBasis={0}>
                {name}
              </H2>
              <XStack gap={'$6'} f={4} flexBasis={0} fw="wrap" fs={1}>
                {parts.map(({ name: partsName, numberOfComponents, path }) => (
                  <ComponentGropusBanner
                    path={path}
                    name={partsName}
                    numberOfComponents={numberOfComponents}
                  />
                ))}
              </XStack>
            </XStack>
          )
        })}
      </YStack>
    </YStack>
  )
}

function ComponentGropusBanner({
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
      <Image width={200} height={200} source={{ uri: './bento/sections/comp.png' }} />
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

const data = {
  sections: [
    {
      name: 'forms',
      parts: [
        {
          name: 'Inputs',
          numberOfComponents: 10,
          path: '/forms/inputs',
        },
      ],
    },
  ],
}
