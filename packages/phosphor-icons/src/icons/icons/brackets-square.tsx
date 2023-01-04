import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BracketsSquareBold } from '../bold/brackets-square-bold'
import { BracketsSquareDuotone } from '../duotone/brackets-square-duotone'
import { BracketsSquareFill } from '../fill/brackets-square-fill'
import { BracketsSquareLight } from '../light/brackets-square-light'
import { BracketsSquareRegular } from '../regular/brackets-square-regular'
import { BracketsSquareThin } from '../thin/brackets-square-thin'

const weightMap = {
  regular: BracketsSquareRegular,
  bold: BracketsSquareBold,
  duotone: BracketsSquareDuotone,
  fill: BracketsSquareFill,
  light: BracketsSquareLight,
  thin: BracketsSquareThin,
} as const

export const BracketsSquare = (props: IconProps) => {
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
