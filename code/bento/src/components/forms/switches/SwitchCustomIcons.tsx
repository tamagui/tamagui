import type { SizeTokens} from '@tamagui/core';
import { View } from '@tamagui/core'
import { Check, X } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Switch } from './common/switchParts'

/** ------ EXAMPLE ------ */

export function SwitchCustomIcons({ size }: { size?: SizeTokens }) {
  const [checked, setChecked] = useState(true)

  return (
    <View flexDirection="column" justifyContent="center" alignItems="center" padding="$8">
      <Switch size={size} checked={checked} onCheckedChange={setChecked}>
        <Switch.Icon placement="left">
          <X color="#fff" />
        </Switch.Icon>
        <Switch.Icon placement="right">
          <Check color="#fff" />
        </Switch.Icon>
        <Switch.Thumb animation="quick" />
      </Switch>
    </View>
  )
}

SwitchCustomIcons.fileName = 'SwitchCustomIcons'
