import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WallBold } from '../bold/wall-bold'
import { WallDuotone } from '../duotone/wall-duotone'
import { WallFill } from '../fill/wall-fill'
import { WallLight } from '../light/wall-light'
import { WallRegular } from '../regular/wall-regular'
import { WallThin } from '../thin/wall-thin'

const weightMap = {
  regular: WallRegular,
  bold: WallBold,
  duotone: WallDuotone,
  fill: WallFill,
  light: WallLight,
  thin: WallThin,
} as const

export const Wall = (props: IconProps) => {
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
