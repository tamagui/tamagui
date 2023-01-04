import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GenderIntersexBold } from '../bold/gender-intersex-bold'
import { GenderIntersexDuotone } from '../duotone/gender-intersex-duotone'
import { GenderIntersexFill } from '../fill/gender-intersex-fill'
import { GenderIntersexLight } from '../light/gender-intersex-light'
import { GenderIntersexRegular } from '../regular/gender-intersex-regular'
import { GenderIntersexThin } from '../thin/gender-intersex-thin'

const weightMap = {
  regular: GenderIntersexRegular,
  bold: GenderIntersexBold,
  duotone: GenderIntersexDuotone,
  fill: GenderIntersexFill,
  light: GenderIntersexLight,
  thin: GenderIntersexThin,
} as const

export const GenderIntersex = (props: IconProps) => {
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
