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

      <Rect width="16" height="10" x="2" y="7" rx="2" ry="2" stroke={color} />
      <Line x1="22" x2="22" y1="11" y2="13" stroke={color} />
      <Line x1="6" x2="6" y1="11" y2="13" stroke={color} />
      <Line x1="10" x2="10" y1="11" y2="13" stroke={color} />
    </Svg>);

};

Icon.displayName = 'BatteryMedium';

export const BatteryMedium = React.memo<IconProps>(themed(Icon));