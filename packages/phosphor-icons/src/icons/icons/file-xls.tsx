import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileXlsBold } from '../bold/file-xls-bold'
import { FileXlsDuotone } from '../duotone/file-xls-duotone'
import { FileXlsFill } from '../fill/file-xls-fill'
import { FileXlsLight } from '../light/file-xls-light'
import { FileXlsRegular } from '../regular/file-xls-regular'
import { FileXlsThin } from '../thin/file-xls-thin'

const weightMap = {
  regular: FileXlsRegular,
  bold: FileXlsBold,
  duotone: FileXlsDuotone,
  fill: FileXlsFill,
  light: FileXlsLight,
  thin: FileXlsThin,
} as const

export const FileXls = (props: IconProps) => {
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
