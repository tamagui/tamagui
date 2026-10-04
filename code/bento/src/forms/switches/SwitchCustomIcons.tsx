import type { ComponentSize } from '@tamagui/core'
import { Check, X } from '../../icons'
import { useState } from 'react'
import { View, type SizeTokens } from 'tamagui'
import { Switch } from './common/switchParts'

/** ------ EXAMPLE ------ */

export function SwitchCustomIcons({ size }: { size?: ComponentSize }) {
  const [checked, setChecked] = useState(true)

  return (
    <View flexDirection="column" justify="center" items="center" p="8">
      <Switch
        size={size}
        checked={checked}
        onCheckedChange={setChecked}
        backgroundColor="red-10"
        activeStyle={{ backgroundColor: 'green-10' }}
      >
        <Switch.Icon placement="left">
          <Check color="#fff" />
        </Switch.Icon>
        <Switch.Icon placement="right">
          <X color="#fff" />
        </Switch.Icon>
        <Switch.Thumb transition="200ms" />
      </Switch>
    </View>
  )
}
