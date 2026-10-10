import type { ScrollBridge, SheetProps } from './types';
import type { SheetOpenState } from './useSheetOpenState';
import { useSheetState } from './useSheetState';
export type SheetContextValue = (ReturnType<typeof useSheetProviderProps> & {
    keyboardOccludedHeight: number;
    isKeyboardVisible: boolean;
    keyboardStableFrameHeight: number;
    setHasScrollView: (val: boolean) => void;
}) | (Omit<ReturnType<typeof useSheetState>, 'maxContentSize'> & {
    onlyShowContainer: true;
    scrollBridge?: undefined;
});
export declare function useSheetProviderProps(props: SheetProps, state: SheetOpenState): {
    modal: boolean;
    open: boolean;
    setOpen: import("@tamagui/use-controllable-state").ControllableStateSetter<boolean, import("@tamagui/core").TamaguiChangeEventDetails>;
    hidden: boolean;
    contentRef: import("react").RefObject<import("@tamagui/core").TamaguiElement | null>;
    handleRef: import("react").RefObject<import("@tamagui/core").TamaguiElement | null>;
    frameSize: number;
    setFrameSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    dismissOnOverlayPress: boolean;
    dismissOnSnapToBottom: boolean;
    scope: string;
    hasFit: boolean;
    position: number;
    snapPoints: (string | number)[];
    snapPointsMode: import("./types").SnapPointsMode;
    setMaxContentSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    setPosition: (next: number) => void;
    setPositionImmediate: import("@tamagui/use-controllable-state").ControllableStateSetter<number, import("@tamagui/core").TamaguiChangeEventDetails>;
    screenSize: number;
    maxSnapPoint: string | number;
    disableRemoveScroll: boolean;
    scrollBridge: ScrollBridge;
    onlyShowContainer: false;
};
//# sourceMappingURL=useSheetProviderProps.d.ts.map