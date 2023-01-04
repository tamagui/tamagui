import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ToggleRightBold } from '../bold/toggle-right-bold'
import { ToggleRightDuotone } from '../duotone/toggle-right-duotone'
import { ToggleRightFill } from '../fill/toggle-right-fill'
import { ToggleRightLight } from '../light/toggle-right-light'
import { ToggleRightRegular } from '../regular/toggle-right-regular'
import { ToggleRightThin } from '../thin/toggle-right-thin'

const weightMap = {
  regular: ToggleRightRegular,
  bold: ToggleRightBold,
  duotone: ToggleRightDuotone,
  fill: ToggleRightFill,
  light: ToggleRightLight,
  thin: ToggleRightThin,
} as const

export const ToggleRight = (props: IconProps) => {
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
