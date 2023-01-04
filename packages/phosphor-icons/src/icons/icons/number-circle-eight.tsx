import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleEightBold } from '../bold/number-circle-eight-bold'
import { NumberCircleEightDuotone } from '../duotone/number-circle-eight-duotone'
import { NumberCircleEightFill } from '../fill/number-circle-eight-fill'
import { NumberCircleEightLight } from '../light/number-circle-eight-light'
import { NumberCircleEightRegular } from '../regular/number-circle-eight-regular'
import { NumberCircleEightThin } from '../thin/number-circle-eight-thin'

const weightMap = {
  regular: NumberCircleEightRegular,
  bold: NumberCircleEightBold,
  duotone: NumberCircleEightDuotone,
  fill: NumberCircleEightFill,
  light: NumberCircleEightLight,
  thin: NumberCircleEightThin,
} as const

export const NumberCircleEight = (props: IconProps) => {
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
