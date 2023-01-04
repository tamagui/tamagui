import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { CubeBold } from '../bold/cube-bold'
import { CubeDuotone } from '../duotone/cube-duotone'
import { CubeFill } from '../fill/cube-fill'
import { CubeLight } from '../light/cube-light'
import { CubeRegular } from '../regular/cube-regular'
import { CubeThin } from '../thin/cube-thin'

const weightMap = {
  regular: CubeRegular,
  bold: CubeBold,
  duotone: CubeDuotone,
  fill: CubeFill,
  light: CubeLight,
  thin: CubeThin,
} as const

export const Cube = (props: IconProps) => {
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
