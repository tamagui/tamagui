import * as React from 'react';
import type { SheetDragSurfaceProps } from './types';
/**
 * The surface the sheet is dragged by.
 *
 * Web runs the same PanResponder react-native does, over the same responder
 * system, so the drag behaves as it did when this was a react-native `View`.
 * `gestureHandler` is native-only, so the props for it are ignored here.
 */
export declare function SheetDragSurface({ panConfig, children }: SheetDragSurfaceProps): React.JSX.Element;
//# sourceMappingURL=SheetDragSurface.d.ts.map