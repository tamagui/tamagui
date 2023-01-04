import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ExportBold } from '../bold/export-bold'
import { ExportDuotone } from '../duotone/export-duotone'
import { ExportFill } from '../fill/export-fill'
import { ExportLight } from '../light/export-light'
import { ExportRegular } from '../regular/export-regular'
import { ExportThin } from '../thin/export-thin'

const weightMap = {
  regular: ExportRegular,
  bold: ExportBold,
  duotone: ExportDuotone,
  fill: ExportFill,
  light: ExportLight,
  thin: ExportThin,
} as const

export const Export = (props: IconProps) => {
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
