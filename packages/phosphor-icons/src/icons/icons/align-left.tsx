import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AlignLeftBold } from '../bold/align-left-bold'
import { AlignLeftDuotone } from '../duotone/align-left-duotone'
import { AlignLeftFill } from '../fill/align-left-fill'
import { AlignLeftLight } from '../light/align-left-light'
import { AlignLeftRegular } from '../regular/align-left-regular'
import { AlignLeftThin } from '../thin/align-left-thin'

const weightMap = {
  regular: AlignLeftRegular,
  bold: AlignLeftBold,
  duotone: AlignLeftDuotone,
  fill: AlignLeftFill,
  light: AlignLeftLight,
  thin: AlignLeftThin,
} as const

export const AlignLeft = (props: IconProps) => {
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
