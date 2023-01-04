import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LadderSimpleBold } from '../bold/ladder-simple-bold'
import { LadderSimpleDuotone } from '../duotone/ladder-simple-duotone'
import { LadderSimpleFill } from '../fill/ladder-simple-fill'
import { LadderSimpleLight } from '../light/ladder-simple-light'
import { LadderSimpleRegular } from '../regular/ladder-simple-regular'
import { LadderSimpleThin } from '../thin/ladder-simple-thin'

const weightMap = {
  regular: LadderSimpleRegular,
  bold: LadderSimpleBold,
  duotone: LadderSimpleDuotone,
  fill: LadderSimpleFill,
  light: LadderSimpleLight,
  thin: LadderSimpleThin,
} as const

export const LadderSimple = (props: IconProps) => {
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
