import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlaceholderBold } from '../bold/placeholder-bold'
import { PlaceholderDuotone } from '../duotone/placeholder-duotone'
import { PlaceholderFill } from '../fill/placeholder-fill'
import { PlaceholderLight } from '../light/placeholder-light'
import { PlaceholderRegular } from '../regular/placeholder-regular'
import { PlaceholderThin } from '../thin/placeholder-thin'

const weightMap = {
  regular: PlaceholderRegular,
  bold: PlaceholderBold,
  duotone: PlaceholderDuotone,
  fill: PlaceholderFill,
  light: PlaceholderLight,
  thin: PlaceholderThin,
} as const

export const Placeholder = (props: IconProps) => {
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
