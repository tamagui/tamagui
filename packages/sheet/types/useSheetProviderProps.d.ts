import { TamaguiElement } from '@tamagui/core';
import React from 'react';
import { ScrollBridge, SheetProps } from './types';
import { SheetOpenState } from './useSheetOpenState';
export declare function useSheetProviderProps(props: SheetProps, state: SheetOpenState): {
    modal: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    hidden: boolean;
    contentRef: React.RefObject<TamaguiElement>;
    frameSize: number;
    setFrameSize: React.Dispatch<React.SetStateAction<number>>;
    dismissOnOverlayPress: boolean;
    dismissOnSnapToBottom: boolean;
    scope: import("@tamagui/create-context").Scope<any>;
    position: number;
    snapPoints: number[];
    setPosition: (next: number) => void;
    setPositionImmediate: React.Dispatch<React.SetStateAction<number>>;
    scrollBridge: ScrollBridge;
};
export type SheetContextValue = ReturnType<typeof useSheetProviderProps>;
//# sourceMappingURL=useSheetProviderProps.d.ts.map