import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GlobeHemisphereWestBold } from '../bold/globe-hemisphere-west-bold'
import { GlobeHemisphereWestDuotone } from '../duotone/globe-hemisphere-west-duotone'
import { GlobeHemisphereWestFill } from '../fill/globe-hemisphere-west-fill'
import { GlobeHemisphereWestLight } from '../light/globe-hemisphere-west-light'
import { GlobeHemisphereWestRegular } from '../regular/globe-hemisphere-west-regular'
import { GlobeHemisphereWestThin } from '../thin/globe-hemisphere-west-thin'

const weightMap = {
  regular: GlobeHemisphereWestRegular,
  bold: GlobeHemisphereWestBold,
  duotone: GlobeHemisphereWestDuotone,
  fill: GlobeHemisphereWestFill,
  light: GlobeHemisphereWestLight,
  thin: GlobeHemisphereWestThin,
} as const

export const GlobeHemisphereWest = (props: IconProps) => {
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
