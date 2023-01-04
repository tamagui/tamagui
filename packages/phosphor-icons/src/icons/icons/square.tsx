import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SquareBold } from '../bold/square-bold'
import { SquareDuotone } from '../duotone/square-duotone'
import { SquareFill } from '../fill/square-fill'
import { SquareLight } from '../light/square-light'
import { SquareRegular } from '../regular/square-regular'
import { SquareThin } from '../thin/square-thin'

const weightMap = {
  regular: SquareRegular,
  bold: SquareBold,
  duotone: SquareDuotone,
  fill: SquareFill,
  light: SquareLight,
  thin: SquareThin,
} as const

export const Square = (props: IconProps) => {
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
