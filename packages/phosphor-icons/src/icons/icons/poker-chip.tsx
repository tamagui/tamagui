import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PokerChipBold } from '../bold/poker-chip-bold'
import { PokerChipDuotone } from '../duotone/poker-chip-duotone'
import { PokerChipFill } from '../fill/poker-chip-fill'
import { PokerChipLight } from '../light/poker-chip-light'
import { PokerChipRegular } from '../regular/poker-chip-regular'
import { PokerChipThin } from '../thin/poker-chip-thin'

const weightMap = {
  regular: PokerChipRegular,
  bold: PokerChipBold,
  duotone: PokerChipDuotone,
  fill: PokerChipFill,
  light: PokerChipLight,
  thin: PokerChipThin,
} as const

export const PokerChip = (props: IconProps) => {
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
