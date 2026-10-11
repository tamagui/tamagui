import React from 'react';
import type { TamaguiElement } from '@tamagui/core';
import type { SheetProps } from './types';
import type { SheetOpenState } from './useSheetOpenState';
export declare function useSheetState(props: SheetProps, state: SheetOpenState): {
    modal: boolean;
    open: boolean;
    setOpen: import("@tamagui/use-controllable-state").ControllableStateSetter<boolean, import("@tamagui/core").TamaguiChangeEventDetails>;
    hidden: boolean;
    contentRef: React.RefObject<TamaguiElement | null>;
    handleRef: React.RefObject<TamaguiElement | null>;
    frameSize: number;
    setFrameSize: React.Dispatch<React.SetStateAction<number>>;
    maxContentSize: number;
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
};
//# sourceMappingURL=useSheetState.d.ts.map