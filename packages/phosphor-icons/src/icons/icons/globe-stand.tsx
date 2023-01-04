import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GlobeStandBold } from '../bold/globe-stand-bold'
import { GlobeStandDuotone } from '../duotone/globe-stand-duotone'
import { GlobeStandFill } from '../fill/globe-stand-fill'
import { GlobeStandLight } from '../light/globe-stand-light'
import { GlobeStandRegular } from '../regular/globe-stand-regular'
import { GlobeStandThin } from '../thin/globe-stand-thin'

const weightMap = {
  regular: GlobeStandRegular,
  bold: GlobeStandBold,
  duotone: GlobeStandDuotone,
  fill: GlobeStandFill,
  light: GlobeStandLight,
  thin: GlobeStandThin,
} as const

export const GlobeStand = (props: IconProps) => {
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
