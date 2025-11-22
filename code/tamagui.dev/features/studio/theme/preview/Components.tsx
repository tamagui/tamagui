import { CheckboxWithLabel, SelectDemoContents, SwitchWithLabel } from '@tamagui/demos'
import { Button, H4, RadioGroup, Separator, Spacer, XStack, YStack } from 'tamagui'
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
            <Button size="$3" {...demoProps.borderRadiusProps}>
              Active
            </Button>
          </AccentTheme>
          <Button size="$3" theme="alt1" {...demoProps.borderRadiusProps}>
            Subtle
          </Button>
        </XStack>

        <Spacer flex />

        <XStack {...demoProps.gapPropsLg} flex={1} flexWrap="wrap">
          <SelectDemoContents size="$3" />
        </XStack>
      </XStack>

      <XStack gap="$4" flexWrap="wrap">
        <YStack flex={1} gap="$2">
          <CheckboxWithLabel defaultChecked size="$4" />

          <RadioGroup defaultValue="1" name="form">
            <XStack>
              <RadioGroupItemWithLabel size="$3" value="1" label="First" />
              <RadioGroupItemWithLabel size="$3" value="2" label="Second" />
            </XStack>
          </RadioGroup>

          <SwitchWithLabel size="$3" />
        </YStack>
      </XStack>

      <Spacer size="$2" />
    </YStack>
  )
}
