import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NumberSquareFourBold } from '../bold/number-square-four-bold'
import { NumberSquareFourDuotone } from '../duotone/number-square-four-duotone'
import { NumberSquareFourFill } from '../fill/number-square-four-fill'
import { NumberSquareFourLight } from '../light/number-square-four-light'
import { NumberSquareFourRegular } from '../regular/number-square-four-regular'
import { NumberSquareFourThin } from '../thin/number-square-four-thin'

const weightMap = {
  regular: NumberSquareFourRegular,
  bold: NumberSquareFourBold,
  duotone: NumberSquareFourDuotone,
  fill: NumberSquareFourFill,
  light: NumberSquareFourLight,
  thin: NumberSquareFourThin,
} as const

export const NumberSquareFour = (props: IconProps) => {
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
