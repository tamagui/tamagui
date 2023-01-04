import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ListPlusBold } from '../bold/list-plus-bold'
import { ListPlusDuotone } from '../duotone/list-plus-duotone'
import { ListPlusFill } from '../fill/list-plus-fill'
import { ListPlusLight } from '../light/list-plus-light'
import { ListPlusRegular } from '../regular/list-plus-regular'
import { ListPlusThin } from '../thin/list-plus-thin'

const weightMap = {
  regular: ListPlusRegular,
  bold: ListPlusBold,
  duotone: ListPlusDuotone,
  fill: ListPlusFill,
  light: ListPlusLight,
  thin: ListPlusThin,
} as const

export const ListPlus = (props: IconProps) => {
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
