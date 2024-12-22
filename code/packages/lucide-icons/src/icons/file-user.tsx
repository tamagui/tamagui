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
      <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Path d="M15 18a3 3 0 1 0-6 0" stroke={color} />
      <Path
        d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"
        stroke={color}
      />
      <_Circle cx="12" cy="13" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileUser'

export const FileUser = memo<IconProps>(themed(Icon))
