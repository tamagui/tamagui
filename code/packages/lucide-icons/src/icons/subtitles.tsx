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
      <Path d="M7 13h4" stroke={color} />
      <Path d="M15 13h2" stroke={color} />
      <Path d="M7 9h2" stroke={color} />
      <Path d="M13 9h4" stroke={color} />
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Subtitles'

export const Subtitles = memo<IconProps>(themed(Icon))
