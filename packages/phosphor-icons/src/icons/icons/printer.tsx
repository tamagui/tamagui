import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { PrinterBold } from '../bold/printer-bold'
import { PrinterDuotone } from '../duotone/printer-duotone'
import { PrinterFill } from '../fill/printer-fill'
import { PrinterLight } from '../light/printer-light'
import { PrinterRegular } from '../regular/printer-regular'
import { PrinterThin } from '../thin/printer-thin'

const weightMap = {
  regular: PrinterRegular,
  bold: PrinterBold,
  duotone: PrinterDuotone,
  fill: PrinterFill,
  light: PrinterLight,
  thin: PrinterThin,
} as const

export const Printer = (props: IconProps) => {
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
