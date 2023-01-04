import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldStarBold } from '../bold/shield-star-bold'
import { ShieldStarDuotone } from '../duotone/shield-star-duotone'
import { ShieldStarFill } from '../fill/shield-star-fill'
import { ShieldStarLight } from '../light/shield-star-light'
import { ShieldStarRegular } from '../regular/shield-star-regular'
import { ShieldStarThin } from '../thin/shield-star-thin'

const weightMap = {
  regular: ShieldStarRegular,
  bold: ShieldStarBold,
  duotone: ShieldStarDuotone,
  fill: ShieldStarFill,
  light: ShieldStarLight,
  thin: ShieldStarThin,
} as const

export const ShieldStar = (props: IconProps) => {
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
