import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FishBold } from '../bold/fish-bold'
import { FishDuotone } from '../duotone/fish-duotone'
import { FishFill } from '../fill/fish-fill'
import { FishLight } from '../light/fish-light'
import { FishRegular } from '../regular/fish-regular'
import { FishThin } from '../thin/fish-thin'

const weightMap = {
  regular: FishRegular,
  bold: FishBold,
  duotone: FishDuotone,
  fill: FishFill,
  light: FishLight,
  thin: FishThin,
} as const

export const Fish = (props: IconProps) => {
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
