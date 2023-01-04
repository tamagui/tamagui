import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleZeroBold } from '../bold/number-circle-zero-bold'
import { NumberCircleZeroDuotone } from '../duotone/number-circle-zero-duotone'
import { NumberCircleZeroFill } from '../fill/number-circle-zero-fill'
import { NumberCircleZeroLight } from '../light/number-circle-zero-light'
import { NumberCircleZeroRegular } from '../regular/number-circle-zero-regular'
import { NumberCircleZeroThin } from '../thin/number-circle-zero-thin'

const weightMap = {
  regular: NumberCircleZeroRegular,
  bold: NumberCircleZeroBold,
  duotone: NumberCircleZeroDuotone,
  fill: NumberCircleZeroFill,
  light: NumberCircleZeroLight,
  thin: NumberCircleZeroThin,
} as const

export const NumberCircleZero = (props: IconProps) => {
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
