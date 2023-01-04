import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberFiveBold } from '../bold/number-five-bold'
import { NumberFiveDuotone } from '../duotone/number-five-duotone'
import { NumberFiveFill } from '../fill/number-five-fill'
import { NumberFiveLight } from '../light/number-five-light'
import { NumberFiveRegular } from '../regular/number-five-regular'
import { NumberFiveThin } from '../thin/number-five-thin'

const weightMap = {
  regular: NumberFiveRegular,
  bold: NumberFiveBold,
  duotone: NumberFiveDuotone,
  fill: NumberFiveFill,
  light: NumberFiveLight,
  thin: NumberFiveThin,
} as const

export const NumberFive = (props: IconProps) => {
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
