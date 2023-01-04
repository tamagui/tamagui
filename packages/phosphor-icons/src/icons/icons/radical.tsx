import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { RadicalBold } from '../bold/radical-bold'
import { RadicalDuotone } from '../duotone/radical-duotone'
import { RadicalFill } from '../fill/radical-fill'
import { RadicalLight } from '../light/radical-light'
import { RadicalRegular } from '../regular/radical-regular'
import { RadicalThin } from '../thin/radical-thin'

const weightMap = {
  regular: RadicalRegular,
  bold: RadicalBold,
  duotone: RadicalDuotone,
  fill: RadicalFill,
  light: RadicalLight,
  thin: RadicalThin,
} as const

export const Radical = (props: IconProps) => {
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
