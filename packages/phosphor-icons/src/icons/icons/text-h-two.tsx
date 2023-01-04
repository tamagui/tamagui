import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TextHTwoBold } from '../bold/text-h-two-bold'
import { TextHTwoDuotone } from '../duotone/text-h-two-duotone'
import { TextHTwoFill } from '../fill/text-h-two-fill'
import { TextHTwoLight } from '../light/text-h-two-light'
import { TextHTwoRegular } from '../regular/text-h-two-regular'
import { TextHTwoThin } from '../thin/text-h-two-thin'

const weightMap = {
  regular: TextHTwoRegular,
  bold: TextHTwoBold,
  duotone: TextHTwoDuotone,
  fill: TextHTwoFill,
  light: TextHTwoLight,
  thin: TextHTwoThin,
} as const

export const TextHTwo = (props: IconProps) => {
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
