import { useState } from 'react'
import { Button, H4, Label, Paragraph, RadioGroup, XStack, YStack } from 'tamagui'
import { useDemoProps } from '../hooks/useDemoProps'
import { AccentTheme } from '../../components/AccentTheme'
const options = [
  {
    title: 'Personal Plan',
    value: 'opt-1',
    description: 'Free!',
  },
  {
    title: 'Silver Plan',
    value: 'opt-2',
    description: 'Exclusive features.',
  },
  {
    title: 'Gold Plan',
    value: 'opt-3',
    description: 'Priority support.',
  },
]

export const PricingCards = () => {
  const [val, setVal] = useState('opt-1')
  const demoProps = useDemoProps()
  return (
    <YStack
      {...demoProps.panelProps}
      {...demoProps.stackOutlineProps}
      {...demoProps.borderRadiusOuterProps}
      {...demoProps.elevationProps}
      {...demoProps.panelPaddingProps}
      bg="$background"
    >
      <YStack
        borderBottomWidth="$0.25"
        borderBottomColor="$borderColor"
        borderWidth="$0"
        pb="$2"
      >
        <H4 {...demoProps.headingFontFamilyProps} size="$4" ta="center">
          Subscribe
        </H4>
        <Paragraph theme="alt2" size="$4" ta="center">
          Select a plan
        </Paragraph>
      </YStack>

      <YStack mx="$-3" flex={1}>
        <RadioGroup {...demoProps.gapPropsMd} value={val} onValueChange={setVal}>
          {options.map((price) => {
            const active = val === price.value
            const htmlId = `demo-item-${price.value}`
            return (
              <Label
                key={price.title}
                f={1}
                htmlFor={htmlId}
                p="$4"
                height="unset"
                display="flex"
                bg="$color2"
                hoverStyle={{
                  bg: '$color3',
                }}
                gap="$4"
                ai="center"
                {...demoProps.borderRadiusProps}
                borderWidth={0}
              >
                <RadioGroup.Item id={htmlId} size="$3" value={price.value}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <YStack f={1}>
                  <Paragraph size="$6" mb={-3}>
                    {price.title}
                  </Paragraph>
                  <Paragraph size="$3" color="$color11">
                    {price.description}
                  </Paragraph>
                </YStack>
              </Label>
            )
          })}
        </RadioGroup>
      </YStack>

      <YStack mt="$4" gap="$4">
        <Paragraph size="$3" ta="center" theme="alt1" color="$color10">
          Have a coupon?{' '}
          <Paragraph tag="span" textDecorationLine="underline">
            Click here
          </Paragraph>
        </Paragraph>
        <XStack gap="$2">
          <Button f={1} size="$5" {...demoProps.borderRadiusProps}>
            Cancel
          </Button>

          <AccentTheme>
            <Button
              f={1}
              size="$5"
              {...demoProps.borderRadiusProps}
              {...demoProps.buttonOutlineProps}
            >
              Continue
            </Button>
          </AccentTheme>
        </XStack>
      </YStack>
    </YStack>
  )
}
