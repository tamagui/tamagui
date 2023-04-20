import { Check } from '@tamagui/lucide-icons'
import { Checkbox as TamaguiCheckbox, styled, withStaticProperties } from 'tamagui'

export const Checkbox = withStaticProperties(
  styled(TamaguiCheckbox, {
    theme: 'green',
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

export default () => <Checkbox debug="verbose" theme="green" />
