import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RewindBold } from '../bold/rewind-bold'
import { RewindDuotone } from '../duotone/rewind-duotone'
import { RewindFill } from '../fill/rewind-fill'
import { RewindLight } from '../light/rewind-light'
import { RewindRegular } from '../regular/rewind-regular'
import { RewindThin } from '../thin/rewind-thin'

const weightMap = {
  regular: RewindRegular,
  bold: RewindBold,
  duotone: RewindDuotone,
  fill: RewindFill,
  light: RewindLight,
  thin: RewindThin,
} as const

export const Rewind = (props: IconProps) => {
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
