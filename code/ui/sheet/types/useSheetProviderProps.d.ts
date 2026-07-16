import React from 'react';
import type { TamaguiElement } from '@tamagui/core';
import type { ScrollBridge, SheetProps } from './types';
import type { SheetOpenState } from './useSheetOpenState';
export type SheetContextValue = ReturnType<typeof useSheetProviderProps> & {
    keyboardOccludedHeight: number;
    isKeyboardVisible: boolean;
    keyboardStableFrameHeight: number;
    setHasScrollView: (val: boolean) => void;
};
export declare function useSheetProviderProps(props: SheetProps, state: SheetOpenState): {
    screenSize: number;
    maxSnapPoint: string | number;
    disableRemoveScroll: boolean;
    scrollBridge: ScrollBridge;
    modal: boolean;
    open: boolean;
    setOpen: import("@tamagui/use-controllable-state").ControllableStateSetter<boolean, import("@tamagui/core").TamaguiChangeEventDetails>;
    hidden: boolean;
    contentRef: React.RefObject<TamaguiElement | null>;
    handleRef: React.RefObject<TamaguiElement | null>;
    frameSize: number;
    setFrameSize: React.Dispatch<React.SetStateAction<number>>;
    dismissOnOverlayPress: boolean;
    dismissOnSnapToBottom: boolean;
    scope: string;
    hasFit: boolean;
    position: number;
    snapPoints: (string | number)[];
    snapPointsMode: import("./types").SnapPointsMode;
    setMaxContentSize: React.Dispatch<React.SetStateAction<number>>;
    setPosition: (next: number) => void;
    setPositionImmediate: import("@tamagui/use-controllable-state").ControllableStateSetter<number, import("@tamagui/core").TamaguiChangeEventDetails>;
    onlyShowContainer: boolean;
};
//# sourceMappingURL=useSheetProviderProps.d.ts.map