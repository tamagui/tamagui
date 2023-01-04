import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GenderFemaleBold } from '../bold/gender-female-bold'
import { GenderFemaleDuotone } from '../duotone/gender-female-duotone'
import { GenderFemaleFill } from '../fill/gender-female-fill'
import { GenderFemaleLight } from '../light/gender-female-light'
import { GenderFemaleRegular } from '../regular/gender-female-regular'
import { GenderFemaleThin } from '../thin/gender-female-thin'

const weightMap = {
  regular: GenderFemaleRegular,
  bold: GenderFemaleBold,
  duotone: GenderFemaleDuotone,
  fill: GenderFemaleFill,
  light: GenderFemaleLight,
  thin: GenderFemaleThin,
} as const

export const GenderFemale = (props: IconProps) => {
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
