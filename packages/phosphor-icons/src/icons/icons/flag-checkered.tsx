import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlagCheckeredBold } from '../bold/flag-checkered-bold'
import { FlagCheckeredDuotone } from '../duotone/flag-checkered-duotone'
import { FlagCheckeredFill } from '../fill/flag-checkered-fill'
import { FlagCheckeredLight } from '../light/flag-checkered-light'
import { FlagCheckeredRegular } from '../regular/flag-checkered-regular'
import { FlagCheckeredThin } from '../thin/flag-checkered-thin'

const weightMap = {
  regular: FlagCheckeredRegular,
  bold: FlagCheckeredBold,
  duotone: FlagCheckeredDuotone,
  fill: FlagCheckeredFill,
  light: FlagCheckeredLight,
  thin: FlagCheckeredThin,
} as const

export const FlagCheckered = (props: IconProps) => {
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
