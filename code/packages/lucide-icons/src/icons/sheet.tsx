import React from "react";
import PropTypes from 'prop-types';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop } from
'react-native-svg';
import { themed } from '@tamagui/helpers-icon';

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props;
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
      {...otherProps}>

      <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke={color} />
      <Line x1="3" x2="21" y1="9" y2="9" stroke={color} />
      <Line x1="3" x2="21" y1="15" y2="15" stroke={color} />
      <Line x1="9" x2="9" y1="9" y2="21" stroke={color} />
      <Line x1="15" x2="15" y1="9" y2="21" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Sheet';

export const Sheet = React.memo<IconProps>(themed(Icon));