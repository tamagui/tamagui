import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlowerLotusBold } from '../bold/flower-lotus-bold'
import { FlowerLotusDuotone } from '../duotone/flower-lotus-duotone'
import { FlowerLotusFill } from '../fill/flower-lotus-fill'
import { FlowerLotusLight } from '../light/flower-lotus-light'
import { FlowerLotusRegular } from '../regular/flower-lotus-regular'
import { FlowerLotusThin } from '../thin/flower-lotus-thin'

const weightMap = {
  regular: FlowerLotusRegular,
  bold: FlowerLotusBold,
  duotone: FlowerLotusDuotone,
  fill: FlowerLotusFill,
  light: FlowerLotusLight,
  thin: FlowerLotusThin,
} as const

export const FlowerLotus = (props: IconProps) => {
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
