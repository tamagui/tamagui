import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { SlackLogoBold } from '../bold/slack-logo-bold'
import { SlackLogoDuotone } from '../duotone/slack-logo-duotone'
import { SlackLogoFill } from '../fill/slack-logo-fill'
import { SlackLogoLight } from '../light/slack-logo-light'
import { SlackLogoRegular } from '../regular/slack-logo-regular'
import { SlackLogoThin } from '../thin/slack-logo-thin'

const weightMap = {
  regular: SlackLogoRegular,
  bold: SlackLogoBold,
  duotone: SlackLogoDuotone,
  fill: SlackLogoFill,
  light: SlackLogoLight,
  thin: SlackLogoThin,
} as const

export const SlackLogo = (props: IconProps) => {
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
