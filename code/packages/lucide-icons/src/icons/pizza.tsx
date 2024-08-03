import * as React from "react";
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

      <Path d="M15 11h.01" stroke={color} />
      <Path d="M11 15h.01" stroke={color} />
      <Path d="M16 16h.01" stroke={color} />
      <Path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" stroke={color} />
      <Path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Pizza';

export const Pizza = React.memo<IconProps>(themed(Icon));