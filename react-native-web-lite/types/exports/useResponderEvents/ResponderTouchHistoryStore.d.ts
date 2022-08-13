import type { TouchEvent } from './ResponderEventTypes';
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