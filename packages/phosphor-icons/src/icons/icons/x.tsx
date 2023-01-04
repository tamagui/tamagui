import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { XBold } from '../bold/x-bold'
import { XDuotone } from '../duotone/x-duotone'
import { XFill } from '../fill/x-fill'
import { XLight } from '../light/x-light'
import { XRegular } from '../regular/x-regular'
import { XThin } from '../thin/x-thin'

const weightMap = {
  regular: XRegular,
  bold: XBold,
  duotone: XDuotone,
  fill: XFill,
  light: XLight,
  thin: XThin,
} as const

export const X = (props: IconProps) => {
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
