import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitPullRequestBold } from '../bold/git-pull-request-bold'
import { GitPullRequestDuotone } from '../duotone/git-pull-request-duotone'
import { GitPullRequestFill } from '../fill/git-pull-request-fill'
import { GitPullRequestLight } from '../light/git-pull-request-light'
import { GitPullRequestRegular } from '../regular/git-pull-request-regular'
import { GitPullRequestThin } from '../thin/git-pull-request-thin'

const weightMap = {
  regular: GitPullRequestRegular,
  bold: GitPullRequestBold,
  duotone: GitPullRequestDuotone,
  fill: GitPullRequestFill,
  light: GitPullRequestLight,
  thin: GitPullRequestThin,
} as const

export const GitPullRequest = (props: IconProps) => {
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
