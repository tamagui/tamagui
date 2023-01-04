import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlanetBold } from '../bold/planet-bold'
import { PlanetDuotone } from '../duotone/planet-duotone'
import { PlanetFill } from '../fill/planet-fill'
import { PlanetLight } from '../light/planet-light'
import { PlanetRegular } from '../regular/planet-regular'
import { PlanetThin } from '../thin/planet-thin'

const weightMap = {
  regular: PlanetRegular,
  bold: PlanetBold,
  duotone: PlanetDuotone,
  fill: PlanetFill,
  light: PlanetLight,
  thin: PlanetThin,
} as const

export const Planet = (props: IconProps) => {
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
