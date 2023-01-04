import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PinwheelBold } from '../bold/pinwheel-bold'
import { PinwheelDuotone } from '../duotone/pinwheel-duotone'
import { PinwheelFill } from '../fill/pinwheel-fill'
import { PinwheelLight } from '../light/pinwheel-light'
import { PinwheelRegular } from '../regular/pinwheel-regular'
import { PinwheelThin } from '../thin/pinwheel-thin'

const weightMap = {
  regular: PinwheelRegular,
  bold: PinwheelBold,
  duotone: PinwheelDuotone,
  fill: PinwheelFill,
  light: PinwheelLight,
  thin: PinwheelThin,
} as const

export const Pinwheel = (props: IconProps) => {
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
