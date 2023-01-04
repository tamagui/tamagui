import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ListChecksBold } from '../bold/list-checks-bold'
import { ListChecksDuotone } from '../duotone/list-checks-duotone'
import { ListChecksFill } from '../fill/list-checks-fill'
import { ListChecksLight } from '../light/list-checks-light'
import { ListChecksRegular } from '../regular/list-checks-regular'
import { ListChecksThin } from '../thin/list-checks-thin'

const weightMap = {
  regular: ListChecksRegular,
  bold: ListChecksBold,
  duotone: ListChecksDuotone,
  fill: ListChecksFill,
  light: ListChecksLight,
  thin: ListChecksThin,
} as const

export const ListChecks = (props: IconProps) => {
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
