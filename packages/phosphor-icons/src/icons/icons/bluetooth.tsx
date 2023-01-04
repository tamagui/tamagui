import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BluetoothBold } from '../bold/bluetooth-bold'
import { BluetoothDuotone } from '../duotone/bluetooth-duotone'
import { BluetoothFill } from '../fill/bluetooth-fill'
import { BluetoothLight } from '../light/bluetooth-light'
import { BluetoothRegular } from '../regular/bluetooth-regular'
import { BluetoothThin } from '../thin/bluetooth-thin'

const weightMap = {
  regular: BluetoothRegular,
  bold: BluetoothBold,
  duotone: BluetoothDuotone,
  fill: BluetoothFill,
  light: BluetoothLight,
  thin: BluetoothThin,
} as const

export const Bluetooth = (props: IconProps) => {
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
