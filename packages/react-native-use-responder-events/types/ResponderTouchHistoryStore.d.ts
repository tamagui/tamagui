/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { TouchEvent } from './types';
export declare class ResponderTouchHistoryStore {
    _touchHistory: {
        touchBank: never[];
        numberActiveTouches: number;
        indexOfSingleActiveTouch: number;
        mostRecentTimeStamp: number;
    };
    recordTouchTrack(topLevelType: string, nativeEvent: TouchEvent): void;
    get touchHistory(): TouchHistory;
}
type TouchRecord = {
    currentPageX: number;
    currentPageY: number;
    currentTimeStamp: number;
    previousPageX: number;
    previousPageY: number;
    previousTimeStamp: number;
    startPageX: number;
    startPageY: number;
    startTimeStamp: number;
    touchActive: boolean;
};
export type TouchHistory = {
    indexOfSingleActiveTouch: number;
    mostRecentTimeStamp: number;
    numberActiveTouches: number;
    touchBank: Array<TouchRecord>;
};
export {};
//# sourceMappingURL=ResponderTouchHistoryStore.d.ts.map