import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PenBold } from '../bold/pen-bold'
import { PenDuotone } from '../duotone/pen-duotone'
import { PenFill } from '../fill/pen-fill'
import { PenLight } from '../light/pen-light'
import { PenRegular } from '../regular/pen-regular'
import { PenThin } from '../thin/pen-thin'

const weightMap = {
  regular: PenRegular,
  bold: PenBold,
  duotone: PenDuotone,
  fill: PenFill,
  light: PenLight,
  thin: PenThin,
} as const

export const Pen = (props: IconProps) => {
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
