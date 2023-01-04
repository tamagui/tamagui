import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FaceMaskBold } from '../bold/face-mask-bold'
import { FaceMaskDuotone } from '../duotone/face-mask-duotone'
import { FaceMaskFill } from '../fill/face-mask-fill'
import { FaceMaskLight } from '../light/face-mask-light'
import { FaceMaskRegular } from '../regular/face-mask-regular'
import { FaceMaskThin } from '../thin/face-mask-thin'

const weightMap = {
  regular: FaceMaskRegular,
  bold: FaceMaskBold,
  duotone: FaceMaskDuotone,
  fill: FaceMaskFill,
  light: FaceMaskLight,
  thin: FaceMaskThin,
} as const

export const FaceMask = (props: IconProps) => {
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
