import { useContext } from 'react'

import { IconContext } from '../../IconContext'
import { IconProps } from '../../IconProps'
import { GitForkBold } from '../bold/git-fork-bold'
import { GitForkDuotone } from '../duotone/git-fork-duotone'
import { GitForkFill } from '../fill/git-fork-fill'
import { GitForkLight } from '../light/git-fork-light'
import { GitForkRegular } from '../regular/git-fork-regular'
import { GitForkThin } from '../thin/git-fork-thin'

const weightMap = {
  regular: GitForkRegular,
  bold: GitForkBold,
  duotone: GitForkDuotone,
  fill: GitForkFill,
  light: GitForkLight,
  thin: GitForkThin,
} as const

export const GitFork = (props: IconProps) => {
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
