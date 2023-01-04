import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PlusCircleBold } from '../bold/plus-circle-bold'
import { PlusCircleDuotone } from '../duotone/plus-circle-duotone'
import { PlusCircleFill } from '../fill/plus-circle-fill'
import { PlusCircleLight } from '../light/plus-circle-light'
import { PlusCircleRegular } from '../regular/plus-circle-regular'
import { PlusCircleThin } from '../thin/plus-circle-thin'

const weightMap = {
  regular: PlusCircleRegular,
  bold: PlusCircleBold,
  duotone: PlusCircleDuotone,
  fill: PlusCircleFill,
  light: PlusCircleLight,
  thin: PlusCircleThin,
} as const

export const PlusCircle = (props: IconProps) => {
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
