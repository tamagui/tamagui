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
        d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"
        stroke={color} />

      <Path d="M16 8V5c0-1.1.9-2 2-2" stroke={color} />
      <Path d="M12 13h4" stroke={color} />
      <Path d="M12 18h6a2 2 0 0 1 2 2v1" stroke={color} />
      <Path d="M12 8h8" stroke={color} />
      <Path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" stroke={color} />
      <Path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" stroke={color} />
      <Path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" stroke={color} />
      <Path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" stroke={color} />
    </Svg>);

};

Icon.displayName = 'BrainCircuit';

export const BrainCircuit = React.memo<IconProps>(themed(Icon));