import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BarcodeBold } from '../bold/barcode-bold'
import { BarcodeDuotone } from '../duotone/barcode-duotone'
import { BarcodeFill } from '../fill/barcode-fill'
import { BarcodeLight } from '../light/barcode-light'
import { BarcodeRegular } from '../regular/barcode-regular'
import { BarcodeThin } from '../thin/barcode-thin'

const weightMap = {
  regular: BarcodeRegular,
  bold: BarcodeBold,
  duotone: BarcodeDuotone,
  fill: BarcodeFill,
  light: BarcodeLight,
  thin: BarcodeThin,
} as const

export const Barcode = (props: IconProps) => {
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
