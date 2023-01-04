import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberZeroBold } from '../bold/number-zero-bold'
import { NumberZeroDuotone } from '../duotone/number-zero-duotone'
import { NumberZeroFill } from '../fill/number-zero-fill'
import { NumberZeroLight } from '../light/number-zero-light'
import { NumberZeroRegular } from '../regular/number-zero-regular'
import { NumberZeroThin } from '../thin/number-zero-thin'

const weightMap = {
  regular: NumberZeroRegular,
  bold: NumberZeroBold,
  duotone: NumberZeroDuotone,
  fill: NumberZeroFill,
  light: NumberZeroLight,
  thin: NumberZeroThin,
} as const

export const NumberZero = (props: IconProps) => {
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
