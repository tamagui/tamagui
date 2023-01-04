import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BugBold } from '../bold/bug-bold'
import { BugDuotone } from '../duotone/bug-duotone'
import { BugFill } from '../fill/bug-fill'
import { BugLight } from '../light/bug-light'
import { BugRegular } from '../regular/bug-regular'
import { BugThin } from '../thin/bug-thin'

const weightMap = {
  regular: BugRegular,
  bold: BugBold,
  duotone: BugDuotone,
  fill: BugFill,
  light: BugLight,
  thin: BugThin,
} as const

export const Bug = (props: IconProps) => {
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
