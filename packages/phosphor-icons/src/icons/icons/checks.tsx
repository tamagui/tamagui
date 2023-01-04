import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ChecksBold } from '../bold/checks-bold'
import { ChecksDuotone } from '../duotone/checks-duotone'
import { ChecksFill } from '../fill/checks-fill'
import { ChecksLight } from '../light/checks-light'
import { ChecksRegular } from '../regular/checks-regular'
import { ChecksThin } from '../thin/checks-thin'

const weightMap = {
  regular: ChecksRegular,
  bold: ChecksBold,
  duotone: ChecksDuotone,
  fill: ChecksFill,
  light: ChecksLight,
  thin: ChecksThin,
} as const

export const Checks = (props: IconProps) => {
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
