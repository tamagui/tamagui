declare const TouchHistoryMath: {
    centroidDimension: (touchHistory: any, touchesChangedAfter: any, isXAxis: any, ofCurrent: any) => number;
    currentCentroidXOfTouchesChangedAfter: (touchHistory: any, touchesChangedAfter: any) => number;
    currentCentroidYOfTouchesChangedAfter: (touchHistory: any, touchesChangedAfter: any) => number;
    previousCentroidXOfTouchesChangedAfter: (touchHistory: any, touchesChangedAfter: any) => number;
    previousCentroidYOfTouchesChangedAfter: (touchHistory: any, touchesChangedAfter: any) => number;
    currentCentroidX: (touchHistory: any) => number;
    currentCentroidY: (touchHistory: any) => number;
    noCentroid: number;
};
export default TouchHistoryMath;
//# sourceMappingURL=index.d.ts.map