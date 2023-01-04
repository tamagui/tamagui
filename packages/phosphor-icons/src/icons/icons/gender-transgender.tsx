import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GenderTransgenderBold } from '../bold/gender-transgender-bold'
import { GenderTransgenderDuotone } from '../duotone/gender-transgender-duotone'
import { GenderTransgenderFill } from '../fill/gender-transgender-fill'
import { GenderTransgenderLight } from '../light/gender-transgender-light'
import { GenderTransgenderRegular } from '../regular/gender-transgender-regular'
import { GenderTransgenderThin } from '../thin/gender-transgender-thin'

const weightMap = {
  regular: GenderTransgenderRegular,
  bold: GenderTransgenderBold,
  duotone: GenderTransgenderDuotone,
  fill: GenderTransgenderFill,
  light: GenderTransgenderLight,
  thin: GenderTransgenderThin,
} as const

export const GenderTransgender = (props: IconProps) => {
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
