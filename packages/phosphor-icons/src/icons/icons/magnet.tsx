import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MagnetBold } from '../bold/magnet-bold'
import { MagnetDuotone } from '../duotone/magnet-duotone'
import { MagnetFill } from '../fill/magnet-fill'
import { MagnetLight } from '../light/magnet-light'
import { MagnetRegular } from '../regular/magnet-regular'
import { MagnetThin } from '../thin/magnet-thin'

const weightMap = {
  regular: MagnetRegular,
  bold: MagnetBold,
  duotone: MagnetDuotone,
  fill: MagnetFill,
  light: MagnetLight,
  thin: MagnetThin,
} as const

export const Magnet = (props: IconProps) => {
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
