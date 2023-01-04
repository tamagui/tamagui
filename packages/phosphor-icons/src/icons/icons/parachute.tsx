import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ParachuteBold } from '../bold/parachute-bold'
import { ParachuteDuotone } from '../duotone/parachute-duotone'
import { ParachuteFill } from '../fill/parachute-fill'
import { ParachuteLight } from '../light/parachute-light'
import { ParachuteRegular } from '../regular/parachute-regular'
import { ParachuteThin } from '../thin/parachute-thin'

const weightMap = {
  regular: ParachuteRegular,
  bold: ParachuteBold,
  duotone: ParachuteDuotone,
  fill: ParachuteFill,
  light: ParachuteLight,
  thin: ParachuteThin,
} as const

export const Parachute = (props: IconProps) => {
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
