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
      <Path d="M20 7h-3a2 2 0 0 1-2-2V2" stroke={color} />
      <Path
        d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"
        stroke={color}
      />
      <Path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Files'

export const Files = memo<IconProps>(themed(Icon))
