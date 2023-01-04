import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileMinusBold } from '../bold/file-minus-bold'
import { FileMinusDuotone } from '../duotone/file-minus-duotone'
import { FileMinusFill } from '../fill/file-minus-fill'
import { FileMinusLight } from '../light/file-minus-light'
import { FileMinusRegular } from '../regular/file-minus-regular'
import { FileMinusThin } from '../thin/file-minus-thin'

const weightMap = {
  regular: FileMinusRegular,
  bold: FileMinusBold,
  duotone: FileMinusDuotone,
  fill: FileMinusFill,
  light: FileMinusLight,
  thin: FileMinusThin,
} as const

export const FileMinus = (props: IconProps) => {
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
