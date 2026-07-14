import { styled } from '@tamagui/core'

import { Checkbox } from '../src'

const CheckboxSkin = styled(Checkbox, {
  name: 'TypeTestCheckbox',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,

  variants: {
    size: {
      compact: {
        width: 18,
        height: 18,
        borderRadius: 4,
      },
    },
  } as const,
})

const CheckboxIndicatorSkin = styled(Checkbox.Indicator, {
  name: 'TypeTestCheckboxIndicator',
  width: '50%',
  height: '50%',
  backgroundColor: '$color',
})

export const CheckboxPartsTypeTest = () => (
  <CheckboxSkin
    aria-label="type test"
    size="compact"
    backgroundColor="$background"
    activeStyle={{ backgroundColor: '$backgroundPress' }}
  >
    <CheckboxIndicatorSkin />
  </CheckboxSkin>
)

export const CheckboxDirectStyleTypeTest = () => (
  <Checkbox width={20} height={20} borderRadius="$2">
    <Checkbox.Indicator opacity={0.5} />
  </Checkbox>
)
