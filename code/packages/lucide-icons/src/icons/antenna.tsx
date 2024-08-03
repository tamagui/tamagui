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

      <Path d="M2 12 7 2" stroke={color} />
      <Path d="m7 12 5-10" stroke={color} />
      <Path d="m12 12 5-10" stroke={color} />
      <Path d="m17 12 5-10" stroke={color} />
      <Path d="M4.5 7h15" stroke={color} />
      <Path d="M12 16v6" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Antenna';

export const Antenna = React.memo<IconProps>(themed(Icon));