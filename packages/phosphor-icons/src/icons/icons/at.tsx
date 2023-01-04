import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AtBold } from '../bold/at-bold'
import { AtDuotone } from '../duotone/at-duotone'
import { AtFill } from '../fill/at-fill'
import { AtLight } from '../light/at-light'
import { AtRegular } from '../regular/at-regular'
import { AtThin } from '../thin/at-thin'

const weightMap = {
  regular: AtRegular,
  bold: AtBold,
  duotone: AtDuotone,
  fill: AtFill,
  light: AtLight,
  thin: AtThin,
} as const

export const At = (props: IconProps) => {
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
