import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { AppStoreLogoBold } from '../bold/app-store-logo-bold'
import { AppStoreLogoDuotone } from '../duotone/app-store-logo-duotone'
import { AppStoreLogoFill } from '../fill/app-store-logo-fill'
import { AppStoreLogoLight } from '../light/app-store-logo-light'
import { AppStoreLogoRegular } from '../regular/app-store-logo-regular'
import { AppStoreLogoThin } from '../thin/app-store-logo-thin'

const weightMap = {
  regular: AppStoreLogoRegular,
  bold: AppStoreLogoBold,
  duotone: AppStoreLogoDuotone,
  fill: AppStoreLogoFill,
  light: AppStoreLogoLight,
  thin: AppStoreLogoThin,
} as const

export const AppStoreLogo = (props: IconProps) => {
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
