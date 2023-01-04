import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PathBold } from '../bold/path-bold'
import { PathDuotone } from '../duotone/path-duotone'
import { PathFill } from '../fill/path-fill'
import { PathLight } from '../light/path-light'
import { PathRegular } from '../regular/path-regular'
import { PathThin } from '../thin/path-thin'

const weightMap = {
  regular: PathRegular,
  bold: PathBold,
  duotone: PathDuotone,
  fill: PathFill,
  light: PathLight,
  thin: PathThin,
} as const

export const Path = (props: IconProps) => {
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
