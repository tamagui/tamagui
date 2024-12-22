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
        d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5"
        stroke={color}
      />
      <Path d="M12 10v4h4" stroke={color} />
      <Path d="m12 14 1.535-1.605a5 5 0 0 1 8 1.5" stroke={color} />
      <Path d="M22 22v-4h-4" stroke={color} />
      <Path d="m22 18-1.535 1.605a5 5 0 0 1-8-1.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FolderSync'

export const FolderSync = memo<IconProps>(themed(Icon))
