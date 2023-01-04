import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CheckSquareBold } from '../bold/check-square-bold'
import { CheckSquareDuotone } from '../duotone/check-square-duotone'
import { CheckSquareFill } from '../fill/check-square-fill'
import { CheckSquareLight } from '../light/check-square-light'
import { CheckSquareRegular } from '../regular/check-square-regular'
import { CheckSquareThin } from '../thin/check-square-thin'

const weightMap = {
  regular: CheckSquareRegular,
  bold: CheckSquareBold,
  duotone: CheckSquareDuotone,
  fill: CheckSquareFill,
  light: CheckSquareLight,
  thin: CheckSquareThin,
} as const

export const CheckSquare = (props: IconProps) => {
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
