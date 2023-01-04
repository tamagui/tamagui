import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { NeedleBold } from '../bold/needle-bold'
import { NeedleDuotone } from '../duotone/needle-duotone'
import { NeedleFill } from '../fill/needle-fill'
import { NeedleLight } from '../light/needle-light'
import { NeedleRegular } from '../regular/needle-regular'
import { NeedleThin } from '../thin/needle-thin'

const weightMap = {
  regular: NeedleRegular,
  bold: NeedleBold,
  duotone: NeedleDuotone,
  fill: NeedleFill,
  light: NeedleLight,
  thin: NeedleThin,
} as const

export const Needle = (props: IconProps) => {
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
