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
      <_Path d="M94.4,172.8,80,192l14.4,19.2a8,8,0,0,1-1.6,11.2A7.7,7.7,0,0,1,88,224a8,8,0,0,1-6.4-3.2L70,205.3,58.4,220.8A8,8,0,0,1,52,224a7.7,7.7,0,0,1-4.8-1.6,8,8,0,0,1-1.6-11.2L60,192,45.6,172.8a8,8,0,1,1,12.8-9.6L70,178.7l11.6-15.5a8,8,0,0,1,12.8,9.6ZM148,208H128V168a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8h28a8,8,0,0,0,0-16Zm45.7-24.2c-3.1-.8-8.6-2.3-9.7-3.6V180c0-3.3,2.4-5,7-5a18.4,18.4,0,0,1,10,3.2h-.1A8.3,8.3,0,0,0,206,180a8,8,0,0,0,8-8,7.6,7.6,0,0,0-2.9-6.1h0A33.4,33.4,0,0,0,191,159c-13.5,0-23,8.6-23,21s13,17,21.6,19.3c3.4.9,7,1.8,9.2,3.1s1.2,1,1.2,1.6,0,5-9,5a18.4,18.4,0,0,1-10-3.2h.1A8.3,8.3,0,0,0,176,204a8,8,0,0,0-8,8,7.6,7.6,0,0,0,2.9,6.1h0A33.4,33.4,0,0,0,191,225c15.7,0,25-7.9,25-21S202,186,193.7,183.8ZM216,88v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40A16,16,0,0,1,56,24h96a8.1,8.1,0,0,1,5.7,2.3l56,56A8.1,8.1,0,0,1,216,88Zm-20,0L152,44V88Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileXlsFill'

export const FileXlsFill = memo<IconProps>(themed(Icon))
