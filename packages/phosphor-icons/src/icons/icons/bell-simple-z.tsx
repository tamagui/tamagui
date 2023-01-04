import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BellSimpleZBold } from '../bold/bell-simple-z-bold'
import { BellSimpleZDuotone } from '../duotone/bell-simple-z-duotone'
import { BellSimpleZFill } from '../fill/bell-simple-z-fill'
import { BellSimpleZLight } from '../light/bell-simple-z-light'
import { BellSimpleZRegular } from '../regular/bell-simple-z-regular'
import { BellSimpleZThin } from '../thin/bell-simple-z-thin'

const weightMap = {
  regular: BellSimpleZRegular,
  bold: BellSimpleZBold,
  duotone: BellSimpleZDuotone,
  fill: BellSimpleZFill,
  light: BellSimpleZLight,
  thin: BellSimpleZThin,
} as const

export const BellSimpleZ = (props: IconProps) => {
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
