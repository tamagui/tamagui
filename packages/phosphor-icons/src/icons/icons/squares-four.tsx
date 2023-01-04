import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SquaresFourBold } from '../bold/squares-four-bold'
import { SquaresFourDuotone } from '../duotone/squares-four-duotone'
import { SquaresFourFill } from '../fill/squares-four-fill'
import { SquaresFourLight } from '../light/squares-four-light'
import { SquaresFourRegular } from '../regular/squares-four-regular'
import { SquaresFourThin } from '../thin/squares-four-thin'

const weightMap = {
  regular: SquaresFourRegular,
  bold: SquaresFourBold,
  duotone: SquaresFourDuotone,
  fill: SquaresFourFill,
  light: SquaresFourLight,
  thin: SquaresFourThin,
} as const

export const SquaresFour = (props: IconProps) => {
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
