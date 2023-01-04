import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MoonBold } from '../bold/moon-bold'
import { MoonDuotone } from '../duotone/moon-duotone'
import { MoonFill } from '../fill/moon-fill'
import { MoonLight } from '../light/moon-light'
import { MoonRegular } from '../regular/moon-regular'
import { MoonThin } from '../thin/moon-thin'

const weightMap = {
  regular: MoonRegular,
  bold: MoonBold,
  duotone: MoonDuotone,
  fill: MoonFill,
  light: MoonLight,
  thin: MoonThin,
} as const

export const Moon = (props: IconProps) => {
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
