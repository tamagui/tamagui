import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SkullBold } from '../bold/skull-bold'
import { SkullDuotone } from '../duotone/skull-duotone'
import { SkullFill } from '../fill/skull-fill'
import { SkullLight } from '../light/skull-light'
import { SkullRegular } from '../regular/skull-regular'
import { SkullThin } from '../thin/skull-thin'

const weightMap = {
  regular: SkullRegular,
  bold: SkullBold,
  duotone: SkullDuotone,
  fill: SkullFill,
  light: SkullLight,
  thin: SkullThin,
} as const

export const Skull = (props: IconProps) => {
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
