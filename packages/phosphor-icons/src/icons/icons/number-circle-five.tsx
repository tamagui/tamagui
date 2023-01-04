import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberCircleFiveBold } from '../bold/number-circle-five-bold'
import { NumberCircleFiveDuotone } from '../duotone/number-circle-five-duotone'
import { NumberCircleFiveFill } from '../fill/number-circle-five-fill'
import { NumberCircleFiveLight } from '../light/number-circle-five-light'
import { NumberCircleFiveRegular } from '../regular/number-circle-five-regular'
import { NumberCircleFiveThin } from '../thin/number-circle-five-thin'

const weightMap = {
  regular: NumberCircleFiveRegular,
  bold: NumberCircleFiveBold,
  duotone: NumberCircleFiveDuotone,
  fill: NumberCircleFiveFill,
  light: NumberCircleFiveLight,
  thin: NumberCircleFiveThin,
} as const

export const NumberCircleFive = (props: IconProps) => {
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
