import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ProhibitInsetBold } from '../bold/prohibit-inset-bold'
import { ProhibitInsetDuotone } from '../duotone/prohibit-inset-duotone'
import { ProhibitInsetFill } from '../fill/prohibit-inset-fill'
import { ProhibitInsetLight } from '../light/prohibit-inset-light'
import { ProhibitInsetRegular } from '../regular/prohibit-inset-regular'
import { ProhibitInsetThin } from '../thin/prohibit-inset-thin'

const weightMap = {
  regular: ProhibitInsetRegular,
  bold: ProhibitInsetBold,
  duotone: ProhibitInsetDuotone,
  fill: ProhibitInsetFill,
  light: ProhibitInsetLight,
  thin: ProhibitInsetThin,
} as const

export const ProhibitInset = (props: IconProps) => {
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
