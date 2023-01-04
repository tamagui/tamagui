import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleSevenBold } from '../bold/number-circle-seven-bold'
import { NumberCircleSevenDuotone } from '../duotone/number-circle-seven-duotone'
import { NumberCircleSevenFill } from '../fill/number-circle-seven-fill'
import { NumberCircleSevenLight } from '../light/number-circle-seven-light'
import { NumberCircleSevenRegular } from '../regular/number-circle-seven-regular'
import { NumberCircleSevenThin } from '../thin/number-circle-seven-thin'

const weightMap = {
  regular: NumberCircleSevenRegular,
  bold: NumberCircleSevenBold,
  duotone: NumberCircleSevenDuotone,
  fill: NumberCircleSevenFill,
  light: NumberCircleSevenLight,
  thin: NumberCircleSevenThin,
} as const

export const NumberCircleSeven = (props: IconProps) => {
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
