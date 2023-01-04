import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AirplaneLandingBold } from '../bold/airplane-landing-bold'
import { AirplaneLandingDuotone } from '../duotone/airplane-landing-duotone'
import { AirplaneLandingFill } from '../fill/airplane-landing-fill'
import { AirplaneLandingLight } from '../light/airplane-landing-light'
import { AirplaneLandingRegular } from '../regular/airplane-landing-regular'
import { AirplaneLandingThin } from '../thin/airplane-landing-thin'

const weightMap = {
  regular: AirplaneLandingRegular,
  bold: AirplaneLandingBold,
  duotone: AirplaneLandingDuotone,
  fill: AirplaneLandingFill,
  light: AirplaneLandingLight,
  thin: AirplaneLandingThin,
} as const

export const AirplaneLanding = (props: IconProps) => {
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
