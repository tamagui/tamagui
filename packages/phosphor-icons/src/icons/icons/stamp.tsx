import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { StampBold } from '../bold/stamp-bold'
import { StampDuotone } from '../duotone/stamp-duotone'
import { StampFill } from '../fill/stamp-fill'
import { StampLight } from '../light/stamp-light'
import { StampRegular } from '../regular/stamp-regular'
import { StampThin } from '../thin/stamp-thin'

const weightMap = {
  regular: StampRegular,
  bold: StampBold,
  duotone: StampDuotone,
  fill: StampFill,
  light: StampLight,
  thin: StampThin,
} as const

export const Stamp = (props: IconProps) => {
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
