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
      borderColor="$color3"
    >
      <YStack borderBottomWidth="$0.25" borderBottomColor="$borderColor" pb="$4" p="$0">
        <XStack justify="space-between">
          <YStack gap="$2">
            <H4 {...demoProps.headingFontFamilyProps} mt="$0" color="$color11">
              New user sign-ups
            </H4>
            <H4 size="$10">+1,200</H4>
            <Paragraph mt="$2" {...demoProps.panelDescriptionProps} fontSize="$3">
              Data from the past 6 months
            </Paragraph>
          </YStack>
        </XStack>
      </YStack>

      <YStack flex={1} flexBasis="auto" gap="$6" mx="$-4" justify="space-around">
        <XStack maxH={200} gap="$4">
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
      <YStack borderBottomWidth="$0.25" borderBottomColor="$borderColor" pb="$4" p="$0">
        <XStack justify="space-between">
          <YStack gap="$2">
            <H4 {...demoProps.headingFontFamilyProps} mt="$0">
              Revenue Growth
            </H4>
            <H4 size="$10">$42.3K</H4>
            <Paragraph mt="$1" {...demoProps.panelDescriptionProps} fontSize="$3">
              The past 6 months
            </Paragraph>
          </YStack>
        </XStack>
      </YStack>

      <YStack flex={1} flexBasis="auto" gap="$6" mx="$-4" justify="space-around">
        <XStack maxH={200} gap="$4">
          <LineChart />
        </XStack>
      </YStack>
    </YStack>
  )
})
