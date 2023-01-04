import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FingerprintSimpleBold } from '../bold/fingerprint-simple-bold'
import { FingerprintSimpleDuotone } from '../duotone/fingerprint-simple-duotone'
import { FingerprintSimpleFill } from '../fill/fingerprint-simple-fill'
import { FingerprintSimpleLight } from '../light/fingerprint-simple-light'
import { FingerprintSimpleRegular } from '../regular/fingerprint-simple-regular'
import { FingerprintSimpleThin } from '../thin/fingerprint-simple-thin'

const weightMap = {
  regular: FingerprintSimpleRegular,
  bold: FingerprintSimpleBold,
  duotone: FingerprintSimpleDuotone,
  fill: FingerprintSimpleFill,
  light: FingerprintSimpleLight,
  thin: FingerprintSimpleThin,
} as const

export const FingerprintSimple = (props: IconProps) => {
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
