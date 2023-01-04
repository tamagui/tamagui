import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ArrowsInBold } from '../bold/arrows-in-bold'
import { ArrowsInDuotone } from '../duotone/arrows-in-duotone'
import { ArrowsInFill } from '../fill/arrows-in-fill'
import { ArrowsInLight } from '../light/arrows-in-light'
import { ArrowsInRegular } from '../regular/arrows-in-regular'
import { ArrowsInThin } from '../thin/arrows-in-thin'

const weightMap = {
  regular: ArrowsInRegular,
  bold: ArrowsInBold,
  duotone: ArrowsInDuotone,
  fill: ArrowsInFill,
  light: ArrowsInLight,
  thin: ArrowsInThin,
} as const

export const ArrowsIn = (props: IconProps) => {
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
