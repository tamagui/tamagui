import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RectangleBold } from '../bold/rectangle-bold'
import { RectangleDuotone } from '../duotone/rectangle-duotone'
import { RectangleFill } from '../fill/rectangle-fill'
import { RectangleLight } from '../light/rectangle-light'
import { RectangleRegular } from '../regular/rectangle-regular'
import { RectangleThin } from '../thin/rectangle-thin'

const weightMap = {
  regular: RectangleRegular,
  bold: RectangleBold,
  duotone: RectangleDuotone,
  fill: RectangleFill,
  light: RectangleLight,
  thin: RectangleThin,
} as const

export const Rectangle = (props: IconProps) => {
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
