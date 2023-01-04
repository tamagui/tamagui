import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BracketsRoundBold } from '../bold/brackets-round-bold'
import { BracketsRoundDuotone } from '../duotone/brackets-round-duotone'
import { BracketsRoundFill } from '../fill/brackets-round-fill'
import { BracketsRoundLight } from '../light/brackets-round-light'
import { BracketsRoundRegular } from '../regular/brackets-round-regular'
import { BracketsRoundThin } from '../thin/brackets-round-thin'

const weightMap = {
  regular: BracketsRoundRegular,
  bold: BracketsRoundBold,
  duotone: BracketsRoundDuotone,
  fill: BracketsRoundFill,
  light: BracketsRoundLight,
  thin: BracketsRoundThin,
} as const

export const BracketsRound = (props: IconProps) => {
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
