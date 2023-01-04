import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FishSimpleBold } from '../bold/fish-simple-bold'
import { FishSimpleDuotone } from '../duotone/fish-simple-duotone'
import { FishSimpleFill } from '../fill/fish-simple-fill'
import { FishSimpleLight } from '../light/fish-simple-light'
import { FishSimpleRegular } from '../regular/fish-simple-regular'
import { FishSimpleThin } from '../thin/fish-simple-thin'

const weightMap = {
  regular: FishSimpleRegular,
  bold: FishSimpleBold,
  duotone: FishSimpleDuotone,
  fill: FishSimpleFill,
  light: FishSimpleLight,
  thin: FishSimpleThin,
} as const

export const FishSimple = (props: IconProps) => {
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
