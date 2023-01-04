import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ScribbleLoopBold } from '../bold/scribble-loop-bold'
import { ScribbleLoopDuotone } from '../duotone/scribble-loop-duotone'
import { ScribbleLoopFill } from '../fill/scribble-loop-fill'
import { ScribbleLoopLight } from '../light/scribble-loop-light'
import { ScribbleLoopRegular } from '../regular/scribble-loop-regular'
import { ScribbleLoopThin } from '../thin/scribble-loop-thin'

const weightMap = {
  regular: ScribbleLoopRegular,
  bold: ScribbleLoopBold,
  duotone: ScribbleLoopDuotone,
  fill: ScribbleLoopFill,
  light: ScribbleLoopLight,
  thin: ScribbleLoopThin,
} as const

export const ScribbleLoop = (props: IconProps) => {
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
