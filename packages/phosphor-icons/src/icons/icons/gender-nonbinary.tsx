import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GenderNonbinaryBold } from '../bold/gender-nonbinary-bold'
import { GenderNonbinaryDuotone } from '../duotone/gender-nonbinary-duotone'
import { GenderNonbinaryFill } from '../fill/gender-nonbinary-fill'
import { GenderNonbinaryLight } from '../light/gender-nonbinary-light'
import { GenderNonbinaryRegular } from '../regular/gender-nonbinary-regular'
import { GenderNonbinaryThin } from '../thin/gender-nonbinary-thin'

const weightMap = {
  regular: GenderNonbinaryRegular,
  bold: GenderNonbinaryBold,
  duotone: GenderNonbinaryDuotone,
  fill: GenderNonbinaryFill,
  light: GenderNonbinaryLight,
  thin: GenderNonbinaryThin,
} as const

export const GenderNonbinary = (props: IconProps) => {
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
