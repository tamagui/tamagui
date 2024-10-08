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
      <Path d="m3.2 12.9-.9-.4" stroke={color} />
      <Path d="m3.2 15.1-.9.4" stroke={color} />
      <Path
        d="M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5"
        stroke={color}
      />
      <Path d="m4.9 11.2-.4-.9" stroke={color} />
      <Path d="m4.9 16.8-.4.9" stroke={color} />
      <Path d="m7.5 10.3-.4.9" stroke={color} />
      <Path d="m7.5 17.7-.4-.9" stroke={color} />
      <Path d="m9.7 12.5-.9.4" stroke={color} />
      <Path d="m9.7 15.5-.9-.4" stroke={color} />
      <_Circle cx="6" cy="14" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileCog'

export const FileCog = memo<IconProps>(themed(Icon))
