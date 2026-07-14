import { Check } from '@tamagui/lucide-icons-2'
import { Checkbox as TamaguiCheckbox, styled, withStaticProperties } from 'tamagui'

export const Checkbox = withStaticProperties(
  styled(TamaguiCheckbox, {
    theme: 'green',
    width: 20,
    height: 20,
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: 1,
  }),
  {
    Indicator() {
      return (
        <TamaguiCheckbox.Indicator>
          <Check color="$color12" />
        </TamaguiCheckbox.Indicator>
      )
    },
  }
)

export const StyledCheckboxTheme = () => (
  <Checkbox defaultChecked={true} theme="green">
    <Checkbox.Indicator />
  </Checkbox>
)
