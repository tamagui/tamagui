import { styled, withStaticProperties } from '@tamagui/core'

import { RadioGroup } from '../src'

const RadioGroupRootSkin = styled(RadioGroup, {
  name: 'TypeTestRadioGroup',
  gap: '$2',
})

const RadioGroupItemSkin = styled(RadioGroup.Item, {
  name: 'TypeTestRadioGroupItem',
  width: 20,
  height: 20,
  borderWidth: 1,
  borderRadius: 10,
})

const RadioGroupIndicatorSkin = styled(RadioGroup.Indicator, {
  name: 'TypeTestRadioGroupIndicator',
  width: '50%',
  height: '50%',
  borderRadius: 10,
  backgroundColor: '$color',
})

const RadioGroupSkin = withStaticProperties(RadioGroupRootSkin, {
  Item: RadioGroupItemSkin,
  Indicator: RadioGroupIndicatorSkin,
})

export const RadioGroupPartsTypeTest = () => (
  <RadioGroupSkin defaultValue="one" orientation="horizontal">
    <RadioGroupSkin.Item value="one">
      <RadioGroupSkin.Indicator />
    </RadioGroupSkin.Item>
  </RadioGroupSkin>
)

export const RadioGroupDirectStyleTypeTest = () => (
  <RadioGroup gap="$2">
    <RadioGroup.Item value="one" width={20} height={20} borderWidth={1}>
      <RadioGroup.Indicator opacity={0.5} />
    </RadioGroup.Item>
  </RadioGroup>
)
