/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { TouchHistory } from '@tamagui/react-native-use-responder-events';
export declare const noCentroid = -1;
export declare function currentCentroidXOfTouchesChangedAfter(touchHistory: TouchHistory, touchesChangedAfter: number): number;
export declare function currentCentroidYOfTouchesChangedAfter(touchHistory: TouchHistory, touchesChangedAfter: number): number;
export declare function previousCentroidXOfTouchesChangedAfter(touchHistory: TouchHistory, touchesChangedAfter: number): number;
export declare function previousCentroidYOfTouchesChangedAfter(touchHistory: TouchHistory, touchesChangedAfter: number): number;
export declare function currentCentroidX(touchHistory: TouchHistory): number;
export declare function currentCentroidY(touchHistory: TouchHistory): number;
//# sourceMappingURL=TouchHistoryMath.d.ts.map