import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellZBold } from '../bold/bell-z-bold'
import { BellZDuotone } from '../duotone/bell-z-duotone'
import { BellZFill } from '../fill/bell-z-fill'
import { BellZLight } from '../light/bell-z-light'
import { BellZRegular } from '../regular/bell-z-regular'
import { BellZThin } from '../thin/bell-z-thin'

const weightMap = {
  regular: BellZRegular,
  bold: BellZBold,
  duotone: BellZDuotone,
  fill: BellZFill,
  light: BellZLight,
  thin: BellZThin,
} as const

export const BellZ = (props: IconProps) => {
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
