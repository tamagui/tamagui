import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GenderMaleBold } from '../bold/gender-male-bold'
import { GenderMaleDuotone } from '../duotone/gender-male-duotone'
import { GenderMaleFill } from '../fill/gender-male-fill'
import { GenderMaleLight } from '../light/gender-male-light'
import { GenderMaleRegular } from '../regular/gender-male-regular'
import { GenderMaleThin } from '../thin/gender-male-thin'

const weightMap = {
  regular: GenderMaleRegular,
  bold: GenderMaleBold,
  duotone: GenderMaleDuotone,
  fill: GenderMaleFill,
  light: GenderMaleLight,
  thin: GenderMaleThin,
} as const

export const GenderMale = (props: IconProps) => {
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
