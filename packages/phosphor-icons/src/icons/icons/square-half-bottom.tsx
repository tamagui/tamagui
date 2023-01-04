import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SquareHalfBottomBold } from '../bold/square-half-bottom-bold'
import { SquareHalfBottomDuotone } from '../duotone/square-half-bottom-duotone'
import { SquareHalfBottomFill } from '../fill/square-half-bottom-fill'
import { SquareHalfBottomLight } from '../light/square-half-bottom-light'
import { SquareHalfBottomRegular } from '../regular/square-half-bottom-regular'
import { SquareHalfBottomThin } from '../thin/square-half-bottom-thin'

const weightMap = {
  regular: SquareHalfBottomRegular,
  bold: SquareHalfBottomBold,
  duotone: SquareHalfBottomDuotone,
  fill: SquareHalfBottomFill,
  light: SquareHalfBottomLight,
  thin: SquareHalfBottomThin,
} as const

export const SquareHalfBottom = (props: IconProps) => {
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
