import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DotsSixVerticalBold } from '../bold/dots-six-vertical-bold'
import { DotsSixVerticalDuotone } from '../duotone/dots-six-vertical-duotone'
import { DotsSixVerticalFill } from '../fill/dots-six-vertical-fill'
import { DotsSixVerticalLight } from '../light/dots-six-vertical-light'
import { DotsSixVerticalRegular } from '../regular/dots-six-vertical-regular'
import { DotsSixVerticalThin } from '../thin/dots-six-vertical-thin'

const weightMap = {
  regular: DotsSixVerticalRegular,
  bold: DotsSixVerticalBold,
  duotone: DotsSixVerticalDuotone,
  fill: DotsSixVerticalFill,
  light: DotsSixVerticalLight,
  thin: DotsSixVerticalThin,
} as const

export const DotsSixVertical = (props: IconProps) => {
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
