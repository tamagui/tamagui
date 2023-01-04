import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BedBold } from '../bold/bed-bold'
import { BedDuotone } from '../duotone/bed-duotone'
import { BedFill } from '../fill/bed-fill'
import { BedLight } from '../light/bed-light'
import { BedRegular } from '../regular/bed-regular'
import { BedThin } from '../thin/bed-thin'

const weightMap = {
  regular: BedRegular,
  bold: BedBold,
  duotone: BedDuotone,
  fill: BedFill,
  light: BedLight,
  thin: BedThin,
} as const

export const Bed = (props: IconProps) => {
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
