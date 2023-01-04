import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsVerticalBold } from '../bold/arrows-vertical-bold'
import { ArrowsVerticalDuotone } from '../duotone/arrows-vertical-duotone'
import { ArrowsVerticalFill } from '../fill/arrows-vertical-fill'
import { ArrowsVerticalLight } from '../light/arrows-vertical-light'
import { ArrowsVerticalRegular } from '../regular/arrows-vertical-regular'
import { ArrowsVerticalThin } from '../thin/arrows-vertical-thin'

const weightMap = {
  regular: ArrowsVerticalRegular,
  bold: ArrowsVerticalBold,
  duotone: ArrowsVerticalDuotone,
  fill: ArrowsVerticalFill,
  light: ArrowsVerticalLight,
  thin: ArrowsVerticalThin,
} as const

export const ArrowsVertical = (props: IconProps) => {
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
