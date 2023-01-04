import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { XCircleBold } from '../bold/x-circle-bold'
import { XCircleDuotone } from '../duotone/x-circle-duotone'
import { XCircleFill } from '../fill/x-circle-fill'
import { XCircleLight } from '../light/x-circle-light'
import { XCircleRegular } from '../regular/x-circle-regular'
import { XCircleThin } from '../thin/x-circle-thin'

const weightMap = {
  regular: XCircleRegular,
  bold: XCircleBold,
  duotone: XCircleDuotone,
  fill: XCircleFill,
  light: XCircleLight,
  thin: XCircleThin,
} as const

export const XCircle = (props: IconProps) => {
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
