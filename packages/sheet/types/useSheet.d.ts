/// <reference types="react" />
export declare const useSheet: () => {
    screenSize: number;
    maxSnapPoint: number;
    removeScrollEnabled: boolean | undefined;
    scrollBridge: import("./types").ScrollBridge;
    modal: boolean;
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    hidden: boolean;
    contentRef: import("react").RefObject<import("@tamagui/web").TamaguiElement>;
    frameSize: number;
    setFrameSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    dismissOnOverlayPress: boolean;
    dismissOnSnapToBottom: boolean;
    onOverlayComponent: ((comp: any) => void) | undefined;
    scope: import("@tamagui/create-context").Scope<any>;
    position: number;
    snapPoints: number[];
    setPosition: (next: number) => void;
    setPositionImmediate: import("react").Dispatch<import("react").SetStateAction<number>>;
    onlyShowFrame: boolean;
};
//# sourceMappingURL=useSheet.d.ts.map