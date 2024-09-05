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

      <Path
        d="M17.5 5.5C19 7 20.5 9 21 11c-1.323.265-2.646.39-4.118.226"
        stroke={color} />

      <Path d="M5.5 17.5C7 19 9 20.5 11 21c.5-2.5.5-5-1-8.5" stroke={color} />
      <Path d="M17.5 17.5c-2.5 0-4 0-6-1" stroke={color} />
      <Path d="M20 11.5c1 1.5 2 3.5 2 4.5" stroke={color} />
      <Path d="M11.5 20c1.5 1 3.5 2 4.5 2 .5-1.5 0-3-.5-4.5" stroke={color} />
      <Path d="M22 22c-2 0-3.5-.5-5.5-1.5" stroke={color} />
      <Path
        d="M4.783 4.782C1.073 8.492 1 14.5 5 18c1-1 2-4.5 1.5-6.5 1.5 1 4 1 5.5.5M8.227 2.57C11.578 1.335 15.453 2.089 18 5c-.88.88-3.7 1.761-5.726 1.618"
        stroke={color} />

      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>);

};

Icon.displayName = 'HopOff';

export const HopOff = React.memo<IconProps>(themed(Icon));