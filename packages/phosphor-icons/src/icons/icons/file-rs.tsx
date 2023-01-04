import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FileRsBold } from '../bold/file-rs-bold'
import { FileRsDuotone } from '../duotone/file-rs-duotone'
import { FileRsFill } from '../fill/file-rs-fill'
import { FileRsLight } from '../light/file-rs-light'
import { FileRsRegular } from '../regular/file-rs-regular'
import { FileRsThin } from '../thin/file-rs-thin'

const weightMap = {
  regular: FileRsRegular,
  bold: FileRsBold,
  duotone: FileRsDuotone,
  fill: FileRsFill,
  light: FileRsLight,
  thin: FileRsThin,
} as const

export const FileRs = (props: IconProps) => {
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
