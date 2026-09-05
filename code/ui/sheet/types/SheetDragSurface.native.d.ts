import * as React from 'react';
import type { SheetDragSurfaceProps } from './types';
/**
 * The surface the sheet is dragged by.
 *
 * With react-native-gesture-handler set up the drag is a `Gesture.Pan`, which
 * needs a native View of its own to attach to. Without it the drag runs on
 * PanResponder, the same as web.
 */
export declare function SheetDragSurface({ gestureHandlerEnabled, panGesture, panConfig, children, }: SheetDragSurfaceProps): React.JSX.Element;
//# sourceMappingURL=SheetDragSurface.native.d.ts.map