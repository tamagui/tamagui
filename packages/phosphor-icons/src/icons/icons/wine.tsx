import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WineBold } from '../bold/wine-bold'
import { WineDuotone } from '../duotone/wine-duotone'
import { WineFill } from '../fill/wine-fill'
import { WineLight } from '../light/wine-light'
import { WineRegular } from '../regular/wine-regular'
import { WineThin } from '../thin/wine-thin'

const weightMap = {
  regular: WineRegular,
  bold: WineBold,
  duotone: WineDuotone,
  fill: WineFill,
  light: WineLight,
  thin: WineThin,
} as const

export const Wine = (props: IconProps) => {
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
