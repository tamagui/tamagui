import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { BankBold } from '../bold/bank-bold'
import { BankDuotone } from '../duotone/bank-duotone'
import { BankFill } from '../fill/bank-fill'
import { BankLight } from '../light/bank-light'
import { BankRegular } from '../regular/bank-regular'
import { BankThin } from '../thin/bank-thin'

const weightMap = {
  regular: BankRegular,
  bold: BankBold,
  duotone: BankDuotone,
  fill: BankFill,
  light: BankLight,
  thin: BankThin,
} as const

export const Bank = (props: IconProps) => {
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
