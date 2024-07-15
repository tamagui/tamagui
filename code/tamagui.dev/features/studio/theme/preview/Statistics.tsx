import { ChevronRight } from '@tamagui/lucide-icons'
import { Button, H4, Paragraph, XStack, YStack } from 'tamagui'
import { useDemoProps } from '../hooks/useDemoProps'
import { BarChart, LineChart } from './Charts'

export const StatisticsBarScreen = () => {
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <YStack
        borderBottomWidth="$0.25"
        borderBottomColor="$borderColor"
        pb="$4"
        bbw="$0"
        p="$0"
      >
        <XStack jc="space-between">
          <YStack gap="$2">
            <H4 size="$3" {...demoProps.headingFontFamilyProps} mt="$0" color="$color10">
              New user sign-ups
            </H4>
            <H4 size="$10">+1,200</H4>
            <Paragraph mt="$2" {...demoProps.panelDescriptionProps} fontSize="$3">
              Data from the past 6 months
            </Paragraph>
          </YStack>
          <>
            <Button
              size="$2"
              iconAfter={ChevronRight}
              {...demoProps.borderRadiusProps}
              {...demoProps.buttonOutlineProps}
            >
              More Info
            </Button>
          </>
        </XStack>
      </YStack>

      <YStack flex={1} gap="$6" mx="$-4" f={1} jc="space-around">
        {/* <ScrollView
          contentContainerStyle={{
            minWidth: '100%',
          }}
          horizontal
          f={0}
          showsHorizontalScrollIndicator={false}
        >
          <XStack px="$4" jc="space-around" w="100%" f={1} gap="$8">
            <OverviewCard
              title="New Users"
              value="1,000"
              badgeText="Reached Goal!"
              width={120}
            />
            <OverviewCard title="ARR" value="950,000" width={120} />
            <OverviewCard title="Sales" value="50" width={120} />
          </XStack>
        </ScrollView> */}

        <XStack gap="$4">
          <BarChart />
        </XStack>
      </YStack>
    </YStack>
  )
}

export const StatisticsLineScreen = () => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <YStack
        borderBottomWidth="$0.25"
        borderBottomColor="$borderColor"
        pb="$4"
        bbw="$0"
        p="$0"
      >
        <XStack jc="space-between">
          <YStack gap="$2">
            <H4
              size="$3"
              {...demoProps.headingFontFamilyProps}
              mt="$0"
              // color={demoProps.hasAccent ? accentTokenName : '$color10'}
            >
              Revenue Growth
            </H4>
            <H4 size="$10">$42.3K</H4>
            <Paragraph mt="$1" {...demoProps.panelDescriptionProps} fontSize="$3">
              The past 6 months
            </Paragraph>
          </YStack>
          <>
            <Button
              size="$2"
              iconAfter={ChevronRight}
              {...demoProps.borderRadiusProps}
              {...demoProps.buttonOutlineProps}
            >
              More Info
            </Button>
          </>
        </XStack>
      </YStack>

      <YStack flex={1} gap="$6" mx="$-4" f={1} jc="space-around">
        <XStack gap="$4">
          {/* <Theme name={'accent' as any}> */}
          <LineChart />
          {/* </Theme> */}
        </XStack>
      </YStack>
    </YStack>
  )
}
