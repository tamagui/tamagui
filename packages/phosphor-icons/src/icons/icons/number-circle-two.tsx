import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleTwoBold } from '../bold/number-circle-two-bold'
import { NumberCircleTwoDuotone } from '../duotone/number-circle-two-duotone'
import { NumberCircleTwoFill } from '../fill/number-circle-two-fill'
import { NumberCircleTwoLight } from '../light/number-circle-two-light'
import { NumberCircleTwoRegular } from '../regular/number-circle-two-regular'
import { NumberCircleTwoThin } from '../thin/number-circle-two-thin'

const weightMap = {
  regular: NumberCircleTwoRegular,
  bold: NumberCircleTwoBold,
  duotone: NumberCircleTwoDuotone,
  fill: NumberCircleTwoFill,
  light: NumberCircleTwoLight,
  thin: NumberCircleTwoThin,
} as const

export const NumberCircleTwo = (props: IconProps) => {
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
