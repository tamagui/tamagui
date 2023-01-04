import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MountainsBold } from '../bold/mountains-bold'
import { MountainsDuotone } from '../duotone/mountains-duotone'
import { MountainsFill } from '../fill/mountains-fill'
import { MountainsLight } from '../light/mountains-light'
import { MountainsRegular } from '../regular/mountains-regular'
import { MountainsThin } from '../thin/mountains-thin'

const weightMap = {
  regular: MountainsRegular,
  bold: MountainsBold,
  duotone: MountainsDuotone,
  fill: MountainsFill,
  light: MountainsLight,
  thin: MountainsThin,
} as const

export const Mountains = (props: IconProps) => {
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
