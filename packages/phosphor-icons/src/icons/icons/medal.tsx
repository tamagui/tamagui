import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MedalBold } from '../bold/medal-bold'
import { MedalDuotone } from '../duotone/medal-duotone'
import { MedalFill } from '../fill/medal-fill'
import { MedalLight } from '../light/medal-light'
import { MedalRegular } from '../regular/medal-regular'
import { MedalThin } from '../thin/medal-thin'

const weightMap = {
  regular: MedalRegular,
  bold: MedalBold,
  duotone: MedalDuotone,
  fill: MedalFill,
  light: MedalLight,
  thin: MedalThin,
} as const

export const Medal = (props: IconProps) => {
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
