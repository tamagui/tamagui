import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitDiffBold } from '../bold/git-diff-bold'
import { GitDiffDuotone } from '../duotone/git-diff-duotone'
import { GitDiffFill } from '../fill/git-diff-fill'
import { GitDiffLight } from '../light/git-diff-light'
import { GitDiffRegular } from '../regular/git-diff-regular'
import { GitDiffThin } from '../thin/git-diff-thin'

const weightMap = {
  regular: GitDiffRegular,
  bold: GitDiffBold,
  duotone: GitDiffDuotone,
  fill: GitDiffFill,
  light: GitDiffLight,
  thin: GitDiffThin,
} as const

export const GitDiff = (props: IconProps) => {
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
