import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NutBold } from '../bold/nut-bold'
import { NutDuotone } from '../duotone/nut-duotone'
import { NutFill } from '../fill/nut-fill'
import { NutLight } from '../light/nut-light'
import { NutRegular } from '../regular/nut-regular'
import { NutThin } from '../thin/nut-thin'

const weightMap = {
  regular: NutRegular,
  bold: NutBold,
  duotone: NutDuotone,
  fill: NutFill,
  light: NutLight,
  thin: NutThin,
} as const

export const Nut = (props: IconProps) => {
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
