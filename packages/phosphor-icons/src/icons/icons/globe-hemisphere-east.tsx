import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GlobeHemisphereEastBold } from '../bold/globe-hemisphere-east-bold'
import { GlobeHemisphereEastDuotone } from '../duotone/globe-hemisphere-east-duotone'
import { GlobeHemisphereEastFill } from '../fill/globe-hemisphere-east-fill'
import { GlobeHemisphereEastLight } from '../light/globe-hemisphere-east-light'
import { GlobeHemisphereEastRegular } from '../regular/globe-hemisphere-east-regular'
import { GlobeHemisphereEastThin } from '../thin/globe-hemisphere-east-thin'

const weightMap = {
  regular: GlobeHemisphereEastRegular,
  bold: GlobeHemisphereEastBold,
  duotone: GlobeHemisphereEastDuotone,
  fill: GlobeHemisphereEastFill,
  light: GlobeHemisphereEastLight,
  thin: GlobeHemisphereEastThin,
} as const

export const GlobeHemisphereEast = (props: IconProps) => {
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
