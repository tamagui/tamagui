import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { LadderBold } from '../bold/ladder-bold'
import { LadderDuotone } from '../duotone/ladder-duotone'
import { LadderFill } from '../fill/ladder-fill'
import { LadderLight } from '../light/ladder-light'
import { LadderRegular } from '../regular/ladder-regular'
import { LadderThin } from '../thin/ladder-thin'

const weightMap = {
  regular: LadderRegular,
  bold: LadderBold,
  duotone: LadderDuotone,
  fill: LadderFill,
  light: LadderLight,
  thin: LadderThin,
} as const

export const Ladder = (props: IconProps) => {
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
