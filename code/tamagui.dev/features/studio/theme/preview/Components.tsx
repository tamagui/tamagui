import { CheckboxWithLabel, SelectDemoItem, SwitchWithLabel } from '@tamagui/demos'
import { Filter } from '@tamagui/lucide-icons'
import {
  Button,
  Group,
  H4,
  Input,
  RadioGroup,
  Separator,
  Spacer,
  XGroup,
  XStack,
  YStack,
} from 'tamagui'
import { useDemoProps } from '../hooks/useDemoProps'
import { RadioGroupItemWithLabel } from '../views/RadioGroupItemWithLabel'
import { AccentTheme } from '../../components/AccentTheme'

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

      <XStack w="100%" {...demoProps.gapPropsLg} fw="wrap">
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

        <XStack {...demoProps.gapPropsLg} f={1} flexWrap="wrap">
          <YStack maxWidth={'47%'}>
            <SelectDemoItem size="$3" />
          </YStack>
          <XGroup {...demoProps.borderRadiusProps} bw={0} maxWidth={'47%'}>
            <Group.Item>
              <Input size="$3" placeholder="Search" />
            </Group.Item>
            <Group.Item>
              <Button size="$3" icon={Filter}></Button>
            </Group.Item>
          </XGroup>
        </XStack>
      </XStack>

      <XStack gap="$4" flexWrap="wrap">
        {/* <Card
            f={1}
            elevate
            size="$3"
            bordered
            minWidth={200}
            {...demoProps.borderRadiusProps}
          >
            <Card.Header padded>
              <H4 {...demoProps.headingFontFamilyProps}>Card Title</H4>
              <Paragraph theme="alt2">Now available</Paragraph>
            </Card.Header>
          </Card> */}

        <YStack f={1} gap="$2">
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
