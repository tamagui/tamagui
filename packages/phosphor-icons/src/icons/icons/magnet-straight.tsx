import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MagnetStraightBold } from '../bold/magnet-straight-bold'
import { MagnetStraightDuotone } from '../duotone/magnet-straight-duotone'
import { MagnetStraightFill } from '../fill/magnet-straight-fill'
import { MagnetStraightLight } from '../light/magnet-straight-light'
import { MagnetStraightRegular } from '../regular/magnet-straight-regular'
import { MagnetStraightThin } from '../thin/magnet-straight-thin'

const weightMap = {
  regular: MagnetStraightRegular,
  bold: MagnetStraightBold,
  duotone: MagnetStraightDuotone,
  fill: MagnetStraightFill,
  light: MagnetStraightLight,
  thin: MagnetStraightThin,
} as const

export const MagnetStraight = (props: IconProps) => {
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
