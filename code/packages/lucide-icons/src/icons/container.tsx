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
        d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"
        stroke={color}
      />
      <Path d="M10 21.9V14L2.1 9.1" stroke={color} />
      <Path d="m10 14 11.9-6.9" stroke={color} />
      <Path d="M14 19.8v-8.1" stroke={color} />
      <Path d="M18 17.5V9.4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Container'

export const Container = memo<IconProps>(themed(Icon))
