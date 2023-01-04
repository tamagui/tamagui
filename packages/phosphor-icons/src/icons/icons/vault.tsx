import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { VaultBold } from '../bold/vault-bold'
import { VaultDuotone } from '../duotone/vault-duotone'
import { VaultFill } from '../fill/vault-fill'
import { VaultLight } from '../light/vault-light'
import { VaultRegular } from '../regular/vault-regular'
import { VaultThin } from '../thin/vault-thin'

const weightMap = {
  regular: VaultRegular,
  bold: VaultBold,
  duotone: VaultDuotone,
  fill: VaultFill,
  light: VaultLight,
  thin: VaultThin,
} as const

export const Vault = (props: IconProps) => {
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
