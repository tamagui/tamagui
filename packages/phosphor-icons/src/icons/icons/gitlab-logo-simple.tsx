import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitlabLogoSimpleBold } from '../bold/gitlab-logo-simple-bold'
import { GitlabLogoSimpleDuotone } from '../duotone/gitlab-logo-simple-duotone'
import { GitlabLogoSimpleFill } from '../fill/gitlab-logo-simple-fill'
import { GitlabLogoSimpleLight } from '../light/gitlab-logo-simple-light'
import { GitlabLogoSimpleRegular } from '../regular/gitlab-logo-simple-regular'
import { GitlabLogoSimpleThin } from '../thin/gitlab-logo-simple-thin'

const weightMap = {
  regular: GitlabLogoSimpleRegular,
  bold: GitlabLogoSimpleBold,
  duotone: GitlabLogoSimpleDuotone,
  fill: GitlabLogoSimpleFill,
  light: GitlabLogoSimpleLight,
  thin: GitlabLogoSimpleThin,
} as const

export const GitlabLogoSimple = (props: IconProps) => {
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
