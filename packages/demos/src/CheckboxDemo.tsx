import { createCheckbox } from '@tamagui/checkbox-headless'
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { Pressable, Text, View } from 'react-native'
import { Checkbox, CheckboxProps, Label, SizeTokens, XStack, YStack } from 'tamagui'
const HeadlessCheckbox = createCheckbox({
  Frame: ({ children: childrenProp, style, ...props }) => {
    const children = childrenProp
    return (
      <Pressable
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
        }}
        {...props}
      >
        {children}
      </Pressable>
    )
  },
  Indicator: (props) => (
    <View {...props}>
      <Text>checked</Text>
    </View>
  ),
})
export function CheckboxDemo() {
  return (
    <YStack width={300} alignItems="center" space="$2">
      <form>
        <HeadlessCheckbox>
          <HeadlessCheckbox.Indicator />
        </HeadlessCheckbox>
      </form>
      <CheckboxWithLabel size="$3" />
      <CheckboxWithLabel size="$4" defaultChecked />
      <CheckboxWithLabel size="$5" disabled label="Accept terms (disabled)" />
    </YStack>
  )
}

export function CheckboxWithLabel({
  size,
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxProps & { size: SizeTokens; label?: string }) {
  const id = `checkbox-${size.toString().slice(1)}`
  return (
    <XStack width={300} alignItems="center" space="$4">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}
