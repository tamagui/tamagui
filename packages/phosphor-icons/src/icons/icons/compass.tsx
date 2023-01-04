import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CompassBold } from '../bold/compass-bold'
import { CompassDuotone } from '../duotone/compass-duotone'
import { CompassFill } from '../fill/compass-fill'
import { CompassLight } from '../light/compass-light'
import { CompassRegular } from '../regular/compass-regular'
import { CompassThin } from '../thin/compass-thin'

const weightMap = {
  regular: CompassRegular,
  bold: CompassBold,
  duotone: CompassDuotone,
  fill: CompassFill,
  light: CompassLight,
  thin: CompassThin,
} as const

export const Compass = (props: IconProps) => {
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
