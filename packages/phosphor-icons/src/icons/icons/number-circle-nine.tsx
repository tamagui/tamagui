import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleNineBold } from '../bold/number-circle-nine-bold'
import { NumberCircleNineDuotone } from '../duotone/number-circle-nine-duotone'
import { NumberCircleNineFill } from '../fill/number-circle-nine-fill'
import { NumberCircleNineLight } from '../light/number-circle-nine-light'
import { NumberCircleNineRegular } from '../regular/number-circle-nine-regular'
import { NumberCircleNineThin } from '../thin/number-circle-nine-thin'

const weightMap = {
  regular: NumberCircleNineRegular,
  bold: NumberCircleNineBold,
  duotone: NumberCircleNineDuotone,
  fill: NumberCircleNineFill,
  light: NumberCircleNineLight,
  thin: NumberCircleNineThin,
} as const

export const NumberCircleNine = (props: IconProps) => {
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
