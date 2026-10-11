import { CheckboxWithLabel, SelectDemoContents, SwitchWithLabel } from '@tamagui/demos'
import { H4, RadioGroup, Separator, Spacer, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { AccentTheme } from '../../components/AccentTheme'
import { useDemoProps } from '../hooks/useDemoProps'
import { RadioGroupItemWithLabel } from '../views/RadioGroupItemWithLabel'

export const Components = () => {
  const demoProps = useDemoProps()

  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
    >
      <H4 {...demoProps.headingFontFamilyProps}>Kitchen Sink</H4>

      <Separator />

      <XStack width="100%" {...demoProps.gapPropsLg} flexWrap="wrap">
        <XStack {...demoProps.gapPropsLg}>
          <AccentTheme>
            <Button size="sm" {...demoProps.borderRadiusProps}>
              Active
            </Button>
          </AccentTheme>
          <Button size="sm" {...demoProps.borderRadiusProps}>
            Subtle
          </Button>
        </XStack>

        <Spacer flex={1} />

        <XStack {...demoProps.gapPropsLg} flex={1} flexBasis="auto" flexWrap="wrap">
          <SelectDemoContents size="sm" />
        </XStack>
      </XStack>

      <XStack gap="4" flexWrap="wrap">
        <YStack flex={1} flexBasis="auto" gap="1-5">
          <CheckboxWithLabel defaultChecked size="md" />

          <RadioGroup defaultValue="1" name="form">
            <XStack>
              <RadioGroupItemWithLabel size="sm" value="1" label="First" />
              <RadioGroupItemWithLabel size="sm" value="2" label="Second" />
            </XStack>
          </RadioGroup>

          <SwitchWithLabel size="sm" />
        </YStack>
      </XStack>

      <Spacer size="1-5" />
    </YStack>
  )
}
