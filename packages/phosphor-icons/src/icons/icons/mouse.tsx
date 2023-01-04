import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MouseBold } from '../bold/mouse-bold'
import { MouseDuotone } from '../duotone/mouse-duotone'
import { MouseFill } from '../fill/mouse-fill'
import { MouseLight } from '../light/mouse-light'
import { MouseRegular } from '../regular/mouse-regular'
import { MouseThin } from '../thin/mouse-thin'

const weightMap = {
  regular: MouseRegular,
  bold: MouseBold,
  duotone: MouseDuotone,
  fill: MouseFill,
  light: MouseLight,
  thin: MouseThin,
} as const

export const Mouse = (props: IconProps) => {
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
