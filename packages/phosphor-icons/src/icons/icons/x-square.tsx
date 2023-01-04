import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { XSquareBold } from '../bold/x-square-bold'
import { XSquareDuotone } from '../duotone/x-square-duotone'
import { XSquareFill } from '../fill/x-square-fill'
import { XSquareLight } from '../light/x-square-light'
import { XSquareRegular } from '../regular/x-square-regular'
import { XSquareThin } from '../thin/x-square-thin'

const weightMap = {
  regular: XSquareRegular,
  bold: XSquareBold,
  duotone: XSquareDuotone,
  fill: XSquareFill,
  light: XSquareLight,
  thin: XSquareThin,
} as const

export const XSquare = (props: IconProps) => {
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
