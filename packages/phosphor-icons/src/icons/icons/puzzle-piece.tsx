import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PuzzlePieceBold } from '../bold/puzzle-piece-bold'
import { PuzzlePieceDuotone } from '../duotone/puzzle-piece-duotone'
import { PuzzlePieceFill } from '../fill/puzzle-piece-fill'
import { PuzzlePieceLight } from '../light/puzzle-piece-light'
import { PuzzlePieceRegular } from '../regular/puzzle-piece-regular'
import { PuzzlePieceThin } from '../thin/puzzle-piece-thin'

const weightMap = {
  regular: PuzzlePieceRegular,
  bold: PuzzlePieceBold,
  duotone: PuzzlePieceDuotone,
  fill: PuzzlePieceFill,
  light: PuzzlePieceLight,
  thin: PuzzlePieceThin,
} as const

export const PuzzlePiece = (props: IconProps) => {
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
