import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BluetoothConnectedBold } from '../bold/bluetooth-connected-bold'
import { BluetoothConnectedDuotone } from '../duotone/bluetooth-connected-duotone'
import { BluetoothConnectedFill } from '../fill/bluetooth-connected-fill'
import { BluetoothConnectedLight } from '../light/bluetooth-connected-light'
import { BluetoothConnectedRegular } from '../regular/bluetooth-connected-regular'
import { BluetoothConnectedThin } from '../thin/bluetooth-connected-thin'

const weightMap = {
  regular: BluetoothConnectedRegular,
  bold: BluetoothConnectedBold,
  duotone: BluetoothConnectedDuotone,
  fill: BluetoothConnectedFill,
  light: BluetoothConnectedLight,
  thin: BluetoothConnectedThin,
} as const

export const BluetoothConnected = (props: IconProps) => {
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
