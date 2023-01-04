import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GearSixBold } from '../bold/gear-six-bold'
import { GearSixDuotone } from '../duotone/gear-six-duotone'
import { GearSixFill } from '../fill/gear-six-fill'
import { GearSixLight } from '../light/gear-six-light'
import { GearSixRegular } from '../regular/gear-six-regular'
import { GearSixThin } from '../thin/gear-six-thin'

const weightMap = {
  regular: GearSixRegular,
  bold: GearSixBold,
  duotone: GearSixDuotone,
  fill: GearSixFill,
  light: GearSixLight,
  thin: GearSixThin,
} as const

export const GearSix = (props: IconProps) => {
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
