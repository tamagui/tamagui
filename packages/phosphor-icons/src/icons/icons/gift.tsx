import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GiftBold } from '../bold/gift-bold'
import { GiftDuotone } from '../duotone/gift-duotone'
import { GiftFill } from '../fill/gift-fill'
import { GiftLight } from '../light/gift-light'
import { GiftRegular } from '../regular/gift-regular'
import { GiftThin } from '../thin/gift-thin'

const weightMap = {
  regular: GiftRegular,
  bold: GiftBold,
  duotone: GiftDuotone,
  fill: GiftFill,
  light: GiftLight,
  thin: GiftThin,
} as const

export const Gift = (props: IconProps) => {
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
