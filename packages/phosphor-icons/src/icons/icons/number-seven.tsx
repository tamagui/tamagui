import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSevenBold } from '../bold/number-seven-bold'
import { NumberSevenDuotone } from '../duotone/number-seven-duotone'
import { NumberSevenFill } from '../fill/number-seven-fill'
import { NumberSevenLight } from '../light/number-seven-light'
import { NumberSevenRegular } from '../regular/number-seven-regular'
import { NumberSevenThin } from '../thin/number-seven-thin'

const weightMap = {
  regular: NumberSevenRegular,
  bold: NumberSevenBold,
  duotone: NumberSevenDuotone,
  fill: NumberSevenFill,
  light: NumberSevenLight,
  thin: NumberSevenThin,
} as const

export const NumberSeven = (props: IconProps) => {
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
