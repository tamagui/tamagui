import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DiscBold } from '../bold/disc-bold'
import { DiscDuotone } from '../duotone/disc-duotone'
import { DiscFill } from '../fill/disc-fill'
import { DiscLight } from '../light/disc-light'
import { DiscRegular } from '../regular/disc-regular'
import { DiscThin } from '../thin/disc-thin'

const weightMap = {
  regular: DiscRegular,
  bold: DiscBold,
  duotone: DiscDuotone,
  fill: DiscFill,
  light: DiscLight,
  thin: DiscThin,
} as const

export const Disc = (props: IconProps) => {
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
