import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Line, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <_Circle cx="18" cy="18" r="3" stroke={color} />
      <_Circle cx="6" cy="6" r="3" stroke={color} />
      <Path d="M13 6h3a2 2 0 0 1 2 2v7" stroke={color} />
      <Line x1="6" x2="6" y1="9" y2="21" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitPullRequest'

export const GitPullRequest = memo<IconProps>(themed(Icon))
