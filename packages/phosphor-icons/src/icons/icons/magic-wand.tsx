import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MagicWandBold } from '../bold/magic-wand-bold'
import { MagicWandDuotone } from '../duotone/magic-wand-duotone'
import { MagicWandFill } from '../fill/magic-wand-fill'
import { MagicWandLight } from '../light/magic-wand-light'
import { MagicWandRegular } from '../regular/magic-wand-regular'
import { MagicWandThin } from '../thin/magic-wand-thin'

const weightMap = {
  regular: MagicWandRegular,
  bold: MagicWandBold,
  duotone: MagicWandDuotone,
  fill: MagicWandFill,
  light: MagicWandLight,
  thin: MagicWandThin,
} as const

export const MagicWand = (props: IconProps) => {
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
