import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RecycleBold } from '../bold/recycle-bold'
import { RecycleDuotone } from '../duotone/recycle-duotone'
import { RecycleFill } from '../fill/recycle-fill'
import { RecycleLight } from '../light/recycle-light'
import { RecycleRegular } from '../regular/recycle-regular'
import { RecycleThin } from '../thin/recycle-thin'

const weightMap = {
  regular: RecycleRegular,
  bold: RecycleBold,
  duotone: RecycleDuotone,
  fill: RecycleFill,
  light: RecycleLight,
  thin: RecycleThin,
} as const

export const Recycle = (props: IconProps) => {
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
