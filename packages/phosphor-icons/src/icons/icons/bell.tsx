import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellBold } from '../bold/bell-bold'
import { BellDuotone } from '../duotone/bell-duotone'
import { BellFill } from '../fill/bell-fill'
import { BellLight } from '../light/bell-light'
import { BellRegular } from '../regular/bell-regular'
import { BellThin } from '../thin/bell-thin'

const weightMap = {
  regular: BellRegular,
  bold: BellBold,
  duotone: BellDuotone,
  fill: BellFill,
  light: BellLight,
  thin: BellThin,
} as const

export const Bell = (props: IconProps) => {
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
