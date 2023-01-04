import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { HorseBold } from '../bold/horse-bold'
import { HorseDuotone } from '../duotone/horse-duotone'
import { HorseFill } from '../fill/horse-fill'
import { HorseLight } from '../light/horse-light'
import { HorseRegular } from '../regular/horse-regular'
import { HorseThin } from '../thin/horse-thin'

const weightMap = {
  regular: HorseRegular,
  bold: HorseBold,
  duotone: HorseDuotone,
  fill: HorseFill,
  light: HorseLight,
  thin: HorseThin,
} as const

export const Horse = (props: IconProps) => {
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
