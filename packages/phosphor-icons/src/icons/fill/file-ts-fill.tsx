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
      <_Path d="M92,168a8,8,0,0,1-8,8H74v40a8,8,0,0,1-16,0V176H48a8,8,0,0,1,0-16H84A8,8,0,0,1,92,168Zm37.7,15.8c-3.1-.8-8.6-2.3-9.7-3.6V180c0-3.3,2.4-5,7-5a18.4,18.4,0,0,1,10,3.2h-.1A8.3,8.3,0,0,0,142,180a8,8,0,0,0,8-8,7.6,7.6,0,0,0-2.9-6.1h0A33.4,33.4,0,0,0,127,159c-13.5,0-23,8.6-23,21s13,17,21.6,19.3c3.4.9,7,1.8,9.2,3.1s1.2,1,1.2,1.6,0,5-9,5a18.4,18.4,0,0,1-10-3.2h.1A8.3,8.3,0,0,0,112,204a8,8,0,0,0-8,8,7.6,7.6,0,0,0,2.9,6.1h0A33.4,33.4,0,0,0,127,225c15.7,0,25-7.9,25-21S138,186,129.7,183.8ZM216,88V216a16,16,0,0,1-16,16H184a8,8,0,0,1-8-8V144a8,8,0,0,0-8-8H48a8,8,0,0,1-8-8V40A16,16,0,0,1,56,24h96a8.1,8.1,0,0,1,5.7,2.3l56,56A8.1,8.1,0,0,1,216,88Zm-20,0L152,44V88Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileTsFill'

export const FileTsFill = memo<IconProps>(themed(Icon))
