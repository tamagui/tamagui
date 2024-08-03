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

      <Path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16" stroke={color} />
      <Path d="M2 14h12" stroke={color} />
      <Path d="M22 14h-2" stroke={color} />
      <Path d="M12 20v-6" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M22 16V6a2 2 0 0 0-2-2H10" stroke={color} />
    </Svg>);

};

Icon.displayName = 'TouchpadOff';

export const TouchpadOff = React.memo<IconProps>(themed(Icon));