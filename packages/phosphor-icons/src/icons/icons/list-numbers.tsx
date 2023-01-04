import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ListNumbersBold } from '../bold/list-numbers-bold'
import { ListNumbersDuotone } from '../duotone/list-numbers-duotone'
import { ListNumbersFill } from '../fill/list-numbers-fill'
import { ListNumbersLight } from '../light/list-numbers-light'
import { ListNumbersRegular } from '../regular/list-numbers-regular'
import { ListNumbersThin } from '../thin/list-numbers-thin'

const weightMap = {
  regular: ListNumbersRegular,
  bold: ListNumbersBold,
  duotone: ListNumbersDuotone,
  fill: ListNumbersFill,
  light: ListNumbersLight,
  thin: ListNumbersThin,
} as const

export const ListNumbers = (props: IconProps) => {
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
