import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { QrCodeBold } from '../bold/qr-code-bold'
import { QrCodeDuotone } from '../duotone/qr-code-duotone'
import { QrCodeFill } from '../fill/qr-code-fill'
import { QrCodeLight } from '../light/qr-code-light'
import { QrCodeRegular } from '../regular/qr-code-regular'
import { QrCodeThin } from '../thin/qr-code-thin'

const weightMap = {
  regular: QrCodeRegular,
  bold: QrCodeBold,
  duotone: QrCodeDuotone,
  fill: QrCodeFill,
  light: QrCodeLight,
  thin: QrCodeThin,
} as const

export const QrCode = (props: IconProps) => {
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
