import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleOneBold } from '../bold/number-circle-one-bold'
import { NumberCircleOneDuotone } from '../duotone/number-circle-one-duotone'
import { NumberCircleOneFill } from '../fill/number-circle-one-fill'
import { NumberCircleOneLight } from '../light/number-circle-one-light'
import { NumberCircleOneRegular } from '../regular/number-circle-one-regular'
import { NumberCircleOneThin } from '../thin/number-circle-one-thin'

const weightMap = {
  regular: NumberCircleOneRegular,
  bold: NumberCircleOneBold,
  duotone: NumberCircleOneDuotone,
  fill: NumberCircleOneFill,
  light: NumberCircleOneLight,
  thin: NumberCircleOneThin,
} as const

export const NumberCircleOne = (props: IconProps) => {
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
