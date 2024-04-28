import { H4, Paragraph, YStack } from 'tamagui'

import { AccentTheme } from '../../AccentTheme'
import { useDemoProps } from '../../hooks/useDemoProps'
import { NewMembersChart } from './Charts'

export const PieScreen = () => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <YStack borderBottomWidth="$0.25" borderBottomColor="$borderColor" pb="$4">
        <H4 {...demoProps.headingFontFamilyProps} {...demoProps.headingFontFamilyProps}>
          Traffic Sources
        </H4>
        <Paragraph {...demoProps.panelDescriptionProps}>
          Organic and non-organic
        </Paragraph>
      </YStack>

      <YStack flex={1}>
        <AccentTheme>
          <NewMembersChart />
        </AccentTheme>
      </YStack>
    </YStack>
  )
}
