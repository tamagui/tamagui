import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitMergeBold } from '../bold/git-merge-bold'
import { GitMergeDuotone } from '../duotone/git-merge-duotone'
import { GitMergeFill } from '../fill/git-merge-fill'
import { GitMergeLight } from '../light/git-merge-light'
import { GitMergeRegular } from '../regular/git-merge-regular'
import { GitMergeThin } from '../thin/git-merge-thin'

const weightMap = {
  regular: GitMergeRegular,
  bold: GitMergeBold,
  duotone: GitMergeDuotone,
  fill: GitMergeFill,
  light: GitMergeLight,
  thin: GitMergeThin,
} as const

export const GitMerge = (props: IconProps) => {
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
