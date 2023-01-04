import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { WalletBold } from '../bold/wallet-bold'
import { WalletDuotone } from '../duotone/wallet-duotone'
import { WalletFill } from '../fill/wallet-fill'
import { WalletLight } from '../light/wallet-light'
import { WalletRegular } from '../regular/wallet-regular'
import { WalletThin } from '../thin/wallet-thin'

const weightMap = {
  regular: WalletRegular,
  bold: WalletBold,
  duotone: WalletDuotone,
  fill: WalletFill,
  light: WalletLight,
  thin: WalletThin,
} as const

export const Wallet = (props: IconProps) => {
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
