import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
        d="M2 9V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2"
        stroke={color}
      />
      <Path d="m8 16 3-3-3-3" stroke={color} />
      <Path d="M2 16v-1a2 2 0 0 1 2-2h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FolderSymlink'

export const FolderSymlink = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
