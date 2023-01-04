import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { ReceiptBold } from '../bold/receipt-bold'
import { ReceiptDuotone } from '../duotone/receipt-duotone'
import { ReceiptFill } from '../fill/receipt-fill'
import { ReceiptLight } from '../light/receipt-light'
import { ReceiptRegular } from '../regular/receipt-regular'
import { ReceiptThin } from '../thin/receipt-thin'

const weightMap = {
  regular: ReceiptRegular,
  bold: ReceiptBold,
  duotone: ReceiptDuotone,
  fill: ReceiptFill,
  light: ReceiptLight,
  thin: ReceiptThin,
} as const

export const Receipt = (props: IconProps) => {
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
