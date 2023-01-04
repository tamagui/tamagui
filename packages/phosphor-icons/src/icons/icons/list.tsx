import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ListBold } from '../bold/list-bold'
import { ListDuotone } from '../duotone/list-duotone'
import { ListFill } from '../fill/list-fill'
import { ListLight } from '../light/list-light'
import { ListRegular } from '../regular/list-regular'
import { ListThin } from '../thin/list-thin'

const weightMap = {
  regular: ListRegular,
  bold: ListBold,
  duotone: ListDuotone,
  fill: ListFill,
  light: ListLight,
  thin: ListThin,
} as const

export const List = (props: IconProps) => {
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
