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
      <_Path d="M148,48a8,8,0,0,1-8,8H116a8,8,0,0,1,0-16h24A8,8,0,0,1,148,48Zm-8,152H116a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM180,56h20V76a8,8,0,0,0,16,0V56a16,16,0,0,0-16-16H180a8,8,0,0,0,0,16Zm28,52a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V116A8,8,0,0,0,208,108ZM48,148a8,8,0,0,0,8-8V116a8,8,0,0,0-16,0v24A8,8,0,0,0,48,148Zm28,52H56V180a8,8,0,0,0-16,0v20a16,16,0,0,0,16,16H76a8,8,0,0,0,0-16ZM76,40H56A16,16,0,0,0,40,56V76a8,8,0,0,0,16,0V56H76a8,8,0,0,0,0-16ZM236,200H216V180a8,8,0,0,0-16,0v20H180a8,8,0,0,0,0,16h20v20a8,8,0,0,0,16,0V216h20a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'SelectionPlusFill'

export const SelectionPlusFill = memo<IconProps>(themed(Icon))
