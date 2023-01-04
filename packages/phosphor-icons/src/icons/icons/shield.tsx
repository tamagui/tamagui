import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ShieldBold } from '../bold/shield-bold'
import { ShieldDuotone } from '../duotone/shield-duotone'
import { ShieldFill } from '../fill/shield-fill'
import { ShieldLight } from '../light/shield-light'
import { ShieldRegular } from '../regular/shield-regular'
import { ShieldThin } from '../thin/shield-thin'

const weightMap = {
  regular: ShieldRegular,
  bold: ShieldBold,
  duotone: ShieldDuotone,
  fill: ShieldFill,
  light: ShieldLight,
  thin: ShieldThin,
} as const

export const Shield = (props: IconProps) => {
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
