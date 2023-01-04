import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberTwoBold } from '../bold/number-two-bold'
import { NumberTwoDuotone } from '../duotone/number-two-duotone'
import { NumberTwoFill } from '../fill/number-two-fill'
import { NumberTwoLight } from '../light/number-two-light'
import { NumberTwoRegular } from '../regular/number-two-regular'
import { NumberTwoThin } from '../thin/number-two-thin'

const weightMap = {
  regular: NumberTwoRegular,
  bold: NumberTwoBold,
  duotone: NumberTwoDuotone,
  fill: NumberTwoFill,
  light: NumberTwoLight,
  thin: NumberTwoThin,
} as const

export const NumberTwo = (props: IconProps) => {
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
