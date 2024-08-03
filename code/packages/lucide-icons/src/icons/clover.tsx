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

      <Path
        d="M16.2 3.8a2.7 2.7 0 0 0-3.81 0l-.4.38-.4-.4a2.7 2.7 0 0 0-3.82 0C6.73 4.85 6.67 6.64 8 8l4 4 4-4c1.33-1.36 1.27-3.15.2-4.2z"
        stroke={color} />

      <Path
        d="M8 8c-1.36-1.33-3.15-1.27-4.2-.2a2.7 2.7 0 0 0 0 3.81l.38.4-.4.4a2.7 2.7 0 0 0 0 3.82C4.85 17.27 6.64 17.33 8 16"
        stroke={color} />

      <Path
        d="M16 16c1.36 1.33 3.15 1.27 4.2.2a2.7 2.7 0 0 0 0-3.81l-.38-.4.4-.4a2.7 2.7 0 0 0 0-3.82C19.15 6.73 17.36 6.67 16 8"
        stroke={color} />

      <Path
        d="M7.8 20.2a2.7 2.7 0 0 0 3.81 0l.4-.38.4.4a2.7 2.7 0 0 0 3.82 0c1.06-1.06 1.12-2.85-.21-4.21l-4-4-4 4c-1.33 1.36-1.27 3.15-.2 4.2z"
        stroke={color} />

      <Path d="m7 17-5 5" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Clover';

export const Clover = React.memo<IconProps>(themed(Icon));