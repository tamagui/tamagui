import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FireBold } from '../bold/fire-bold'
import { FireDuotone } from '../duotone/fire-duotone'
import { FireFill } from '../fill/fire-fill'
import { FireLight } from '../light/fire-light'
import { FireRegular } from '../regular/fire-regular'
import { FireThin } from '../thin/fire-thin'

const weightMap = {
  regular: FireRegular,
  bold: FireBold,
  duotone: FireDuotone,
  fill: FireFill,
  light: FireLight,
  thin: FireThin,
} as const

export const Fire = (props: IconProps) => {
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
