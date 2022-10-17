/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { TouchEvent } from './types';
declare type TouchRecord = {
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
export declare type TouchHistory = {
    indexOfSingleActiveTouch: number;
    mostRecentTimeStamp: number;
    numberActiveTouches: number;
    touchBank: Array<TouchRecord>;
};
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
export {};
//# sourceMappingURL=ResponderTouchHistoryStore.d.ts.map