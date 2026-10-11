import { H4, Paragraph, XStack, YStack } from 'tamagui'
import { useDemoProps } from '../hooks/useDemoProps'
import { BarChart, LineChart } from './Charts'
import { memo } from 'react'

export const StatisticsBarScreen = memo(() => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      borderColor="color-3"
    >
      <YStack
        borderBottomWidth="0.5px"
        borderBottomColor="border-color"
        paddingBottom="0"
        paddingTop="0"
        paddingRight="0"
        paddingLeft="0"
      >
        <XStack justify="space-between">
          <YStack gap="1-5">
            <H4 {...demoProps.headingFontFamilyProps} mt="0" color="color-11">
              New user sign-ups
            </H4>
            <XStack items="center" gap="2">
              <H4 size="10">+1,200</H4>
              <XStack bg="color-4" px="2" py="0-5" rounded="4" items="center">
                <Paragraph size="2" color="color-11" fontWeight="600">
                  +14.2%
                </Paragraph>
              </XStack>
            </XStack>
            <Paragraph mt="1-5" {...demoProps.panelDescriptionProps} fontSize="3">
              Data from the past 6 months
            </Paragraph>
          </YStack>
        </XStack>
      </YStack>

      <YStack flex={1} flexBasis="auto" gap="8" mx="-2" justify="space-around">
        <XStack maxH={200} gap="4">
          <BarChart />
        </XStack>
      </YStack>
    </YStack>
  )
})

export const StatisticsLineScreen = memo(() => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      maxH={400}
      overflow="hidden"
    >
      <YStack
        borderBottomWidth="0.5px"
        borderBottomColor="border-color"
        paddingBottom="0"
        paddingTop="0"
        paddingRight="0"
        paddingLeft="0"
      >
        <XStack justify="space-between">
          <YStack gap="1-5">
            <H4 {...demoProps.headingFontFamilyProps} mt="0">
              Revenue Growth
            </H4>
            <XStack items="center" gap="2">
              <H4 size="10">$42.3K</H4>
              <XStack bg="color-4" px="2" py="0-5" rounded="4" items="center">
                <Paragraph size="2" color="color-11" fontWeight="600">
                  +28.4%
                </Paragraph>
              </XStack>
            </XStack>
            <Paragraph mt="0-5" {...demoProps.panelDescriptionProps} fontSize="3">
              The past 6 months
            </Paragraph>
          </YStack>
        </XStack>
      </YStack>

      <YStack flex={1} flexBasis="auto" gap="8" mx="-2" justify="space-around">
        <XStack maxH={200} gap="4">
          <LineChart />
        </XStack>
      </YStack>
    </YStack>
  )
})
