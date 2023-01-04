import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SquareHalfBold } from '../bold/square-half-bold'
import { SquareHalfDuotone } from '../duotone/square-half-duotone'
import { SquareHalfFill } from '../fill/square-half-fill'
import { SquareHalfLight } from '../light/square-half-light'
import { SquareHalfRegular } from '../regular/square-half-regular'
import { SquareHalfThin } from '../thin/square-half-thin'

const weightMap = {
  regular: SquareHalfRegular,
  bold: SquareHalfBold,
  duotone: SquareHalfDuotone,
  fill: SquareHalfFill,
  light: SquareHalfLight,
  thin: SquareHalfThin,
} as const

export const SquareHalf = (props: IconProps) => {
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
