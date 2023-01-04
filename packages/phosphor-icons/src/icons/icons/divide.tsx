import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { DivideBold } from '../bold/divide-bold'
import { DivideDuotone } from '../duotone/divide-duotone'
import { DivideFill } from '../fill/divide-fill'
import { DivideLight } from '../light/divide-light'
import { DivideRegular } from '../regular/divide-regular'
import { DivideThin } from '../thin/divide-thin'

const weightMap = {
  regular: DivideRegular,
  bold: DivideBold,
  duotone: DivideDuotone,
  fill: DivideFill,
  light: DivideLight,
  thin: DivideThin,
} as const

export const Divide = (props: IconProps) => {
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
