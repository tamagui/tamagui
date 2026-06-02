export declare function getKeyboardAdjustedSheetY({ sheetY, screenSize, isKeyboardVisible, keyboardHeight, shouldTranslate, safeAreaTop, }: {
    sheetY: number;
    screenSize: number;
    isKeyboardVisible: boolean;
    keyboardHeight: number;
    shouldTranslate: boolean;
    safeAreaTop: number;
}): number;
export declare function getSheetReleasePosition({ positions, projectedEnd, currentPosition, frameSize, dismissOnSnapToBottom, snapPointsMode, isKeyboardVisible, }: {
    positions: number[];
    projectedEnd: number;
    currentPosition: number;
    frameSize: number;
    dismissOnSnapToBottom: boolean;
    snapPointsMode: 'percent' | 'constant' | 'fit' | 'mixed';
    isKeyboardVisible: boolean;
}): number;
export declare function getKeyboardOccludedHeight({ frameSize, isKeyboardVisible, keyboardHeight, screenSize, sheetY, }: {
    frameSize: number;
    isKeyboardVisible: boolean;
    keyboardHeight: number;
    screenSize: number;
    sheetY: number | undefined;
}): number;
//# sourceMappingURL=keyboardAvoidance.d.ts.map