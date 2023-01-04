import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GasPumpBold } from '../bold/gas-pump-bold'
import { GasPumpDuotone } from '../duotone/gas-pump-duotone'
import { GasPumpFill } from '../fill/gas-pump-fill'
import { GasPumpLight } from '../light/gas-pump-light'
import { GasPumpRegular } from '../regular/gas-pump-regular'
import { GasPumpThin } from '../thin/gas-pump-thin'

const weightMap = {
  regular: GasPumpRegular,
  bold: GasPumpBold,
  duotone: GasPumpDuotone,
  fill: GasPumpFill,
  light: GasPumpLight,
  thin: GasPumpThin,
} as const

export const GasPump = (props: IconProps) => {
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
