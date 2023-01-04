import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { FlagBannerBold } from '../bold/flag-banner-bold'
import { FlagBannerDuotone } from '../duotone/flag-banner-duotone'
import { FlagBannerFill } from '../fill/flag-banner-fill'
import { FlagBannerLight } from '../light/flag-banner-light'
import { FlagBannerRegular } from '../regular/flag-banner-regular'
import { FlagBannerThin } from '../thin/flag-banner-thin'

const weightMap = {
  regular: FlagBannerRegular,
  bold: FlagBannerBold,
  duotone: FlagBannerDuotone,
  fill: FlagBannerFill,
  light: FlagBannerLight,
  thin: FlagBannerThin,
} as const

export const FlagBanner = (props: IconProps) => {
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
