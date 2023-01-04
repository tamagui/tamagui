import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BugBeetleBold } from '../bold/bug-beetle-bold'
import { BugBeetleDuotone } from '../duotone/bug-beetle-duotone'
import { BugBeetleFill } from '../fill/bug-beetle-fill'
import { BugBeetleLight } from '../light/bug-beetle-light'
import { BugBeetleRegular } from '../regular/bug-beetle-regular'
import { BugBeetleThin } from '../thin/bug-beetle-thin'

const weightMap = {
  regular: BugBeetleRegular,
  bold: BugBeetleBold,
  duotone: BugBeetleDuotone,
  fill: BugBeetleFill,
  light: BugBeetleLight,
  thin: BugBeetleThin,
} as const

export const BugBeetle = (props: IconProps) => {
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
