import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleThreeBold } from '../bold/number-circle-three-bold'
import { NumberCircleThreeDuotone } from '../duotone/number-circle-three-duotone'
import { NumberCircleThreeFill } from '../fill/number-circle-three-fill'
import { NumberCircleThreeLight } from '../light/number-circle-three-light'
import { NumberCircleThreeRegular } from '../regular/number-circle-three-regular'
import { NumberCircleThreeThin } from '../thin/number-circle-three-thin'

const weightMap = {
  regular: NumberCircleThreeRegular,
  bold: NumberCircleThreeBold,
  duotone: NumberCircleThreeDuotone,
  fill: NumberCircleThreeFill,
  light: NumberCircleThreeLight,
  thin: NumberCircleThreeThin,
} as const

export const NumberCircleThree = (props: IconProps) => {
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
