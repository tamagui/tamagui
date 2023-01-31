import { useState } from 'react'
import { Switch } from 'react-native'

import { SwitchProps } from './Switch'

export const NativeSwitch = (props: SwitchProps) => {
  const [isChecked, setChecked] = useState(props.checked)

  return (
    <Switch
      accessibilityRole="switch"
      aria-checked={props.checked}
      aria-labelledby={props.labeledBy}
      aria-required={props.required}
      data-disabled={props.disabled ? '' : undefined}
      disabled={props.disabled}
      value={isChecked}
      ios_backgroundColor="#3e3e3e"
      onValueChange={(event) => {
        props.onCheckedChange?.(isChecked as boolean)
        setChecked((prevChecked) => !prevChecked)
      }}
    />
  )
}
