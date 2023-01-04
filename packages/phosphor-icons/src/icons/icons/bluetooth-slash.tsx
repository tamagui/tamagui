import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BluetoothSlashBold } from '../bold/bluetooth-slash-bold'
import { BluetoothSlashDuotone } from '../duotone/bluetooth-slash-duotone'
import { BluetoothSlashFill } from '../fill/bluetooth-slash-fill'
import { BluetoothSlashLight } from '../light/bluetooth-slash-light'
import { BluetoothSlashRegular } from '../regular/bluetooth-slash-regular'
import { BluetoothSlashThin } from '../thin/bluetooth-slash-thin'

const weightMap = {
  regular: BluetoothSlashRegular,
  bold: BluetoothSlashBold,
  duotone: BluetoothSlashDuotone,
  fill: BluetoothSlashFill,
  light: BluetoothSlashLight,
  thin: BluetoothSlashThin,
} as const

export const BluetoothSlash = (props: IconProps) => {
  const {
    color: contextColor,
    size: contextSize,
    weight: contextWeight,
    style: contextStyle,
  } = useContext(IconContext)

  const {
    color = contextColor ?? 'black',
    size = contextSize ?? 24,
    weight = contextWeight ?? 'regular',
    style = contextStyle ?? {},
    ...otherProps
  } = props

  const Component = weightMap[weight]

  return (
    <Component
      color={color}
      size={size}
      weight={weight}
      style={style}
      {...otherProps}
    />
  )
}
