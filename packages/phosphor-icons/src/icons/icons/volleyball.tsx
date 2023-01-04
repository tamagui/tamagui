import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { VolleyballBold } from '../bold/volleyball-bold'
import { VolleyballDuotone } from '../duotone/volleyball-duotone'
import { VolleyballFill } from '../fill/volleyball-fill'
import { VolleyballLight } from '../light/volleyball-light'
import { VolleyballRegular } from '../regular/volleyball-regular'
import { VolleyballThin } from '../thin/volleyball-thin'

const weightMap = {
  regular: VolleyballRegular,
  bold: VolleyballBold,
  duotone: VolleyballDuotone,
  fill: VolleyballFill,
  light: VolleyballLight,
  thin: VolleyballThin,
} as const

export const Volleyball = (props: IconProps) => {
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
