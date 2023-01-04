import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitCommitBold } from '../bold/git-commit-bold'
import { GitCommitDuotone } from '../duotone/git-commit-duotone'
import { GitCommitFill } from '../fill/git-commit-fill'
import { GitCommitLight } from '../light/git-commit-light'
import { GitCommitRegular } from '../regular/git-commit-regular'
import { GitCommitThin } from '../thin/git-commit-thin'

const weightMap = {
  regular: GitCommitRegular,
  bold: GitCommitBold,
  duotone: GitCommitDuotone,
  fill: GitCommitFill,
  light: GitCommitLight,
  thin: GitCommitThin,
} as const

export const GitCommit = (props: IconProps) => {
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
