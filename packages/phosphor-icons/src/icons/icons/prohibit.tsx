import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ProhibitBold } from '../bold/prohibit-bold'
import { ProhibitDuotone } from '../duotone/prohibit-duotone'
import { ProhibitFill } from '../fill/prohibit-fill'
import { ProhibitLight } from '../light/prohibit-light'
import { ProhibitRegular } from '../regular/prohibit-regular'
import { ProhibitThin } from '../thin/prohibit-thin'

const weightMap = {
  regular: ProhibitRegular,
  bold: ProhibitBold,
  duotone: ProhibitDuotone,
  fill: ProhibitFill,
  light: ProhibitLight,
  thin: ProhibitThin,
} as const

export const Prohibit = (props: IconProps) => {
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
