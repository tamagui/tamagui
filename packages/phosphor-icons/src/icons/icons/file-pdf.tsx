import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FilePdfBold } from '../bold/file-pdf-bold'
import { FilePdfDuotone } from '../duotone/file-pdf-duotone'
import { FilePdfFill } from '../fill/file-pdf-fill'
import { FilePdfLight } from '../light/file-pdf-light'
import { FilePdfRegular } from '../regular/file-pdf-regular'
import { FilePdfThin } from '../thin/file-pdf-thin'

const weightMap = {
  regular: FilePdfRegular,
  bold: FilePdfBold,
  duotone: FilePdfDuotone,
  fill: FilePdfFill,
  light: FilePdfLight,
  thin: FilePdfThin,
} as const

export const FilePdf = (props: IconProps) => {
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
