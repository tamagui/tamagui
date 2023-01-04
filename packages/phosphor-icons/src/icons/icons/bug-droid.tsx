import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BugDroidBold } from '../bold/bug-droid-bold'
import { BugDroidDuotone } from '../duotone/bug-droid-duotone'
import { BugDroidFill } from '../fill/bug-droid-fill'
import { BugDroidLight } from '../light/bug-droid-light'
import { BugDroidRegular } from '../regular/bug-droid-regular'
import { BugDroidThin } from '../thin/bug-droid-thin'

const weightMap = {
  regular: BugDroidRegular,
  bold: BugDroidBold,
  duotone: BugDroidDuotone,
  fill: BugDroidFill,
  light: BugDroidLight,
  thin: BugDroidThin,
} as const

export const BugDroid = (props: IconProps) => {
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
