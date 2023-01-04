import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WatchBold } from '../bold/watch-bold'
import { WatchDuotone } from '../duotone/watch-duotone'
import { WatchFill } from '../fill/watch-fill'
import { WatchLight } from '../light/watch-light'
import { WatchRegular } from '../regular/watch-regular'
import { WatchThin } from '../thin/watch-thin'

const weightMap = {
  regular: WatchRegular,
  bold: WatchBold,
  duotone: WatchDuotone,
  fill: WatchFill,
  light: WatchLight,
  thin: WatchThin,
} as const

export const Watch = (props: IconProps) => {
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
