import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GithubLogoBold } from '../bold/github-logo-bold'
import { GithubLogoDuotone } from '../duotone/github-logo-duotone'
import { GithubLogoFill } from '../fill/github-logo-fill'
import { GithubLogoLight } from '../light/github-logo-light'
import { GithubLogoRegular } from '../regular/github-logo-regular'
import { GithubLogoThin } from '../thin/github-logo-thin'

const weightMap = {
  regular: GithubLogoRegular,
  bold: GithubLogoBold,
  duotone: GithubLogoDuotone,
  fill: GithubLogoFill,
  light: GithubLogoLight,
  thin: GithubLogoThin,
} as const

export const GithubLogo = (props: IconProps) => {
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
