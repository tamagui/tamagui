import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ToggleLeftBold } from '../bold/toggle-left-bold'
import { ToggleLeftDuotone } from '../duotone/toggle-left-duotone'
import { ToggleLeftFill } from '../fill/toggle-left-fill'
import { ToggleLeftLight } from '../light/toggle-left-light'
import { ToggleLeftRegular } from '../regular/toggle-left-regular'
import { ToggleLeftThin } from '../thin/toggle-left-thin'

const weightMap = {
  regular: ToggleLeftRegular,
  bold: ToggleLeftBold,
  duotone: ToggleLeftDuotone,
  fill: ToggleLeftFill,
  light: ToggleLeftLight,
  thin: ToggleLeftThin,
} as const

export const ToggleLeft = (props: IconProps) => {
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
