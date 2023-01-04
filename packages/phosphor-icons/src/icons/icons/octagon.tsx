import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { OctagonBold } from '../bold/octagon-bold'
import { OctagonDuotone } from '../duotone/octagon-duotone'
import { OctagonFill } from '../fill/octagon-fill'
import { OctagonLight } from '../light/octagon-light'
import { OctagonRegular } from '../regular/octagon-regular'
import { OctagonThin } from '../thin/octagon-thin'

const weightMap = {
  regular: OctagonRegular,
  bold: OctagonBold,
  duotone: OctagonDuotone,
  fill: OctagonFill,
  light: OctagonLight,
  thin: OctagonThin,
} as const

export const Octagon = (props: IconProps) => {
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
