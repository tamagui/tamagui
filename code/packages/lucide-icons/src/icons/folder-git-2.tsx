import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path
        d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"
        stroke={color}
      />
      <_Circle cx="13" cy="12" r="2" stroke={color} />
      <Path d="M18 19c-2.8 0-5-2.2-5-5v8" stroke={color} />
      <_Circle cx="20" cy="19" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FolderGit2'

export const FolderGit2 = memo<IconProps>(themed(Icon))
