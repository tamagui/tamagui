import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FadersHorizontalBold } from '../bold/faders-horizontal-bold'
import { FadersHorizontalDuotone } from '../duotone/faders-horizontal-duotone'
import { FadersHorizontalFill } from '../fill/faders-horizontal-fill'
import { FadersHorizontalLight } from '../light/faders-horizontal-light'
import { FadersHorizontalRegular } from '../regular/faders-horizontal-regular'
import { FadersHorizontalThin } from '../thin/faders-horizontal-thin'

const weightMap = {
  regular: FadersHorizontalRegular,
  bold: FadersHorizontalBold,
  duotone: FadersHorizontalDuotone,
  fill: FadersHorizontalFill,
  light: FadersHorizontalLight,
  thin: FadersHorizontalThin,
} as const

export const FadersHorizontal = (props: IconProps) => {
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
