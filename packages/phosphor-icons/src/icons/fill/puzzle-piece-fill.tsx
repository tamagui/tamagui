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
      <_Path d="M165.8,224H208a16,16,0,0,0,16-16V170.3a7.9,7.9,0,0,0-3.6-6.6,7.7,7.7,0,0,0-7.5-.7,24.3,24.3,0,0,1-8.9,1.7c-13.2,0-24-11.1-24-24.7s10.8-24.7,24-24.7a24.3,24.3,0,0,1,8.9,1.7,7.7,7.7,0,0,0,7.5-.7,7.9,7.9,0,0,0,3.6-6.6V72a16,16,0,0,0-16-16H171.8c.1-1.3.2-2.7.2-4a36,36,0,0,0-72,0c0,1.3.1,2.7.2,4H64A16,16,0,0,0,48,72v32.2l-4-.2a36,36,0,0,0,0,72l4-.2V208a16,16,0,0,0,16,16h42.2" />
    </_Svg>
  )
}

Icon.displayName = 'PuzzlePieceFill'

export const PuzzlePieceFill = memo<IconProps>(themed(Icon))
