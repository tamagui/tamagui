import { styled, withStaticProperties } from '@tamagui/core'
import { Switch } from '../src'

const SwitchSkinFrame = styled(Switch, {
  name: 'SwitchSkinFrame',
  backgroundColor: '$background',
  borderRadius: '$10',
})

const SwitchSkinThumb = styled(Switch.Thumb, {
  name: 'SwitchSkinThumb',
  backgroundColor: '$color',
  borderRadius: '$10',
})

const SwitchSkin = withStaticProperties(SwitchSkinFrame, {
  Thumb: SwitchSkinThumb,
})

export const SwitchSkinTypeTest = () => (
  <SwitchSkin size="$4" defaultChecked aria-label="Notifications">
    <SwitchSkin.Thumb transition="quick" />
  </SwitchSkin>
)

export const SwitchPartsTypeTest = () => (
  <Switch.Frame width={48} height={24}>
    <Switch.Thumb width={20} height={20} />
  </Switch.Frame>
)
