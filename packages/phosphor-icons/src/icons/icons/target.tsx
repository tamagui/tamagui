import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { TargetBold } from '../bold/target-bold'
import { TargetDuotone } from '../duotone/target-duotone'
import { TargetFill } from '../fill/target-fill'
import { TargetLight } from '../light/target-light'
import { TargetRegular } from '../regular/target-regular'
import { TargetThin } from '../thin/target-thin'

const weightMap = {
  regular: TargetRegular,
  bold: TargetBold,
  duotone: TargetDuotone,
  fill: TargetFill,
  light: TargetLight,
  thin: TargetThin,
} as const

export const Target = (props: IconProps) => {
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
