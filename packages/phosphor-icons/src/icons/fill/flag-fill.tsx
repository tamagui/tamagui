import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M219.6,40.8a8.2,8.2,0,0,0-8.4.8c-28.3,21.2-52.3,11-80-.9s-60.3-25.9-96,.9h-.1l-.4.3-.2.2-.3.3-.3.3-.2.3-.3.3c0,.1-.1.2-.2.3l-.2.4c0,.1-.1.2-.1.3a.8.8,0,0,0-.2.4c-.1.1-.1.2-.2.4s-.1.2-.1.3-.1.3-.1.4-.1.2-.1.3-.1.3-.1.4V47c0,.1-.1.3-.1.4V216a8,8,0,0,0,16,0V172.1c26.9-18.1,50.1-8.2,76.8,3.3,16.3,6.9,33.8,14.4,52.6,14.4,13.8,0,28.3-4,43.4-15.4A8.1,8.1,0,0,0,224,168V48A8.2,8.2,0,0,0,219.6,40.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'FlagFill'

export const FlagFill = memo<IconProps>(themed(Icon))
