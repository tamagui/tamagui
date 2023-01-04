import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ApertureBold } from '../bold/aperture-bold'
import { ApertureDuotone } from '../duotone/aperture-duotone'
import { ApertureFill } from '../fill/aperture-fill'
import { ApertureLight } from '../light/aperture-light'
import { ApertureRegular } from '../regular/aperture-regular'
import { ApertureThin } from '../thin/aperture-thin'

const weightMap = {
  regular: ApertureRegular,
  bold: ApertureBold,
  duotone: ApertureDuotone,
  fill: ApertureFill,
  light: ApertureLight,
  thin: ApertureThin,
} as const

export const Aperture = (props: IconProps) => {
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
