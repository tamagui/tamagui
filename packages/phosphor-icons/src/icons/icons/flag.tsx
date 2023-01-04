import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlagBold } from '../bold/flag-bold'
import { FlagDuotone } from '../duotone/flag-duotone'
import { FlagFill } from '../fill/flag-fill'
import { FlagLight } from '../light/flag-light'
import { FlagRegular } from '../regular/flag-regular'
import { FlagThin } from '../thin/flag-thin'

const weightMap = {
  regular: FlagRegular,
  bold: FlagBold,
  duotone: FlagDuotone,
  fill: FlagFill,
  light: FlagLight,
  thin: FlagThin,
} as const

export const Flag = (props: IconProps) => {
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
