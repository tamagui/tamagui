import { Check } from '@tamagui/lucide-icons-2'
import {
  Checkbox as TamaguiCheckbox,
  styled,
  Theme,
  View,
  withStaticProperties,
} from 'tamagui'

export const Checkbox = withStaticProperties(
  styled(TamaguiCheckbox, {
    theme: 'green',
    width: 20,
    height: 20,
    backgroundColor: 'background',
    borderColor: 'border-color',
    borderWidth: 1,
  }),
  {
    Indicator() {
      return (
        <TamaguiCheckbox.Indicator>
          <Check color="color-11" />
        </TamaguiCheckbox.Indicator>
      )
    },
  }
)

export const StyledCheckboxTheme = () => (
  <>
    <Checkbox testID="unchecked" theme="green">
      <Checkbox.Indicator />
    </Checkbox>
    <Checkbox testID="checked" defaultChecked={true} theme="green">
      <Checkbox.Indicator />
    </Checkbox>
    {/* what `activeTheme: 'brand'` is supposed to resolve to */}
    <Theme name="brand">
      <View testID="brand-reference" width={20} height={20} bg="background" />
    </Theme>
  </>
)
