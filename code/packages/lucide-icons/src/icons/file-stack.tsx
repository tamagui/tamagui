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
      <Path d="M21 7h-3a2 2 0 0 1-2-2V2" stroke={color} />
      <Path
        d="M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z"
        stroke={color}
      />
      <Path d="M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15" stroke={color} />
      <Path d="M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileStack'

export const FileStack = memo<IconProps>(themed(Icon))
