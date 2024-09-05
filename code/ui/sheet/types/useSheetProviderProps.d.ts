import React from 'react';
import type { TamaguiElement } from '@tamagui/core';
import type { ScrollBridge, SheetProps } from './types';
import type { SheetOpenState } from './useSheetOpenState';
export type SheetContextValue = ReturnType<typeof useSheetProviderProps>;
export declare function useSheetProviderProps(props: SheetProps, state: SheetOpenState, options?: {
    onOverlayComponent?: (comp: any) => void;
}): {
    screenSize: number;
    maxSnapPoint: string | number;
    removeScrollEnabled: boolean | undefined;
    scrollBridge: ScrollBridge;
    modal: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    hidden: boolean;
    contentRef: React.RefObject<TamaguiElement>;
    handleRef: React.RefObject<TamaguiElement>;
    frameSize: number;
    setFrameSize: React.Dispatch<React.SetStateAction<number>>;
    dismissOnOverlayPress: boolean;
    dismissOnSnapToBottom: boolean;
    onOverlayComponent: ((comp: any) => void) | undefined;
    scope: import("@tamagui/create-context").Scope<any>;
    hasFit: boolean;
    position: number;
    snapPoints: (string | number)[];
    snapPointsMode: import("./types").SnapPointsMode;
    setMaxContentSize: React.Dispatch<React.SetStateAction<number>>;
    setPosition: (next: number) => void;
    setPositionImmediate: React.Dispatch<React.SetStateAction<number>>;
    onlyShowFrame: boolean;
};
//# sourceMappingURL=useSheetProviderProps.d.ts.map