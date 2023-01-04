import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitBranchBold } from '../bold/git-branch-bold'
import { GitBranchDuotone } from '../duotone/git-branch-duotone'
import { GitBranchFill } from '../fill/git-branch-fill'
import { GitBranchLight } from '../light/git-branch-light'
import { GitBranchRegular } from '../regular/git-branch-regular'
import { GitBranchThin } from '../thin/git-branch-thin'

const weightMap = {
  regular: GitBranchRegular,
  bold: GitBranchBold,
  duotone: GitBranchDuotone,
  fill: GitBranchFill,
  light: GitBranchLight,
  thin: GitBranchThin,
} as const

export const GitBranch = (props: IconProps) => {
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
