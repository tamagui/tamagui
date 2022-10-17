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
    mostRecentTS: number;
    numActive: number;
    touchBank: Array<TouchRecord>;
};
export declare class ResponderTouchHistoryStore {
    _hist: {
        touchBank: never[];
        numActive: number;
        indexOfSingleActiveTouch: number;
        mostRecentTS: number;
    };
    recordTouchTrack(topLevelType: string, nativeEvent: TouchEvent): void;
    get touchHistory(): TouchHistory;
}
export {};
//# sourceMappingURL=ResponderTouchHistoryStore.d.ts.map