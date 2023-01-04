import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldCheckeredBold } from '../bold/shield-checkered-bold'
import { ShieldCheckeredDuotone } from '../duotone/shield-checkered-duotone'
import { ShieldCheckeredFill } from '../fill/shield-checkered-fill'
import { ShieldCheckeredLight } from '../light/shield-checkered-light'
import { ShieldCheckeredRegular } from '../regular/shield-checkered-regular'
import { ShieldCheckeredThin } from '../thin/shield-checkered-thin'

const weightMap = {
  regular: ShieldCheckeredRegular,
  bold: ShieldCheckeredBold,
  duotone: ShieldCheckeredDuotone,
  fill: ShieldCheckeredFill,
  light: ShieldCheckeredLight,
  thin: ShieldCheckeredThin,
} as const

export const ShieldCheckered = (props: IconProps) => {
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
