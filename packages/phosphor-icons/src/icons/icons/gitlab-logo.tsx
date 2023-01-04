import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitlabLogoBold } from '../bold/gitlab-logo-bold'
import { GitlabLogoDuotone } from '../duotone/gitlab-logo-duotone'
import { GitlabLogoFill } from '../fill/gitlab-logo-fill'
import { GitlabLogoLight } from '../light/gitlab-logo-light'
import { GitlabLogoRegular } from '../regular/gitlab-logo-regular'
import { GitlabLogoThin } from '../thin/gitlab-logo-thin'

const weightMap = {
  regular: GitlabLogoRegular,
  bold: GitlabLogoBold,
  duotone: GitlabLogoDuotone,
  fill: GitlabLogoFill,
  light: GitlabLogoLight,
  thin: GitlabLogoThin,
} as const

export const GitlabLogo = (props: IconProps) => {
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
