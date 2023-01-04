import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BluetoothXBold } from '../bold/bluetooth-x-bold'
import { BluetoothXDuotone } from '../duotone/bluetooth-x-duotone'
import { BluetoothXFill } from '../fill/bluetooth-x-fill'
import { BluetoothXLight } from '../light/bluetooth-x-light'
import { BluetoothXRegular } from '../regular/bluetooth-x-regular'
import { BluetoothXThin } from '../thin/bluetooth-x-thin'

const weightMap = {
  regular: BluetoothXRegular,
  bold: BluetoothXBold,
  duotone: BluetoothXDuotone,
  fill: BluetoothXFill,
  light: BluetoothXLight,
  thin: BluetoothXThin,
} as const

export const BluetoothX = (props: IconProps) => {
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
