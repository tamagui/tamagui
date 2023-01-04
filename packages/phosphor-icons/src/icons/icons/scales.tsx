import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ScalesBold } from '../bold/scales-bold'
import { ScalesDuotone } from '../duotone/scales-duotone'
import { ScalesFill } from '../fill/scales-fill'
import { ScalesLight } from '../light/scales-light'
import { ScalesRegular } from '../regular/scales-regular'
import { ScalesThin } from '../thin/scales-thin'

const weightMap = {
  regular: ScalesRegular,
  bold: ScalesBold,
  duotone: ScalesDuotone,
  fill: ScalesFill,
  light: ScalesLight,
  thin: ScalesThin,
} as const

export const Scales = (props: IconProps) => {
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
