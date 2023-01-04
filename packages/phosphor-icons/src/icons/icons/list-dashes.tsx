import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ListDashesBold } from '../bold/list-dashes-bold'
import { ListDashesDuotone } from '../duotone/list-dashes-duotone'
import { ListDashesFill } from '../fill/list-dashes-fill'
import { ListDashesLight } from '../light/list-dashes-light'
import { ListDashesRegular } from '../regular/list-dashes-regular'
import { ListDashesThin } from '../thin/list-dashes-thin'

const weightMap = {
  regular: ListDashesRegular,
  bold: ListDashesBold,
  duotone: ListDashesDuotone,
  fill: ListDashesFill,
  light: ListDashesLight,
  thin: ListDashesThin,
} as const

export const ListDashes = (props: IconProps) => {
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
