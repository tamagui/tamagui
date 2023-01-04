import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { MaskSadBold } from '../bold/mask-sad-bold'
import { MaskSadDuotone } from '../duotone/mask-sad-duotone'
import { MaskSadFill } from '../fill/mask-sad-fill'
import { MaskSadLight } from '../light/mask-sad-light'
import { MaskSadRegular } from '../regular/mask-sad-regular'
import { MaskSadThin } from '../thin/mask-sad-thin'

const weightMap = {
  regular: MaskSadRegular,
  bold: MaskSadBold,
  duotone: MaskSadDuotone,
  fill: MaskSadFill,
  light: MaskSadLight,
  thin: MaskSadThin,
} as const

export const MaskSad = (props: IconProps) => {
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
