import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DetectiveBold } from '../bold/detective-bold'
import { DetectiveDuotone } from '../duotone/detective-duotone'
import { DetectiveFill } from '../fill/detective-fill'
import { DetectiveLight } from '../light/detective-light'
import { DetectiveRegular } from '../regular/detective-regular'
import { DetectiveThin } from '../thin/detective-thin'

const weightMap = {
  regular: DetectiveRegular,
  bold: DetectiveBold,
  duotone: DetectiveDuotone,
  fill: DetectiveFill,
  light: DetectiveLight,
  thin: DetectiveThin,
} as const

export const Detective = (props: IconProps) => {
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
